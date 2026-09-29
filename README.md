<div align="center">

# 🛡️ GeoZone

### A real-time collaborative workspace with an AI-powered npm supply chain security assistant

[![Status](https://img.shields.io/badge/status-active%20development-brightgreen?style=flat-square)](https://github.com/yourusername/collabai)
[![Backend](https://img.shields.io/badge/backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/frontend-React-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Database](https://img.shields.io/badge/database-PostgreSQL-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Cache](https://img.shields.io/badge/cache-Redis-DC382D?style=flat-square&logo=redis)](https://redis.io/)
[![Auth](https://img.shields.io/badge/auth-JWT%20%2B%20HttpOnly%20Cookies-orange?style=flat-square)](https://jwt.io/)

</div>

---

## What Is CollabAI?

CollabAI is a **Collaborative workspace** built with a security-first mindset. Teams can organize work, manage projects, and collaborate in real time. The AI layer is purpose-built for a real-world problem: **detecting and alerting on npm registry supply chain attacks**.

Supply chain attacks like [event-stream](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident), [ua-parser-js](https://github.com/advisories/GHSA-pjwm-rvh2-c87w), and [node-ipc](https://snyk.io/blog/peacenotwar-malicious-npm-node-ipc-package-vulnerability/) have compromised millions of developer environments. CollabAI's AI assistant monitors the npm registry in context, surfaces anomalies, and helps development teams act fast.

> **This is not a toy project.** It is a production-architecture application built to demonstrate full-stack depth, real-time systems, secure auth design, and applied AI — all in a single coherent product.

---

## Core Features

| Feature                                         | Status         |
| ----------------------------------------------- | -------------- |
| JWT Authentication with refresh token rotation  | ✅ Complete    |
| HttpOnly cookie-based session management        | ✅ Complete    |
| Multi-role PostgreSQL with Row Level Security   | ✅ Complete    |
| Docker Compose orchestration (app + db + cache) | ✅ Complete    |
| Redis token blacklist (logout/invalidation)     | ✅ Complete    |
| Workspace & workspace member management         | 🔧 In Progress |
| Real-time collaboration via WebSockets          | 🔧 In Progress |
| AI workspace search assistant                   | 🗓️ Planned     |
| npm supply chain anomaly detection & alerts     | 🗓️ Planned     |

---

## Architecture Overview

```
collabai/
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── api/                # Axios client layer
│   │   ├── assests/ # public images
│   │   ├── components/     # shared Shadcn UI components
│   │   ├── context/ # react context provider (Auth, TanStack Query, etc....)
│   │   ├── features/ # business domain
│   │   │    ├── auth/ # auth domain
│   │   │          └──components/
│   │   │          └── hooks/
│   │   │          └──types/
│   │   │    ├── workspace/ # workspace domain
│   │   │          └── components/
│   │   │          └──hooks/
│   │   │          └──types/
│   │   ├── lib/ # tailwind css merge
│   │   ├── pages/ # App screens ( pages )
│   └── Dockerfile
│
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── api/            # Route handlers (HTTP boundary)
│   │   ├── core/
│   │           └── config.py  # pydantic settings
│   │   ├── helpers/
│   │           └── helper.py  # alembic helper function
│   │   ├── infratructure/
│   │           └── redis/  # redis cache
│   │           └── postgres/  # postgres db
│   │   ├── middleware/ # jwt middleware
│   │   ├── modules/             # modular services
│   │            └── auth/
│   │            └── health/
│   │            └── models/  # Base SQLAlchemy ORM
│   │            └── task/
│   │            └── user/
│   │            └── workspace/
│   ├── alembic/                # Database migrations
│   ├── entrypoint.sh           # pg_isready readiness check + migration runner
│   └── Dockerfile
│
├── secrets/                    # Docker secrets (never committed)
├── docker-compose.yml
└── README.md
```

### System Diagram

```
                        ┌─────────────────────────┐
                        │         Client          │
                        │     React (Vite)    │
                        └────────────┬────────────┘
                                     │ HTTPS + HttpOnly Cookies
                                     │
                        ┌────────────▼────────────┐
                        │      FastAPI Backend    │
                        │  (Modular Monolothic)   │
                        │                         │
                        │  ┌─────────────────────┐│
                        │  │    ROUTER LAYER      ││  ← HTTP boundary
                        │  │                     ││     Validates requests
                        │  │  • auth_router      ││     Catches Python errors
                        │  │  • workspace_router ││     Returns HTTPException
                        │  │  • members_router   ││     Parses Pydantic schemas
                        │  └──────────┬──────────┘│
                        │             │            │
                        │  ┌──────────▼──────────┐│
                        │  │    SERVICE LAYER     ││  ← Business logic
                        │  │                     ││     Orchestrates operations
                        │  │  • auth_service     ││     Calls Redis + DB
                        │  │  • workspace_service││     Token rotation logic
                        │  │  • member_service   ││     Raises Python builtins
                        │  └──────────┬──────────┘│
                        │             │            │
                        │  ┌──────────▼──────────┐│
                        │  │     DATA LAYER       ││  ← Persistence only
                        │  │                     ││     SQLAlchemy ORM
                        │  │  • user_data        ││     Async sessions
                        │  │  • workspace_data   ││     No HTTP concerns
                        │  │  • token_data       ││     RLS enforced here
                        │  └──────────┬──────────┘│
                        │             │            │
                        └─────────────┼────────────┘
                 ┌───────────────┬────┘
                 │               │
    ┌────────────▼──────┐  ┌─────▼──────────────────┐
    │    PostgreSQL     │  │        Redis            │
    │                   │  │                         │
    │  RLS per user     │  │  • Token blacklist      │
    │                   │  │  • Session cache        │
    │  Roles:           │  └─────────────────────────┘
    │  • myapp_owner    │
    │    (migrations)   │
    │  • fastapi_user   │
    │    (app queries)  │
    │  • authenticated  │
    │    (RLS context)  │
    └───────────────────┘
```

---

## Security Design

Security is a first class concern in CollabAI, by design, because the product itself is security tooling.

### Authentication & Session Management

- **JWT access tokens** (short-lived) + **refresh tokens** (long-lived, rotated on every use)
- Refresh tokens stored in **HttpOnly, Secure, SameSite=Strict cookies** — never accessible to JavaScript
- Token rotation on refresh; old tokens immediately written to the **Redis blacklist**
- Two separate SQLAlchemy engine instances: one scoped to `fastapi_user` (RLS-enforced app queries), one scoped to `myapp_owner` ( Database Migrations)

### Database Security

- **Row Level Security (RLS)** enforced at the PostgreSQL level, not just application logic
- Per request user context injected via `SET LOCAL app.current_user_id = '<uuid>'` inside each transaction
- Least privilege role design: the application user (`fastapi_user`) cannot run DDL or see rows it doesn't own

### Secrets Management

- All sensitive values (DB passwords, JWT secret) managed via **Docker secrets** mounted at runtime
- No secrets in `.env` files, no secrets in version control.

---

## Technical Highlights

**Why these are worth calling out:**

### Layered Error Architecture

The data layer raises standard Python built-ins (`ValueError`, `PermissionError`). The router layer is the only place that translates those into `HTTPException`. This keeps business logic clean and testable independently of FastAPI.

### Async First SQLAlchemy

The entire database layer uses `AsyncSession` with `async_sessionmaker`. No sync blocking in the event loop.

### Alembic Migration Workflow

Migrations run inside a Docker container with a strict `downgrade → upgrade` workflow. The `entrypoint.sh` uses `pg_isready` with retry limits to handle startup race conditions, with a sleep-loop fallback for debugging when migrations fail.

### Docker Compose Orchestration

- Named volumes for PostgreSQL data persistence
- Service healthchecks with `depends_on: condition: service_healthy`
- RedisInsight service for cache inspection during development
- Bind mounts for hot-reload in development vs. `COPY` in production Dockerfiles

---

## The AI Roadmap

CollabAI's AI layer is being built in two phases:

### Phase 1 — Workspace Search Assistant

A natural language interface to query workspace content: tasks, documents, members, activity history. Built on top of the existing workspace data model with a retrieval augmented generation (RAG) approach.

### Phase 2 — npm Supply Chain Attack Detection

The flagship feature. The assistant will:

- Monitor the npm registry for newly published or updated packages used in a workspace's tracked projects
- Surface behavioral anomalies: sudden maintainer changes, new install scripts, unexpected dependency additions, version squatting
- Cross reference against known attack signatures (e.g., patterns from `event-stream`, `ua-parser-js`, `node-ipc`)
- Alert workspace members with actionable context, not just "this package is flagged" but _why_ and _what to do_

This is a real problem that affects real development teams. CollabAI is being built to solve it.

---

### Environment

| Variable                      | Description                        |
| ----------------------------- | ---------------------------------- |
| `DATABASE_URL`                | PostgreSQL connection string       |
| `REDIS_URL`                   | Redis connection string            |
| `JWT_SECRET`                  | signing secret (via Docker secret) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Default: 15                        |
| `REFRESH_TOKEN_EXPIRE_DAYS`   | Default: 7                         |

---

## API Reference

Interactive docs are auto-generated by FastAPI and available at:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

| Method | Endpoint                   | Description                                |
| ------ | -------------------------- | ------------------------------------------ |
| `POST` | `/auth/register`           | Register a new user                        |
| `POST` | `/auth/login`              | Login, receive access + refresh tokens     |
| `POST` | `/auth/refresh`            | Rotate refresh token, get new access token |
| `POST` | `/auth/logout`             | Blacklist current tokens                   |
| `GET`  | `/workspaces`              | List user's workspaces                     |
| `POST` | `/workspaces`              | Create a workspace                         |
| `GET`  | `/workspaces/{id}/members` | List workspace members                     |

---

## Why CollabAI?

Most "full stack projects" on GitHub are tutorial CRUD apps with thin auth bolted on. CollabAI is different:

- The **auth system** handles token rotation, blacklisting, and HttpOnly cookies the way a production app should
- The **database design** uses real PostgreSQL features — RLS, multiple roles, least-privilege access
- The **infrastructure** is fully containerized with proper secrets management, not just a `docker run postgres`
- The **product vision** is grounded in a real security problem that ships code to do

This project exists because I wanted to build something I'd be proud to ship, not just proud to show.

---

## Author

**Emmanuel Imarhiagbe**
Full Stack Engineer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/emmanuel-imarhiagbe)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/OsaroImarhiagbe)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-FF4500?style=flat-square)](https://www.emmanuelimarhiagbe.com)

---

<div align="center">

_Built with intention. Engineered for production. Solving a real problem._

</div>
