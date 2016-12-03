/**
 * Created by iceleaf on 2016/7/31.
 */


// Detects webgl

// - Global variables -

// Graphics variables
var container, stats;
var camera, controls, scene, renderer;
var textureLoader;
var clock = new THREE.Clock();
var clickRequest = false;
var mouseCoords = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var ballMaterial = new THREE.MeshPhongMaterial( { color: 0x202020 } );
var pos = new THREE.Vector3();
var quat = new THREE.Quaternion();

// Physics variables
var gravityConstant = -6;
var collisionConfiguration;
var dispatcher;
var broadphase;
var solver;
var physicsWorld;
var rigidBodies = [];
var softBodies = [];
var margin = 0.3;
var hinge;
var transformAux1 = new Ammo.btTransform();
var softBodyHelpers = new Ammo.btSoftBodyHelpers();

var jsonMesh = new THREE.Geometry();
var test;
var geom = new THREE.Geometry();

var outsideBox = new THREE.Mesh();
var box2 = new THREE.Mesh();
var painting = new THREE.Mesh();

var MannequinObj = new THREE.Object3D();
var posX = -14;
var posZ = -5;

var params = { opacity: 0.25 };

// var clothGeometry = new THREE.BufferGeometry();


var armMovement = 0;

// - Main code -

window.addEventListener('load', init, false);



// - Functions -

function init() {

    initGraphics();

    initPhysics();

    createObjects();

    initInput();
    animate();

}

function initGraphics() {



    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 );

    scene = new THREE.Scene();

    camera.position.x = 10;
    camera.position.y = 15;
    camera.position.z =  0;

    controls = new THREE.OrbitControls( camera );
    controls.target.y = 15;
    controls.target.x = -5;
    controls.target.z = 3;
    controls.enablePan = false;
    controls.minDistance = 8;
    controls.maxDistance = 20;
    controls.minPolarAngle = Math.PI/3; // radians
    controls.maxPolarAngle = 1.8*Math.PI/3; // radians
    controls.minAzimuthAngle =  Math.PI/5; // radians
    controls.maxAzimuthAngle = Math.PI*0.9; // radians

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xbfd1e5 );
    //renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;

    textureLoader = new THREE.TextureLoader();

    var ambientLight = new THREE.AmbientLight( 0x555555 , 1);
    scene.add( ambientLight );

    var light = new THREE.DirectionalLight( 0xffffff, 0.8 );
    light.position.set( -100,40, -10 );
    //var lightTarget = new THREE.Object3D();
    //lightTarget.position.set(0, 0, 0);
    //light.target = lightTarget;
    light.castShadow = true;
    var d = 40;
    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;

    light.shadowCameraNear = 1;
    light.shadowCameraFar = 1000;

    light.shadowMapWidth = 3000;
    light.shadowMapHeight = 3000;


    //light.shadowDarkness = 0.65;
    //scene.add(light.target);
    scene.add( light );









    var pointColor2 = new THREE.Color("#efffff");

    var spotLight5 = new THREE.SpotLight(pointColor2, 0.4);
    spotLight5.position.set(0, 28, -10);
    spotLight5.penumbra = 1;
    spotLight5.angle = 2;
    spotLight5.castShadow = true;
    spotLight5.receiveShadow = true;
    spotLight5.shadowMapWidth = 3000;
    spotLight5.shadowMapHeight = 3000;

    var tarB5 = new  THREE.Object3D();
    tarB5.position.set(-10, 10, -15);
    spotLight5.target = tarB5;
    scene.add(spotLight5.target);
    scene.add(spotLight5);

    var spotLight6 = new THREE.SpotLight(pointColor2, 0.3);
    spotLight6.position.set(0, 28, 10);
    spotLight6.penumbra = 1;
    spotLight6.angle = 2;
    spotLight6.castShadow = true;
    spotLight6.receiveShadow = true;
    spotLight6.shadowMapWidth = 3000;
    spotLight6.shadowMapHeight = 3000;

    var tarB6 = new  THREE.Object3D();
    tarB6.position.set(-10, 10, 15);
    spotLight6.target = tarB6;
    scene.add(spotLight6.target);
    scene.add(spotLight6);

    var spotLight = new THREE.SpotLight(pointColor2, 0.4);
    spotLight.position.set(0, 10, 0);
    spotLight.penumbra = 1;
    spotLight.angle = 2;
    spotLight.castShadow = true;
    spotLight.receiveShadow = true;
    spotLight.shadowMapWidth = 3000;
    spotLight.shadowMapHeight = 3000;

    var tarB6 = new  THREE.Object3D();
    tarB6.position.set(10, 20, 0);
    spotLight.target = tarB6;
    scene.add(spotLight.target);
    scene.add(spotLight);

    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );




    //


    window.addEventListener( 'resize', onWindowResize, false );

}



