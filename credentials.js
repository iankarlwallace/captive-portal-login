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
    if( this.username === undefined ) {
      this.username = await this._if_undef_readline(this.username,
        "Username: ");
    }
    return this.username.toString();
  },
  set_username: async function(uname) {
    this.username = uname;
  },
  get_password: async function() {
    if( this.password === undefined ) {
      this.password = await this._if_undef_readline(this.password,
        "Password: ");
    }
    return this.password.toString();
  },
  set_password: async function(pword) {
    this.password = pword;
  }
};

module.exports = credentials;
