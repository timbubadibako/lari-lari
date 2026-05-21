import { create } from 'zustand';
import distance from '@turf/distance';
import bearing from '@turf/bearing';
import { point, lineString } from '@turf/helpers';
import simplify from '@turf/simplify';

interface Profile {
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
  route: [number, number][]; // Full route for map rendering
  keyNodes: [number, number][]; // Only inflection points (corners) for DB
  profile: Profile | null;
  territories: Territory[];
  isHUDActive: boolean;
  
  // Actions
  setProfile: (profile: Profile) => void;
  setTerritories: (territories: Territory[]) => void;
  setHUDActive: (isActive: boolean) => void;
  startTracking: () => void;
  stopTracking: () => void;
  updateTick: () => void;
  addRoutePoint: (coord: [number, number]) => void;
}

export const useRunStore = create<RunState>((set, get) => ({
  isTracking: false,
  elapsedTime: 0,
  distance: 0,
  pace: 0,
  calories: 0,
  route: [],
  keyNodes: [],
  profile: null,
  territories: [],
  isHUDActive: false,

  setProfile: (profile) => set({ profile }),
  setTerritories: (territories) => set({ territories }),
  setHUDActive: (isActive) => set({ isHUDActive: isActive }),

  startTracking: () => set({ 
    isTracking: true, 
    elapsedTime: 0, 
    distance: 0, 
    pace: 0, 
    calories: 0, 
    route: [],
    keyNodes: [] 
  }),
  
  stopTracking: () => set({ isTracking: false }),
  
  updateTick: () => set((state) => ({
    elapsedTime: state.elapsedTime + 1,
  })),

  addRoutePoint: (newCoord) => set((state) => {
    const route = state.route;
    const keyNodes = state.keyNodes;
    const lastCoord = route[route.length - 1];
    
    let addedDistance = 0;
    let shouldAddKeyNode = false;
    let isClosedLoop = false;

    if (lastCoord) {
      // 1. Calculate Distance from last point
      const from = point(lastCoord);
      const to = point(newCoord);
      addedDistance = distance(from, to, { units: 'kilometers' });
      
      // Filter jitter ( < 2 meters)
      if (addedDistance < 0.002) return state;

      // 2. Chain-Code Angle Detection (Key Node Extraction)
      if (route.length >= 2) {
        const prevCoord = route[route.length - 2];
        const prevBearing = bearing(point(prevCoord), from);
        const currentBearing = bearing(from, to);
        
        // If angle change > 15 degrees, it's a corner
        const angleDiff = Math.abs(currentBearing - prevBearing);
        if (angleDiff > 15 && angleDiff < 345) {
          shouldAddKeyNode = true;
        }
      } else {
        shouldAddKeyNode = true;
      }

      // 3. Closed-Loop Detection (Back to Start)
      if (route.length > 10) { // Minimum 10 points to avoid instant closure
        const startPoint = point(route[0]);
        const currentPoint = point(newCoord);
        const distanceToStart = distance(currentPoint, startPoint, { units: 'kilometers' });
        
        // If within 20 meters of start, we closed the territory!
        if (distanceToStart < 0.02) {
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

    if (isClosedLoop) {
      console.log("CONGRATULATIONS! Territory Captured!");
      // Logic to trigger territory claim will go here
    }

    return {
      route: newRoute,
      keyNodes: newKeyNodes,
      distance: newDistance,
      pace: newPace,
      calories: newDistance * 60,
    };
  }),
}));
