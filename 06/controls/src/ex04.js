import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

// ----- 주제: FirstPersonControls

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
    // FlyControls와 비슷. 기능을 추가하거나 수정해서 다시 만든 버전
	const controls = new FirstPersonControls(camera, renderer.domElement);
    // controls.movementSpeed = 10; 움직이는 속도조절
    // controls.activeLook = false; 마우스 위치에 따라 서서히 움직이는 것 제어
    // controls.lookSpeed = 0.1;

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
