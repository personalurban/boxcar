/**
 * Displays the version notice
 * @arg -v --version
 */

import app from '../../app';
import { Option } from '../utils/general';
import print, { config, loglevel } from '../utils/print';


var version = function *( next ) {
    let ver = this.argv.v || this.argv.version;

    if ( !ver ) {
        yield next;
        return;
    }

    print.log( app.version );

    var res = yield app.getVersion();
    print.log( res );

    return;
}


export default new Option()
    .name( '-v', '--version' )
    .description( 'Displays the boxcar version' )
    .action( version );
