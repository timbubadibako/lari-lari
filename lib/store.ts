import { create } from 'zustand';
import distance from '@turf/distance';
import bearing from '@turf/bearing';
import { point, polygon, lineString } from '@turf/helpers';
import simplify from '@turf/simplify';
import { supabase } from './supabase';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  level: number;
  xp: number;
  territory_count: number;
}

interface Territory {
  id: string;
  name: string;
  boundary: any; 
  leader_id: string | null;
}

interface RunState {
  isTracking: boolean;
  elapsedTime: number; 
  distance: number; 
  pace: number; 
  calories: number;
  sessionXP: number; // XP gained in current session
  route: [number, number][]; 
  keyNodes: [number, number][]; 
  profile: Profile | null;
  territories: Territory[];
  isHUDActive: boolean;
  isSimulating: boolean;
  
  // Actions
  setProfile: (profile: Profile) => void;
  setTerritories: (territories: Territory[]) => void;
  setHUDActive: (isActive: boolean) => void;
  setSimulating: (isSimulating: boolean) => void;
  startTracking: () => void;
  stopTracking: () => Promise<void>;
  updateTick: () => void;
  addRoutePoint: (coord: [number, number]) => void;
  captureTerritory: () => Promise<void>;
}

export const useRunStore = create<RunState>((set, get) => ({
  isTracking: false,
  elapsedTime: 0,
  distance: 0,
  pace: 0,
  calories: 0,
  sessionXP: 0,
  route: [],
  keyNodes: [],
  profile: null,
  territories: [],
  isHUDActive: false,
  isSimulating: false,

  setProfile: (profile) => set({ profile }),
  setTerritories: (territories) => set({ territories }),
  setHUDActive: (isActive) => set({ isHUDActive: isActive }),
  setSimulating: (isSimulating) => set({ isSimulating }),

  startTracking: () => set({ 
    isTracking: true, 
    elapsedTime: 0, 
    distance: 0, 
    pace: 0, 
    calories: 0, 
    sessionXP: 0,
    route: [],
    keyNodes: [] 
  }),
  
  stopTracking: async () => {
    const { route, distance, elapsedTime, calories, profile, isTracking, sessionXP } = get();
    if (!isTracking) return;
    
    set({ isTracking: false, isSimulating: false });

    // Save run session to Supabase
    if (profile && route.length > 2) {
      try {
        const pathLine = lineString(route);
        await supabase.from('runs').insert({
          user_id: profile.id,
          distance_km: distance,
          duration_sec: elapsedTime,
          calories: calories,
          path_geometry: pathLine.geometry
        });

        // Award Final Distance XP
        const distXP = Math.floor(distance * 50); 
        const totalSessionXP = sessionXP + distXP;
        
        await supabase.from('profiles').update({ 
           xp: (profile.xp || 0) + distXP 
        }).eq('id', profile.id);
        
        set({ sessionXP: totalSessionXP });
      } catch (e) {
        console.error("Failed to save run:", e);
      }
    }
  },
  
  updateTick: () => set((state) => ({
    elapsedTime: state.elapsedTime + 1,
  })),

  captureTerritory: async () => {
    const { keyNodes, profile } = get();
    if (!profile || keyNodes.length < 3) return;

    try {
      const closedCoords = [...keyNodes, keyNodes[0]];
      let capturedPoly = polygon([closedCoords]);
      capturedPoly = simplify(capturedPoly, { tolerance: 0.00001, highQuality: true });

      const { error: insertError } = await supabase
        .from('territories')
        .insert({
          name: 'New Sector',
          leader_id: profile.id,
          boundary: capturedPoly.geometry
        });

      if (insertError) throw insertError;

      await supabase.rpc('consolidate_user_territories', { p_user_id: profile.id });

      const { data: refreshed } = await supabase
        .from('territories')
        .select('id, name, boundary, leader_id');
      
      if (refreshed) {
        set({ 
          territories: refreshed.map(t => ({
            ...t,
            boundary: typeof t.boundary === 'string' ? JSON.parse(t.boundary) : t.boundary
          }))
        });
      }

      // Add XP to session and Update DB
      const bonusXP = 500;
      set((state) => ({
        route: [],
        keyNodes: [],
        sessionXP: state.sessionXP + bonusXP,
        profile: state.profile ? {
          ...state.profile,
          territory_count: state.territories.filter(x => x.leader_id === profile.id).length,
          xp: (state.profile.xp || 0) + bonusXP
        } : null
      }));
      
      await supabase.from('profiles').update({ xp: get().profile?.xp }).eq('id', profile.id);

    } catch (e) {
      console.error("Capture failed:", e);
    }
  },

  addRoutePoint: (newCoord) => {
    const state = get();
    const route = state.route;
    const keyNodes = state.keyNodes;
    const lastCoord = route[route.length - 1];
    
    let addedDistance = 0;
    let shouldAddKeyNode = false;
    let isClosedLoop = false;

    if (lastCoord) {
      const from = point(lastCoord);
      const to = point(newCoord);
      addedDistance = distance(from, to, { units: 'kilometers' });
      
      if (addedDistance < 0.002) return;

      if (route.length >= 2) {
        const prevCoord = route[route.length - 2];
        const prevBearing = bearing(point(prevCoord), from);
        const currentBearing = bearing(from, to);
        const angleDiff = Math.abs(currentBearing - prevBearing);
        if (angleDiff > 15 && angleDiff < 345) {
          shouldAddKeyNode = true;
        }
      } else {
        shouldAddKeyNode = true;
      }

      if (route.length > 5) { 
        const startPoint = point(route[0]);
        const currentPoint = point(newCoord);
        const distanceToStart = distance(currentPoint, startPoint, { units: 'kilometers' });
        if (distanceToStart < 0.035) {
          isClosedLoop = true;
        }
      }
    } else {
      shouldAddKeyNode = true;
    }

    const newDistance = state.distance + addedDistance;
    const newPace = newDistance > 0 ? (state.elapsedTime / 60) / newDistance : 0;
    const newRoute = [...route, newCoord];
    const newKeyNodes = shouldAddKeyNode ? [...keyNodes, newCoord] : keyNodes;

    set({
      route: newRoute,
      keyNodes: newKeyNodes,
      distance: newDistance,
      pace: newPace,
      calories: newDistance * 60,
    });

    if (isClosedLoop) {
      get().captureTerritory();
    }
  },
}));
