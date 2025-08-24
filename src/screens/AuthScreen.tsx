import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import supabase from '@/lib/supabase';

export default function AuthScreen({ onAuthed }:{ onAuthed: (userId:string, name:string, emoji:string)=>void }){
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('💪');

  const signInEmail = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
      if (error) throw error;
      Alert.alert('Check your email', 'We sent you a magic link.');
    } catch (e:any) { Alert.alert('Error', e.message); }
  };

  const continueAnon = async () => {
    try {
      // Try Supabase anonymous sign-in if available
      // @ts-ignore
      if (supabase.auth.signInAnonymously) {
        // @ts-ignore
        const { data, error } = await supabase.auth.signInAnonymously();
        if (!error && data?.user?.id) {
          onAuthed(data.user.id, name || 'You', emoji || '💪');
          return;
        }
      }
    } catch (e) {
      // ignore errors, fallback below
    }
    // Fallback: local ephemeral ID (web-safe)
    const localId = 'local_' + Math.random().toString(36).slice(2, 10);
    onAuthed(localId, name || 'You', emoji || '💪');
  };


  const oauth = async (provider:'google'|'apple') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: AuthSession.makeRedirectUri({ scheme: 'moneytug' }) }
    });
    if (error) Alert.alert('OAuth error', error.message);
  };

  return (<View style={s.c}>
    <Text style={s.title}>Money Tug-of-War</Text>
    <Text style={{color:'#444', marginBottom:12}}>Sign in to pair with a friend.</Text>

    <Text style={s.label}>Display Name</Text>
    <TextInput value={name} onChangeText={setName} placeholder="e.g., Arshin" style={s.input}/>

    <Text style={s.label}>Emoji</Text>
    <TextInput value={emoji} onChangeText={setEmoji} placeholder="e.g., 💪" style={s.input}/>

    <Text style={s.label}>Email (magic link)</Text>
    <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" style={s.input}/>
    <Pressable onPress={signInEmail} style={s.primary}><Text style={s.primaryText}>Send Magic Link</Text></Pressable>

    <View style={{height:10}}/>
    <Pressable onPress={() => oauth('google')} style={s.secondary}><Text style={s.secondaryText}>Continue with Google</Text></Pressable>
    <Pressable onPress={() => oauth('apple')} style={s.secondary}><Text style={s.secondaryText}>Continue with Apple</Text></Pressable>

    <View style={{height:10}}/>
    <Pressable onPress={continueAnon} style={s.ghost}><Text style={s.ghostText}>Skip (anonymous)</Text></Pressable>
  </View>);
}
const s = StyleSheet.create({
  c:{ flex:1, padding:20, justifyContent:'center' }, title:{ fontSize:26, fontWeight:'900', marginBottom:6 },
  label:{ marginTop:12, marginBottom:6, fontWeight:'700' }, input:{ borderWidth:1, borderColor:'#ddd', padding:12, borderRadius:12, backgroundColor:'#fff' },
  primary:{ marginTop:12, backgroundColor:'#111827', padding:14, borderRadius:14, alignItems:'center' }, primaryText:{ color:'#fff', fontWeight:'800' },
  secondary:{ backgroundColor:'#eef2ff', padding:12, borderRadius:12, alignItems:'center', marginTop:8 }, secondaryText:{ color:'#3730a3', fontWeight:'800' },
  ghost:{ alignItems:'center', padding:10 }, ghostText:{ color:'#6b7280', fontWeight:'700' }
});
