import { View, Text as RNText, SafeAreaView, Platform, StatusBar, ScrollView, TextInput, Image, Pressable } from 'react-native';
import { Search, ChevronRight, Settings, Radar, History as HistoryIcon } from 'lucide-react-native';
import { BottomNav } from '@/components/ui/bottom-nav';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';

export default function HistoryScreen() {
  return (
    <View className="flex-1 bg-midnight-900" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <StatusBar barStyle="light-content" />

      {/* TopAppBar */}
      <View className="z-50 border-b border-white/5 pb-2 bg-midnight-700/70 backdrop-blur-xl">
        <View className="flex-row justify-between items-center px-6 h-16 pt-4">
          <View className="flex-row items-center gap-4">
            <HistoryIcon size={24} color="#38bdf8" />
            <Text className="font-serif italic text-3xl text-white tracking-tighter leading-none mt-1">Intel Logs</Text>
          </View>
          <Pressable className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl items-center justify-center active:scale-95 transition-all">
             <Settings size={20} color="#94a3b8" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Search Bar */}
        <View className="relative mb-8">
            <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Search size={20} color="#64748B" />
            </View>
            <Input placeholder="SEARCH OPERATIONS..." className="pl-12 bg-white/5 border-white/10 rounded-2xl border-0 h-14" />
        </View>

        {/* Filters */}
        <View className="flex-row items-center gap-3 mb-8">
          {['ALL', 'TODAY', 'THIS WEEK'].map(label => (
             <Pressable key={label} className={`px-5 py-2.5 rounded-full border ${label === 'THIS WEEK' ? 'bg-sky-500/10 border-sky-500/30' : 'bg-transparent border-white/10'}`}>
                <Text className={`font-bold text-[10px] uppercase tracking-widest ${label === 'THIS WEEK' ? 'text-sky-400' : 'text-slate-400'}`}>{label}</Text>
             </Pressable>
          ))}
        </View>

        <View className="gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} variant="glass" className="p-0 overflow-hidden rounded-[2rem] flex-row h-32">
                <View className="w-32 h-full bg-slate-800 relative">
                   <Image 
                      source={{ uri: 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/12/2144/1454.png' }} 
                      className="absolute inset-0 w-full h-full opacity-40" 
                   />
                   <View className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/90" />
                   {/* Mock territory highlight */}
                   <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-sky-500/20 border-2 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)] rounded-2xl rotate-12" />
                </View>
                <View className="flex-1 p-5 justify-center">
                   <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-[9px] font-bold text-sky-500 uppercase tracking-widest">MAY {19-i}, 2026</Text>
                      <ChevronRight size={16} color="#475569" />
                   </View>
                   <Text className="font-serif italic text-3xl text-white tracking-tighter leading-none mb-1">
                      {9+i}.32 <Text className="text-sm font-sans not-italic text-slate-500">KM</Text>
                   </Text>
                   <View className="flex-row justify-between items-end mt-1 border-t border-white/5 pt-2">
                      <Text className="text-[10px] font-medium text-slate-400 tracking-widest">⏱ 01:14:02</Text>
                      <Text className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">+{100+i*50} XP</Text>
                   </View>
                </View>
            </Card>
          ))}
        </View>

      </ScrollView>
      <BottomNav activeTab="logs" />
    </View>
  );
}
