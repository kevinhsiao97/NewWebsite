/**
 * Created by iceleaf on 2016/8/25.
 */

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container, controls;

var HEIGHT, WIDTH;
var ambientLight;

window.addEventListener('load', init, false);

function init(){

    createScene();
    createLights();

    createRoom();

    window.addEventListener('resize', handleWindowResize, false);


    loop();

}

function createScene() {

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 50;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    //scene.fog = new THREE.Fog(0x000000, 0,800);  // Fog 在此失效
    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 0;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);


}

function createLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

}

function createRoom(){
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/shield.json', addChr1toScn);
    function addChr1toScn(geometry, material) {
        var Mtl = new THREE.MeshFaceMaterial(material);
        var car = new THREE.Mesh(geometry, Mtl);
        car.rotation.x = Math.PI/2;
        car.castShadow = true;
        car.receiveShadow = true;
        scene.add(car);
        console.log(geometry);
        $( "#progressbar" ).progressbar({
            value: 80
        });
        $('#cover').delay(1000).fadeOut(1000);

    }

}


function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

}

function loop() {
    renderer.render(scene, camera);
    requestAnimationFrame(loop);

}