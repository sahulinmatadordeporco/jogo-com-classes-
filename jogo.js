const canvas = document.querySelector("#jogo2D");
const ctx = canvas.getContext("2d");

class Entidade {
    constructor(x, y, largura, altura) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    }
}

class Personagem extends Entidade {
    constructor(x, y, largura, altura, velocidadeY, forcaPulo) {
        super(x, y, largura, altura);
        this.velocidadeY = velocidadeY;
        this.pulando = false;
        this.forcaPulo = forcaPulo;
        this.chao = canvas.height - altura;
    }

    get gravidade() {
        return 0.8;
    }

    desenhar() {
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }

    atualizar() {
        if (this.pulando) {
            this.velocidadeY += this.gravidade;
            this.y += this.velocidadeY;
            if (this.y >= this.chao) {
                this.y = this.chao;
                this.velocidadeY = 0;
                this.pulando = false;
            }
        }
    }
}

class Obstaculo extends Entidade {
    constructor(x, y, largura, altura, velocidadeX) {
        super(x, y, largura, altura);
        this.velocidadeX = velocidadeX;
    }

    desenhar() {
        ctx.fillStyle = "Yellow";
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }

    atualizar() {
        this.x -= this.velocidadeX;
        if (this.x <= 0 - this.largura) {
            this.x = canvas.width;
            this.velocidadeX += 0.2;
            let nova_altura = (Math.random() * 50) + 45;
            this.altura = nova_altura;
            this.y = canvas.height - nova_altura;
            contadorObstaculos++;
        }
    }
}

let personagem = new Personagem(30, 130, 20, 20, 0, 14);
let obstaculo = new Obstaculo(canvas.width - 20, canvas.height - 70, 20, 70, 3);

let gameOver = false;
let contadorObstaculos = 0;

document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !personagem.pulando && !gameOver) {
        personagem.pulando = true;
        personagem.velocidadeY = -personagem.forcaPulo;
    }
});

function desenharContador() {
    ctx.fillStyle = "white";
    ctx.font = "15px Arial";
    ctx.fillText(contadorObstaculos, 10, 30);
}

function verificarColisao() {
    if (personagem.x < obstaculo.x + obstaculo.largura &&
        personagem.x + personagem.largura > obstaculo.x &&
        personagem.y < obstaculo.y + obstaculo.altura &&
        personagem.y + personagem.altura > obstaculo.y) {
        gameOver = true;
        mostrarBotaoReiniciar();
        desenharGameOver();
    }
}

function desenharGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "15px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
}

function mostrarBotaoReiniciar() {
    const botao = document.createElement("button");
    botao.textContent = "Reiniciar";
    botao.id = "botaoReiniciar";
    document.body.appendChild(botao);

    botao.addEventListener("click", reiniciarJogo);
}

function reiniciarJogo() {
    personagem = new Personagem(30, 130, 20, 20, 0, 14);
    obstaculo = new Obstaculo(canvas.width - 20, canvas.height - 70, 20, 70, 3);
    contadorObstaculos = 0;
    gameOver = false;
    document.querySelector("#botaoReiniciar").remove();
    loop();
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    personagem.desenhar();
    obstaculo.desenhar();
    personagem.atualizar();
    obstaculo.atualizar();
    desenharContador();
    verificarColisao();

    if (!gameOver) {
        requestAnimationFrame(loop);
    }
}

loop();