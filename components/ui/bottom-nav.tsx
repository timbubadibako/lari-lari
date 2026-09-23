import { View, Pressable, Platform } from 'react-native';
import { History, Shield, User, Map as MapIcon, Crosshair } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface BottomNavProps {
  activeTab: 'maps' | 'territory' | 'logs' | 'pilot';
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const router = useRouter();

  return (
    <View className="absolute bottom-8 left-0 right-0 items-center pointer-events-box-none" style={{ zIndex: 50 }}>
      <View className="w-[90%] max-w-sm bg-midnight-700/80 border border-white/10 py-4 px-8 rounded-full flex-row justify-between items-center shadow-2xl">
        
        {/* Map Tab */}
        <Pressable onPress={() => router.push('/')} className="items-center justify-center relative">
          <MapIcon size={24} color={activeTab === 'maps' ? "#38bdf8" : "#64748b"} strokeWidth={activeTab === 'maps' ? 2 : 1.5} />
          {activeTab === 'maps' && (
            <View className="absolute -bottom-3 w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
          )}
        </Pressable>

        {/* Territory Tab */}
        <Pressable onPress={() => router.push('/territory')} className="items-center justify-center relative">
          <Shield size={24} color={activeTab === 'territory' ? "#38bdf8" : "#64748b"} strokeWidth={activeTab === 'territory' ? 2 : 1.5} />
          {activeTab === 'territory' && (
            <View className="absolute -bottom-3 w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
          )}
        </Pressable>

        {/* Center Action Button (Placeholder) */}
        <View className="w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center -mt-12 shadow-lg border-[4px] border-[#010413]">
           <Crosshair size={24} color="#000000" strokeWidth={2.5} />
        </View>

        {/* History Tab */}
        <Pressable onPress={() => router.push('/history')} className="items-center justify-center relative">
          <History size={24} color={activeTab === 'logs' ? "#38bdf8" : "#64748b"} strokeWidth={activeTab === 'logs' ? 2 : 1.5} />
          {activeTab === 'logs' && (
            <View className="absolute -bottom-3 w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
          )}
        </Pressable>

        {/* Profile Tab */}
        <Pressable onPress={() => router.push('/profile')} className="items-center justify-center relative">
          <User size={24} color={activeTab === 'pilot' ? "#38bdf8" : "#64748b"} strokeWidth={activeTab === 'pilot' ? 2 : 1.5} />
          {activeTab === 'pilot' && (
            <View className="absolute -bottom-3 w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
          )}
        </Pressable>

      </View>
    </View>
  );
}
