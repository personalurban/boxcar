/* es6:babel */
/**
 * Boxcar main app object
 */

var pkg = require( '../package' );

class App {
    constructor() {
        console.log( 'Boxcar is rollin rollin rollin' );
    }

    get version() {
        return pkg.version;
    }
}


module.exports = new App();
