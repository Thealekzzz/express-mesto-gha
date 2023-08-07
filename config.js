const mongoose = require('mongoose');
const express = require('express');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

const allowedCors = [
  'http://kznv.alex.nomoreparties.co',
  'https://kznv.alex.nomoreparties.co',
  'localhost:3000',
];

module.exports = {
  PORT,
  app,
  allowedCors,
};
