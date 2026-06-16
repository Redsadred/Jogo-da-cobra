const canvas = document.getElementById("Jogo");
const ctx = canvas.getContext("2d");

const grid = 20;

let jogoAtivo = true;
let esperandoReinicio = false;
let mudouDirecao = false;
let estado = "menu";
let pontos = 0;
let cobra = [
    { x: 200, y: 200 }
];

let dx = grid;
let dy = 0;

let comida = {
    x: 100,
    y: 100
};

function reiniciarJogo() {
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

function desenhaCobra() {
    ctx.fillStyle = "Lime";

    cobra.forEach(segmento => {
        ctx.fillRect(
            segmento.x,
            segmento.y,
            grid,
            grid
        );
    });
}

function desenhaMenu() {
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

function desenhaComida() {
    ctx.fillStyle = "red";

    ctx.fillRect(
        comida.x,
        comida.y,
        grid - 2,
        grid - 2
    );
}

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

        comida.x =
            Math.floor(Math.random() * (canvas.width / grid)) * grid;

        comida.y =
            Math.floor(Math.random() * (canvas.height / grid)) * grid;
    } else {
        cobra.pop();
    }
}

function desenhaPontos() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";

    ctx.fillText(
        "Pontos: " + pontos,
        10,
        25
    );
}

document.addEventListener("keydown", e => {

    if (mudouDirecao) return;

    if (esperandoReinicio) {
        reiniciarJogo();
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

function desenhaGameOver() {
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
        "Pressione qualquer tecla para recomeçar",
        canvas.width / 2,
        canvas.height / 2 + 55
    )
}

function gameLoop() {

    if (estado === "menu") {
        desenhaMenu();
        return;
    }

    if (!jogoAtivo) {
        desenhaGameOver();
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

    desenhaComida();
    desenhaCobra();
    desenhaPontos();
}
setInterval(gameLoop, 120);