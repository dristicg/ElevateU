(The file `c:\Users\drish\Desktop\All in one file\ElevateYou\README.md` exists, but is empty)
# ElevateYou

ElevateYou is a small full-stack resume analysis application. The client (React + Vite) provides a simple UI where users can paste or upload resume text, and the server (Express) analyzes the resume using a local Ollama model or OpenAI (cloud) and returns structured feedback (summary, strengths, improvements, ATS keywords).

This README covers setup, running locally (Windows PowerShell), available endpoints, environment variables, and basic troubleshooting.

## Project structure

- `/client` — React front-end (Vite). Routes and pages live under `src/`.
- `/server` — Express backend, AI integration, file upload handling, and API routes.

## Features

- Paste resume text or upload a PDF and receive structured feedback.
- Uses Ollama (local) or OpenAI (cloud) as AI providers (configured via env).
- Simple example UI for testing analysis at `/` or `/analyze`.

## Prerequisites

- Node.js (18+ recommended)
- npm
- (Optional) Ollama running locally on port 11434 if you want to use the local model

## Environment variables

Create a `.env` file in the `/server` folder (the repo contains `.env` for development). Important variables:

SERVER (.env):

- `PORT` — port for the backend (e.g. 5000)
- `DATABASE_URL` — Postgres connection (optional for DB features)
- `JWT_SECRET` — secret used for auth tokens
- `AI_PROVIDER` — `ollama` or `openai` (switches provider used in `aiFeedback.js`)
- `OPENAI_API_KEY` — required if `AI_PROVIDER=openai`
- `OLLAMA_URL` — e.g. `http://localhost:11434` (used if `AI_PROVIDER=ollama`)

Security note: Do NOT commit `.env` files containing secrets to your git repository. Use `.env.example` to show expected keys and add `.env` to `.gitignore`.

## Install dependencies

Open two PowerShell windows (one for server, one for client). From the repo root:

Server:

```powershell
cd "C:\Users\drish\Desktop\All in one file\ElevateYou\server"
npm install
```

Client:

```powershell
cd "C:\Users\drish\Desktop\All in one file\ElevateYou\client"
npm install
```

## Run locally (development)

Start the backend (server):

```powershell
cd "C:\Users\drish\Desktop\All in one file\ElevateYou\server"
npm run dev
```

Start the frontend (client):

```powershell
cd "C:\Users\drish\Desktop\All in one file\ElevateYou\client"
npm run dev
```

Vite will print the dev server URL (usually `http://localhost:5173` or next available port). The app maps the Resume Analyzer to the root path `/` (and `/analyze`). Open the URL in your browser to use the UI.

## API endpoints

- POST `/api/analyze-resume` — Accepts `{ resumeText: string }` in the JSON body and returns JSON feedback.

Example (PowerShell):

```powershell
$body = @{ resumeText = "John Doe\nExperienced software engineer with Node.js, React, SQL..." } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/analyze-resume -ContentType 'application/json' -Body $body
```

Server upload route (used by the Express file upload flow):

- POST `/upload-resume` — multipart form upload with `resume` file field. Returns extracted text and feedback.

## Frontend usage

- Open the app root (e.g., `http://localhost:5173/`). The Resume Analyzer page includes a textarea and "Analyze Resume" button. Paste resume text and click to analyze.

The client calls the server endpoint at `/api/analyze-resume`. Make sure your backend server is running and the client dev server proxies or the client is configured to reach the backend URL.

## AI provider configuration

- The backend uses `AI_PROVIDER` in `server/.env` to choose between Ollama (local) and OpenAI (cloud).
- Ollama: make sure a compatible Ollama model is running and reachable (default `http://localhost:11434`).
- OpenAI: set `OPENAI_API_KEY` and `AI_PROVIDER=openai` in `.env`.

Example `.env` (development):

```
PORT=5000
AI_PROVIDER=ollama
# AI_PROVIDER=openai
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
OLLAMA_URL=http://localhost:11434
```

## Troubleshooting

- Blank page or nothing showing:
	- Confirm the client dev server is running and check the terminal for errors and which port it's using.
	- Look at the browser console for runtime errors (missing default export, routing issues). The project has a `ResumeAnalyzer` default export and an index route by default.

- Duplicate export or build errors:
	- Make sure `client/src/pages/ResumeAnalyzer.jsx` only exports one default React component and does not duplicate named exports with the same name.

- Backend errors when calling AI:
	- Verify the `AI_PROVIDER` and corresponding configuration (`OPENAI_API_KEY` for OpenAI or Ollama running locally).
	- For local Ollama, ensure the Ollama daemon is up and reachable at `OLLAMA_URL`.

## Tests (quick)

There are no automated test suites included by default. For a quick manual test, run the server and client and use the UI or the `Invoke-RestMethod` snippet above to verify the `/api/analyze-resume` endpoint returns the expected JSON shape:

- `summary` (string)
- `strengths` (array)
- `improvements` (array)
- `atsKeywords` (array)

## Recommended next steps

- Move AI keys and provider configuration to a secure secrets manager for production.
- Add automated tests for server endpoints (Jest / Supertest) and small unit tests for parsing logic.
- Add `.env.example` showing required keys (without real secrets) and add `.env` to `.gitignore`.

## Contributing

Feel free to open issues or PRs. Keep environment secrets out of commits.

## License

MIT

