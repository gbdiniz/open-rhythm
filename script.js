// Tela do jogo
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameOnAction = false;

function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Chama a função ao carregar a página
ajustarCanvas();

// Chama a função ao redimensionar a janela
window.addEventListener('resize', ajustarCanvas);

const frameDuration = 100;

let score = 0;

let maxPossibleScore = 139500;
let notes = [];  // Armazena as notas

const arrows = {
    left: new Image(),
    right: new Image(),
    up: new Image(),
    down: new Image()
};

arrows.left.src = 'media/sprites/arrows/arrowLeft.png';
arrows.right.src = 'media/sprites/arrows/arrowRight.png';
arrows.up.src = 'media/sprites/arrows/arrowUp.png';
arrows.down.src = 'media/sprites/arrows/arrowDown.png';

let keyNotes = [arrows.left, arrows.down, arrows.right, arrows.up];

let hit;

let speed = 6;   // Velocidade de descida das notas
let keys = {};   // Para registrar teclas pressionadas
let hitTolerance = 60;  // Tolerância de colisão para acerto
let hitLineY = canvas.height / 1.2;  // Linha onde o jogador deve acertar as notas

let life = 100;

let feedback = [];  // Para armazenar o feedback de precisão ("Perfect", "Good", etc.)
let feedbackDuration = 400;  // Duração do feedback na tela (ms)

const arrowSizeX = 60; const arrowSizeY = 60;
let xPos = canvas.width / 2 - arrowSizeX / 2;
let xLeftPos = xPos - 100;
let xDownPos = xPos - 35;
let xUpPos = xPos + 35;
let xRightPos = xPos + 100;

const playerSizeX = 410; const playerSizeY = 410;

const opponentSizeX = 350; const opponentSizeY = 337.5;

let nextNoteIndex = 0;  // Controla qual nota será gerada a seguir

// Carregar a música
const music = new Audio('media/musics/music2.mp3');

const missNote1 = new Audio('media/sounds/missnote1.ogg');
const missNote2 = new Audio('media/sounds/missnote2.ogg');
const missNote3 = new Audio('media/sounds/missnote3.ogg');

const animations = {
    playerIdle: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    playerUp: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    playerDown: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    playerLeft: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    playerRight: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    opponentIdle: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    opponentUp: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    opponentDown: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    opponentLeft: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    opponentRight: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    arrowUpPressed: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    arrowDownPressed: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    arrowLeftPressed: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    arrowRightPressed: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    arrowUpPressedNull: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    arrowDownPressedNull: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    arrowLeftPressedNull: { frames: [], currentFrame: 0, lastFrameTime: 0 },
    arrowRightPressedNull: { frames: [], currentFrame: 0, lastFrameTime: 0 }
};

function loadFrames(animationName, frameCount, filePath) {
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = `${filePath}${i}.png`;
        animations[animationName].frames.push(img);
    }
}

loadFrames('playerIdle', 5, 'media/sprites/player/player2/player');
loadFrames('playerUp', 2, 'media/sprites/player/player2/player_up');
loadFrames('playerDown', 2, 'media/sprites/player/player2/player_down');
loadFrames('playerLeft', 2, 'media/sprites/player/player2/player_left');
loadFrames('playerRight', 2, 'media/sprites/player/player2/player_right');

loadFrames('opponentIdle', 1, 'media/sprites/opponent/opponent');
loadFrames('opponentUp', 1, 'media/sprites/opponent/opponent_up');
loadFrames('opponentDown', 1, 'media/sprites/opponent/opponent_down');
loadFrames('opponentLeft', 1, 'media/sprites/opponent/opponent_left');
loadFrames('opponentRight', 1, 'media/sprites/opponent/opponent_right');

loadFrames('arrowUpPressed', 2, 'media/sprites/arrows/arrowUpPressed');
loadFrames('arrowDownPressed', 2, 'media/sprites/arrows/arrowDownPressed');
loadFrames('arrowLeftPressed', 2, 'media/sprites/arrows/arrowLeftPressed');
loadFrames('arrowRightPressed', 2, 'media/sprites/arrows/arrowRightPressed');

