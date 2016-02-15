
// holds all our boxes

/* Auxilia no desenho da caixa de seleção para drag, drop and resize
dos anuncios 
0  1  2
3     4
5  6  7*/
var selectionHandles = [];


var yAux = 0;

var utilizador = "";
var mensagem = "";
var curso = "";
var tema = "";

var espac = 5;
// Hold canvas information
var canvas;
var ctx;
var largura;
var altura;
var INTERVAL = 20;  // intervalo para verificar se é necessário redesenhar

var isDrag = false;
var isResizeDrag = false;
var expectResize = -1; // verifica se o rato está sobre um dos caixas de seleção
var mx, my; // coordenadas do rato

 // serve para avaliar se é necessário voltar a desenhar tudo
var canvasValid = false;

// serve para verificar se algum dos anúncios foi selecionado
var mySel = null;

// cor e espessura das caixas de seleção
var mySelColor = 'red';
var mySelWidth = 2;
var mySelBoxColor = 'red'; // New for selection boxes
var mySelBoxSize = 5;

// fake canvas e fake context
var ghostcanvas;
var gctx;

// serve para calcular o offset da posição do rato em relação à página
var offsetx, offsety;

// Padding and border style widths for mouse offsets
var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

// prototype para os anuncios com os métodos de desenho
Anuncio.prototype = {
  
  // método de desenho para o canvas com todos os anúncios
  desenhaTodos: function(context) {
      if (context === gctx) {
        context.fillStyle = 'black'; // é sempre preto para  ghost canvas
      } else {
        context.fillStyle = this.fill;
      }
      
      // Se os anúncios estiveram fora do canvas não os desenha
      if (this.xMolho > largura || this.yMolho > altura) return; 
      if (this.xMolho + this.tamanho < 0 || this.yMolho + this.tamanho < 0) return;
      
      
      // funções do desenho dos vários anúncios
      context.fillStyle = this.corCurso;
      context.globalAlpha = 0.75;
      context.fillRect(this.xMolho,this.yMolho,this.tamanho,this.tamanho);
      
      context.font = this.fontSize + "px mark";
      context.fillStyle = "rgba(255,255,255,0)";
      context.globalAlpha = 1;
      context.fillText(this.id, this.xMolho, this.yMolho - espac, this.tamanhoInicial - espac);
      context.fillStyle = "black";
      context.fillText("Data: " + this.data, this.xMolho + espac, this.yMolho + this.fontSize + espac);
      context.fillText("Autor: " + this.autor, this.xMolho + espac, this.yMolho + (this.fontSize + espac) * 2);
      context.fillText("Tema: " + this.tema, this.xMolho + espac, this.yMolho + (this.fontSize + espac) * 3);
      var course = "Curso: " + this.curso;
      wrapText(context, course, this.xMolho + espac, this.yMolho + (this.fontSize + espac) * 4, this.tamanho - espac, this.fontSize + espac);
      var assunto = "Assunto: " + this.mensagem
      wrapText(context, assunto, this.xMolho + espac, this.yMolho + (this.fontSize + espac) * 6, this.tamanho - espac, this.fontSize + espac);
    
    // draw selection
    // this is a stroke along the box and also 8 new selection handles
    if (mySel === this) {
      
      // define o tamanho da fonte proporcionalmente ao tamanho do anuncio 
      this.fontSize = mySel.tamanho * 13 / mySel.tamanhoInicial;
     
      context.strokeStyle = mySelColor;
      context.lineWidth = mySelWidth;
      context.strokeRect(this.xMolho,this.yMolho,this.tamanho,this.tamanho);
      
      // desenho das caixas de seleção
      
      var half = mySelBoxSize / 2;
      
      // 0  1  2
      // 3     4
      // 5  6  7
      
      // top left, middle, right
      selectionHandles[0].x = this.xMolho-half;
      selectionHandles[0].y = this.yMolho-half;
      
      selectionHandles[1].x = this.xMolho+this.tamanho/2-half;
      selectionHandles[1].y = this.yMolho-half;
      
      selectionHandles[2].x = this.xMolho+this.tamanho-half;
      selectionHandles[2].y = this.yMolho-half;
      
      //middle left
      selectionHandles[3].x = this.xMolho-half;
      selectionHandles[3].y = this.yMolho+this.tamanho/2-half;
      
      //middle right
      selectionHandles[4].x = this.xMolho+this.tamanho-half;
      selectionHandles[4].y = this.yMolho+this.tamanho/2-half;
      
      //bottom left, middle, right
      selectionHandles[6].x = this.xMolho+this.tamanho/2-half;
      selectionHandles[6].y = this.yMolho+this.tamanho-half;
      
      selectionHandles[5].x = this.xMolho-half;
      selectionHandles[5].y = this.yMolho+this.tamanho-half;
      
      selectionHandles[7].x = this.xMolho+this.tamanho-half;
      selectionHandles[7].y = this.yMolho+this.tamanho-half;

      
      context.fillStyle = mySelBoxColor;
      for (var i = 0; i < 8; i ++) {
        var cur = selectionHandles[i];
        context.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
      }
    }
    
  }, // fim do desenho

  desenhaRecentes: function(context) {
      if (context === gctx) {
        context.fillStyle = 'black';
      } else {
        context.fillStyle = this.fill;
      }
      
      // não desenha aqueles elementos que estiverem fora do canvas
      // VAMOS TER QUE AMPLIAR UM POUCO ESTES INTERVALOS PARA FAZER O EFEITO DOS ANUNCIOS A SAIREM PARA
      // FORA DO CANVAS OU A FICAREM CORTADOS PELOS LIMITES
      if (this.xRecentes > largura || this.yRecentes > altura) return; 
      if (this.xRecentes + this.tamanhoInicial < 0 || this.yRecentes + this.tamanhoInicial < 0) return;
      
      context.fillStyle = this.corCurso;
      context.globalAlpha = 0.75;
      context.fillRect(this.xRecentes,this.yRecentes,this.tamanhoInicial,this.tamanhoInicial);
      
      context.font = "13px mark";
      context.fillStyle = "rgba(255,255,255,0)";
      context.globalAlpha = 1;
      context.fillText(this.id, this.xRecentes, this.yRecentes - espac, this.tamanhoInicial - espac);
      context.fillStyle = "black";
      context.fillText("Data: " + this.data, this.xRecentes + espac, this.yRecentes + this.fontSize + espac);
      context.fillText("Autor: " + this.autor, this.xRecentes + espac, this.yRecentes + (this.fontSize + espac) * 2);
      context.fillText("Tema: " + this.tema, this.xRecentes + espac, this.yRecentes + (this.fontSize + espac) * 3);
      var course = "Curso: " + this.curso;
      wrapText(context, course, this.xRecentes + espac, this.yRecentes + (this.fontSize + espac) * 4, this.tamanhoInicial - espac, this.fontSize + espac);
      var assunto = "Assunto: " + this.mensagem
      wrapText(context, assunto, this.xRecentes + espac, this.yRecentes + (this.fontSize + espac) * 6, this.tamanhoInicial - espac, this.fontSize + espac);
        
  } // fim do desenho

}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
}





