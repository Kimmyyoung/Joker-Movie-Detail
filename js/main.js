(()=>{
    
    let yOffset=0;
    let prevScrollHeight=0; //현재 스크롤의 합 보다 이전에 위치한 스크롤 섹션의 높이의 합
    let currentScene = 0; //현재 활성화된 신 값


    const sceneInfo = [
        {
            type: 'sticky',
            heightNum : 5, 
            //browser height * 5
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-selection-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0', 'main-message.b'),
                messageC: document.querySelector('#scroll-section-0', 'main-message.c'),
                messageD: document.querySelector('#scroll-section-0', 'main-message.d'),
            },
            values: {
                messageA_Opacity: [0,1],

            }
        },
        {
            type: 'normal',
            heightNum : 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {
            type: 'sticky',
            heightNum : 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        {
            type: 'sticky',
            heightNum : 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        },
    ];

    function setLayout () {
        //Define scrollheight 
       for(let i=0; i<sceneInfo.length; i++){
           sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
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
        let scrollRatio = currentY0ffset / sceneInfo[currentScene].scrollHeight;
        //현재 씬에서 스크롤이 된 범위와의 비율 구하기
        
        rv = parseInt(scrollRatio * 300);

        return scrollRatio;
    }
    function playAnimation() {
        let obj = sceneInfo[currentScene].objs;
        let values = sceneInfo[currentScene].values;

        switch(currentScene) {
            case 0:
                let messageA_Opacity_0 = values.messageA_Opacity[0];
                let messageB_Opacity_1 = values.messageA_Opacity[1];
                let currentY0ffset = yOffset - prevScrollHeight;
                //위에도 언급하지만 currentYOffset은 현재 스크롤의 위치

                //css 투명도를 현재 스크롤의 위치에 따라 1로 변경을 서서히 해준다

                console.log(calcValues(values, currentY0ffset));
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
            currentScene++;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }

        if( yOffset < prevScrollHeight ) {
            if(currentScene === 0) return; //IE : currentScene could be "-1" => exception code
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        playAnimation();
    }
    

    window.addEventListener('scroll', ()=>{
        yOffset = window.pageYOffset;
        scrollLoop();
    });
    window.addEventListener('load', setLayout);
    window.addEventListener('resize', setLayout);   


})();