loadFrames('arrowUpPressedNull', 2, 'media/sprites/arrows/arrowUpPressedNull');
loadFrames('arrowDownPressedNull', 2, 'media/sprites/arrows/arrowDownPressedNull');
loadFrames('arrowLeftPressedNull', 2, 'media/sprites/arrows/arrowLeftPressedNull');
loadFrames('arrowRightPressedNull', 2, 'media/sprites/arrows/arrowRightPressedNull');

// Iniciar o jogo e tocar a música
function startGame() {
    document.getElementById("initialScreen").style.display = "none";
    document.getElementById("finalScreen").style.display = "none";
    document.getElementById("gameCanvas").style.opacity = 1;
    gameOnAction = true;
    score = 0;
    life = 100;
    music.currentTime = 0
    music.play();
    gameLoop();
}

document.getElementById("play").onclick = startGame;
document.getElementById("playAgain").addEventListener("click", () => {
    document.getElementById("initialScreen").style.display = "none";
    document.getElementById("finalScreen").style.display = "none";
    document.getElementById("gameCanvas").style.opacity = 1;
    nextNoteIndex = 0;
    music.currentTime = 0;
    music.play();
    gameOnAction = true;
    score = 0;
    life = 100;
});

// Função para desenhar as notas
function drawNotes(timestamp) {
    notes.forEach(note => {
        let currentAnimation;
        if (note.direction == 'left' && hit == true) {
            if (keys['ArrowLeft'] || keys['a']) {
                currentAnimation = animations.arrowLeftPressed;

                if (timestamp - currentAnimation.lastFrameTime > frameDuration) {
                    currentAnimation.currentFrame = (currentAnimation.currentFrame + 1) % currentAnimation.frames.length;
                    currentAnimation.lastFrameTime = timestamp;
                }

                ctx.drawImage(note.img, note.x, note.y, arrowSizeX, arrowSizeY);

                ctx.drawImage(currentAnimation.frames[currentAnimation.currentFrame], xLeftPos, canvas.height / 1.2, arrowSizeX, arrowSizeY);
            } else {
                ctx.drawImage(note.img, note.x, note.y, arrowSizeX, arrowSizeY);
            }
        } else if (note.direction == 'up' && hit == true) {
            if (keys['ArrowUp'] || keys['w']) {
                currentAnimation = animations.arrowUpPressed;

                if (timestamp - currentAnimation.lastFrameTime > frameDuration) {
                    currentAnimation.currentFrame = (currentAnimation.currentFrame + 1) % currentAnimation.frames.length;
                    currentAnimation.lastFrameTime = timestamp;
                }

                ctx.drawImage(note.img, note.x, note.y, arrowSizeX, arrowSizeY);

                ctx.drawImage(currentAnimation.frames[currentAnimation.currentFrame], xUpPos, canvas.height / 1.2, arrowSizeX, arrowSizeY);
            } else {
                ctx.drawImage(note.img, note.x, note.y, arrowSizeX, arrowSizeY);
            }
        } else if (note.direction == 'down' && hit == true) {
            if (keys['ArrowDown'] || keys['s']) {
                currentAnimation = animations.arrowDownPressed;

                if (timestamp - currentAnimation.lastFrameTime > frameDuration) {
                    currentAnimation.currentFrame = (currentAnimation.currentFrame + 1) % currentAnimation.frames.length;
                    currentAnimation.lastFrameTime = timestamp;
                }

                ctx.drawImage(note.img, note.x, note.y, arrowSizeX, arrowSizeY);

                ctx.drawImage(currentAnimation.frames[currentAnimation.currentFrame], xDownPos, canvas.height / 1.2, arrowSizeX, arrowSizeY);
            } else {
                ctx.drawImage(note.img, note.x, note.y, arrowSizeX, arrowSizeY);
            }
        } else if (note.direction == 'right' && hit == true) {
            if (keys['ArrowRight'] || keys['d']) {
                currentAnimation = animations.arrowRightPressed;

                if (timestamp - currentAnimation.lastFrameTime > frameDuration) {
                    currentAnimation.currentFrame = (currentAnimation.currentFrame + 1) % currentAnimation.frames.length;
                    currentAnimation.lastFrameTime = timestamp;
                }

                ctx.drawImage(note.img, note.x, note.y, arrowSizeX, arrowSizeY);

                ctx.drawImage(currentAnimation.frames[currentAnimation.currentFrame], xRightPos, canvas.height / 1.2, arrowSizeX, arrowSizeY);
            } else {
                ctx.drawImage(note.img, note.x, note.y, arrowSizeX, arrowSizeY);
            }
        } else {
            ctx.drawImage(note.img, note.x, note.y, arrowSizeX, arrowSizeY);
        }
    });

}

