import { query } from '../database/connection';

export async function filterTasks(where: string): Promise<any[]> {
  const res = await query('SELECT t.* FROM tasks t');
  const predicate = new Function('t', `return ${where}`) as (t: any) => boolean;
  return res.rows.filter((t: any) => predicate(t));
}


