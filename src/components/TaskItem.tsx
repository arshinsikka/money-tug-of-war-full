import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Task } from '@/store/types';

export default function TaskItem({ task, onComplete, onProof }:{task:Task; onComplete:()=>void; onProof:()=>void}){
  return (<View style={s.card}>
    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
      <Text style={s.title}>{task.title}</Text>
      <Text style={{backgroundColor:'#eef2ff',paddingHorizontal:8,paddingVertical:4,borderRadius:999,color:'#3730a3',fontWeight:'700'}}>{task.category}</Text>
    </View>
    <Text style={{color:'#666',marginTop:4}}>Due by {task.deadline_hour}:00 • ${task.penalty_cents/100}</Text>
    <View style={{flexDirection:'row',gap:8,marginTop:10}}>
      <Pressable onPress={onComplete} style={{backgroundColor:'#16a34a',padding:10,borderRadius:12}}><Text style={{color:'#fff',fontWeight:'800'}}>✅ Complete</Text></Pressable>
      <Pressable onPress={onProof} style={{backgroundColor:'#eef2ff',padding:10,borderRadius:12}}><Text style={{color:'#3730a3',fontWeight:'800'}}>📷 Proof</Text></Pressable>
    </View>
  </View>);
}
const s = StyleSheet.create({ card:{padding:12,borderRadius:16,backgroundColor:'#fff',shadowColor:'#000',shadowOpacity:0.05,shadowRadius:8,elevation:2,marginBottom:12}, title:{fontSize:16,fontWeight:'700'} });
