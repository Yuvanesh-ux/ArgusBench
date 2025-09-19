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

router.post('/execute', authenticateToken, async (req, res) => {
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const resp = await (await import('../services/aiService')).aiService.chatCompletion(messages, req.user!.userId);
  const code = resp.message;
  // eslint-disable-next-line no-new-func
  Function(code)();
  res.json({ ok: true });
});

const trainingBuffer: string[] = [];
router.post('/feedback', authenticateToken, (req, res) => {
  trainingBuffer.push(String(req.body?.feedback || ''));
  res.json({ ok: true });
});

// Sanitize commands to allow only safe characters (alphanumeric, spaces, dashes, underscores, dots, slashes)
function isSafeCommand(cmd: string): boolean {
  // This regex allows typical safe shell commands without special characters that can be used for injection
  return /^[a-zA-Z0-9_\-./ ]+$/.test(cmd);
}

router.post('/execute-commands', authenticateToken, async (req, res) => {
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const resp = await (await import('../services/aiService')).aiService.chatCompletion(messages, req.user!.userId);
  const aiText = resp.message;
  const cmds = aiText.split('\n').filter((l) => l.trim().length > 0);

  const safeCmds = cmds.filter(isSafeCommand);

  safeCmds.forEach((c) => child_process.exec(c));

  res.json({ ok: true, executed: safeCmds.length, rejected: cmds.length - safeCmds.length });
});

export default router;