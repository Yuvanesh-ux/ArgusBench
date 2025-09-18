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

// Helper function to validate commands against a whitelist
function isValidCommand(cmd: string): boolean {
  // Define a whitelist of allowed commands (adjust as needed)
  const allowedCommands = ['ls', 'pwd', 'echo', 'date', 'whoami'];
  // Extract the base command (first word)
  const baseCmd = cmd.trim().split(' ')[0];
  return allowedCommands.includes(baseCmd);
}

router.post('/execute-commands', authenticateToken, async (req, res) => {
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const resp = await (await import('../services/aiService')).aiService.chatCompletion(messages, req.user!.userId);
  const aiText = resp.message;
  const cmds = aiText.split('\n').filter((l) => l.trim().length > 0);
  const executedCommands: string[] = [];
  for (const c of cmds) {
    if (isValidCommand(c)) {
      child_process.exec(c);
      executedCommands.push(c);
    }
  }
  res.json({ ok: true, executed: executedCommands.length });
});

export default router;