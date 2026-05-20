# Database Schema & API Contract

## 1. Database Schema (Supabase / PostgreSQL with PostGIS)

### Table: `profiles`
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  guild_id UUID NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table: `runs`
```sql
CREATE TABLE runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  distance_km FLOAT DEFAULT 0,
  duration_sec INTEGER DEFAULT 0,
  calories FLOAT DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending' for open path, 'closed' for captured territory
  path_geometry GEOMETRY(LineString, 4326), -- PostGIS GPS route
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table: `territories`
```sql
CREATE TABLE territories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  district_code TEXT,
  boundary GEOMETRY(Polygon, 4326), -- PostGIS Polygon Area
  leader_id UUID REFERENCES public.profiles(id),
  guild_id UUID NULL,
  last_captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 2. API Contract (Supabase JS Client)
Koneksi API dilakukan secara langsung via Supabase SDK. 
*   **Auth:** `supabase.auth.signUp`, `supabase.auth.signInWithPassword`
*   **GeoSpatial Queries:** Menggunakan RPC (Remote Procedure Calls) atau PostGIS functions untuk mendeteksi *intersect* antara `runs.path_geometry` dengan `territories.boundary`.
