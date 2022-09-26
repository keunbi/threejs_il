import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

// ----- 주제: DragControls

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



	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
    const meshes = [];
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
        mesh.name = `box-${i}`; // 박스에 이름 정해줌
		scene.add(mesh);

        meshes.push(mesh);
	}


    // Controls
    // mesh 드래그로 컨트롤 가능
    // meshes 배열이 완성 된 후 실행해야하므로 meshes 배열 아래에 넣어줌
	const controls = new DragControls(meshes, camera, renderer.domElement);

    // 드래그가 시작될 때 자동으로 어떠한 오브젝트가 매개변수에 들어옴 => 어떤 오브젝트를 드래그했는지 알 수 있음
    controls.addEventListener('dragstart', e => {
        console.log(e.object.name);
    });


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
