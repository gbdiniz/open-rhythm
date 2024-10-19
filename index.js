const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = new Image();
player.src = 'media/sprites/player1.png';

const arrowLeft = new Image();
arrowLeft.src = 'media/sprites/arrows/arrowLeft.png';

const arrowRight = new Image();
arrowRight.src = 'media/sprites/arrows/arrowRight.png';

const arrowUp = new Image();
arrowUp.src = 'media/sprites/arrows/arrowUp.png';

const arrowDown = new Image();
arrowDown.src = 'media/sprites/arrows/arrowDown.png';

// let playerFrames = [];

let score = 0;
let notes = [];  // Armazena as notas
let keyNotes = [arrowLeft, arrowDown, arrowUp, arrowRight];  // Armazena as notas
let speed = 2;   // Velocidade de descida das notas
let keys = {};   // Para registrar teclas pressionadas
let hitTolerance = 30;  // Tolerância de colisão para acerto
let hitLineY = 600;  // Linha onde o jogador deve acertar as notas
let feedback = [];  // Para armazenar o feedback de precisão ("Perfect", "Good", etc.)
let feedbackDuration = 400;  // Duração do feedback na tela (ms)

// Carregar a música
const music = new Audio('media/musics/music1.mp3');

const beatMap = [
    { time: 1000, direction: 'left' },
    { time: 1500, direction: 'down' },
    { time: 2000, direction: 'up' },
    { time: 2500, direction: 'right' },
    { time: 3000, direction: 'left' },
    { time: 3500, direction: 'down' },
    // Adicione mais tempos conforme necessário
];

let nextNoteIndex = 0;  // Controla qual nota será gerada a seguir

// Iniciar o jogo e tocar a música
function startGame() {
    music.play();
    gameLoop();
}

document.getElementById("gameCanvas").onclick = startGame;

// Função para desenhar as notas
function drawNotes() {
    notes.forEach(note => {
        ctx.drawImage(note.img, note.x, note.y, 50, 50);
    });

    // keyNotes.forEach(key => {
    //     ctx.drawImage(key.img, key.x, key.y, 50, 50);
    // });
}

// Função para criar uma nota
function spawnNote(direction) {
    let srcImg = new Image();
    srcImg.src = direction === 'left' ? 'media/sprites/arrows/arrowLeftActive.png' : direction === 'down' ? 'media/sprites/arrows/arrowDownActive.png' : direction === 'up' ? 'media/sprites/arrows/arrowUpActive.png' : 'media/sprites/arrows/arrowRightActive.png';
    const note = {
        x: direction === 'left' ? 60 : direction === 'down' ? 120 : direction === 'up' ? 180 : 240,
        y: 0,
        direction: direction,
        img: srcImg
    };
    notes.push(note);
}

// Função para mover as notas
function moveNotes() {
    notes.forEach((note, index) => {
        note.y += speed;  // Mover para baixo
        if (note.y > canvas.height) {
            score -= 50;  // Adicionar à pontuação
            notes.splice(index, 1);  // Remover a nota se sair da tela
            registerFeedback('Miss', note.x);
        }
    });
}

// Função para desenhar a linha de colisão
function drawHitLine() {

    keyNotes.forEach(keyNote => {
        switch (keyNote) {
            case arrowLeft:
                ctx.drawImage(arrowLeft, 60, 600, 50, 50);
                break;

            case arrowDown:
                ctx.drawImage(arrowDown, 120, 600, 50, 50);
                break;

            case arrowUp:
                ctx.drawImage(arrowUp, 180, 600, 50, 50);
                break;

            case arrowRight:
                ctx.drawImage(arrowRight, 240, 600, 50, 50);
                break;
        }
    })

    ctx.drawImage(player, canvas.width - 615, 400, 200, 200);
}


// Função para desenhar o feedback (Perfect, Good, Miss)
function drawFeedback() {
    feedback.forEach((fb, index) => {
        if(fb.text === 'Miss') {
            ctx.fillStyle = 'gray';
        } else if(fb.text === 'Ok') {
            ctx.fillStyle = 'white';
        } else if(fb.text === 'Good') {
            ctx.fillStyle = 'green';
        } else {
            ctx.fillStyle = 'blue';
        }
     
        ctx.font = '40px Modak';
        ctx.shadowColor = "black";
        ctx.shadowBlur = 1;
        ctx.lineWidth = 5;

        ctx.fillText(fb.text, 350, hitLineY - 130);  // Exibir o texto acima da linha de colisão

        // Remover feedback após o tempo de exibição
        if (Date.now() - fb.time > feedbackDuration) {
            feedback.splice(index, 1);
        }
    });
}

// Função para registrar o feedback de precisão
function registerFeedback(type, x) {
    feedback.push({
        text: type,
        x: x,
        time: Date.now()  // Marcar o tempo para controlar a duração
    });
}

// Função para checar se o jogador acertou a nota
function checkHit(direction) {
    let hit = false;
    notes.forEach((note, index) => {
        if (note.direction === direction) {
            let distance = Math.abs(note.y - hitLineY);
            if (distance < hitTolerance) {
                // Definir a precisão com base na proximidade
                if (distance < 10) {
                    registerFeedback('Perfect', note.x);
                    score += 300;
                } else if (distance < 20) {
                    registerFeedback('Good', note.x);
                    score += 200;
                } else {
                    registerFeedback('Ok', note.x);
                    score += 100;
                }
                notes.splice(index, 1);  // Remove a nota acertada
                hit = true;
            }
        }
    });
    if (!hit) {
        registerFeedback('Miss', direction === 'left' ? 100 : direction === 'down' ? 250 : direction === 'up' ? 400 : 550);
        score -= 50;  // Penalidade se apertar sem acertar nota
    }
}

// Função para detectar as teclas
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
    if (event.key === 'a') checkHit('left');
    if (event.key === 's') checkHit('down');
    if (event.key === 'w') checkHit('up');
    if (event.key === 'd') checkHit('right');
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Função principal de loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpar o canvas

    drawHitLine();  // Desenhar a linha de colisão
    moveNotes();  // Mover as notas
    drawNotes();  // Desenhar as notas
    drawFeedback();  // Desenhar o feedback de precisão

    // Exibir a pontuação
    document.getElementById('score').innerText = 'Score: ' + score;

    if (nextNoteIndex < beatMap.length && music.currentTime * 1000 >= beatMap[nextNoteIndex].time) {
        spawnNote(beatMap[nextNoteIndex].direction);  // Criar nota na direção especificada
        nextNoteIndex++;  // Avançar para a próxima nota da lista
    }

    requestAnimationFrame(gameLoop);
}