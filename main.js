import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from "gsap";

//scene
const scene = new THREE.Scene()

//mesh
const material = new THREE.MeshStandardMaterial({
    color: '#00ff83'
})

const geometry = new THREE.SphereGeometry(3, 64, 64);


const mesh = new THREE.Mesh(geometry, material);
mesh.position.normalize()
scene.add(mesh)

//light 
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 10, 10);
scene.add(light)

//camera

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 12;
scene.add(camera);

//render 

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 2.5

// animation 

const timeLine = gsap.timeline({ defaults: { duration: 1 } })
timeLine.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })

let mouseDown = false
let rgb = []
window.addEventListener("mousedown", (event) => mouseDown = true)
window.addEventListener("mouseup", (event) => mouseDown = false)
window.addEventListener('mousemove', (event) => {
    if (mouseDown) {
        rgb = [
            Math.round((event.pageX / sizes.width) * 255),
            Math.round((event.pageY / sizes.height) * 255),
            150
        ]

        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
        gsap.to(mesh.material.color, {
            r: newColor.r, g: newColor.g, b: newColor.b
        })
    }

})


const tick = () => {
    //update
    controls.update()
    //render
    renderer.setSize(sizes.width, sizes.height)
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()


//handle resize 
window.addEventListener("resize", (event) => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)

});


