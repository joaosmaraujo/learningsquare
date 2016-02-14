var dialogPost;
var editarMensagem;
var editarCurso;
var editarTema;

$(function() {
      var dialogAnuncio;
      
      
      function checkLogin()
      {
            $("#utilizadorSessao").html(Parse.User.current().get("username"));
      }
      
      checkLogin();
      
      $("#logout").click(function(event)
      {
            Parse.User.logOut();
            location.href = "index.html";
      });
       
      function criarAnuncio()
      {
            
            var cursoAnuncio = $("#opcoes-curso option:selected").val();
            var temaAnuncio = $("#opcoes-tema option:selected").val();
            var mensagemAnuncio = $("#mensagem-anuncio").val();
            var anuncio = Parse.Object.extend("Anuncio");
            var xMolho = 0;
            var yMolho = 0;
            var xRecentes = 0;
            var yRecentes = 0;
            var an = new anuncio();
            var id = an.id;
            var utilizador = Parse.User.current().get("username");
            var data = $.datepicker.formatDate('dd/mm/yy', new Date());
            var corCurso = "";
            var corTema = "";
            var email = "";
            
            var query = new Parse.Query("Cursos");
            var query2 = new Parse.Query("Temas");
            var query3 = new Parse.Query("User");
            var query4 = new Parse.Query("Anuncio");
            query.include("curso");
            query.include("tema");
            query.include("user");
            query.equalTo("Nome", cursoAnuncio);
            query.find({
                  success: function (results) {
                        an.set("curso", results[0]);
                        an.set("cor",results[0].get("cor"));
                        corCurso = results[0].get("cor");
                        query2.equalTo("Nome", temaAnuncio);
                        query2.find({
                              success: function (results) {
                                    an.set("tema", results[0]);
                                    an.set("mensagem", mensagemAnuncio);
                                    query3.find({
                                          success: function (results) {
                                                an.set("user", results[0]);
                                                an.set("mensagem", mensagemAnuncio);
                                                an.set("tamanhoInit",200);
                                                an.set("tamanho",200);
                                                query4.find({
                                                      success:function(results) {
                                                    if(results.length != 0)
                                                    {
                                                          xMolho = results[results.length - 1].get("xMolho");
                                                          yMolho = results[results.length -1].get("yMolho");
                                                          if(xMolho <= canvas.width - (2* 200) - 30)
                                                          {
                                                                xMolho+=230;
                                                          }
                                                          else
                                                          {
                                                                xMolho = 0;
                                                                yMolho+=230;
                                                          }
                                                    }
                                                an.set("xMolho",xMolho);
                                                an.set("yMolho",yMolho);
                                                an.set("xRecentes",xRecentes);
                                                an.set("yRecentes",yRecentes);
                                                an.save({
                                                      success: function () {
                                                            var rect = new Anuncio(id,data,utilizador,email,temaAnuncio,cursoAnuncio,mensagemAnuncio,corTema,corCurso,xMolho,yMolho,xRecentes,yRecentes,200,200);
                                                            anuncios.push(rect);
                                                      }, error: function (error) {
                                                            alert("criação de anuncio falhou");
                                                      }
                                                });
                                                }, error: function (error) {
                                                console.log(error.message);
                                          }
                                    });
                                          }, error: function (error) {
                                                console.log(error.message);
                                          }
                                    });
                              }, error: function (error) {
                                    console.log(error.message);
                              }
                        });
                  }, error: function (error) {
                        console.log(error.message);
                  }
            });
            
            invalidate();
            
            dialogAnuncio.dialog( "close" );
      }
         
      
         
      dialogAnuncio = $( "#dialog-anuncio" ).dialog({
            autoOpen: false,
            height: 550,
            width: 450,
            modal: true,
            buttons: {
            "Publicar": criarAnuncio,
            Cancel: function() {
                  dialogAnuncio.dialog( "close" );
                  }
            },
            close: function() {
            $("#formulario-anuncio").reset;
                 // allFields.removeClass( "ui-state-error" );
            }
      });
        
      $("#formulario-anuncio").on( "submit", function( event ) {
            event.preventDefault();
            criarAnuncio();
      }); 
         
      $( "#adicionar-anuncio" ).button().on( "click", function() {
            dialogAnuncio.dialog( "open" );
      });
      
      
      
      
      
      dialogPost = $( "#post-informacao" ).dialog({
            
            autoOpen: false,
            height: 550,
            width: 450,
            modal: true,
            buttons: {
            
            },
            close: function() {
                $("#cursoPost").attr('disabled','disabled');
                $("#temaPost").attr('disabled','disabled');
                $("#mensagemPost").attr('disabled','disabled');
                $("#editarAnuncio").attr('disabled','disabled');
                $("#eliminarAnuncio").attr('disabled','disabled');
            $("#post-informacao").reset;
                
            }
      });
      
      $("#formulario-post").on( "submit", function( event ) {
            event.preventDefault();
            criarAnuncio();
      });
      
         
      $("#eliminarAnuncio").click(function () {
        var anuncio = Parse.Object.extend("Anuncio");
        var query = new Parse.Query(anuncio);
        query.get(mySel.id, {
          success: function (object) {
            object.destroy();
            anuncios.splice(anuncios.indexOf(mySel),1);
            dialogPost.dialog( "close" );
            invalidate();
            invalidate2();
          }, error: function (object, error) {
          }
        });
      });
      
     
   
      

      // query para editar anuncio
      $("#editarAnuncio").click(function () {
            
            var anuncio = Parse.Object.extend("Anuncio");
            var query = new Parse.Query(anuncio);
            var query2 = new Parse.Query("Cursos");
            var query3 = new Parse.Query("Temas");
            query.include("curso");
            query.include("tema");
            query.equalTo("objectId", mySel.id);
            query2.equalTo("Nome", $("#cursoPost").val());
            query3.equalTo("Nome", $("#temaPost").val());
            query.first({
            success: function (object) {
                  object.set("mensagem", $("#mensagemPost").val());
                  mySel.mensagem = $("#mensagemPost").val();
                  query2.find({
                    success: function (results) {
                        object.set("curso", results[0]);
                        
                        mySel.curso = $("#cursoPost").val();
                        mySel.corCurso = results[0].get("cor");
                        query3.find({
                            success: function (results) {
                                object.set("tema", results[0]);
                                mySel.tema = $("#temaPost").val();
                                object.save();
                                dialogPost.dialog( "close" );
                        }, error: function (error) {
                        alert("impossivel editar");
                        }
                  });
                  $("#cursoPost").attr('disabled','disabled');
                  $("#temaPost").attr('disabled','disabled');
                  $("#mensagemPost").attr('disabled','disabled');
                  $("#editarAnuncio").attr('disabled','disabled');
                  $("#eliminarAnuncio").attr('disabled','disabled');
                  
                  invalidate();
                  }, error: function (error) {
                  alert("impossivel editar");
                  }
                  })
            }, error: function (error) {
                  alert("impossivel editar");
            }
            });
      
      });
      
 
      
      
         
});