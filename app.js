const express = require('express');
const apiBouncer = require('./apiBouncer'); // Import the middleware
const app = express();
const PORT = 3000;


app.use('/api/products', apiBouncer);


app.get('/api/products', (req, res) => {
  res.json({ message: 'List of products' });
});


app.get('/api/public', (req, res) => {
  res.send('This route is public');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});