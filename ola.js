const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { Keyboard, executablePath } = require('puppeteer');

async function scrapeHeader() {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://book.olacabs.com/?lat=26.4873983&lng=74.630054&drop_lat=26.481868&drop_lng=74.609363');
        await page.waitForSelector ('body > ola-app');
        await page.evaluate( async()=>{
          const elem = await document.querySelector("body > ola-app").shadowRoot.querySelector("#dialog").shadowRoot.querySelector("#cancel");
          //  console.log(elem.innerHTML);
          await elem.click();
        })   
        await page.waitForSelector ('body > ola-app');
    await page.evaluate( async()=>{
      await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the delay as needed
      
      const elem = await document.querySelector("body > ola-app").shadowRoot.querySelector("#login");
      console.log(elem);
      await elem.click();
    })
    
    const shot = await page.evaluateHandle(async () => {
      const olaAppElement = document.querySelector("body > ola-app");
      const olaModalElement = olaAppElement.shadowRoot.querySelector("ola-modal");
      const olaLoginElement = olaModalElement.shadowRoot.querySelector("ola-login");
      return olaLoginElement.shadowRoot;
      
    });
    console.log(shot);
    const innerHTML = await page.evaluate(element => element.innerHTML, shot);
    // console.log(innerHTML);   
    
            // Evaluate the iframe element within the Shadow DOM
        const iframeElementHandle = await shot.$('iframe');
        console.log(iframeElementHandle);
        // Get the frame handle for the iframe
        const frameHandle = await iframeElementHandle.contentFrame();
        // console.log(frameHandle);
        
        await frameHandle.waitForSelector('input');
        await frameHandle.type('input', '8432574234');
        try {
          // await frameHandle.waitForLoadState('load');
          await page.waitForSelector ('body > ola-app');

            const textContent = await frameHandle.evaluate(selector => {
              const element = document.querySelector(selector);
              console.log(element);
              return element ? element.textContent : null;
            }, 'div.sso_title');
          
            if (textContent !== null) {
              console.log(textContent);
            } else {
              console.log('Target element not found inside the iframe.');
            }
          } catch (err) {
            console.error('Error occurred while evaluating the selector:', err);
          }
          
              const buttonHandle = await frameHandle.waitForSelector('div.sso__cta.enabled');
    if (buttonHandle) {
      const buttonText = await frameHandle.evaluate(element => element.innerText, buttonHandle);
      await frameHandle.evaluate(element => {
        element.dispatchEvent(new Event('click', { bubbles: true }));
      }, buttonHandle);
    }
    else{
      console.log("Error while clicking next");
    }
}

scrapeHeader();