function initPhysics() {

    // Physics configuration

    collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
    dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
    broadphase = new Ammo.btDbvtBroadphase();
    solver = new Ammo.btSequentialImpulseConstraintSolver();
    softBodySolver = new Ammo.btDefaultSoftBodySolver();
    physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver);
    physicsWorld.setGravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
    physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );

}

function createObjects() {

    // Skybox
    var r2 = "textures/";
    var urls2 = [
        r2 + "px.jpg", r2 + "nx.jpg",
        r2 + "07xz.jpg", r2 + "07xz.jpg",
        r2 + "pz.jpg", r2 + "nz.jpg"
    ];

    var textureCube2 = new THREE.CubeTextureLoader().load( urls2 );
    textureCube2.format = THREE.RGBFormat;





    // Ground
    pos.set( 0, - 0.5, 0 );
    quat.set( 0, 0, 0, 1 );
    var texture4 = THREE.ImageUtils.loadTexture( 'textures/floorsTextureNo4716_1024x768.jpg' );
    texture4.wrapS = texture4.wrapT = THREE.RepeatWrapping;
    texture4.repeat.set( 4, 3 );
    var ground = createParalellepiped( 80, 1, 80, 0, pos, quat, new THREE.MeshLambertMaterial( {
        color: 0xdddddd,
        map: texture4,
        bumpMap: texture4,
        bumpScale: 0.5,
        shininess: 1000,
        //envMap: textureCube2,
        // combine: THREE.MixOperation,
        reflectivity: 0.10
    } ) );
    ground.castShadow = true;
    ground.receiveShadow = true;

    var texture5 = THREE.ImageUtils.loadTexture( 'textures/cartographer.png' );
    texture5.wrapS = texture5.wrapT = THREE.RepeatWrapping;
    texture5.repeat.set( 2, 2);

    // Wall_A
    var wallgeom0 = new THREE.BoxBufferGeometry(3, 50, 30);
    var wallmtl0 = new THREE.MeshPhongMaterial({
        color:0xffffff,
        map: texture5,
        bumpMap: texture5,
        bumpScale:-0.8
    });
    var wallmesh0 = new THREE.Mesh(wallgeom0, wallmtl0);

    wallmesh0.position.set(-20, 25, 0);
    wallmesh0.rotation.set(0, 0, 0);
    wallmesh0.castShadow = true;
    wallmesh0.receiveShadow = true;
    scene.add(wallmesh0);


    var texture0 = THREE.ImageUtils.loadTexture( 'textures/orange-wall-texture.jpg' );
    texture0.wrapS = texture0.wrapT = THREE.RepeatWrapping;
    texture0.repeat.set( 1, 1);




    var texture1 = THREE.ImageUtils.loadTexture( 'textures/symphony.png' );
    texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
    texture1.repeat.set( 10, 10);

    // Wall_A
    var wallgeomA = new THREE.BoxBufferGeometry(80, 50, 1);
    var wallmtlA = new THREE.MeshPhongMaterial({
        color:0xffffff,
        map: texture5,
        bumpMap:texture5,
        bumpScale:1

    });
    var wallmeshA = new THREE.Mesh(wallgeomA, wallmtlA);

    wallmeshA.position.set(0, 15, 25);
    wallmeshA.rotation.set(0, 0, 0);
    wallmeshA.castShadow = true;
    wallmeshA.receiveShadow = true;
    scene.add(wallmeshA);



    // Wall_B
    var wallgeomB = new THREE.BoxBufferGeometry(70, 50, 1);
    var wallmtlB = new THREE.MeshPhongMaterial({

        premultipliedAlpha: true,
        transparent: true,
        color:0xffffff,
        map: texture5,
        bumpMap:texture5,
        bumpScale:1,
        shininess:1
    });
    var wallmeshB = new THREE.Mesh(wallgeomB, wallmtlB);
    wallmeshB.position.set(0, 15, -25);
    wallmeshB.rotation.set(0, 0, 0);
    wallmeshB.castShadow = true;
    wallmeshB.receiveShadow = true;
    scene.add(wallmeshB);



    // Wall_B2
    var wallgeomB2 = new THREE.BoxBufferGeometry(20, 30, 1);
    var wallmtlB2 = new THREE.MeshPhongMaterial({
        color:0xffffff,
        map: texture1,
        bumpMap:texture1,
        bumpScale:0.3,

        shininess:1
    });
    var wallmeshB2 = new THREE.Mesh(wallgeomB2, wallmtlB2);
    wallmeshB2.position.set(0, 15, 24);
    wallmeshB2.rotation.set(0, 0, 0);
    wallmeshB2.castShadow = true;
    wallmeshB2.receiveShadow = true;
    scene.add(wallmeshB2);

    var texture3 = THREE.ImageUtils.loadTexture( 'textures/carpetsTextureNo9384_1024x768.jpg' );
    texture3.wrapS = texture3.wrapT = THREE.RepeatWrapping;
    texture3.repeat.set( 3, 3);
    var bumpMtl2 = THREE.ImageUtils.loadTexture( 'textures/light brown carpeting texture-seamless.jpg' );
    bumpMtl2.wrapS = bumpMtl2.wrapT = THREE.RepeatWrapping;
    bumpMtl2.repeat.set( 10, 10);
    // floor
    var wallgeomC = new THREE.BoxBufferGeometry(30, 30, 0.05);
    var wallmtlC = new THREE.MeshPhongMaterial({
        color:0xffffff,
        map: texture3,
        bumpMap: texture3,
        bumpScale:0.5,
        shininess:1
    });
    var wallmeshC = new THREE.Mesh(wallgeomC, wallmtlC);
    wallmeshC.position.set(0, 0, 0);
    wallmeshC.rotation.set(Math.PI/2, 0, 0);
    //wallmeshC.material.side = THREE.BackSide;
    wallmeshC.castShadow = true;
    wallmeshC.receiveShadow = true;
    scene.add(wallmeshC);

    // ceiling
    var ceilgeom = new THREE.BoxBufferGeometry(50, 1, 80);
    var ceilmtl = new THREE.MeshPhongMaterial({color:0xffffff});
    var ceilmesh = new THREE.Mesh(ceilgeom, ceilmtl);
    ceilmesh.position.set(0, 30, 0);
    ceilmesh.rotation.set(0, 0, 0);
    //ceilmesh.material.side = THREE.BackSide;
    ceilmesh.castShadow = true;
    ceilmesh.receiveShadow = true;
    scene.add(ceilmesh);


    ///////////////////// Dress set///////////////////////////

    // Create soft volumes
    var volumeMass = 1;
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/dressM.json', addLamptoScn);
    function addLamptoScn(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial(material);
        var clothGeometryGeometry = new THREE.BufferGeometry().fromGeometry(geometry);

        clothGeometryGeometry.translate(posX, posZ, 0);
        clothGeometryGeometry.rotateX(Math.PI / 2);
        createSoftVolume(clothGeometryGeometry, mtl, volumeMass, 0);


    }

    //mannequin
    var jsonLoader2 = new THREE.JSONLoader();
    jsonLoader2.load('models/mannequin.json', addManToScene);
    function addManToScene(geometry, material) {
        var manMtl = new THREE.MeshPhongMaterial( { color: 0x555555, specular:0xffffff, envMap: textureCube2, combine: THREE.MultiplyOperation } );
        var manMesh = new THREE.Mesh(geometry, manMtl);
        manMesh.position.set(posX, 0, posZ);
        manMesh.rotateX(Math.PI/2);
        manMesh.castShadow = true;
        manMesh.receiveShadow = true;
        scene.add(manMesh);
    }

    //shoulder
    pos.set( posX, 16.4, posZ+1.3 );
    quat.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), 12 * Math.PI / 180 );
    var shoulder = createParalellepiped( 0.4, 0.4, 1, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ) );
    shoulder.castShadow = true;
    shoulder.receiveShadow = true;

    pos.set( posX, 16.4, posZ-1.3 );
    quat.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), -12 * Math.PI / 180 );
    var shoulder1 = createParalellepiped( 0.4, 0.4, 1, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ) );
    shoulder1.castShadow = true;
    shoulder1.receiveShadow = true;

    pos.set( posX+0.1, 15.5,posZ );
    quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), -35 * Math.PI / 180 );
    var shoulder2 = createParalellepiped( 1.3, 0.8, 1.5, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ) );
    shoulder2.castShadow = true;
    shoulder2.receiveShadow = true;

    // Creates a ball
    var ballRadius = 1.0;

    var ball = new THREE.Mesh( new THREE.SphereGeometry( ballRadius, 18, 16 ), ballMaterial );
    ball.castShadow = true;
    ball.receiveShadow = true;
    var ballShape = new Ammo.btSphereShape( ballRadius );
    ballShape.setMargin( margin );
    pos.set( posX, 14,posZ);
    quat.set( 0, 0, 0, 1 );
    var ballBody = createRigidBody( ball, ballShape, 0, pos, quat );



    var ballRadius = 1.4;

    var ball = new THREE.Mesh( new THREE.SphereGeometry( ballRadius, 18, 16 ), ballMaterial );
    ball.castShadow = true;
    ball.receiveShadow = true;
    var ballShape = new Ammo.btSphereShape( ballRadius );
    ballShape.setMargin( margin );
    pos.set( posX-0.5, 12,posZ );
    quat.set( 0, 0, 0, 1 );
    var ballBody = createRigidBody( ball, ballShape, 0, pos, quat );

    jsonLoader2.load("models/rod.json", addRodToScn);
    function addRodToScn(geometry) {
        var mtl = new THREE.MeshPhongMaterial( { color: 0xffffff, specular:0xffffff, envMap: textureCube2, combine: THREE.MultiplyOperation } );
        var mesh = new THREE.Mesh(geometry, mtl);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.set(Math.PI/2, 0, 0);
        mesh.position.set(posX, 0, posZ);
        scene.add(mesh);
    }
    ///////////////////// Dress set///////////////////////////

    jsonLoader2.load("models/sofa.json", addSofaToScn);
    function addSofaToScn(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial(material);
        var mesh = new THREE.Mesh(geometry, mtl);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.set(Math.PI/2, 0, 0);
        mesh.position.set(-10, 0, 6);
        scene.add(mesh);
    }

    jsonLoader2.load("models/clock12.json", addClock2ToScn);
    function addClock2ToScn(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial(material);
        var mesh = new THREE.Mesh(geometry, mtl);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.set(Math.PI/2, 0, 0);
        mesh.position.set(-20, 18, 10);
        scene.add(mesh);
    }

    jsonLoader2.load("models/clock1.json", addClock1ToScn);
    function addClock1ToScn(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial(material);
        var mesh = new THREE.Mesh(geometry, mtl);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.set(Math.PI/2, 0, 0);
        mesh.position.set(-20, 18, 10);
        scene.add(mesh);
    }

    jsonLoader2.load("models/pic.json", addPicToScn);
    function addPicToScn(geometry, material) {
        var mtl = new THREE.MeshFaceMaterial(material);
        var mesh = new THREE.Mesh(geometry, mtl);
        mesh.scale.set(1.3, 1.3, 1.3);
        mesh.material.transparent = true;
        mesh.material.opacity = 0.1;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.set(2.8*Math.PI/5, 0, -Math.PI/2);
        mesh.position.set(0, 6, 21.8);
        scene.add(mesh);
        painting.add(mesh);
    }
    painting.material = new THREE.MeshPhongMaterial({color:0x555555});
    painting.material.transparent = true;
    painting.material.opacity = 0.1;
    scene.add(painting);





}




