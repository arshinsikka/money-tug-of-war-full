import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
type TabKey = 'Home'|'Tasks'|'History';
export default function Tabs({ active, setActive }:{ active:TabKey; setActive:(k:TabKey)=>void }){
  return (<View style={s.bar}>
    {(['Home','Tasks','History'] as TabKey[]).map(k => (
      <Pressable key={k} onPress={()=>setActive(k)} style={s.btn}><Text style={[s.label, active===k && s.active]}>{k}</Text></Pressable>
    ))}
  </View>);
}
const s = StyleSheet.create({ bar:{ flexDirection:'row', justifyContent:'space-around', alignItems:'center', paddingVertical:10, borderTopWidth:1, borderColor:'#eee', backgroundColor:'#fafafa' },
  btn:{ paddingHorizontal:16, paddingVertical:6, borderRadius:12 }, label:{ fontSize:14, fontWeight:'700', color:'#6b7280' }, active:{ color:'#111827' } });
