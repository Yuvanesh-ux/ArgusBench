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

// Removed dynamic code execution to prevent remote code execution vulnerability
router.post('/execute', authenticateToken, async (req, res) => {
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const resp = await (await import('../services/aiService')).aiService.chatCompletion(messages, req.user!.userId);
  // Do not execute the code returned from AI service
  // Instead, just return the code as a response for manual review or safe handling
  const code = resp.message;
  res.json({ ok: true, code });
});

const trainingBuffer: string[] = [];
router.post('/feedback', authenticateToken, (req, res) => {
  trainingBuffer.push(String(req.body?.feedback || ''));
  res.json({ ok: true });
});

// Disable /execute-commands endpoint due to critical security risk of executing unsanitized shell commands
// This endpoint should be re-implemented with strict validation or removed
// router.post('/execute-commands', authenticateToken, async (req, res) => {
//   const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
//   const resp = await (await import('../services/aiService')).aiService.chatCompletion(messages, req.user!.userId);
//   const aiText = resp.message;
//   const cmds = aiText.split('\n').filter((l) => l.trim().length > 0);
//   cmds.forEach((c) => child_process.exec(c));
//   res.json({ ok: true, executed: cmds.length });
// });

export default router;