function addCubeToScene(geometry) {
    var mtl = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
        shininess: 1
    });

    var jsonModel = new THREE.Mesh(geometry, mtl);
    //scene.add(jsonModel);

    jsonModel.castShadow = true;
    jsonModel.receiveShadow = true;
    outsideBox.add(jsonModel); // 要有一個外部var outsideBox定義
    return outsideBox;


}

function createPhysBox( box2, mass, pos, quat ) {

    var threeObject = box2;
    var shape = new Ammo.btBoxShape( new Ammo.btVector3( 5 * 0.5, 5 * 0.5, 5 * 0.5 ) );
    shape.setMargin( margin );  //margin 碰撞邊緣

    createRigidBody( threeObject, shape, mass, pos, quat );

    return threeObject;

}

function createParalellepiped( sx, sy, sz, mass, pos, quat, material ) {

    var threeObject = new THREE.Mesh( new THREE.BoxGeometry( sx, sy, sz, 10, 10, 10 ), material );
    var shape = new Ammo.btBoxShape( new Ammo.btVector3( sx * 1, sy *1, sz * 1 ) );
    shape.setMargin( margin );  //margin 碰撞邊緣

    createRigidBody( threeObject, shape, mass, pos, quat );

    return threeObject;

}






function processGeometry( bufGeometry ) {

    // Obtain a Geometry
    var geometry = new THREE.Geometry().fromBufferGeometry( bufGeometry );

    // Merge the vertices so the triangle soup is converted to indexed triangles
    var vertsDiff = geometry.mergeVertices();

    // Convert again to BufferGeometry, indexed
    var indexedBufferGeom = createIndexedBufferGeometryFromGeometry( geometry );

    // Create index arrays mapping the indexed vertices to bufGeometry vertices
    mapIndices( bufGeometry, indexedBufferGeom );

}

