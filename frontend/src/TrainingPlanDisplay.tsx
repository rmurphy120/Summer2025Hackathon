import React from 'react';
import { Box, Paper, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';

interface TrainingDay {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
}

interface TrainingPlanSummary {
  overallGoal: string;
  timeline: string;
  additionalInfo: string;
}

interface TrainingPlanData {
  trainingPlan: TrainingDay[];
  summary: TrainingPlanSummary;
}

export default function TrainingPlanDisplay({ plan }: { plan: TrainingPlanData }) {
  const { summary, trainingPlan } = plan;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Training Plan Summary</Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <strong>Goal:</strong> {summary.overallGoal}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <strong>Timeline:</strong> {summary.timeline}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {summary.additionalInfo}
        </Typography>
      </Paper>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Plan Details</Typography>
        <List>
          {trainingPlan.map((day, idx) => (
            <React.Fragment key={idx}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {day.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {day.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {day.startDate} &nbsp;|&nbsp; {day.startTime} - {day.endTime}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {idx < trainingPlan.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}