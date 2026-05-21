-- 1. ENABLE EXTENSIONS
-- PostGIS is mandatory for geospatial data (storing routes and polygons)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. TABLES

-- Profiles table to store game-specific user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  guild_id UUID NULL, -- Future Guild integration
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Runs table to store running sessions and path geometry
CREATE TABLE IF NOT EXISTS public.runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  distance_km FLOAT DEFAULT 0,
  duration_sec INTEGER DEFAULT 0,
  calories FLOAT DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending' for open path, 'closed' for captured territory
  path_geometry GEOMETRY(LineString, 4326), -- Stores the GPS route
  captured_polygon GEOMETRY(MultiPolygon, 4326), -- Snapshot of territories gained in this run
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Territories table for district (kecamatan) boundaries and ownership
CREATE TABLE IF NOT EXISTS public.territories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  district_code TEXT, -- To map to administrative boundaries
  boundary GEOMETRY(MultiPolygon, 4326),
  leader_id UUID REFERENCES public.profiles(id),
  guild_id UUID NULL,
  last_captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.territories ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies for Runs
CREATE POLICY "Users can view their own runs" ON public.runs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own runs" ON public.runs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for Territories
CREATE POLICY "Territories are viewable by everyone" ON public.territories
  FOR SELECT USING (true);

CREATE POLICY "Users can insert territories" ON public.territories
  FOR INSERT WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Users can update their own territories" ON public.territories
  FOR UPDATE USING (auth.uid() = leader_id);

-- 4. FUNCTIONS & TRIGGERS
-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- NEW: Function to merge all territories for a specific user into a single geometry
CREATE OR REPLACE FUNCTION public.consolidate_user_territories(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  merged_geom GEOMETRY;
BEGIN
  -- 1. Create a union of all current boundaries for this user
  SELECT ST_Multi(ST_Union(boundary)) INTO merged_geom
  FROM public.territories
  WHERE leader_id = p_user_id;

  -- 2. Remove the old fragments
  DELETE FROM public.territories
  WHERE leader_id = p_user_id;

  -- 3. Insert the new consolidated boundary
  INSERT INTO public.territories (name, leader_id, boundary)
  VALUES ('Unified Sector', p_user_id, merged_geom);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
