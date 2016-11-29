var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0
};
var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
    renderer, container ;
var jsonModel = new THREE.Mesh();
var clock = new THREE.Clock();

var controls;


window.addEventListener('load', init, false);

function init() {
    // set up the scene, the camera and the renderer
    createScene();

    // add the lights
    createLights();

    addBee();
    createPlane();
    // createModel();
    //animate();

    //document.addEventListener('mousemove', handleMouseMove, false);
    createOrbit();

    // start a loop that will update the objects' positions
    // and render the scene on each frame
    loop();

}

function createPlane(){
    var geom = new THREE.PlaneGeometry(1000, 500);
    var mtl = new THREE.MeshLambertMaterial({color: 0xe9eba3 });
    var mesh = new THREE.Mesh(geom, mtl);
    mesh.rotation.x = -Math.PI/2;
    mesh.position.y = -8;
    mesh.receiveShadow = true;
    // scene.add(mesh);
}

function addBee(){
    // var mtlLoader = new THREE.MTLLoader();
    // mtlLoader.load( "models/bee.mtl", function( materials ) {
    //     materials.preload();
    //     var objLoader = new THREE.OBJLoader();
    //     objLoader.setMaterials( materials );
    //     objLoader.load("models/bee.obj", function ( object ) {
    //         object.traverse( function ( child ) {
    //             if ( child instanceof THREE.Mesh ) {
    //                 child.castShadow = true;
    //                 child.receiveShadow = true;
    //                 // child.geometry.computeFaceNormals();
    //                 // child.geometry.computeVertexNormals();
    //                 child.scale.set(1, 1, 1);
    //             }
    //         });
    //
    //         scene.add(object);
    //     });
    // });
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/bee.json', function(geometry, material){
        var mtl = new THREE.MeshFaceMaterial(material);
        var mesh = new THREE.Mesh(geometry, mtl);
        scene.add(mesh);
    });

}

function createOrbit() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.object.position.set(0, 0, 20);
    controls.target.set(0, 0, 0);
    controls.update();
}





function createScene() {
    // Get the width and the height of the screen,
    // use them to set up the aspect ratio of the camera
    // and the size of the renderer.
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Create the scene
    scene = new THREE.Scene();

    // Add a fog effect to the scene; same color as the
    // background color used in the style sheet
    scene.fog = new THREE.Fog(0xe9eba3, 100, 300);

    // Create the camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );


    // Set the position of the camera

    // Create the renderer
    renderer = new THREE.WebGLRenderer({
        // Allow transparency to show the gradient background
        // we defined in the CSS
        alpha: true,

        // Activate the anti-aliasing; this is less performant,
        // but, as our project is low-poly based, it should be fine :)
        antialias: true
    });

    // Define the size of the renderer; in this case,
    // it will fill the entire screen
    renderer.setSize(WIDTH, HEIGHT);

    // Enable shadow rendering
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.renderReverseSided = true;


    // Add the DOM element of the renderer to the
    // container we created in the HTML
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    // Listen to the screen: if the user resizes it
    // we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);
}


function handleWindowResize() {
    // update height and width of the renderer and the camera
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}


var light,backLight, shadowLight;

function createLights() {
    light = new THREE.AmbientLight(0xffffff, 0.6);
    var light2 = new THREE.HemisphereLight(0x000000, 0xffffff, 0.2);

    shadowLight = new THREE.DirectionalLight(0xffffff, .4);
    shadowLight.position.set(200, 200, 200);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -10;
    shadowLight.shadow.camera.right = 10;
    shadowLight.shadow.camera.top = 10;
    shadowLight.shadow.camera.bottom = -10;

    backLight = new THREE.DirectionalLight(0xffffff, .5);
    backLight.position.set(-200, 200, 200);


    scene.add(backLight);
    scene.add(light);
    scene.add(light2);
    scene.add(shadowLight);
}



var angle = 0;





function loop(){
    var dt = clock.getDelta();
    var z = 4*Math.sin(angle);



    // Rotate the propeller, the sea and the sky
    //airplane.propeller.rotation.x += 0.3;

    //jsonModel.rotation.z += 0.05;

    angle -= dt;

    scene.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.rotation.y -= 0.002;
            child.position.y = z;
        }
    });




    //sky.mesh.rotation.z += .01;


    // render the scene
    renderer.render(scene, camera);

    controls.update();

    requestAnimationFrame(loop);

    // call the loop function again
    
}