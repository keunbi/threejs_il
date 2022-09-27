import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import dat from 'dat.gui';

// ----- 주제: Light와 Shadow

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

    // 그림자 설정
    renderer.shadowMap.enabled = true; // 조명과 각각의 물체에서도 설정해줘야 함
    // renderer.shadowMap.type = THREE.PCFShadowMap; // 기본값
    // renderer.shadowMap.type = THREE.BasicShadowMap; // 픽셀처럼 끊어지는 효과. shadow.mapSize.width로 픽셀크기 조정가능
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // PCFShadowMap 기본과 비슷하지만 좀 더 부드러움
    
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
	// AmbientLight : 전체적으로 은은하게 깔아주는 베이스, 그림자 등 없이 단색으로 표현됨
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const light = new THREE.DirectionalLight('red', 0.5);
	light.position.y = 3;
	scene.add(light);

	const lightHelper = new THREE.DirectionalLightHelper(light);
	scene.add(lightHelper);

    // 그림자 설정
    light.castShadow = true; // 그림자를 만들 수 있는 빛이 됨
    // 그림자가 깨지는것 선명해지도록 조정. 512가 기본. 1024,2048을 많이 사용
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    // 그림자 범위 지정해줄 수 있음 (범위 벗어나면 잘려서 안나옴)
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 10;


    // light.shadow.mapSize.width = 64;
    // light.shadow.mapSize.height = 64;

    // 그림자 부드럽게 퍼지도록. PCFShadowMap 기본에만 적용됨
    // light.shadow.radius = 5;


	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// Geometry
	const planeGeoetry = new THREE.PlaneGeometry(10, 10);
	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16)

	// Material
	const material1 = new THREE.MeshStandardMaterial({ color: 'white' });
	const material2 = new THREE.MeshStandardMaterial({ color: 'royalblue' });
	const material3 = new THREE.MeshStandardMaterial({ color: 'gold' });

	// Mesh
	const plane = new THREE.Mesh(planeGeoetry, material1);
	const box = new THREE.Mesh(boxGeometry, material2);
	const sphere = new THREE.Mesh(sphereGeometry, material3);

	plane.rotation.x = -Math.PI * 0.5; // -90도 돌려서 바닥으로 눕혀줌
	box.position.set(1, 1, 0);
	sphere.position.set(-1, 1, 0);

    // 그림자 설정
    plane.receiveShadow = true; // plane에 영향을 받아 어디 그림자가 생기지 않고 바닥역할을 하므로 castShadow 지정안함
    box.castShadow = true;
    box.receiveShadow = true;
    sphere.castShadow = true;
    sphere.receiveShadow = true;

	scene.add(plane, box, sphere);

	// AxesHelper
	const axesHelper = new THREE.AxesHelper(3);
	scene.add(axesHelper);

	// Dat GUI
	const gui = new dat.GUI();
	// gui.add(camera.position, 'x', -5, 5, 0.1).name('카메라 X');
	gui.add(light.position, 'x', -5, 5);
	gui.add(light.position, 'y', -5, 5);
	gui.add(light.position, 'z', -5, 5);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		// const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // light.position.x = Math.cos(time);
        // light.position.z = Math.sin(time);

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
