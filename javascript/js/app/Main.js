////////////////////////////////////////////////////////////////////////////////
// KrbAlmryde
// November, 2015
////////////////////////////////////////////////////////////////////////////////

// Global Variables
var scene, camera, renderer;
var controls, clock, container;

var LetterGroup, LetterMaterials;
var WordGroup;

var alphabet

var key = false;


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

function initScene() {

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    console.log("initCamera()");
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.001, 4);
    {
        controls = new THREE.TrackballControls(camera, renderer.domElement); {
            controls.rotateSpeed = 4.0;
            controls.zoomSpeed = 1.5;
            controls.panSpeed = 1.0;

            controls.noZoom = false;
            controls.noPan = false;

            controls.staticMoving = false;
            controls.dynamicDampingFactor = 0.3;

            controls.keys = [65, 83, 68];
            controls.enabled = true;
        }
        camera.position.z = 4;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        controls.target.set(0, 0, 0);
        controls.update();
    }

    container = document.getElementById("Visualization");
    console.log(container);
    container.appendChild(renderer.domElement);

    mouse = new THREE.Vector2();
    LetterGroup = new THREE.Object3D();

    window.addEventListener('resize', onReshape, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onMouseClick, true);
    window.addEventListener('keypress', onKeyPress, false);
    // window.addEventListener('keydown', onKeyPress, false);

    scene.add(LetterGroup);
}


function initLetterMaterials() {
    LetterMaterials = {};
    alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i in alphabet) {
        var letter = alphabet[i];

        if ( !LetterMaterials.hasOwnProperty( letter ) ) {
            var texture = makeLetterTexture( letter );
            LetterMaterials[letter] = new THREE.SpriteMaterial({ map: texture })
        }

        // sprite.position.set(Math.random(0.001, 4), Math.random(0.001, 4), Math.random(0.001, 4));
        // LetterGroup.add(sprite);
    }
}


////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////

function makeCanvasLetter( letter ) {
    var fontface = "Courier New";
    var fontsize = 18;
    var borderThickness = 4;
    var borderColor = { r:255, g:0, b:0, a:1.0 };
    var backgroundColor = { r:0, g:255, b:0, a:1.0 };
    var textColor = { r:255, g:255, b:255, a:1.0 };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;

    var metrics = context.measureText( letter );
    var textWidth = metrics.width;

    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;

    context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
    context.fillText( letter, borderThickness, fontsize + borderThickness);

    return canvas
}

function makeLetterTexture( letter ) {

    var texture = new THREE.Texture( makeCanvasLetter( letter ) )
    texture.minFilter = texture.maxFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    return texture;
}


function addLetter() {
    var fontsize = 18;
    var l = alphabet[ Math.floor( Math.random() * alphabet.length ) ];
    var sprite = new THREE.Sprite( LetterMaterials[ l ] );
    sprite.name = l;
    sprite.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2);
    LetterGroup.add(sprite);
    return l;
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