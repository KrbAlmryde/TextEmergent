// For determining random direction...?
var UnitSphere = new THREE.Sphere(new THREE.Vector3(), 0.5);


function Letter( letter ) {
    // Set our scope and inheritance
    var scope = this;

    // Setup basic linguistic components
    var vowels = 'aeiouy';
    this.char = letter.charAt(0);
    this.isVowel = vowels.includes( this.char ) ? true : false;

    // Setup our navigation variables
    this._target = randPoint(10, 5),
    this._width = 4,
    this._height = 4,
    this._depth = 4,
    this.maxspeed = 0.01,
    this.maxforce = 0.1

    // position comes free through inheriting from THREE.Sprite
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();

    this.t = 0;
    this.delta = 0.005;
    if (!LetterMaterials.hasOwnProperty(letter))
        letter = ' '
    THREE.Sprite.call( this, LetterMaterials[letter] );

    LetterGroup.add(this);
    this.position.copy(randPoint(10, 5) );
}

// Establish inheritance
Letter.prototype = Object.create( THREE.Sprite.prototype );
Letter.prototype.constructor = Letter;


//////////////////////////////////////////////////////////////////////
//   Begin Method definitions
//////////////////////////////////////////////////////////////////////

Letter.prototype.run = function() {
    this.wander();
    this.update();
    // this.border();
}

Letter.prototype.setTarget = function( t ) {
    this._target.copy( t );
};


Letter.prototype.applyForce = function(force) {
    this.acceleration.add(force);
}

Letter.prototype.setBehavior = function( activity ) {
    this.behavior = activity || wander ;
}

//
Letter.prototype.seek = function() {
    // This is a vector pointing from the location to the target
    var desired = new THREE.Vector3().subVectors(this._target, this.position);   // I THINK this will be fine...

    // Normalize desired and scale with arbitrary damping within 100 pixels...huh?
    desired.normalize();

    desired.multiplyScalar(this.maxspeed);

    var steer = new THREE.Vector3().subVectors(desired, this.velocity);
    steer.copy( _limit(steer, this.maxforce) );
    this.applyForce(steer);


    if (this.position.distanceTo(this._target) < 0.001) {
        // Here we will want to 'combine objects to begin to create words'
        // Or, we will 'flee' from objects, etc
    };
}


// Same as Seeking a target with the exception that it object will slow down on
// approach to target
Letter.prototype.arrive = function() {
    // This is a vector pointing from the location to the target
    var desired = new THREE.Vector3().subVectors(this._target, this.position);   // I THINK this will be fine...

    var d = desired.length();  // Calculate the magnitude...
    desired.normalize();

    if (d < 0.04) { // if we are less than 1 unit away from our destination
        var m = _map( d, 0, 0.04, 0, this.maxspeed);   // slow down!
        desired.multiplyScalar(m);
    } else {
        desired.multiplyScalar(this.maxspeed);  // otherwise full speed ahead!
    }

    // Steering = Desired minus Velocity
    var steer = new THREE.Vector3().subVectors(desired, this.velocity);
    steer.copy( _limit(steer, this.maxforce) );
    this.applyForce(steer);
}


Letter.prototype.wander = function() {
    if (this.position.distanceTo(this._target) < 0.01) {
        // var direction = UnitSphere.clampPoint( randPoint() );
        // direction.multiplyScalar(Math.random() * 4 - 2);
        // direction.add( this.position );
        this._target.copy( randPoint(10, 5) );
    }
    this.arrive();
}

/**************************
 *  Update:
 *  Updates critter behavior state.
 *      Should be run every frame
 **************************/
Letter.prototype.update = function() {

    // Update the velocity!
    this.velocity.add(this.acceleration);
    // Limit speed
    var limit = _limit(this.velocity, this.maxforce);
    this.velocity.copy(limit);
    this.position.add(this.velocity);

    // Reset acceleration to 0 each cycle
    this.acceleration.set(0,0,0);  // could as easily be
}

