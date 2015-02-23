/**
 * Simply logs how long the request took
 */
export default function *( next ) {
    var start = Date.now();
    yield next;
    console.log( 'Executed in', Date.now() - start, 'ms' );
}
