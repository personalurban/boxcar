
var app = require( './server' );
var defaultPort = process.env.PORT || process.env.npm_package_config_port || 8008;


class Server {
    constructor() {}

    start( port ) {
        app.listen( port || defaultPort );
        console.log( 'Listening on port %s', port || defaultPort );
    }
}

export default Server;
