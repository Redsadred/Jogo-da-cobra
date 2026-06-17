const canvas = document.getElementById("Jogo");
const ctx = canvas.getContext("2d");

const grid = 20;

let jogoAtivo = true;
let esperandoReinicio = false;
let mudouDirecao = false;
let estado = "menu";
let pontos = 0;
let recorde = 0;
let cobra = [
    { x: 200, y: 200 }
];

let dx = grid;
let dy = 0;

let comida = {
    x: 100,
    y: 100
};

//Função para reiniciar o jogo
function reiniciar() {
    cobra = [
        { x: 200, y: 200 }
    ];

    dx = grid;
    dy = 0;

    comida = {
        x: 100,
        y: 100
    };

    jogoAtivo = true;
    esperandoReinicio = false;
    pontos = 0;
}

//Função para desenhar a cobra
function dCobra() {

    cobra.forEach((segmento, indice) => {

        if (indice === 0) {

            // Cabeça
            ctx.fillStyle = "#00ff00";
                        quad(
                segmento.x,
                segmento.y,
                grid,
                grid,
                6
            );

            // Olhos
            ctx.fillStyle = "black";

            if (dx > 0) { // direita
                ctx.fillRect(segmento.x + 13, segmento.y + 5, 3, 3);
                ctx.fillRect(segmento.x + 13, segmento.y + 12, 3, 3);
            }

            else if (dx < 0) { // esquerda
                ctx.fillRect(segmento.x + 4, segmento.y + 5, 3, 3);
                ctx.fillRect(segmento.x + 4, segmento.y + 12, 3, 3);
            }

            else if (dy < 0) { // cima
                ctx.fillRect(segmento.x + 5, segmento.y + 4, 3, 3);
                ctx.fillRect(segmento.x + 12, segmento.y + 4, 3, 3);
            }

            else if (dy > 0) { // baixo
                ctx.fillRect(segmento.x + 5, segmento.y + 13, 3, 3);
                ctx.fillRect(segmento.x + 12, segmento.y + 13, 3, 3);
            }

            //Corpo
        } else {

            ctx.fillStyle = "Lime";
            quad(
                segmento.x,
                segmento.y,
                grid,
                grid,
                5
            );
        }
    });
}
//Função para desenhar o menu
function dMenu() {
    ctx.fillStyle = "Green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "JOGO DA COBRINHA",
        canvas.width / 2,
        canvas.height / 2 - 10
    );

    ctx.font = "20px Arial";

    ctx.fillText(
        "Pressione ENTER para jogar",
        canvas.width / 2,
        canvas.height / 2 + 30
    );
}
//Função para desenhar a comida
function dComida() {
    ctx.fillStyle = "red";

    ctx.fillRect(
        comida.x,
        comida.y,
        grid - 2,
        grid - 2
    );
}
//Função para arredondar a cobra
function quad(x, y, l, a, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, l, a, r);
    ctx.fill();
}
//Função para atualizar a posição da cobra
function atualizar() {
    const cabeca = {
        x: cobra[0].x + dx,
        y: cobra[0].y + dy
    };

    cobra.unshift(cabeca);

    if (
        cabeca.x === comida.x &&
        cabeca.y === comida.y
    ) {
        pontos++;
        if (pontos > recorde) {
            recorde = pontos;
        }

        gerarComida();
    } else {
        cobra.pop();
    }
}
//Função para desenhar os pontos e o recorde
function dPontos() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";

    ctx.fillText(
        "Pontos: " + pontos,
        10,
        25
    );

    ctx.fillText(
        "Recorde: " + recorde,
        10,
        50
    );
}
//Função para gerar a comida em uma posição aleatória, garantindo que não apareça sobre a cobra
function gerarComida() {

    let posicaoValida = false;

    while (!posicaoValida) {

        comida.x =
            Math.floor(Math.random() * (canvas.width / grid)) * grid;

        comida.y =
            Math.floor(Math.random() * (canvas.height / grid)) * grid;

        posicaoValida = true;

        for (let segmento of cobra) {

            if (
                segmento.x === comida.x &&
                segmento.y === comida.y
            ) {
                posicaoValida = false;
                break;
            }
        }
    }
}
//Evento para controlar a direção da cobra e reiniciar o jogo
document.addEventListener("keydown", e => {

    if (mudouDirecao) return;

    if (esperandoReinicio) {

        if (e.key === "Enter") {
            reiniciar();
        }

        return;
    }
    if (estado === "menu") {
        if (e.key === "Enter") {
            estado = "jogando";
        }
        return;
    }

    if (e.key === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -grid;
        mudouDirecao = true;
    }

    if (e.key === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = grid;
        mudouDirecao = true;
    }

    if (e.key === "ArrowLeft" && dx === 0) {
        dx = -grid;
        dy = 0;
        mudouDirecao = true;
    }

    if (e.key === "ArrowRight" && dx === 0) {
        dx = grid;
        dy = 0;
        mudouDirecao = true;
    }
});
//Função para verificar colisões com as paredes e com o próprio corpo
function Colisoes() {
    const cabeca = cobra[0];

    if (
        cabeca.x < 0 ||
        cabeca.y < 0 ||
        cabeca.x >= canvas.width ||
        cabeca.y >= canvas.height
    ) {
        jogoAtivo = false;
        esperandoReinicio = true;
        return;
    }

    for (let i = 1; i < cobra.length; i++) {
        if (
            cabeca.x === cobra[i].x &&
            cabeca.y === cobra[i].y
        ) {
            jogoAtivo = false;
            esperandoReinicio = true;
            return;
        }
    }
}
//Função para desenhar a tela de game over
function dGamerOver() {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "PERDEU!",
        canvas.width / 2,
        canvas.height / 2 - 10
    );

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    ctx.fillText(
        "Você fez " + pontos + " pontos",
        canvas.width / 2,
        canvas.height / 2 + 30
    );
    ctx.fillText(
        "Pressione ENTER para recomeçar",
        canvas.width / 2,
        canvas.height / 2 + 55
    )
}
//Função principal do jogo, responsável por atualizar o estado do jogo e desenhar os elementos na tela
function gameLoop() {

    if (estado === "menu") {
        dMenu();
        return;
    }

    if (!jogoAtivo) {
        dGamerOver();
        return;
    }

    mudouDirecao = false;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    atualizar();
    Colisoes();

    dComida();
    dCobra();
    dPontos();
}
setInterval(gameLoop, 120);