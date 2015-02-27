/**
 * Creates app folders
 */

import mkdirp from 'mkdirp';
import config from '../store/configStore';

function make( pathname ) {
    return new Promise( ( resolve, reject ) => {
        mkdirp( pathname, function( err ) {
            if ( err ) {
                reject( err );
            }

            resolve();
        });
    });
}

function makeAll( paths ) {
    return new Promise( ( resolve, reject ) => {
        var promises = paths.map( make );
        Promise.all( promises )
            .then( resolve )
            .catch( reject );
    });
}

export default function() {
    return new Promise( ( resolve, reject ) => {

        // Grab the paths from the config
        var paths = Object.keys( config.path ).map( function( key ) {
            return config.path[ key ];
        });
        
        makeAll( paths )
            .then( resolve )
            .catch( reject );
    });
}
