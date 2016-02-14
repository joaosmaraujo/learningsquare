Parse.initialize("e3m2iwFW1zVpdJzdIbxCitUYqbUJ6K2qQmfyyfmF", "5QJt1wksDLQ3zn4RZ6tmSNt26M6msancdkfwZ59C");

console.log("modelo de dados");
var anuncios = [];

function Anuncio(id,data,autor,email,tema,curso,mensagem,corTema,corCurso,xMolho,yMolho,xRecentes, yRecentes, tamanhoInicial, tamanho) {
	this.id = id;
	this.data = data;
	this.autor = autor;
    this.email = email;
	this.tema = tema;
	this.curso = curso;
	this.mensagem = mensagem;
	this.corTema = corTema;
    this.corCurso = corCurso;
	this.xMolho = xMolho;
	this.yMolho = yMolho;
	this.xRecentes = xRecentes;
	this.yRecentes = yRecentes;
	this.tamanhoInicial = tamanhoInicial;
	this.tamanho = tamanho;
	this.fontSize = 13;
	this.comentarios = [];
}

function Comentario(descricao,autor,data) {
    this.descricao = descricao;
    this.autor = autor;
    this.data = data;
}


