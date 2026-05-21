import { View, Image, Pressable, Platform, StatusBar, ActivityIndicator, LayoutAnimation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Map, MapUserLocation, MapRoute, useMap, GeoJSONSource, FillLayer, LineLayer } from '@/components/ui/map';
import { Text } from '@/components/ui/text';
import { Play, Bell, Square, Pause, Home, History, Trophy, User, Target, Star, Shield, Map as MapIcon, ChevronDown, RotateCcw, LogOut } from 'lucide-react-native';
import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { useRunStore } from '@/lib/store';
import { Link, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

// Helper to format time
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

// Neobrutalism Button Component
const WidgetButton = ({ icon, isActive, onPress, color = "bg-white" }: any) => (
  <View className="w-10 h-10 relative mb-3">
    <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-xl" />
    <Pressable 
      onPress={onPress}
      className={`absolute top-0 left-0 w-full h-full items-center justify-center border-2 border-biru-gelap rounded-xl active:translate-y-0.5 active:translate-x-0.5 ${isActive ? 'bg-biru-muda translate-y-0.5 translate-x-0.5' : color}`}
    >
      {icon}
    </Pressable>
  </View>
);

const MapContent = () => {
  return <MapUserLocation />;
};

import { BottomNav } from '@/components/ui/bottom-nav';

export default function HomeScreen() {
  const router = useRouter();
  const { isTracking, startTracking, stopTracking, updateTick, elapsedTime, distance, pace, calories, route, addRoutePoint, profile, setProfile, territories, setTerritories, isHUDActive, setHUDActive } = useRunStore();

  const [initialRegion, setInitialRegion] = useState<[number, number]>([106.8272, -6.1751]); 
  const [activeWidget, setActiveWidget] = useState<string | null>('level');
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [bellClicks, setBellClicks] = useState(0);

  const handleRecenter = async () => {
    try {
      const location = await Location.getLastKnownPositionAsync({}) || await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced, timeout: 3000 });
      if (location) {
        // Add a microscopic random jitter to force React to update the Camera prop
        // even if the user hasn't moved but just panned the map.
        const jitter = (Math.random() - 0.5) * 0.00000001;
        setInitialRegion([location.coords.longitude + jitter, location.coords.latitude + jitter]);
      }
    } catch (e) {
      console.warn("GPS unavailable");
    }
  };

  const triggerTestMode = () => {
    setBellClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        if (!isTracking) startTracking();
        setHUDActive(true);
        // Simulate a closed loop run around Monas
        const testCoords = [
          [106.8272, -6.1751],
          [106.8282, -6.1751],
          [106.8282, -6.1761],
          [106.8272, -6.1761],
          [106.8272, -6.1751]
        ];
        testCoords.forEach((coord, i) => {
          setTimeout(() => {
            addRoutePoint(coord as [number, number]);
          }, i * 1500);
        });
        return 0; // reset
      }
      return newCount;
    });
  };

  const toggleWidget = (widget: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveWidget(activeWidget === widget ? null : widget);
  };

  const toggleHUD = (val: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setHUDActive(val);
  };

  // Fetch Data
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (p) setProfile({ username: p.username || 'Pilot', display_name: p.display_name || 'Pilot', level: p.level || 1, xp: p.xp || 0, territory_count: 0 });
        const { data: t } = await supabase.from('territories').select('id, name, boundary, leader_id');
        if (t) setTerritories(t.map(x => ({ ...x, boundary: typeof x.boundary === 'string' ? JSON.parse(x.boundary) : x.boundary })));
      } catch (e) { console.error(e); } finally { setFetchingProfile(false); }
    }
    fetchData();
  }, []);

  // Tracking Effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) interval = setInterval(() => updateTick(), 1000);
    return () => clearInterval(interval);
  }, [isTracking]);

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;
    if (isTracking) {
      (async () => {
        try {
          sub = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 }, (loc) => {
            addRoutePoint([loc.coords.longitude, loc.coords.latitude]);
          });
        } catch (e) { console.warn("GPS error:", e); }
      })();
    }
    return () => sub?.remove();
  }, [isTracking]);

  // Initial Location Effect
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setInitialRegion([location.coords.longitude, location.coords.latitude]);
      } catch (error) {}
    })();
  }, []);

  if (fetchingProfile) {
    return (
      <View className="flex-1 bg-silver-white items-center justify-center">
        <ActivityIndicator size="large" color="#C72222" />
        <Text className="mt-4 font-outfit font-bold text-merah uppercase tracking-widest text-center px-10">Syncing War Room Data...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* 1. LAYER PETA (ABSOLUT FULLSCREEN - Gak Bakal Resize/Glitch) */}
      <View className="absolute inset-0 z-0">
        <Map 
          center={initialRegion} 
          zoom={15}
          showLoader={false}
          styles={{ 
            light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", 
            dark: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" 
          }}
        >
          <MapContent initialRegion={initialRegion} />

          {/* Render Territories */}
          {territories.map((t) => (
            <GeoJSONSource key={t.id} id={`source-${t.id}`} data={t.boundary}>
              <FillLayer id={`fill-${t.id}`} style={{ fillColor: t.leader_id === profile?.id ? '#C72222' : '#2C5A64', fillOpacity: 0.4 }} />
              <LineLayer id={`line-${t.id}`} style={{ lineColor: '#2C5A64', lineWidth: 3 }} />
            </GeoJSONSource>
          ))}

          {/* Render Path */}
          {route.length > 1 ? (
            <MapRoute coordinates={route} color="#C72222" width={6} opacity={1} />
          ) : null}
          
          {/* RECENTER BUTTON (Always Floats on Map) */}
          {!isHUDActive && (
            <View className="absolute bottom-44 right-4 pointer-events-auto z-50 p-1">
              <View className="w-12 h-12 relative">
                <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-xl" />
                <Pressable 
                  className="w-full h-full bg-white items-center justify-center border-2 border-biru-gelap rounded-xl active:translate-y-0.5 active:translate-x-0.5"
                  onPress={handleRecenter}
                >
                  <Target size={24} color="#2C5A64" />
                </Pressable>
              </View>
            </View>
          )}
        </Map>
      </View>

      {/* 2. LAYER TOP APP BAR (MELAYANG DI ATAS PETA) */}
      {!isHUDActive && (
        <View 
          className="absolute top-0 left-0 right-0 z-50 bg-white border-b-2 border-biru-gelap" 
          style={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 44 }}
        >
          <View className="flex-row justify-between items-center px-4 h-16">
            {/* KIRI: Avatar & Pilot Greeting */}
            <View className="flex-row items-center gap-3">
              {/* Avatar Frame Neo-Brutalist */}
              <View className="w-10 h-10 relative">
                <View className="absolute top-0.5 left-0.5 w-full h-full bg-biru-gelap rounded-lg" />
                <View className="w-full h-full border-2 border-biru-gelap overflow-hidden bg-biru-muda rounded-lg">
                  <Image 
                    source={{ uri: profile?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUeLDbNo5N1DWr1zgnfr6lq6nH38NQN4a6n-BakRP-Vk9ax_YUTSEj8XdDGOgNCyw12LAZdIol0rjD6_gjUgstTBUTONp-f5xErbcBnYu-rFGAtiLm9BsdzkMej0TM7mQmVPwxBQ8aCxRxJgqphtomAo_vjlUFkG97gZMZ5ntNPJzK_Z_ypRYQ5BpHM54WeM9RF0PFFoVPpayb5yldrej0Meawyl87alhla8EjSCwZgfsD4Ti8wF_H1IjmuHaCogtEuZWRUdKalr3J' }} 
                    className="w-full h-full" 
                  />
                </View>
              </View>
              
              {/* Dynamic Text Greeting */}
              <View className="justify-center">
                <Text className="text-[9px] font-bold uppercase text-slate-500 tracking-widest leading-none mb-0.5">Ready to Deploy,</Text>
                <Text className="font-outfit text-base font-black text-slate-900 leading-tight">
                  @{profile?.username || 'streetRunner'}
                </Text>
              </View>
            </View>

            {/* KANAN: Button Notifikasi (Radar Alert) yang Di-styling Ulang */}
            <View className="flex-row items-center">
              <Pressable 
                className="w-10 h-10 relative active:translate-x-0.5 active:translate-y-0.5"
                onPress={triggerTestMode}
              >
                {/* Shadow Layer */}
                <View className="absolute top-0.5 left-0.5 w-full h-full bg-biru-gelap rounded-lg" />
                
                {/* Main Button Layer */}
                <View className="w-full h-full bg-white border-2 border-biru-gelap rounded-lg items-center justify-center">
                  <Bell size={20} color="#2C5A64" strokeWidth={2.5} />
                  
                  {/* Alert Badge (Muncul jika ada sektor yang direbut musuh) */}
                  <View className="absolute -top-1 -right-1 bg-merah border border-biru-gelap w-3.5 h-3.5 rounded-md items-center justify-center">
                    <Text className="text-[8px] font-extrabold text-white leading-none">!</Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* 3. LAYER OVERLAY UI (DASHBOARD ATAU HUD) */}
      <SafeAreaView className="flex-1 pointer-events-box-none z-40">
        {!isHUDActive ? (
          /* DASHBOARD OVERLAY */
          <View className="flex-1 justify-between pointer-events-box-none p-4" style={{ marginTop: 60, marginBottom: 84 }}>
            {/* Left Dynamic Widget */}
            <View className="flex-row items-start pointer-events-box-none w-full">
              <View className="flex-col pointer-events-auto">
                <WidgetButton icon={<Star size={20} color={activeWidget === 'level' ? 'white' : '#2C5A64'} fill={activeWidget === 'level' ? 'white' : 'transparent'} />} isActive={activeWidget === 'level'} onPress={() => toggleWidget('level')} />
                <WidgetButton icon={<Trophy size={20} color={activeWidget === 'rank' ? 'white' : '#2C5A64'} />} isActive={activeWidget === 'rank'} onPress={() => toggleWidget('rank')} />
                <WidgetButton icon={<Shield size={20} color={activeWidget === 'guild' ? 'white' : '#2C5A64'} />} isActive={activeWidget === 'guild'} onPress={() => toggleWidget('guild')} />
                <WidgetButton icon={<MapIcon size={20} color={activeWidget === 'territory' ? 'white' : '#2C5A64'} />} isActive={activeWidget === 'territory'} onPress={() => toggleWidget('territory')} />
              </View>

              {activeWidget && (
                <View className="flex-1 ml-4 mt-0.5 pointer-events-auto">
                  <View className="relative w-full">
                    <View className="absolute top-1.5 left-1.5 right-[-3px] bottom-[-4px] bg-biru-gelap rounded-xl" />
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

            {/* Bottom Floating Dashboard Actions */}
            <View className="flex-row items-end gap-4 pointer-events-box-none w-full justify-end">
                {isTracking && (
                  <View className="flex-1 ml-4 relative pointer-events-auto">
                    <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-2xl" />
                    <Pressable className="bg-white border-2 border-biru-gelap rounded-2xl p-3 flex-row items-center justify-around active:translate-y-0.5 active:translate-x-0.5 h-16" onPress={() => toggleHUD(true)}>
                      <View className="items-center"><Text className="text-[9px] font-bold text-slate-500 uppercase">TIME</Text><Text className="font-mono text-sm font-bold text-slate-900">{formatTime(elapsedTime)}</Text></View>
                      <View className="items-center"><Text className="text-[9px] font-bold text-slate-500 uppercase">DIST</Text><Text className="font-mono text-sm font-bold text-slate-900">{distance.toFixed(2)}km</Text></View>
                    </Pressable>
                  </View>
                )}
                <View className="w-16 h-16 relative pointer-events-auto">
                  <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-2xl" />
                  <Pressable className="w-full h-full bg-white items-center justify-center border-2 border-biru-gelap rounded-2xl active:translate-y-0.5 active:translate-x-0.5" onPress={() => { if (!isTracking) startTracking(); toggleHUD(true); }}>
                    {isTracking ? <RotateCcw size={28} color="#0891B2" strokeWidth={3} /> : <Play size={28} color="#C72222" strokeWidth={3} className="ml-1" />}
                  </Pressable>
                </View>
            </View>
          </View>
        ) : (
          /* HUD OVERLAY */
          <View className="flex-1 justify-between p-4 pointer-events-box-none" style={{ marginTop: 24, marginBottom: 48 }}>
            <View className="flex-row justify-between items-center pointer-events-auto">
              <View className="relative">
                <View className="absolute top-1 left-1 right-0 bottom-[-4px] bg-biru-gelap rounded-xl" />
                <Pressable onPress={() => toggleHUD(false)} className="bg-white p-2 rounded-xl border-2 border-biru-gelap active:translate-y-0.5 active:translate-x-0.5"><ChevronDown color="#2C5A64" strokeWidth={3} /></Pressable>
              </View>
              <View className="bg-white px-4 py-2 rounded-xl border-2 border-biru-gelap"><Text className="font-bold text-merah tracking-widest text-[10px]">RECORDING ROUTE</Text></View>
            </View>
            <View className="gap-4 pointer-events-auto bottom-56">
              <View className="relative w-full">
                 <View className="absolute top-1.5 left-1.5 right-0 bottom-[-4px] bg-biru-gelap rounded-xl" />
                 <View className="bg-white p-4 border-2 border-biru-gelap rounded-xl"><Text className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Time Elapsed</Text><Text className="text-center text-5xl font-black text-slate-900 font-mono tracking-tighter">{formatTime(elapsedTime)}</Text></View>
              </View>
              <View className="flex-row gap-4">
                <View className="flex-1 relative">
                  <View className="absolute top-1.5 left-1.5 right-0 bottom-[-4px] bg-biru-gelap rounded-xl" /><View className="bg-white p-3 border-2 border-biru-gelap rounded-xl"><Text className="text-[10px] font-bold text-slate-500 uppercase">Distance</Text><View className="flex-row items-baseline gap-1 mt-1"><Text className="text-2xl font-black text-slate-900 font-mono">{distance.toFixed(2)}</Text><Text className="text-[10px] font-bold text-slate-500">km</Text></View></View>
                </View>
                <View className="flex-1 relative">
                  <View className="absolute top-1.5 left-1.5 right-0 bottom-[-4px] bg-biru-gelap rounded-xl" /><View className="bg-white p-3 border-2 border-biru-gelap rounded-xl"><Text className="text-[10px] font-bold text-slate-500 uppercase">Pace</Text><View className="flex-row items-baseline gap-1 mt-1"><Text className="text-2xl font-black text-slate-900 font-mono">{formatPace(pace)}</Text><Text className="text-[10px] font-bold text-slate-500">/km</Text></View></View>
                </View>
              </View>
            </View>
            <View className="flex-row justify-center items-center gap-6 pointer-events-auto pb-4">
              <View className="w-16 h-16 relative"><View className="absolute top-1 left-1 w-full h-full bg-slate-800 rounded-3xl" /><Pressable className="w-full h-full bg-white items-center justify-center border-2 border-biru-gelap rounded-3xl active:translate-y-0.5 active:translate-x-0.5"><Pause size={28} color="#2C5A64" fill="#2C5A64" /></Pressable></View>
              <View className="w-24 h-24 relative"><View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-3xl" /><Pressable className="w-full h-full bg-merah items-center justify-center border-2 border-biru-gelap rounded-3xl active:translate-y-0.5 active:translate-x-0.5" onPress={() => { stopTracking(); toggleHUD(false); }}><Square size={32} color="white" fill="white" /></Pressable></View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
