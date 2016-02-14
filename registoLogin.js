 $(function() {
    var dialog, dialog2;
    var erroRegisto = "";
 
    function addUser() {
      var validacoes = true;
      
      var nome = $("#name").val();
      var email = $("#email").val();
      var password = $("#password").val();
      var contemArroba = false;
      
      
      for(var i = 0; i < email.length; i++) {
          if (email.charAt(i) == '@') {
              contemArroba = true;
          }
      }
      
      if (nome.length < 3 || nome.length > 16) {
          validacoes = false;
          erroRegisto+= "O nome de utilizador deve ter entre 3 e 16 caracteres.<br>";
          console.log(erroRegisto); 
      }
      if (contemArroba == false) {
          validacoes = false;
          erroRegisto += "Insira um e-mail válido.<br>";
          console.log(erroRegisto);
      }
      if (password.length < 5 || password.length > 16) {
          validacoes = false;
          erroRegisto += "A password deve ter entre 5 e 16 caracteres.<br>";
          console.log(erroRegisto);
      }
      
      if (validacoes == true) {
          registo();
          dialog.dialog("close");
          $("#name").val('');
          $("#email").val('');
          $("#password").val('');
      }
      else {
          $("#mensagemErroRegisto").html(erroRegisto);
      }
      
      function registo() {
        

        var user = new Parse.User();
        user.set("username", nome);
        user.set("email", email);
        user.set("password", password);

        user.signUp(null, {
          success: function (user) {
            alert("Registo efetuado com sucesso");
          }, error: function (user,error) {
          }
        });
      }
        
      
      
    }
 
    dialog = $( "#dialog-registo" ).dialog({
      autoOpen: false,
      height: 500,
      width: 450,
      modal: true,
      buttons: {
        "Registar": addUser,
        "Cancelar": function() {
          dialog.dialog( "close" );
          $("#name").val('');
          $("#email").val('');
          $("#password").val('');
        }
      },
      close: function() {
        $("#formulario-registo").reset;
      }
    });
 
    $("#formulario-registo").on( "submit", function( event ) {
      event.preventDefault();
      addUser();
    }); 
 
    $( "#registar" ).button().on( "click", function() {
      dialog.dialog( "open" );
    });
    
    
    // janela modal do login
    
      
    
    dialog2 = $( "#dialog-login" ).dialog({
      autoOpen: false,
      height: 500,
      width: 450,
      modal: true,
      buttons: {
        "Entrar":  logIn, // restricoes a rever
        "Cancelar": function() {
          dialog2.dialog( "close" );
          $("#nome-login").val('');
          $("#password-login").val('');
        }
      },
      close: function() {
        $("#formulario-login").reset;
        //allFields.removeClass( "ui-state-error" );
      }
    });
 
    $("#formulario-login").on( "submit", function( event ) {
      event.preventDefault();
      logIn();
    });
   
    $( "#login" ).button().on( "click", function() {
      dialog2.dialog( "open" );
    });
    
    function logIn() {
        var nome = $("#nome-login").val();
        var password = $("#password-login").val();
        Parse.User.logIn(nome, password,
            {
                success: function () {
                console.log("login succes");
                location.href = "postsPage.html";
                $("#nome-login").val('');
                $("#password-login").val('');
                }, error: function () {
                $("#mensagemErroLogin").html("Erro no login!" + '<br>' + "Verifique o nome de utilizador e/ou password introduzidos.")
                }
            });
    }

    
});