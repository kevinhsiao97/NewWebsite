
// THREEJS RELATED VARIABLES

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container, controls;

var floorMesh = new THREE.Mesh();
var jsonLoader = new THREE.JSONLoader();
var car = new THREE.Mesh();
var lightShell = new THREE.Mesh();


//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH;


var angle = 0;

var mouseX = 0, mouseY = 0;

var act = 0;
var camPosX=150 , camPosY=100, camPosZ=150;

var timer = 1100000;
var processValue = 0;

var meshcount = 0;









//INIT THREE JS, SCREEN AND MOUSE EVENTS

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
  scene.fog = new THREE.Fog(0x000000, 0,800);  // Fog 在此失效
  camera.position.x = 100;
  camera.position.z = -150;
  camera.position.y = 80;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);



}

// HANDLE SCREEN EVENTS

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();

}


// LIGHTS

var ambientLight, directionLight, spotLight20;

function createLights() {

  ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  var pointColor = new THREE.Color("rgb(240, 240, 255)");
  scene.add(ambientLight);




  var spotLight2 = new THREE.SpotLight(pointColor, 0.8);
  spotLight2.position.set(0, 200, -50);

  spotLight2.penumbra = 1;
  spotLight2.angle = 1.2;

  var tarB2 = new  THREE.Object3D();
  tarB2.position.set(0, 0, -50);
  spotLight2.target = tarB2;
  scene.add(spotLight2.target);
  scene.add(spotLight2);


}






