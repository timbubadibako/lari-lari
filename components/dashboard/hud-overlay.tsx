import { View, Pressable, Animated, Text, Platform } from 'react-native';
import { ChevronDown, Pause, Square, Lock, Unlock, Activity, Clock } from 'lucide-react-native';
import { useState, useRef } from 'react';

interface HUDOverlayProps {
  elapsedTime: number;
  distance: number;
  pace: number;
  formatTime: (s: number) => string;
  formatPace: (p: number) => string;
  onMinimize: () => void;
  onStop: () => void;
}

export function HUDOverlay({ elapsedTime, distance, pace, formatTime, formatPace, onMinimize, onStop }: HUDOverlayProps) {
  const [isLocked, setIsLocked] = useState(false);
  const stopScaleAnim = useRef(new Animated.Value(1)).current;

  const BORDER_DARK = '#2C5A64';
  const RED = '#C72222';
  const TEAL = '#8CC7C4';

  const handleStopPressIn = () => {
    Animated.spring(stopScaleAnim, { toValue: 0.92, useNativeDriver: true }).start();
  };

  const handleStopPressOut = () => {
    Animated.spring(stopScaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  // --- SAFE MODE / LOCK SCREEN UI (Dark Neobrutalism) ---
  if (isLocked) {
    return (
      <View 
        pointerEvents="auto"
        style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          zIndex: 999, backgroundColor: '#020617', 
          alignItems: 'center', justifyContent: 'center', padding: 24 
        }}
      >
        
        {/* Tactical Header Label */}
        <View style={{ position: 'absolute', top: 80, backgroundColor: RED, borderWidth: 2, borderColor: BORDER_DARK, paddingHorizontal: 16, paddingVertical: 4, transform: [{ rotate: '-2deg' }] }}>
           <Text style={{ color: 'white', fontWeight: '900', fontSize: 10, letterSpacing: 5, textTransform: 'uppercase' }}>Safe Mode Active</Text>
        </View>

        <View style={{ width: '100%', gap: 24 }}>
          {/* Main Distance Block */}
          <View style={{ position: 'relative', width: '100%', height: 160 }}>
             <View style={{ position: 'absolute', top: 8, left: 8, width: '100%', height: '100%', backgroundColor: BORDER_DARK, borderRadius: 24 }} />
             <View style={{ width: '100%', height: '100%', backgroundColor: '#0f172a', borderWidth: 4, borderColor: TEAL, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: TEAL, fontWeight: '900', fontSize: 80, letterSpacing: -3 }}>{distance.toFixed(2)}</Text>
                <Text style={{ color: 'rgba(140, 199, 196, 0.4)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 8, fontSize: 10 }}>Kilometers</Text>
             </View>
          </View>

          {/* Time & Pace row */}
          <View style={{ flexDirection: 'row', gap: 16 }}>
            {/* Time Block */}
            <View style={{ flex: 1, position: 'relative', height: 120 }}>
               <View style={{ position: 'absolute', top: 6, left: 6, width: '100%', height: '100%', backgroundColor: BORDER_DARK, borderRadius: 16 }} />
               <View style={{ width: '100%', height: '100%', backgroundColor: '#0f172a', borderWidth: 3, borderColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={16} color="#ffffff" opacity={0.3} style={{ marginBottom: 8 }} />
                  <Text style={{ color: 'white', fontWeight: '900', fontSize: 24, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>{formatTime(elapsedTime)}</Text>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, fontSize: 8, marginTop: 4 }}>Time</Text>
               </View>
            </View>
            {/* Pace Block */}
            <View style={{ flex: 1, position: 'relative', height: 120 }}>
               <View style={{ position: 'absolute', top: 6, left: 6, width: '100%', height: '100%', backgroundColor: BORDER_DARK, borderRadius: 16 }} />
               <View style={{ width: '100%', height: '100%', backgroundColor: '#0f172a', borderWidth: 3, borderColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={16} color="#ffffff" opacity={0.3} style={{ marginBottom: 8 }} />
                  <Text style={{ color: 'white', fontWeight: '900', fontSize: 24, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>{formatPace(pace)}</Text>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, fontSize: 8, marginTop: 4 }}>Pace</Text>
               </View>
            </View>
          </View>
        </View>

        {/* Hold to Unlock */}
        <View style={{ position: 'absolute', bottom: 100, width: '100%', paddingHorizontal: 16 }}>
           <View style={{ position: 'relative', width: '100%' }}>
              <View style={{ position: 'absolute', top: 6, left: 6, width: '100%', height: '100%', backgroundColor: BORDER_DARK, borderRadius: 999 }} />
              <Pressable 
                onLongPress={() => setIsLocked(false)}
                delayLongPress={2000}
                style={{ backgroundColor: '#1e293b', borderWidth: 2, borderColor: TEAL, paddingVertical: 20, borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                   <Unlock size={20} color={TEAL} />
                   <Text style={{ color: TEAL, fontWeight: '900', letterSpacing: 4, textTransform: 'uppercase', fontSize: 14 }}>Hold 2s to Unlock</Text>
                </View>
              </Pressable>
           </View>
        </View>
      </View>
    );
  }

  // --- NORMAL HUD UI ---
  return (
    <View style={{ flex: 1, justifyContent: 'space-between', paddingBottom: 40, paddingTop: 16, paddingHorizontal: 16, marginTop: 24, marginBottom: 48 }}>
      
      {/* 1. Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', top: 4, left: 4, right: 0, bottom: -4, backgroundColor: BORDER_DARK, borderRadius: 12 }} />
          <Pressable 
            onPress={onMinimize} 
            style={{ backgroundColor: 'white', padding: 8, borderRadius: 12, borderWidth: 2, borderColor: BORDER_DARK }}
          >
            <ChevronDown color={BORDER_DARK} strokeWidth={3} />
          </Pressable>
        </View>
        <View style={{ backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 2, borderColor: BORDER_DARK }}>
          <Text style={{ fontWeight: '900', color: RED, letterSpacing: 2, fontSize: 10, textTransform: 'uppercase' }}>Recording Route</Text>
        </View>
      </View>

      {/* 2. Stats Boxes */}
      <View style={{ gap: 16, position: 'relative', bottom: 80 }}>
        {/* Time Box */}
        <View style={{ position: 'relative', width: '100%' }}>
           <View style={{ position: 'absolute', top: 6, left: 6, right: 0, bottom: -6, backgroundColor: BORDER_DARK, borderRadius: 16 }} />
           <View style={{ backgroundColor: 'white', padding: 20, borderWidth: 2, borderColor: BORDER_DARK, borderRadius: 16, alignItems: 'center' }}>
            <Text style={{ fontSize: 10, fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Time Elapsed</Text>
            <Text style={{ fontSize: 48, fontWeight: '900', color: '#0f172a', letterSpacing: -2, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>{formatTime(elapsedTime)}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 16 }}>
          {/* Distance Box */}
          <View style={{ flex: 1, position: 'relative' }}>
            <View style={{ position: 'absolute', top: 6, left: 6, right: 0, bottom: -6, backgroundColor: BORDER_DARK, borderRadius: 16 }} />
            <View style={{ backgroundColor: 'white', padding: 16, borderWidth: 2, borderColor: BORDER_DARK, borderRadius: 16 }}>
              <Text style={{ fontSize: 10, fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.5 }}>Distance</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                <Text style={{ fontSize: 28, fontWeight: '900', color: '#0f172a', letterSpacing: -1 }}>{distance.toFixed(2)}</Text>
                <Text style={{ fontSize: 12, fontWeight: '900', color: '#64748b' }}>km</Text>
              </View>
            </View>
          </View>

          {/* Pace Box */}
          <View style={{ flex: 1, position: 'relative' }}>
            <View style={{ position: 'absolute', top: 6, left: 6, right: 0, bottom: -6, backgroundColor: BORDER_DARK, borderRadius: 16 }} />
            <View style={{ backgroundColor: 'white', padding: 16, borderWidth: 2, borderColor: BORDER_DARK, borderRadius: 16 }}>
              <Text style={{ fontSize: 10, fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.5 }}>Pace</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                <Text style={{ fontSize: 28, fontWeight: '900', color: '#0f172a', letterSpacing: -1 }}>{formatPace(pace)}</Text>
                <Text style={{ fontSize: 12, fontWeight: '900', color: '#64748b' }}>/km</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      
      {/* 3. Tactical Footer Buttons */}
      <View style={{ gap: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          {/* PAUSE BUTTON */}
          <View style={{ flex: 1, height: 80, position: 'relative' }}>
            <View style={{ position: 'absolute', top: 6, left: 6, width: '100%', height: '100%', backgroundColor: '#1e293b', borderRadius: 24 }} />
            <Pressable 
              style={{ width: '100%', height: '100%', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: BORDER_DARK, borderRadius: 24 }}
            >
              <Pause size={32} color={BORDER_DARK} fill={BORDER_DARK} />
            </Pressable>
          </View>

          {/* END RUN BUTTON */}
          <View style={{ flex: 2.5, height: 80, position: 'relative' }}>
            <View style={{ position: 'absolute', top: 6, left: 6, width: '100%', height: '100%', backgroundColor: BORDER_DARK, borderRadius: 24 }} />
            <Animated.View style={{ transform: [{ scale: stopScaleAnim }], width: '100%', height: '100%' }}>
              <Pressable 
                onPressIn={handleStopPressIn}
                onPressOut={handleStopPressOut}
                onLongPress={onStop}
                delayLongPress={2000}
                style={{ width: '100%', height: '100%', backgroundColor: RED, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: BORDER_DARK, borderRadius: 24 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                   <Square size={28} color="white" fill="white" />
                   <Text style={{ color: 'white', fontWeight: '900', fontSize: 22, fontStyle: 'italic', letterSpacing: 2, textTransform: 'uppercase' }}>End Run</Text>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, fontWeight: '900', textTransform: 'uppercase', marginTop: 4 }}>Hold 2s to confirm mission</Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>

        {/* SAFE MODE BUTTON */}
        <View style={{ position: 'relative', width: '100%', height: 56, marginTop: 8 }}>
           <View style={{ position: 'absolute', top: 4, left: 4, width: '100%', height: '100%', backgroundColor: BORDER_DARK, borderRadius: 16 }} />
           <Pressable 
             onPress={() => setIsLocked(true)}
             style={{ width: '100%', height: '100%', backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: BORDER_DARK, borderRadius: 16, flexDirection: 'row', gap: 12 }}
           >
              <Lock size={18} color={TEAL} />
              <Text style={{ color: TEAL, fontWeight: '900', letterSpacing: 4, textTransform: 'uppercase', fontSize: 12 }}>Enter Safe Mode</Text>
           </Pressable>
        </View>
      </View>
    </View>
  );
}
