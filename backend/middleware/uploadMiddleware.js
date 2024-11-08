// middleware/uploadMiddleware.js
const multer = require('multer');

// Folosește multer pentru a gestiona încărcările de fișiere
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload.single('file');
