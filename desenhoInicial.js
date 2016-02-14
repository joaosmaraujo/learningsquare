function desenhoInicial() {

    console.log("desenhoInicial");

    
    
    var l = anuncios.length;
    for(var i = 0;i < l; i++) {
        anuncios[i].xMolho = xAux;
        if (anuncios[i].xMolho <= canvas.width - anuncios[i].tamanho) {
            anuncios[i].yMolho = yAux;
            xAux += anuncios[i].tamanho + 10;
        }
        else {
            xAux = 0;
            anuncios[i].yMolho = yAux;
            yAux += anuncios[i].tamanho + 10;
        }

        anuncios[i].desenhaTodos(ctx);              
                    
    }

}

desenhoInicial();