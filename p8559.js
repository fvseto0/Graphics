function start() {
    // setting up, getting values from html doc 
    var canvas= document.getElementById("canvas");
    var gl= canvas.getContext("webgl"); 

    var vertexSource= document.getElementById("vertexShader").text;
    var fragmentSource= document.getElementById("fragmentShader").text; 

    var slider1 = document.getElementById('slider1');
    slider1.value = -100;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(vertexShader)); return null; }
    
    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(fragmentShader)); return null; }
    
    // Attach the shaders and link
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialize shaders"); }
    gl.useProgram(shaderProgram);

    // pass attributes to vertex shader 
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
    
    shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.ColorAttribute);    
     
    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);
  
    shaderProgram.texcoordAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
    gl.enableVertexAttribArray(shaderProgram.texcoordAttribute);

    // get access to the matrices
    shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram,"uMV");
    shaderProgram.MVNormalmatrix = gl.getUniformLocation(shaderProgram,"uMVn");
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");

    var x=1;
    // vertex positions
    var vertexPos = new Float32Array([  
        // first layer
        -0.5, -0.5+x, -0.5,     // 0 
        0.5, -0.5+x, -0.5,      // 1 
        0.5, -0.5+x, 0.5,       // 2 
        -0.5, -0.5+x, 0.5,      // 3 
    
        // first tip
        0, 0.5+x, 0,            // 4 
          
        // first bot tip
        0, -0.25+x, 0,   //5
          
        // second layer
        1, -1.25+x, 1,   //6
        -1, -1.25+x, 1,  //7
        -1, -1.25+x, -1, //8
        1, -1.25+x, -1,  //9
         
          
        // sec bot tip
        0,-1+x,0, //10
         
        //bot stump square
        -.25,-2+x,-.25, //11
        .25,-2+x,-.25,
        .25,-2+x,.25,
        -.25,-2+x,.25   //14
        ]);

    // vertex normals
    var vertexNormals = new Float32Array([
        0, 0, 1,   0, 0, 1,   0, 0, 1,   1, 0, 0,  
        1, 0, 0,   1, 0, 0,   0, 1, 0,   0, 1, 0,  
        0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,  
        -1, 0, 0,  -1, 0, 0,  -1, 0, 0    
    ]);

    // vertex colors
    var vertexColors = new Float32Array([  
        0, .01, 0,   0, 0.01, 0,   0, 0.01, 0,   0, 0.01, 0,
        0, .01, 0,   0, 0.01 ,0,   0, 0.01, 0,   0, 0.01, 0, 
        0, .01, 0,   0, 0.01, 0,   0, 0.01, 0,   0, 0.01, 0,
        0, .01, 0,   0, 0.01, 0,   0, 0.01, 0,   0, 0.01, 0 ]);

    // vertex texture coordinates
    var vertexTextureCoords = new Float32Array([  
        0, -1,   1, 0,   1, -1,   1, 0,   // top 
        0.5, 0.25,   0.5, 1,   0.25, 1,   0.25, 0,   // mid
        0, 1,   0, 0,   1, 0,   1, 1,  0, 0,   1, 0,   0, 0 // bot
    ]);

    // element index array
    var triangleIndices = new Uint8Array([  
        // top side 
        0, 4, 1,    
        1, 4, 2,   
        2, 4, 3,   
        3, 4, 0,  
          
        // square top
        0,3,5,
        0,1,5,
        1,2,5,
        2,3,5,
          
        // bot tri
        6,5,7,
          
        // side bot
        6,9,5,
        7,8,5,
        5,8,9,
          
        // square bot
        6,7,10,
        8,9,10,
        6,9,10,
        7,8,10,
          
        // stump bot 
        11,14,5,
        11,12,5,
        5,12,13,
        5,13,14,
   
        // square stump
        11,12,13,
        14,11,13
    ]); 

    // a buffer for vertices
    var trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = 24;
    
    // a buffer for normals
    var triangleNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
    triangleNormalBuffer.itemSize = 3;
    triangleNormalBuffer.numItems = 24;

    // a buffer for colors
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
    colorBuffer.itemSize = 3;
    colorBuffer.numItems = 24;

    // a buffer for textures
    var textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexTextureCoords, gl.STATIC_DRAW);
    textureBuffer.itemSize = 2;
    textureBuffer.numItems = 24;

    // a buffer for indices
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);

    // Set up texture
    var texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var image1 = new Image();

   
    function initTextureThenDraw() {
      image1.onload = function() { loadTexture(image1,texture1); };
      image1.crossOrigin = "anonymous";
      image1.src = "https://live.staticflickr.com/65535/50641871583_78566f4fbb_o.jpg";
      
      window.setTimeout(draw,200);
    }

    function loadTexture(image,texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    }

    var cameraAngle= function(angle) {
        var distance= 100;
        var eye= vec3.create();
        eye[1]= 50;
        eye[0]= 10*Math.sin(Math.PI/2);
        eye[2]= distance*Math.cos(angle);
        return [eye[0],eye[1],eye[2]];
    }

    function draw() {
        // create slider values to allow view ot look at all angles  
        var angle1 = slider1.value*0.01*Math.PI;
        var angle2 = slider2.value*0.01*Math.PI;

        // lookat transform 
        var view= cameraAngle(10);
        var target= vec3.fromValues(0,0,0); // aim camera at world origin 
        var upAxis= vec3.fromValues(0,1,0); 
        var TlookAt= mat4.create();
        mat4.lookAt(TlookAt, view, target, upAxis);

        var camView= mat4.create();
        mat4.scale(camView,camView,[10,10,10]);
        mat4.rotate(camView,camView,angle1,[0,90,10]);
        mat4.rotate(camView,camView,angle2,[90,0,10]);

        // camera projection transform 
        var TprojectionCamera = mat4.create();
        mat4.perspective(TprojectionCamera,Math.PI/4,1,10,1000);

        var tMV= mat4.create();
        var tMVn= mat3.create();
        var tMVP= mat4.create();
        mat4.multiply(tMV,TlookAt,camView); 
        mat3.normalFromMat4(tMVn,tMV);
        mat4.multiply(tMVP,TprojectionCamera,tMV);
	
        // Clear screen, prepare for rendering
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set up uniforms & attributes
        gl.uniformMatrix4fv(shaderProgram.MVmatrix,false,tMV);
        gl.uniformMatrix3fv(shaderProgram.MVNormalmatrix,false,tMVn);
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
                 
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer.itemSize,
          gl.FLOAT,false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.vertexAttribPointer(shaderProgram.texcoordAttribute, textureBuffer.itemSize,
          gl.FLOAT, false, 0, 0);

	    // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture1);
        
        // draw
        gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_BYTE, 0);

    }

    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
    initTextureThenDraw();
}
window.onload=start;
