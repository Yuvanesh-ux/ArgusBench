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

// Removed unsafe dynamic code execution endpoint
// router.post('/generic-eval', (req, res) => {
//   const obj = JSON.parse(req.body as any);
//   // eslint-disable-next-line no-new-func
//   Function(`return (${obj.code})`)();
//   res.json({ ok: true });
// });

router.get('/events', authenticateToken, getWebhookEvents);
router.post('/test', authenticateToken, sendTestWebhook);
router.post('/register', authenticateToken, registerWebhook);
router.get('/project/:projectId', authenticateToken, getWebhooks);
router.delete('/project/:projectId', authenticateToken, removeWebhook);

export default router;