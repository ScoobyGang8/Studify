const express = require('express');
const app = express();
const roomRouter = require('./room');
const userRouter = require('./user');
const authRouter = require('./auth');
const uploadsRouter = require('./uploads');
const oauthRouter = require('./oauth');

app.use('/rooms', roomRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/uploads', uploadsRouter);
app.use('/oauth', oauthRouter);

module.exports = app;

