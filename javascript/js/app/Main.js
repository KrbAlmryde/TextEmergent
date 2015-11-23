/*
   KrbAlmryde
   November, 2015
*/

// Global Variables
var scene, camera, renderer;
var controls, clock, container;

var LetterGroup, LetterMaterials;
var WordGroup;

var alphabet

var key = true;
var UnitSphere;

var yoda = new Yoda();  // used to generate sample passages

////////////////////////////////////////////////////////////////////////////////
//  Main control functions
////////////////////////////////////////////////////////////////////////////////

function Start() {
    onCreate();
    onFrame();
}

function onCreate() {
    initScene();
    initLetterMaterials();
    // addLotsOfLetters();
    addPassage();
}

function onFrame() {
    requestAnimationFrame( onFrame );
    onRender();
}

function onReshape() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onRender() {
    if (!key)
        UpdateScene();
    // console.log(LetterGroup.getObjectById(4).char, LetterGroup.getObjectById(4).position);
    controls.update();
    renderer.render(scene, camera);
};


function onMouseClick( event ) {

    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    console.log(mouse.x, mouse.y, event.clientX, event.clientY);

    if (key) {
        console.log( addLetter() );
    }

}


function onMouseMove( event ) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


function onKeyPress( event ) {
    console.log(event.keyCode);
    switch(event.keyCode) {
        case 49: // 1
            camera.position.z += 0.1
            console.log(camera.position.z);
            break;
        case 50: // 2
            camera.position.z -= 0.1
            console.log(camera.position.z);
            break;
        case 51: //
            key = !key;
            break;
        default:
            break;
    }
}

////////////////////////////////////////////////////////////////////////////////
//         Initializers
////////////////////////////////////////////////////////////////////////////////




function addLetter() {
    var l = alphabet[ Math.floor( Math.random() * alphabet.length ) ];
    var sprite = new Letter( l );
    // var sprite = new THREE.Sprite( LetterMaterials[ l ] );
    // sprite.name = l;
    sprite.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2);
    LetterGroup.add(sprite);
    return l;
}

function addLotsOfLetters() {
    var count = Math.floor(Math.random() * 200);
    console.log("Making", count, "letters");
    for (var i = 0; i < count; i++) {
        addLetter();
    };
}


function addPassage() {
    passage = yoda.quote();

    for (var i = 0; i < passage.length; i++) {
        var l = passage[i];
        var sprite = new Letter( l );
        // sprite.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
        // LetterGroup.add(sprite);

    };
}

createParticles = function(string) {


    var letterWidth = 2.; // start with this by default
    var lineLength = 80; //

    var lineHeight = letterWidth * 2.4;
    var width = letterWidth * lineLength;

    var particles = [];

    var lineArray = string.split("\n");
    var counter = [0, 0]; // keeps track of where we are

    for (var i = 0; i < lineArray.length; i++) {

        counter[0] = 0;
        counter[1]++;


        var wordArray = lineArray[i].split(" ");

        for (var j = 0; j < wordArray.length; j++) {

            var word = wordArray[j];
            var letters = word.split("");
            var l = letters.length;

            // Makes sure we don't go over line width
            var newL = counter[0] + l;
            if (newL > lineLength) {
                counter[0] = 0;
                counter[1]++;
            }

            // Push a new particle for each place
            for (var k = 0; k < letters.length; k++) {
                particles.push([letters[k], counter[0], counter[1]]);
                counter[0]++;
            }

            counter[0]++;
        }
    }

    particles.numberOfLines = counter[1];

    return particles;

}


function UpdateScene() {
    resetGrid();
    updateGrid();
    // countObjects();
    for (var i = 0; i < LetterGroup.children.length; i++) {
        if (!key)
            LetterGroup.children[i].run();
    };

}



