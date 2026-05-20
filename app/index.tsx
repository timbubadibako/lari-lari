import { View, Image, Pressable, SafeAreaView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { Map, MapUserLocation, MapRoute, useMap } from '@/components/ui/map';
import { Text } from '@/components/ui/text';
import { Play, Bell, Square, Pause, Home, History, Trophy, User, Target, Star, Shield, Map as MapIcon, ChevronDown, RotateCcw, LogOut } from 'lucide-react-native';
import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { useRunStore } from '@/lib/store';
import { Link, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

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
  <View className="w-10 h-10 relative mb-3">
    {/* Shadow block */}
    <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-[10px]" />
    {/* Main Button */}
    <Pressable 
      onPress={onPress}
      className={`absolute top-0 left-0 w-full h-full items-center justify-center border-2 border-biru-gelap rounded-[10px] active:translate-y-0.5 active:translate-x-0.5 ${isActive ? 'bg-biru-muda translate-y-0.5 translate-x-0.5' : color}`}
    >
      {icon}
    </Pressable>
  </View>
);

// Map Context Consumer for Recenter Logic
const MapContent = ({ initialRegion }: { initialRegion: [number, number] }) => {
  const { cameraRef } = useMap();

  const handleRecenter = async () => {
    try {
      let coords = initialRegion;
      try {
        const location = await Location.getLastKnownPositionAsync({}) || await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced, timeout: 3000 });
        if (location) {
          coords = [location.coords.longitude, location.coords.latitude];
        }
      } catch (e) {
        console.warn("GPS unavailable, falling back to last known region");
      }
      
      if (cameraRef.current) {
         const cameraConfig = {
            centerCoordinate: coords,
            zoomLevel: 16,
            animationDuration: 1000,
         };

         if (typeof cameraRef.current.setCamera === 'function') {
            cameraRef.current.setCamera(cameraConfig);
         } else if (typeof cameraRef.current.moveTo === 'function') {
            cameraRef.current.moveTo(coords, 1000);
         }
      }
    } catch (e) {
      console.warn("Recenter failed completely:", e.message);
    }
  };

  // Expose recenter function globally
  (global as any).recenterMap = handleRecenter;

  return <MapUserLocation />;
};

