import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 특정 방향의 광선(Ray)에 맞은 Mesh 판별하기

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
	camera.position.x = 5;
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

	// Mesh

	// 광선 안보이기 때문에 시각적으로 보기 위해 선 만들어줌
	const lineMaterial = new THREE.LineBasicMaterial({ color: 'yellow' }); 
	const points = []; // 점 두개의 위치를 담을 배열
	points.push(new THREE.Vector3(0, 0, 100));
	points.push(new THREE.Vector3(0, 0, -100));
	const lineGeomerty = new THREE.BufferGeometry().setFromPoints(points); // points배열에 담은 위치 기반으로 BufferGeomety 생성됨
	const guide = new THREE.Line(lineGeomerty, lineMaterial);
	scene.add(guide);


	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const boxMaterial = new THREE.MeshStandardMaterial({ color: 'plum' });
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.name = 'box';

	const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
	const torusMaterial = new THREE.MeshStandardMaterial({ color: 'lime' });
	const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
	torusMesh.name = 'torus';

	scene.add(boxMesh, torusMesh);
	
	const meshes = [boxMesh, torusMesh];

	const raycaster = new THREE.Raycaster();



	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		//const delta = clock.getDelta();
		const time = clock.getElapsedTime(); // 경과시간

		boxMesh.position.y = Math.sin(time) * 2;
		torusMesh.position.y = Math.cos(time) * 2;
		boxMesh.material.color.set('plum');
		torusMesh.material.color.set('lime');
		

		const origin = new THREE.Vector3(0, 0, 100); // 광선을 쏘는 출발점
		const direction = new THREE.Vector3(0, 0, -1); // 광선을 쏘는 방향

		// const direction = new THREE.Vector3(0, 0, -100); 방향을 -100으로 하고싶으면
		// direction.normalize(); 로 정교화 해줘야함

 		raycaster.set(origin, direction);

		// 배열에 있는 mesh들이 광선에 맞았는지 체크
		// console.log(raycaster.intersectObjects(meshes));
		// 현재 사각형만 맞았는데 2개로 나오는 이유는 면이 두개이기 때문 (앞,뒷면)

		const intersects = raycaster.intersectObjects(meshes);
		intersects.forEach(item => {
			// console.log(item.object.name); // 어떤 mesh가 맞았는지 이름 넣어 확인
			item.object.material.color.set('red'); // 맞은 mesh 색상 변경
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

	draw();
}
