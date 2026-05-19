import { View, Image, Pressable, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Map, MapUserLocation, MapRoute, useMap } from '@/components/ui/map';
import { Text } from '@/components/ui/text';
import { Play, Bell, Square, Pause, Home, History, Trophy, User, Target, Star, Shield, Map as MapIcon, ChevronDown, RotateCcw } from 'lucide-react-native';
import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { useRunStore } from '@/lib/store';
import { Link, useRouter } from 'expo-router';

// Helper to format time (e.g., 00:00:00)
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatPace = (paceMinutes: number) => {
  if (paceMinutes === 0 || !isFinite(paceMinutes)) return "00'00\"";
  const m = Math.floor(paceMinutes);
  const s = Math.floor((paceMinutes - m) * 60);
  return `${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`;
};

// Neobrutalism Button Component for Dynamic Widget
const WidgetButton = ({ icon, isActive, onPress, color = "bg-white" }: any) => (
  <View className="w-11 h-11 relative mb-2">
    <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-[10px]" />
    <Pressable 
      onPress={onPress}
      className={`w-full h-full items-center justify-center border-2 border-biru-gelap rounded-[10px] active:translate-y-0.5 active:translate-x-0.5 ${isActive ? 'bg-biru-muda translate-y-0.5 translate-x-0.5' : color}`}
    >
      {icon}
    </Pressable>
  </View>
);

// Map Context Consumer for Recenter Logic
const MapContent = () => {
  const { cameraRef } = useMap();

  const handleRecenter = async () => {
    try {
      const location = await Location.getLastKnownPositionAsync({}) || await Location.getCurrentPositionAsync({});
      
      if (cameraRef.current) {
         if (typeof cameraRef.current.setCamera === 'function') {
            cameraRef.current.setCamera({
              centerCoordinate: [location.coords.longitude, location.coords.latitude],
              zoomLevel: 16,
              animationDuration: 1000,
            });
         } else if (typeof cameraRef.current.moveTo === 'function') {
            cameraRef.current.moveTo(
              [location.coords.longitude, location.coords.latitude],
              1000
            );
         }
      }
    } catch (e) {
      console.warn("Could not recenter:", e);
    }
  };

  // Expose recenter function globally
  (global as any).recenterMap = handleRecenter;

  return <MapUserLocation />;
};

