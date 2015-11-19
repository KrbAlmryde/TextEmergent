

var Letter = function( letter, material ) {
    // Set our scope and inheritance
    var scope = this,
    THREE.Sprite.call(this, material);

    // Setup basic linguistic components
    var vowels = 'aeiouy',
    this.char = letter.charAt(0);
    this.isVowel = vowels.include( this.char ) ? true : false

    // Setup our navigation variables
    vector = new THREE.Vector3(),
    _acceleration, _width = 4, _height = 4, _depth = 2, _goal, _neighborhoodRadius = 1,
    _maxSpeed = 0.4, _maxSteerForce = 0.01, _avoidWalls = false;

    this.velocity = new THREE.Vector3();
    _acceleration = new THREE.Vector3();


    //////////////////////////////////////////////////////////////////////
    //   Begin Method definitions
    //
    //  Note: Most of this logic comes
    //  from the THREE.js examples page found:
    //  http://threejs.org/examples/#canvas_geometry_birds
    //////////////////////////////////////////////////////////////////////

    this.setGoal = function( target ) {
        _goal = target;
    }

    this.setAvoidWalls = function ( value ) {

        _avoidWalls = value;

    };

    this.setWorldSize = function ( width, height, depth ) {

        _width = width;
        _height = height;
        _depth = depth;

    };


}

Letter.prototype = Object.create( THREE.Sprite.prototype );
Letter.prototype.constructor = Letter;



var Word = function( letters, material )
{
    THREE.Sprite.call(this, params);

    var scope = this;
    this.velocity = new THREE.Vector3();
    this.letters = [];
    this.duration = Date.now();
    this.isProto = true; // Is considered a proto-word until otherwise noted...
    this.isFailing = false;  // Determines if its failing as a word or not.
}

Word.prototype = Object.create( THREE.Sprite.prototype );
Word.prototype.constructor = Word;
