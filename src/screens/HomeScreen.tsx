import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Rope from '@/components/Rope';
import BalanceHeader from '@/components/BalanceHeader';
import { fetchCompletionsForTasks, fetchMembers, fetchTasks, subscribePair } from '@/lib/api';
import { Task, Member } from '@/store/types';
import { todayUTC } from '@/utils/date';

export default function HomeScreen({ pairId, me }:{ pairId:string; me:{id:string; name:string; emoji:string} }){
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comps, setComps] = useState<any[]>([]);

  async function refresh(){
    const [m, t] = await Promise.all([fetchMembers(pairId), fetchTasks(pairId)]);
    setMembers(m); setTasks(t);
    const c = await fetchCompletionsForTasks(t.map(x=>x.id));
    setComps(c);
  }
  useEffect(()=>{ refresh(); const unsub = subscribePair(pairId, refresh); return unsub; }, [pairId]);

  const friend = members.find(x => x.user_id !== me.id);
  const meName = me.name; const frName = friend?.display_name || 'Friend';
  const meEmoji = me.emoji; const frEmoji = friend?.emoji || '🙂';

  const balanceCents = useMemo(()=>{
    const today = todayUTC();
    let meScore = 0, frScore = 0;
    tasks.forEach(t => {
      const meDone = comps.find(c => c.task_id===t.id && c.user_id===me.id && c.date===today);
      const frDone = friend && comps.find(c => c.task_id===t.id && c.user_id===friend.user_id && c.date===today);
      if(meDone) meScore += t.penalty_cents;
      if(frDone) frScore += t.penalty_cents;
    });
    return meScore - frScore;
  }, [tasks, comps, members]);

  const meDollars = Math.max(0, Math.floor(balanceCents/100));
  const frDollars = Math.max(0, Math.floor((-balanceCents)/100));

  return (<View style={s.c}>
    <BalanceHeader me={meName} friend={frName} meDollars={meDollars} friendDollars={frDollars} />
    <Rope meEmoji={meEmoji} friendEmoji={frEmoji} balanceCents={balanceCents} />
    <Text style={s.tip}>Tip: Completing tasks pulls the 💰 toward you.</Text>
  </View>);
}
const s = StyleSheet.create({ c:{ flex:1, padding:16, paddingTop:24 }, tip:{ textAlign:'center', color:'#666', marginTop:16 } });
