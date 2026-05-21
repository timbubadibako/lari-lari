import { View, Text, SafeAreaView, Platform, StatusBar, ScrollView, TextInput, Image, Pressable } from 'react-native';
import { Search, ChevronRight, Settings, Radar } from 'lucide-react-native';
import { BottomNav } from '@/components/ui/bottom-nav';

export default function HistoryScreen() {
  return (
    <View className="flex-1 bg-silver-white" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      {/* TopAppBar */}
      <View className="z-50 bg-silver-white border-b-[3px] border-slate-900 pb-2">
        <View className="flex-row justify-between items-center px-4 h-16">
          <View className="flex-row items-center gap-2">
            <Radar size={28} color="#C72222" />
            <Text className="font-outfit text-3xl font-black tracking-tighter text-merah uppercase">LARI</Text>
          </View>
          <View className="relative">
             <View className="absolute top-1 left-1 w-full h-full bg-slate-900" />
             <Pressable className="bg-silver-white border-[3px] border-slate-900 p-1.5 active:translate-x-1 active:translate-y-1">
               <Settings size={24} color="#0f172a" />
             </Pressable>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 100 }}>
        
        <View className="relative w-full mb-6 mt-2">
          <View className="absolute top-2 left-2 w-full h-full bg-slate-900" />
          <View className="bg-silver-white border-[3px] border-slate-900 p-5">
            <Text className="font-outfit text-3xl font-black text-slate-900 uppercase mb-4 tracking-tight">FLIGHT LOGS</Text>
            <View className="relative w-full">
              <View className="absolute top-1 left-1 w-full h-full bg-slate-900" />
              <View className="flex-row items-center bg-silver-white border-[3px] border-slate-900 px-3 h-12">
                <Search size={20} color="#64748B" />
                <TextInput placeholder="SEARCH SESSIONS..." placeholderTextColor="#94A3B8" className="flex-1 ml-3 font-outfit font-bold text-sm tracking-widest uppercase text-slate-900" />
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-3 mb-8 px-1">
          {['ALL', 'TODAY', 'THIS WEEK'].map(label => (
             <View key={label} className="relative">
                <View className="absolute top-1 left-1 w-full h-full bg-slate-900" />
                <Pressable className={`border-[3px] border-slate-900 px-4 py-1.5 active:translate-x-1 active:translate-y-1 ${label === 'THIS WEEK' ? 'bg-biru-muda' : 'bg-silver-white'}`}>
                  <Text className="font-bold text-xs uppercase tracking-widest text-slate-900">{label}</Text>
                </Pressable>
             </View>
          ))}
        </View>

        <View className="gap-6 px-1">
          {[1, 2, 3].map(i => (
            <View key={i} className="relative w-full">
              <View className="absolute top-2 left-2 w-full h-full bg-slate-900" />
              <View className="bg-silver-white border-[3px] border-slate-900 p-3 flex-row items-center gap-4">
                <View className="w-24 h-24 bg-slate-900 border-[3px] border-slate-900 relative overflow-hidden">
                   <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUeLDbNo5N1DWr1zgnfr6lq6nH38NQN4a6n-BakRP-Vk9ax_YUTSEj8XdDGOgNCyw12LAZdIol0rjD6_gjUgstTBUTONp-f5xErbcBnYu-rFGAtiLm9BsdzkMej0TM7mQmVPwxBQ8aCxRxJgqphtomAo_vjlUFkG97gZMZ5ntNPJzK_Z_ypRYQ5BpHM54WeM9RF0PFFoVPpayb5yldrej0Meawyl87alhla8EjSCwZgfsD4Ti8wF_H1IjmuHaCogtEuZWRUdKalr3J' }} className="absolute inset-0 w-full h-full opacity-40" />
                </View>
                <View className="flex-1 justify-center py-1">
                   <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">MAY {19-i}, 2026</Text>
                      <ChevronRight size={16} color="#0f172a" />
                   </View>
                   <Text className="font-outfit text-3xl font-black text-slate-900 tracking-tighter leading-none mb-1">{9+i}.32 <Text className="text-sm">KM</Text></Text>
                   <View className="flex-row justify-between items-end mt-1">
                      <Text className="text-xs font-bold text-slate-600 tracking-widest">⏱ 01:14:02</Text>
                      <View className="relative">
                         <View className="absolute top-[2px] left-[2px] w-full h-full bg-slate-900" />
                         <View className="bg-biru-muda border-2 border-slate-900 px-2 py-0.5">
                            <Text className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{100+i*50} XP</Text>
                         </View>
                      </View>
                   </View>
                </View>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
      <BottomNav activeTab="logs" />
    </View>
  );
}
