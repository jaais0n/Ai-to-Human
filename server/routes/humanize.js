const express = require('express');
const router = express.Router();
const { humanizeText } = require('../services/openai.service');

router.post('/', async (req, res) => {
  try {
    const {
      text,
      mode,
      strength,
      creativity,
      complexity,
      tone,
    } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required.' });
    }

    if (text.length > 12000) {
      return res
        .status(400)
        .json({ error: 'Text is too long. Maximum 12,000 characters.' });
    }

    const result = await humanizeText({
      text: text.trim(),
      mode,
      strength,
      creativity,
      complexity,
      tone,
    });

    return res.json({ success: true, result });
  } catch (err) {
    console.error('[Humanize Error]', err.message);
    return res.status(500).json({
      error: err.message || 'Failed to humanize text. Please try again.',
    });
  }
});

module.exports = router;
