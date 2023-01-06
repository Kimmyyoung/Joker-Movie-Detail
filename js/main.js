(()=>{
    
    let yOffset=0;
    let prevScrollHeight=0; //현재 스크롤의 합 보다 이전에 위치한 스크롤 섹션의 높이의 합
    let currentScene = 0; //현재 활성화된 신 값
    let enterNewScene = false; //scene 이 변경되는 찰나의 순간
    let acc = 0.1;
    let delayedYOffset = 0;
    let rafId;
    let rafState;

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
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages:[]
                //수천장의 이미지들을 여기에 넣을 예정 
            },
            values: {
				videoImageCount: 300,
				imageSequence: [0, 299],
                //폴더 001 (스크린 0에 사용될 이미지의 갯수)
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
				messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
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
                pinC: document.querySelector('#scroll-section-2 .c .pin'),
                //pin : scaleY 속성으로 세로로 된 작대기를 구현함
                canvas: document.querySelector('#video-canvas-1'),
                context: document.querySelector('#video-canvas-1').getContext('2d'),
                videoImages:[]
            },
            values: {
                videoImageCount: 960,
				imageSequence: [0, 959],
                //폴더 001 (스크린 0에 사용될 이미지의 갯수)
				canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
                canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
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
                //3
                type: 'sticky',
                heightNum: 5,
                scrollHeight: 0,
                objs: {
                    container: document.querySelector('#scroll-section-3'),
                    canvasCaption: document.querySelector('.canvas-caption'),
                    canvas: document.querySelector('.image-blend-canvas'),
                    context: document.querySelector('.image-blend-canvas').getContext('2d'),
                    imagesPath: [
                        './images/blend-image-1.jpg',
                        './images/blend-image-2.jpg'
                    ],
                    images: []
                },
                values: {
                    rect1X : [ 0, 0, {start: 0, end: 0}],
                    rect2X : [ 0, 0, {start: 0 , end: 0}],
                    rectStartY : 0,
                    blendHeight : [0, 0, {start :0, end : 0}],
                    canvas_Scale : [0, 0, {start: 0, end : 0}],
                    canvasCaption_Opacity : [ 0, 1, {start: 0, end: 0}],
                    canvasCaption_TranslateY : [ 20, 0, {start: 0, end: 0}]
                }
        },
    ];

    function setCanvasImages(){
        let imgElem;

        for(let i=0; i<sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image();
            imgElem.src = `./video/001/IMG_${6726+i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }

        let imgElem2;

        for(let i=0; i<sceneInfo[2].values.videoImageCount; i++) {
            imgElem2 = new Image();
            imgElem2.src = `./video/002/IMG_${7027+i}.JPG`;
            sceneInfo[2].objs.videoImages.push(imgElem2);
        }
        
        let imgElem3;

        for(let i=0; i < sceneInfo[3].objs.imagesPath.length; i++) {
            imgElem3 = new Image();
            imgElem3.src = sceneInfo[3].objs.imagesPath[i];
            sceneInfo[3].objs.images.push(imgElem3);
        }

    }
    function checkMenu(){
        //window.pageyoffset 현재 스크롤 된 위치 = yoffset
        if (yOffset > 44) {
            document.body.classList.add('local-nav-sticky');
        } else {
            document.body.classList.remove('local-nav-sticky');
        }
    }
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
       
       const heightRatio = window.innerHeight / 1080;
       sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
       sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
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
        
        switch (currentScene) {
            case 0:
                // const messageA_opacity_in = calcValues(values.messageA_opacity_in, currentY0ffset);
                // const messageA_translateY_in = calcValues(values.messageA_translateY_in, currentY0ffset);
                // const messageA_opacity_out = calcValues(values.messageA_opacity_out, currentY0ffset);
                // const messageA_translateY_out = calcValues(values.messageA_translateY_out, currentY0ffset);
                // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence],0,0);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

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
                // let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence2],0,0);

                if(scrollRatio <= 0.5) {
                    //in
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                }else{
                    //out
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                }

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

                //currentScene에서 캔버스 미리 그리기 처리 (약간 부자연스러운 부분 error 처리)
                if(scrollRatio > 0.9) {
                    const objs = sceneInfo[3].objs;
                    const widthRatio = window.innerWidth / objs.canvas.width;
                    const heightRatio = window.innerHeight / objs.canvas.height;
                    let canvasScaleRatio;
                    // const, let 으로 선언한 변수는 해당 중괄호 안에서만 사용 가능

                    if(widthRatio <= heightRatio) {
                        canvasScaleRatio = heightRatio;
                    }else{
                        canvasScaleRatio = widthRatio;
                    }
                    
                    
                    objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                    objs.context.fillStyle = 'white';
                    //색상을 흰색으로 변경 (rect 부분)
                    objs.context.drawImage(objs.images[0],0,0);
    
                    const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                    const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
                    
                    const whiteRectWidth = recalculatedInnerWidth * 0.15;
                    values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                    values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                    values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                    values.rect2X[1] = values.rect2X[0] + whiteRectWidth;
    
                    //좌우 흰색 박스 그리기
                    objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
                    objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
    
    
                }


                break;
            case 3:
                //디바이스마다 다른 스크린 속에서 가로세로 이미지가 꽉 채우게 하기 위해 비율을 구해야한다.
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                let canvasScaleRatio;
                let step = 0; 

                if(widthRatio <= heightRatio) {
                    canvasScaleRatio = heightRatio;
                }else{
                    canvasScaleRatio = widthRatio;
                }
                
                
                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.fillStyle = 'white';
                //색상을 흰색으로 변경 (rect 부분)
                objs.context.drawImage(objs.images[0],0,0);

                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
                
                if(!values.rectStartY) {
                    // values.rectStartY = objs.canvas.getBoundingClientRect().top;
                    values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) /2 ;
                    //이미지를 scale 처리 했기 때문에 scale 해서 작게 한 만큼을 더해주어야한다.
                    values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight; 
                    values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight; 

                    values.rect1X[2].end = values.rectStartY / scrollHeight;
                    values.rect2X[2].end = values.rectStartY / scrollHeight;
                }
                

                const whiteRectWidth = recalculatedInnerWidth * 0.15;
				values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
				values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
				values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
				values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

				// // 좌우 흰색 박스 그리기
				// objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth),objs.canvas.height);
                // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth),objs.canvas.height);

                objs.context.fillRect(parseInt(calcValues(values.rect1X, currentYOffset)),0,parseInt(whiteRectWidth),objs.canvas.height);
                objs.context.fillRect(parseInt(calcValues(values.rect2X, currentYOffset)),0,parseInt(whiteRectWidth),objs.canvas.height);

                // if(캔버스가 브라우저 상단에 닿지 않았다면) {
                //     step 1 
                // }else if(캔버스가 브라우저 상단에 닿았다면) {
                //     step 2
                //     if(step 3)
                // }


                if(scrollRatio < values.rect1X[2].end){
                    step = 1;
                    objs.canvas.classList.remove('sticky');
                }else {
                    step = 2;
                    //imageBlendY : [0, 0, {start :0, end : 0}]
                    values.blendHeight[0] = 0;
                    values.blendHeight[1] = objs.canvas.height;
                    values.blendHeight[2].start = values.rect1X[2].end;
                    //이전이미지의 끝점이 이 새로운 이미지 (블렌딩 될)의 시작점 이기 때문에
                    values.blendHeight[2].end = values.blendHeight[2].start + 0.2; 
                    const blendHeight = calcValues(values.blendHeight, currentYOffset);
                    
                    objs.context.drawImage(objs.images[1], 
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                    );

                    objs.canvas.classList.add('sticky');
                    objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) /2}px`;
                    
                    if(scrollRatio > values.blendHeight[2].end) {
                        values.canvas_Scale[0] = canvasScaleRatio;
                        values.canvas_Scale[1] = document.body.offsetWidth / ( 1.5 * objs.canvas.width);
                        // 스마트 폰이든 여러 디스플레이에 맞게 폭이 작아져야하기때문에
                        values.canvas_Scale[2].start = values.blendHeight[2].end;
                        values.canvas_Scale[2].end = values.canvas_Scale[2].start + 0.2;

                        objs.canvas.style.transform = `scale(${calcValues(values.canvas_Scale, currentYOffset)})`;
                        objs.canvas.style.marginTop = 0
                    }

                    if(scrollRatio > values.canvas_Scale[2].end && values.canvas_Scale[2].end > 0) {
                        objs.canvas.classList.remove('sticky');
                        //마지막 이미지가 다 전부 스케일 감소 된 이후 position 을 fixed 제거 한다.

                        objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

                        values.canvasCaption_Opacity[2].start = values.canvas_Scale[2].end;
                        values.canvasCaption_Opacity[2].end = values.canvasCaption_Opacity[2].start + 0.1;

                        values.canvasCaption_TranslateY[2].start = values.canvas_Scale[2].end;
                        values.canvasCaption_TranslateY[2].end = values.canvasCaption_Opacity[2].start + 0.1;

                        objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_Opacity, currentYOffset);
                        objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_TranslateY, currentYOffset)}%, 0)`;
                    }
                }

                
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

        if( yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight ) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }

        if( yOffset < prevScrollHeight ) {
            if(currentScene === 0) return; 
            //IE : currentScene could be "-1" => exception code
            enterNewScene = true;
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }

        if(enterNewScene) return;
        playAnimation();
    }
    
    function loop(){
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

        if(!enterNewScene) {
            if(currentScene === 0 || currentScene === 2) {
                const currentYOffset = delayedYOffset - prevScrollHeight;
                const values = sceneInfo[currentScene].values;
                const objs = sceneInfo[currentScene].objs;
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));

                if(objs.videoImages[sequence]) {
                    objs.context.drawImage(objs.videoImages[sequence],0,0);
                }
            }
        }

            rafId = requestAnimationFrame(loop);
    
    
            if(Math.abs(yOffset - delayedYOffset) < 1) {
                cancelAnimationFrame(rafId);
                rafState = false;
            }
    }


    
    window.addEventListener('load', ()=>{
        document.body.classList.remove('before-load');
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0],0,0);

        let tempYOffset = yOffset;
        let tempScrollCount = 0;
        if(yOffset > 0) {
            let siId = setInterval(() => {
                window.scrollTo(0, tempYOffset);
                tempYOffset += 5;           
                if(tempScrollCount > 20) {
                    clearInterval(siId);
                }
                tempScrollCount++;     
            }, 20);    
        }        

        window.addEventListener('scroll', ()=>{
            yOffset = window.pageYOffset;
            scrollLoop();
            checkMenu();
            if(!rafState) {
                rafId = requestAnimationFrame(loop);
                rafState = true;
            }
        });

        document.querySelector('.loading').addEventListener('transitionend', (e) =>{
            document.body.removeChild(e.currentTarget);
        })

        window.addEventListener('resize', () => {
            if(window.innerWidth > 900) {
                // setLayout();
                // sceneInfo[3].values.rectStartY = 0;
                window.location.reload();
            }
            // target device screen : 900
        });
        window.addEventListener('orientationchange', ()=>{
            scrollTo(0,0);
            setTimeout(()=>{
                window.location.reload();
            }, 500);
        });
    });
    
    //핸드폰 가로본능


    setCanvasImages();

})();