// Função para criar uma nota
function spawnNote(direction) {
    let srcImg = new Image();
    srcImg.src = direction === 'left' ?
        'media/sprites/arrows/arrowLeftActive.png' :
        direction === 'down' ?
            'media/sprites/arrows/arrowDownActive.png' :
            direction === 'up' ?
                'media/sprites/arrows/arrowUpActive.png' :
                'media/sprites/arrows/arrowRightActive.png';

    const note = {
        x: direction === 'left' ? xLeftPos : direction === 'down' ? xDownPos : direction === 'up' ? xUpPos : xRightPos,
        y: 0,
        direction: direction,
        img: srcImg
    };
    notes.push(note);
}

function chooseMissSound() {
    let selection = Math.floor(Math.random() * 3) + 1;

    if (selection == 1) {
        missNote1.play();
    } else if (selection == 2) {
        missNote2.play();

    } else {
        missNote3.play();

    }
}

// Função para mover as notas
function moveNotes() {
    notes.forEach((note, index) => {
        note.y += speed;  // Mover para baixo
        if (note.y > canvas.height) {
            score -= 50;  // Adicionar à pontuação
            notes.splice(index, 1);  // Remover a nota se sair da tela
            registerFeedback('Errou!', note.x); // Feedback se a nota sair da tela sem ser tocada
            chooseMissSound();
            life -= 5;
        }
    });
}

// Função para desenhar as setas de colisão
function drawHitLine(timestamp) {
    keyNotes.forEach(keyNote => {
        let currentAnimation;
        switch (keyNote) {
            case arrows.left:
                if (keys['ArrowLeft'] || keys['a']) {
                    currentAnimation = animations.arrowLeftPressedNull;

                    if (timestamp - currentAnimation.lastFrameTime > frameDuration) {
                        currentAnimation.currentFrame = (currentAnimation.currentFrame + 1) % currentAnimation.frames.length;
                        currentAnimation.lastFrameTime = timestamp;
                    }
                    ctx.drawImage(currentAnimation.frames[currentAnimation.currentFrame], xLeftPos, canvas.height / 1.2, arrowSizeX, arrowSizeY);
                } else {

                    ctx.drawImage(arrows.left, xLeftPos, canvas.height / 1.2, arrowSizeX, arrowSizeY);
                }

                break;

            case arrows.down:
                if (keys['ArrowDown'] || keys['s']) {
                    currentAnimation = animations.arrowDownPressedNull;

                    if (timestamp - currentAnimation.lastFrameTime > frameDuration) {
                        currentAnimation.currentFrame = (currentAnimation.currentFrame + 1) % currentAnimation.frames.length;
                        currentAnimation.lastFrameTime = timestamp;
                    }

                    ctx.drawImage(currentAnimation.frames[currentAnimation.currentFrame], xDownPos, canvas.height / 1.2, arrowSizeX, arrowSizeY);
                } else {
                    ctx.drawImage(arrows.down, xDownPos, canvas.height / 1.2, arrowSizeX, arrowSizeY);
                }

                break;

            case arrows.up:
                if (keys['ArrowUp'] || keys['w']) {
                    currentAnimation = animations.arrowUpPressedNull;

                    if (timestamp - currentAnimation.lastFrameTime > frameDuration) {
                        currentAnimation.currentFrame = (currentAnimation.currentFrame + 1) % currentAnimation.frames.length;
                        currentAnimation.lastFrameTime = timestamp;
                    }

                    ctx.drawImage(currentAnimation.frames[currentAnimation.currentFrame], xUpPos, canvas.height / 1.2, arrowSizeX, arrowSizeY);
                    // missNote1.play();
                } else {

                    ctx.drawImage(arrows.up, xUpPos, canvas.height / 1.2, arrowSizeX, arrowSizeY);
                }
                break;

            case arrows.right:
                if (keys['ArrowRight'] || keys['d']) {
                    currentAnimation = animations.arrowRightPressedNull;

                    if (timestamp - currentAnimation.lastFrameTime > frameDuration) {
                        currentAnimation.currentFrame = (currentAnimation.currentFrame + 1) % currentAnimation.frames.length;
                        currentAnimation.lastFrameTime = timestamp;
                    }

                    ctx.drawImage(currentAnimation.frames[currentAnimation.currentFrame], xRightPos, canvas.height / 1.2, arrowSizeX, arrowSizeY);

                    // missNote1.play();
                } else {

                    ctx.drawImage(arrows.right, xRightPos, canvas.height / 1.2, arrowSizeX, arrowSizeY);
                }

                break;
        }
    })
}

