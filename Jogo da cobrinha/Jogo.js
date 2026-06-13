const canvas = document.getElementById("Jogo");
const ctx = canvas.getContext("2d");

const grid = 20;

let jogoAtivo = true;
let esperandoReinicio = false;

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
}

function desenhaCobra() {
    ctx.fillStyle = "lime";

    cobra.forEach(segmento => {
        ctx.fillRect(
            segmento.x,
            segmento.y,
            grid - 2,
            grid - 2
        );
    });
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
        comida.x =
            Math.floor(Math.random() * (canvas.width / grid)) * grid;

        comida.y =
            Math.floor(Math.random() * (canvas.height / grid)) * grid;
    } else {
        cobra.pop();
    }
}

document.addEventListener("keydown", e => {

    if (esperandoReinicio) {
        reiniciarJogo();
        return;
    }

    if (e.key === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -grid;
    }

    if (e.key === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = grid;
    }

    if (e.key === "ArrowLeft" && dx === 0) {
        dx = -grid;
        dy = 0;
    }

    if (e.key === "ArrowRight" && dx === 0) {
        dx = grid;
        dy = 0;
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
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "PERDEU!",
        canvas.width / 2,
        canvas.height / 2 - 20
    );

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    ctx.fillText(
        "Pressione qualquer tecla",
        canvas.width / 2,
        canvas.height / 2 + 30
    );
}

function gameLoop() {

    if (!jogoAtivo) {
        desenhaGameOver();
        return;
    }

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
}

setInterval(gameLoop, 120);