export default function HomeScreen() {
  const router = useRouter();
  const { isTracking, startTracking, stopTracking, updateTick, elapsedTime, distance, pace, calories, route, addRoutePoint, profile, setProfile, territories, setTerritories } = useRunStore();
  const [initialRegion, setInitialRegion] = useState<[number, number]>([106.8272, -6.1751]); // Monas Default
  const [activeWidget, setActiveWidget] = useState<string | null>('level');
  const [showHUD, setShowHUD] = useState<boolean>(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Keep Awake Effect
  useEffect(() => {
    if (isTracking) {
      activateKeepAwakeAsync().catch(() => {});
    } else {
      deactivateKeepAwake();
    }
    return () => deactivateKeepAwake();
  }, [isTracking]);

  // Fetch Profile from Supabase
  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile({
            username: data.username || 'Unknown Pilot',
            display_name: data.display_name || 'Pilot',
            level: data.level || 1,
            xp: data.xp || 0,
            territory_count: 0,
          });
        }
      } catch (e) {
        console.error("Error fetching profile:", e);
      } finally {
        setFetchingProfile(false);
      }
    }
    getProfile();
  }, []);

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
              timeInterval: 3000,
              distanceInterval: 5,
            },
            (loc) => {
              addRoutePoint([loc.coords.longitude, loc.coords.latitude]);
            }
          );
        } catch (e) {
          console.warn("GPS tracking error:", e);
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
        // Fallback
      }
    })();
  }, []);

  if (fetchingProfile) {
    return (
      <View className="flex-1 bg-silver-white items-center justify-center">
        <ActivityIndicator size="large" color="#C72222" />
        <Text className="mt-4 font-outfit font-bold text-merah uppercase tracking-widest">Establishing Connection...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-silver-white" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      {/* TopAppBar */}
      {!showHUD && (
        <View className="z-50 bg-white border-b-2 border-biru-gelap">
          <View className="flex-row justify-between items-center px-4 h-16">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 relative">
                <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-lg" />
                <View className="w-full h-full border-2 border-biru-gelap overflow-hidden bg-biru-muda rounded-lg">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUeLDbNo5N1DWr1zgnfr6lq6nH38NQN4a6n-BakRP-Vk9ax_YUTSEj8XdDGOgNCyw12LAZdIol0rjD6_gjUgstTBUTONp-f5xErbcBnYu-rFGAtiLm9BsdzkMej0TM7mQmVPwxBQ8aCxRxJgqphtomAo_vjlUFkG97gZMZ5ntNPJzK_Z_ypRYQ5BpHM54WeM9RF0PFFoVPpayb5yldrej0Meawyl87alhla8EjSCwZgfsD4Ti8wF_H1IjmuHaCogtEuZWRUdKalr3J' }} className="w-full h-full" />
                </View>
              </View>
              <Text className="font-bold text-2xl tracking-tighter text-merah italic uppercase">LARI</Text>
            </View>
            <View className="flex-row items-center gap-3">
               <Pressable onPress={() => supabase.auth.signOut()} className="active:scale-90 p-1">
                 <LogOut size={20} color="#2C5A64" />
               </Pressable>
               <Pressable className="active:scale-90 p-1">
                 <Bell size={24} color="#C72222" />
               </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Main Content Area */}
      <View className="flex-1 relative">
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
            <MapContent initialRegion={initialRegion} />
            
            {/* Render Territories (Polygons) */}
            {territories.map((t) => (
              <GeoJSONSource key={t.id} id={`source-${t.id}`} data={t.boundary}>
                <FillLayer
                  id={`fill-${t.id}`}
                  style={{
                    fillColor: t.leader_id === profile?.id ? '#C72222' : '#2C5A64',
                    fillOpacity: 0.4,
                  }}
                />
                <LineLayer
                  id={`line-${t.id}`}
                  style={{
                    lineColor: '#2C5A64',
                    lineWidth: 3,
                  }}
                />
              </GeoJSONSource>
            ))}

            {route.length > 1 ? <MapRoute coordinates={route} color="#C72222" width={6} opacity={1} /> : null}
            
          </Map>
        </View>

        {!showHUD ? (
          /* DASHBOARD MODE */
          <View className="flex-1 justify-between pointer-events-box-none">
            <View className="p-4 pointer-events-box-none flex-row items-start">
              {/* Vertical Icon Buttons */}
              <View className="flex-col pointer-events-auto">
                <WidgetButton icon={<Star size={20} color={activeWidget === 'level' ? 'white' : '#2C5A64'} fill={activeWidget === 'level' ? 'white' : 'transparent'} />} isActive={activeWidget === 'level'} onPress={() => setActiveWidget(activeWidget === 'level' ? null : 'level')} />
                <WidgetButton icon={<Trophy size={20} color={activeWidget === 'rank' ? 'white' : '#2C5A64'} />} isActive={activeWidget === 'rank'} onPress={() => setActiveWidget(activeWidget === 'rank' ? null : 'rank')} />
                <WidgetButton icon={<Shield size={20} color={activeWidget === 'guild' ? 'white' : '#2C5A64'} />} isActive={activeWidget === 'guild'} onPress={() => setActiveWidget(activeWidget === 'guild' ? null : 'guild')} />
                <WidgetButton icon={<MapIcon size={20} color={activeWidget === 'territory' ? 'white' : '#2C5A64'} />} isActive={activeWidget === 'territory'} onPress={() => setActiveWidget(activeWidget === 'territory' ? null : 'territory')} />
              </View>

              {/* Dynamic Pop-out Panel - Fixed Position */}
              {activeWidget && (
                <View className="ml-5 mt-0 pointer-events-auto">
                  <View className="relative w-80">
                    <View className="absolute top-1.5 left-1.5 right-0 bottom-[-4px] bg-biru-gelap rounded-xl" />
                    <View className="bg-white border-2 border-biru-gelap rounded-xl p-3">
                      {activeWidget === 'level' && (
                        <View>
                          <Text className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Pilot Status</Text>
                          <Text className="font-outfit text-xl font-bold text-slate-900 mt-1">{profile?.username}</Text>
                          <Text className="text-xs font-bold text-biru-gelap mb-2 text-slate-500">Level {profile?.level} Scout</Text>
                          <View className="h-2 w-full bg-slate-100 rounded-full border border-biru-gelap overflow-hidden">
                            <View className="h-full bg-merah" style={{ width: `${(profile?.xp || 0) % 100}%` }} />
                          </View>
                          <Text className="text-[9px] font-bold text-slate-500 mt-1 text-right">{profile?.xp} XP Total</Text>
                        </View>
                      )}
                      {activeWidget === 'guild' && (
                        <View className="flex-row items-center gap-3">
                          <Shield size={32} color="#8CC7C4" fill="#8CC7C4" />
                          <View className="flex-1">
                            <Text className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Guild System</Text>
                            <Text className="font-outfit text-sm font-bold text-slate-900">{profile?.level! < 10 ? 'Locked' : 'Available'}</Text>
                            <Text className="text-[10px] font-bold text-biru-gelap mt-0.5 text-slate-500">Reach Lvl 10 to join.</Text>
                          </View>
                        </View>
                      )}
                      {activeWidget === 'rank' && (
                        <View className="flex-row items-center gap-3">
                          <Trophy size={32} color="#8CC7C4" />
                          <View className="flex-1">
                            <Text className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">District Rank</Text>
                            <Text className="font-outfit text-xl font-bold text-merah">#--</Text>
                            <Text className="text-[10px] font-bold text-biru-gelap mt-0.5 text-slate-500">Deploy to rank up.</Text>
                          </View>
                        </View>
                      )}
                      {activeWidget === 'territory' && (
                        <View className="flex-row items-center gap-3">
                          <MapIcon size={32} color="#8CC7C4" />
                          <View className="flex-1">
                            <Text className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Territories</Text>
                            <Text className="font-outfit text-xl font-bold text-merah">{profile?.territory_count} Areas</Text>
                            <Text className="text-[10px] font-bold text-biru-gelap mt-0.5 text-slate-500">Capture local sectors.</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View className="pointer-events-box-none items-end pb-4 pr-4 gap-4">
              <View className="z-50 p-1 mb-[-12px]">
                <View className="w-12 h-12 relative">
                  <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-xl" />
                  <Pressable className="w-full h-full bg-white items-center justify-center border-2 border-biru-gelap rounded-xl active:translate-y-0.5 active:translate-x-0.5" onPress={() => { if ((global as any).recenterMap) (global as any).recenterMap(); }}>
                    <Target size={24} color="#2C5A64" />
                  </Pressable>
                </View>
              </View>

              <View className="flex-row items-end gap-4 pointer-events-box-none w-full justify-end">
                {isTracking && (
                  <View className="flex-1 ml-4 relative pointer-events-auto">
                    <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-2xl" />
                    <Pressable className="bg-white border-2 border-biru-gelap rounded-2xl p-3 flex-row items-center justify-around active:translate-y-0.5 active:translate-x-0.5 h-16" onPress={() => setShowHUD(true)}>
                      <View className="items-center">
                        <Text className="text-[9px] font-bold text-slate-500">TIME</Text>
                        <Text className="font-mono text-sm font-bold text-slate-900">{formatTime(elapsedTime)}</Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-[9px] font-bold text-slate-500">DIST</Text>
                        <Text className="font-mono text-sm font-bold text-slate-900">{distance.toFixed(2)}km</Text>
                      </View>
                    </Pressable>
                  </View>
                )}
                <View className="w-16 h-16 relative pointer-events-auto">
                  <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-2xl" />
                  <Pressable className="w-full h-full bg-white items-center justify-center border-2 border-biru-gelap rounded-2xl active:translate-y-0.5 active:translate-x-0.5" onPress={() => { if (!isTracking) startTracking(); setShowHUD(true); }}>
                    {isTracking ? <RotateCcw size={28} color="#0891B2" strokeWidth={3} /> : <Play size={28} color="#C72222" strokeWidth={3} className="ml-1" />}
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View className="flex-1 justify-between pb-10 pt-4 px-4 pointer-events-box-none">
            <View className="flex-row justify-between items-center mb-2 pointer-events-auto">
              <View className="relative">
                <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-xl" />
                <Pressable onPress={() => setShowHUD(false)} className="bg-white p-2 rounded-xl border-2 border-biru-gelap active:translate-y-0.5 active:translate-x-0.5">
                  <ChevronDown color="#2C5A64" strokeWidth={3} />
                </Pressable>
              </View>
              <View className="bg-white px-4 py-2 rounded-xl border-2 border-biru-gelap">
                <Text className="font-bold text-merah tracking-widest text-[10px]">RECORDING ROUTE</Text>
              </View>
            </View>

            <View className="pointer-events-box-none gap-3">
              <View className="relative w-full pointer-events-auto">
                 <View className="absolute top-1.5 left-1.5 w-full h-full bg-biru-gelap rounded-xl" />
                 <View className="bg-white p-4 border-2 border-biru-gelap rounded-xl">
                  <Text className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Time Elapsed</Text>
                  <Text className="text-center text-5xl font-black text-slate-900 font-mono tracking-tighter">{formatTime(elapsedTime)}</Text>
                </View>
              </View>
              <View className="flex-row gap-3 pointer-events-auto">
                <View className="flex-1 relative">
                  <View className="absolute top-1.5 left-1.5 w-full h-full bg-biru-gelap rounded-xl" />
                  <View className="bg-white p-3 border-2 border-biru-gelap rounded-xl h-full">
                    <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Distance</Text>
                    <View className="flex-row items-baseline gap-1 mt-1">
                      <Text className="text-2xl font-black text-slate-900 font-mono">{distance.toFixed(2)}</Text>
                      <Text className="text-[10px] font-bold text-slate-500">km</Text>
                    </View>
                  </View>
                </View>
                <View className="flex-1 relative">
                  <View className="absolute top-1.5 left-1.5 w-full h-full bg-biru-gelap rounded-xl" />
                  <View className="bg-white p-3 border-2 border-biru-gelap rounded-xl h-full">
                    <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pace</Text>
                    <View className="flex-row items-baseline gap-1 mt-1">
                      <Text className="text-2xl font-black text-slate-900 font-mono">{formatPace(pace)}</Text>
                      <Text className="text-[10px] font-bold text-slate-500">/km</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View className="flex-1 pointer-events-none" />
            <View className="flex-row justify-center items-center gap-6 pointer-events-auto">
              <View className="w-16 h-16 relative">
                <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-3xl" />
                <Pressable className="w-full h-full bg-white items-center justify-center border-2 border-biru-gelap rounded-3xl active:translate-y-0.5 active:translate-x-0.5" onPress={() => console.log('Pause Pressed')}>
                  <Pause size={28} color="#2C5A64" fill="#2C5A64" />
                </Pressable>
              </View>
              <View className="w-24 h-24 relative">
                <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-3xl" />
                <Pressable className="w-full h-full bg-merah items-center justify-center border-2 border-biru-gelap rounded-3xl active:translate-y-0.5 active:translate-x-0.5" onPress={() => { stopTracking(); setShowHUD(false); }}>
                  <Square size={32} color="white" fill="white" />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>

      {!showHUD && (
        <View className="flex-row justify-around items-center bg-white h-20 border-t-2 border-biru-gelap px-2 pb-2">
          <Link href="/" asChild><Pressable className="items-center justify-center bg-merah px-5 py-2 rounded-xl border-2 border-biru-gelap active:translate-y-0.5"><Home size={24} color="white" /><Text className="text-[10px] font-bold text-white mt-1 uppercase">Home</Text></Pressable></Link>
          <Link href="/history" asChild><Pressable className="items-center justify-center px-4 py-2 opacity-60 active:opacity-100"><History size={24} color="#2C5A64" /><Text className="text-[10px] font-bold text-biru-gelap mt-1 uppercase">History</Text></Pressable></Link>
          <Link href="/regu" asChild><Pressable className="items-center justify-center px-4 py-2 opacity-60 active:opacity-100"><Trophy size={24} color="#2C5A64" /><Text className="text-[10px] font-bold text-biru-gelap mt-1 uppercase">Regu</Text></Pressable></Link>
          <Link href="/profile" asChild><Pressable className="items-center justify-center px-4 py-2 opacity-60 active:opacity-100"><User size={24} color="#2C5A64" /><Text className="text-[10px] font-bold text-biru-gelap mt-1 uppercase">Profile</Text></Pressable></Link>
        </View>
      )}
    </View>
  );
}
