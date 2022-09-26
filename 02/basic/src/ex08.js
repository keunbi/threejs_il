import * as THREE from 'three';
import gsap from 'gsap';


// 라이브러리를 이용한 애니메이션
// 참고 https://greensock.com/
// npm으로 설치 (npm i gsap)

export default function example(){

    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias : true, // 도형이 계단처럼 끊기는 현상 없애줌(성능저하가 있을 수 있음)
    });
    renderer.setSize(window.innerWidth, window.innerHeight); 
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

    // Scene
    const scene = new THREE.Scene(); // 씬을 만들어줌
    // 안개효과 (안개색상, 안개가 어디서 어디까지 끼게할지 near와 far 설정) -> 그라데이션이 자연스럽게 되는 효과있음
    scene.fog = new THREE.Fog('black', 3, 7);

    // Camera
    // Perspective Camera (원근카메라)
    const camera = new THREE.PerspectiveCamera(
        75, // 시야각 (field of view)
        window.innerWidth / window.innerHeight, // 종횡비 (aspect)
        0.1, // near
        1000 // far
    );
    camera.position.y = 1;
    camera.position.z = 5; // 카메라 위치 지정해주지 않으면 (0,0,0)에 위치함. 카메라가 내 쪽으로 5만큼 온 것. 물체에서 멀어진 것
    scene.add(camera);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1); // (빛의색상, 빛의강도)
    light.position.x = 1;
    light.position.y = 3;
    light.position.z = 10; // 빛의 위치를 내 쪽으로 땡김
    scene.add(light);

    // Mesh (geometry 뼈대 + material 재질)
    const geometry = new THREE.BoxGeometry(1, 1, 1); // 1 * 1 * 1인 정육면체 만들기
    const material = new THREE.MeshStandardMaterial({  // MeshBasicMaterial 은 빛의 영향을 받지 않으므로 light를 줘도 변화가 없음
        color: 0xff0000
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);


    // 그리기
    //Date.now(); // 경과시간 (0부터가 아닌 1970년 1월 1일을 기준으로 계산됨. 계속 쌓이는 중)

    let oldTime = Date.now(); // 처음 실행됐을 때 

    function draw(){    
        const newTime = Date.now(); 
        const deltaTime = newTime - oldTime;
        oldTime = newTime;


        renderer.render(scene, camera);

        window.requestAnimationFrame(draw);

    }


    // gsap
    gsap.to(
        mesh.position, // 변화를 주고싶은 오브젝트
        {
            duration: 1, // 재생시간 1초
            y: 2, // 현재 0에서 2로 이동
            z: 3
        }
    );

    function setSize(){
        // 카메라
        camera.aspect = window.innerWidth / window.innerHeight; // 카메라의 aspect 재설정
        camera.updateProjectionMatrix(); // 카메라에 변화가 있을 때 실행해줘야하는 메소드
        renderer.setSize(window.innerWidth, window.innerHeight); 
        renderer.render(scene, camera);
    }
    // 이벤트
    window.addEventListener('resize', setSize);

    draw();

}