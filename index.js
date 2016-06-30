require('colors');
var _consulService = require('boxfishconsul').init();

module.exports = function (sails) {

  return {

    /**
     * Tries to to find AD-BOX router from consul
     */
    _findRouterFromConsul: function _findRouterFromConsul() {

      if (typeof sails.config.adBox !== 'undefined' && typeof sails.config.adBox.host !== 'undefined') {
        sails.log.info('AdBox is already defined so we wont override it');
        return;
      }

      if (!sails.config.adBox) {
        sails.config.adBox = {
          port: 8080 // default port for the router
        };
      }

      _consulService.findService('router').then(function(service) {

        if (!service) {
          sails.log.error('ad-box not registered with consul');
        } else {
          // setting env var
          process.env.AD_BOX = service;
          sails.log.info('setting ad box', JSON.stringify(process.env.AD_BOX));
          // override the config host
          sails.config.adBox.host = service.Address;
        }

      }, function() {
        console.log(arguments);
      });
    },

    /**
     * Intialise the hook
     */
    initialize: function(cb) {

      var self = this;

      this.name = require('../../../package.json').name;

      // deregister on sails lower
      sails.on('lower', function() {
        console.log('lowering sails'.yellow, self.name);
        self.deregisterWithConsul(self.name);
      });

      // register the service
      this.registerWithConsul(this.name);
      this.discoverRouterInConsul();

      return cb();
    },

    /**
     * register itself with consul
     */
    registerWithConsul: function registerWithConsul(name) {
      var self = this;
      _consulService.api.agent.service.register(name, function(err) {
        if (err) sails.log.error(err);
        else sails.log.info(self.name + ' registered successfully');
      });
    },

    /**
     * deregister itself
     */
    deregisterWithConsul: function deregisterWithConsul(name) {
      var self = this;
      _consulService.api.agent.service.deregister(name, function(err) {
        if (err) sails.log.error(err);
        else sails.log.info(self.name + ' deregistered successfully');
      });
    },

    /**
     * discovers the router ( ad-box ) in consul
     */
    discoverRouterInConsul: function discoverRouterInConsul() {

      'use strict';

      if (sails.config.environment !== 'development') {

        _consulService.findService('router').then((instance) => {

          sails.log.debug('AD-BOX from consul', instance);
          sails.config.adBox.host = instance.Address;
          sails.config.adBox.port = instance.ServicePort;
        }, (error) => {

          console.log(error);
        });
      }
    },

    /**
     * Configure the hook
     */
    configure: function() {

      var self = this;

      sails.on('hook:orm:loaded', function() {
        self._findRouterFromConsul();
      });

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
