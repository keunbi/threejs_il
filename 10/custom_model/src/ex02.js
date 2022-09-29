import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// ----- 주제: glb 파일 불러오기

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.y = 1.5;
	camera.position.z = 4;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// gltf loader
	const gltfLoader = new GLTFLoader();
    let mixer;

	gltfLoader.load(
		'/models/ilbuni.glb',
		gltf => { // glb파일 로더가 끝나면 실행되는 콜백함수  function(gltf){}
			const ilbuniMesh = gltf.scene.children[0];
			scene.add(ilbuniMesh);

            // 애니메이션 주려면 믹서가 필요함
            mixer = new THREE.AnimationMixer(ilbuniMesh);
            // console.log(gltf.animations)
            const actions = [];
            actions[0] = mixer.clipAction(gltf.animations[0]);
            actions[1] = mixer.clipAction(gltf.animations[1]);

            // 애니메이션 옵션
            actions[0].repetitions = 1; // 반복횟수
            actions[0].clampWhenFinished = true; // 애니메이션을 시작한 동작으로 끝내고 싶을 때

            actions[0].play();
            // actions[1].play(); // 점프하는 애니메이션
		}
	);


	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

        if(mixer) mixer.update(delta); // mixer 값이 있다면 실행. mixer 불러오는데 시간이 걸리기 때문에 오류남

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

	draw();
}
