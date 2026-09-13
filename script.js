import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ================================
// SCENE
// ================================

const scene = new THREE.Scene();


// ================================
// CAMERA
// ================================

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 2, 9);


// ================================
// RENDERER
// ================================

const canvas = document.getElementById("galaxy");

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);


// ================================
// GALAXY
// ================================

const starCount = 18000;

const positions = new Float32Array(
    starCount * 3
);

const colors = new Float32Array(
    starCount * 3
);

const galaxyColors = [
    new THREE.Color("#ffffff"),
    new THREE.Color("#9d8cff"),
    new THREE.Color("#6ea8ff"),
    new THREE.Color("#ffd6ff")
];


// Create spiral arms

for (let i = 0; i < starCount; i++) {

    const radius =
        Math.pow(Math.random(), 0.55) * 7;

    // Four spiral arms
    const arm =
        i % 4;

    const armAngle =
        (arm / 4) * Math.PI * 2;

    const spiral =
        radius * 1.25;

    const angle =
        armAngle +
        spiral +
        (Math.random() - 0.5) *
        0.55;


    // Add depth
    const spread =
        0.35 *
        (1 - radius / 8);


    const x =
        Math.cos(angle) * radius +
        (Math.random() - 0.5) * spread;

    const y =
        (Math.random() - 0.5) *
        spread;

    const z =
        Math.sin(angle) * radius +
        (Math.random() - 0.5) * spread;


    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;


    // Star colour
    const color =
        galaxyColors[
            Math.floor(
                Math.random() *
                galaxyColors.length
            )
        ];

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
}


// ================================
// STAR GEOMETRY
// ================================

const geometry =
    new THREE.BufferGeometry();

geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        positions,
        3
    )
);

geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(
        colors,
        3
    )
);


// ================================
// STAR MATERIAL
// ================================

const material =
    new THREE.PointsMaterial({

        size: 0.035,

        vertexColors: true,

        transparent: true,

        opacity: 0.9,

        depthWrite: false,

        blending:
            THREE.AdditiveBlending

    });


// ================================
// GALAXY OBJECT
// ================================

const galaxy =
    new THREE.Points(
        geometry,
        material
    );

scene.add(galaxy);


// ================================
// GLOWING CORE
// ================================

const coreGeometry =
    new THREE.SphereGeometry(
        0.7,
        32,
        32
    );

const coreMaterial =
    new THREE.MeshBasicMaterial({
        color: "#fff1ff"
    });

const core =
    new THREE.Mesh(
        coreGeometry,
        coreMaterial
    );

scene.add(core);


// ================================
// CORE LIGHT
// ================================

const coreLight =
    new THREE.PointLight(
        "#bda8ff",
        25,
        10
    );

scene.add(coreLight);


// ================================
// EXTRA BACKGROUND STARS
// ================================

const backgroundCount = 3000;

const backgroundPositions =
    new Float32Array(
        backgroundCount * 3
    );

for (
    let i = 0;
    i < backgroundCount;
    i++
) {

    backgroundPositions[i * 3] =
        (Math.random() - 0.5) * 40;

    backgroundPositions[i * 3 + 1] =
        (Math.random() - 0.5) * 40;

    backgroundPositions[i * 3 + 2] =
        (Math.random() - 0.5) * 40;
}


const backgroundGeometry =
    new THREE.BufferGeometry();

backgroundGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        backgroundPositions,
        3
    )
);


const backgroundMaterial =
    new THREE.PointsMaterial({

        color: "#ffffff",

        size: 0.015,

        transparent: true,

        opacity: 0.7

    });


const backgroundStars =
    new THREE.Points(
        backgroundGeometry,
        backgroundMaterial
    );

scene.add(backgroundStars);


// ================================
// MOUSE / TOUCH
// ================================

let mouseX = 0;
let mouseY = 0;

window.addEventListener(
    "mousemove",
    (event) => {

        mouseX =
            (event.clientX /
                window.innerWidth) * 2 - 1;

        mouseY =
            (event.clientY /
                window.innerHeight) * 2 - 1;

    }
);


// Mobile touch

window.addEventListener(
    "touchmove",
    (event) => {

        if (!event.touches[0]) return;

        mouseX =
            (event.touches[0].clientX /
                window.innerWidth) * 2 - 1;

        mouseY =
            (event.touches[0].clientY /
                window.innerHeight) * 2 - 1;

    }
);


// ================================
// EXPLORE BUTTON
// ================================

const button =
    document.getElementById("explore");

button.addEventListener(
    "click",
    () => {

        camera.position.z = 5;

        button.innerText =
            "ENTERING GALAXY ✦";

        setTimeout(() => {

            button.innerText =
                "EXPLORE GALAXY →";

        }, 2000);

    }
);


// ================================
// ANIMATION
// ================================

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );

    const time =
        clock.getElapsedTime();


    // Galaxy rotation
    galaxy.rotation.y =
        time * 0.08;


    // Background rotation
    backgroundStars.rotation.y =
        time * 0.01;


    // Floating core
    core.scale.setScalar(
        1 +
        Math.sin(time * 2) * 0.08
    );


    // Camera movement
    camera.position.x +=
        (mouseX * 1.2 -
            camera.position.x) *
        0.025;

    camera.position.y +=
        (-mouseY * 0.8 + 2 -
            camera.position.y) *
        0.025;


    camera.lookAt(
        0,
        0,
        0
    );


    renderer.render(
        scene,
        camera
    );
}

animate();


// ================================
// RESIZE
// ================================

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
        

    