import { create } from 'zustand';

interface RunState {
  isTracking: boolean;
  elapsedTime: number; // in seconds
  distance: number; // in km
  pace: number; // minutes per km
  calories: number;
  route: [number, number][]; // Array of [longitude, latitude]
  
  // Actions
  startTracking: () => void;
  stopTracking: () => void;
  updateTick: () => void; // Called every second when tracking
  addRoutePoint: (coord: [number, number]) => void;
}

export const useRunStore = create<RunState>((set) => ({
  isTracking: false,
  elapsedTime: 0,
  distance: 0,
  pace: 0,
  calories: 0,
  route: [],

  startTracking: () => set({ 
    isTracking: true, 
    elapsedTime: 0, 
    distance: 0, 
    pace: 0, 
    calories: 0, 
    route: [] 
  }),
  
  stopTracking: () => set({ isTracking: false }),
  
  updateTick: () => set((state) => {
    const newTime = state.elapsedTime + 1;
    // Mocking distance and calories for now (will be replaced by real GPS calculation)
    // Assuming a pace of ~6:00 min/km for demonstration (approx 2.7 meters per second)
    const newDistance = state.distance + (0.0027); 
    const newCalories = state.calories + (0.15);
    const newPace = newDistance > 0 ? (newTime / 60) / newDistance : 0;

    return {
      elapsedTime: newTime,
      distance: newDistance,
      calories: newCalories,
      pace: newPace,
    };
  }),

  addRoutePoint: (coord) => set((state) => ({
    route: [...state.route, coord]
  })),
}));
