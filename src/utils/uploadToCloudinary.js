
import dotenv from 'dotenv';
import fs from 'fs/promises';
import cloudinary from './cloudinary.js';

dotenv.config();

export const uploadToCloudinary = async (file) => {
 try{ const response = await cloudinary.v2.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;} catch(error){
    console.log('cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};