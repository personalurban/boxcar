/**
 * boxcar
 */

require( 'babel/register' );

var path        = require( 'path' );

var koa         = require( 'koa' );
var logger      = require( 'koa-bunyan-logger' );
var serve       = require( 'koa-static' );
var route       = require( 'koa-route' );
var mount       = require( 'koa-mount' );
var json        = require( 'koa-json' );

var render      = require( './util/views' );

var app         = require( '../lib/main' );


var server = koa();

server.use( logger() );
server.use( logger.requestLogger() );
server.use(json({ pretty: false, param: 'pretty' }));

// Custom 404
server.use( function *( next ) {
    yield next;

    if ( this.body || !this.idempotent ) {
        return;
    }

    this.status = 404;
    this.body = yield render( '404' );
});

// Version
server.use( route.get( '/version', require( './routes/version' )));


// Serve the frontend
server.use( serve( path.join( __dirname, '../public' ) ) );


// Export composable app
module.exports = server;
