import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RunningGoalsForm from './RunningGoalsForm';
import RunningHistoryForm from './RunningHistoryForm';
import RaceFinderForm from './RaceFinderForm';
import TrainingPlanDisplay from './TrainingPlanDisplay';

function App() {
  const [step, setStep] = useState(0);
  const [goalsData, setGoalsData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any>(null);
  const [raceFinderData, setRaceFinderData] = useState<any>(null);
  const [trainingPlan, setTrainingPlan] = useState<any>(null);

  const handleGoalsFinish = (data: any) => {
    setGoalsData(data);
    setStep(1);
  };
  const handleHistoryFinish = (data: any) => {
    setHistoryData(data.form);
    setTrainingPlan(data.trainingPlan);
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
    <div>
      { step === 0 ? <RunningGoalsForm onFinish={handleGoalsFinish} /> : "" }
      { step === 1 ? <RunningHistoryForm onFinish={handleHistoryFinish} /> : "" }
      { step === 2 ? <RaceFinderForm onFinish={handleRaceFinderFinish} /> : "" }
      { trainingPlan && (
        <TrainingPlanDisplay plan={trainingPlan} />
      )}
    </div>
  );
}

export default App
