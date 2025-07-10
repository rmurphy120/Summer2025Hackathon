# Summer2025Hackathon

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