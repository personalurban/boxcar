/* es6:babel */
/**
 * Boxcar main app object
 */

var pkg = require( '../../package' );

class App {
    constructor() {

    }

    get version() {
        return pkg.version;
    }
}


module.exports = new App();
