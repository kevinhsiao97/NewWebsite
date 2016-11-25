/**
 * Created by iceleaf on 2016/5/21.
 */
var model;


var loader1 = new THREE.JSONLoader();
loader1.load("models/Spaceship02.json", addColorBallToScene );


function addColorBallToScene(geometry) {

    var matCockpit = new THREE.MeshStandardMaterial({color:"rgb(100,0 , 50)", shading:THREE.FlatShading});
    model = new THREE.Mesh(geometry,matCockpit);
    model.position.set(0, 100, 0);
    model.rotation.set(90, 0, 45);

    model.scale.set(10,10,10);

    scene.add(model);


}