(()=>{
    
    let yOffset=0;
    let prevScrollHeight=0; //현재 스크롤의 합 보다 이전에 위치한 스크롤 섹션의 높이의 합
    let currentScene = 0; //현재 활성화된 신 값
    let enterNewScene = false; //scene 이 변경되는 찰나의 순간

    const sceneInfo = [
        {
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
                messageA_opacity_in: [0,1,{start:0.1, end:0.2}],
                messageA_translateY_in : [20,0,{start:0.1, end:0.2}],
                messageA_opacity_out: [1,0,{start:0.25, end:0.3}],
                messageA_translateY_out : [0,-20, {start:0.25, end:0.3}]
            }
        },
        {
            type: 'normal',
            heightNum : 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            },
            values: {
                messageA_opacity: [0,1,{start:0.1, end:0.2}],

            }

        },
        {
            type: 'sticky',
            heightNum : 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            },
            values: {
                messageA_opacity: [0,1],

            }
        },
        {
            type: 'sticky',
            heightNum : 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            },
            values: {
                messageA_opacity: [0,1],

            }
        },
    ];

    function setLayout () {
        //Define scrollheight 
       for(let i=0; i<sceneInfo.length; i++){
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
       for(let i=0; i<sceneInfo.length; i++) {
           totalScrollHeight += sceneInfo[i].scrollHeight;
           if(totalScrollHeight >= yOffset) {
               currentScene = i;
                break;
           }
       }

       document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    function calcValues(values, currentY0ffset) {
        //currentYoffset : 현재 스크롤의 위치 
        let rv;
        const scrollHeight = sceneInfo[currentScene].scrollHeight
        //현재 씬의 높이
        const scrollRatio = currentY0ffset / scrollHeight;
        //현재 씬에서 스크롤이 된 범위와의 비율 구하기
        
        if(values.length === 3) {
            let partScrollStart = values[2].start * scrollHeight;
            let partScrollEnd = values[2].end * scrollHeight;
            let partScrollHeight = partScrollEnd - partScrollStart;

            if(currentY0ffset >= partScrollStart && currentY0ffset <= partScrollEnd) {
                rv = (currentY0ffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            }else if(currentY0ffset < partScrollStart) {
                rv = values[0];
            }else if(currentY0ffset > partScrollEnd) {
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
        const currentY0ffset = yOffset - prevScrollHeight;
        //currentYOffset: 현재 스크린의 위치
       // yOffset : 전체 스크린의 Height 
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentY0ffset / scrollHeight;

        switch(currentScene) {
            case 0:
                const messageA_opacity_in = calcValues(values.messageA_opacity_in, currentY0ffset);
                const messageA_translateY_in = calcValues(values.messageA_translateY_in, currentY0ffset);

                const messageA_opacity_out = calcValues(values.messageA_opacity_out, currentY0ffset);
                const messageA_translateY_out = calcValues(values.messageA_translateY_out, currentY0ffset);

                if(scrollRatio <= 0.22) {
                    objs.messageA.style.opacity = messageA_opacity_in;
                    objs.messageA.style.transform = `translateY(${messageA_translateY_in}%)`;
                }else{
                    objs.messageA.style.opacity = messageA_opacity_out;
                    objs.messageA.style.transform = `translateY(${messageA_translateY_out}%)`;
                }      
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
        //해당 신 인덱스 일때만 애니메이션을 실행 할 것 
    }
    function scrollLoop(){
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
