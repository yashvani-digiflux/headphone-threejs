import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000)

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30)

renderer.render(scene,camera);


const loader = new GLTFLoader();
let headphone;
loader.load('/assets/headphone/headphone.glb', function ( gltf ) {
  headphone = gltf.scene;
    scene.add(headphone);

    // Position and scale the model
    headphone.position.set(0 ,0, 0);
    headphone.scale.set(25, 25, 25);


    animate();

}, function(xhr){
  console.log(xhr.loaded/xhr.total * 100) + "% loaded";
}, function ( error ) {

	console.error( error );

} );
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(1,1,3)

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight,ambientLight )
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50)
scene.add( gridHelper)

const material = new THREE.MeshStandardMaterial({color: 0xff1fe5ff})
const torus = new THREE.Mesh(headphone,material)

 
scene.add(torus)

const controls =  new OrbitControls(camera, renderer.domElement)

camera.position.z = 5;
function animate() {
  requestAnimationFrame(animate)
  torus.rotation.x += 0.01  
  torus.rotation.y += 0.01
  torus.rotation.z += 0.01
  renderer.render(scene,camera)
}

animate()   
