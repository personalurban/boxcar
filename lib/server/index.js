
var app = require( './server' );
var defaultPort = process.env.PORT || process.env.npm_package_config_port || 8008;


class Server {
    constructor( port ) {
        this.port = port || defaultPort;
    }

    start() {
        app.listen( this.port );
        console.log( 'Listening on port %s', this.port );
    }
}

export default Server;
