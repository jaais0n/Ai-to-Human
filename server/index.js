require('dotenv').config();
process.env.XDG_CONFIG_HOME = '/tmp/.config/';
const express = require('express');
const cors = require('cors');

const rateLimit = require('express-rate-limit');

const humanizeRoutes = require('./routes/humanize');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for Vercel deployment to get accurate client IP for rate limiting
app.set('trust proxy', 1);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all origins for this personal humanizer tool to prevent CORS errors on Vercel
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 20, // Limit each IP to 20 requests per `window`
  message: { error: 'Too many requests. Please slow down.' },
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use('/api/humanize', apiLimiter, humanizeRoutes);
app.use('/api/health', healthRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: err.message || 'Internal server error.',
    stack: err.stack
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 AI Humanizer API running at http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  });
}

module.exports = app;
