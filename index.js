require('colors');
var _consulService = require('boxfishconsul').init();

module.exports = function (sails) {

  return {

    /**
     * Tries to to find AD-BOX router from consul
     */
    _findRouterFromConsul: function _findRouterFromConsul() {
      _consulService.findService('ad-box').then(function(service) {

        // TODO: set environment var if found

        console.log('findService success'.green, arguments);

      }, function() {
        console.log(arguments);
      });
    },

    /**
     * register itself with consul
     */
    _registerWithConsul: function _registerWithConsul() {
      // TODO: to implement
    },

    /**
     * Intialise the hook
     */
    initialize: function(cb) {
      // do stuff
      return cb();
    },

    /**
     * Configure the hook
     */
    configure: function() {

      this._findRouterFromConsul();
      this._registerWithConsul();

    },

    // ROUTES

    routes: {
      before: {

        /**
         * logs stuff on any GET
         */
        'GET /*' : function(req, res, next) {
          sails.log.verbose('GET: '.yellow, req.originalUrl);
          next();
        },

        /**
         *
         */
        'GET /test': function (req, res, next) {
          this.numRequestsSeen++;
          return res.json({
            test: 'just a test',
            num: this.numRequestsSeen
          });
        },

        'GET /health': function(req, res, next) {
          _consulService.nodeList(function(list) {
            return res.json(list);
          });
        }
      },
      after: {

      }
    }

  }

};
