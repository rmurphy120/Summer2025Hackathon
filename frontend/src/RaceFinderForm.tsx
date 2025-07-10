import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Stepper, Step, StepLabel, Paper, Slider, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

const steps = [
  'Select Location',
  'Preferred Temperature',
  'Max Travel Distance'
];

export default function RaceFinderForm({ onFinish }: { onFinish?: (data: any) => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    location: { lat: null as null | number, lng: null as null | number },
    raceDistance: '',
    tempRange: [45, 70],
    maxTravel: '',
    maxTravelUnit: 'miles',
  });
  const [mapLoaded, setMapLoaded] = useState(false);

  // Try to get user location automatically
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setForm((prev) => ({ ...prev, location: { lat: pos.coords.latitude, lng: pos.coords.longitude } }));
      });
    }
  }, []);

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Render map and allow pin drop
  useEffect(() => {
    if (mapLoaded && window.google && document.getElementById('map')) {
      // Only initialize the map once
      if (!(window as any)._raceMapInstance) {
        const map = new window.google.maps.Map(document.getElementById('map'), {
          center: form.location.lat && form.location.lng ? { lat: form.location.lat, lng: form.location.lng } : { lat: 39.5, lng: -98.35 },
          zoom: 5,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });
        (window as any)._raceMapInstance = map;
        let marker: any = null;
        if (form.location.lat && form.location.lng) {
          marker = new window.google.maps.Marker({
            position: { lat: form.location.lat, lng: form.location.lng },
            map,
            draggable: true,
          });
          marker.addListener('dragend', (e: any) => {
            setForm((prev) => ({ ...prev, location: { lat: e.latLng.lat(), lng: e.latLng.lng() } }));
          });
        }
        map.addListener('click', (e: any) => {
          if (marker) marker.setMap(null);
          marker = new window.google.maps.Marker({
            position: e.latLng,
            map,
            draggable: true,
          });
          setForm((prev) => ({ ...prev, location: { lat: e.latLng.lat(), lng: e.latLng.lng() } }));
          marker.addListener('dragend', (ev: any) => {
            setForm((prev) => ({ ...prev, location: { lat: ev.latLng.lat(), lng: ev.latLng.lng() } }));
          });
        });
      }
    }
  }, [mapLoaded, form.location.lat, form.location.lng]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleFinish = () => { if (onFinish) onFinish(form); setActiveStep((prev) => prev + 1); };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Find a Race</Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
          <Box>
            <Typography gutterBottom>Select your location:</Typography>
            <Box id="map" sx={{ width: '100%', height: 300, mb: 2, borderRadius: 2, border: '1px solid #ccc' }} />
            <Typography variant="body2" color="text.secondary" style={{ marginBottom: '16px' }}>
              {'Click on the map to drop a pin.'}
            </Typography>
            <Button variant="contained" onClick={handleNext} disabled={!form.location.lat || !form.location.lng}>Next</Button>
          </Box>
        )}
        {activeStep === 1 && (
          <Box>
            <Typography gutterBottom>Preferred Temperature Range (°F):</Typography>
            <Slider
              value={form.tempRange}
              onChange={(_, newValue) => setForm((prev) => ({ ...prev, tempRange: newValue as [number, number] }))}
              valueLabelDisplay="auto"
              min={-10}
              max={110}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <TextField
                label="Min Temp (°F)"
                type="number"
                value={form.tempRange[0]}
                onChange={e => setForm((prev) => ({ ...prev, tempRange: [Number(e.target.value), prev.tempRange[1]] }))}
                sx={{ width: 120 }}
              />
              <TextField
                label="Max Temp (°F)"
                type="number"
                value={form.tempRange[1]}
                onChange={e => setForm((prev) => ({ ...prev, tempRange: [prev.tempRange[0], Number(e.target.value)] }))}
                sx={{ width: 120 }}
              />
            </Box>
            <Button variant="contained" onClick={handleNext}>Next</Button>
          </Box>
        )}
        {activeStep === 2 && (
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={`Max travel distance (${form.maxTravelUnit})`}
                type="number"
                value={form.maxTravel}
                onChange={(e) => setForm((prev) => ({ ...prev, maxTravel: e.target.value }))}
                fullWidth
              />
              <FormControl>
                <FormLabel>Unit</FormLabel>
                <RadioGroup
                  row
                  value={form.maxTravelUnit}
                  onChange={(e) => setForm((prev) => ({ ...prev, maxTravelUnit: e.target.value as 'miles' | 'km' }))}
                >
                  <FormControlLabel value="miles" control={<Radio />} label="Miles" />
                  <FormControlLabel value="km" control={<Radio />} label="Km" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Button variant="contained" onClick={handleFinish} disabled={!form.maxTravel}>Finish</Button>
          </Box>
        )}
        {activeStep > 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>Thank you for submitting your race preferences!</Typography>
            {/* <pre>{JSON.stringify(form, null, 2)}</pre> */}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
