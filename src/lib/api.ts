import supabase from './supabase';
import { Category, Completion, Member, Settlement, Task } from '@/store/types';
import { todayUTC } from '@/utils/date';

function code(){ return Math.random().toString(36).slice(2,8).toUpperCase(); }

export async function createPairInvite(): Promise<string>{
  const invite_code = code();
  const { error } = await supabase.from('pairs').insert({ invite_code });
  if(error) throw error;
  return invite_code;
}

export async function getOrCreatePair(invite_code:string){
  const { data, error } = await supabase.from('pairs').select('*').eq('invite_code', invite_code).limit(1);
  if(error) throw error;
  if(data && data.length) return data[0];
  const { data: created, error: e2 } = await supabase.from('pairs').insert({ invite_code }).select().single();
  if(e2) throw e2;
  return created;
}

export async function addMember(pair_id:string, profile:{ user_id:string; display_name:string; emoji:string; }){
  const { error } = await supabase.from('pair_members').insert({ pair_id, ...profile });
  if(error) throw error;
}

export async function fetchMembers(pair_id:string): Promise<Member[]>{
  const { data, error } = await supabase.from('pair_members').select('*').eq('pair_id', pair_id);
  if(error) throw error;
  return data||[];
}

export async function addTask(pair_id:string, title:string, category:Category, hour:number, penalty=100, created_by?:string){
  const { error } = await supabase.from('tasks').insert({ pair_id, title, category, deadline_hour:hour, penalty_cents:penalty, created_by });
  if(error) throw error;
}

export async function fetchTasks(pair_id:string): Promise<Task[]>{
  const { data, error } = await supabase.from('tasks').select('*').eq('pair_id', pair_id).order('created_at',{ascending:false});
  if(error) throw error;
  return data||[];
}

export async function completeTask(task_id:string, user_id:string, pomodoro?:number, proof_url?:string){
  const date = todayUTC();
  const { error } = await supabase.from('completions').insert({ task_id, user_id, date, pomodoro_minutes: pomodoro||0, proof_url });
  if(error && !String(error.message).includes('duplicate key')) throw error;
}

export async function fetchCompletionsForTasks(task_ids:string[]): Promise<Completion[]>{
  if(task_ids.length===0) return [];
  const { data, error } = await supabase.from('completions').select('*').in('task_id', task_ids);
  if(error) throw error;
  return data||[];
}

export async function addSettlement(pair_id:string){
  const { error } = await supabase.from('settlements').insert({ pair_id });
  if(error) throw error;
}

export async function fetchSettlements(pair_id:string): Promise<Settlement[]>{
  const { data, error } = await supabase.from('settlements').select('*').eq('pair_id', pair_id).order('created_at',{ascending:false});
  if(error) throw error;
  return data||[];
}

export function subscribePair(pair_id:string, onChange: ()=>void){
  const ch = supabase.channel('pair_stream_'+pair_id, { config: { broadcast: { self: false } } });
  ch.on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `pair_id=eq.${pair_id}` }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'completions' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pair_members', filter: `pair_id=eq.${pair_id}` }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'settlements', filter: `pair_id=eq.${pair_id}` }, onChange)
    .subscribe();
  return () => supabase.removeChannel(ch);
}
