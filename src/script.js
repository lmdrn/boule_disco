import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xefc3ff, 0.6)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.position.set(2, 2, -1)
scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0xf4cccc, 0.9)
gui.add(hemisphereLight, 'intensity').min(0).max(3).step(0.001)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xff86cf, 1.5, 0, 2)
gui.add(pointLight, 'intensity').min(0).max(3).step(0.001)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

/**
 * Gradient Background
 */
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/gradient2.png')
gradientTexture.colorSpace = THREE.SRGBColorSpace
scene.background = gradientTexture

/**
 * Materials
 */
const reflectiveMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.5,
    color: 0xC09BD9,
    envMap: gradientTexture
})
reflectiveMaterial.flatShading = true
gui.add(reflectiveMaterial, 'metalness').min(0).max(1).step(0.001)
gui.add(reflectiveMaterial, 'roughness').min(0).max(1).step(0.001)
gui.addColor(reflectiveMaterial, 'color').min(0).max(1).step(0.001)

/**
 * Disco Ball
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 16, 16),
    reflectiveMaterial
)
sphere.castShadow = true
scene.add(sphere)

/**
 * 3D Text
 */
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/Funkorama_Regular.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Hello',
            {
                font: font,
                height: 0.01,
                size: 0.5,
                depth: 0.2,
                curveSegments: 116,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.03,
                bevelOffset: 0,
                bevelSegments: 10
            }
        )
        textGeometry.center();
        const matcapTexture = textureLoader.load('/textures/matcaps/8.png');
        matcapTexture.colorSpace = THREE.SRGBColorSpace;
        
        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(text);
        text.position.set(0, 1, -1);
    },
    undefined,
    (error) => {
        console.error('Error loading font:', error);
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100);

camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.2 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()