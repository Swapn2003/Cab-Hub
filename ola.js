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


    // await page.waitForNavigation();
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
          // await page.waitForSelector ('body > ola-app');

            const textContent = await frameHandle.evaluate(selector => {
              const element = document.querySelector(selector);
              console.log(element);
              return element ? element.textContent : null;
            }, 'div.sso__title');
          
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
      console.log("hello");
    }

    
    await frameHandle.waitForSelector('input');
    const inputHandle = await frameHandle.$('input');


    if (inputHandle) {
      console.log("enter otp");
      const userInput = await getUserInput(); // Call the function to get user input from the terminal
      console.log(userInput);
      try{
        await frameHandle.type('input',userInput[0]);

      }catch(err){
        console.log("OTP couldnot be entered fully.")
      }
      try{
        await frameHandle.type('input',userInput[1]);

      }catch(err){
        console.log("OTP couldnot be entered fully.")
      }
      try{
        await frameHandle.type('input',userInput[2]);

      }catch(err){
        console.log("OTP couldnot be entered fully.")
      }
      try{
        // await inputHandle.type(userInput[3], { delay: 10 });
        await frameHandle.type('input',userInput[3]);

      }catch(err){
        console.log("OTP couldnot be entered fully.")
      }



      console.log('Input entered successfully!');
      const loginButtonHandle = await frameHandle.waitForSelector('div.sso__cta.enabled');

      if (loginButtonHandle) {
        await frameHandle.evaluate(element => {
          element.dispatchEvent(new Event('click', { bubbles: true }));
        }, loginButtonHandle);
        // await frameHandle.evaluate(element => {
        //   element.dispatchEvent(new Event('click', { bubbles: true }));
        // }, loginButtonHandle);

        console.log('Login Button clicked after entering otp!');
      } else {
        console.log('Login Button element not found inside the iframe of otp.');
      }
      await page.waitForNavigation();

    } else {
        console.log('opt Input element not found inside the iframe.');
      }
      // await page.waitForSelector("body > ola-app");
      // await page.waitForSelector();

      
      const price = await page.evaluate(async () => {
  await new Promise((resolve) => {
    const interval = setInterval(() => {
      const priceElement = document.querySelector("body > ola-app").shadowRoot.querySelector("iron-pages > ola-home").shadowRoot.querySelector("div.page-container.bg-light > ola-home-local").shadowRoot.querySelector("div > ola-cabs").shadowRoot.querySelector("div.card.car-cont.bg-white.when-NOW > div:nth-child(1) > div.middle > div.text.value.cab-name > span > span:nth-child(1)");
      
      if (priceElement && priceElement.innerText.trim().length > 0) {
        clearInterval(interval);
        resolve(priceElement.innerText);
      }
    }, 100); // Check every 100 milliseconds (adjust as needed)
  });
});

const price1 = await page.evaluate(()=>{
  //  return document.querySelector("body > ola-app").shadowRoot.querySelector("iron-pages > ola-home").shadowRoot.querySelector("div.page-container.bg-light > ola-home-local").shadowRoot.querySelector("div > ola-cabs").shadowRoot.querySelector("div.card.car-cont.bg-white.when-NOW > div:nth-child(1)").innerText;

  return document.querySelector("body > ola-app").shadowRoot.querySelector("iron-pages > ola-home").shadowRoot.querySelector("div.page-container.bg-light > ola-home-local").shadowRoot.querySelector("div > ola-cabs").shadowRoot.querySelector("div.card.car-cont.bg-white.when-NOW > div:nth-child(1) > div.middle > div.text.value.cab-name > span > span:nth-child(1)").innerText;
})


console.log("Auto - ",price1,`\n`);
const price2 = await page.evaluate(()=>{
//  return document.querySelector("body > ola-app").shadowRoot.querySelector("iron-pages > ola-home").shadowRoot.querySelector("div.page-container.bg-light > ola-home-local").shadowRoot.querySelector("div > ola-cabs").shadowRoot.querySelector("div.card.car-cont.bg-white.when-NOW > div:nth-child(1)").innerText;
return document.querySelector("body > ola-app").shadowRoot.querySelector("iron-pages > ola-home").shadowRoot.querySelector("div.page-container.bg-light > ola-home-local").shadowRoot.querySelector("div > ola-cabs").shadowRoot.querySelector("div.card.car-cont.bg-white.when-NOW > div:nth-child(3) > div.middle > div.text.value.cab-name > span > span:nth-child(1)").innerText;
})
console.log("Mini - ",price2,`\n`);

const price3 = await page.evaluate(()=>{
//  return document.querySelector("body > ola-app").shadowRoot.querySelector("iron-pages > ola-home").shadowRoot.querySelector("div.page-container.bg-light > ola-home-local").shadowRoot.querySelector("div > ola-cabs").shadowRoot.querySelector("div.card.car-cont.bg-white.when-NOW > div:nth-child(1)").innerText;
return document.querySelector("body > ola-app").shadowRoot.querySelector("iron-pages > ola-home").shadowRoot.querySelector("div.page-container.bg-light > ola-home-local").shadowRoot.querySelector("div > ola-cabs").shadowRoot.querySelector("div.card.car-cont.bg-white.when-NOW > div:nth-child(5) > div.middle > div.text.value.cab-name > span > span:nth-child(1)").innerText;
})
console.log("Bike - ",price3,`\n`);
const price4 = await page.evaluate(()=>{
//  return document.querySelector("body > ola-app").shadowRoot.querySelector("iron-pages > ola-home").shadowRoot.querySelector("div.page-container.bg-light > ola-home-local").shadowRoot.querySelector("div > ola-cabs").shadowRoot.querySelector("div.card.car-cont.bg-white.when-NOW > div:nth-child(1)").innerText;
return document.querySelector("body > ola-app").shadowRoot.querySelector("iron-pages > ola-home").shadowRoot.querySelector("div.page-container.bg-light > ola-home-local").shadowRoot.querySelector("div > ola-cabs").shadowRoot.querySelector("div.card.car-cont.bg-white.when-NOW > div:nth-child(7) > div.middle > div.text.value.cab-name > span > span:nth-child(1)").innerText;
})
console.log("Prime Sedan - ",price4,`\n`);
const price5 = await page.evaluate(()=>{
//  return document.querySelector("body > ola-app").shadowRoot.querySelector("iron-pages > ola-home").shadowRoot.querySelector("div.page-container.bg-light > ola-home-local").shadowRoot.querySelector("div > ola-cabs").shadowRoot.querySelector("div.card.car-cont.bg-white.when-NOW > div:nth-child(1)").innerText;
return document.querySelector("body > ola-app").shadowRoot.querySelector("iron-pages > ola-home").shadowRoot.querySelector("div.page-container.bg-light > ola-home-local").shadowRoot.querySelector("div > ola-cabs").shadowRoot.querySelector("div.card.car-cont.bg-white.when-NOW > div:nth-child(9) > div.middle > div.text.value.cab-name > span > span:nth-child(1)").innerText;
})
console.log("Prime SUV - ",price5,`\n`);

}

async function getUserInput() {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('Enter otp: ', (input) => {
      readline.close();
      resolve(input);
    });
  });
}



scrapeHeader();
