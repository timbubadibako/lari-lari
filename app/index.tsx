import { View, Image, Pressable, Platform, StatusBar, ActivityIndicator, LayoutAnimation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Map, MapUserLocation, MapRoute, GeoJSONSource, Layer } from '@/components/ui/map';
import { Text } from '@/components/ui/text';
import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { useRunStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { BottomNav } from '@/components/ui/bottom-nav';

// Modular Components
import { TopBar } from '@/components/dashboard/top-bar';
import { WidgetPanel } from '@/components/dashboard/widget-panel';
import { ActionButtons } from '@/components/dashboard/action-buttons';
import { HUDOverlay } from '@/components/dashboard/hud-overlay';
import { VictoryModal } from '@/components/dashboard/victory-modal';

// Helper to format time
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatPace = (paceMinutes: number) => {
  if (paceMinutes === 0 || !isFinite(paceMinutes)) return "--'--\"";
  const m = Math.floor(paceMinutes);
  const s = Math.floor((paceMinutes - m) * 60);
  return `${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`;
};

export default function HomeScreen() {
  const { isTracking, startTracking, stopTracking, updateTick, elapsedTime, distance, pace, route, addRoutePoint, profile, setProfile, territories, setTerritories, isHUDActive, setHUDActive, isSimulating, setSimulating } = useRunStore();

  const [initialRegion, setInitialRegion] = useState<[number, number]>([106.8272, -6.1751]); 
  const [activeWidget, setActiveWidget] = useState<string | null>('level');
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [bellClicks, setBellClicks] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Recenter logic
  const handleRecenter = async () => {
    try {
      const location = await Location.getLastKnownPositionAsync({}) || await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced, timeout: 3000 });
      if (location) {
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
        setSimulating(true);
        if (!isTracking) startTracking();
        setHUDActive(true);
        const [baseLng, baseLat] = initialRegion;
        const testCoords = [
          [baseLng, baseLat],
          [baseLng + 0.001, baseLat],
          [baseLng + 0.002, baseLat],
          [baseLng + 0.002, baseLat - 0.0006],
          [baseLng + 0.002, baseLat - 0.0012],
          [baseLng + 0.0015, baseLat - 0.0012],
          [baseLng + 0.0008, baseLat - 0.0012],
          [baseLng, baseLat - 0.0012],
          [baseLng, baseLat - 0.0008],
          [baseLng, baseLat - 0.0004],
          [baseLng, baseLat] 
        ];
        testCoords.forEach((coord, i) => {
          setTimeout(() => { addRoutePoint(coord as [number, number]); }, i * 800); 
        });
        return 0;
      }
      return newCount;
    });
  };

  const toggleWidget = (widget: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveWidget(activeWidget === widget ? null : widget);
  };

  // Initial Sync
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        const { count: tCount } = await supabase.from('territories').select('*', { count: 'exact', head: true }).eq('leader_id', user.id);
        if (p) {
          setProfile({ id: p.id, username: p.username || 'Pilot', display_name: p.display_name || 'Pilot', level: p.level || 1, xp: p.xp || 0, territory_count: tCount || 0 });
        }
        const { data: t } = await supabase.from('territories').select('id, name, boundary, leader_id');
        if (t) setTerritories(t.map(x => ({ ...x, boundary: typeof x.boundary === 'string' ? JSON.parse(x.boundary) : x.boundary })));
      } catch (e) { console.error(e); } finally { setFetchingProfile(false); }
    }
    fetchData();
  }, []);

  // FIXED TIMER: Uses ref to ensure strict 1s intervals
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isTracking) {
       if (timerRef.current) clearInterval(timerRef.current);
       timerRef.current = setInterval(() => {
         updateTick();
       }, 1000);
    } else {
       if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
       }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTracking]);

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;
    if (isTracking && !isSimulating) {
      (async () => {
        try {
          sub = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 }, (loc) => {
            addRoutePoint([loc.coords.longitude, loc.coords.latitude]);
          });
        } catch (e) { console.warn("GPS error:", e); }
      })();
    }
    return () => sub?.remove();
  }, [isTracking, isSimulating]);

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
      {/* 1. MAP LAYER */}
      <View className="absolute inset-0 z-0">
        <Map center={initialRegion} zoom={15} showLoader={false} styles={{ light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", dark: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" }}>
          <MapUserLocation />
          {territories.map((t) => (
            <GeoJSONSource key={t.id} id={`source-${t.id}`} data={t.boundary}>
              <Layer id={`fill-${t.id}`} type="fill" paint={{ fillColor: t.leader_id === profile?.id ? '#C72222' : '#2C5A64', fillOpacity: 0.4 }} />
              <Layer id={`line-${t.id}`} type="line" paint={{ lineColor: '#2C5A64', lineWidth: 3 }} />
            </GeoJSONSource>
          ))}
          {route.length > 1 ? <MapRoute coordinates={route} color="#C72222" width={6} opacity={1} /> : null}
        </Map>
      </View>

      {/* 2. OVERLAY UI */}
      {!showSummary && (
        <>
          {!isHUDActive && <TopBar profile={profile} onBellPress={triggerTestMode} />}

          <SafeAreaView className="flex-1 pointer-events-box-none z-40">
            {!isHUDActive ? (
              <View className="flex-1 justify-between pointer-events-box-none p-4" style={{ marginTop: 60, marginBottom: 84 }}>
                <WidgetPanel activeWidget={activeWidget} toggleWidget={toggleWidget} profile={profile} />
                <ActionButtons 
                  isTracking={isTracking} 
                  onRecenter={handleRecenter} 
                  onStart={() => { if (!isTracking) startTracking(); setHUDActive(true); }} 
                  onMaximizeHUD={() => setHUDActive(true)}
                  elapsedTime={elapsedTime}
                  distance={distance}
                  formatTime={formatTime}
                />
              </View>
            ) : (
              <HUDOverlay 
                elapsedTime={elapsedTime} 
                distance={distance} 
                pace={pace} 
                formatTime={formatTime} 
                formatPace={formatPace} 
                onMinimize={() => setHUDActive(false)} 
                onStop={async () => { 
                  await stopTracking(); 
                  setHUDActive(false); 
                  setShowSummary(true); 
                }} 
              />
            )}
          </SafeAreaView>
          
          {/* Bottom Nav inside screen to ensure Navigation Context */}
          {!isHUDActive && <BottomNav activeTab="maps" />}
        </>
      )}

      {/* 3. VICTORY MODAL (ABSOLUTE ROOT LEVEL) */}
      {showSummary && <VictoryModal onClose={() => setShowSummary(false)} />}
    </View>
  );
}
