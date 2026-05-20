import React, { useState } from 'react';
import { View, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Shield, Mail, Lock, User as UserIcon } from 'lucide-react-native';

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
        Alert.alert('Gagal Daftar', error.message);
      } else {
        // Since verification is disabled, user is likely logged in immediately
        if (data.session) {
          router.replace('/');
        } else {
          Alert.alert('Sukses!', 'Pendaftaran berhasil, silakan masuk.');
          setIsRegister(false);
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert('Gagal Masuk', error.message);
      else router.replace('/');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-silver-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        {/* Header Hero */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-merah border-4 border-biru-gelap rounded-3xl items-center justify-center rotate-3">
             <Shield size={40} color="white" fill="white" />
          </View>
          <Text className="font-bold text-4xl italic text-merah mt-4 tracking-tighter">LARI.EXE</Text>
          <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Territory War Simulation</Text>
        </View>

        {/* Auth Card */}
        <View className="relative w-full">
          <View className="absolute top-2 left-2 w-full h-full bg-biru-gelap rounded-3xl" />
          <View className="bg-white border-2 border-biru-gelap rounded-3xl p-6">
            <Text className="font-outfit text-2xl font-black text-slate-900 mb-6">
              {isRegister ? 'BUAT AKUN BARU' : 'MASUK KE GAME'}
            </Text>

            <View className="gap-5">
              {isRegister && (
                <View>
                  <Label className="mb-2 ml-1 font-bold text-biru-gelap">NAMA PILOT (USERNAME)</Label>
                  <View className="flex-row items-center bg-slate-50 border-2 border-biru-gelap rounded-xl px-3">
                    <UserIcon size={20} color="#2C5A64" />
                    <Input 
                      placeholder="Contoh: StreetRunner99"
                      value={username}
                      onChangeText={setUsername}
                      className="flex-1 h-12 border-0 bg-transparent font-bold"
                    />
                  </View>
                </View>
              )}

              <View>
                <Label className="mb-2 ml-1 font-bold text-biru-gelap">EMAIL ENKRYPSI</Label>
                <View className="flex-row items-center bg-slate-50 border-2 border-biru-gelap rounded-xl px-3">
                  <Mail size={20} color="#2C5A64" />
                  <Input 
                    placeholder="nama@email.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    className="flex-1 h-12 border-0 bg-transparent font-bold"
                  />
                </View>
              </View>

              <View>
                <Label className="mb-2 ml-1 font-bold text-biru-gelap">KODE AKSES (PASSWORD)</Label>
                <View className="flex-row items-center bg-slate-50 border-2 border-biru-gelap rounded-xl px-3">
                  <Lock size={20} color="#2C5A64" />
                  <Input 
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="flex-1 h-12 border-0 bg-transparent font-bold"
                  />
                </View>
              </View>

              {/* Action Button */}
              <View className="relative w-full h-16 mt-4">
                <View className="absolute top-1 left-1 w-full h-full bg-biru-gelap rounded-2xl" />
                <Pressable 
                  onPress={handleAuth}
                  disabled={loading}
                  className={`w-full h-full items-center justify-center border-2 border-biru-gelap rounded-2xl active:translate-y-0.5 active:translate-x-0.5 ${loading ? 'bg-slate-200' : 'bg-merah'}`}
                >
                  <Text className="text-white font-black text-lg tracking-widest italic">
                    {loading ? 'MEMPROSES...' : (isRegister ? 'DAFTAR SEKARANG' : 'MULAI OPERASI')}
                  </Text>
                </Pressable>
              </View>

              {/* Toggle Login/Register */}
              <Pressable 
                onPress={() => setIsRegister(!isRegister)}
                className="items-center mt-2"
              >
                <Text className="text-biru-gelap font-bold text-xs underline decoration-2">
                  {isRegister ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akses? Daftar Pilot baru'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
