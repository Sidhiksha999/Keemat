import express from 'express';
import multer from 'multer';
import { analyzeCropQuality } from '../services/aiVisionService.js';
import { getRAGAdvisory } from '../services/ragAdvisoryService.js';
import ChatSession from '../models/ChatSession.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// AI Crop Quality Scanner Endpoint (Supports 'image' or 'photo' field)
router.post('/crop-scan', upload.any(), async (req, res) => {
  try {
    let imageBuffer = null;
    let mimeType = 'image/jpeg';

    if (req.files && req.files.length > 0) {
      imageBuffer = req.files[0].buffer;
      mimeType = req.files[0].mimetype;
    } else if (req.file) {
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
    } else {
      // Fallback 1-pixel sample image if no file buffer attached
      imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    }

    const result = await analyzeCropQuality(imageBuffer, mimeType);
    res.json({ success: true, analysis: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI RAG Advisory Endpoint
router.post('/rag-advisory', async (req, res) => {
  try {
    const { question, query, sessionId } = req.body;
    const userQuery = question || query;

    if (!userQuery) {
      return res.status(400).json({ success: false, error: 'Question or query parameter is required.' });
    }

    const advisory = await getRAGAdvisory(userQuery);

    let chatSession = null;
    if (sessionId) {
      chatSession = await ChatSession.findOne({ sessionId });
      if (!chatSession) {
        chatSession = new ChatSession({ sessionId, messages: [] });
      }
      chatSession.messages.push({ sender: 'user', text: userQuery });
      chatSession.messages.push({ sender: 'assistant', text: advisory.answer, contextSources: advisory.sources });
      await chatSession.save();
    }

    res.json({
      success: true,
      answer: advisory.answer,
      sources: advisory.sources,
      chatSession
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
