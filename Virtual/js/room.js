//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0
};

// THREEJS RELATED VARIABLES

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container, controls;

var jsonLoader = new THREE.JSONLoader();
//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH;

var celMesh;

var Sculpture = new THREE.Mesh();

var clock = new THREE.Clock();

var angle = 0;

var directNum = 0;

var directX, directZ , directXt, directZt;




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
  //scene.fog = new THREE.Fog(0xf7d9aa, 100,950);
  camera.position.set(0, 80, 50);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
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

var ambientLight, directionLight, spotLight, spotLight2,
    spotLight3, spotLight4, spotLight5,
    spotLight6, spotLight7, spotLight8,
    // painting spotlight
    spotLight9, spotLight10;

function createLights() {

  ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  var pointColor = new THREE.Color("rgb(200, 200, 200)");
  scene.add(ambientLight);



  directionLight = new THREE.DirectionalLight(pointColor, 0.4);
  directionLight.position.set(400, 250, 50);
  directionLight.castShadow = true;
  directionLight.shadow.camera.left = -400;
  directionLight.shadow.camera.right = 400;
  directionLight.shadow.camera.top = 400;
  directionLight.shadow.camera.bottom = -400;
  directionLight.shadow.camera.near = 0.01;
  directionLight.shadow.camera.far = 1000;



  directionLight.shadow.mapSize.width = 3000;//數值調高可提升解析度
  directionLight.shadow.mapSize.height = 3000;//數值調高可提升解析度

  scene.add(directionLight);


  var pointColor2 = new THREE.Color("#f3e5ab");



  spotLight5 = new THREE.SpotLight(pointColor2, 0.4);
  spotLight5.position.set(50, 190, -110);
  spotLight5.penumbra = 1;
  spotLight5.angle = 1.5;

  var tarB5 = new  THREE.Object3D();
  tarB5.position.set(50, 190, -150);
  spotLight5.target = tarB5;
  scene.add(spotLight5.target);
  scene.add(spotLight5);

  spotLight6 = new THREE.SpotLight(pointColor2, 0.4);
  spotLight6.position.set(-50, 190, -110);

  spotLight6.penumbra = 1;
  spotLight6.angle = 1.5;
  var tarB6 = new  THREE.Object3D();
  tarB6.position.set(-50, 190, -150);
  spotLight6.target = tarB6;
  scene.add(spotLight6.target);
  scene.add(spotLight6);



  spotLight9 = new THREE.SpotLight(pointColor2, 0.4);
  spotLight9.position.set(-59, 110, -57);
  //spotLight9.shadowMapWidth = 500;
  //spotLight9.shadowMapHeight = 500;


  spotLight9.penumbra = 1;
  spotLight9.angle = 0.9; // 數值太高，陰影會有波紋
  var tarB9 = new  THREE.Object3D();
  tarB9.position.set(-98, 90, -57);
  spotLight9.target = tarB9 ;
  spotLight9.castShadow = true;
  scene.add(spotLight9.target);
  //scene.add(spotLight9);




  spotLight10 = new THREE.SpotLight(pointColor2, 0.2);
  spotLight10.position.set(-30, 125, 100);
  //spotLight10.shadowMapWidth = 500;
  //spotLight10.shadowMapHeight = 500;


  spotLight10.penumbra = 1;
  spotLight10.angle = 0.9; // 數值太高，陰影會有波紋
  var tarB10 = new  THREE.Object3D();
  tarB10.position.set(-60, 57, 100);
  spotLight10.target = tarB10 ;
  spotLight10.castShadow = true;
  scene.add(spotLight10.target);
  //scene.add(spotLight10);






}




var texture = THREE.ImageUtils.loadTexture( 'img/space.jpg' );
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 4, 4 );

floorMtl = new THREE.MeshPhongMaterial( {
  color: 0xffffff,
  specular:0xffffff,
  shininess: 1,
  map: texture,
  bumpMap: texture,
  bumpScale: 1,
  //envMap: textureCube,
  //combine: THREE.MixOperation,
  reflectivity: 0.001
} );

