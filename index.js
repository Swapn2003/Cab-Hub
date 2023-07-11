const puppeteer = require('puppeteer');
// const cheerio = require('cheerio');
const { Keyboard, executablePath } = require('puppeteer');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.render('index');
})

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 10;
      const timer = setInterval(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 1);
    });
  });
}

async function scrapeHeader(data) {
  const browser = await puppeteer.launch({
          headless: true,
          // executablePath:"C:\Program Files (x86)\Google\Chrome\Application.exe",
          args : ['--window-size= 1800,1800']

  });
  const page = await browser.newPage();
  await page.goto('https://www.uber.com/global/en/price-estimate/');
  const pickup_input = await page.waitForSelector('#main > section:nth-child(3) > div > div.css-ofGld > div > div > div.css-hSmneJ > div > div.css-bwbuAu > div.css-gizoBm>input ');
  await pickup_input.type(data.originPlaceName)
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  
  try{
    await page.waitForSelector('#main > section:nth-child(3) > div > div.css-ofGld > div > div > div.css-hSmneJ > div > div.css-bwbuAu > ul', { timeout: 5000 });
  await page.evaluate(async() => {
    const suggestion =  document.querySelector("#main > section:nth-child(3) > div > div.css-ofGld > div > div > div.css-hSmneJ > div > div.css-bwbuAu > ul>li")
    await suggestion.click();
    return suggestion.innerHTML;
    
  })
  
}catch(err){
  console.log("Location Accurately Taken-1");
}


await new Promise((resolve) => setTimeout(resolve, 2000));
    // await autoScroll(page);

  const drop_input = await page.waitForSelector('#main > section:nth-child(3) > div > div.css-ofGld > div > div > div.css-hSmneJ > div > div.css-bwbuAu > div.css-TbLiS > div > input');
  await drop_input.type(data.destinationPlaceName)
  
try{ 
    await page.waitForSelector('#main > section:nth-child(3) > div > div.css-ofGld > div > div > div.css-hSmneJ > div > div.css-bwbuAu >ul', { timeout: 2000 });

    await page.evaluate(() => {
        const suggestions = document.querySelector("#main > section:nth-child(3) > div > div.css-ofGld > div > div > div.css-hSmneJ > div > div.css-bwbuAu >ul > li")
        suggestions.click();
        return suggestions.innerHTML;

    })

}catch(err){
    console.log("Location Accurately Taken-2");
}

  await page.waitForSelector('#main > section:nth-child(3) > div > div.css-ofGld > div > div > div.css-hSmneJ > div > div.css-cRgunC > div.pe-products.css-hGSsIm > div.pe-products-item.css-cSaIFq > div.text-area.css-kutmsD');
  await page.evaluate(() => {
    const suggestions = document.querySelector("#main > section:nth-child(3) > div > div.css-ofGld > div > div > div.css-hSmneJ > div > div.css-cRgunC > div.pe-products.css-hGSsIm > div.pe-products-item.css-cSaIFq > div.text-area.css-kutmsD");
    // suggestions.click();
    return suggestions.innerHTML;

  })

  await page.waitForSelector('#main > section:nth-child(3) > div > div.css-ofGld > div > div > div.css-hSmneJ > div > div.css-cRgunC > div.pe-products.css-hGSsIm > div.pe-products-item.css-cSaIFq > div.text-area.css-kutmsD');
  await page.click('#main > section:nth-child(3) > div > div.css-ofGld > div > div > div.css-hSmneJ > div > div.css-cRgunC > button');
  const Uber = await page.evaluate(()=>{
    const divs = Array.from(document.querySelectorAll('.text-area.css-kutmsD'));
    let Uber=[];
    const requestNow=document.querySelector('#main > section:nth-child(3) > div > div.css-ofGld > div > div > div.css-hSmneJ > div > div.css-cRgunC > div.css-bvJezk > div.css-bcpsMv > div:nth-child(1) > a');
    divs.forEach(div =>{
      div.click();
      let fare=div.querySelector('div').innerText;
      let name=div.innerText.replace(fare,"");
      let url=requestNow.href;
      fare=fare.replace(/\n/g," ");
      let uberObject = {
        name: name,
        fare: fare,
        url: url
      };
  
      Uber.push(uberObject);
    })
    
    return Uber;
  })
    
  await browser.close();
  return Uber;
  
}

// POST request for '/submit' endpoint
app.post('/Uberprice', express.json(), (req, res) => {
  // Handle the POST request
  const data = req.body;
  // Handle the received data
  console.log(data);
  const result= scrapeHeader(data);
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
