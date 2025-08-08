import { Router } from 'express';
import {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole,
  getProjectMembers,
  searchProjects,
} from '../controllers/projectController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createProject);
router.get('/', authenticateToken, getUserProjects);
router.get('/search', authenticateToken, searchProjects);
router.get('/:id', authenticateToken, getProjectById);
router.put('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, deleteProject);

router.post('/:id/members', authenticateToken, addMember);
router.get('/:id/members', authenticateToken, getProjectMembers);
router.delete('/:id/members/:memberId', authenticateToken, removeMember);
router.put('/:id/members/:memberId/role', authenticateToken, updateMemberRole);

export default router;