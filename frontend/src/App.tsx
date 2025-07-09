import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RunningGoalsForm from './RunningGoalsForm';
import RunningHistoryForm from './RunningHistoryForm';
import RaceFinderForm from './RaceFinderForm';

function App() {
  const [step, setStep] = useState(0);
  const [goalsData, setGoalsData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any>(null);
  const [raceFinderData, setRaceFinderData] = useState<any>(null);

  const handleGoalsFinish = (data: any) => {
    setGoalsData(data);
    setStep(1);
  };
  const handleHistoryFinish = (data: any) => {
    setHistoryData(data);
    if (goalsData && goalsData.findRace === 'yes') {
      setStep(2);
    } else {
      setStep(3);
    }
  };
  const handleRaceFinderFinish = (data: any) => {
    setRaceFinderData(data);
    setStep(3);
  };

  return (
    step === 0 ? <RunningGoalsForm onFinish={handleGoalsFinish} /> :
    step === 1 ? <RunningHistoryForm onFinish={handleHistoryFinish} /> :
    step === 2 ? <RaceFinderForm onFinish={handleRaceFinderFinish} /> :
    <div>
      <h2>Thank you for submitting all your information!</h2>
      <pre>{JSON.stringify({ goalsData, historyData, raceFinderData }, null, 2)}</pre>
    </div>
  );
}

export default App
