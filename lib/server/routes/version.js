var app = require( '../../app' );

module.exports = function *( next ) {
    this.status = 200;
    this.body = {
        version: app.version
    };
};
