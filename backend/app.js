const express = require('express');
const corsMiddleware = require('./middleware/cors');
// const streakRoutes = require('./routes/streakRoutes.js');
// const coinRoutes = require('./routes/coinRoutes.js');
// const storeRoutes = require('./routes/storeRoutes');

const streakRoutes = require('./routes/streakRoutes');
const coinRoutes = require('./routes/coinRoutes');
const storeRoutes = require('./routes/storeRoutes');

const app = express();


app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use('/api/coin', coinRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/coins', coinRoutes);
app.use('/api/store', storeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Coding Consistency Tracker API is running!',
    timestamp: new Date().toISOString()
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});


// app.use((err, req, res) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     success: false, 
//     message: 'Something went wrong!' 
//   });
// });
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

module.exports = app;
