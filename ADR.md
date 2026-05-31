# Architecture Decision Records (ADRs)

## ADR 1: Adoption of FastAPI for Predictive Maintenance
**Status:** Accepted
**Context:** MoveMate Pro is expanding from a booking platform to include a Predictive Maintenance (PdM) component for its fleet of moving trucks. The system requires real-time telemetry ingestion, machine learning inference, and asynchronous processing.
**Decision:** We chose FastAPI (Python) for the `fleet-backend` service.
**Consequences:** 
- Enables rapid development of REST endpoints and WebSockets.
- Native integration with Python ML ecosystems (scikit-learn, LangChain).
- Auto-generates OpenAPI specifications to satisfy documentation requirements.

## ADR 2: Segregation of Concerns (Dual-Stack)
**Status:** Accepted
**Context:** Need to integrate PdM features without disrupting the existing Next.js/Firebase consumer booking app.
**Decision:** We will maintain a microservices-style architecture. Next.js handles all frontend and booking logic. FastAPI handles all fleet telemetry and ML logic. They communicate via WebSockets and HTTP.
**Consequences:**
- Zero risk to existing consumer-facing features.
- Different deployment pipelines (Vercel for Next.js, Docker/AWS for FastAPI).

## ADR 3: TimescaleDB for Telemetry
**Status:** Proposed (Currently using SQLite/In-memory mock for local dev)
**Context:** Truck telematics generates massive amounts of time-series data (MQTT streams).
**Decision:** PostgreSQL + TimescaleDB extension will be used in production to store sensor data.
**Consequences:**
- Optimized querying for time-based aggregations.
- Requires Dockerized deployment.