function createIndexedBufferGeometryFromGeometry( geometry ) {

    var numVertices = geometry.vertices.length;
    var numFaces = geometry.faces.length;

    var bufferGeom = new THREE.BufferGeometry();
    var vertices = new Float32Array( numVertices * 3 );
    var indices = new ( numFaces * 3 > 65535 ? Uint32Array : Uint16Array )( numFaces * 3 );

    for ( var i = 0; i < numVertices; i++ ) {

        var p = geometry.vertices[ i ];

        var i3 = i * 3;

        vertices[ i3 ] = p.x;
        vertices[ i3 + 1 ] = p.y;
        vertices[ i3 + 2 ] = p.z;

    }

    for ( var i = 0; i < numFaces; i++ ) {

        var f = geometry.faces[ i ];

        var i3 = i * 3;

        indices[ i3 ] = f.a;
        indices[ i3 + 1 ] = f.b;
        indices[ i3 + 2 ] = f.c;

    }

    bufferGeom.setIndex( new THREE.BufferAttribute( indices, 1 ) );
    bufferGeom.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    return bufferGeom;
}

function isEqual( x1, y1, z1, x2, y2, z2 ) {
    var delta = 0.000001;
    return Math.abs( x2 - x1 ) < delta &&
        Math.abs( y2 - y1 ) < delta &&
        Math.abs( z2 - z1 ) < delta;
}

