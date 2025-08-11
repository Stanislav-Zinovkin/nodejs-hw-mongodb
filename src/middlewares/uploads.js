import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'contact_photos',
        allowed_formats: ['jpg','jpeg','png'],
    },
});
const parser = multer({storage});

export default parser;