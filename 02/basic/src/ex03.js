import * as THREE from 'three';


export default function example(){

    const canvas = document.querySelector('#three-canvas');
    // object로 canvas 속성의 값을 가져온 canvas로 지정해줌
    // const renderer = new THREE.WebGLRenderer({ canvas : canvas })
    const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias : true, // 도형이 계단처럼 끊기는 현상 없애줌(성능저하가 있을 수 있음)
        alpha : true // 검은색 배경 투명해짐
    });
    renderer.setSize(window.innerWidth, window.innerHeight); 
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setClearAlpha(0.5);  // 배경 투명도 조절가능
    renderer.setClearColor(0x00ff00); // 배경 색상 지정

    // Scene
    const scene = new THREE.Scene(); // 씬을 만들어줌
    scene.background = new THREE.Color('blue');

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


    function setSize(){
        // 카메라
        camera.aspect = window.innerWidth / window.innerHeight; // 카메라의 aspect 재설정
        camera.updateProjectionMatrix(); // 카메라에 변화가 있을 때 실행해줘야하는 메소드
        renderer.setSize(window.innerWidth, window.innerHeight); 
        renderer.render(scene, camera);
    }
    // 이벤트
    window.addEventListener('resize', setSize);

}