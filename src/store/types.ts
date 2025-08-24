export type Category = 'Work'|'Study'|'Fitness'|'Habit';
export type Task = { id:string; pair_id:string; title:string; category:Category; deadline_hour:number; penalty_cents:number; created_by?:string; };
export type Completion = { id:string; task_id:string; user_id:string; date:string; pomodoro_minutes?:number; proof_url?:string; };
export type Pair = { id:string; invite_code:string; };
export type Member = { id:string; pair_id:string; user_id:string; display_name:string; emoji:string; };
export type Settlement = { id:string; pair_id:string; created_at:string; };
