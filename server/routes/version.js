var app = require( '../../lib/main' );

module.exports = function *( next ) {
    console.log( app.value );
    this.status = 200;
    this.body = {
        version: app.version
    };
};
