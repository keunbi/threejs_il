import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: OrbitControls

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
	const controls = new OrbitControls(camera, renderer.domElement); // renderer.domElement 는 canvas를 의미함
	controls.enableDamping = true; // 카메라컨트롤 부드럽게 해줌. 계속 실행되는 draw함수 안에 update해줘야 함
	// controls.enableZoom = false; // 줌되는 것 잠글 수 있음
	// 줌 범위를 한정할 수 있음
	// controls.maxDistance = 10;
	// controls.minDistance = 2;

	//수직방향으로 회전하는 각도 한정할 수 있음. 
	// controls.minPolarAngle = Math.PI / 4;
	// controls.minPolarAngle = THREE.MathUtils.degToRad(45);
	// controls.maxPolarAngle = THREE.MathUtils.degToRad(135);

	// 회전 중심점의 타겟을 지정할 수 있음
	// controls.target.set(2, 2, 2);
	
	// 자동으로 회전되도록 지정가능
	// controls.autoRotate = true; 
	// controls.autoRotateSpeed = 50;


	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	let mesh;
	let material;
	for (let i = 0; i < 20; i ++){
		material = new THREE.MeshStandardMaterial({
			// 색상 랜덤하게 처리 (배경색이 어둡기때문에 기본값으로 50 주고 곱해주는 범위를 50을 뺸 205를 곱해줌)
			color : `rgb(   
				${ 50 + Math.floor(Math.random() * 205) }, 
				${ 50 + Math.floor(Math.random() * 205) }, 
				${ 50 + Math.floor(Math.random() * 205) }
			)`
		});
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = (Math.random() - 0.5) * 5;
		mesh.position.y = (Math.random() - 0.5) * 5;
		mesh.position.z = (Math.random() - 0.5) * 5;
		scene.add(mesh)
	}


	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		controls.update();

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
