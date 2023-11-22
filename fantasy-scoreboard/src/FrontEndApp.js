import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import ScoreboardLayout from './ScoreboardLayout';
import './App.css';

// Your web app's Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  databaseURL: "your-database-url",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const App = () => {
  const [teamData, setTeamData] = useState({ team1Data: null, team2Data: null });

  useEffect(() => {
    // Create a reference to the data you want to fetch
    const team1Ref = ref(database, 'path-to-team1-data');
    const team2Ref = ref(database, 'path-to-team2-data');

    // Fetch team 1 data
    onValue(team1Ref, (snapshot) => {
      setTeamData(prevData => ({ ...prevData, team1Data: snapshot.val() }));
    });

    // Fetch team 2 data
    onValue(team2Ref, (snapshot) => {
      setTeamData(prevData => ({ ...prevData, team2Data: snapshot.val() }));
    });
  }, []);

  // Render your components with the fetched data
  return (
    <div>
      <ScoreboardLayout team1Data={teamData.team1Data} team2Data={teamData.team2Data} />
      {/* ... */}
    </div>
  );
};

export default App;
