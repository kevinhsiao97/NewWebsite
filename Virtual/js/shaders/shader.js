var container = document.getElementById('container');
var containerInnerWidth = container.offsetWidth;
var containerInnerHeight = container.offsetHeight;

var camera, scene, renderer, group, control;

//used by mouse tracking
var windowHalfX = containerInnerWidth / 2;
var windowHalfY = containerInnerHeight / 2;

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;
var NEAR = 10, FAR = 999.05;

var mesh = new THREE.Mesh();
var x =0;

init();
update();

function init() {

//-----------------------------------------------------------------------------// 
//loading animation
//-----------------------------------------------------------------------------// 

    //to display loading animation before it's ready


//-----------------------------------------------------------------------------//  
//setup camara
//-----------------------------------------------------------------------------//  

    camera = new THREE.PerspectiveCamera(75, containerInnerWidth / containerInnerHeight, 0.1, 10000);
    camera.position.z = 4.5;
    camera.position.y = 0;
    camera.lookAt(new THREE.Vector3(0, 0, 0));



//-----------------------------------------------------------------------------//
//init scene
//-----------------------------------------------------------------------------//

    scene = new THREE.Scene();
    group = new THREE.Object3D();



   // initMouse();



//-----------------------------------------------------------------------------//
//load geometry 
//-----------------------------------------------------------------------------//

//simple generated primitive with custom shader
//-----------------------------------------------//
//    var material = new CustomMat("textures/texture.jpg", THREE.SimpleShader);
    var material = new CustomMat("textures/P2dwu.png", THREE.DisplacementShader);
    var geometry = new THREE.SphereGeometry(1, 200, 200);
    mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);





//-----------------------------------------------------------------------------//
//setup scene
//-----------------------------------------------------------------------------//

    //scene graph (group.add(mesh); is in the loaders)
    scene.add(group);
    
    // fog
    scene.fog = new THREE.FogExp2(0xdfdfdf, 0.04);
    
//-----------------------------------------------------------------------------//
//setup renderer
//-----------------------------------------------------------------------------//

//  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer = new THREE.WebGLRenderer({alpha:true, antialias: true});
    renderer.setSize(containerInnerWidth, containerInnerHeight);

    renderer.setClearColor(0x222222, 1);
//  renderer.autoClear = false;

    renderer.shadowMapEnabled = true;
    //renderer.shadowMapType = THREE.PCFShadowMap;
    //soft shadowmap version
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

//-----------------------------------------------------------------------------//
//setup lights
//-----------------------------------------------------------------------------//

    var light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2, 0.1);
    light.position.set(0.5, 3, 3);
    light.target.position.set(0, 0, 0);

    // cast shadow
    light.castShadow = true;
    light.shadowCameraNear = 1;
    light.shadowCameraFar = 10;
    light.shadowCameraFov = 50;

    //show light camera frustrum
    //light.shadowCameraVisible = true;

    light.shadowBias = 0.0001;
    light.shadowDarkness = 0.5;

    light.shadowMapWidth = SHADOW_MAP_WIDTH;
    light.shadowMapHeight = SHADOW_MAP_HEIGHT;

    scene.add(light);

    //secondary light
    light = new THREE.DirectionalLight(0x002288, 1);
    light.position.set(-1, -1, -1);
    scene.add(light);

    //ambient light
    light = new THREE.AmbientLight(0x222222);
    scene.add(light);

    window.addEventListener('resize', onWindowResize, false);
    document.getElementById('pic1').addEventListener('click', selectImg1, false);
    document.getElementById('pic2').addEventListener('click', selectImg2, false);
    document.getElementById('pic3').addEventListener('click', selectImg3, false);
    document.getElementById('pic4').addEventListener('click', selectImg4, false);

}

function selectImg1() {
    mesh.material.uniforms['texture1'].value = THREE.ImageUtils.loadTexture('textures/P2dwu.png')
}
function selectImg2() {
    mesh.material.uniforms['texture1'].value = THREE.ImageUtils.loadTexture('textures/cloth2.jpg')
}
function selectImg3() {
    mesh.material.uniforms['texture1'].value = THREE.ImageUtils.loadTexture('textures/stone.jpg')
}
function selectImg4() {
    mesh.material.uniforms['texture1'].value = THREE.ImageUtils.loadTexture('textures/Spec Mask.png')
}


function onWindowResize() {

    // make sure to updtate the container proportions on window resize
    containerInnerWidth = container.offsetWidth;
    containerInnerHeight = container.offsetHeight;

    windowHalfX = containerInnerWidth / 2;
    windowHalfY = containerInnerHeight / 2;

    camera.aspect = containerInnerWidth / containerInnerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(containerInnerWidth, containerInnerHeight);

}

function update() {
    x += 0.01;
    requestAnimationFrame(update);
    mesh.material.uniforms['scale'].value = Math.sin(x)*0.7-0.2;
    mesh.rotation.y += 0.01;

    //update mouse tracking
    //updateMouse();

    renderer.render(scene, camera);


}