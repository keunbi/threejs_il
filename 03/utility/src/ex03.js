import * as THREE from 'three';
import dat from 'dat.gui';

// ----- 주제: GUI 컨트롤
// npm i dat.gui 로 설치

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
	camera.position.y = 1;
	camera.position.z = 5;
	scene.add(camera);
	
	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight); // 전체적으로 밝아지게 조명 넣어줌

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);


	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);


    // Dat GUI
    const gui = new dat.GUI();
    gui.add(mesh.position, 'y', -5, 5, 0.01).name('큐브 Y'); // (조정하고싶은 속성을 가진 오브젝트를 넣어줌, 변경하고 싶은 값, 최소값, 최대값, 얼만큼씩 조정할지)
    gui.add(camera.position, 'x', -10, 10, 1).name('카메라 X');

    // 개행해서도 표현가능
    // gui
    //     .add(mesh.position, 'z')
    //     .min(-10)
    //     .max(3)
    //     .step(0.01)
    //     .name('메쉬의 Z 위치');

    camera.lookAt(mesh.position);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const time = clock.getElapsedTime();

		mesh.rotation.y = time;

        camera.lookAt(mesh.position);

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
