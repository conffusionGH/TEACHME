import fs from 'fs/promises'; // Using promises version for cleaner code
import path from 'path';

export const deleteImageFile = async (filePath) => {
  try {
    await fs.access(filePath); // First check if file exists
    await fs.unlink(filePath);
    console.log(`Successfully deleted file: ${filePath}`);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`File not found: ${filePath}`);
    } else {
      console.error(`Error deleting file ${filePath}:`, err);
    }
    return false;
  }
};

export const getLocalImageFilePath = (url) => {
  // Handle cases where URL might be full URL or just path
  const pathPart = url.startsWith('http') 
    ? new URL(url).pathname 
    : url;
  
  const filename = pathPart.split('/').pop();
  const fullPath = path.join(process.cwd(), 'api', 'assets', 'images', filename);
  
  console.log(`Resolved file path: ${fullPath}`); // Debug logging
  return fullPath;
};