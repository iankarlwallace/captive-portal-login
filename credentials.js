// Credentials functions to get them from the command line
'use strict';
const readline = require('readline-sync');
const username = undefined;
const password = undefined;

var credentials = {
  _if_undef_readline: async function(myVar, myQuestion) {
    if (myVar === undefined) {
      myVar = await readline.question(myQuestion, {
        hideEchoBack: true
      });
    }
    return myVar;
  },
  get_username: async function() {
    this.username = await this._if_undef_readline(this.username,
      "Username: ");
    return this.username.toString();
  },
  get_password: async function() {
    this.password = await this._if_undef_readline(this.password,
      "Password: ");
    return this.password.toString();
  }
};

module.exports = credentials;
