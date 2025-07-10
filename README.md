# Summer2025Hackathon
App to help people give personalized training plans for running. This is done by the user entering running goals and history, then the app can find races that fit the timeline the user needs to train and are close to the user. Then the app gives a day-by-day training plan which includes details about each workout.


## Run backend
add in backend/.env
GOOGLE_API_KEY=
FIRECRAWL_API_KEY=

cd backend
python -m venv venv
pip install -r requirements.txt

## Run frontend
add in frontend/.env 
VITE_GOOGLE_MAPS_API_KEY=

cd frontend
npm install
npm run dev
