import cloudinary from "../utils/cloudinary.js";
import multer from "multer";
import {CloudinaryStorage} from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "offer_letters",
      resource_type: "auto",
    },
  });
  
  const upload = multer({ storage });
  
  export default upload;



  