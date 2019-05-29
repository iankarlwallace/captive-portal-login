// Portal Main that controls the captive login process
'use strict';

const logger = require('./config/winston');
const LOGOUT_XPATH = '//*[@id="UserCheck_Logoff_Button_span"]';
const LOGIN_XPATH = '//*[@id="UserCheck_Login_Button_span"]';
const USERNAME_XPATH = '//*[@id="LoginUserPassword_auth_username"]';
const PASSWORD_XPATH = '//*[@id="LoginUserPassword_auth_password"]';

var cures_website = {
  _click_xpath: async function(page, myXpath) {
    const linkHandlers = await page.$x(myXpath);
    if (linkHandlers.length > 0) {
      await linkHandlers[0].click();
    } else {
      throw new Error("Link not found");
    }
  },
  _fill_xpath: async function(page, xpathsel, myVal) {
    await this._click_xpath(page, xpathsel);
    await page.keyboard.type(myVal);
  },
  login: async function(page, username, password) {
    logger.info('Login started username [%s]', username);

    try {
      await Promise.all([
        page.waitFor(USERNAME_XPATH),
        page.goto('https://157.145.216.3/connect/PortalMain')
      ]);
    } catch (e) {
      // Sometimes the site is still logged in look for the logout button
      // instead and if it's there then just return
      try {
        const linkHandlers = await page.$x(LOGOUT_XPATH);
        if (linkHandlers.length > 0) {
          logger.info('Already logged on, returning.');
          return;
        } else {
          logger.error(e);
          throw new Error('Something is whacky. No login button found.');
        }
      } catch (innerError) {
        logger.error(e);
        throw (e);
      }
    }

    try {
      await this._fill_xpath(page, USERNAME_XPATH, username);
      await this._fill_xpath(page, PASSWORD_XPATH, password);
      await Promise.all([
        page.waitFor(LOGOUT_XPATH),
        this._click_xpath(page, LOGIN_XPATH)
      ]);
    } catch (e) {
      logger.error(e);
    }
    logger.debug('Login finished');
  },
  logout: async function(page) {
    logger.debug('Logout started');
    try {
      await this._click_xpath(page, LOGOUT_XPATH);
    } catch (e) {
      logger.error(e);
    }
    logger.debug('Logout finished');
  }
};

module.exports = cures_website;
