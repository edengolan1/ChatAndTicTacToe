require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/AuthRoutes');
const chatRoutes = require('./routes/ChatRoutes');
const messageRoutes = require('./routes/MessageRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/Login')
.then(() => {
    console.log('MongoDB connection successful');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
});

const PORT = process.env.PORT || 7000;

app.use('/', userRoutes);
app.use('/chats',chatRoutes);
app.use('/messages',messageRoutes);

app.listen(PORT, (err) => {
  if (err) {
      console.log('Error starting server:', err);
  } else {
      console.log(`Server started on ${PORT}`);
  }
});