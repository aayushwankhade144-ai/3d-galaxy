import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// =============================
// 1. SCENE
// =============================

const scene = new THREE.Scene();


// =============================
// 2. CAMERA
// =============================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 8;


// =============================
// 3. RENDERER
// =============================

const canvas = document.getElementById("galaxy");

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);


// =============================
// 4. CREATE GALAXY
// =============================

const starCount = 12000;

const positions = new Float32Array(
    starCount * 3
);

const colors = new Float32Array(
    starCount * 3
);


for (let i = 0; i < starCount; i++) {

    // Distance from galaxy center
    const radius = Math.random() * 6;

    // Creates spiral arms
    const spin =
        radius * 1.5;

    const angle =
        Math.random() * Math.PI * 2
        + spin;


    // Some randomness
    const randomX =
        (Math.random() - 0.5) *
        0.5;

    const randomY =
        (Math.random() - 0.5) *
        0.5;

    const randomZ =
        (Math.random() - 0.5) *
        0.5;


    // X position
    positions[i * 3] =
        Math.cos(angle) *
        radius +
        randomX;


    // Y position
    positions[i * 3 + 1] =
        randomY *
        (1 - radius / 8);


    // Z position
    positions[i * 3 + 2] =
        Math.sin(angle) *
        radius +
        randomZ;


    // Star colors
    const color =
        new THREE.Color();

    color.setHSL(
        0.65 +
        Math.random() * 0.15,

        0.7,

        0.6 +
        Math.random() * 0.4
    );


    colors[i * 3] =
        color.r;

    colors[i * 3 + 1] =
        color.g;

    colors[i * 3 + 2] =
        color.b;
}


// =============================
// 5. STAR GEOMETRY
// =============================

const galaxyGeometry =
    new THREE.BufferGeometry();


galaxyGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        positions,
        3
    )
);


galaxyGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(
        colors,
        3
    )
);


// =============================
// 6. STAR MATERIAL
// =============================

const galaxyMaterial =
    new THREE.PointsMaterial({

        size: 0.025,

        sizeAttenuation: true,

        vertexColors: true,

        transparent: true,

        opacity: 0.9

    });


// =============================
// 7. GALAXY OBJECT
// =============================

const galaxy =
    new THREE.Points(
        galaxyGeometry,
        galaxyMaterial
    );

scene.add(galaxy);


// =============================
// 8. MOUSE MOVEMENT
// =============================

let mouseX = 0;
let mouseY = 0;


window.addEventListener(
    "mousemove",
    (event) => {

        mouseX =
            (event.clientX /
                window.innerWidth)
            * 2 - 1;


        mouseY =
            (event.clientY /
                window.innerHeight)
            * 2 - 1;

    }
);


// =============================
// 9. ANIMATION
// =============================

function animate() {

    requestAnimationFrame(
        animate
    );


    // Rotate galaxy
    galaxy.rotation.y += 0.0015;


    // Mouse interaction
    galaxy.rotation.x +=
        (mouseY * 0.15 -
            galaxy.rotation.x)
        * 0.02;


    galaxy.rotation.z +=
        (-mouseX * 0.15 -
            galaxy.rotation.z)
        * 0.02;


    renderer.render(
        scene,
        camera
    );
}


animate();


// =============================
// 10. RESIZE
// =============================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


// =============================
// 11. EXPLORE BUTTON
// =============================

const explore =
    document.getElementById("explore");


explore.addEventListener(
    "click",
    () => {

        alert(
            "Welcome to the Galaxy 🚀"
        );

    }
);