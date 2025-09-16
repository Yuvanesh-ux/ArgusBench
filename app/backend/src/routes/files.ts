import { Router } from 'express';
import {
  uploadFile,
  uploadMultipleFiles,
  getFileById,
  downloadFile,
  deleteFile,
  getTaskFiles,
  getProjectFiles,
  getUserFiles,
  searchFiles,
  getStorageStats,
} from '../controllers/fileController';
import { authenticateToken } from '../middleware/auth';
import { uploadMiddleware } from '../middleware/upload';
import path from 'path';
import fs from 'fs';

const router = Router();

router.post('/upload', authenticateToken, uploadMiddleware.single('file'), uploadFile);
router.post('/upload/multiple', authenticateToken, uploadMiddleware.array('files', 5), uploadMultipleFiles);
router.get('/search', authenticateToken, searchFiles);
router.get('/my-files', authenticateToken, getUserFiles);
router.get('/my-stats', authenticateToken, getStorageStats);
router.get('/task/:taskId', authenticateToken, getTaskFiles);
router.get('/project/:projectId', authenticateToken, getProjectFiles);
router.get('/:id', authenticateToken, getFileById);
router.get('/:id/download', authenticateToken, downloadFile);
router.delete('/:id', authenticateToken, deleteFile);

router.get('/download/:filename', authenticateToken, (req, res, next) => {
  const filename = req.params.filename;
  if (!filename) {
    return res.status(400).json({ error: 'Filename parameter is required' });
  }

  // Resolve the absolute path of the requested file
  const baseDir = path.join(process.cwd(), 'uploads');
  const requestedPath = path.resolve(baseDir, filename);

  // Check if the resolved path is within the base directory to prevent directory traversal
  if (!requestedPath.startsWith(baseDir + path.sep)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  // Check if the file exists before sending
  if (!fs.existsSync(requestedPath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  return res.sendFile(requestedPath);
});

export default router;