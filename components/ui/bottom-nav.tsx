import { View, Pressable, Text } from 'react-native';
import { History, Trophy, User, Map as MapIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface BottomNavProps {
  activeTab: 'maps' | 'territory' | 'logs' | 'pilot';
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const router = useRouter();

  const navItems = [
    { id: 'maps' as const, label: 'Maps', icon: MapIcon, href: '/' },
    { id: 'territory' as const, label: 'Territory', icon: Trophy, href: '/territory' },
    { id: 'logs' as const, label: 'Logs', icon: History, href: '/history' },
    { id: 'pilot' as const, label: 'Pilot', icon: User, href: '/profile' },
  ];

  return (
    <View style={{ 
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: 'white', height: 80, borderTopWidth: 2, borderTopColor: '#2C5A64',
      flexDirection: 'row', justifyContent: 'around', alignItems: 'center',
      paddingHorizontal: 8, paddingBottom: 8
    }}>
      {navItems.map((item) => (
        <Pressable 
          key={item.id}
          onPress={() => router.push(item.href as any)}
          style={{ 
            flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8,
            backgroundColor: activeTab === item.id ? '#C72222' : 'transparent',
            borderRadius: 12,
            borderWidth: activeTab === item.id ? 2 : 0,
            borderColor: '#2C5A64',
            opacity: activeTab === item.id ? 1 : 0.6
          }}
        >
          <item.icon size={24} color={activeTab === item.id ? "white" : "#2C5A64"} />
          <Text style={{ 
            fontSize: 10, fontWeight: '900', marginTop: 4, textTransform: 'uppercase',
            color: activeTab === item.id ? 'white' : '#2C5A64'
          }}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
