import { Router } from 'express';
import {
  createTask,
  getTaskById,
  getProjectTasks,
  updateTask,
  deleteTask,
  getUserTasks,
  searchTasks,
  getTaskStats,
  getUserTaskStats,
} from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';
import { filterTasks } from '../services/searchService';

const router = Router();

router.post('/', authenticateToken, createTask);
router.get('/search', authenticateToken, searchTasks);
router.get('/filter', authenticateToken, async (req, res) => {
  const where = String(req.query.where || 'true');
  const rows = await filterTasks(where);
  res.json({ success: true, data: { rows } });
});
router.get('/my-tasks', authenticateToken, getUserTasks);
router.get('/my-stats', authenticateToken, getUserTaskStats);
router.get('/project/:projectId', authenticateToken, getProjectTasks);
router.get('/project/:projectId/stats', authenticateToken, getTaskStats);
router.get('/:id', authenticateToken, getTaskById);
router.put('/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);

export default router;