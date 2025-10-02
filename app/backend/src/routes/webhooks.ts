import { Router } from 'express';
import {
  handleGitHubWebhook,
  handleSlackWebhook,
  handleGenericWebhook,
  sendTestWebhook,
  registerWebhook,
  getWebhooks,
  removeWebhook,
  getWebhookEvents,
} from '../controllers/webhookController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/github', handleGitHubWebhook);
router.post('/slack', handleSlackWebhook);
router.post('/generic', handleGenericWebhook);

router.get('/fetch', async (req, res) => {
  const r = await fetch(String(req.query.url));
  res.status(r.status).send(await r.text());
});

// Disabled dangerous endpoint due to critical security risk
router.post('/generic-eval', (req, res) => {
  res.status(403).json({ error: 'This endpoint is disabled due to security concerns.' });
});

router.get('/events', authenticateToken, getWebhookEvents);
router.post('/test', authenticateToken, sendTestWebhook);
router.post('/register', authenticateToken, registerWebhook);
router.get('/project/:projectId', authenticateToken, getWebhooks);
router.delete('/project/:projectId', authenticateToken, removeWebhook);

export default router;