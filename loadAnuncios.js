function loadAnuncios() {
    
    
    
    var query = new Parse.Query("Anuncio");
    query.include("tema");
    query.include("curso");
    query.include("user");
    query.find({               
       success: function (results) {
     for(x in results)
     {
	   var id = results[x].id;
       var utilizador = results[x].get("user").get("username");
       var emailUtilizador = results[x].get("user").get("email");
       var data = results[x].get("createdAt");
       data = $.datepicker.formatDate('dd/mm/yy',data);
       var mensagem = results[x].get("mensagem");
       var curso = results[x].get("curso").get("Nome");
       var tema = results[x].get("tema").get("Nome");
       var xMolho = results[x].get("xMolho");
       var yMolho = results[x].get("yMolho");
       var xRecentes = results[x].get("xRecentes");
       var yRecentes = results[x].get("yRecentes");
       var tamanho = results[x].get("tamanho");
       var tamanhoInit = results[x].get("tamanhoInit");
       var corCurso = results[x].get("curso").get("cor");
       var corTema = results[x].get("tema").get("corTema");
       var anuncio = new Anuncio(id,data,utilizador,emailUtilizador,tema,curso,mensagem,corTema,corCurso,xMolho,yMolho,xRecentes,yRecentes,tamanhoInit,tamanhoInit);
       anuncios.push(anuncio);
       console.log("carregar anuncios");
     }
     }, error: function (error) {
     alert("impossivel carregar anuncios");
      }                                                                                   
  });
}

loadAnuncios();