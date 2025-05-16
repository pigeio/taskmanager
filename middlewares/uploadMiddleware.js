const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Corrected "destintion" to "destination"
    },
    filename: (req, file, cb) => {
        // Rename file to include timestamp to avoid name collisions
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Optional: File filter (example for image files only)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png','image.jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg, .and .png formats are allowed'), false);
    }
};

// Set up multer middleware
const upload = multer({ storage , fileFilter}); // 5MB limit


module.exports = upload;
