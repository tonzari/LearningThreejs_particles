import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { AlphaFormat } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/1.png')

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 50000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++)
{
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3),
)

particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

// const cubeGeometry = new THREE.BoxGeometry(1,1)
// const cubeMaterial = new THREE.MeshBasicMaterial({
//     color: 0xFF0000
// })
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// scene.add(cube)

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    alphaMap: particleTexture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: colors
    // depthTest: false OR
    // use alphatest to help with the render queue 

})
//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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

    // Update particles
    //particles.rotation.y = elapsedTime * 0.01

    for (let i = 0; i < count; i++)
    {
        
        const i3 = i * 3
        const x = particlesGeometry.attributes.position.array[i3]
        const z = particlesGeometry.attributes.position.array[i3 + 2]
        // particlesGeometry.attributes.position.array[i3 + 1] = Math.cos(Math.sin(Math.cos((elapsedTime + x + z))*2)*z) + Math.cos((elapsedTime + x + z))
        // particlesGeometry.attributes.position.array[i3 + 1] = Math.cos(Math.sin(Math.cos((elapsedTime + x + z))*2)*z)
        // particlesGeometry.attributes.position.array[i3 + 1] = Math.sin((elapsedTime + x + z)) / x
         particlesGeometry.attributes.position.array[i3 + 1] = Math.cos( Math.cos((elapsedTime + x)) / z ) + Math.sin( Math.cos((elapsedTime + z)) / x )
        // particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(Math.sin(Math.cos((elapsedTime + x) / 100))/z) - Math.sin(elapsedTime + Math.sin(Math.sin(x))/z) * (Math.sin(Math.sin(Math.cos((elapsedTime + x))*z)/x) - Math.sin(elapsedTime + Math.sin(Math.sin(x))/z))
        //particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(Math.sin((Math.sin(Math.sin(elapsedTime + x)*4) - Math.sin(elapsedTime + z) * 2) / 5 ) / 3)
    }

    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()