// inicializar o canvas, o ghostcanvas e atualiza regularmente o desenho
function initTodos() {
  
  canvas = document.getElementById('todos-os-anuncios');
  altura = canvas.height;
  largura = canvas.width;
  ctx = canvas.getContext('2d');
  ghostcanvas = document.createElement('canvas');
  ghostcanvas.height = altura;
  ghostcanvas.width = largura;
  gctx = ghostcanvas.getContext('2d');
  
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.onselectstart = function () { return false; }
  
  // fixes mouse co-ordinate problems when there's a border or padding
  // see getMouse for more detail
  if (document.defaultView && document.defaultView.getComputedStyle) {
    stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)     || 0;
    stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)      || 0;
    styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
    styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)  || 0;
  }
  
  
  // executa mainDraw() a cada INTERVAL mili-segundos
  setInterval(mainDraw, INTERVAL);
  
  // define os métodos associados aos eventos do rato
  canvas.onmousedown = myDown;
  canvas.onmouseup = myUp;
  canvas.ondblclick = myDblClick;
  canvas.onmousemove = myMove;
  
  // define as caixas de seleção de cada anuncio
  for (var i = 0; i < 8; i ++) {
    var rect = new Anuncio;
    selectionHandles.push(rect);
  }
  
}


// limpa o canvas
function clearTodos(c) {
  c.clearRect(0, 0, largura, altura);
}



