// 내 파일 외부에서 사용하고 싶으면 앞에 export 붙여줘야 함
export function hello1(){   
    console.log('hello 1!')
}

export function hello2(){   
    console.log('hello 2!')
}


/* 특정함수 중괄호 없이 import 해오는 경우 export에 default 키워드를 넣어 기본값을 설정해줌 :: 기본값을 hello1으로 설정한다는 뜻
export default function hello1(){   
    console.log('hello 1!')
} 
*/