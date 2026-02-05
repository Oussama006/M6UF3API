require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3021;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = process.env.MONGO_URI;
console.log("URI:", uri);

mongoose.connect(uri, {
  dbName: 'CotxesEsportius' 
})
.then(() => console.log('Connected to MongoDB: CotxesEsportius'))
.catch(err => console.error('MongoDB connection error:', err));

const cotxesSchema = new mongoose.Schema({
  marca: { type: String, required: true },
  model: { type: String, required: true },
  potenciaCV: Number,
  preu: Number,
  dataAlta: Date,
  disponible: Boolean,
  descripcio: String
});

const Cotxe = mongoose.model('Cotxe', cotxesSchema, 'cotxes');

app.get('/', (req, res) => {
  res.send('API CotxesEsportius OK');
});

app.get('/list', async (req, res) => {
  try {
    const cotxes = await Cotxe.find();
    res.status(200).json(cotxes);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching cars',
      error: err.message
    });
  }
});

app.post('/add', async (req, res) => {
  try {
    const cotxe = new Cotxe(req.body);
    await cotxe.save();
    res.status(201).json(cotxe);
  } catch (err) {
    res.status(400).json({
      message: 'Error adding car',
      error: err.message
    });
  }
});

app.get('/list/:dataini/:datafi', async (req, res) => {
  try {
    const { dataini, datafi } = req.params;

    const cotxes = await Cotxe.find({
      dataAlta: {
        $gte: new Date(dataini),
        $lte: new Date(datafi)
      }
    });

    res.status(200).json(cotxes);
  } catch (err) {
    res.status(500).json({
      message: 'Error filtering cars',
      error: err.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
