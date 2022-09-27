import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 여러가지 텍스쳐가 적용된 큐브

export default function example() { 
    // LoadingManager는 필수는 아니지만 여러개의 이미지 로드할때 편리함
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = () => {
        console.log('로드시작');
    };
    // 이미지가 하나하나 로드될 때 발생
    loadingManager.onProgress = img => {
        console.log(img + '로드');
    };
    loadingManager.onLoad = () => {
        console.log('로드완료');
    };
    loadingManager.onError = () => {
        console.log('에러');
    }

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const rightTexture= textureLoader.load('/textures/mcstyle/right.png');
    const leftTexture= textureLoader.load('/textures/mcstyle/left.png');
    const topTexture= textureLoader.load('/textures/mcstyle/top.png');
    const bottomTexture= textureLoader.load('/textures/mcstyle/bottom.png');
    const frontTexture= textureLoader.load('/textures/mcstyle/front.png');
    const backTexture= textureLoader.load('/textures/mcstyle/back.png');

    // materials로 배열을 만들어 mesh를 만들 때 material 자리에 넣어줌
    const materials = [
        new THREE.MeshBasicMaterial({ map: rightTexture }),
        new THREE.MeshBasicMaterial({ map: leftTexture }),
        new THREE.MeshBasicMaterial({ map: topTexture }),
        new THREE.MeshBasicMaterial({ map: bottomTexture }),
        new THREE.MeshBasicMaterial({ map: frontTexture }),
        new THREE.MeshBasicMaterial({ map: backTexture })
    ];

    // 작은 픽셀의 텍스쳐를 살려서 작업할 경우 아래의 작업을 해줘야 함
    rightTexture.magFilter = THREE.NearestFilter;
    leftTexture.magFilter = THREE.NearestFilter;
    topTexture.magFilter = THREE.NearestFilter;
    bottomTexture.magFilter = THREE.NearestFilter;
    frontTexture.magFilter = THREE.NearestFilter;
    backTexture.magFilter = THREE.NearestFilter;
    

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
    scene.background = new THREE.Color('white');

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
	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.set(1, 1, 2);
	scene.add(ambientLight, directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);
	

	// Mesh
	const geometry = new THREE.BoxGeometry(2, 2, 2);
	const mesh = new THREE.Mesh(geometry, materials);
	scene.add(mesh);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

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
