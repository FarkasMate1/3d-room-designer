const express = require('express');
const cors = require('cors');
const { env } = require('./config/env');
const routes = require('./routes/index');
const { errorHandler } = require('./middlewares/errorHandler');
const { AppError } = require('./errors/AppError');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.url} not found`, 404));
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});

module.exports = app;
