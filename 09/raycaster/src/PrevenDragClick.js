export class PreventDragClick {
    constructor(elem){ // 호출할때 canvas 넣었음
        this.mouseMoved; // 마우스 드래그 했는지를 판정. this.으로 객체의 속성으로 만들어줌
        let clickStartX;
        let clickStartY;
        let clickStartTime;
        elem.addEventListener('mousedown', e => { // 마우스 눌렀을 때
            clickStartX = e.clientX; // 처음 클릭을 시작한 x의 위치
            clickStartY = e.clientY;
            clickStartTime = Date.now();
        });
        elem.addEventListener('mouseup', e => { // 마우스 땠을 때 
            // 마우스를 누른위치와 땐 위치의 차를 구함
            // 위치에 따라 음수가 나올 수 있으므로 절대값으로 구해줌
            const xGap = Math.abs(e.clientX - clickStartX); 
            const yGap = Math.abs(e.clientY - clickStartY); 
            const timeGap = Date.now() - clickStartTime;

            if( // 마우스가 5보다 더 움직이면 / 시간이 0.5초보다 크다면 클릭한걸로 간주함
                xGap > 5 ||
                yGap > 5 ||
                timeGap > 500
            ){
                this.mouseMoved = true;
            }else{
                this.mouseMoved = false;
            }
        });
    }
}