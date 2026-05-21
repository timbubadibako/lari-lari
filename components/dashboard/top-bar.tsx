import { View, Image, Pressable, Platform, StatusBar } from 'react-native';
import { Text } from '@/components/ui/text';
import { LogOut, Bell } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface TopBarProps {
  profile: any;
  onBellPress: () => void;
}

export function TopBar({ profile, onBellPress }: TopBarProps) {
  return (
    <View 
      className="absolute top-0 left-0 right-0 z-50 bg-white border-b-2 border-biru-gelap" 
      style={{ paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 44 }}
    >
      <View className="flex-row justify-between items-center px-4 h-16">
        {/* LEFT: Avatar & Pilot Greeting */}
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 relative">
            <View className="absolute top-0.5 left-0.5 w-full h-full bg-biru-gelap rounded-lg" />
            <View className="w-full h-full border-2 border-biru-gelap overflow-hidden bg-biru-muda rounded-lg">
              <Image source={{ uri: profile?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUeLDbNo5N1DWr1zgnfr6lq6nH38NQN4a6n-BakRP-Vk9ax_YUTSEj8XdDGOgNCyw12LAZdIol0rjD6_gjUgstTBUTONp-f5xErbcBnYu-rFGAtiLm9BsdzkMej0TM7mQmVPwxBQ8aCxRxJgqphtomAo_vjlUFkG97gZMZ5ntNPJzK_Z_ypRYQ5BpHM54WeM9RF0PFFoVPpayb5yldrej0Meawyl87alhla8EjSCwZgfsD4Ti8wF_H1IjmuHaCogtEuZWRUdKalr3J' }} className="w-full h-full" />
            </View>
          </View>
          <View>
            <Text className="text-[9px] font-bold uppercase text-slate-500 tracking-widest leading-none mb-0.5">Ready to Deploy,</Text>
            <Text className="font-outfit text-base font-black text-slate-900 uppercase leading-tight">@{profile?.username || 'streetRunner'}</Text>
          </View>
        </View>

        {/* RIGHT: Actions */}
        <View className="flex-row items-center gap-3">
           <Pressable onPress={() => supabase.auth.signOut()} className="active:scale-90 p-1">
             <LogOut size={20} color="#2C5A64" />
           </Pressable>
           
           <View className="flex-row items-center">
             <Pressable 
               className="w-10 h-10 relative active:translate-x-0.5 active:translate-y-0.5"
               onPress={onBellPress}
             >
               <View className="absolute top-0.5 left-0.5 w-full h-full bg-biru-gelap rounded-lg" />
               <View className="w-full h-full bg-white border-2 border-biru-gelap rounded-lg items-center justify-center">
                 <Bell size={20} color="#2C5A64" strokeWidth={2.5} />
                 <View className="absolute -top-1 -right-1 bg-merah border border-biru-gelap w-3.5 h-3.5 rounded-md items-center justify-center">
                   <Text className="text-[8px] font-extrabold text-white leading-none">!</Text>
                 </View>
               </View>
             </Pressable>
           </View>
        </View>
      </View>
    </View>
  );
}
