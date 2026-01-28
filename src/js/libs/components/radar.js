import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function initRadar() {
    return {
        initializeComponent() {
            const container = document.getElementById("radar");
            container.style.marginTop = '-10rem';
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            const windowWidth = window.innerWidth;
            renderer.setSize(windowWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);
            if (!container) return;
            container.appendChild(renderer.domElement);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / 3 / window.innerHeight,
                0.1,
                1000,
            ); // fov defualt val is 75

            camera.position.set(0, 0.22, 1);
            //camera.position.set(0, 2, 5);
            camera.lookAt(0, 0, 0);
            //camera.rotateY(-0);
            renderer.render(scene, camera);


            const directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(0, 1, 0.5);
            scene.add(directionalLight);






            const gltfLoader = new GLTFLoader();





            
            let modelLoading;
            let mixer;
            gltfLoader.load("/models/looking_glass_hologram.glb", (gltf) => {

                modelLoading = gltf.scene;
                modelLoading.scale.set(0.09, 0.2, 0.04);
                
                modelLoading.children[0].children[0].children[0].children[0].children[0].children.find(itm => itm.name ==="group50").children.find(itm => itm.name === 'group48').visible = false

                modelLoading.position.set(0, 0.1, 0)
                // group = new THREE.Group();
                
                // group.add(model)
                //modelLoading.rotateX(+0.4)

                mixer = new THREE.AnimationMixer(modelLoading);
                var animations = gltf.animations;

                // Add each animation to the mixer
                if (animations && animations.length > 0) {
                    animations.forEach((clip) => {
                        mixer.clipAction(clip).play(); // Play each animation clip
                    });
                }
                scene.add(modelLoading)
                
                modelLoading.traverse((node) => {
                    if (node.isMesh) node.castShadow = true
                })
            }, undefined, (error) => {
                // Error callback
                console.error('gltf error', error);
            });

            // Animation
            var clock = new THREE.Clock();
            
            var camRotationSpeed = 0.0000000000000000005; // Adjust the rotation speed as needed
            const animate = () => {
                
                renderer.setClearColor(0x000000, 0);


                
                    // var delta = clock.getDelta() /0.00005;                
      
                    // camera.translateX(Math.cos(camRotationSpeed) * 0.2);
                    // camera.translateZ(Math.sin(camRotationSpeed) * 0.2);
                // camera.translateX(0.02)
                // camera.translateZ(0.02)
                if (modelLoading) {
                    camera.lookAt(modelLoading.position);
                }
                

                if (mixer) mixer.update(0.01); // Update the animation mixer
                //videoTexture.needsUpdate = true;
                
                
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            };

            // Handle window resizing
            window.addEventListener("resize", () => {
                let newWidth = window.innerWidth / 2;
                let newHeight = window.innerHeight;
                if (window.innerWidth < 1024) {
                    newWidth = window.innerWidth
                }
               renderer.setSize(newWidth, newHeight);
               
            });
            
            // Start the animation
            animate();
            
        },
    };
}