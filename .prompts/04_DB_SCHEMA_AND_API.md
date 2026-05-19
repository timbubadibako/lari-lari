# Database Schema & API Contract

## 1. Database Schema (Supabase / PostgreSQL)

### Table: `users`
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    display_name VARCHAR(50),
    xp INT DEFAULT 0,
    current_level INT DEFAULT 1
);
```

### Table: `territories`
```sql
CREATE TABLE territories (
    id SERIAL PRIMARY KEY,
    grid_id VARCHAR(50) UNIQUE,
    leader_id UUID REFERENCES users(id),
    last_captured_at TIMESTAMP
);
```

## 2. API Contract (Swagger / Rest Spec)
POST /api/v1/run/sync
Payload: { run_id: text, coordinates: [[lat, lng], ...] }
Response: 200 OK - { xp_gained: int, area_captured: float }
