// controllers/ocrController.js
const { processOCR } = require('../services/ocrService');

async function handleOCR(req, res) {
  try {
    // Verifică dacă fișierul a fost trimis
    if (!req.file) {
      return res.status(400).json({ error: 'Fișierul este necesar' });
    }

    // Verifică tipul fișierului
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        error: 'Tip de fișier nepermis. Sunt acceptate doar PDF, JPEG și PNG.' 
      });
    }

    console.log('Procesare document de tip:', req.file.mimetype);

    // Procesează documentul
    const extractedText = await processOCR(req.file.buffer, req.file.mimetype);
    
    res.json({ 
      text: extractedText,
      mimeType: req.file.mimetype
    });

  } catch (error) {
    console.error('Eroare procesare document:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { handleOCR };