import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Home, History, Trophy, User, Map as MapIcon } from 'lucide-react-native';
import { Link, usePathname } from 'expo-router';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <View className="absolute bottom-0 left-0 right-0 z-50 bg-white h-20 border-t-2 border-biru-gelap flex-row justify-around items-center px-2 pb-2">
      <Link href="/" asChild>
        <Pressable className={`items-center justify-center px-4 py-2 rounded-xl active:translate-y-0.5 ${pathname === '/' ? 'bg-merah border-2 border-biru-gelap' : 'opacity-60'}`}>
          <MapIcon size={24} color={pathname === '/' ? "white" : "#2C5A64"} />
          <Text className={`text-[10px] font-bold mt-1 uppercase ${pathname === '/' ? 'text-white' : 'text-biru-gelap'}`}>Maps</Text>
        </Pressable>
      </Link>
      
      <Link href="/territory" asChild>
        <Pressable className={`items-center justify-center px-4 py-2 rounded-xl active:translate-y-0.5 ${pathname === '/territory' ? 'bg-merah border-2 border-biru-gelap' : 'opacity-60'}`}>
          <Trophy size={24} color={pathname === '/territory' ? "white" : "#2C5A64"} />
          <Text className={`text-[10px] font-bold mt-1 uppercase ${pathname === '/territory' ? 'text-white' : 'text-biru-gelap'}`}>Territory</Text>
        </Pressable>
      </Link>
      
      <Link href="/history" asChild>
        <Pressable className={`items-center justify-center px-4 py-2 rounded-xl active:translate-y-0.5 ${pathname === '/history' ? 'bg-merah border-2 border-biru-gelap' : 'opacity-60'}`}>
          <History size={24} color={pathname === '/history' ? "white" : "#2C5A64"} />
          <Text className={`text-[10px] font-bold mt-1 uppercase ${pathname === '/history' ? 'text-white' : 'text-biru-gelap'}`}>Logs</Text>
        </Pressable>
      </Link>
      
      <Link href="/profile" asChild>
        <Pressable className={`items-center justify-center px-4 py-2 rounded-xl active:translate-y-0.5 ${pathname === '/profile' ? 'bg-merah border-2 border-biru-gelap' : 'opacity-60'}`}>
          <User size={24} color={pathname === '/profile' ? "white" : "#2C5A64"} />
          <Text className={`text-[10px] font-bold mt-1 uppercase ${pathname === '/profile' ? 'text-white' : 'text-biru-gelap'}`}>Pilot</Text>
        </Pressable>
      </Link>
    </View>
  );
}
