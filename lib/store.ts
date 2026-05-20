import { create } from 'zustand';
import distance from '@turf/distance';
import { point } from '@turf/helpers';

interface Profile {
  username: string;
  display_name: string;
  level: number;
  xp: number;
  territory_count: number;
}

interface RunState {
  isTracking: boolean;
  elapsedTime: number; 
  distance: number; 
  pace: number; 
  calories: number;
  route: [number, number][]; 
  profile: Profile | null;
  
  // Actions
  setProfile: (profile: Profile) => void;
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
  profile: null,

  setProfile: (profile) => set({ profile }),

  startTracking: () => set({ 
    isTracking: true, 
    elapsedTime: 0, 
    distance: 0, 
    pace: 0, 
    calories: 0, 
    route: [] 
  }),
  
  stopTracking: () => set({ isTracking: false }),
  
  updateTick: () => set((state) => ({
    elapsedTime: state.elapsedTime + 1,
  })),

  addRoutePoint: (newCoord) => set((state) => {
    const lastCoord = state.route[state.route.length - 1];
    let addedDistance = 0;

    if (lastCoord) {
      // Calculate real distance using Turf (in kilometers)
      const from = point(lastCoord);
      const to = point(newCoord);
      addedDistance = distance(from, to, { units: 'kilometers' });
      
      // Ignore jitter (movements less than 2 meters)
      if (addedDistance < 0.002) addedDistance = 0;
    }

    const newDistance = state.distance + addedDistance;
    const newPace = newDistance > 0 ? (state.elapsedTime / 60) / newDistance : 0;
    // Roughly 60 kcal per km
    const newCalories = newDistance * 60;

    return {
      route: [...state.route, newCoord],
      distance: newDistance,
      pace: newPace,
      calories: newCalories,
    };
  }),
}));
