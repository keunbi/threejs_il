import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PreventDragClick } from './PrevenDragClick';

// ----- 주제: 클릭한 Mesh 선택하기

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
    const mouse = new THREE.Vector2(); // 2차원 위치 (마우스는 어디를 클릭했는지 2차원 좌표로 나타낼 수 있기 때문)


	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		//const delta = clock.getDelta();
		const time = clock.getElapsedTime(); // 경과시간

		// boxMesh.position.y = Math.sin(time) * 2;
		// torusMesh.position.y = Math.cos(time) * 2;
		boxMesh.material.color.set('plum');
		torusMesh.material.color.set('lime');

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

    function checkIntersects(){
        if(preventDragClick.mouseMoved) return; // true라면 마우스 5픽셀 이상 움직인것이니까 종료시킴

        raycaster.setFromCamera(mouse, camera); // 카메라위치를 origin으로 잡고 마우스로 클릭한 부분으로 광선을 생성

        const intersects = raycaster.intersectObjects(meshes);

        // intersects안을 돌면서 item이라는 이름으로 세팅하고 원소마다 반복함
        for(const item of intersects){
            console.log(item.object.name); // 광선 관통하는 mesh 이름 콘솔찍어봄
            break; // mesh가 겹쳐도 첫번째 관통하는 mesh만 찍힘
        }


        // if(intersects[0]){
        //     console.log(intersects[0].object.name); 해줘도 동일함
        // }
        
    }

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);
    canvas.addEventListener('click', e => {
        mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
        mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1); // threejs에서는 위쪽이 +이므로 해당식에 - 붙여줌
        // console.log(mouse);
        checkIntersects();
    });

    // 클래스의 인스턴스 객체 만들어줌
    const preventDragClick = new PreventDragClick(canvas);


	draw();
}
