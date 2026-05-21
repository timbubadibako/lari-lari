import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Star, Trophy, Shield, Map as MapIcon } from 'lucide-react-native';

interface WidgetPanelProps {
  activeWidget: string | null;
  toggleWidget: (widget: string) => void;
  profile: any;
}

const WidgetButton = ({ icon, isActive, onPress, color = "bg-white" }: any) => (
  <View className="w-10 h-10 relative mb-3">
    <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-xl" />
    <Pressable 
      onPress={onPress}
      className={`absolute top-0 left-0 w-full h-full items-center justify-center border-2 border-biru-gelap rounded-xl active:translate-y-0.5 active:translate-x-0.5 ${isActive ? 'bg-biru-muda translate-y-0.5 translate-x-0.5' : color}`}
    >
      {icon}
    </Pressable>
  </View>
);

export function WidgetPanel({ activeWidget, toggleWidget, profile }: WidgetPanelProps) {
  return (
    <View className="flex-row items-start pointer-events-box-none w-full">
      <View className="flex-col pointer-events-auto">
        <WidgetButton 
            icon={<Star size={20} color={activeWidget === 'level' ? 'white' : '#2C5A64'} fill={activeWidget === 'level' ? 'white' : 'transparent'} />} 
            isActive={activeWidget === 'level'} 
            onPress={() => toggleWidget('level')} 
        />
        <WidgetButton 
            icon={<Trophy size={20} color={activeWidget === 'rank' ? 'white' : '#2C5A64'} />} 
            isActive={activeWidget === 'rank'} 
            onPress={() => toggleWidget('rank')} 
        />
        <WidgetButton 
            icon={<Shield size={20} color={activeWidget === 'guild' ? 'white' : '#2C5A64'} />} 
            isActive={activeWidget === 'guild'} 
            onPress={() => toggleWidget('guild')} 
        />
        <WidgetButton 
            icon={<MapIcon size={20} color={activeWidget === 'territory' ? 'white' : '#2C5A64'} />} 
            isActive={activeWidget === 'territory'} 
            onPress={() => toggleWidget('territory')} 
        />
      </View>

      {activeWidget && (
        <View className="flex-1 ml-4 mt-0.5 pointer-events-auto">
          <View className="relative w-full">
            <View className="absolute top-1.5 left-1.5 right-[-3px] bottom-[-4px] bg-biru-gelap rounded-xl" />
            <View className="bg-white border-2 border-biru-gelap rounded-xl p-3">
              {activeWidget === 'level' && (
                <View>
                  <Text className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Pilot Status</Text>
                  <Text className="font-outfit text-xl font-bold text-slate-900 mt-1">{profile?.username}</Text>
                  <Text className="text-xs font-bold text-biru-gelap mb-2 text-slate-500">Level {profile?.level} Scout</Text>
                  <View className="h-2 w-full bg-slate-100 rounded-full border border-biru-gelap overflow-hidden">
                    <View className="h-full bg-merah" style={{ width: `${(profile?.xp || 0) % 100}%` }} />
                  </View>
                  <Text className="text-[9px] font-bold text-slate-500 mt-1 text-right">{profile?.xp} XP Total</Text>
                </View>
              )}
              {activeWidget === 'guild' && (
                <View className="flex-row items-center gap-3">
                  <Shield size={32} color="#8CC7C4" fill="#8CC7C4" />
                  <View className="flex-1">
                    <Text className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Guild System</Text>
                    <Text className="font-outfit text-sm font-bold text-slate-900">{profile?.level! < 10 ? 'Locked' : 'Available'}</Text>
                    <Text className="text-[10px] font-bold text-biru-gelap mt-0.5 text-slate-500">Reach Lvl 10 to join.</Text>
                  </View>
                </View>
              )}
              {activeWidget === 'rank' && (
                <View className="flex-row items-center gap-3">
                  <Trophy size={32} color="#8CC7C4" />
                  <View className="flex-1">
                    <Text className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">District Rank</Text>
                    <Text className="font-outfit text-xl font-bold text-merah">#--</Text>
                    <Text className="text-[10px] font-bold text-biru-gelap mt-0.5 text-slate-500">Deploy to rank up.</Text>
                  </View>
                </View>
              )}
              {activeWidget === 'territory' && (
                <View className="flex-row items-center gap-3">
                  <MapIcon size={32} color="#8CC7C4" />
                  <View className="flex-1">
                    <Text className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Territories</Text>
                    <Text className="font-outfit text-xl font-bold text-merah">{profile?.territory_count} Areas</Text>
                    <Text className="text-[10px] font-bold text-biru-gelap mt-0.5 text-slate-500">Capture local sectors.</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
