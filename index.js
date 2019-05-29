// Captive Portal Login
'use strict';

const logger = require('./config/winston');
const credentials = require('./credentials');
const portalmain = require('./portalmain');
const puppeteer = require('puppeteer');
const util = require('util');

const testUrl = 'https://fedoraproject.org/static/hotspot.txt';
let loginPage = null;
let browser = null;

async function browser_open() {
  let myBrowser = await puppeteer.launch({
      headless: true,
      args: ['--window-size=960,1080',
      '--ignore-certificate-errors',
      '--enable-features=NetworkService'
    ]})
  return myBrowser;
}

async function new_page(myBrowser) {
  let myPage = await myBrowser.newPage();
  await myPage.setViewport({ width: 960, height: 1080 });
  return myPage;
}

async function run() {
  logger.info('Starting Captive Portal Login');

  browser = await browser_open();
  let uname = await credentials.get_username();
  let pword = await credentials.get_password();

  while (true) {
    logger.info('Attempting login to site');
    loginPage = await new_page(browser);

    try {
      await portalmain.login(loginPage, uname, pword);
    } catch (e) {
      logger.warn("WARN: First login attempt didn't work, trying second time [%s]", e);
      // Usually this is something where the page didn't load correctly lets try again
      await loginPage.close();
      await browser.close();
      browser = await browser_open();
      loginPage = await new_page(browser);

      try {
        await portalmain.login(loginPage, uname, pword);
      } catch (e) {
        logger.error("ERROR: Second attempt failed to login [%s]", e);
        throw(e);
      }
    }

    // Wait one hour then do it again
    // milliseconds * seconds * minutes * hours;
    let cycles = 0;
    let maxCycles = 2;
    let hours_to_wait = 5;
    let timeout = 1000 * 60 * 60 * hours_to_wait;

    while (true) {
      cycles += 1;
      if ( cycles > maxCycles ) {
        break;
      }

      let testPage = await new_page(browser);
      try {
        await testPage.goto(testUrl);
      } catch (e) {
        logger.error('Navigation to [%s] failed with [%s]',testUrl,e);
        break;
      }
      let response = await testPage.evaluate(() => document.querySelector('pre').innerText);

      if ( response === 'OK' ) {
        logger.info('Response was [%s]',response);
        await testPage.waitFor(timeout);
        await testPage.close();
      } else {
        // Didn't find Fedora page and need to try again
        logger.error('Response unexpected with [%s]', response);
        await testPage.close();
        break;
      }
    }

    logger.warn('Trying to login again.');
    await loginPage.close();
    await browser.close();
    browser = await browser_open();
  }
}

run().catch((e) => {
  logger.error(e);
  if ( loginPage !== null ) {
    loginPage.close();
  }
  if ( browser !== null ) {
    browser.close();
  }
});