function drawPlayer(timestamp) {
    let currentAnimation = animations.playerIdle;

    if (keys['ArrowUp'] || keys['w']) currentAnimation = animations.playerUp;
    else if (keys['ArrowDown'] || keys['s']) currentAnimation = animations.playerDown;
    else if (keys['ArrowLeft'] || keys['a']) currentAnimation = animations.playerLeft;
    else if (keys['ArrowRight'] || keys['d']) currentAnimation = animations.playerRight;

    // Controle de tempo da animação
    if (timestamp - currentAnimation.lastFrameTime > frameDuration) {
        currentAnimation.currentFrame = (currentAnimation.currentFrame + 1) % currentAnimation.frames.length;
        currentAnimation.lastFrameTime = timestamp;
    }

    const radius = 100;

    ctx.beginPath();
    ctx.ellipse(canvas.width / 1.2 - radius, canvas.height / 1.3 + radius / 1.3, radius * 2, radius, 0, 0, 360);
    ctx.fillStyle = 'gray';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    ctx.drawImage(currentAnimation.frames[currentAnimation.currentFrame], canvas.width / 1.2 - currentAnimation.frames[currentAnimation.currentFrame].width / 1.2, canvas.height / 1.3 - currentAnimation.frames[currentAnimation.currentFrame].height / 1.3, playerSizeX, playerSizeY);

    // ctx.drawImage(opponentIdle, canvas.width / 1.2 - opponentIdle.width / 1.2, canvas.height / 1.3 - opponentIdle.height / 1.3, opponentSizeX, opponentSizeY)
}

