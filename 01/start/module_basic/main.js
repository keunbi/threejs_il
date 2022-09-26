// import { hello1, hello2 } from './hello.js'; // 사용할 함수 import로 가져오기
// import hello1 from './hello.js'; 이렇게 중괄호 없이 가져오는 경우 -> export에 default 키워드 넣어줘야 함

import * as hell from './hello.js'; // hello.js에서 hell라는 이름으로 모든 것 가져오겠다

hell.hello1(); // 위에서 지어준 hello라는 이름을 오브젝트처럼 앞에 붙여서 사용해줘야 함
hell.hello2();