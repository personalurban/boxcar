
/**
 * Default configuration options
 */
export default {

    path: {
        /**
         * Main application path
         */
        app: '/etc/boxcar',

        /**
         * Main boxcar db physical path
         */
        db: '/etc/boxcar/.db',

        /**
         * Cloned repositories go here
         */
        build: '/usr/share/boxcar/build',

        /**
         * Packed build tarballs end up here
         */
        pack: '/usr/share/boxcar/pack',

        /**
         * Boxcar user directory
         */
        usr: '/usr/share/boxcar'
    },

    /**
     * Private docker registry url
     */
    registry: 'localhost:5000'


};
