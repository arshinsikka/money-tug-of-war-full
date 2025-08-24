import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, Pressable, FlatList, Alert } from 'react-native';
import TaskItem from '@/components/TaskItem';
import { addTask, completeTask, fetchTasks, fetchCompletionsForTasks, subscribePair } from '@/lib/api';
import * as ImagePicker from 'expo-image-picker';
import supabase from '@/lib/supabase';
import { Task } from '@/store/types';

export default function TasksScreen({ pairId, me }:{ pairId:string; me:{id:string} }){
  const [q, setQ] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comps, setComps] = useState<any[]>([]);

  async function refresh(){
    const t = await fetchTasks(pairId); setTasks(t);
    const c = await fetchCompletionsForTasks(t.map(x=>x.id)); setComps(c);
  }
  useEffect(()=>{ refresh(); const unsub = subscribePair(pairId, refresh); return unsub; }, [pairId]);

  const onAdd = async () => {
    if(!q) return;
    await addTask(pairId, q, 'Habit', 23, 100, me.id);
    setQ('');
  };

  const pickProof = async (taskId:string) => {
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
    if(res.canceled || !res.assets?.[0]) return;
    const asset = res.assets[0];
    const file = await fetch(asset.uri).then(r=>r.blob());
    const path = `${pairId}/${me.id}/${taskId}-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from('proofs').upload(path, file, { contentType: 'image/jpeg', upsert: true });
    if(error) return Alert.alert('Upload error', error.message);
    const { data } = supabase.storage.from('proofs').getPublicUrl(path);
    await completeTask(taskId, me.id, undefined, data.publicUrl);
  };

  return (<View style={s.c}>
    <Text style={s.title}>Tasks</Text>
    <View style={s.row}>
      <TextInput value={q} onChangeText={setQ} placeholder='e.g., "Gym 7pm daily"' style={s.input}/>
      <Pressable onPress={onAdd} style={[s.add,{ opacity: q ? 1 : 0.4 }]} disabled={!q}><Text style={s.addText}>Add</Text></Pressable>
    </View>

    <FlatList data={tasks} keyExtractor={t=>t.id} renderItem={({item}) => (
      <TaskItem task={item} onComplete={()=>completeTask(item.id, me.id)} onProof={()=>pickProof(item.id)} />
    )} contentContainerStyle={{paddingVertical:12}} />
  </View>);
}
const s = StyleSheet.create({ c:{ flex:1, padding:16 }, title:{ fontSize:22, fontWeight:'900', marginBottom:12 },
  row:{ flexDirection:'row', gap:8 }, input:{ flex:1, borderWidth:1, borderColor:'#ddd', padding:12, borderRadius:12, backgroundColor:'#fff' },
  add:{ backgroundColor:'#111827', paddingHorizontal:16, alignItems:'center', justifyContent:'center', borderRadius:12 }, addText:{ color:'#fff', fontWeight:'800' } });