function createRoom() {
  var texture;
  //create ceiling
  var celgeo = new THREE.BoxBufferGeometry(200, 5, 280);

  var celmtl = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular:0xffffff,
    shininess: 2,
    reflectivity: 0.1
  });
  celMesh = new THREE.Mesh(celgeo, celmtl);
  celMesh.position.set(0, 160, 0);
  celMesh.castShadow = true;
  celMesh.receiveShadow = true;
  scene.add(celMesh);

  //create front wall
  var fWallgeo = new THREE.BoxBufferGeometry(200, 200, 2);
  texture = THREE.ImageUtils.loadTexture( 'img/white-brick-wall.jpg' );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 4, 4 );
  var fWallmtl = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular:0xffffff,
    shininess: 2,
    //map: texture,
    bumpMap: texture,
    bumpScale: 1.5,
    reflectivity: 0.1
  });
  var fWallMesh = new THREE.Mesh(fWallgeo, fWallmtl);
  fWallMesh.position.set(0, 100, -150);
  fWallMesh.castShadow = true;
  fWallMesh.receiveShadow = true;
  scene.add(fWallMesh);

  //create back wall
  var bWallgeo = new THREE.BoxBufferGeometry(200, 200, 2);
  texture = THREE.ImageUtils.loadTexture( 'img/white-brick-wall.jpg' );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 4, 4 );
  var bWallmtl = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular:0xffffff,
    shininess: 2,
    //map: texture,
    bumpMap: texture,
    bumpScale: 1.5,
    reflectivity: 0.1
  });
  var bWallMesh = new THREE.Mesh(bWallgeo, bWallmtl);
  bWallMesh.position.set(0, 100, 150);
  bWallMesh.castShadow = true;
  bWallMesh.receiveShadow = true;
  scene.add(bWallMesh);



  //create side wall
  var sWallgeo = new THREE.BoxBufferGeometry(2, 200, 300);
  texture = THREE.ImageUtils.loadTexture( 'img/Architectural concrete4.jpg' );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 3, 2 );
  var sWallmtl = new THREE.MeshPhongMaterial({
    //color: 0xffffff,
    //specular:0xffffff,
    shininess: 2,
    map: texture,
    bumpMap: texture,
    bumpScale: 1,
    reflectivity: 0.1
  });
  var sWallMesh = new THREE.Mesh(sWallgeo, sWallmtl);
  sWallMesh.position.set(-100, 100, 0);
  sWallMesh.castShadow = true;
  sWallMesh.receiveShadow = true;
  scene.add(sWallMesh);

  //create floor
  var floorgeo = new THREE.BoxBufferGeometry(200, 2, 300);
  texture = THREE.ImageUtils.loadTexture( 'img/retina_wood.png' );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 4, 4 );
  var floormtl = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular:0xffffff,
    shininess: 2,
    map: texture,
    bumpMap: texture,
    bumpScale: 1,
    reflectivity: 0.1
  });
  var floorMesh = new THREE.Mesh(floorgeo, floormtl);
  floorMesh.position.set(0, 0, 0);
  floorMesh.castShadow = true;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  //create second floor
  var floorgeo2 = new THREE.BoxBufferGeometry(200, 2, 300);
  var floormtl2 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular:0xffffff,
    shininess: 1,
    reflectivity: 0.1
  });
  var floorMesh2 = new THREE.Mesh(floorgeo2, floormtl2);
  floorMesh2.position.set(0, 200, 0);
  floorMesh2.castShadow = true;
  floorMesh2.receiveShadow = true;
  scene.add(floorMesh2);

  //create windowWall1
  var windowWall = new THREE.BoxBufferGeometry(5, 200, 87);
  texture = THREE.ImageUtils.loadTexture( 'img/white-brick-wall.jpg' );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 2, 4 );
  var windowmtl = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular:0xffffff,
    shininess: 2,
    //map: texture,
    bumpMap: texture,
    bumpScale: 1.5,
    reflectivity: 0.1
  });
  var wdowMesh = new THREE.Mesh(windowWall, windowmtl);
  wdowMesh.position.set(100, 100, 0);
  wdowMesh.castShadow = true;
  wdowMesh.receiveShadow = true;
  scene.add(wdowMesh);


  //create windowWall2
  var windowWall2 = new THREE.BoxBufferGeometry(5, 40, 300);
  var windowmtl2 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular:0xffffff,
    shininess: 2,
    reflectivity: 0.1
  });
  var wdowMesh2 = new THREE.Mesh(windowWall2, windowmtl2);
  wdowMesh2.position.set(100, 180, 0);
  wdowMesh2.castShadow = true;
  wdowMesh2.receiveShadow = true;
  scene.add(wdowMesh2);



  //create chair
  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/chair1.json', addChr1toScn);
  function addChr1toScn(geometry) {
    texture = THREE.ImageUtils.loadTexture( 'img/fabric-diffuse-metropolitan-chair.jpg' );
    //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    //texture.repeat.set( 4, 4 );
    var chairMtl = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular:0xffffff,
      shininess: 2,
      map: texture,
      //bumpMap: texture,
      //bumpScale: 1,
      //reflectivity: 0.1
    });
    var ChairMesh = new THREE.Mesh(geometry, chairMtl);
    //ChairMesh.position.set(-50, 0, 0);
    ChairMesh.rotation.x = Math.PI/2;
    ChairMesh.castShadow = true;
    ChairMesh.receiveShadow = true;
    scene.add(ChairMesh);

  }

  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/chair2.json', addChr2toScn);
  function addChr2toScn(geometry) {
    var chairMtl = new THREE.MeshPhongMaterial({
      color: 0x0f0f0f,
      specular:0xffffff,
      shininess: 100,
      reflectivity: 2
    });
    var ChairMesh2 = new THREE.Mesh(geometry, chairMtl);
    //ChairMesh2.position.set(-50, 0, 0);
    ChairMesh2.rotation.x = Math.PI/2;
    ChairMesh2.castShadow = true;
    ChairMesh2.receiveShadow = true;
    scene.add(ChairMesh2);

  }

  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/toy2.json', addToytoScn);
  function addToytoScn(geometry) {
    var toyMtl = new THREE.MeshPhongMaterial({
      color: 0xffdc35,
      specular:0xffffff,
      shininess: 1,
      reflectivity: 2
    });
    var ChairMesh2 = new THREE.Mesh(geometry, toyMtl);
    //ChairMesh2.position.set(0, 0, -20);
    ChairMesh2.rotation.x = Math.PI/2;
    ChairMesh2.rotation.z = Math.PI/20;
    ChairMesh2.castShadow = true;
    ChairMesh2.receiveShadow = true;
    scene.add(ChairMesh2);

  }

  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/lamp.json', addLamptoScn);
  function addLamptoScn(geometry, material) {
    var toyMtl = new THREE.MeshFaceMaterial(material);
    var ChairMesh2 = new THREE.Mesh(geometry, toyMtl);
    //ChairMesh2.position.set(-50, 0, 0);
    ChairMesh2.rotation.x = Math.PI/2;
    ChairMesh2.castShadow = true;
    ChairMesh2.receiveShadow = true;
    scene.add(ChairMesh2);

  }

  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/clock2.json', addClocktoScn);
  function addClocktoScn(geometry, material) {
    var toyMtl = new THREE.MeshFaceMaterial(material);
    var ChairMesh2 = new THREE.Mesh(geometry, toyMtl);
    ChairMesh2.position.set(0, 30, 0);
    ChairMesh2.scale.set(1, 1, 1);
    ChairMesh2.rotation.x = Math.PI/2;
    ChairMesh2.castShadow = true;
    ChairMesh2.receiveShadow = true;
    scene.add(ChairMesh2);

  }

  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/window1.json', addWindow1toScn);
  function addWindow1toScn(geometry, material) {
    var toyMtl = new THREE.MeshFaceMaterial(material);
    var ChairMesh2 = new THREE.Mesh(geometry, toyMtl);
    ChairMesh2.position.set(0, 0, 0);
    ChairMesh2.scale.set(1, 1, 1);
    ChairMesh2.rotation.x = Math.PI/2;
    ChairMesh2.castShadow = true;
    ChairMesh2.receiveShadow = true;
    scene.add(ChairMesh2);

  }

  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/window2.json', addWindow2toScn);
  function addWindow2toScn(geometry) {
    var toyMtl = new THREE.MeshLambertMaterial({
      opacity: 0.5,
      transparent:true,
      color: 0xffffff
    });
    var ChairMesh2 = new THREE.Mesh(geometry, toyMtl);
    ChairMesh2.position.set(0, 0, 0);
    ChairMesh2.scale.set(1, 1, 1);
    ChairMesh2.rotation.x = Math.PI/2;
    //ChairMesh2.castShadow = true;
    ChairMesh2.receiveShadow = true;
    scene.add(ChairMesh2);

  }



  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/window1.json', addWindow3toScn);
  function addWindow3toScn(geometry, material) {
    var toyMtl = new THREE.MeshFaceMaterial(material);
    var ChairMesh2 = new THREE.Mesh(geometry, toyMtl);
    ChairMesh2.position.set(0, 0, 192);
    ChairMesh2.scale.set(1, 1, 1);
    ChairMesh2.rotation.x = Math.PI/2;
    ChairMesh2.castShadow = true;
    ChairMesh2.receiveShadow = true;
    scene.add(ChairMesh2);

  }

  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/window2.json', addWindow4toScn);
  function addWindow4toScn(geometry) {
    var toyMtl = new THREE.MeshLambertMaterial({
      opacity: 0.5,
      transparent:true,
      color: 0xffffff
    });
    var ChairMesh2 = new THREE.Mesh(geometry, toyMtl);
    ChairMesh2.position.set(0, 0, 192);
    ChairMesh2.scale.set(1, 1, 1);
    ChairMesh2.rotation.x = Math.PI/2;
    //ChairMesh2.castShadow = true;
    ChairMesh2.receiveShadow = true;
    scene.add(ChairMesh2);

  }

  var paintGeo = new THREE.PlaneBufferGeometry(100, 69.3);
  var paintTxr = THREE.ImageUtils.loadTexture( 'img/Wassily Kandinsky01.jpg' );
  var paintMtl = new THREE.MeshPhongMaterial( {
    color: 0xffffff,
    specular:0xffffff,
    shininess: 1,
    map: paintTxr,
    //bumpMap: paintTxr,
    //bumpScale: 0.2,
    //envMap: textureCube,
    //combine: THREE.MixOperation,
    reflectivity: 0.001
  } );
  var paintMesh = new THREE.Mesh(paintGeo, paintMtl);
  paintMesh.position.set(-96.9, 80, -57);
  paintMesh.scale.set(0.8, 0.8, 0.8);
  paintMesh.rotation.y = Math.PI/2;
  paintMesh.castShadow = true;
  paintMesh.receiveShadow = true;

  scene.add(paintMesh);

  var paintFrm = new THREE.BoxBufferGeometry(100, 69.3, 2.5);
  var frmMtl = new THREE.MeshLambertMaterial({
    color: 0xffffff
  });
  var frmMesh = new THREE.Mesh(paintFrm, frmMtl);
  frmMesh.position.set(-98, 80, -57);
  frmMesh.rotation.y = Math.PI/2;
  frmMesh.scale.set(0.8, 0.8, 0.8);
  frmMesh.castShadow = true;
  frmMesh.receiveShadow = true;

  scene.add(frmMesh);


  jsonLoader = new THREE.JSONLoader();
  jsonLoader.load('models/crystal.json', addSculptureToScn);
  function addSculptureToScn(geometry, material) {
    var toyMtl = new THREE.MeshFaceMaterial(material);
    Sculpture = new THREE.Mesh(geometry, toyMtl);
    Sculpture.rotation.x = Math.PI/2;
    Sculpture.position.set(-60, 60, 100);
    Sculpture.castShadow = true;
    Sculpture.receiveShadow = true;
    scene.add(Sculpture);

  }




}





