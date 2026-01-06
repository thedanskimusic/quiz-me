# Quiz-Me: High-Scale Concurrent Quiz System

## 1. Project Overview
A highly scalable quiz platform designed to support **1 million concurrent students** with real-time feedback and high-write availability. This prototype focuses on the "Gradeo" stack and a high-agency demo experience.

## 2. Core Architecture
- **Ingestion Layer:** Next.js (Cloud Run) + GCP Pub/Sub for asynchronous write handling.
- **Processing Layer:** NestJS (Cloud Run) as the "Brain" to process quiz results.
- **Data Layer:** Google Cloud Spanner (Global Consistency) or Firestore (Scalability).
- **Real-time Sync:** Firebase Realtime Database / Socket.io for "Instant Save" UI feedback.
- **Observability:** BigQuery for analytics and Cloud Monitoring for infra health.

## 3. Tech Stack
| Component | Technology |
| :--- | :--- |
| **Monorepo Management** | Turborepo (planned) or simple multi-folder |
| **Frontend** | Next.js (App Router), Tailwind CSS |
| **API (Brain)** | NestJS |
| **Authentication** | Firebase Auth / Custom JWT with School/Teacher Claims |
| **Queue/Ingestion** | GCP Pub/Sub |
| **State Sync** | Firebase Realtime DB / Socket.io |
| **Infrastructure** | GCP Cloud Run, Docker |

## 4. Folder Structure
```
gradeo-prototype/
├── apps/
│   ├── web (Next.js - Student & Admin Dash)
│   └── api (NestJS - The "Brain")
├── packages/
│   └── types (Shared TS interfaces for 'QuizResponse')
└── docker-compose.yaml (To spin up Postgres/Redis later)
```

## 5. Implementation Roadmap

### Phase 1: Prototype (High-Agency Demo)
- [ ] **Next.js "Zen" Interface:** Build a clean, distraction-free student portal.
- [ ] **Simulated Network Latency:** A toggle to demonstrate "Syncing..." vs "Saved" states.
- [ ] **Debounced Answer Submissions:** Client-side logic for high-frequency input.
- [ ] **Shared Types:** Define `QuizResponse` and common interfaces.

### Phase 2: Ingestion & Backend
- [ ] Initialize NestJS "Brain" API.
- [ ] Set up GCP Pub/Sub integration.
- [ ] Implement `POST /api/quiz/submit` in Next.js to push to the backend.

### Phase 3: Real-time Feedback Loop
- [ ] Integrate Firebase/Socket.io for state sync.
- [ ] Update Worker/API to update sync status documents.

### Phase 4: Multi-Tenancy & Scaling
- [ ] Implement Auth with Custom Claims (School ID, Teacher ID).
- [ ] Load testing for 1M concurrent connections.

## 6. Development Rules
- All `gcloud builds submit` commands must be executed as single-line commands.
- Prioritize asynchronous operations for all student-facing writes.
- Use Tailwind CSS for all UI components.

