import React, { useState } from 'react';
import { View, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform, Text as RNText } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Fingerprint, Github } from 'lucide-react-native';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  async function handleAuth() {
    setLoading(true);
    if (isRegister) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            display_name: username,
          },
        },
      });
      if (error) {
        Alert.alert('Auth Error', error.message);
      } else {
        if (data.session) {
          router.replace('/');
        } else {
          Alert.alert('Success', 'Registration complete. Please sign in.');
          setIsRegister(false);
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert('Auth Error', error.message);
      else router.replace('/');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-midnight-900"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', padding: 24, paddingBottom: 40 }}>
        
        {/* Top Hero Section */}
        <View className="items-center mb-16 mt-20">
          <Text className="font-serif text-7xl italic text-white tracking-tighter mb-1">LARI</Text>
          <View className="h-0.5 w-12 bg-sky-500 rounded-full mb-4" />
          <Text className="text-[10px] uppercase tracking-[0.5em] text-sky-500 font-bold">Zenith Protocol Activated</Text>
        </View>

        {/* Auth Form (Glass) */}
        <View className="bg-midnight-700/70 border border-white/5 rounded-[3.5rem] p-8 pb-12">
          
          <View className="flex-row gap-6 mb-10 border-b border-white/5 pb-4">
            <Pressable onPress={() => setIsRegister(false)}>
              <Text className={`text-sm uppercase tracking-widest font-bold ${!isRegister ? 'text-white border-b-2 border-sky-500 pb-2' : 'text-slate-500'}`}>
                Login
              </Text>
            </Pressable>
            <Pressable onPress={() => setIsRegister(true)}>
              <Text className={`text-sm uppercase tracking-widest font-bold ${isRegister ? 'text-white border-b-2 border-sky-500 pb-2' : 'text-slate-500'}`}>
                Register
              </Text>
            </Pressable>
          </View>

          <View className="gap-8 mb-10">
            {isRegister && (
              <View className="relative">
                <RNText className="text-[9px] uppercase tracking-widest text-sky-500/60 mb-2">Operative Designation</RNText>
                <Input 
                  placeholder="USERNAME"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            )}

            <View className="relative">
              <RNText className="text-[9px] uppercase tracking-widest text-sky-500/60 mb-2">Tactical Identity</RNText>
              <Input 
                placeholder="EMAIL ADDRESS"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <View className="relative">
              <RNText className="text-[9px] uppercase tracking-widest text-sky-500/60 mb-2">Access Cipher</RNText>
              <Input 
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <Button 
            onPress={handleAuth}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'PROCESSING...' : 'AUTHORIZE ACCESS'}
          </Button>

          {/* Biometric / Social */}
          <View className="mt-10 flex-row items-center justify-center gap-8 border-t border-white/5 pt-8">
            <Pressable className="w-12 h-12 rounded-full bg-white/5 border border-white/5 items-center justify-center">
              <Fingerprint size={24} color="#38bdf8" />
            </Pressable>
            <Pressable className="w-12 h-12 rounded-full bg-white/5 border border-white/5 items-center justify-center">
              <Github size={20} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="text-[9px] text-slate-600 uppercase tracking-[0.3em]">
            Neural Link Status: <RNText className="text-sky-500">Encrypted</RNText>
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
