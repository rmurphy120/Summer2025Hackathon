import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Stepper, Step, StepLabel, Paper } from '@mui/material';
import { saveAs } from 'file-saver';

const steps = [
  'Distance Goals',
  'Pace Goals',
  'Find a Race?'
];

export default function RunningGoalsForm({ onFinish }: { onFinish?: (data: any) => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    runningGoals: '',
    distanceGoals: '',
    paceGoals: '',
    findRace: 'yes',
  });
  const [distanceUnit, setDistanceUnit] = useState<'miles' | 'km'>('miles');
  const [paceUnit, setPaceUnit] = useState<'min/mile' | 'min/km'>('min/mile');

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleFinish = () => {
    // Save to localStorage as part of UserData
    const prev = JSON.parse(localStorage.getItem('UserData') || '{}');
    const newUserData = { ...prev, goalsForm: form };
    localStorage.setItem('UserData', JSON.stringify(newUserData));
    if (onFinish) onFinish(form);
    setActiveStep((prev) => prev + 1);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Running Questionnaire</Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={`Distance goal (${distanceUnit})`}
                type="number"
                value={form.distanceGoals}
                onChange={(e) => handleChange('distanceGoals', e.target.value)}
                fullWidth
              />
              <FormControl>
                <FormLabel>Unit</FormLabel>
                <RadioGroup
                  row
                  value={distanceUnit}
                  onChange={(e) => setDistanceUnit(e.target.value as 'miles' | 'km')}
                >
                  <FormControlLabel value="miles" control={<Radio />} label="Miles" />
                  <FormControlLabel value="km" control={<Radio />} label="Km" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Button variant="contained" onClick={handleNext} disabled={!form.distanceGoals}>Next</Button>
          </Box>
        )}
        {activeStep === 1 && (
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={`Pace goal (${paceUnit})`}
                value={form.paceGoals}
                onChange={(e) => handleChange('paceGoals', e.target.value)}
                fullWidth
              />
              <FormControl>
                <FormLabel>Unit</FormLabel>
                <RadioGroup
                  row
                  value={paceUnit}
                  onChange={(e) => setPaceUnit(e.target.value as 'min/mile' | 'min/km')}
                >
                  <FormControlLabel value="min/mile" control={<Radio />} label="min/mile" />
                  <FormControlLabel value="min/km" control={<Radio />} label="min/km" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Button variant="contained" onClick={handleNext} disabled={!form.paceGoals}>Next</Button>
          </Box>
        )}
        {activeStep === 2 && (
          <Box>
            <FormControl sx={{ mb: 2 }}>
              <FormLabel>Would you like to find a race?</FormLabel>
              <RadioGroup
                row
                value={form.findRace}
                onChange={(e) => handleChange('findRace', e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
            <Button variant="contained" onClick={handleFinish}>Finish</Button>
          </Box>
        )}
        {activeStep > 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>Thank you for submitting your goals!</Typography>
            {/* <pre>{JSON.stringify(form, null, 2)}</pre> */}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
