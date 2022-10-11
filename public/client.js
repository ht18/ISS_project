import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import Stats from './jsm/libs/stats.module.js'
import { GUI } from './jsm/libs/lil-gui.module.min.js'

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
camera.position.z = 5

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

//Sphère Céleste
const geometry = new THREE.SphereGeometry(1.6, 18, 18);
const material = new THREE.MeshBasicMaterial({ wireframe: true }, { wireframeLineWidth: 0.01 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

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




const stats = Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
const sphereFolder = gui.addFolder('sphere')
sphereFolder.add(sphere.scale, 'x', -5, 5)
sphereFolder.add(sphere.scale, 'y', -5, 5)
sphereFolder.add(sphere.scale, 'z', -5, 5)
sphereFolder.open()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.open()

function animate() {
    requestAnimationFrame(animate)
    sphere.rotation.y += 0.001
    earth.rotation.y += 0.001
    // il va falloir faire tourner le point pour l'afficher comme il faut
    controls.update()
    render()
    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
