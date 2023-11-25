import React from 'react';
import ScoreboardLayout from './ScoreboardLayout';
import './App.css';

// Initialize Firebase

const App = () => {
  // const [teamData, setTeamData] = useState({ team1Data: null, team2Data: null });

  // useEffect(() => {
  //   // Create a reference to the data you want to fetch
  //   const team1Ref = ref(database, 'path-to-team1-data');
  //   const team2Ref = ref(database, 'path-to-team2-data');

  //   // Fetch team 1 data
  //   onValue(team1Ref, (snapshot) => {
  //     setTeamData(prevData => ({ ...prevData, team1Data: snapshot.val() }));
  //   });

  //   // Fetch team 2 data
  //   onValue(team2Ref, (snapshot) => {
  //     setTeamData(prevData => ({ ...prevData, team2Data: snapshot.val() }));
  //   });
  // }, []);

  // Render your components with the fetched data
  return (
    <div>
      {/* <ScoreboardLayout team1Data={teamData.team1Data} team2Data={teamData.team2Data} /> */}
      <ScoreboardLayout />
    </div>
  );
};

export default App;
