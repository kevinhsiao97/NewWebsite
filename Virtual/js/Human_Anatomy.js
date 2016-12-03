/**
 * Created by iceleaf on 2016/7/28.
 */
var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container, controls;

var params = {
    Muscular: 0.5,
    Skeleton: 0.8
};
var r = 1;
var processValue = 0;
var loadStep = 35;


var HEIGHT, WIDTH;

var ambientLight,directionLight;

var jsonLoader;
var Mtl2 = new THREE.MeshFaceMaterial();
var muscleMesh= new THREE.Mesh();
var skeletionMesh = new THREE.Mesh();
var circlemesh = new THREE.Mesh();
var muscleMesh2 = new THREE.Object3D();
var skeletionMesh2 = new THREE.Object3D();
var circulatory3D = new THREE.Object3D();

window.addEventListener('load', init, false);

function init() {

    $( "#progressbar" ).progressbar({
        value: 10
    });

    createScene();
    createLights();
    createBody();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2, 0); // 設定camera 起始位置
    controls.maxPolarAngle = Math.PI/2.2;
    //controls.enableZoom = false;
    //controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    controls.update();
    window.addEventListener('resize', handleWindowResize, false);

    loop();

}


function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

}

function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 50;
    nearPlane = 0.1;
    farPlane = 100;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.x = -1;
    camera.position.z = 4;
    camera.position.y = 3;
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
    renderer.sortObjects = false;

}

function createLights() {
    ambientLight = new THREE.AmbientLight(0xffffff,3);
    scene.add(ambientLight);

}

function showVal(value) {
    if (value >50) {
        skeletionMesh.material.materials.forEach(function(m){
            m.opacity = 1;
        });
        muscleMesh.material.materials.forEach(function (m) {
            var x = (value-50) / 50;
            m.opacity = x;
        });
    }else {
        muscleMesh.material.materials.forEach(function (m) {
            m.opacity = 0;
        });
        skeletionMesh.material.materials.forEach(function(m){
            if(value <=2 ){value=0}
            var x = value/50;
            m.opacity = x;
            console.log(value);
        });
    }

}

function createBody() {
    jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/Muscular_n.json', addNervToScn);
    function addNervToScn(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial(material);
        muscleMesh= new THREE.Mesh(geometry, mtl);
        muscleMesh.scale.set(2, 2, 2);
        muscleMesh.material.materials.forEach(function(m){
            m.transparent = true;
            m.opacity = 1;
        });
        muscleMesh.rotation.x = Math.PI/2;
        muscleMesh.castShadow = true;
        muscleMesh.receiveShadow = true;
        scene.add(muscleMesh);
        muscleMesh2.add(muscleMesh);
        processValue += loadStep;
        $( "#progressbar" ).progressbar({

            value: processValue
        });

    }




    //create chair
    jsonLoader.load('models/Skeleton_n.json', addGlassToScn);
    function addGlassToScn(geometry, material) {
        Mtl2 = new THREE.MeshFaceMaterial(material);
        skeletionMesh = new THREE.Mesh(geometry, Mtl2);
        skeletionMesh.scale.set(2, 2, 2);
        skeletionMesh.material.materials.forEach(function(m){
            m.transparent = true;
            m.opacity = 1;
        });

        skeletionMesh.rotation.x = Math.PI/2;
        skeletionMesh.castShadow = true;
        skeletionMesh.receiveShadow = true;
        scene.add(skeletionMesh);
        skeletionMesh2.add(skeletionMesh);
        processValue += loadStep;
        $( "#progressbar" ).progressbar({

            value: processValue
        });

    }
    jsonLoader.load('models/Circulatory_n.json', addCirclToScene);
    function addCirclToScene(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial(material);
        circlemesh = new THREE.Mesh(geometry, mtl);
        circlemesh.rotation.x = Math.PI/2;
        circlemesh.scale.set(2,2,2);
        circlemesh.material.materials.forEach(function(m){
           m.transparent = true;
           m.opacity = 1;
        });
        //circlemesh.rotation.x = Math.PI/2;
        circlemesh.castShadow = true;
        circlemesh.receiveShadow = true;
        scene.add(circlemesh);
        circulatory3D.add(circlemesh);

        processValue += loadStep;
        $( "#progressbar" ).progressbar({

            value: processValue
        });
    }

    scene.add(circulatory3D);
    scene.add(skeletionMesh2);

    scene.add(muscleMesh2);

    /*
    var gui = new dat.GUI();

    gui.add( params, 'Muscular', 0, 1 ).onChange( function () {
        muscleMesh.material.materials.forEach(function(m){
            m.opacity = params.Muscular;
        });
    } );

    gui.add( params, 'Skeleton', 0, 1 ).onChange( function () {
        skeletionMesh.material.materials.forEach(function(m){
            m.opacity = params.Skeleton;
            
        });
    } );


    gui.open();
     */


}

function loop() {

    if(processValue>=100){
        $('#cover').delay(500).fadeOut(1000);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
    controls.update();
}

