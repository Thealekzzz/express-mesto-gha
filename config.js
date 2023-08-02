const mongoose = require('mongoose');
const express = require('express');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

module.exports = {
  PORT,
  app,
};
