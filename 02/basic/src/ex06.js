import * as THREE from 'three';


export default function example(){

    const canvas = document.querySelector('#three-canvas');
    // object로 canvas 속성의 값을 가져온 canvas로 지정해줌
    // const renderer = new THREE.WebGLRenderer({ canvas : canvas })
    const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias : true, // 도형이 계단처럼 끊기는 현상 없애줌(성능저하가 있을 수 있음)
    });
    renderer.setSize(window.innerWidth, window.innerHeight); 
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

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
    camera.position.z = 5; // 카메라 위치 지정해주지 않으면 (0,0,0)에 위치함. 카메라가 내 쪽으로 5만큼 온 것. 물체에서 멀어진 것
    scene.add(camera);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1); // (빛의색상, 빛의강도)
    light.position.x = 1;
    light.position.z = 5; // 빛의 위치를 내 쪽으로 땡김
    scene.add(light);

    // Mesh (geometry 뼈대 + material 재질)
    const geometry = new THREE.BoxGeometry(1, 1, 1); // 1 * 1 * 1인 정육면체 만들기
    const material = new THREE.MeshStandardMaterial({  // MeshBasicMaterial 은 빛의 영향을 받지 않으므로 light를 줘도 변화가 없음
        color: 0xff0000
        // color: '#ff0000' 또는 color: 'red' 라고 지정해줘도 됨
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);


    // 그리기
    // 개인 기기의 성능에 따라 애니메이션의 속도 혹은 횟수가 다르게 작동할 수 있으므로 이를 보완해줘야함
    // Clock이 경과된 시간을 값으로 가지고 있음. 변화를 줄 것에 값으로 이용.
    const clock = new THREE.Clock(); 

    function draw(){    
        // const time = clock.getElapsedTime(); // 시간의 경과. 초단위로 찍힘
        // getElapsedTime 와 getDelta 같이 사용하면 안됨
        // 일정값에 더해주는 식에 알맞은 방식
        const delta = clock.getDelta(); // draw가 한 번 실행될 때마다의 간격. 증가하는 값이 아닌 일정한 값

        mesh.rotation.y += 2 * delta;
        mesh.position.y += delta;
        if(mesh.position.y > 3){
            mesh.position.y = 0;
        }
        renderer.render(scene, camera);

        window.requestAnimationFrame(draw);

        // 렌더러에 있는 애니메이션. requestAnimationFrame와 동일하게 동작함
        // three.js를 이용해 ar이나 vr 컨텐츠 만들때는 반드시 setAnimationLoop 사용해줘야 함. 
        // renderer.setAnimationLoop(draw);
    }


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