export default function HomeScreen() {
  const router = useRouter();
  const { isTracking, startTracking, stopTracking, updateTick, elapsedTime, distance, pace, calories, route, addRoutePoint } = useRunStore();
  const [initialRegion, setInitialRegion] = useState<[number, number]>([106.8272, -6.1751]); // Monas Default
  const [activeWidget, setActiveWidget] = useState<string | null>('level');
  const [showHUD, setShowHUD] = useState<boolean>(false);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        updateTick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  // Route Drawing Effect
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    
    if (isTracking) {
      (async () => {
        try {
          locationSubscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 2000,
              distanceInterval: 3,
            },
            (loc) => {
              addRoutePoint([loc.coords.longitude, loc.coords.latitude]);
            }
          );
        } catch (e) {
          console.warn("Cannot watch position:", e);
        }
      })();
    }
    
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isTracking]);

  // Initial Location Effect
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setInitialRegion([location.coords.longitude, location.coords.latitude]);
      } catch (error) {
        console.warn("Could not fetch current location. Using default.");
      }
    })();
  }, []);

  return (
    <View className="flex-1 bg-silver-white" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      {/* TopAppBar - Hidden when HUD is fully active */}
      {!showHUD && (
        <View className="z-50 bg-white border-b-2 border-biru-gelap">
          <View className="flex-row justify-between items-center px-4 h-16">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 relative">
                <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-lg" />
                <View className="w-full h-full border-2 border-biru-gelap overflow-hidden bg-biru-muda rounded-lg">
                  <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUeLDbNo5N1DWr1zgnfr6lq6nH38NQN4a6n-BakRP-Vk9ax_YUTSEj8XdDGOgNCyw12LAZdIol0rjD6_gjUgstTBUTONp-f5xErbcBnYu-rFGAtiLm9BsdzkMej0TM7mQmVPwxBQ8aCxRxJgqphtomAo_vjlUFkG97gZMZ5ntNPJzK_Z_ypRYQ5BpHM54WeM9RF0PFFoVPpayb5yldrej0Meawyl87alhla8EjSCwZgfsD4Ti8wF_H1IjmuHaCogtEuZWRUdKalr3J' }} 
                    className="w-full h-full"
                  />
                </View>
              </View>
              <Text className="font-bold text-2xl tracking-tighter text-merah italic">LARI</Text>
            </View>
            <View className="w-10 h-10 items-center justify-center">
              <Pressable className="active:scale-90 transition-transform">
                <Bell size={24} color="#C72222" />
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Main Content Area */}
      <View className="flex-1 relative">
        {/* Map Canvas - Bone White Neobrutalism Style with Darker Streets */}
        <View className="absolute inset-0 z-0 bg-slate-100 pointer-events-auto">
          <Map 
            center={initialRegion} 
            zoom={15}
            showLoader={false}
            styles={{ 
              light: require('../assets/style-map-custom.json'), 
              dark: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" 
            }}
          >
            <MapContent />
            {route.length > 1 && (
              <MapRoute coordinates={route} color="#C72222" width={6} opacity={1} />
            )}
            
            {/* The recenter button is injected into the map context, but styled to float ABOVE the start button */}
            {(!showHUD) && (
              <View className="absolute bottom-28 right-4 pointer-events-auto z-50 p-1">
                <View className="w-12 h-12 relative">
                  <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-xl" />
                  <Pressable 
                    className="w-full h-full bg-white items-center justify-center border-2 border-biru-gelap rounded-xl active:translate-y-0.5 active:translate-x-0.5"
                    onPress={() => {
                      if ((global as any).recenterMap) {
                        (global as any).recenterMap();
                      }
                    }}
                  >
                    <Target size={24} color="#2C5A64" />
                  </Pressable>
                </View>
              </View>
            )}
          </Map>
        </View>

        {!showHUD ? (
          /* DASHBOARD MODE (GAMIFICATION OR PAUSED/BACKGROUND RUN) */
          <View className="flex-1 justify-between pointer-events-box-none">
            
            {/* Dynamic Player Widget (Top Left) */}
            <View className="pointer-events-box-none p-4 flex-row items-start">
              {/* Vertical Icon Buttons */}
              <View className="flex-col pointer-events-auto">
                <WidgetButton 
                  icon={<Star size={20} color={activeWidget === 'level' ? 'white' : '#2C5A64'} fill={activeWidget === 'level' ? 'white' : 'transparent'} />} 
                  isActive={activeWidget === 'level'} 
                  onPress={() => setActiveWidget(activeWidget === 'level' ? null : 'level')} 
                />
                <WidgetButton 
                  icon={<Trophy size={20} color={activeWidget === 'rank' ? 'white' : '#2C5A64'} />} 
                  isActive={activeWidget === 'rank'} 
                  onPress={() => setActiveWidget(activeWidget === 'rank' ? null : 'rank')} 
                />
                <WidgetButton 
                  icon={<Shield size={20} color={activeWidget === 'guild' ? 'white' : '#2C5A64'} />} 
                  isActive={activeWidget === 'guild'} 
                  onPress={() => setActiveWidget(activeWidget === 'guild' ? null : 'guild')} 
                />
                <WidgetButton 
                  icon={<MapIcon size={20} color={activeWidget === 'territory' ? 'white' : '#2C5A64'} />} 
                  isActive={activeWidget === 'territory'} 
                  onPress={() => setActiveWidget(activeWidget === 'territory' ? null : 'territory')} 
                />
              </View>

              {/* Dynamic Pop-out Panel - Fixed Position */}
              {activeWidget && (
                <View className="ml-5 mt-0 pointer-events-auto">
                  <View className="relative w-80">
                    <View className="absolute top-1.5 left-1.5 right-0 bottom-[-6px] bg-biru-gelap rounded-xl" />
                    <View className="bg-white border-2 border-biru-gelap rounded-xl p-3">
                      {activeWidget === 'level' && (
                        <View>
                          <Text className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Player Status</Text>
                          <Text className="font-outfit text-xl font-bold text-slate-900 mt-1">Level 4</Text>
                          <Text className="text-xs font-bold text-biru-gelap mb-2">Scout Runner</Text>
                          <View className="h-2 w-full bg-slate-100 rounded-full border border-biru-gelap overflow-hidden">
                            <View className="h-full bg-merah w-[65%]" />
                          </View>
                          <Text className="text-[9px] font-bold text-slate-500 mt-1 text-right">650 / 1000 XP</Text>
                        </View>
                      )}

                      {activeWidget === 'guild' && (
                        <View className="flex-row items-center gap-3">
                          <Shield size={32} color="#8CC7C4" fill="#8CC7C4" />
                          <View className="flex-1">
                            <Text className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Guild System</Text>
                            <Text className="font-outfit text-sm font-bold text-slate-900">Locked</Text>
                            <Text className="text-[10px] font-bold text-biru-gelap mt-0.5">Reach Lvl 10 to join.</Text>
                          </View>
                        </View>
                      )}
                      
                      {activeWidget === 'rank' && (
                        <View className="flex-row items-center gap-3">
                          <Trophy size={32} color="#8CC7C4" />
                          <View className="flex-1">
                            <Text className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Weekly Rank</Text>
                            <Text className="font-outfit text-xl font-bold text-merah">#14</Text>
                            <Text className="text-[10px] font-bold text-biru-gelap mt-0.5">Kec. Kuningan</Text>
                          </View>
                        </View>
                      )}
                      
                      {activeWidget === 'territory' && (
                        <View className="flex-row items-center gap-3">
                          <MapIcon size={32} color="#8CC7C4" />
                          <View className="flex-1">
                            <Text className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Controlled Area</Text>
                            <Text className="font-outfit text-xl font-bold text-merah">12 Blocks</Text>
                            <Text className="text-[10px] font-bold text-biru-gelap mt-0.5">Local District</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Bottom Actions Area */}
            <View className="pointer-events-box-none flex-row justify-end items-end pb-4 pr-4 gap-4 relative">
              
              {/* Horizontal Minimized Banner - Shows ONLY when tracking is active but HUD is minimized */}
              {isTracking && (
                <View className="flex-1 ml-4 relative pointer-events-auto">
                  <View className="absolute top-1.5 left-1.5 w-full h-full bg-biru-gelap rounded-2xl" />
                  <Pressable 
                    className="bg-white border-2 border-biru-gelap rounded-2xl p-3 flex-row items-center justify-around active:translate-y-0.5 active:translate-x-0.5 h-20"
                    onPress={() => setShowHUD(true)}
                  >
                    <View className="items-center">
                       <Text className="text-[10px] font-bold text-slate-500 tracking-widest">TIME</Text>
                       <Text className="font-mono text-lg font-bold text-slate-900">{formatTime(elapsedTime)}</Text>
                    </View>
                    <View className="items-center">
                       <Text className="text-[10px] font-bold text-slate-500 tracking-widest">DIST</Text>
                       <View className="flex-row items-baseline gap-1">
                         <Text className="font-mono text-lg font-bold text-slate-900">{distance.toFixed(2)}</Text>
                         <Text className="text-[10px] font-bold text-slate-500">km</Text>
                       </View>
                    </View>
                  </Pressable>
                </View>
              )}

              {/* Start/Resume Run Action - Neobrutalism Outline Style */}
              <View className="w-20 h-20 relative pointer-events-auto">
                <View className="absolute top-1.5 left-1.5 w-full h-full bg-biru-gelap rounded-3xl" />
                <Pressable 
                  className="w-full h-full bg-white items-center justify-center border-2 border-biru-gelap rounded-3xl active:translate-y-0.5 active:translate-x-0.5"
                  onPress={() => {
                    if (!isTracking) startTracking();
                    setShowHUD(true);
                  }}
                >
                  {isTracking ? (
                    <RotateCcw size={36} color="#0891B2" strokeWidth={3} />
                  ) : (
                    <Play size={36} color="#C72222" strokeWidth={3} className="ml-1" />
                  )}
                </Pressable>
              </View>
            </View>

          </View>
        ) : (
          /* RUNNING HUD MODE */
          <View className="flex-1 justify-between pb-10 pt-4 px-4 pointer-events-box-none">
            
            {/* HUD Header (Minimize Button & Status) */}
            <View className="flex-row justify-between items-center mb-2 pointer-events-auto">
              <View className="relative">
                <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-xl" />
                <Pressable 
                  onPress={() => setShowHUD(false)} 
                  className="bg-white p-2 rounded-xl border-2 border-biru-gelap active:translate-y-0.5 active:translate-x-0.5"
                >
                  <ChevronDown color="#2C5A64" strokeWidth={3} />
                </Pressable>
              </View>
              
              <View className="bg-white px-4 py-2 rounded-xl border-2 border-biru-gelap">
                <Text className="font-bold text-merah tracking-widest text-xs">RECORDING ROUTE</Text>
              </View>
            </View>

            {/* Top HUD Stats (Time & Distance) */}
            <View className="pointer-events-box-none gap-3">
              <View className="relative w-full pointer-events-auto">
                 <View className="absolute top-1.5 left-1.5 w-full h-full bg-biru-gelap rounded-xl" />
                 <View className="bg-white p-4 border-2 border-biru-gelap rounded-xl">
                  <Text className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Time Elapsed</Text>
                  <Text className="text-center text-6xl font-black text-slate-900 font-mono tracking-tighter">
                    {formatTime(elapsedTime)}
                  </Text>
                </View>
              </View>

              {/* FIX: Removed h-full from the inner containers to stop them from stretching down */}
              <View className="flex-row gap-3 pointer-events-auto">
                <View className="flex-1 relative">
                  <View className="absolute top-1.5 left-1.5 w-full h-full bg-biru-gelap rounded-xl" />
                  <View className="bg-white p-3 border-2 border-biru-gelap rounded-xl">
                    <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Distance</Text>
                    <View className="flex-row items-baseline gap-1 mt-1">
                      <Text className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{distance.toFixed(2)}</Text>
                      <Text className="text-xs font-bold text-slate-500">km</Text>
                    </View>
                  </View>
                </View>

                <View className="flex-1 relative">
                  <View className="absolute top-1.5 left-1.5 w-full h-full bg-biru-gelap rounded-xl" />
                  <View className="bg-white p-3 border-2 border-biru-gelap rounded-xl">
                    <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pace</Text>
                    <View className="flex-row items-baseline gap-1 mt-1">
                      <Text className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{formatPace(pace)}</Text>
                      <Text className="text-xs font-bold text-slate-500">/km</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Empty space to ensure flex-between pushes buttons down */}
            <View className="flex-1 pointer-events-none" />

            {/* Bottom Actions (Stop / Pause) */}
            <View className="flex-row justify-center items-center gap-6 pointer-events-auto">
              {/* Pause Button */}
              <View className="w-20 h-20 relative">
                <View className="absolute top-1 left-1 w-full h-full bg-slate-800 rounded-3xl" />
                <Pressable 
                  className="w-full h-full bg-slate-100 items-center justify-center border-2 border-slate-800 rounded-3xl active:translate-y-0.5 active:translate-x-0.5"
                  onPress={() => console.log('Pause Pressed')}
                >
                  <Pause size={32} color="#1E293B" />
                </Pressable>
              </View>

              {/* Stop Button */}
              <View className="w-24 h-24 relative">
                <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-3xl" />
                <Pressable 
                  className="w-full h-full bg-merah items-center justify-center border-2 border-biru-gelap rounded-3xl active:translate-y-0.5 active:translate-x-0.5"
                  onPress={() => {
                    stopTracking();
                    setShowHUD(false);
                  }}
                >
                  <Square size={36} color="white" fill="white" />
                </Pressable>
              </View>
            </View>

          </View>
        )}
      </View>

      {/* Custom Bottom Navigation Bar - Hidden during HUD mode */}
      {!showHUD && (
        <View className="flex-row justify-around items-center bg-white h-20 border-t-2 border-biru-gelap px-2 pb-2">
          {/* Active Tab */}
          <Link href="/" asChild>
            <Pressable className="items-center justify-center bg-merah px-5 py-2 rounded-xl border-2 border-biru-gelap active:translate-y-0.5">
              <Home size={24} color="white" />
              <Text className="text-[10px] font-bold text-white mt-1">Home</Text>
            </Pressable>
          </Link>
          
          {/* Inactive Tabs */}
          <Link href="/history" asChild>
            <Pressable className="items-center justify-center px-4 py-2 opacity-60 active:opacity-100">
              <History size={24} color="#2C5A64" />
              <Text className="text-[10px] font-bold text-biru-gelap mt-1">History</Text>
            </Pressable>
          </Link>
          
          <Link href="/regu" asChild>
            <Pressable className="items-center justify-center px-4 py-2 opacity-60 active:opacity-100">
              <Trophy size={24} color="#2C5A64" />
              <Text className="text-[10px] font-bold text-biru-gelap mt-1">Regu</Text>
            </Pressable>
          </Link>
          
          <Link href="/profile" asChild>
            <Pressable className="items-center justify-center px-4 py-2 opacity-60 active:opacity-100">
              <User size={24} color="#2C5A64" />
              <Text className="text-[10px] font-bold text-biru-gelap mt-1">Profile</Text>
            </Pressable>
          </Link>
        </View>
      )}
    </View>
  );
}