function resetGrid( xdim, ydim, zdim) {
    xdim = xdim || 11;
    ydim = ydim || 11;
    zdim = zdim || 11;

    Grid = new Array( );

    for (var x = 0; x < xdim; x++) {
        Grid.push( new Array() )
        for (var y = 0; y < ydim; y++) {
            Grid[x].push( new Array() )
            for (var z = 0; z < zdim; z++) {
                Grid[x][y].push(new Array( ));
                // Grid[x][y][z].push(Math.floor(Math.random() * 10 - 5));
            };

        };

    };
}


function updateGrid(offset) {
    offset = offset || 5
    resetGrid();

    LetterGroup.children.forEach(function( letter ) {
        var x = Math.round(letter.position.x) + offset,
            y = Math.round(letter.position.y) + offset,
            z = Math.round(letter.position.z) + offset

        if (Grid[x] && Grid[x][y] && Grid[x][y][z])
            Grid[x][y][z].push(letter.id)
        else {
            console.log("Oh FUCK", x, y, z, letter.char, letter.id);
            debugger;
            return false;
        }
    })

    for (var i = 0; i < Grid.length; i++) {
        for (var j = 0; j < Grid[i].length; j++) {
            for (var k = 0; k < Grid[i][j].length; k++) {
                var cell = Grid[i][j][k];
                if (cell.length >= LetterGroup.children.length/3) {
                    console.log("Thats a lot of letters...", cell.length);
                };
                cell.forEach(function( t ) {
                    cell.forEach(function( o ) {
                        if (t !== o) {
                            var tObj = LetterGroup.getObjectById(t),
                                oObj = LetterGroup.getObjectById(o);

                            var dist = tObj.position.distanceTo(oObj.position)

                            if (dist <= 0.01) {
                                console.log("We have a Hit!!!",tObj.char, oObj.char);

                            };
                        }
                    })
                })
            };
        };
    };
}

function countObjects() {
    var total = 0
    for (var i = 0; i < Grid.length; i++) {
        for (var j = 0; j < Grid[i].length; j++) {
            for (var k = 0; k < Grid[i][j].length; k++) {
                total += Grid[i][j][k].length
            };
        };
    };

    if (total === LetterGroup.children.length) {
        console.log("Rejoice in the matching", total);
    } else{
        console.log(total, "Mother FUCKER!", LetterGroup.children.length);
    };

}



// handy function converting degrees to radians
function dtr(degrees) {
    return THREE.Math.degToRad(degrees);
}



function initTextEntry() {
    var input = document.getElementById( 'text' );
    input.focus();
    input.value = 'type\nhere';

    var container = document.createElement( 'div' );
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'table';
    container.style.textAlign = 'center';
    document.body.appendChild( container );

    var pad = document.createElement( 'div' );
    pad.style.display = 'table-cell';
    pad.style.verticalAlign = 'middle';
    container.appendChild( pad );

    var currentString = '';

    var type = function ( string ) {

        if ( string === currentString ) return;

        currentString = string;

        while ( pad.childNodes.length > 0 ) {

            pad.removeChild( pad.firstChild );

        }

        var chars = string.split( '' );

        for ( var i = 0; i < chars.length; i ++ ) {

            var char = chars[ i ];

            if ( char === '\n' ) {

                var br = document.createElement( 'br' );
                pad.appendChild( br );

                continue;

            }

            var src = makeCanvasLetter( char );
            var src = srcs[ char.toLowerCase() ];

            if ( src !== undefined ) {

                // var img = document.createElement( 'img' );
                // img.className = 'char';
                // img.src = src;
                // pad.appendChild( img );
                pad.appendChild( src );
            }


        }

        var cursor = document.createElement( 'div' );
        cursor.id = 'cursor';
        pad.appendChild( cursor );

    };

    type( input.value );

    document.addEventListener( 'keydown', function ( event ) {

        type( input.value );

    } );

    document.addEventListener( 'keyup', function ( event ) {

        type( input.value );

    } );

    document.addEventListener( 'mouseup', function ( event ) {

        input.focus();

    } );
}