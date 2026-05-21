import { View, Pressable, Image, ScrollView, Text, Platform } from 'react-native';
import { Trophy, Share2, X, Map as MapIcon } from 'lucide-react-native';
import { useRunStore } from '@/lib/store';

interface VictoryModalProps {
  onClose: () => void;
}

export function VictoryModal({ onClose }: VictoryModalProps) {
  const { distance, elapsedTime, pace, calories, sessionXP } = useRunStore();

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatPace = (paceMinutes: number) => {
    if (paceMinutes === 0 || !isFinite(paceMinutes)) return "--'--\"";
    const m = Math.floor(paceMinutes);
    const s = Math.floor((paceMinutes - m) * 60);
    return `${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`;
  };

  const CARD_BG = '#F2F2F2'; // silver-white
  const BORDER_DARK = '#2C5A64';
  const RED = '#C72222';
  const TEAL = '#8CC7C4';

  return (
    <View style={{ position: 'absolute', inset: 0, zIndex: 100, backgroundColor: 'rgba(15, 23, 42, 0.95)', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <View style={{ width: '100%', maxWidth: 450 }}>
        {/* Shadow Layer */}
        <View style={{ position: 'absolute', top: 8, left: 8, width: '100%', height: '100%', backgroundColor: BORDER_DARK, borderRadius: 24 }} />
        
        {/* Main Card Body */}
        <View style={{ backgroundColor: CARD_BG, borderWidth: 4, borderColor: BORDER_DARK, borderRadius: 24, overflow: 'hidden' }}>
          
          {/* Header */}
          <View style={{ backgroundColor: BORDER_DARK, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
             <Text style={{ color: 'white', fontWeight: '900', fontStyle: 'italic', letterSpacing: 2, fontSize: 18, textTransform: 'uppercase' }}>
               Mission Complete
             </Text>
             <Pressable onPress={onClose} style={{ width: 40, height: 40, backgroundColor: 'white', borderWidth: 2, borderColor: BORDER_DARK, alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
                <X size={20} color={BORDER_DARK} strokeWidth={3} />
             </Pressable>
          </View>

          <ScrollView style={{ maxHeight: '85%' }} contentContainerStyle={{ padding: 24 }}>
            <Text style={{ color: '#0f172a', fontSize: 36, fontWeight: '900', textTransform: 'uppercase', letterSpacing: -1, lineHeight: 36, marginBottom: 4 }}>
              Evening Run
            </Text>
            <Text style={{ color: '#64748b', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, fontStyle: 'italic', marginBottom: 24 }}>
              Tactical recon data uploaded to HQ.
            </Text>

            {/* Mini Map Frame */}
            <View style={{ position: 'relative', width: '100%', height: 180, marginBottom: 24 }}>
               <View style={{ position: 'absolute', top: 6, left: 6, width: '100%', height: '100%', backgroundColor: BORDER_DARK, borderRadius: 16 }} />
               <View style={{ width: '100%', height: '100%', borderWidth: 2, borderColor: BORDER_DARK, borderRadius: 16, backgroundColor: '#1e293b', overflow: 'hidden' }}>
                  <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUeLDbNo5N1DWr1zgnfr6lq6nH38NQN4a6n-BakRP-Vk9ax_YUTSEj8XdDGOgNCyw12LAZdIol0rjD6_gjUgstTBUTONp-f5xErbcBnYu-rFGAtiLm9BsdzkMej0TM7mQmVPwxBQ8aCxRxJgqphtomAo_vjlUFkG97gZMZ5ntNPJzK_Z_ypRYQ5BpHM54WeM9RF0PFFoVPpayb5yldrej0Meawyl87alhla8EjSCwZgfsD4Ti8wF_H1IjmuHaCogtEuZWRUdKalr3J' }} 
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }} 
                  />
                  <View style={{ position: 'absolute', bottom: 12, right: 12, backgroundColor: 'white', borderWidth: 2, borderColor: BORDER_DARK, px: 8, py: 4, borderRadius: 4 }}>
                     <Text style={{ color: '#0f172a', fontSize: 8, fontWeight: '900', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>
                       -6.97, 108.47
                     </Text>
                  </View>
               </View>
            </View>

            {/* Stats Grid 2x2 */}
            <View style={{ marginBottom: 24 }}>
               <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                  <View style={{ flex: 1, backgroundColor: 'white', borderWidth: 2, borderColor: BORDER_DARK, padding: 16, borderRadius: 16 }}>
                     <Text style={{ fontSize: 9, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Distance</Text>
                     <Text style={{ fontSize: 28, fontWeight: '900', color: '#0f172a' }}>{distance.toFixed(2)}<Text style={{ fontSize: 12 }}>km</Text></Text>
                  </View>
                  <View style={{ flex: 1, backgroundColor: 'white', borderWidth: 2, borderColor: BORDER_DARK, padding: 16, borderRadius: 16 }}>
                     <Text style={{ fontSize: 9, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Time</Text>
                     <Text style={{ fontSize: 28, fontWeight: '900', color: '#0f172a' }}>{formatTime(elapsedTime)}</Text>
                  </View>
               </View>
               <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1, backgroundColor: 'white', borderWidth: 2, borderColor: BORDER_DARK, padding: 16, borderRadius: 16 }}>
                     <Text style={{ fontSize: 9, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Avg Pace</Text>
                     <Text style={{ fontSize: 28, fontWeight: '900', color: '#0f172a' }}>{formatPace(pace)}</Text>
                  </View>
                  <View style={{ flex: 1, backgroundColor: 'white', borderWidth: 2, borderColor: BORDER_DARK, padding: 16, borderRadius: 16 }}>
                     <Text style={{ fontSize: 9, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Calories</Text>
                     <Text style={{ fontSize: 28, fontWeight: '900', color: '#0f172a' }}>{Math.floor(calories)}<Text style={{ fontSize: 12 }}>kcal</Text></Text>
                  </View>
               </View>
            </View>

            {/* XP Box */}
            <View style={{ position: 'relative', width: '100%', marginBottom: 32 }}>
               <View style={{ position: 'absolute', top: 6, left: 6, width: '100%', height: '100%', backgroundColor: BORDER_DARK, borderRadius: 16 }} />
               <View style={{ backgroundColor: TEAL, borderWidth: 2, borderColor: BORDER_DARK, padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View>
                     <Text style={{ color: '#2c5a64', fontWeight: '900', textTransform: 'uppercase', fontSize: 10, letterSpacing: 1.5, marginBottom: 4 }}>XP Reward</Text>
                     <Text style={{ color: '#0f172a', fontSize: 52, fontWeight: '900', letterSpacing: -2, lineHeight: 52 }}>+{sessionXP}</Text>
                  </View>
                  <Trophy size={48} color={BORDER_DARK} strokeWidth={2.5} />
               </View>
            </View>

            {/* Actions */}
            <View style={{ gap: 12 }}>
               <View style={{ position: 'relative', width: '100%' }}>
                  <View style={{ position: 'absolute', top: 4, left: 4, width: '100%', height: '100%', backgroundColor: '#0f172a', borderRadius: 999 }} />
                  <Pressable style={{ backgroundColor: RED, borderWidth: 2, borderColor: '#0f172a', paddingVertical: 18, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                     <Share2 size={24} color="white" />
                     <Text style={{ color: 'white', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 4, fontStyle: 'italic', fontSize: 18 }}>Share Mission</Text>
                  </Pressable>
               </View>
               
               <Pressable onPress={onClose} style={{ paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                  <MapIcon size={16} color={RED} />
                  <Text style={{ color: RED, fontWeight: '900', textTransform: 'uppercase', fontSize: 10, letterSpacing: 6, textDecorationLine: 'underline' }}>
                    View Domination
                  </Text>
               </Pressable>
            </View>
          </ScrollView>

        </View>
      </View>
    </View>
  );
}
