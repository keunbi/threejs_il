import * as THREE from 'three';


export default function example(){

    // 동적으로 캔버스 조립하기
    // const renderer = new THREE.WebGL1Renderer();
    // renderer.setSize(window.innerWidth, window.innerHeight); // 렌더러 사이즈 지정 (현재는 풀스크린으로 지정)
    // document.body.appendChild(renderer.domElement);  // 캔버스를 바디에 넣어줌 (renderer.domElement 렌더러가 가지고있는 캔버스)


    const canvas = document.querySelector('#three-canvas');
    // object로 canvas 속성의 값을 가져온 canvas로 지정해줌
    // const renderer = new THREE.WebGLRenderer({ canvas : canvas })
    const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias : true // 도형이 계단처럼 끊기는 현상 없애줌(성능저하가 있을 수 있음)
    });
    renderer.setSize(window.innerWidth, window.innerHeight); 

    // Scene
    const scene = new THREE.Scene(); // 씬을 만들어줌

    // Camera
    // Perspective Camera (원근카메라)
    const camera = new THREE.PerspectiveCamera(
        75, // 시야각 (field of view)
        window.innerWidth / window.innerHeight, // 종횡비 (aspect)
        0.1, // near
        1000 // far
    );
    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5; // 카메라 위치 지정해주지 않으면 (0,0,0)에 위치함. 카메라가 내 쪽으로 5만큼 온 것. 물체에서 멀어진 것


    // Orthographic Camera (직교카메라)
    // const camera = new THREE.OrthographicCamera(
    //     -(window.innerWidth / window.innerHeight), // left
    //     window.innerWidth / window.innerHeight, // right
    //     1, // top
    //     -1, // bottom
    //     0.1, // near
    //     1000 // far
    // );
    // camera.position.x = 1;
    // camera.position.y = 2;
    // camera.position.z = 5;
    // camera.lookAt(0, 0, 0); // lookAt(x, y, z) 메소드 사용하면 카메라가 안에 정의된 포지션을 바라봄
    // camera.zoom = 0.5;
    // camera.updateProjectionMatrix(); // 카메라 렌더에 관한 속성(zoom)을 바꿔주면 updateProjectionMatrix() 를 호출해줘야함

    scene.add(camera);

    // Mesh (geometry 뼈대 + material 재질)
    const geometry = new THREE.BoxGeometry(1, 1, 1); // 1 * 1 * 1인 정육면체 만들기
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xff0000
        // color: '#ff0000' 또는 color: 'red' 라고 지정해줘도 됨
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 그리기
    renderer.render(scene, camera)

}