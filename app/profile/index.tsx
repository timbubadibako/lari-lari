import { useState, useEffect } from 'react';
import { View, Text as RNText, SafeAreaView, Platform, StatusBar, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { Settings, Shield, User, Map as MapIcon, ChevronRight, EyeOff, LogOut } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useRunStore } from '@/lib/store';
import { BottomNav } from '@/components/ui/bottom-nav';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    <View className="flex-1 bg-midnight-900" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <StatusBar barStyle="light-content" />
      
      {/* TopAppBar */}
      <View className="z-50 border-b border-white/5 pb-2 bg-midnight-700/70 backdrop-blur-xl">
        <View className="flex-row justify-between items-center px-6 h-16 pt-4">
          <View className="flex-row items-center gap-4">
            <User size={24} color="#38bdf8" />
            <Text className="font-serif italic text-3xl text-white tracking-tighter leading-none mt-1">Identity</Text>
          </View>
          <Pressable className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl items-center justify-center active:scale-95 transition-all">
             <Settings size={20} color="#94a3b8" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Profile Identity Card */}
        <Card variant="sapphire" className="mb-6 flex-row items-center gap-6 p-8">
           <View className="w-20 h-20 rounded-full border border-sky-500/30 overflow-hidden bg-slate-800 relative">
             <Image source={{ uri: profile?.avatar_url || 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/12/2144/1454.png' }} className="absolute inset-0 w-full h-full opacity-80" />
           </View>
           <View className="flex-1">
             <Text className="text-[10px] font-bold uppercase text-sky-600 tracking-[0.3em] mb-1">Operative Designation</Text>
             <Text className="font-serif italic text-3xl font-bold text-white leading-none">{profile?.username || 'UNKNOWN'}</Text>
             <View className="mt-3 flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                <Text className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Active Link</Text>
             </View>
           </View>
        </Card>

        {/* Configuration */}
        <Card variant="glass" className="mb-6 p-8">
           <View className="flex-row items-center gap-4 mb-6">
              <Settings size={20} color="#38bdf8" />
              <Text className="font-serif italic text-2xl text-white">Configuration</Text>
           </View>
           <View className="space-y-6">
              <View>
                 <RNText className="text-[9px] uppercase tracking-widest text-slate-500 mb-2">Display Name</RNText>
                 <Input value={profile?.username || ''} />
              </View>
              <Button variant="sapphireGlass" size="sm" className="w-full">
                 <Text className="text-sky-400 font-bold text-xs uppercase tracking-widest">Update Data</Text>
              </Button>
           </View>
        </Card>

        {/* Stats */}
        <Card variant="glass" className="mb-8 p-8 border-l-2 border-l-sky-500">
            <Text className="font-serif italic text-2xl text-white mb-6">Cumulative Data</Text>
            <View className="grid grid-cols-2 gap-4 flex-row">
               <View className="flex-1 bg-white/5 p-5 rounded-3xl border border-white/5">
                   <Text className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Distance</Text>
                   <Text className="font-serif italic text-3xl font-bold text-white tracking-tighter leading-none">{loadingStats ? "..." : totalDistance.toFixed(1)} <Text className="text-sm font-sans not-italic text-slate-500">KM</Text></Text>
               </View>
               <View className="flex-1 bg-white/5 p-5 rounded-3xl border border-white/5">
                   <Text className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Sectors Secured</Text>
                   <Text className="font-serif italic text-3xl font-bold text-white tracking-tighter leading-none">{loadingStats ? "..." : profile?.territory_count}</Text>
               </View>
            </View>
        </Card>

        {/* Actions */}
        <View className="space-y-4">
           <Button variant="glass" className="w-full justify-start pl-6 gap-4 border-l-2 border-l-slate-700">
              <EyeOff size={20} color="#94a3b8" />
              <Text className="text-white font-bold text-xs uppercase tracking-widest">Enable Ghost Mode</Text>
           </Button>
           <Button variant="ghost" onPress={() => supabase.auth.signOut()} className="w-full justify-start pl-6 gap-4">
              <LogOut size={20} color="#ef4444" />
              <Text className="text-red-500 font-bold text-xs uppercase tracking-widest">Disconnect Link</Text>
           </Button>
        </View>

      </ScrollView>
      <BottomNav activeTab="pilot" />
    </View>
  );
}
