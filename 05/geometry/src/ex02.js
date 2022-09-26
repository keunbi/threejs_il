import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: Geometry 기본

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
	camera.position.z = 10;
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
	const geometry = new THREE.SphereGeometry(5, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        color: 'orangered',
        side: THREE.DoubleSide,
        flatShading: true, // 표면 각지도록
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // console.log(geometry.attributes.position); // 각 점들의 x,y,z 좌표의 값들 (x,y,z 좌표들이 모두 나열됨)
    const positionArray = geometry.attributes.position.array;
	const randomArray = []; // 각각의 점들에 적용할 랜덤값
    for (let i = 0; i < positionArray.length; i += 3){  // for문으로 position.array 값에 접근
        // 정점(Vertex) 한 개의 x,y,z 좌표를 랜덤으로 조정
        // for 루프 한번에 점 한개의 (x,y,z)가 한 번에 변해야 함 -> i가 0일때와 3의 배수일때 실행되도록 하면 됨 (i, i+1, i+2)
        
        //positionArray[i] = positionArray[i] + (Math.random() - 0.5);
        // 원래위치에 더해서 변하도록.  x쪽으로 변함
        // Math.random()은 0-1사이 이므로 오른쪽으로 치우치므로 -0.5 해줘서 범위를 -0.5 ~ 0.5가 되도록 함
        // positionArray[i] = positionArray[i] + (Math.random() - 0.5) * 0.2; // 자연스럽게 변하도록 값을 곱해서 조금만 변하도록 해줌
        positionArray[i] += (Math.random() - 0.5) * 0.2;
        positionArray[i + 1] += (Math.random() - 0.5) * 0.2; // y값
        positionArray[i + 2] += (Math.random() - 0.5) * 0.2; // z값

        randomArray[i] = (Math.random() - 0.5) * 0.2;
        randomArray[i + 1] = (Math.random() - 0.5) * 0.2;
        randomArray[i + 2] = (Math.random() - 0.5) * 0.2;
    }

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		// const time = clock.getElapsedTime(); // 경과시간
        // time이 sin그래프에서 x축 각도를 의미하므로 time값이 커지면 속도가 빨라짐
        const time = clock.getElapsedTime() * 3; // 움직이는 속도 늘리고 싶으므로 수를 크게 만들어줌

        for(let i = 0; i < positionArray.length; i += 3){
            positionArray[i] += Math.sin(time + randomArray[i] * 100) * 0.001; // sin사용. 각도의 변화가 있어야 값의 변화가 일어남. 늘어가는 값 넣어줘야 함
            positionArray[i + 1] += Math.sin(time + randomArray[i + 1] * 100) * 0.001;
            positionArray[i + 2] += Math.sin(time + randomArray[i + 2] * 100) * 0.001;
        }

        geometry.attributes.position.needsUpdate = true;

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
