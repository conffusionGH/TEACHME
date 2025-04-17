import fs from 'fs/promises';
import path from 'path';

export const getLocalFilePath = (fileUrl) => {
  const serverDomain = process.env.SERVER_DOMAIN || 'http://localhost:8000';
  const relativePath = fileUrl.replace(serverDomain, '');
  return path.join(process.cwd(), relativePath);
};

export const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`Deleted file: ${filePath}`);
  } catch (err) {
    console.error(`Error deleting file ${filePath}:`, err);
  }
};