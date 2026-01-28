import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function initLogo() {
    return {
        initializeComponent(id) {
            const container = document.getElementById(id);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            const windowWidth = window.innerWidth / 2;
            let widthDiv = 18

            const width = container.parentElement.getBoundingClientRect().width;
            const height = container.parentElement.parentElement.children[0].getBoundingClientRect().height;

            // renderer.setSize(windowWidth/widthDiv, window.innerHeight/9);
            renderer.setSize(width - (width/3), height * 1.8);
            renderer.setClearColor(0x000000, 0);
            renderer.domElement.style.margin = '0 auto';
            if (!container) return;
            container.appendChild(renderer.domElement);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                75,
                width / 3 / height,
                0.1,
                1000,
            ); // fov defualt val is 75
            camera.position.set(0, 0, 0.31);
            renderer.render(scene, camera);

            // if (window.innerWidth < 850) {
            //     widthDiv = 10

            //     const newHeight = window.innerHeight/ 9;
            //     //camera.position.set(0, 0, 0.41);
            //     camera.aspect = width / newHeight;
            //     camera.updateProjectionMatrix();
            //     renderer.setSize(width, newHeight);
            // }
            const ambientLight = new THREE.AmbientLight(0xffffff, 1);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1, 1, 0);
            scene.add(directionalLight);

            // const light = new THREE.PointLight( 0xffffff, 1, 100 );
            // light.position.set( 0, 0, 0 );
            // scene.add( light );

            // const gridHelper = new THREE.GridHelper(30);
            // scene.add(gridHelper);

            let model;
            const gltfLoader = new GLTFLoader();
            const customMaterial = new THREE.ShaderMaterial({
                /** shader config (color, time , vertex, fragment) */
                uniforms: {
                    time: { value: 0.0 }, /**  animation config */
                    color: { value: new THREE.Color(0xa20768) }, // Set the color (red in this example)
                },
                vertexShader: `
                    void main() {
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color;
                    uniform float time;

                    void main() {
                        /**  Calculate a pulsating color using a sine function 
                         *     (I've used Sine function, cause as numbers in dimension X change, dimension Y will bounce between 2 specific values.) 
                         *   Note: In fact changing in color (bounce between 2 different spectrum) will sound like it's glowing
                        */
                        vec3 pulsatingColor = color * (1.0 + 0.2 * sin(time));
                        gl_FragColor = vec4(pulsatingColor, 1.0);
                    }
                `,
            });
            gltfLoader.load("/models/logo.gltf", (gltf) => {
                model = gltf.scene;
                model.scale.set(0.050, 0.06, 0.04);
                model.rotateX(0.5)

                // grab the centre part (heart of the hear or logo) and add shader to it
                const center = model.children.find(itm => itm.name === 'centre')
                if (center) {
                    center.material = customMaterial;
                }

                scene.add(model)
            });
            
            let rotCounter = 0
            let rotDir = +1; 
            const animate = () => {
                requestAnimationFrame(animate);
    
                renderer.setClearColor(0x000000, 0);
                rotCounter = rotCounter + 1;
                if(rotCounter > 500) {
                    rotCounter = 0;
                    rotDir = rotDir * -1;
                }
                if (model) model.rotateY(rotDir * 0.002)
                customMaterial.uniforms.time.value += 0.04; // animate the shader

                renderer.render(scene, camera);
            };

            // Handle window resizing
            // window.addEventListener("resize", (e) => {
                // if (window.innerWidth < 850) {
                //     widthDiv = 15
                // } else {
                //     widthDiv = 20
                // }
                // const newWidth = window.innerWidth / widthDiv;
                // const newHeight = window.innerHeight/ 9;

                // camera.aspect = newWidth / newHeight;
                // camera.updateProjectionMatrix();

                //renderer.setSize(width - (width/2.2), height * 1.8);
            // });
            
            // Start the animation
            animate();
            
        }
    };
}