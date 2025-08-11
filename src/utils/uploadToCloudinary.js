import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = async (filePath, folder = 'contacts') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: 'image',
        });
        return result.secure_url;
    }catch (error) {
        throw new Error('Failed to upload file to Cloudinary')
    }
}