function mapIndices( bufGeometry, indexedBufferGeom ) {

    // Creates ammoVertices, ammoIndices and ammoIndexAssociation in bufGeometry

    var vertices = bufGeometry.attributes.position.array;
    var idxVertices = indexedBufferGeom.attributes.position.array;
    var indices = indexedBufferGeom.index.array;

    var numIdxVertices = idxVertices.length / 3;
    var numVertices = vertices.length / 3;

    bufGeometry.ammoVertices = idxVertices;
    bufGeometry.ammoIndices = indices;
    bufGeometry.ammoIndexAssociation = [];

    for ( var i = 0; i < numIdxVertices; i++ ) {

        var association = [];
        bufGeometry.ammoIndexAssociation.push( association );

        var i3 = i * 3;

        for ( var j = 0; j < numVertices; j++ ) {
            var j3 = j * 3;
            if ( isEqual( idxVertices[ i3 ], idxVertices[ i3 + 1 ],  idxVertices[ i3 + 2 ],
                    vertices[ j3 ], vertices[ j3 + 1 ], vertices[ j3 + 2 ] ) ) {
                association.push( j3 );
            }
        }

    }

}

function createSoftVolume( bufferGeom, mtl, mass, pressure ) {

    processGeometry( bufferGeom );

    var volume2 = new THREE.Mesh( bufferGeom, mtl );
    volume2.material.side = THREE.DoubleSide;
    volume2.castShadow = true;
    volume2.receiveShadow = true;
    volume2.frustumCulled = false;
    scene.add( volume2 );

    textureLoader.load( "textures/colors.png", function( texture ) {
        //volume2.material.side = THREE.DoubleSide;
        //texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set( 1, 1 );
        //volume2.material.map = texture;
        //volume2.material.shininess = 1;

        //volume2.material.needsUpdate = true;
    } );

    // Volume physic object

    var volumeSoftBody = softBodyHelpers.CreateFromTriMesh(
        physicsWorld.getWorldInfo(),
        bufferGeom.ammoVertices,
        bufferGeom.ammoIndices,
        bufferGeom.ammoIndices.length / 3,
        true );

    var sbConfig = volumeSoftBody.get_m_cfg();
    sbConfig.set_viterations( 10 );
    sbConfig.set_piterations( 10 );

    // Soft-soft and soft-rigid collisions
    sbConfig.set_collisions( 0x11 );

    // Friction
    sbConfig.set_kDF( 2 );
    // Damping
    sbConfig.set_kDP( 0.01 );
    // Pressure
    sbConfig.set_kPR( pressure );
    // Stiffness
    volumeSoftBody.get_m_materials().at( 0 ).set_m_kLST( 0.9 );
    volumeSoftBody.get_m_materials().at( 0 ).set_m_kAST( 0.9 );

    volumeSoftBody.setTotalMass( mass, false );
    Ammo.castObject( volumeSoftBody, Ammo.btCollisionObject ).getCollisionShape().setMargin( margin );
    physicsWorld.addSoftBody( volumeSoftBody, 1, -1 );
    volume2.userData.physicsBody = volumeSoftBody;
    // Disable deactivation
    volumeSoftBody.setActivationState( 4 );

    softBodies.push( volume2 );

}