function loop(){

  var dt = clock.getDelta();
  dt *= 0.5;
  var z =5*Math.sin(angle);
  Sculpture.rotation.z += 0.003;
  Sculpture.position.y = z + 60;
  angle += dt;

  if(controls.target.x < 0 && controls.target.z < 0){
    scene.add(spotLight9);
  }else {
    scene.remove(spotLight9);
  }

  if(controls.target.x < 0 && controls.target.z > 0){
    scene.add(spotLight10);
  }else {
    scene.remove(spotLight10);
  }




  if (directNum == 1){
    if(Math.abs(controls.target.x) > 60 || Math.abs(controls.target.z) > 90){
      directX *= -1;
      directZ *= -1;
    }
    controls.target.x += 0.03*directX;
    controls.object.position.x += 0.03*directX;
    controls.target.z += 0.03*directZ;
    controls.object.position.z += 0.03*directZ;
    console.log(controls.target.x, controls.target.z);
  }
  else if(directNum == 2){
    if(Math.abs(controls.target.x) > 60 || Math.abs(controls.target.z) > 90){
      directX *= -1;
      directZ *= -1;
    }
    controls.target.x += -0.03*directX;
    controls.object.position.x += -0.03*directX;
    controls.target.z += -0.03*directZ;
    controls.object.position.z += -0.03*directZ;
    console.log(controls.target.x, controls.target.z);
  }
  else if(directNum == 3){
    if(Math.abs(controls.target.x) > 60 || Math.abs(controls.target.z) > 90){
      directXt *= -1;
      directZt *= -1;
    }
    controls.target.x += -0.03*directXt;
    controls.object.position.x += -0.03*directXt;
    controls.target.z += -0.03*directZt;
    controls.object.position.z += -0.03*directZt;
    console.log(controls.target.x, controls.target.z);
  }
  else if(directNum == 4){
    if(Math.abs(controls.target.x) > 60 || Math.abs(controls.target.z) > 90){
      directXt *= -1;
      directZt *= -1;
    }
    controls.target.x += 0.03*directXt;
    controls.object.position.x += 0.03*directXt;
    controls.target.z += 0.03*directZt;
    controls.object.position.z += 0.03*directZt;
    console.log(controls.target.x, controls.target.z);
  }







  //controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(loop);

}


