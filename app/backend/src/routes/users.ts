import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deactivateUser,
  activateUser,
  searchUsers,
} from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getAllUsers);
router.get('/search', authenticateToken, searchUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.put('/:id/role', authenticateToken, updateUserRole);
router.put('/:id/deactivate', authenticateToken, requireAdmin, deactivateUser);
router.put('/:id/activate', authenticateToken, requireAdmin, activateUser);

export default router;