function drawOpponent(timestamp) {
    let currentAnimation = animations.opponentIdle;

    let animationSet = false;

    notes.forEach((note) => {
        let distance = Math.abs(note.y - hitLineY);

        if (distance < hitTolerance) {
            // Escolhe a animação com base na direção da nota
            switch (note.direction) {
                case 'left':
                    currentAnimation = animations.opponentLeft;
                    break;
                case 'right':
                    currentAnimation = animations.opponentRight;
                    break;
                case 'up':
                    currentAnimation = animations.opponentUp;
                    break;
                case 'down':
                    currentAnimation = animations.opponentDown;
                    break;
                default:
                    currentAnimation = animations.opponentIdle;
                    break;
            }

            // Atualiza o frame da animação se necessário
            if (timestamp - currentAnimation.lastFrameTime > frameDuration) {
                currentAnimation.currentFrame = (currentAnimation.currentFrame + 1) % currentAnimation.frames.length;
                currentAnimation.lastFrameTime = timestamp;
            }

            animationSet = true; // Marca que uma animação foi definida
        }
    });

    // Se nenhuma animação foi definida, mantém o oponente em idle
    if (!animationSet) {
        currentAnimation = animations.opponentIdle;
    }

    const radius = 70;

    ctx.beginPath();
    ctx.ellipse(canvas.width / 9 + opponentSizeX / 2, canvas.height / 4 + opponentSizeY - radius - 30, radius * 2, radius, 0, 0, 360);
    ctx.fillStyle = 'gray';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Desenha a animação atual
    ctx.drawImage(currentAnimation.frames[currentAnimation.currentFrame], canvas.width / 9 - currentAnimation.frames[currentAnimation.currentFrame].width / 9, canvas.height / 4 - currentAnimation.frames[currentAnimation.currentFrame].height / 4, opponentSizeX, opponentSizeY);
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
function checkHit(direction, timestamp) {
    hit = false;
    notes.forEach((note, index) => {
        if (note.direction === direction) {

            let distance = Math.abs(note.y - hitLineY);

            if (distance < hitTolerance) {
                // Definir a precisão com base na proximidade
                if (distance < 10) {
                    registerFeedback('Brabo!', note.x);
                    score += 300;
                } else if (distance < 30) {
                    registerFeedback('Boa', note.x);
                    score += 200;
                } else {
                    registerFeedback('Ate que vai', note.x);
                    score += 100;
                }
                notes.splice(index, 1);  // Remove a nota acertada
                hit = true;
                if (life <= 95) {
                    life += 5;
                }
                if (life > 95 && life <= 100) {
                    life += 100 - life;
                }
            }
        }
    });
    if (!hit) {
        registerFeedback('Errou!', direction === 'left' ? 100 : direction === 'down' ? 250 : direction === 'up' ? 400 : 550);
        score -= 50;  // Penalidade se apertar sem acertar nota
        life -= 5;
        chooseMissSound();

    }
}

// Função para desenhar o feedback (Perfect, Good, Miss)
function drawFeedback() {
    feedback.forEach((fb, index) => {
        if (fb.text === 'Errou!') {
            ctx.fillStyle = 'gray';
        } else if (fb.text === 'Ate que vai') {
            ctx.fillStyle = 'white';
        } else if (fb.text === 'Boa') {
            ctx.fillStyle = 'white';
        } else {
            ctx.fillStyle = 'blue';
        }

        ctx.font = '40px Modak';
        ctx.shadowColor = "black";
        ctx.shadowBlur = 4;
        ctx.lineWidth = 10;

        ctx.fillText(fb.text, canvas.width / 1.38, canvas.height / 2.4);  // Exibir o texto acima da linha de colisão

        // Remover feedback após o tempo de exibição
        if (Date.now() - fb.time > feedbackDuration) {
            feedback.splice(index, 1);
        }
    });
}

function endGame(result) {
    // window.location.reload();
    notes = [];
    music.pause();

    gameOnAction = false;

    if (result == 0) {
        document.getElementById("finalTitle").innerText = "Você perdeu!";
    } else {
        document.getElementById("finalTitle").innerText = "Você ganhou!";
    }

    document.getElementById("finalScore").innerText = `Pontuação: ${score}`;

    document.getElementById("gameCanvas").style.opacity = 0;
    document.getElementById("finalScreen").style.display = "flex";
}

// Função para detectar as teclas
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
    if (gameOnAction) {
        if (event.key === 'ArrowLeft' || event.key === 'a') checkHit('left');
        if (event.key === 'ArrowDown' || event.key === 's') checkHit('down');
        if (event.key === 'ArrowUp' || event.key === 'w') checkHit('up');
        if (event.key === 'ArrowRight' || event.key === 'd') checkHit('right');
    }
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Função principal de loop
function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpar o canvas

    drawHitLine(timestamp);  // Desenhar a linha de colisão
    moveNotes();  // Mover as notas
    drawNotes(timestamp);  // Desenhar as notas
    drawFeedback();  // Desenhar o feedback de precisão
    drawPlayer(timestamp);
    drawOpponent(timestamp);

    // Exibir a pontuação
    // document.getElementById('score').innerText = 'Score: ' + score;

    ctx.font = '30px Kalam';
    ctx.shadowColor = "black";
    ctx.shadowBlur = 4;
    ctx.lineWidth = 8;
    ctx.textAlign = 'center'; // Centraliza horizontalmente
    ctx.fillStyle = 'white';

    ctx.fillText(`Pontuação: ${score}`, canvas.width / 2, canvas.height / 1.05);

    ctx.fillText(`Vida: ${life}`, canvas.width / 2, canvas.height / 1.01);

    // Sincronizar as notas com a batida da música
    if (nextNoteIndex < beatMap.length && music.currentTime * 1000 >= beatMap[nextNoteIndex].time) {
        spawnNote(beatMap[nextNoteIndex].direction);  // Criar nota na direção especificada
        nextNoteIndex++;  // Avançar para a próxima nota da lista
    }


    if (life <= 0) {
        endGame(0);
    }

    music.addEventListener("ended", function () {
        endGame(1);
    });

    requestAnimationFrame(gameLoop);
}