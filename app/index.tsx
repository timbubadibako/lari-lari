import { View, Pressable, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Map, MapUserLocation, MapRoute, GeoJSONSource, Layer } from '@/components/ui/map';
import { Text } from '@/components/ui/text';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useRunStore } from '@/lib/store';
import { BottomNav } from '@/components/ui/bottom-nav';
import { Settings, Shield, ChevronRight, Activity, Crosshair } from 'lucide-react-native';

export default function HomeScreen() {
  const [initialRegion, setInitialRegion] = useState<[number, number]>([106.8272, -6.1751]); 
  
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

  return (
    <View className="flex-1 bg-midnight-900">
      <StatusBar barStyle="light-content" />

      {/* 1. MAP LAYER (Dark Mode) */}
      <View className="absolute inset-0 z-0 opacity-80">
        <Map center={initialRegion} zoom={15} showLoader={false}>
          <MapUserLocation />
          {/* Mock Territory highlighting for Midnight Sapphire */}
          <GeoJSONSource id="mock-territory" data={{
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[[initialRegion[0]-0.005, initialRegion[1]-0.005], [initialRegion[0]+0.005, initialRegion[1]-0.005], [initialRegion[0]+0.005, initialRegion[1]+0.005], [initialRegion[0]-0.005, initialRegion[1]+0.005], [initialRegion[0]-0.005, initialRegion[1]-0.005]]]
            },
            properties: {}
          }}>
            <Layer id="fill-mock" type="fill" paint={{ fillColor: '#0ea5e9', fillOpacity: 0.15 }} />
            <Layer id="line-mock" type="line" paint={{ lineColor: '#0ea5e9', lineWidth: 2 }} />
          </GeoJSONSource>
        </Map>
      </View>

      <SafeAreaView className="flex-1 pointer-events-box-none z-10">
        
        {/* Top Status Bar */}
        <View className="flex-row justify-between items-start px-6 pt-4 pointer-events-auto">
          <View className="bg-midnight-700/80 backdrop-blur-xl border border-sky-500/10 px-4 py-3 rounded-2xl flex-row items-center gap-4">
            <View className="w-10 h-10 rounded-full bg-sky-500 items-center justify-center">
              <Text className="font-serif italic text-slate-900 font-bold text-lg">Z</Text>
            </View>
            <View>
              <Text className="text-[9px] uppercase tracking-widest text-slate-500">Operative Rank</Text>
              <Text className="text-xs font-bold text-sky-400">Zenith Vanguard</Text>
            </View>
          </View>
          <Pressable className="bg-midnight-700/80 backdrop-blur-xl border border-sky-500/10 w-12 h-12 rounded-2xl items-center justify-center active:scale-90">
            <Settings size={24} color="#94a3b8" strokeWidth={1.5} />
          </Pressable>
        </View>

        {/* Left Vertical Nav (Tactical Actions) */}
        <View className="absolute left-6 top-[30%] space-y-3 pointer-events-auto">
          <Pressable className="bg-midnight-700/80 backdrop-blur-xl w-12 h-12 rounded-xl items-center justify-center border-r-2 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.2)]">
            <Crosshair size={20} color="#38bdf8" />
          </Pressable>
          <Pressable className="bg-midnight-700/80 backdrop-blur-xl border border-white/5 w-12 h-12 rounded-xl items-center justify-center">
            <Shield size={20} color="#64748b" />
          </Pressable>
          <Pressable className="bg-midnight-700/80 backdrop-blur-xl border border-white/5 w-12 h-12 rounded-xl items-center justify-center">
            <Activity size={20} color="#64748b" />
          </Pressable>
        </View>

        {/* Bottom Controls (Above BottomNav) */}
        <View className="absolute bottom-28 left-6 right-6 pointer-events-auto">
          <View className="flex-row justify-between items-end mb-6">
            <View className="bg-midnight-700/80 backdrop-blur-xl border border-white/5 p-5 rounded-[2rem] border-l-2 border-l-sky-500 min-w-[150px]">
              <Text className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Dominion Area</Text>
              <Text className="text-3xl font-serif italic text-white leading-none">
                42.8 <Text className="text-[10px] font-sans not-italic text-slate-500">KM²</Text>
              </Text>
            </View>
            <Pressable className="w-14 h-14 bg-midnight-700/80 backdrop-blur-xl border border-white/5 rounded-full items-center justify-center shadow-lg active:scale-90 transition-transform">
              <Crosshair size={24} color="#38bdf8" />
            </Pressable>
          </View>

          <Pressable className="w-full bg-white py-5 rounded-full shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95 transition-all items-center justify-center">
            <Text className="text-slate-900 font-serif italic text-2xl tracking-tight leading-none">
              Commence Mission
            </Text>
          </Pressable>
        </View>

      </SafeAreaView>

      {/* Docked Bottom Nav */}
      <BottomNav activeTab="maps" />
    </View>
  );
}
