import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StatusBar, useColorScheme } from 'react-native';
import AuthScreen from '@/screens/AuthScreen';
import PairScreen from '@/screens/PairScreen';
import HomeScreen from '@/screens/HomeScreen';
import TasksScreen from '@/screens/TasksScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import Tabs from '@/navigation/Tabs';
import supabase from '@/lib/supabase';

type TabKey = 'Home'|'Tasks'|'History';

export default function App(){
  const theme = useColorScheme();
  const [user, setUser] = useState<{ id:string; name:string; emoji:string }|null>(null);
  const [pairId, setPairId] = useState<string|null>(null);
  const [tab, setTab] = useState<TabKey>('Home');

  useEffect(()=>{
    supabase.auth.getUser().then(({ data }) => {
      if(data.user) setUser({ id: data.user.id, name: 'You', emoji: '💪' });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((evt, sess) => {
      if(sess?.user) setUser({ id: sess.user.id, name: 'You', emoji: '💪' });
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  if(!user){
    return (<SafeAreaView style={{ flex:1, backgroundColor: theme==='dark'?'#000':'#fff' }}>
      <StatusBar barStyle={theme==='dark'?'light-content':'dark-content'} />
      <AuthScreen onAuthed={(id,name,emoji)=>setUser({ id, name, emoji })}/>
    </SafeAreaView>);
  }

  if(!pairId){
    return (<SafeAreaView style={{ flex:1, backgroundColor: theme==='dark'?'#000':'#fff' }}>
      <StatusBar barStyle={theme==='dark'?'light-content':'dark-content'} />
      <PairScreen user={user} onPaired={(pid)=>setPairId(pid)} />
    </SafeAreaView>);
  }

  return (<SafeAreaView style={{ flex:1, backgroundColor: theme==='dark'?'#000':'#fff' }}>
    <StatusBar barStyle={theme==='dark'?'light-content':'dark-content'} />
    <View style={{ flex:1 }}>
      {tab==='Home' && <HomeScreen pairId={pairId} me={user} />}
      {tab==='Tasks' && <TasksScreen pairId={pairId} me={user} />}
      {tab==='History' && <HistoryScreen pairId={pairId} me={user} />}
    </View>
    <Tabs active={tab} setActive={setTab} />
  </SafeAreaView>);
}