// função de desenho de todos os anuncios criados. apenas é desenhado se a flag "canvasValid" for true
function mainDraw() {
    
	var l = anuncios.length;
    var auxiliarX = 0;
    var auxiliarY = 0;
    
    function desenho() {
        
        if (curso != "" && tema != "") {
            for(var i = 0;i < l; i++) {
                if (anuncios[i].curso == curso && anuncios[i].tema == tema) {
                    anuncios[i].desenhaTodos(ctx);    
                }
            }  
        }
        else if (curso != "" && tema == "") {
            for(var i = 0;i < l; i++) {
                if (anuncios[i].curso == curso) {
                    anuncios[i].desenhaTodos(ctx);  
                }
            }
        }
        else if (curso == "" && tema != "") {
            for(var i = 0;i < l; i++) {
                if (anuncios[i].tema == tema) {
                    anuncios[i].desenhaTodos(ctx);  
                }
            }
        }
        else if (utilizador != "") {
            for(var i = 0;i < l; i++) {
                if (anuncios[i].autor == utilizador) {
                    anuncios[i].desenhaTodos(ctx);  
                }
            }
        }
        else {
            if(!isDrag && !isResizeDrag) {
                for(var i = 0;i < l; i++) {
                    resetCoordenadas();
                    anuncios[i].desenhaTodos(ctx);    
                }    
            }
            else {
                for(var i = 0;i < l; i++) {
                    anuncios[i].desenhaTodos(ctx);    
                }
            }
            
        }    
    }
    
    
    
    function resetCoordenadas() {
        
        auxiliarX = 0;
        auxiliarY = 0;
        for(var i = 0;i < l; i++) {
                        
                anuncios[i].xMolho = auxiliarX;
                anuncios[i].yMolho = auxiliarY;
                        
                if (auxiliarX <= canvas.width - 2*anuncios[i].tamanho - 30) {
                    auxiliarX += anuncios[i].tamanho + 30;
                      
                }
                else {
                    auxiliarX = 0;
                    auxiliarY += anuncios[i].tamanho + 30;
                }    
            }
        
        
    }
    
    $("#filtro-curso").change(function () {
        
            curso = $(this).val();
            if (curso == "todos") {
                curso = "";
                
                
            }
            else {
                for(var i = 0;i < l; i++) {
                    if (anuncios[i].curso == curso) {
                        
                        anuncios[i].xMolho = auxiliarX;
                        anuncios[i].yMolho = auxiliarY;
                        
                        if (auxiliarX <= canvas.width - anuncios[i].tamanho - 30) {
                            auxiliarX += anuncios[i].tamanho + 30;    
                        }
                        else {
                            auxiliarX = 0;
                            auxiliarY += anuncios[i].tamanho + 30;
                        }    
                    }    
                }
                
            }
            auxiliarY = 0;
            auxiliarX = 0;
            invalidate();

     });
     
     $("#filtro-tema").change(function () {
            
            tema = $(this).val();
            if (tema == "todos") {
                tema = "";
                 
            }
            else {
                for(var i = 0;i < l; i++) {
                    if (anuncios[i].tema == tema) {
                        
                        anuncios[i].xMolho = auxiliarX;
                        anuncios[i].yMolho = auxiliarY;
                        
                        if (auxiliarX <= canvas.width - anuncios[i].tamanho - 30) {
                            auxiliarX += anuncios[i].tamanho + 30;    
                        }
                        else {
                            auxiliarX = 0;
                            auxiliarY += anuncios[i].tamanho + 30;
                        }    
                    }    
                }
                
            }
            auxiliarY = 0;
            auxiliarX = 0;
            invalidate();
     });
     
      
     
    if (canvasValid == false) {
        clearTodos(ctx);
        desenho();
        canvasValid = true;   
    }
    
}

