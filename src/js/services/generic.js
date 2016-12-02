'use strict';

/* generic endpoint */
module.exports = function(callback) {
  return function(calendarium) {
    return callback(calendarium);
  };
};