import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { PreventDragClick } from './PrevenDragClick';
import { MySphere } from './MySphere';
import { GridBroadphase, NaiveBroadphase } from 'cannon-es';

// ----- 주제: 랜덤 위치에 공 생기기

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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
    directionalLight.castShadow = true;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// Cannon(물리엔진)
	const cannonWorld = new CANNON.World(); // threejs에서 scene이라고 생각
	cannonWorld.gravity.set(0, -10, 0); // 중력셋팅

	// 성능을 위한 세팅
	cannonWorld.allowSleep = true; // 움직임이 거의 멈춘 body의 테스트를 안하게끔 해주는 속성
	cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld); // 성능좋음
	// NaiveBroadphase // 기본값
	// GridBroadphase // 구역을 나누어 테스트


    // Contact Material
    const defaultMaterial = new CANNON.Material('default');
    const rubberMaterial = new CANNON.Material('rubber'); // 고무
    const ironMaterial = new CANNON.Material('iron'); // 철
    const defaultContactMaterial = new CANNON.ContactMaterial( // 부딪힐 material 넣어줌
        defaultMaterial,
        defaultMaterial,
        {
            friction: 0.3, // 마찰력
            restitution: 0.3, // 반발력 (얼마나 튀길지)
        }
    );
    cannonWorld.defaultContactMaterial = defaultContactMaterial; // cannonWorld의 기본 material로 지정해줌


	// mesh를 물리적으로 컨트롤해 줄 body들을 만듦
	// 바닥
	const floorShape = new CANNON.Plane(); // threejs에서 geometry
	// Body : 물리현장이 적용되어 움직이는 실체
	const floorBody = new CANNON.Body({ 
		mass: 0, // 바닥역할을 해야하므로 중력을 받으면 안됨 mass: 0으로 설정
		position: new CANNON.Vec3(0, 0, 0),
		shape: floorShape ,
        material: defaultMaterial
	});
	floorBody.quaternion.setFromAxisAngle( // quaternion: rotation역할
		new CANNON.Vec3(-1, 0, 0), // 축
		Math.PI / 2
	); 
	cannonWorld.addBody(floorBody);

	// Mesh
	const floorMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(10, 10),
		new THREE.MeshStandardMaterial({
			color: 'slategray'
		})
	);
	floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
	scene.add(floorMesh);

    const spheres = [];
    const sphereGeometry = new THREE.SphereGeometry(0.5);
	const sphereMaterial = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

        let cannonStepTime = 1/60;
		if(delta < 0.01) cannonStepTime = 1/120;
		cannonWorld.step(cannonStepTime, delta, 3); // 화면주사율에 따라 쓰도록 cannonStepTime 지정

        spheres.forEach(item => {
			item.mesh.position.copy(item.cannonBody.position);
			item.mesh.quaternion.copy(item.cannonBody.quaternion);
		});

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

    // 클릭하면 랜덤(위치, 크기)으로 공 생성
    canvas.addEventListener('click', () => {    
        spheres.push(new MySphere({
            scene, // scene: scene (속성과 값이 같은 경우 하나만 적어줘도 됨)
            cannonWorld,
            geometry: sphereGeometry,
            material: sphereMaterial,
            x: (Math.random() - 0.5) * 2, // -1 ~ 1 범위 안에서 랜덤하게 나오도록 지정
            y: Math.random() * 5 + 2, // 조금 위에 뜨도록 기본값 2 가지도록 지정
            z: (Math.random() - 0.5) * 2,
            scale: Math.random() + 0.2 // 최소 0.2
        }));
    });

    const preventDragClick = new PreventDragClick(canvas);


	draw();
}
