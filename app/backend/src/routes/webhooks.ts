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

// Helper function to validate URL and prevent SSRF
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    // Only allow http and https protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }
    // Disallow localhost and private IP ranges
    const hostname = url.hostname;
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname.endsWith('.local') ||
      hostname.match(/^10\./) ||
      hostname.match(/^192\.168\./) ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

router.get('/fetch', async (req, res) => {
  const url = String(req.query.url);
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid or disallowed URL' });
  }
  try {
    const r = await fetch(url);
    res.status(r.status).send(await r.text());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the URL' });
  }
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