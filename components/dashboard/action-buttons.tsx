import { View, Pressable } from 'react-native';
import { Play, RotateCcw, Target } from 'lucide-react-native';
import { Text } from '@/components/ui/text';

interface ActionButtonsProps {
  isTracking: boolean;
  onRecenter: () => void;
  onStart: () => void;
  onMaximizeHUD: () => void;
  elapsedTime: number;
  distance: number;
  formatTime: (s: number) => string;
}

export function ActionButtons({ isTracking, onRecenter, onStart, onMaximizeHUD, elapsedTime, distance, formatTime }: ActionButtonsProps) {
  return (
    <View className="pointer-events-box-none items-end pb-4 pr-4 gap-4">
      {/* Recenter Target Button */}
      <View className="z-50 p-1 mb-[-4px] pointer-events-auto">
        <View className="w-12 h-12 relative">
          <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-xl" />
          <Pressable 
            className="w-full h-full bg-white items-center justify-center border-2 border-biru-gelap rounded-xl active:translate-y-0.5 active:translate-x-0.5"
            onPress={onRecenter}
          >
            <Target size={24} color="#2C5A64" />
          </Pressable>
        </View>
      </View>

      <View className="flex-row items-end gap-4 pointer-events-box-none w-full justify-end">
        {/* Minimized Summary Banner */}
        {isTracking && (
          <View className="flex-1 ml-4 relative pointer-events-auto">
            <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-2xl" />
            <Pressable 
              className="bg-white border-2 border-biru-gelap rounded-2xl p-3 flex-row items-center justify-around active:translate-y-0.5 active:translate-x-0.5 h-16"
              onPress={onMaximizeHUD}
            >
              <View className="items-center">
                <Text className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">TIME</Text>
                <Text className="font-mono text-sm font-bold text-slate-900">{formatTime(elapsedTime)}</Text>
              </View>
              <View className="items-center">
                <Text className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">DIST</Text>
                <View className="flex-row items-baseline gap-1">
                  <Text className="font-mono text-sm font-bold text-slate-900">{distance.toFixed(2)}</Text>
                  <Text className="text-[10px] font-bold text-slate-500">km</Text>
                </View>
              </View>
            </Pressable>
          </View>
        )}

        {/* Start / Resume Button */}
        <View className="w-16 h-16 relative pointer-events-auto">
          <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-2xl" />
          <Pressable 
            className="w-full h-full bg-white items-center justify-center border-2 border-biru-gelap rounded-2xl active:translate-y-0.5 active:translate-x-0.5"
            onPress={onStart}
          >
            {isTracking ? (
              <RotateCcw size={28} color="#0891B2" strokeWidth={3} />
            ) : (
              <Play size={28} color="#C72222" strokeWidth={3} className="ml-1" />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
