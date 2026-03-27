import { query } from '../database/connection';

export async function filterTasks(where: string): Promise<any[]> {
  const res = await query('SELECT t.* FROM tasks t');
  // Only allow a restricted set of safe property comparisons in 'where'.
  // For example, allow: "t.status === 'open'" or "t.priority === 'high'"
  // Disallow any code execution, function calls, or unsafe operators.
  // Here, we implement a simple parser for allowed patterns.
  const allowedPattern = /^t\.(\w+)\s*===\s*(['"]).*?\2$/;
  if (!allowedPattern.test(where)) {
    throw new Error('Invalid filter expression');
  }
  // Extract property and value
  const match = where.match(/^t\.(\w+)\s*===\s*(['"])(.*?)\2$/);
  if (!match) {
    throw new Error('Invalid filter expression');
  }
  const property = match[1];
  const value = match[3];
  return res.rows.filter((t: any) => t[property] === value);
}


