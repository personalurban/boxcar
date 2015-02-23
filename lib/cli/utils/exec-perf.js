/**
 * Simply logs how long the request took
 */
export default function( opts ) {
    return function *( next ) {
        var start = Date.now();
        yield next;
        console.log( 'Executed in', Date.now() - start, 'ms' );
    };
}
