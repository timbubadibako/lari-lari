import { View, Text as RNText, SafeAreaView, Platform, StatusBar, ScrollView, Pressable, Image } from 'react-native';
import { Shield, Search, Map as MapIcon, ChevronRight } from 'lucide-react-native';
import { BottomNav } from '@/components/ui/bottom-nav';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

export default function TerritoryScreen() {
  return (
    <View className="flex-1 bg-midnight-900" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Header */}
        <View className="mb-10 mt-6 text-center items-center">
          <Text className="text-xs font-bold uppercase tracking-[0.4em] text-sky-500 mb-2">Dominion Status</Text>
          <Text className="text-5xl font-serif italic text-white">Sectors</Text>
        </View>

        {/* Current Operation Card */}
        <Card variant="sapphire" className="mb-6">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-[9px] uppercase tracking-[0.3em] text-sky-600 font-bold mb-2">Current Operation</Text>
              <Text className="text-3xl font-serif italic text-white leading-none">South District</Text>
            </View>
            <View className="items-end">
              <Text className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Reset In</Text>
              <Text className="text-xl font-bold text-sky-400">14H 32M</Text>
            </View>
          </View>
        </Card>

        {/* Mini Map Fragment */}
        <Card variant="glass" className="mb-6 p-0 overflow-hidden border border-white/5 rounded-[2.5rem]">
           <View className="h-48 relative bg-slate-800">
             <Image 
                source={{ uri: 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/12/2144/1454.png' }} 
                className="absolute inset-0 w-full h-full opacity-40" 
                resizeMode="cover" 
             />
             <View className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
             <View className="absolute bottom-6 left-1/2 -translate-x-1/2 flex-row gap-2">
                 <View className="w-2 h-2 rounded-full bg-sky-500" />
                 <View className="w-2 h-2 rounded-full bg-slate-700" />
                 <View className="w-2 h-2 rounded-full bg-slate-700" />
             </View>
             
             {/* Mock territory highlight */}
             <View className="absolute top-10 left-10 w-24 h-24 bg-sky-500/20 border-2 border-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.3)] rounded-3xl rotate-12" />
           </View>
           <View className="p-8 flex-row justify-between items-center">
             <View>
               <Text className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Live Grid Overview</Text>
               <Text className="text-lg font-serif italic text-white">Central Network</Text>
             </View>
             <Pressable className="bg-sky-500/10 border border-sky-500/30 w-12 h-12 rounded-2xl items-center justify-center">
               <Search size={20} color="#38bdf8" />
             </Pressable>
           </View>
        </Card>

        {/* Top District Scouts (Leaderboard) */}
        <Card variant="glass" className="mb-6 p-0 overflow-hidden border border-white/5 rounded-[2.5rem]">
           <View className="p-8 border-b border-white/5 flex-row justify-between items-center">
             <Text className="text-xs uppercase tracking-widest font-bold text-slate-400">Top District Operatives</Text>
             <Shield size={16} color="#38bdf8" />
           </View>

           {/* Rank 1 */}
           <View className="p-6 px-8 bg-sky-500/5 border-b border-white/5 flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <Text className="text-4xl font-serif italic font-bold text-sky-400 w-10">1.</Text>
                <View>
                  <Text className="font-bold text-base text-white">@ghostRunner</Text>
                  <Text className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">14 Sectors Secured</Text>
                </View>
              </View>
              <View className="w-8 h-8 rounded-full border border-sky-500/30 flex items-center justify-center bg-sky-500/10">
                 <Shield size={14} color="#38bdf8" />
              </View>
           </View>

           {/* Rank 2 & 3 */}
           {[2, 3].map(rank => (
             <View key={rank} className="p-6 px-8 border-b border-white/5 flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <Text className="text-2xl font-serif italic font-bold text-slate-600 w-10">{rank}.</Text>
                  <View>
                    <Text className="font-medium text-sm text-slate-300">@runner_{rank}</Text>
                    <Text className="text-[9px] uppercase tracking-widest text-slate-600 mt-1">{15 - rank} Sectors Secured</Text>
                  </View>
                </View>
             </View>
           ))}

           <Pressable className="p-6 items-center justify-center bg-white/5 active:bg-white/10 flex-row gap-2">
              <Text className="text-xs uppercase tracking-widest font-bold text-slate-400">Access Global Rankings</Text>
              <ChevronRight size={14} color="#94a3b8" />
           </Pressable>
        </Card>

      </ScrollView>

      <BottomNav activeTab="territory" />
    </View>
  );
}
