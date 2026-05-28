require('dotenv').config();
process.env.XDG_CONFIG_HOME = '/tmp/.config/';
const express = require('express');
const cors = require('cors');

const humanizeRoutes = require('./routes/humanize');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all localhost origins (any port)
      if (!origin || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/humanize', humanizeRoutes);
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
