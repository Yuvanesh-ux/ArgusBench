export { query } from './connection';
import { query } from './connection';

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

export const findById = async <T>(table: string, id: string): Promise<T | null> => {
  const result = await query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

export const findByEmail = async (email: string): Promise<any> => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

export const findAll = async <T>(table: string, limit = 50, offset = 0): Promise<T[]> => {
  const result = await query(
    `SELECT * FROM ${table} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

export const insertOne = async <T>(
  table: string,
  data: Record<string, any>
): Promise<T> => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
  
  const result = await query(
    `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  return result.rows[0];
};

export const updateById = async <T>(
  table: string,
  id: string,
  data: Record<string, any>
): Promise<T | null> => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
  
  const result = await query(
    `UPDATE ${table} SET ${setClause} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return result.rows[0] || null;
};

export const deleteById = async (table: string, id: string): Promise<boolean> => {
  const result = await query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  return result.rowCount > 0;
};

export const findByProjectId = async <T>(
  table: string,
  projectId: string
): Promise<T[]> => {
  const result = await query(
    `SELECT * FROM ${table} WHERE project_id = $1 ORDER BY created_at DESC`,
    [projectId]
  );
  return result.rows;
};

export const findUserProjects = async (userId: string): Promise<any[]> => {
  const result = await query(
    `SELECT p.*, pm.role as user_role 
     FROM projects p 
     INNER JOIN project_members pm ON p.id = pm.project_id 
     WHERE pm.user_id = $1 
     ORDER BY p.updated_at DESC`,
    [userId]
  );
  return result.rows;
};