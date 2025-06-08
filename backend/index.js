const app = require('./app');

const PORT = 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` API Health Check: http://localhost:${PORT}/api/health`);
  console.log(` Streak API: http://localhost:${PORT}/api/streak`);
  console.log(` Coins API: http://localhost:${PORT}/api/coins`);
  console.log(` Store API: http://localhost:${PORT}/api/store`);
});