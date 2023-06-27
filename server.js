const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  // isFav: Boolean,
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
  try {
    const originalUrl = req.body.originalUrl;
    let shortUrl = Math.random().toString(36).substring(process.env.URLLENGTH);   // This line was created with ChatGPT
    
    let url = await Url.findOne({ shortUrl: shortUrl });
    
    while (url) {
      shortUrl = Math.random().toString(36).substring(7);
      url = await Url.findOne({ shortUrl: shortUrl });
    }
    
    url = new Url({
      originalUrl: originalUrl,
      shortUrl: shortUrl,
    });
    
    await url.save();
    res.json(url);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/urls/:shortUrl', async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;

    const url = await Url.findOneAndDelete({ shortUrl: shortUrl });

    if (!url) {
      res.status(404).json({ message: "URL not found" });
    } else {
      res.json({ message: "URL deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


console.log('Listening on port ' + process.env.PORT)
app.listen(process.env.PORT || 5000);