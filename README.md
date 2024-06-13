# Demonstration project of CRUD and SQL Injection while giving a lecture on Database Systems 2024 on Poznań University of Technology

## Installing project
### Databse initialization with Docker (docker is required)
```bash
cd backend
docker compose up -d
```

### Backend Python requirements (python is required)
```bash
cd backend
pip install -r requirements.txt
```

### Frontend React & TypeScript dependencies (nodejs i required with npm)
```bash
cd frontend
npm i
```

## Running project
### Backend
```bash
cd backend
python backend.py
```

### Frontend
```bash
cd frontend
npm run dev
```