Letter.prototype.borders = function() {
    if (this.position.x < -this._width) this.position.x = this._width;
    if (this.position.y < -this._height) this.position.y = this._height;
    if (this.position.x > this._width) this.position.x = -r;
    if (this.position.y > height+r) this.position.y = -r;
  }

Letter.prototype.border = function() {
    var steer = new THREE.Vector3();
    // Check to ensure we are still within the bounds of our scene
    if (this.position.x > this._width) {
        // console.log("Too close to X", this.position.x);
        desired.set(-this.maxspeed/2, 0, this.velocity.z);   // I THINK this will be fine...
        steer = new THREE.Vector3().subVectors(desired, this.velocity);
    } else if (this.position.x < -this._width) {
        // console.log("Too close to -X", this.position.x);
        desired = new THREE.Vector3(this.maxspeed/2, 0, this.velocity.z);   // I THINK this will be fine...
        steer = new THREE.Vector3().subVectors(desired, this.velocity);
    }

    var steer = _limit(steer, this.maxforce);
    this.applyForce(steer);

    if (this.position.y > this._height) {
        desired = new THREE.Vector3(this.velocity.x, -this.velocity.y, this.velocity.z);   // I THINK this will be fine...
        steer = new THREE.Vector3().subVectors(desired, this.velocity);
    } else if (this.position.y < -this._height) {
        desired = new THREE.Vector3(this.velocity.x, this.velocity.y, this.velocity.z);   // I THINK this will be fine...
        steer = new THREE.Vector3().subVectors(desired, this.velocity);
    }

    steer = _limit(steer, this.maxforce);
    this.applyForce(steer);

    if (this.position.z > this._depth) {
        desired = new THREE.Vector3(this.velocity.x, 0, -this.maxspeed/2);   // I THINK this will be fine...
        steer = new THREE.Vector3().subVectors(desired, this.velocity);
    } else if (this.position.z < -this._depth) {
        // console.log("Too close to -Z", this.position.z);
        desired = new THREE.Vector3(this.velocity.x, 0, this.maxspeed/2);   // I THINK this will be fine...
        steer = new THREE.Vector3().subVectors(desired, this.velocity);
    }

    steer = _limit(steer, this.maxforce);
    this.applyForce(steer);
}

// var Word = function( string )
// {

//     var texture = makeLetterTexture( string );
//     var mat = new THREE.SpriteMaterial({ map: texture })


//     THREE.Sprite.call(this, mat);

//     this.velocity = new THREE.Vector3();
//     this.letters = [];
//     this.duration = Date.now();
//     this.isProto = true; // Is considered a proto-word until otherwise noted...
//     this.isFailing = false;  // Determines if its failing as a word or not.
// }

// Word.prototype = Object.create( THREE.Sprite.prototype );
// Word.prototype.constructor = Word;



// Extra special thanks to:
// http://stackoverflow.com/questions/17134839/how-does-the-map-function-in-processing-work
function _map(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

function _limit(vec3, maxLength) {
    var lengthSquared = vec3.x*vec3.x + vec3.y*vec3.y + vec3.z*vec3.z;

   if( ( lengthSquared > maxLength * maxLength ) && ( lengthSquared > 0 ) ) {
        var ratio = maxLength / Math.sqrt( lengthSquared );
        vec3.x *= ratio;
        vec3.y *= ratio;
        vec3.z *= ratio;
    }
    return vec3;
}

// function _distance(p1, p2) {

//     var x1 = this.p1.x,
//         y1 = this.p1.y,
//         z1 = this.p1.z

//     var x2 = this.p2.x,
//         y2 = this.p2.y,
//         z2 = this.p2.z

//     var distance = Math.sqrt( ((x2 - x1)**2) + ((y2 - y1)**2) + ((z2 - z1)**2) );
//     return distance;
// }


function randPoint(upper, lower) {
    return new THREE.Vector3( Math.random() * upper - lower,
                              Math.random() * upper/2 - lower/2,
                              Math.random() * 2 - 1
                            )
}

