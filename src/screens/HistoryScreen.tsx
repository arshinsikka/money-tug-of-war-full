import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { fetchCompletionsForTasks, fetchSettlements, fetchTasks, subscribePair, addSettlement } from '@/lib/api';
import { weekDatesUTC } from '@/utils/date';
import { Task } from '@/store/types';
import { VictoryArea, VictoryChart, VictoryTheme } from 'victory-native';

export default function HistoryScreen({ pairId, me }:{ pairId:string; me:{id:string} }){
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comps, setComps] = useState<any[]>([]);
  const [settles, setSettles] = useState<any[]>([]);

  async function refresh(){
    const t = await fetchTasks(pairId); setTasks(t);
    const c = await fetchCompletionsForTasks(t.map(x=>x.id)); setComps(c);
    const s = await fetchSettlements(pairId); setSettles(s);
  }
  useEffect(()=>{ refresh(); const unsub = subscribePair(pairId, refresh); return unsub; }, [pairId]);

  const series = useMemo(()=>{
    const days = weekDatesUTC();
    return days.map(d => {
      const my = comps.filter(c => c.user_id===me.id && c.date===d)
        .reduce((sum, c) => sum + (tasks.find(t=>t.id===c.task_id)?.penalty_cents||0), 0);
      const oth = comps.filter(c => c.user_id!==me.id && c.date===d)
        .reduce((sum, c) => sum + (tasks.find(t=>t.id===c.task_id)?.penalty_cents||0), 0);
      return { x: d.slice(5), y: (my-oth)/100 };
    });
  }, [tasks, comps]);

  return (<View style={s.c}>
    <Text style={s.title}>Weekly Recap</Text>
    <View style={s.card}>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryArea data={series} interpolation="monotoneX" />
      </VictoryChart>
    </View>
    <Pressable onPress={async ()=>{ await addSettlement(pairId); alert('Tally reset for next week! 🎉'); }} style={s.settle}>
      <Text style={s.settleText}>Settle Up</Text>
    </Pressable>
  </View>);
}
const s = StyleSheet.create({ c:{ flex:1, padding:16 }, title:{ fontSize:22, fontWeight:'900', marginBottom:12 },
  card:{ backgroundColor:'#fff', borderRadius:16, padding:12, borderWidth:1, borderColor:'#eee', marginBottom:12 },
  settle:{ backgroundColor:'#16a34a', padding:14, borderRadius:14, alignItems:'center', marginTop:8 }, settleText:{ color:'#fff', fontWeight:'800' } });
