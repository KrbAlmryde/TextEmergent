// Scene Utilities
// For loading and managing our scene quickly and efficiently

function initScene() {

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    console.log("initCamera()");
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10);
    // camera = new THREE.OrthographicCamera(window.innerWidth / -500, window.innerWidth / 500, window.innerHeight / 500, window.innerHeight / - 500, -100, 100)
    {
        camera.position.set(-0, -0, -5);
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
    alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,?-:; ";

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
