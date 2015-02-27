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
        // console.log( 'hello' );
        // var paths = Object.keys( config.path ).map( function( key ) {
        //     console.log( key );
        //     return config.path[ key ];
        // });
        //
        // console.log( paths );

        makeAll([
            '/etc/boxcar',
            '/var/log/boxcar',
            '/usr/share/boxcar',
            '/usr/share/boxcar/build',
            '/usr/share/boxcar/pack',
            '/etc/boxcar/.db'
        ])
            .then( resolve )
            .catch( reject );
    });
}
