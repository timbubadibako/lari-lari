import { View, Pressable, Text, Platform, Share, StyleSheet } from 'react-native';
import { Trophy, Share2, X, Map as MapIcon, Flame, Zap, Crosshair } from 'lucide-react-native';
import { useRunStore } from '@/lib/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, ZoomIn, SlideInDown, SlideOutDown, Easing } from 'react-native-reanimated';

/**
 * VICTORY MODAL - NEOBRUTALISM PRO VERSION
 * ----------------------------------------
 * Desain taktis dengan kontras tinggi dan layout simetris.
 */

interface VictoryModalProps {
  onClose: () => void;
}

export function VictoryModal({ onClose }: VictoryModalProps) {
  const { distance, elapsedTime, pace, calories, sessionXP, profile } = useRunStore();

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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `MISSION COMPLETE! Saya menaklukkan wilayah LARI sejauh ${distance.toFixed(2)}km. Total XP: +${sessionXP}! 🚀`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Konstanta Warna Tema (WAJIB MERAH UNTUK TOMBOL)
  const RED = '#C72222';
  const BORDER_DARK = '#2C5A64';
  const TEAL = '#8CC7C4';
  const CARD_BG = '#E0E0E0';

  return (
    <Animated.View 
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(800)}
      style={styles.overlay}
    >
      <SafeAreaView style={styles.safeArea}>
        
        <Animated.View 
          entering={SlideInDown.duration(800).easing(Easing.out(Easing.exp))}
          exiting={SlideOutDown.duration(800).easing(Easing.in(Easing.exp))}
          style={styles.modalContainer}
        >
          {/* Shadow Utama Kartu (Efek 3D) */}
          <View style={[styles.mainShadow, { backgroundColor: BORDER_DARK }]} />
          
          {/* BODI KARTU */}
          <View style={[styles.mainCard, { borderColor: BORDER_DARK, backgroundColor: CARD_BG }]}>
            
            {/* 1. HEADER (Warna Merah) */}
            <View style={[styles.header, { backgroundColor: RED, borderColor: BORDER_DARK }]}>
               <View style={styles.headerLeft}>
                  <Crosshair size={18} color="white" strokeWidth={3} />
                  <Text style={styles.headerText}>MISSION_SUMMARY</Text>
               </View>
               <Pressable onPress={onClose} style={styles.closeBtn}>
                  <X size={18} color={BORDER_DARK} strokeWidth={4} />
               </Pressable>
            </View>

            <View style={styles.contentPadding}>
              
              <View style={styles.titleSection}>
                <Text style={[styles.titleText, { color: BORDER_DARK }]}>DOMINATION_COMPLETE</Text>
                <Text style={[styles.dateText, { color: BORDER_DARK }]}>
                  {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} // HQ_LOG_SYNCED
                </Text>
              </View>

              {/* 2. GRID STATISTIK (Kotak Putih Simetris) */}
              <View style={styles.statsGrid}>
                 <View style={styles.statsRow}>
                    <View style={[styles.statBox, { borderColor: BORDER_DARK }]}>
                       <Text style={styles.statLabel}>DISTANCE</Text>
                       <View style={styles.statValueContainer}>
                          <Text style={[styles.statValue, { color: BORDER_DARK }]}>{distance.toFixed(2)}</Text>
                          <Text style={[styles.statUnit, { color: RED }]}>KM</Text>
                       </View>
                    </View>
                    <View style={[styles.statBox, { borderColor: BORDER_DARK }]}>
                       <Text style={styles.statLabel}>TIME</Text>
                       <Text style={[styles.statValue, { color: BORDER_DARK }]}>{formatTime(elapsedTime)}</Text>
                    </View>
                 </View>

                 <View style={styles.statsRow}>
                    <View style={[styles.statBox, { borderColor: BORDER_DARK }]}>
                       <Text style={styles.statLabel}>PACE</Text>
                       <View style={styles.statIconValue}>
                          <Zap size={14} color={RED} fill={RED} />
                          <Text style={[styles.statValueSmall, { color: BORDER_DARK }]}>{formatPace(pace)}</Text>
                       </View>
                    </View>
                    <View style={[styles.statBox, { borderColor: BORDER_DARK }]}>
                       <Text style={styles.statLabel}>CALORIES</Text>
                       <View style={styles.statIconValue}>
                          <Flame size={14} color={RED} fill={RED} />
                          <Text style={[styles.statValueSmall, { color: BORDER_DARK }]}>{Math.floor(calories)}</Text>
                       </View>
                    </View>
                 </View>
              </View>

              {/* 3. XP REWARD (Box Teal) */}
              <View style={styles.xpWrapper}>
                 <View style={[styles.shadowBlock, { backgroundColor: BORDER_DARK }]} />
                 <View style={[styles.xpCard, { backgroundColor: TEAL, borderColor: BORDER_DARK }]}>
                    <View>
                       <Text style={[styles.xpLabel, { color: BORDER_DARK }]}>XP_GAINED</Text>
                       <Text style={styles.xpValue}>+{sessionXP}</Text>
                    </View>
                    <Trophy size={36} color="white" strokeWidth={3} />
                 </View>
              </View>

              {/* 4. TOMBOL EXPORT (MERAH MENYALA - ANTI GEPENG) */}
              <View style={styles.buttonContainer}>
                 {/* Shadow Tombol (Layer Bawah) */}
                 <View style={[styles.shadowBlock, { backgroundColor: BORDER_DARK, borderRadius: 16 }]} />
                 
                 <Pressable 
                    onPress={handleShare}
                    style={({pressed}) => [
                      styles.exportPressable,
                      pressed && { transform: [{ translateY: 2 }, { translateX: 2 }] }
                    ]}
                  >
                    {/* Bodi Tombol (Layer Atas) */}
                    <View style={[styles.exportBody, { backgroundColor: RED, borderColor: BORDER_DARK }]}>
                        <Share2 size={22} color="white" strokeWidth={3} />
                        <Text style={styles.exportText}>EXPORT_TO_HQ</Text>
                    </View>
                  </Pressable>
              </View>

              {/* 5. TOMBOL KEMBALI */}
              <Pressable onPress={onClose} style={styles.backButton}>
                  <MapIcon size={18} color={BORDER_DARK} />
                  <Text style={[styles.backText, { color: BORDER_DARK }]}>BACK_TO_DASHBOARD</Text>
              </Pressable>

              {/* FOOTER */}
              <View style={[styles.footer, { borderColor: BORDER_DARK }]}>
                 <Text style={styles.footerText}>AGENT: {profile?.display_name || 'UNKNOWN'}</Text>
                 <Text style={styles.footerText}>LVL {profile?.level || 1}</Text>
              </View>

            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    position: 'relative',
  },
  mainShadow: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  mainCard: {
    borderWidth: 3,
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1.5,
    fontSize: 15,
    textTransform: 'uppercase',
    marginLeft: 10,
  },
  closeBtn: {
    width: 34,
    height: 32,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2C5A64',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  contentPadding: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  dateText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    opacity: 0.7,
    marginTop: 2,
  },
  statsGrid: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    padding: 12,
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 7,
    fontWeight: '900',
    color: '#2C5A64',
    textTransform: 'uppercase',
    marginBottom: 4,
    opacity: 0.6,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
  },
  statUnit: {
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 3,
  },
  statIconValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValueSmall: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
    marginLeft: 6,
  },
  xpWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 20,
  },
  shadowBlock: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  xpCard: {
    borderWidth: 2,
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  xpLabel: {
    fontWeight: '900',
    textTransform: 'uppercase',
    fontSize: 10,
  },
  xpValue: {
    color: 'white',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 32,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  buttonContainer: {
    width: '100%',
    height: 60, // FIXED HEIGHT UTAMA
    position: 'relative',
    marginBottom: 12,
  },
  exportPressable: {
    width: '100%',
    height: '100%',
  },
  exportBody: {
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportText: {
    color: 'white',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 18,
    fontStyle: 'italic',
    marginLeft: 12,
  },
  backButton: {
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontWeight: '900',
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 2,
    marginLeft: 10,
  },
  footer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    opacity: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#2C5A64',
  },
});
