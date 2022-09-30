import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es'

// ----- 주제: cannon.js 기본 세팅

// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

// npm i cannon-es 설치

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

	// Cannon(물리엔진)
	const cannonWorld = new CANNON.World(); // threejs에서 scene이라고 생각
	cannonWorld.gravity.set(0, -10, 0); // 중력셋팅

	// mesh를 물리적으로 컨트롤해 줄 body들을 만듦
	// 바닥
	const floorShape = new CANNON.Plane(); // threejs에서 geometry
	// Body : 물리현장이 적용되어 움직이는 실체
	const floorBody = new CANNON.Body({ 
		mass: 0, // 바닥역할을 해야하므로 중력을 받으면 안됨 mass: 0으로 설정
		position: new CANNON.Vec3(0, 0, 0),
		shape: floorShape 
	});
	floorBody.quaternion.setFromAxisAngle( // quaternion: rotation역할
		new CANNON.Vec3(-1, 0, 0), // 축
		Math.PI / 2
	); 
	cannonWorld.addBody(floorBody);

	// 박스
	const boxShape = new CANNON.Box(new CANNON.Vec3(0.25, 2.5, 0.25)); // (중심으로 얼만큼씩 갈껀지 지정)
	const boxBody = new CANNON.Body({
		mass: 1,
		position: new CANNON.Vec3(0, 10, 0),
		shape: boxShape
	})
	cannonWorld.addBody(boxBody);

	
	// Mesh
	const floorMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(10, 10),
		new THREE.MeshStandardMaterial({
			color: 'slategray'
		})
	);
	floorMesh.rotation.x = -Math.PI / 2;
	scene.add(floorMesh);

	const boxGeometry = new THREE.BoxGeometry(0.5, 5, 0.5);
	const boxMaterial = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.position.y = 0.5;
	scene.add(boxMesh);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		let cannonStepTime = 1/60;
		if(delta < 0.01) cannonStepTime = 1/120;
		cannonWorld.step(cannonStepTime, delta, 3); 
		// step 메소드로 시간단계 설정
		// (고정된 시간단위, 시간차, 잠재적으로 지연되었을 떄 간격을 매우는 횟수 임의로 지정)
		// 화면주사율에 따라 쓰도록 cannonStepTime 지정

		boxMesh.position.copy(boxBody.position); // 위치
		boxMesh.quaternion.copy(boxBody.quaternion) // 회전

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
