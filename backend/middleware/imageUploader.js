const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (filePath, folder = "uploads") => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: "auto",
        });
        return result.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};