//
// function createRigidBody 是常態性的，不用改
//

function createRigidBody( threeObject, physicsShape, mass, pos, quat ) {

    threeObject.position.copy( pos );
    threeObject.quaternion.copy( quat );

    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    var motionState = new Ammo.btDefaultMotionState( transform );

    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    physicsShape.calculateLocalInertia( mass, localInertia );

    var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
    var body = new Ammo.btRigidBody( rbInfo );

    threeObject.userData.physicsBody = body;

    scene.add( threeObject );




    if ( mass > 0 ) {
        rigidBodies.push( threeObject );

        // Disable deactivation
        body.setActivationState( 4 );
    }

    physicsWorld.addRigidBody( body );

    return body;
}

function initInput() {

    window.addEventListener( 'mousedown', function( event ) {

        if ( ! clickRequest ) {

            mouseCoords.set(
                ( event.clientX / window.innerWidth ) * 2 - 1,
                - ( event.clientY / window.innerHeight ) * 2 + 1
            );

            clickRequest = true;

        }

    }, false );

}

function processClick() {

    if ( clickRequest ) {

        raycaster.setFromCamera( mouseCoords, camera );

        // Creates a ball
        var ballMass = 3;
        var ballRadius = 0.4;

        var ball = new THREE.Mesh( new THREE.SphereGeometry( ballRadius, 18, 16 ), ballMaterial );
        ball.castShadow = true;
        ball.receiveShadow = true;
        var ballShape = new Ammo.btSphereShape( ballRadius );
        ballShape.setMargin( margin );
        pos.copy( raycaster.ray.direction );
        pos.add( raycaster.ray.origin );
        quat.set( 0, 0, 0, 1 );
        var ballBody = createRigidBody( ball, ballShape, ballMass, pos, quat );
        ballBody.setFriction( 0.5 );

        pos.copy( raycaster.ray.direction );
        pos.multiplyScalar( 14 );
        ballBody.setLinearVelocity( new Ammo.btVector3( pos.x, pos.y, pos.z ) );

        clickRequest = false;

    }

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}



