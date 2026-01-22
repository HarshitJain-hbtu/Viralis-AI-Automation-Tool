# VIRALIS

## Frontend Task

## Backend Task

## n8n Task

## AI Task

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### 1. Infrastructure Setup
Start the support services (Redis, PostgreSQL, n8n):
```bash
cd n8n-setup
docker-compose up -d
```
*   **n8n** will run on [http://localhost:5678](http://localhost:5678)
*   **Redis** will run on port `6379`

### 2. Backend Setup
The backend is an Express server running in TypeScript.
```bash
cd Backend
npm install
npm run dev
```
*   **API Server**: [http://localhost:5000](http://localhost:5000)

### 3. Frontend Setup
The frontend is a Next.js application.
```bash
cd frontend
npm install
npm run dev
```
*   **Web App**: [http://localhost:3000](http://localhost:3000)

## Project Structure
- `frontend/`: Next.js 15 Application
- `Backend/`: Express API (TypeScript)
- `n8n-setup/`: Docker configuration for workflow automation