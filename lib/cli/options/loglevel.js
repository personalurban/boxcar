/**
 * Sets the log level
 * @arg -l
 * @arg --loglevel
 */

import { Option } from '../utils/general';
import print, { config, loglevel } from '../utils/print';

var setLevel = function *( next ) {
    let level = this.argv.L || this.argv.loglevel;
    if ( !level ) {
        yield next;
        return;
    }

    if ( loglevel[ level ] ) {
        level = loglevel[ level ];
    } else {
        print.warn( 'Unspecified log level' );
        print.warn( 'Using default log level' );
        level = loglevel.info;
    }

    // Set the loglevel and continue
    config({
        loglevel: level
    });

    yield next;
};


export default new Option()
    .name( '-L', '--loglevel' )
    .description( 'Sets the logging level' )
    .action( setLevel );