function callCtrl() {
  console.log(controls.object.position.y, controls.target.y);


}

function init(){


  document.addEventListener('mousedown', callCtrl, false);

  createScene();
  createLights();


  createRoom();


  

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(0, 80, 0); // 設定camera 起始位置
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minPolarAngle = Math.PI/3;
  controls.maxPolarAngle = Math.PI*2/3;
  //controls.minAzimuthAngle = -Math.PI/3;
  //controls.maxAzimuthAngle = Math.PI/3;
  controls.update();


/*
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  //controls.rotateUp(Math.PI / 4);
  controls.target.set(
      camera.position.x + 0.1,
      camera.position.y + 0.1,
      camera.position.z
  );
  controls.noZoom = true;
  controls.noPan = true;

  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    renderer.domElement.addEventListener('click', fullscreen, false);

    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }
  window.addEventListener('deviceorientation', setOrientationControls, true);
*/


  loop();

  document.getElementById("forward").addEventListener('mousedown', goForward, false);
  document.getElementById("backward").addEventListener("mousedown", goBack, false);
  document.getElementById("left").addEventListener("mousedown", goLeft, false);
  document.getElementById("right").addEventListener("mousedown", goRight, false);
  document.addEventListener("mouseup", stopGO, false);

  document.getElementById("forward").addEventListener('touchstart', goForward, false);
  document.getElementById("backward").addEventListener("touchstart", goBack, false);
  document.getElementById("left").addEventListener("touchstart", goLeft, false);
  document.getElementById("right").addEventListener("touchstart", goRight, false);
  document.addEventListener("touchend", stopGO, false);




}

// HANDLE MOUSE EVENTS

function goForward() {
  directNum = 1;
  directX = controls.target.x - controls.object.position.x;
  directZ = controls.target.z - controls.object.position.z;
}

function goBack() {
  directNum = 2;
  directX = controls.target.x - controls.object.position.x;
  directZ = controls.target.z - controls.object.position.z;
}

function goLeft() {
  directNum = 3;
  directX = controls.target.x - controls.object.position.x;
  directZ = controls.target.z - controls.object.position.z;
  directXt = directX * Math.cos(Math.PI/2) - directZ * Math.sin(Math.PI/2);
  directZt = directX * Math.sin(Math.PI/2) + directZ * Math.cos(Math.PI/2);
}

function goRight() {
  directNum = 4;
  directX = controls.target.x - controls.object.position.x;
  directZ = controls.target.z - controls.object.position.z;
  directXt = directX * Math.cos(Math.PI/2) - directZ * Math.sin(Math.PI/2);
  directZt = directX * Math.sin(Math.PI/2) + directZ * Math.cos(Math.PI/2);
}

function stopGO() {
  directNum = 0;

}



window.addEventListener('load', init, false);
