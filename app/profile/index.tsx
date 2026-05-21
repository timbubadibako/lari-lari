import { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Platform, StatusBar, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { Settings, Radar, Shield, Users, Bell, EyeOff } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useRunStore } from '@/lib/store';
import { BottomNav } from '@/components/ui/bottom-nav';

export default function ProfileScreen() {
  const { profile, setProfile } = useRunStore();
  const [totalDistance, setTotalDistance] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function getStats() {
      if (!profile) return;
      try {
        const { data: runs } = await supabase.from('runs').select('distance_km').eq('user_id', profile.id);
        if (runs) setTotalDistance(runs.reduce((acc, r) => acc + (r.distance_km || 0), 0));
        const { count } = await supabase.from('territories').select('*', { count: 'exact', head: true }).eq('leader_id', profile.id);
        if (profile) setProfile({ ...profile, territory_count: count || 0 });
      } catch (e) { console.error(e); } finally { setLoadingStats(false); }
    }
    getStats();
  }, [profile?.id]);

  return (
    <View className="flex-1 bg-silver-white" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="relative w-full mb-6 mt-2">
          <View className="absolute top-1.5 left-1.5 w-full h-full bg-slate-900" />
          <View className="bg-merah border-[3px] border-slate-900 p-4 flex-row items-center justify-between">
            <View>
              <Text className="text-[10px] font-bold text-white/80 uppercase tracking-widest">CURRENT STATUS</Text>
              <Text className="font-outfit text-2xl font-black text-white uppercase mt-1 tracking-tight">PILOT STATUS</Text>
            </View>
            <View className="bg-slate-900 px-3 py-1 flex-row items-center gap-2">
               <View className="w-2 h-2 rounded-full bg-merah" />
               <Text className="text-[10px] font-bold text-merah uppercase tracking-widest">ACTIVE</Text>
            </View>
          </View>
        </View>

        <View className="relative w-full mb-6">
          <View className="absolute top-1.5 left-1.5 w-full h-full bg-slate-900" />
          <View className="bg-biru-muda border-[3px] border-slate-900 p-5">
            <Text className="font-outfit text-2xl font-black text-slate-900 uppercase mb-4 tracking-tight">PROFILE SETTINGS</Text>
            <View className="flex-row items-center gap-4">
              <View className="w-16 h-16 rounded-full border-[3px] border-slate-900 overflow-hidden bg-slate-900 relative">
                <Image source={{ uri: profile?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUeLDbNo5N1DWr1zgnfr6lq6nH38NQN4a6n-BakRP-Vk9ax_YUTSEj8XdDGOgNCyw12LAZdIol0rjD6_gjUgstTBUTONp-f5xErbcBnYu-rFGAtiLm9BsdzkMej0TM7mQmVPwxBQ8aCxRxJgqphtomAo_vjlUFkG97gZMZ5ntNPJzK_Z_ypRYQ5BpHM54WeM9RF0PFFoVPpayb5yldrej0Meawyl87alhla8EjSCwZgfsD4Ti8wF_H1IjmuHaCogtEuZWRUdKalr3J' }} className="absolute inset-0 w-full h-full opacity-80" />
              </View>
              <View>
                <Text className="text-[10px] font-bold uppercase text-slate-700 tracking-widest">PILOT ID</Text>
                <Text className="font-outfit text-xl font-bold text-slate-900 uppercase">{profile?.username || 'UNKNOWN'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="relative w-full mb-6">
          <View className="absolute top-1.5 left-1.5 w-full h-full bg-slate-900" />
          <View className="bg-silver-white border-[3px] border-slate-900 p-5">
            <View className="flex-row items-center gap-2 mb-4"><Settings size={20} color="#0f172a" /><Text className="font-outfit text-xl font-black text-slate-900 uppercase tracking-tight">PILOT CONFIG</Text></View>
            <View className="gap-4">
               <View>
                 <Text className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">USERNAME</Text>
                 <View className="relative"><View className="absolute top-1 left-1 w-full h-full bg-slate-900 rounded" /><View className="bg-silver-white border-[3px] border-slate-900 px-3 py-2 rounded"><TextInput value={profile?.username || ''} className="font-bold text-sm text-slate-900 p-0" /></View></View>
               </View>
               <View className="relative mt-2"><View className="absolute top-1 left-1 w-full h-full bg-slate-900" /><Pressable className="bg-merah border-[3px] border-slate-900 py-3 items-center justify-center active:translate-x-1 active:translate-y-1"><Text className="text-white font-bold text-xs uppercase tracking-widest">UPDATE CONFIG</Text></Pressable></View>
            </View>
          </View>
        </View>

        <View className="relative w-full mb-6">
          <View className="absolute top-1.5 left-1.5 w-full h-full bg-slate-900" />
          <View className="bg-biru-muda border-[3px] border-slate-900 p-5">
            <Text className="font-outfit text-2xl font-black text-slate-900 uppercase mb-4 tracking-tight">CUMULATIVE STATS</Text>
            <View className="gap-3">
               <View className="relative"><View className="absolute top-1.5 left-1.5 w-full h-full bg-slate-900" /><View className="bg-silver-white border-[3px] border-slate-900 p-3"><Text className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">TOTAL DISTANCE</Text><Text className="font-outfit text-4xl font-black text-slate-900 tracking-tighter leading-none">{loadingStats ? "..." : totalDistance.toFixed(1)} <Text className="text-sm font-bold">KM</Text></Text></View></View>
               <View className="relative"><View className="absolute top-1.5 left-1.5 w-full h-full bg-slate-900" /><View className="bg-silver-white border-[3px] border-slate-900 p-3"><Text className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">SECTORS CAPTURED</Text><Text className="font-outfit text-4xl font-black text-slate-900 tracking-tighter leading-none">{loadingStats ? "..." : profile?.territory_count} <Text className="text-sm font-bold uppercase">ZONES</Text></Text></View></View>
            </View>
          </View>
        </View>

        <View className="relative w-full mb-8"><View className="absolute top-1.5 left-1.5 w-full h-full bg-slate-900" /><Pressable className="bg-merah border-[3px] border-slate-900 p-4 flex-row items-center justify-center gap-3 active:translate-x-1 active:translate-y-1"><EyeOff size={20} color="white" /><Text className="text-white font-bold text-sm uppercase tracking-widest">ENABLE GHOST MODE</Text></Pressable></View>
        <View className="relative w-full mb-8 items-center px-10"><View className="absolute top-1.5 left-1.5 w-[80%] h-full bg-slate-900" /><Pressable onPress={() => supabase.auth.signOut()} className="w-[80%] bg-silver-white border-[3px] border-slate-900 p-3 items-center justify-center active:translate-x-1 active:translate-y-1"><Text className="text-slate-900 font-black text-xs uppercase tracking-widest">LOGOUT PILOT</Text></Pressable></View>
      </ScrollView>
      <BottomNav activeTab="pilot" />
    </View>
  );
}
