const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// mongoose.connect(process.env.DATABASE_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect("mongodb+srv://grabo_db:shadowpass@cluster0.toy7lbu.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
});

const Url = mongoose.model('Url', urlSchema);

app.get('/urls', async (req, res) => {
  try {
      const urls = await Url.find();
      res.json(urls);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

app.get('/:shortUrl', async (req, res) => {
  const url = await Url.findOne({ shortUrl: req.params.shortUrl });
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).json('URL not found');
  }
});

app.post('/shorten', async (req, res) => {
  const originalUrl = req.body.originalUrl;
  const shortUrl = Math.random().toString(36).substring(7);
  const url = new Url({
    originalUrl: originalUrl,
    shortUrl: shortUrl,
  });
  await url.save();
  res.json(url);
});


console.log('Listening on port ' + 5000)
app.listen(process.env.PORT || 5000);
