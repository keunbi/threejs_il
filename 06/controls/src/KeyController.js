export class KeyController {
    constructor(){
        // 생성자
        this.keys = []; // 처음에는 빈 배열

        window.addEventListener('keydown', e => {
            // 어떤 키가 눌렸을 때 이벤트객체 코드가 찍힘 -> 무슨 키가 눌렸는지를 알 수 있음
            console.log(e.code + '누름');
            this.keys[e.code] = true; 
        });

        window.addEventListener('keyup', e => {
            // 키를 땠을 때 해당하는 코드를 지움 -> 더이상 누르고있지 않다고 판단
            console.log(e.code + '땜');
            delete this.keys[e.code];
        })
    }
}