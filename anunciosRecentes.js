$(document).ready(function(){
   

var canvas2, altura2, largura2, ctx2;
var INTERVAL2 = 30;
var canvasValid2 = false;
var isDrag2 = false;

function initRecentes() {
  canvas2 = document.getElementById('mais-recentes');
  altura2 = canvas2.height;
  largura2 = canvas2.width;
  ctx2 = canvas2.getContext('2d');
  /*ghostcanvas = document.createElement('canvas');
  ghostcanvas.height = HEIGHT2;
  ghostcanvas.width = WIDTH2;
  gctx = ghostcanvas.getContext('2d');*/
  
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas2.onselectstart = function () { return false; }
  
  // fixes mouse co-ordinate problems when there's a border or padding
  // see getMouse for more detail
  if (document.defaultView && document.defaultView.getComputedStyle) {
    stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas2, null)['paddingLeft'], 10)     || 0;
    stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas2, null)['paddingTop'], 10)      || 0;
    styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas2, null)['borderLeftWidth'], 10) || 0;
    styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas2, null)['borderTopWidth'], 10)  || 0;
  }
  
  // executa o mainDraw2() e atualiza a cada INTERVAL2 mili-segundos
  setInterval(mainDraw2, INTERVAL2);
  
  // NECESSÁRIO DEFINIR OS EVENTOS ASSOCIADOS AO RATO

  canvas2.onmousedown = myDownRecentes;
  canvas2.onmouseup = myUpRecentes;
  //canvas2.ondblclick = PERMITIR CONSULTAR AS INFORMAÇÕES DO ANUNCIO 
  canvas2.onmousemove = myMoveRecentes;
 
  
}

function resetCoordenadasRecentes() {
    
    var horizontalAux = 0;
    
    var l = anuncios.length;
        for (var i = l-1; i >= 0; i--) {
            anuncios[i].xRecentes = horizontalAux;
            horizontalAux += 230;
    }
    
    
}

function mainDraw2() {
    
    if(!isDrag2) {
        resetCoordenadasRecentes();
    }
  
   
    // desenha todos os anúncios
    
    if (canvasValid2 == false) {
        
        
        console.log(anuncios.length);
        
        clearRecentes(ctx2);
        var l = anuncios.length;
        for (var i = 0; i < l; i++) {
            anuncios[i].desenhaRecentes(ctx2);
            
        }
        canvasValid2 = true;
    }
    
}

function clearRecentes(c) {
  c.clearRect(0, 0, largura2, altura2);
}


function myDownRecentes(e){
  getMouse(e);
  clearRecentes(gctx);
  isDrag2 = true;
  var l = anuncios.length;
  for (var i = l-1; i >= 0; i--) {
    // draw shape onto ghost context
    anuncios[i].desenhaRecentes(gctx, 'black');
    
    
    // get image data at the mouse x,y pixel
    var imageData = gctx.getImageData(mx, my, 1, 1);
    var index = (mx + my * imageData.width) * 4;
    
    // if the mouse pixel exists, select and break
    /*if (imageData.data[3] > 0) {
      //mySel = anuncios[i];
      /*offsetx = mx - anuncios[i].xRecentes;
      offsety = my - anuncios[i].yRecentes;
      anuncios[i].xRecentes = mx - offsetx;
      anuncios[i].yRecents = my - offsety;*/
      
      isDrag2 = true;
      
      invalidate2();
      clearRecentes(gctx);
      return;
    //}
    
  }
  // não foi nada selecionado
  mySel = null;
  // limpa o ghost canvas
  clearRecentes(gctx);
  // invalida para permitir que as caixas de seleção desapareçam
  invalidate2();
  if (mx <= 0 || mx >= largura2) {
    isDrag2 = false;
  }
  
}

function myMoveRecentes(e){
  
  // verifica se o rato está pressionado e se estiver define a posição do rectângulo selecionado  
  if (isDrag2) {
    lastx = mx;
    getMouse(e);
    offsetx = mx - lastx;
    var l = anuncios.length;
    for (var i = l-1; i >= 0; i--) {
      
      anuncios[i].xRecentes += offsetx;
    }
    
    // invalida o canvas porque alguma coisa se está a mover
    invalidate2();
    
  }
  
}

function invalidate2() {
    canvasValid2 = false;
}


function myUpRecentes(){
  isDrag2 = false;
}

initRecentes();


});