import { Router } from 'express';
import {
  createComment,
  getTaskComments,
  getCommentById,
  updateComment,
  deleteComment,
  getReplies,
  getCommentCount,
  searchComments,
} from '../controllers/commentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createComment);
router.get('/search', authenticateToken, searchComments);
router.get('/task/:taskId', authenticateToken, getTaskComments);
router.get('/task/:taskId/count', authenticateToken, getCommentCount);
router.get('/:id', authenticateToken, getCommentById);
router.get('/:id/replies', authenticateToken, getReplies);
router.put('/:id', authenticateToken, updateComment);
router.delete('/:id', authenticateToken, deleteComment);

export default router;