$("#meus-anuncios").on("click", function(){
        if (utilizador == "") {
            utilizador = Parse.User.current().get("username");
            invalidate();
         } 
        else {
            utilizador = "";
            invalidate();
        }
});

// função para mover os anuncios
function myMove(e){
  
  // verifica se o rato está pressionado e se estiver define a posição do rectângulo selecionado  
  if (isDrag) {
    getMouse(e);
    
    mySel.xMolho = mx - offsetx;
    mySel.yMolho = my - offsety;   
    // invalida o canvas porque alguma coisa se está a mover
    invalidate();
  } 
  // verifica se o utilizador selecionou alguma das caixas de seleção para redimensionar o anuncio
  else if (isResizeDrag) {
    
    var oldx = mySel.xMolho;
    var oldy = mySel.yMolho;
    
    // 0  1  2
    // 3     4
    // 5  6  7
    
    // switch para definir o que acontece consoante a caixa de seleção selecionada
    switch (expectResize) {
      case 0:
        mySel.xMolho = mx;
        mySel.yMolho = my;
        mySel.tamanho += oldx - mx;
        mySel.tamanho += oldy - my;
        break;
      case 1:
        mySel.yMolho = my;
        mySel.tamanho += oldy - my;
        break;
      case 2:
        mySel.yMolho = my;
        mySel.tamanho = mx - oldx;
        mySel.tamanho += oldy - my;
        break;
      case 3:
        mySel.xMolho = mx;
        mySel.tamanho += oldx - mx;
        break;
      case 4:
        mySel.tamanho = mx - oldx;
        break;
      case 5:
        mySel.xMolho = mx;
        mySel.tamanho += oldx - mx;
        //mySel.tamanho = my - oldy;
        break;
      case 6:
        mySel.tamanho = my - oldy;
        break;
      case 7:
        mySel.tamanho = mx - oldx;
        //mySel.tamanho = my - oldy;
        break;
    }
    invalidate();
    
  }
  
  getMouse(e);
  // se um dos anuncios for selecionado e estiver selecionada uma das caixas de seleção, verifica qual
  if (mySel !== null && !isResizeDrag) {
    for (var i = 0; i < 8; i++) {
      // 0  1  2
      // 3     4
      // 5  6  7
      
      var cur = selectionHandles[i];
      
      if (mx >= cur.x && mx <= cur.x + mySelBoxSize &&
          my >= cur.y && my <= cur.y + mySelBoxSize) {
        
        expectResize = i;
        invalidate();
        
        // estiliza o cursor do rato consoante a caixa de seleção sobre a qual o rato se encontra
        switch (i) {
          case 0:
            this.style.cursor='nw-resize';
            break;
          case 1:
            this.style.cursor='n-resize';
            break;
          case 2:
            this.style.cursor='ne-resize';
            break;
          case 3:
            this.style.cursor='w-resize';
            break;
          case 4:
            this.style.cursor='e-resize';
            break;
          case 5:
            this.style.cursor='sw-resize';
            break;
          case 6:
            this.style.cursor='s-resize';
            break;
          case 7:
            this.style.cursor='se-resize';
            break;
        }
        return;
      }
      
    }
    // quando deixar de estar sobre uma caixa de seleção, volta aos estados iniciais
    isResizeDrag = false;
    expectResize = -1;
    this.style.cursor='auto';
  }
  
}