function createRoom() {



  // Skybox
  var r = "textures/";
  var urls = [
    r + "xz.jpg", r + "xz.jpg",
    r + "py.jpg", r + "ny.jpg",
    r + "xz.jpg", r + "xz.jpg"
  ];

  var textureCube = new THREE.CubeTextureLoader().load( urls );
  textureCube.format = THREE.RGBFormat;



  // common materials

  var mlib = {
    "WhiteB":	new THREE.MeshLambertMaterial( { color: 0xdddddd, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.9 } ),
    "RedB": 		new THREE.MeshLambertMaterial( { color: 0xaa0000, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 } ),


    "YellowB":	new THREE.MeshLambertMaterial( { color: 0xecd604, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.10 } ),

    "GreenL": 	new THREE.MeshLambertMaterial( { color: 0x012d11, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25} ),
    "Orange": 	new THREE.MeshLambertMaterial( { color: 0xdd4400, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25} ),
    "Blue": 	new THREE.MeshLambertMaterial( { color: 0x001133, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.3 } ),
    "Red": 		new THREE.MeshLambertMaterial( { color: 0xaa0000, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 } ),
    "Black": 	new THREE.MeshLambertMaterial( { color: 0x222222, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.15 } ),
    "White":	new THREE.MeshLambertMaterial( { color: 0xdddddd, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.10 } ),
    "Yellow":	new THREE.MeshLambertMaterial( { color: 0xecd604, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.10 } ),

    "Blue2":	new THREE.MeshPhongMaterial( { color: 0x02437e, specular:0x0090d6, shininess:10, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 } ),
    "Carmine": 	new THREE.MeshPhongMaterial( { color: 0x770000, specular:0xffaaaa, envMap: textureCube, combine: THREE.MultiplyOperation } ),
    "Gold": 	new THREE.MeshPhongMaterial( { color: 0xaa9944, specular:0xbbaa99, shininess:50, envMap: textureCube, combine: THREE.MultiplyOperation } ),
    "Gold2": 	new THREE.MeshPhongMaterial( { color: 0x091A2D, specular:0x88b9ba, shininess:50, envMap: textureCube, combine: THREE.MultiplyOperation } ),
    "Bronze":	new THREE.MeshPhongMaterial( { color: 0x150505, specular:0xee6600, shininess:10, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 } ),

    "Green":	new THREE.MeshPhongMaterial( { color: 0x012d11, specular:0x00e354, shininess:10, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 } ),
    "Orange2":	new THREE.MeshPhongMaterial( { color: 0xbd4300, specular:0xee5400, shininess:10, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 } ),


  };


  


  //create floor
  var ground = new THREE.PlaneBufferGeometry(2000, 2000);
  var texture = THREE.ImageUtils.loadTexture( 'textures/dark-ceramic-tiles.jpg' );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 15, 15 );
  var floormtl = new THREE.MeshPhongMaterial({
    color: 0xcccccc,
    specular:0xffffff,
    shininess: 1,
    map: texture,
    bumpMap: texture,
    bumpScale: 0.1,
    reflectivity: 0.01
  });
  floorMesh = new THREE.Mesh(ground, floormtl);
  floorMesh.rotation.x = -0.5*Math.PI;
  floorMesh.castShadow = true;
  //floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  var ground2 = new THREE.PlaneBufferGeometry(165, 82);
  var floormtl2 = new THREE.MeshPhongMaterial({
    color: 0xcccccc
  });
  var floorMesh2 = new THREE.Mesh(ground2, floormtl2);
  floorMesh2.rotation.x = 0.5*Math.PI;
  floorMesh2.position.y = 1;
  floorMesh2.castShadow = true;
  floorMesh2.receiveShadow = true;
  scene.add(floorMesh2);


  //create chair
  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/shield_n.json', addChr1toScn);
  function addChr1toScn(geometry) {
    var Mtl = mlib["White"];
    car = new THREE.Mesh(geometry, Mtl);
    car.rotation.x = Math.PI/2;
    //car.castShadow = true;
    //car.receiveShadow = true;
    scene.add(car);
    meshcount += car.geometry.vertices.length;
    console.log(car.geometry.vertices.length);
        processValue += 10;
    $( "#progressbar" ).progressbar({

      value: processValue
    });

  }


  //create chair
  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/blackPart_n.json', addbPartToScn);
  function addbPartToScn(geometry) {
    var Mtl = mlib["Black"];
    var jsonMesh = new THREE.Mesh(geometry, Mtl);
    jsonMesh.rotation.x = Math.PI/2;
    jsonMesh.castShadow = true;
    jsonMesh.receiveShadow = true;
    scene.add(jsonMesh);
    meshcount += jsonMesh.geometry.vertices.length;
    processValue += 10;
    $( "#progressbar" ).progressbar({

      value: processValue
    });
  }

  //create chair
  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/Glass2_n.json', addGlassToScn);
  function addGlassToScn(geometry) {
    var Mtl = mlib[ "Gold2" ];
    var jsonMesh = new THREE.Mesh(geometry, Mtl);
    jsonMesh.rotation.x = Math.PI/2;
    jsonMesh.castShadow = true;
    jsonMesh.receiveShadow = true;
    scene.add(jsonMesh);
    meshcount += jsonMesh.geometry.vertices.length;
    processValue += 10;
    $( "#progressbar" ).progressbar({

      value: processValue
    });
  }
  //create chair
  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/wheel_n.json', addWheelToScn);
  function addWheelToScn(geometry,material) {
    var Mtl = new THREE.MeshFaceMaterial(material);
    var jsonMesh = new THREE.Mesh(geometry, Mtl);
    jsonMesh.rotation.x = Math.PI/2;
    jsonMesh.castShadow = true;
    jsonMesh.receiveShadow = true;
    scene.add(jsonMesh);
    meshcount += jsonMesh.geometry.vertices.length;
    processValue += 10;
    $( "#progressbar" ).progressbar({

      value: processValue
    });
  }

  //create chair
  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/frame_n.json', addFrameToScn);
  function addFrameToScn(geometry) {
    var Mtl = mlib[ "WhiteB" ];
    var jsonMesh = new THREE.Mesh(geometry, Mtl);
    jsonMesh.rotation.x = Math.PI/2;
    jsonMesh.castShadow = true;
    jsonMesh.receiveShadow = true;
    scene.add(jsonMesh);
    meshcount += jsonMesh.geometry.vertices.length;
    processValue += 10;
    $( "#progressbar" ).progressbar({

      value: processValue
    });
  }

  //create chair
  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/packPart_n.json', addpackPartToScn);
  function addpackPartToScn(geometry,material) {
    var Mtl = new THREE.MeshFaceMaterial(material);
    var jsonMesh = new THREE.Mesh(geometry, Mtl);
    jsonMesh.rotation.x = Math.PI/2;
    jsonMesh.castShadow = true;
    jsonMesh.receiveShadow = true;
    scene.add(jsonMesh);
    meshcount += jsonMesh.geometry.vertices.length;
    processValue += 10;
    $( "#progressbar" ).progressbar({

      value: processValue
    });
  }

  //create chair
  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/bpGlass_n.json', addbpGlassToScn);
  function addbpGlassToScn(geometry) {
    var Mtl = new THREE.MeshLambertMaterial({
      color: 0x02061e,
      specular:0x591626,
      shininess: 30,
      emissive: 0x111111
    });
    var jsonMesh = new THREE.Mesh(geometry, Mtl);
    jsonMesh.rotation.x = Math.PI/2;
    jsonMesh.castShadow = true;
    jsonMesh.receiveShadow = true;
    scene.add(jsonMesh);
    meshcount += jsonMesh.geometry.vertices.length;
    processValue += 10;
    $( "#progressbar" ).progressbar({

      value: processValue
    });
  }
  //create chair
  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/bpLight_n.json', addbpLightToScn);
  function addbpLightToScn(geometry) {
    var Mtl = new THREE.MeshLambertMaterial({
      color: 0xf74181,
      specular: 0xe87691,
      emissive: 0xf00707,
      shininess: 200,
      reflectivity: 1

    });
    var jsonMesh = new THREE.Mesh(geometry, Mtl);
    jsonMesh.rotation.x = Math.PI/2;
    jsonMesh.castShadow = true;
    jsonMesh.receiveShadow = true;
    scene.add(jsonMesh);
    meshcount += jsonMesh.geometry.vertices.length;
    processValue += 10;
    $( "#progressbar" ).progressbar({

      value: processValue
    });
  }
  //create chair
  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/light_n.json', addlightToScn);
  function addlightToScn(geometry) {
    var Mtl = mlib["WhiteB"];
    var jsonMesh = new THREE.Mesh(geometry, Mtl);
    jsonMesh.rotation.x = Math.PI/2;
    jsonMesh.castShadow = true;
    jsonMesh.receiveShadow = true;
    scene.add(jsonMesh);
    meshcount += jsonMesh.geometry.vertices.length;
    processValue += 10;
    $( "#progressbar" ).progressbar({

      value: processValue
    });
  }

  //create chair
  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/lightShell_n.json', addlightShellToScn);
  function addlightShellToScn(geometry) {
    var Mtl = new THREE.MeshLambertMaterial({
      color: 0x34004a,
      specular:0x7a254d,
      shininess: 200,
      emissive: 0x111111,

      opacity:0.3,
      transparent: true
    });
    lightShell = new THREE.Mesh(geometry, Mtl);
    lightShell.rotation.x = Math.PI/2;
    lightShell.castShadow = true;
    lightShell.receiveShadow = true;
    scene.add(lightShell);
    meshcount += lightShell.geometry.vertices.length;
    processValue += 10;
    $( "#progressbar" ).progressbar({
      value: processValue
    });
  }
