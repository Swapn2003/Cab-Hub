const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;
const {uberScrapeHeader}=require('./uber');
//const {olaScrapeHeader}=require('./ola');

// Enable CORS for all routes
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.render('index');
})

// POST request for '/submit' endpoint
app.post('/Uberprice', express.json(), (req, res) => {
  // Handle the POST request
  const data = req.body;
  // Handle the received data
  console.log(data);
  const result= uberScrapeHeader(data);
  result.then(result=>{
    res.json(result)
  }).catch(err =>{
    console.log(err);
  })
});

// Handle other requests
app.use((req, res) => {
  res.status(404).send('Not found');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