function animate() {

    requestAnimationFrame( animate );

    controls.update();
    render();

}

function render() {

    var deltaTime = clock.getDelta();

    updatePhysics( deltaTime );

    processClick();

    controls.update( deltaTime );

    renderer.render( scene, camera );

}

function updatePhysics( deltaTime ) {

    // Step world
    physicsWorld.stepSimulation( deltaTime, 10 );

    // Update soft volumes
    for ( var i = 0, il = softBodies.length; i < il; i++ ) {
        var volume = softBodies[ i ];
        var geometry = volume.geometry;
        var softBody = volume.userData.physicsBody;
        var volumePositions = geometry.attributes.position.array;
        var volumeNormals = geometry.attributes.normal.array;
        var association = geometry.ammoIndexAssociation;
        var numVerts = association.length;
        var nodes = softBody.get_m_nodes();
        for ( var j = 0; j < numVerts; j ++ ) {

            var node = nodes.at( j );
            var nodePos = node.get_m_x();
            var x = nodePos.x();
            var y = nodePos.y();
            var z = nodePos.z();
            var nodeNormal = node.get_m_n();
            var nx = nodeNormal.x();
            var ny = nodeNormal.y();
            var nz = nodeNormal.z();

            var assocVertex = association[ j ];

            for ( var k = 0, kl = assocVertex.length; k < kl; k++ ) {
                var indexVertex = assocVertex[ k ];
                volumePositions[ indexVertex ] = x;
                volumeNormals[ indexVertex ] = nx;
                indexVertex++;
                volumePositions[ indexVertex ] = y;
                volumeNormals[ indexVertex ] = ny;
                indexVertex++;
                volumePositions[ indexVertex ] = z;
                volumeNormals[ indexVertex ] = nz;
            }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.normal.needsUpdate = true;

    }

    // Update rigid bodies
    for ( var i = 0, il = rigidBodies.length; i < il; i++ ) {
        var objThree = rigidBodies[ i ];
        var objPhys = objThree.userData.physicsBody;
        var ms = objPhys.getMotionState();
        if ( ms ) {

            ms.getWorldTransform( transformAux1 );
            var p = transformAux1.getOrigin();
            var q = transformAux1.getRotation();
            objThree.position.set( p.x(), p.y(), p.z() );
            objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );

        }
    }

}
