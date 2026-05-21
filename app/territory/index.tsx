import { View, Text, SafeAreaView, Platform, StatusBar, ScrollView, Pressable, Image } from 'react-native';
import { Trophy, Compass, Shield, Search } from 'lucide-react-native';
import { BottomNav } from '@/components/ui/bottom-nav';

export default function TerritoryScreen() {
  return (
    <View className="flex-1 bg-silver-white" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      {/* Scrollable Content */}
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Top Banner - Current Operation */}
        <View className="relative w-full mb-6">
          <View className="absolute top-1.5 left-1.5 w-full h-full bg-biru-gelap" />
          <View className="bg-silver-white border-2 border-biru-gelap p-4 flex-row justify-between items-center">
            <View>
              <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Operation</Text>
              <Text className="font-outfit text-2xl font-black text-slate-900 uppercase mt-1 leading-tight">District{'\n'}Sector</Text>
            </View>
            <View className="bg-merah border-2 border-biru-gelap px-3 py-2">
              <Text className="text-[10px] font-bold text-white uppercase tracking-widest">Reset In: 06D</Text>
              <Text className="font-outfit text-lg font-black text-white uppercase">14H 32M</Text>
            </View>
          </View>
        </View>

        {/* Live Grid Overview Map */}
        <View className="relative w-full mb-6">
          <View className="absolute top-1.5 left-1.5 w-full h-full bg-biru-gelap" />
          <View className="bg-white border-2 border-biru-gelap flex-col overflow-hidden">
            {/* Header */}
            <View className="flex-row justify-between items-center p-3 border-b-2 border-biru-gelap">
              <View className="flex-row items-center gap-2">
                <Compass size={16} color="#1E293B" />
                <Text className="text-xs font-bold text-slate-900 uppercase tracking-widest">Live Grid Overview</Text>
              </View>
              <View className="flex-row gap-3">
                <View className="flex-row items-center gap-1"><View className="w-3 h-3 bg-biru-gelap border border-slate-900" /><Text className="text-[9px] font-bold text-slate-900 uppercase">Guild</Text></View>
                <View className="flex-row items-center gap-1"><View className="w-3 h-3 bg-orange-600 border border-slate-900" /><Text className="text-[9px] font-bold text-slate-900 uppercase">Enemy</Text></View>
              </View>
            </View>
            
            {/* Map Area Mockup (Hexagons) */}
            <View className="w-full h-48 bg-slate-200 items-center justify-center relative overflow-hidden">
               <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AExO-B7s6HhXy51_F854k9_0P-c9B8x6_014C-A2v95k01Z-Yw2_Y83q2X4Q4c89_z9P8Q4E9_11A5x-L8kQ_011B-A7c-C9x9v6_A5A7_Y229G-M7R6x_G5P_285E-G789_A3E0x0Q4N9x90M815K_7_B36_Z5A-G5B-D0y_Y_49-Q29A_P2x0w8Y7G9_90_G-J90-B8x98' }} className="absolute inset-0 w-full h-full opacity-30" resizeMode="cover" />
               <Text className="text-4xl opacity-50 z-10">⬡ ⬢ ⬡</Text>
               <Text className="text-4xl opacity-50 z-10 ml-6 mt-[-15px]">⬢ ⬢ ⬡</Text>
               <Text className="text-4xl opacity-50 z-10 mt-[-15px]">⬡ ⬢ ⬡</Text>
            </View>

            {/* Bottom Button */}
            <Pressable className="bg-biru-gelap p-3 flex-row justify-center items-center gap-2 active:opacity-80">
              <Search size={16} color="white" />
              <Text className="text-white font-bold text-xs uppercase tracking-widest">Expand Sector View</Text>
            </Pressable>
          </View>
        </View>

        {/* Top District Scouts List */}
        <View className="relative w-full">
          <View className="absolute top-1.5 left-1.5 w-full h-full bg-biru-gelap" />
          <View className="bg-silver-white border-2 border-biru-gelap overflow-hidden">
            
            {/* Header */}
            <View className="flex-row justify-between items-center p-4 border-b-2 border-biru-gelap">
               <Text className="font-outfit text-lg font-black text-slate-900 uppercase">Top District Scouts</Text>
               <Trophy size={18} color="#C72222" />
            </View>

            {/* Rank 1 */}
            <View className="bg-biru-muda p-4 border-b-2 border-biru-gelap flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="font-outfit text-3xl font-black text-slate-900 italic w-8">1.</Text>
                <View>
                  <View className="flex-row items-center gap-2">
                    <Text className="font-bold text-lg text-slate-900">@ghostRunner</Text>
                    <View className="bg-biru-gelap px-1.5 py-0.5"><Text className="text-[8px] font-bold text-white uppercase tracking-widest">Teal Badge</Text></View>
                  </View>
                  <Text className="text-xs text-biru-gelap font-bold">Kec. Kuningan, 14 Sectors</Text>
                </View>
              </View>
              <Shield size={24} color="#2C5A64" fill="#2C5A64" />
            </View>

            {/* Rank 2 */}
            <View className="bg-silver-white p-4 border-b-2 border-biru-gelap flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="font-outfit text-2xl font-black text-slate-500 italic w-8">2.</Text>
                <View>
                  <Text className="font-bold text-base text-slate-900">@urban_ninja</Text>
                  <Text className="text-xs text-slate-500 font-bold">Senen, 11 Sectors</Text>
                </View>
              </View>
            </View>

            {/* Rank 3 */}
            <View className="bg-silver-white p-4 border-b-2 border-biru-gelap flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="font-outfit text-2xl font-black text-slate-500 italic w-8">3.</Text>
                <View>
                  <Text className="font-bold text-base text-slate-900">@velocity_x</Text>
                  <Text className="text-xs text-slate-500 font-bold">Gambir, 9 Sectors</Text>
                </View>
              </View>
            </View>

            {/* View Full Rankings */}
            <Pressable className="p-4 items-center justify-center active:bg-slate-200">
               <Text className="text-merah font-bold text-xs uppercase tracking-widest underline decoration-2 underline-offset-4">View Full Rankings</Text>
            </Pressable>

          </View>
        </View>

      </ScrollView>
    </View>
  );
}