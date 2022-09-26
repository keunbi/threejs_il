import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

// ----- 주제: FlyControls

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
    // wasd / qe / rf / 마우스클릭으로 방향키처럼 이동
    // 마우스위치에 따라 서서히 움직이고 있음
    // 함수 실행 안의 controls.update(delta); 업데이트 안에 delta값 넣어줘야함
	const controls = new FlyControls(camera, renderer.domElement);
    // controls.rollSpeed = 0.5; // 마우스위치에 따라 서서히 움직이는 속도 빨라짐
    // controls.movementSpeed = 3; // 움직이는 속도 빨라짐
    // controls.dragToLook = true; 마우스 위치에 따라 움직이지 않고 드래그해야 움직임

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

        controls.update(delta);

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
