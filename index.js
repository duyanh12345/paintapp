window.addEventListener("load" ,() =>{
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    const draw = document.querySelector("#draw");
    const line = document.querySelector("#line");
    const triangle = document.querySelector("#triangle");
    const rectangle = document.querySelector("#rectangle");
    const circle = document.querySelector("#circle");
    const del = document.querySelector("#delete");
    const size = document.querySelector("#size");
    const color = document.querySelector("#color");
    const cut = document.querySelector("#cut");
    
    var imgData;
    paint=false;
    X=0;
    Y=0;
    Type=0;

    //setup
    ctx.lineWidth = 5;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    function resize()
    {   
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', resize); 

    //paint
    function mousedown (e)
    {   
        ctx.beginPath();
        ctx.moveTo(e.offsetX,e.offsetY);

        X=e.offsetX;
        Y=e.offsetY;
        
        imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
        paint = true;

    }

    function mouseup (e)
    {   
        paint = false;
    }

    canvas.addEventListener("pointerdown", mousedown);
    canvas.addEventListener("pointerup", mouseup);
    
    //draw
    draw.addEventListener("click",() =>{Type = 0;});

    function draws(e)
    {   
        if(!paint)
           return;

        if(Type!=0)
           return;
        
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
    }
    
    canvas.addEventListener("pointermove",draws);
    
    //line
    line.addEventListener("click",() =>{Type = 1;});

    function drawline(e)
    {   
        if(!paint)
           return;

        if(Type!=1)
        return;
        
        ctx.putImageData(imgData, 0, 0);

        ctx.beginPath();
        ctx.moveTo(X,Y);
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
    }

    canvas.addEventListener("pointermove",drawline);

    //triangle
    triangle.addEventListener("click",() =>{Type = 2;});
    countpoint=0;

    function drawtriangle(e)
    {   
        if(!paint)
           return;

        if(Type!=2)
        return;
        
        ctx.putImageData(imgData, 0, 0);

        ctx.beginPath();
        ctx.moveTo(X,Y);
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
    }

    canvas.addEventListener("pointermove",drawtriangle);

    //rectangle
    rectangle.addEventListener("click",() =>{Type = 3;});

    function drawrectangle(e)
    {   
        if(!paint)
           return;

        if(Type!=3)
        return;
        
        ctx.putImageData(imgData, 0, 0);

        ctx.beginPath();
        ctx.strokeRect(X,Y,e.offsetX-X,e.offsetY-Y);
        ctx.stroke();
    }

    canvas.addEventListener("pointermove",drawrectangle);

    //circle
    circle.addEventListener("click",() =>{Type = 4;});
    Radius=0;

    function drawcircle(e)
    {   
        if(!paint)
           return;

        if(Type!=4)
        return;
        
        ctx.putImageData(imgData, 0, 0);

        ctx.beginPath();
        Radius=Math.sqrt((e.offsetX-X)*(e.offsetX-X)+(e.offsetY-Y)*(e.offsetY-Y));

        ctx.arc(X,Y,Radius,0,2*Math.PI);
        ctx.stroke();
    }

    canvas.addEventListener("pointermove",drawcircle);

    //delete
    function deletecanvas()
    {   
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    del.addEventListener("click",deletecanvas);

    //cut
    cut.addEventListener("click",() =>{Type = 5;});
    X_down=0;
    Y_down=0;
    X_up=0;
    Y_up=0;
    var cutData;
    var cutimgData;
    L=0;
    R=0;

    function Cutarea(e)//select cut area
    {
        if(!paint)
           return;

        if(Type!=5)
        return;

        let a=ctx.lineWidth;
        ctx.lineWidth=1;
        
        ctx.putImageData(imgData, 0, 0);

        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.strokeRect(X,Y,e.offsetX-X,e.offsetY-Y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.lineWidth=a;
    }
    
    canvas.addEventListener("pointermove",Cutarea);

    function Cutup(e)
    {
        if(Type!=5)
        return;

        X_up=e.offsetX;
        Y_up=e.offsetY;
        
        Type=6;
    }

    canvas.addEventListener("pointerup", Cutup);

    function Cutdown(e)
    {
        if(Type!=5)
        return;

        X_down=e.offsetX;
        Y_down=e.offsetY;

        cutimgData=ctx.getImageData(0,0,canvas.width,canvas.height);
    }

    canvas.addEventListener("pointerdown", Cutdown);

    function Clickoncutarea(e)
    {
        if(Type!=6)
        return;

        if(X_down>X_up)
        [X_down,X_up]=[X_up,X_down];

        if(Y_down>Y_up)
        [Y_down,Y_up]=[Y_up,Y_down];

        if(e.offsetX<X_down)
        return;

        if(e.offsetX>X_up)
        return;
        
        if(e.offsetY<Y_down)
        return;

        if(e.offsetY>Y_up)
        return;
        
        ctx.putImageData(cutimgData,0,0);
        cutData=ctx.getImageData(X_down,Y_down,X_up-X_down,Y_up-Y_down);
        ctx.fillStyle= "white";
        ctx.fillRect(X_down,Y_down,X_up-X_down,Y_up-Y_down);
        imgData = ctx.getImageData(0,0,canvas.width,canvas.height);

        L=e.offsetX-X_down;
        R=e.offsetY-Y_down;

        Type=7;
    }

    canvas.addEventListener("pointerdown",Clickoncutarea);

    function movecutarea(e)
    {
        if(Type!=7)
        return;

        ctx.putImageData(imgData, 0, 0);
        ctx.putImageData(cutData, e.offsetX-L, e.offsetY-R);
    }

    canvas.addEventListener("pointermove",movecutarea);
    
    function stopcutmove()
    {
        if(Type!=7)
        return;

        Type=5;
    }

    canvas.addEventListener("pointerup", stopcutmove);
    //linewidth
    function clinewidth()
    {
        ctx.lineWidth = size.value;
    }

    size.addEventListener("input",clinewidth);

    //color
    function selectcolor()
    {
        ctx.strokeStyle = color.value;
    }

    color.addEventListener("input",selectcolor);
})