import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { createError } from './errorHandler';

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760');
const UPLOAD_PATH = process.env.UPLOAD_PATH || 'uploads/';

// Define a whitelist of allowed file extensions corresponding to allowed MIME types
const allowedExtensions = new Set([
  '.jpeg',
  '.jpg',
  '.png',
  '.gif',
  '.webp',
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.txt',
  '.csv',
  '.zip',
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    let extension = path.extname(file.originalname).toLowerCase();
    // Validate the extension against the whitelist
    if (!allowedExtensions.has(extension)) {
      return cb(createError('File extension not allowed', 400));
    }
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-zip-compressed',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(createError('File type not allowed', 400));
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5,
  },
});

export const getFileType = (mimetype: string): 'image' | 'document' | 'archive' | 'other' => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.includes('pdf') || mimetype.includes('word') || mimetype.includes('excel') || mimetype.includes('text')) return 'document';
  if (mimetype.includes('zip') || mimetype.includes('compressed')) return 'archive';
  return 'other';
};