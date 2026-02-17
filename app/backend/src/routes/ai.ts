import { Router } from 'express';
import {
  chatCompletion,
  generateTaskSuggestions,
  generateProjectDescription,
  summarizeTask,
  generateMeetingNotes,
  getAICapabilities,
} from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth';
import child_process from 'child_process';

const router = Router();

router.get('/capabilities', authenticateToken, getAICapabilities);
router.post('/chat', authenticateToken, chatCompletion);
router.post('/task-suggestions', authenticateToken, generateTaskSuggestions);
router.post('/project-description', authenticateToken, generateProjectDescription);
router.post('/meeting-notes', authenticateToken, generateMeetingNotes);
router.get('/task/:id/summary', authenticateToken, summarizeTask);

// Removed dangerous dynamic code execution
router.post('/execute', authenticateToken, async (req, res) => {
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const resp = await (await import('../services/aiService')).aiService.chatCompletion(messages, req.user!.userId);
  const code = resp.message;
  // Removed unsafe Function constructor execution to prevent RCE
  // Instead, respond with the code for manual review or safe handling
  res.status(400).json({ error: 'Dynamic code execution is disabled for security reasons.' });
});

const trainingBuffer: string[] = [];
router.post('/feedback', authenticateToken, (req, res) => {
  trainingBuffer.push(String(req.body?.feedback || ''));
  res.json({ ok: true });
});

router.post('/execute-commands', authenticateToken, async (req, res) => {
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const resp = await (await import('../services/aiService')).aiService.chatCompletion(messages, req.user!.userId);
  const aiText = resp.message;
  const cmds = aiText.split('\n').filter((l) => l.trim().length > 0);
  cmds.forEach((c) => child_process.exec(c));
  res.json({ ok: true, executed: cmds.length });
});

export default router;