/*
  var geometry = new THREE.SphereBufferGeometry( 10, 32, 32 );
  var BALLmaterial = mlib["WhiteB"];
  var sphere = new THREE.Mesh( geometry, BALLmaterial );
  sphere.position.y = 70;
  scene.add( sphere );
*/

  var whiteCar = function() {
    car.material= mlib["White"]; // there is also setHSV and setRGB
    //sphere.material = mlib["WhiteB"];
  };

  var redCar = function() {
    car.material= mlib["Red"]; // there is also setHSV and setRGB
    //sphere.material = mlib["RedB"];
  };

  var greenCar = function() {
    car.material= mlib["Green"]; // there is also setHSV and setRGB
    //sphere.material = mlib["GreenB"];
  };

  var blueCar = function() {
    car.material= mlib["Blue2"]; // there is also setHSV and setRGB
    //sphere.material = mlib["BlueB"];
  };

  var yellowCar = function() {
    car.material= mlib["Yellow"]; // there is also setHSV and setRGB
    //sphere.material = mlib["BronzeB"];
  };

  var orangeCar = function() {
    car.material= mlib["Orange"]; // there is also setHSV and setRGB
    //sphere.material = mlib["OrangeB"];
  };

  var brownCar = function() {
    car.material= mlib["Bronze"];
    // there is also setHSV and setRGB
    //sphere.material = mlib["YellowB"];
  };

  document.getElementById("white").addEventListener('click', whiteCar, false);
  document.getElementById("red").addEventListener('click', redCar, false);
  document.getElementById("green").addEventListener('click', greenCar, false);
  document.getElementById("blue").addEventListener('click', blueCar, false);
  document.getElementById("yellow").addEventListener('click', yellowCar, false);
  document.getElementById("orange").addEventListener('click', orangeCar, false);
  document.getElementById("brown").addEventListener('click', brownCar, false);


}




function loop(){
  if(processValue==100){
    $('#cover').delay(500).fadeOut(1000);
    //console.log(meshcount);
  }




if (act == 0){
  var timer2 = Date.now();
  var dt = -0.00004*(timer2-timer);
  dt *= Math.PI;
  var l = Math.sqrt(Math.pow(camPosX,2) + Math.pow(camPosZ,2));
  var phase = Math.atan(camPosZ/camPosX);
  if(camPosX < 0 && camPosZ > 0 ){
    phase += Math.PI;
  }else if(camPosX < 0 && camPosZ < 0){
    phase += Math.PI;
  }

  camera.position.x = l * Math.cos( dt + phase);
  //camera.position.y = camPosY;
  camera.position.z = l * Math.sin( dt + phase);


  camera.lookAt( scene.position );

}

  renderer.render(scene, camera);
  requestAnimationFrame(loop);


}




function init(){


  $( "#progressbar" ).progressbar({
    value: 0
  });


  createScene();
  createLights();


  createRoom();

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(0, 0, 0); // 設定camera 起始位置
  controls.maxPolarAngle = Math.PI/2.2;
  controls.enableZoom = false;
  controls.enablePan = false;

  window.addEventListener('resize', handleWindowResize, false);

  document.getElementById("world").addEventListener("mousedown", stopAutoOrbit, false);
  document.getElementById("world").addEventListener("touchstart", stopAutoOrbit, false);
  document.getElementById("world").addEventListener("mouseup", autoOrbit, false);
  document.getElementById("world").addEventListener("touchend", autoOrbit, false);



  loop();





}
function stopAutoOrbit() {
  act = 1;
}

function autoOrbit() {
  act = 0;

  camPosX = controls.object.position.x;
  camPosY = controls.object.position.y;
  camPosZ = controls.object.position.z;
  timer = Date.now();

}





// HANDLE MOUSE EVENTS



window.addEventListener('load', init, false);
