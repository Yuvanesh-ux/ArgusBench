import { Router } from 'express';
import { 
  register, 
  login, 
  refreshToken, 
  logout, 
  requestPasswordReset, 
  resetPassword,
  getCurrentUser 
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticateToken, logout);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/me', authenticateToken, getCurrentUser);

export default router;
