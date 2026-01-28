import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function initGlobe() {
    return {
        initializeComponent() {
            const container = document.getElementById("globe");
            // container.style.marginTop = '-10rem';
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            let windowWidthDiv = 2;
            
            const width = container.parentElement.getBoundingClientRect().width;
            const height = container.parentElement.parentElement.children[0].getBoundingClientRect().height;

            if (window.innerWidth < 1024) {
                const computedStyle = window.getComputedStyle(container.parentElement.parentElement);

                // Access specific style properties
                const parentPadLeftcontainer = computedStyle.getPropertyValue("padding-left");
                container.style.marginLeft = `-${parentPadLeftcontainer}`;
                windowWidthDiv = 1;
            } else {
                container.style.marginLeft = '0rem';
            }
            renderer.setSize(window.innerWidth / windowWidthDiv, height);
            // renderer.setSize(windowWidth, window.innerHeight / 1);

            // container.style.margin = '0 auto';
            renderer.setClearColor(0x000000, 0);
            if (!container) return;
            container.appendChild(renderer.domElement);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                75,
                (window.innerWidth / windowWidthDiv) / 3 / height, // window.innerWidth / 3 / window.innerHeight,
                0.1,
                1000,
            ); // fov defualt val is 75

            //camera.position.y =+ 100;
            // const axesHelper = new THREE.AxesHelper(5);
            // scene.add(axesHelper);

            // camera.position.set(0, 0, 0.18);
            camera.position.set(0, 0.22, 0.41);
            //camera.rotateY(-0);
            renderer.render(scene, camera);
            // Set camera position
            //camera.position.z = 0

            //const loader = new THREE.TextureLoader();

            // Set up the renderer
            //renderer.setSize(window.innerWidth, window.innerHeight);

            // Create a sphere (the globe)
            //const geometry = new THREE.SphereGeometry(1, 32, 32);
            //const texture = loader.load("/img/texture/4K-aluminium_foil_1_ao.png"); // Adjust the path as needed
            //const material = new THREE.MeshBasicMaterial({ map: texture });
            //const globe = new THREE.Mesh(geometry, material);
            //scene.add(globe);

            // const ambientLight = new THREE.AmbientLight(0xffffff, 100);

            // scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(0, 1, 0.5);
            scene.add(directionalLight);




            // ---- plane
            //   const planeGeo = new THREE.PlaneGeometry(2, 2)
            //   const textureLoader = new THREE.TextureLoader();

            //   textureLoader.load('/img/illustrations/plate.svg', (loadedTexture) => {
            //     //loadedTexture.offse.set(100, 100 );
            //     const planeMaterial = new THREE.MeshBasicMaterial({  map: loadedTexture });
            //     // Create your mesh and add it to the scene here, if needed

            //     const plane = new THREE.Mesh(planeGeo, planeMaterial);
            //     scene.add(plane);
            //     plane.rotation.x = 1.6 * Math.PI;
            //     plane.rotation.z = 0.5;
            //     plane.rotation.y = 0.09;
            //     plane.translateX(-0.5)
            //     plane.translateY(0.5)
            //     plane.translateY(-0.2)
            // });

            //plane.rotation.x = -7.7;

            //plane.rotation.y =- 1;

            // const light = new THREE.PointLight( 0xffffff, 1, 100 );
            // light.position.set( 0, 0, 0 );
            // scene.add( light );

            // const gridHelper = new THREE.GridHelper(30);
            // scene.add(gridHelper);








            const gltfLoader = new GLTFLoader();

            // video stuffs:
            let video = document.getElementById("video");
            video.src = "https://lovespread-website.s3.ca-central-1.amazonaws.com/media.mov?"+Math.random()
            let videoTexture = new THREE.VideoTexture(video);  
            // let videoTexture = new THREE.VideoTexture(video);  


            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
           // videoTexture.format = THREE.RGBFormat;

            let movieMaterial = new THREE.MeshBasicMaterial({
                map: videoTexture,
                side: THREE.FrontSide,
                toneMapped: false,
            })

            let group;
            let model;
            let mixer;
            let screen;
            gltfLoader.load("/models/iphone_12_pro.glb", (gltf) => {

                model = gltf.scene;
                const modelBaseWidth = window.innerWidth / windowWidthDiv;
                // model.scale.set(0.00180, 0.0024, 0.0004);
                model.scale.set(modelBaseWidth - (modelBaseWidth/1.0000013), height - (height/1.0000048), 0.0004);
                // Calculate the desired scale based on window size
                const desiredWidth = 2000; // Set your desired width for the model in scene units
                // const windowWidth = window.innerWidth;

                // Calculate the scale factor to fit the model within the desired width
                // const scaleFactor = width / desiredWidth;
                // model.scale.multiplyScalar(scaleFactor);
               
                model.children[0].children[0].children[0].children[0].children.find(itm => itm.name === "iPhone12_Pro").children.find(itm => itm.name === 'Screen').children[0].material = movieMaterial;


                model.position.set(0, 0.12, 0)
                model.rotateX(-0.4)
                group = new THREE.Group();
                
                group.add(model)
                
                scene.add(group)

                //group.position.set(-0.02, 0, 0)
                // scene.add(model);
                //model.position.sub(center);
            });
            
            let modelLoading;
            gltfLoader.load("/models/revolving_round_phone.glb", (gltf) => {

                modelLoading = gltf.scene;
                modelLoading.scale.set(0.09, 0.1, 0.04);
                
                //modelLoading.children[0].children[0].children[0].children[0].children[0].children.find(itm => itm.name ==="group50").children.find(itm => itm.name === 'group48').visible = false

                modelLoading.position.set(0, 0.1, 0)
                // group = new THREE.Group();
                
                // group.add(model)
                //modelLoading.rotateX(+0.4)
                scene.add(modelLoading)
                
                modelLoading.traverse((node) => {
                    if (node.isMesh) node.castShadow = true
                })

                mixer = new THREE.AnimationMixer(modelLoading);
                const clips = gltf.animations;
                clips.forEach(clip => mixer.clipAction(clip).play())
                // const action = mixer.clipAction(clips[0]);
                // action.play();
            }, undefined, (error) => {
                // Error callback
                console.error('gltf error', error);
            });


            

            // const geom = new THREE.BoxGeometry(100, 100, 100);
            // let movieCubeScreen = new THREE.Mesh(geom, movieMaterial)
            // movieCubeScreen.position.set(0, 50, 0)
            // scene.add(movieCubeScreen);
            //camera.position.set(0, 150, 300);
            //camera.lookAt(model.position)

            // Animation
            const clock = new THREE.Clock();
            const rotateUpLimit = -0.03998933418663425;
            const rotateDownLimit = -0.3894183423086505;
            let rotateSign = +1;

            const translateUpLimit = 3.47958060034832;
            const translateDownLimit = 2;
            let translateSign = +1;

            let xPos = 2;
            let xCounter = 0;
            let rotateCounter = 0; 
            let upNDownSign = -1;
            const animate = () => {
                requestAnimationFrame(animate);

                renderer.setClearColor(0x000000, 0);
                // const qt = camera.quaternion;
                // const camZPos = camera.position.z;
                // if (qt._y > rotateUpLimit) {
                //     rotateSign = -1;
                // }
                // if (qt._y < rotateDownLimit) {
                //     rotateSign = +1;
                // }

                // if (camZPos > translateUpLimit) {
                //     translateSign = -1;
                // }
                // if (camZPos < translateDownLimit) {
                //     translateSign = +1;
                // }

                
                if (model && xPos > 0) {
                    
                    xPos = xPos - 0.02;
                    model.position.x = xPos
                    ++xCounter;
                }

                if (group && xCounter === 100)  {
                    if (rotateCounter < 48) {
                        group.rotation.y += Math.PI / 24;
                        ++rotateCounter;
                    }
                    if (rotateCounter === 48) {
                        
                        //video.muted = false;
                        video.play();
                        ++rotateCounter;
                    }
                    if (48 < rotateCounter && rotateCounter < 59) {
                        model.rotateX(+0.04)
                        group.translateY(+0.01);
                        ++rotateCounter;
                    } 
                    if (58 < rotateCounter) {
                        group.translateY(0.00009 * upNDownSign);
                        ++rotateCounter;
                    }
                    if (rotateCounter === 150) {
                        rotateCounter = 59
                        upNDownSign = upNDownSign * -1;
                    }
                    
                }

                // camera.rotateY(+0.0007 * rotateSign);
                // camera.translateZ(+0.001 * translateSign);

                // if (mixer) mixer.update(clock.getDelta() * 0.7);
                // if (group) {
                //    group.rotation.y += Math.PI / 28;
                // }
                    //model.rotateY(0.05)
                if (mixer) mixer.update(clock.getDelta() * 0.7)
                videoTexture.needsUpdate = true;
                renderer.render(scene, camera);
            };

            // Handle window resizing
            window.addEventListener("resize", () => {
                let newWidth = window.innerWidth / 2;
                let newHeight = window.innerHeight;
                if (window.innerWidth < 1024) {
                    newWidth = window.innerWidth
                }
                // camera.aspect = newWidth / newHeight;
                // camera.updateProjectionMatrix();
                //model.scale.set(newWidth / 18000, newHeight / 12000, 0.04);
                if (window.innerWidth < 1024) {
                    windowWidthDiv = 2;
                    
                }
                renderer.setSize(window.innerWidth / windowWidthDiv, newHeight);
                

                // Calculate the scale factor to fit the model within the desired width
                // const scaleFactor = newWidth / desiredWidth;
                // model.scale.multiplyScalar(scaleFactor);

              // renderer.setSize(newWidth, newHeight);
               
            });
            
            // Start the animation
            animate();
            
        },
    };
}