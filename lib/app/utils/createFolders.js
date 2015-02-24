/**
 * Creates app folders
 */

import mkdirp from 'mkdirp';

export default function() {
    return new Promise( ( resolve, reject ) => {
        try {
            mkdirp.sync( '/etc/boxcar' );
            mkdirp.sync( '/var/log/boxcar' );
            mkdirp.sync( '/usr/share/boxcar' );

            mkdirp.sync( '/usr/share/boxcar/build' );
            mkdirp.sync( '/usr/share/boxcar/pack' );
            mkdirp.sync( '/etc/boxcar/.db' );
        } catch( err ) {
            reject( err );
        }
        resolve();
    });
}
