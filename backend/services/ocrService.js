// services/ocrService.js
const vision = require('@google-cloud/vision');
const pdfParse = require('pdf-parse');

// Initialize the client with proper authentication
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

async function processOCR(fileBuffer, mimeType) {
  try {
    let text = '';

    if (mimeType === 'application/pdf') {
      // Pentru PDF, folosim pdf-parse
      const pdfData = await pdfParse(fileBuffer);
      text = pdfData.text;
    } else {
      // Pentru imagini, folosim Vision API
      const request = {
        image: {
          content: fileBuffer.toString('base64')
        },
        features: [
          {
            type: 'TEXT_DETECTION'
          }
        ]
      };

      const [result] = await client.annotateImage(request);
      const detections = result.textAnnotations;
      
      if (detections && detections.length > 0) {
        text = detections[0].description;
      }
    }

    return text;
  } catch (error) {
    console.error('Error during document processing:', error);
    throw new Error('Failed to process document: ' + error.message);
  }
}

module.exports = { processOCR };