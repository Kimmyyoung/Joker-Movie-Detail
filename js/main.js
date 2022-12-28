(()=>{
    
    let yOffset=0;
    let prevScrollHeight=0; //현재 스크롤의 합 보다 이전에 위치한 스크롤 섹션의 높이의 합
    let currentScene = 0; //현재 활성화된 신 값
    let enterNewScene = false; //scene 이 변경되는 찰나의 순간

    const sceneInfo = [
        {
            //0
            type: 'sticky',
            heightNum : 5, 
            //browser height * 5
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
				messageB: document.querySelector('#scroll-section-0 .main-message.b'),
				messageC: document.querySelector('#scroll-section-0 .main-message.c'),
				messageD: document.querySelector('#scroll-section-0 .main-message.d'),
            },
            values: {
				videoImageCount: 300,
				imageSequence: [0, 299],
				canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
				messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
			}
        },
        {
            //1
            type: 'normal',
            heightNum : 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {
            //2
            type: 'sticky',
            heightNum : 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
                messageB: document.querySelector('#scroll-section-2 .b'),
                messageC: document.querySelector('#scroll-section-2 .c'),
                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin')
                //pin : scaleY 속성으로 세로로 된 작대기를 구현함
            },
            values: {
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
                messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
                messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
                messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
                messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
                messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
                messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
                messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
                messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
                messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
                pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
                pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
                pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
                pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
                pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }]
            }
        },
        {
             // 3
                type: 'sticky',
                heightNum: 5,
                scrollHeight: 0,
                objs: {
                    container: document.querySelector('#scroll-section-3'),
                    canvasCaption: document.querySelector('.canvas-caption')
                },
                values: {

                }
        },
    ];

    function setLayout () {
        //Define scrollheight 
       for(let i=0; i < sceneInfo.length; i++){
        if(sceneInfo[i].type === 'sticky') {
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
        }else if(sceneInfo[i].type === 'normal'){
            sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
        }
        sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;           
       }
       //새로고침 했을 때 끊기지 않도록 작동하게 
       yOffset = window.pageYOffset;

       let totalScrollHeight = 0;
       for(let i=0; i < sceneInfo.length; i++) {
           totalScrollHeight += sceneInfo[i].scrollHeight;
           if(totalScrollHeight >= yOffset) {
               currentScene = i;
               break;
           }
       }

       document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    function calcValues(values, currentYOffset) {
        //currentYoffset : 현재 스크롤의 위치 
        let rv;
        const scrollHeight = sceneInfo[currentScene].scrollHeight
        //현재 씬의 높이
        const scrollRatio = currentYOffset / scrollHeight;
        //현재 씬에서 스크롤이 된 범위와의 비율 구하기
        
        if(values.length === 3) {
            let partScrollStart = values[2].start * scrollHeight;
            let partScrollEnd = values[2].end * scrollHeight;
            let partScrollHeight = partScrollEnd - partScrollStart;

            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            }else if(currentYOffset < partScrollStart) {
                rv = values[0];
            }else if(currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        }else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
        
        return rv;
    }
    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        //currentYOffset: 현재 스크린의 위치
        // yOffset : 전체 스크린의 Height 
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
        console.log(currentScene);
        
        switch (currentScene) {
            case 0:
                // const messageA_opacity_in = calcValues(values.messageA_opacity_in, currentY0ffset);
                // const messageA_translateY_in = calcValues(values.messageA_translateY_in, currentY0ffset);

                // const messageA_opacity_out = calcValues(values.messageA_opacity_out, currentY0ffset);
                // const messageA_translateY_out = calcValues(values.messageA_translateY_out, currentY0ffset);

                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                    //translate3d : (x,y,z) => 속성으로 xyz 를 다 컨트롤 할 수 있고, 3d 가 붙은 속성들은 하드웨어 가속이 보장되어 
                    // 퍼포먼스가 좋기 때문에 translateY (y만 컨트롤 하기때문에) 이걸 사용할 순 있지만 퍼포먼스가 좋은 translate3d를 사용한다.
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }
                break;

            case 1:
                break;
            case 2:
                console.log("current scene 2");
                if (scrollRatio <= 0.25) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.57) {
                    // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }

                if (scrollRatio <= 0.83) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }
                break;
            case 3:
                break;
        }
        //해당 신 인덱스 일때만 애니메이션을 실행 할 것 
    }

    function scrollLoop(){
        enterNewScene = false;
        prevScrollHeight = 0;

        for(let i =0; i<currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if( yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }

        if( yOffset < prevScrollHeight ) {
            if(currentScene === 0) return; //IE : currentScene could be "-1" => exception code
            enterNewScene = true;
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }

        if(enterNewScene) return;
        playAnimation();
    }
    

    window.addEventListener('scroll', ()=>{
        yOffset = window.pageYOffset;
        scrollLoop();
    });
    window.addEventListener('load', setLayout);
    window.addEventListener('resize', setLayout);   


})();
