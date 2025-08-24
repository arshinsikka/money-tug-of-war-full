import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { addMember, createPairInvite, getOrCreatePair } from '@/lib/api';

export default function PairScreen({ user, onPaired }:{ user:{ id:string; name:string; emoji:string }; onPaired:(pairId:string)=>void }){
  const [code, setCode] = useState<string>('');
  const [myCode, setMyCode] = useState<string>('');

  const generate = async ()=>{
    const invite = await createPairInvite();
    setMyCode(invite);
    const pair = await getOrCreatePair(invite);
    await addMember(pair.id, { user_id: user.id, display_name: user.name, emoji: user.emoji });
    onPaired(pair.id);
  };

  const join = async ()=>{
    if(!code) return;
    const pair = await getOrCreatePair(code.toUpperCase());
    await addMember(pair.id, { user_id: user.id, display_name: user.name, emoji: user.emoji });
    onPaired(pair.id);
  };

  return (<View style={s.c}>
    <Text style={s.t}>Pair with a Friend</Text>
    <Text style={{color:'#444', marginBottom:16}}>Share or enter an invite code.</Text>

    <Pressable style={s.btn} onPress={generate}><Text style={s.btnText}>Generate Invite Code</Text></Pressable>

    {myCode ? (<View style={s.box}><Text style={{color:'#666'}}>Your code</Text><Text selectable style={s.code}>{myCode}</Text></View>) : null}

    <Text style={s.label}>Enter friend's code</Text>
    <TextInput value={code} onChangeText={setCode} placeholder="e.g., 8FJ2K1" style={s.input}/>

    <Pressable onPress={join} style={[s.primary, { opacity: code ? 1 : 0.4 }]} disabled={!code}><Text style={s.primaryText}>Join</Text></Pressable>
  </View>);
}
const s = StyleSheet.create({
  c:{ flex:1, padding:20 }, t:{ fontSize:22, fontWeight:'900', marginBottom:6 },
  btn:{ backgroundColor:'#eef2ff', padding:12, borderRadius:12, alignItems:'center' }, btnText:{ color:'#3730a3', fontWeight:'800' },
  box:{ backgroundColor:'#fff', borderRadius:12, padding:12, marginTop:12, borderWidth:1, borderColor:'#eee' }, code:{ fontSize:22, fontWeight:'800', marginVertical:4 },
  label:{ fontWeight:'700', marginTop:16, marginBottom:6 }, input:{ borderWidth:1, borderColor:'#ddd', padding:12, borderRadius:12, backgroundColor:'#fff' },
  primary:{ marginTop:12, backgroundColor:'#16a34a', padding:12, borderRadius:12, alignItems:'center' }, primaryText:{ color:'#fff', fontWeight:'800' }
});
