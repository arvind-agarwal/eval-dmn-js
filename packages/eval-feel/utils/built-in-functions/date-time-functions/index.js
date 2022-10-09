/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

const { now } = require('lodash');

module.exports = Object.assign({},
  require('./time'),
  require('./date-time'),
  require('./date'),
  require('./duration'),
  require('./misc')
  );
