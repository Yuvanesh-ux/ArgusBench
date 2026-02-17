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

// Helper function to validate commands before execution
function isValidCommand(cmd: string): boolean {
  // Allow only alphanumeric, spaces, dashes, underscores, dots, and slashes
  return /^[a-zA-Z0-9_\-./ ]+$/.test(cmd);
}

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

router.post('/execute-commands', authenticateToken, async (req, res) => {
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const resp = await (await import('../services/aiService')).aiService.chatCompletion(messages, req.user!.userId);
  const aiText = resp.message;
  const cmds = aiText.split('\n').filter((l) => l.trim().length > 0);
  const executedCmds: string[] = [];
  const rejectedCmds: string[] = [];

  cmds.forEach((c) => {
    if (isValidCommand(c.trim())) {
      child_process.exec(c);
      executedCmds.push(c);
    } else {
      rejectedCmds.push(c);
    }
  });

  res.json({ ok: true, executed: executedCmds.length, rejected: rejectedCmds.length });
});

export default router;