// função associada ao click do rato
function myDown(e){
  getMouse(e);
  
  // Se estivermos sobre uma caixa de seleção
  if (expectResize !== -1) {
    isResizeDrag = true;
    return;
  }
  
  clearTodos(gctx);
  var l = anuncios.length;
  for (var i = l-1; i >= 0; i--) {
    // draw shape onto ghost context
    anuncios[i].desenhaTodos(gctx, 'black');
    
    // get image data at the mouse x,y pixel
    var imageData = gctx.getImageData(mx, my, 1, 1);
    var index = (mx + my * imageData.width) * 4;
    
    // if the mouse pixel exists, select and break
    if (imageData.data[3] > 0) {
      mySel = anuncios[i];
      offsetx = mx - mySel.xMolho;
      offsety = my - mySel.yMolho;
      mySel.xMolho = mx - offsetx;
      mySel.yMolho = my - offsety;
      isDrag = true;
      
      invalidate();
      clearTodos(gctx);
      return;
    }
    
  }
  // não foi nada selecionado
  mySel = null;
  // limpa o ghost canvas
  clearTodos(gctx);
  // invalida para permitir que as caixas de seleção desapareçam
  invalidate();
}


// quando o click do rato é libertado, devolve aos estados iniciais
function myUp(){
  isDrag = false;
  isResizeDrag = false;
  expectResize = -1;
}

// permite consultar as informações associadas a um anuncio
function myDblClick(e) {
  
  getMouse(e);
  
  clearTodos(gctx);
  var l = anuncios.length;
  for (var i = l-1; i >= 0; i--) {
    anuncios[i].desenhaTodos(gctx, 'black');
    // get image data at the mouse x,y pixel
    var imageData = gctx.getImageData(mx, my, 1, 1);
    var index = (mx + my * imageData.width) * 4;
    
    // if the mouse pixel exists, select and break
    if (imageData.data[3] > 0) {
      
      // recolhe as informações associadas a um anuncio
      mySel = anuncios[i];
      
      // passa as informações do anuncio à janela de diálogo
      $("#nomePost").text(" " + mySel.autor);
      $("#emailPost").text(" " + mySel.email);
      $("#cursoPost").val(mySel.curso);
      $("#temaPost").val(mySel.tema);
      $("#mensagemPost").text(" " + mySel.mensagem);
      
      var utilizadorAutenticado = Parse.User.current().get("username");
      var utilizadorAnuncio = mySel.autor;
      
      if (utilizadorAutenticado == utilizadorAnuncio) {
          
          $("#cursoPost").removeAttr('disabled');
          $("#temaPost").removeAttr('disabled');
          $("#mensagemPost").removeAttr('disabled');
          $("#editarAnuncio").removeAttr('disabled');
          $("#eliminarAnuncio").removeAttr('disabled');
      }
      
      dialogPost.dialog( "open" );
      
      

 invalidate();
 clearTodos(gctx);
 return;
    }
    
  }
  // nada foi selecionado
  mySel = null;
  // limpa o canvas
  clearTodos(gctx);
  
  invalidate();
}


function invalidate() { 
  canvasValid = false;
}

// recolhe as informações sobre a posição do rato
// exige alguns cuidados por causa dos paddings e etc
function getMouse(e) {
      var element = canvas, offsetX = 0, offsetY = 0;

      if (element.offsetParent) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
      }
      
      // Add padding and border style widths to offset
      offsetX += stylePaddingLeft;
      offsetY += stylePaddingTop;
 
      mx = e.pageX - offsetX;
      my = e.pageY - offsetY;
            
}


// inicia todos os métodos de desenho e manipulação dos anuncios no canvas


