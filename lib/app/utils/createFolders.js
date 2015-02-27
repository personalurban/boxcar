/**
 * Creates app folders
 */

import mkdirp from 'mkdirp';

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
