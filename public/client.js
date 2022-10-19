import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { GUI } from './jsm/libs/lil-gui.module.min.js'


// API
const endpoint = "http://api.open-notify.org/iss-now.json";
const arrayOfData = [];
function setData(dataArr) {
    arrayOfData.push(dataArr['iss_position']['latitude'], dataArr['iss_position']['longitude']);
    return arrayOfData;
}

async function getData() {
    const response = await fetch(endpoint);
    const responseJson = await response.json();
    const data = setData(responseJson);
    console.log(data);
    setInterval(() => {
        getData();
    }, 5000)
    return data
}



//scène
const scene = new THREE.Scene();

scene.background = new THREE.CubeTextureLoader()
    .setPath('/assets/')
    .load([
        '1.jpg',
        '2.jpg',
        '3.jpg',
        '4.jpg',
        '5.jpg',
        '6.jpg'
    ]);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement);

// Terre
const earthGeometry = new THREE.SphereGeometry(1);
const load = new THREE.TextureLoader().load("/assets/earthmap1k.jpg");
const bumpEarth = new THREE.TextureLoader().load("/assets/earthbump1k.jpg");
const earthMaterial = new THREE.MeshLambertMaterial({
    map: load,
    bump: bumpEarth,
    transparent: false
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earth);

//Point
const info = document.getElementById('info');
const latLongDiv = document.createElement('div');
latLongDiv.classList.add('text');

async function pointLive() {
    const group = new THREE.Group();
    const latLong = await getData();
    const latitude = latLong[latLong.length - 2];
    const longitude = latLong[latLong.length - 1];
    const pointGeometry = new THREE.SphereGeometry(0.025, 18, 18);
    const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    point.position.x = 1 * Math.cos(latitude * (Math.PI / 180)) * Math.cos(longitude * (Math.PI / 180));
    point.position.y = 1 * Math.sin(latitude * (Math.PI / 180));
    point.position.z = -(1 * Math.cos(latitude * (Math.PI / 180)) * Math.sin(longitude * (Math.PI / 180)));
    latLongDiv.innerHTML = `Latitude : ${latitude} & Longitude : ${longitude}`
    info.appendChild(latLongDiv);
    group.add(point);
    scene.add(group);

    setInterval(() => {
        scene.remove(group)
        pointLive()
    }, 3000)
}

pointLive()

//Lumière
const light = new THREE.AmbientLight(0x404040, 2.5); // soft white light
scene.add(light);



window.addEventListener(
    'resize',
    () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    },
    false
)

const gui = new GUI()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.open()


function animate() {
    requestAnimationFrame(animate)
    //earth.rotation.y += 0.001;
    // il va falloir faire tourner le point pour l'afficher comme il faut 
    controls.update()
    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()


