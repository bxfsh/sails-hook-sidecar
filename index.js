require('colors');

module.exports = function (sails) {

 return {

    initialize: function(cb) {
     this.numRequestsSeen = 0;
     this.numUnhandledRequestsSeen = 0;
     return cb();
    },

    /**
     * Configure the hook
     */
    configure: function() {

      console.log('configure');

      this.consulService = require('boxfishconsul').init();

      console.log(this.consulService.findService);

      this.consulService.findService('ad-box').then(function(service) {

        // TODO: set environment var if found

        console.log('findService success'.green, arguments);


      }, function() {
        console.log('?');
        console.log(arguments);
      });

    },

    routes: {
      before: {

        /**
         * logs stuff on any GET
         */
        'GET /*' : function(req, res, next) {
          console.log('test');
          next();
        },

        'GET /test': function (req, res, next) {
          this.numRequestsSeen++;
          return res.json({
            test: 'just a test',
            num: this.numRequestsSeen
          });
        }
      },
      after: {

      }
    }

  }

};
