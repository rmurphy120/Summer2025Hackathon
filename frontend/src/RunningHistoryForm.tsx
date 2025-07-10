import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Stepper, Step, StepLabel, Paper, MenuItem } from '@mui/material';
import { saveAs } from 'file-saver';

const steps = [
  'Days per Week',
  'Weekly Volume',
  'Recent Races',
  'Other Details'
];

export default function RunningHistoryForm({ onFinish }: { onFinish?: (data: any) => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    daysPerWeek: '',
    volumeType: 'distance',
    weeklyVolume: '',
    recentRaces: '',
    prs: '',
    otherDetails: '',
  });
  const [volumeUnit, setVolumeUnit] = useState<'miles' | 'km'>('miles');

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const saveUserDataToFile = (data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(blob, "UserData.json");
  };

  const postUserData = async (userData: any) => {
    const { goalsForm = {}, historyForm = {} } = userData;
    const text = `Prompt: timeline_estimator_agent. Target distance: ${goalsForm.distanceGoals}. Target pace: ${goalsForm.paceGoals}. Running history: ${JSON.stringify(historyForm)}`;
    const body = {
      appName: "RunPlanner",
      userId: "u1",
      sessionId: "s1",
      newMessage: {
        role: "user",
        parts: [{ text }]
      }
    };
    try {
      const res = await fetch("http://localhost:8000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const blob = await res.blob();
      saveAs(blob, "testPost");
    } catch (e) {
      // Optionally handle error
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("Failed to POST to backend.");
      }
    }
  };

  const handleFinish = async () => {
    // Save to localStorage as part of UserData
    const prev = JSON.parse(localStorage.getItem('UserData') || '{}');
    const newUserData = { ...prev, historyForm: form };
    localStorage.setItem('UserData', JSON.stringify(newUserData));
    saveUserDataToFile(newUserData);
    await postUserData(newUserData);
    if (onFinish) onFinish(form);
    setActiveStep((prev) => prev + 1);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Running History</Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
          <Box>
            <TextField
              label="How many days per week do you run?"
              type="number"
              value={form.daysPerWeek}
              onChange={(e) => handleChange('daysPerWeek', e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleNext} disabled={!form.daysPerWeek}>Next</Button>
          </Box>
        )}
        {activeStep === 1 && (
          <Box>
            <FormControl sx={{ mb: 2, minWidth: 120 }}>
              <FormLabel>Volume Type</FormLabel>
              <RadioGroup
                row
                value={form.volumeType}
                onChange={(e) => handleChange('volumeType', e.target.value)}
              >
                <FormControlLabel value="distance" control={<Radio />} label="Distance" />
                <FormControlLabel value="time" control={<Radio />} label="Time" />
              </RadioGroup>
            </FormControl>
            {form.volumeType === 'distance' ? (
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label={`Weekly distance (${volumeUnit})`}
                  type="number"
                  value={form.weeklyVolume}
                  onChange={(e) => handleChange('weeklyVolume', e.target.value)}
                  fullWidth
                />
                <FormControl>
                  <FormLabel>Unit</FormLabel>
                  <RadioGroup
                    row
                    value={volumeUnit}
                    onChange={(e) => setVolumeUnit(e.target.value as 'miles' | 'km')}
                  >
                    <FormControlLabel value="miles" control={<Radio />} label="Miles" />
                    <FormControlLabel value="km" control={<Radio />} label="Km" />
                  </RadioGroup>
                </FormControl>
              </Box>
            ) : (
              <TextField
                label="Weekly time (hours)"
                type="number"
                value={form.weeklyVolume}
                onChange={(e) => handleChange('weeklyVolume', e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
            <Button variant="contained" onClick={handleNext} disabled={!form.weeklyVolume}>Next</Button>
          </Box>
        )}
        {activeStep === 2 && (
          <Box>
            <TextField
              label="Recent races (distances, dates, results)"
              value={form.recentRaces}
              onChange={(e) => handleChange('recentRaces', e.target.value)}
              fullWidth
              multiline
              minRows={2}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleNext}>Next</Button>
          </Box>
        )}
        {activeStep === 3 && (
          <Box>
            <TextField
              label="Any other details about your running history?"
              value={form.otherDetails}
              onChange={(e) => handleChange('otherDetails', e.target.value)}
              fullWidth
              multiline
              minRows={2}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleFinish}>Finish</Button>
          </Box>
        )}
        {activeStep > 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>Thank you for submitting your running history!</Typography>
            {/* <pre>{JSON.stringify(form, null, 2)}</pre> */}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
