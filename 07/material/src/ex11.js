import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: MeshNormalMaterial (법선에 관련된 material)

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
    const gradientTex = textureLoader.load('/textures/gradient.png');

    // 아래 material 속성에서 추가한 gradientMap을 만화같은 효과로 적용하기 위해 넣어줌
    gradientTex.magFilter = THREE.NearestFilter;


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
	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.set(1, 1, 2);
	scene.add(ambientLight, directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	

	// Mesh
    const geometry = new THREE.BoxGeometry(2, 2, 2); 
    // MeshNormalMaterial : 법선의 방향에 따라 rgb 색으로 표현
    const material = new THREE.MeshNormalMaterial({
        
    });
    const mesh = new THREE.Mesh(geometry, material);
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
