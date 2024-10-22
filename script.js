// Tela do jogo
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = new Image();
player.src = 'media/sprites/player/player1.png';

let playerFrames = [];
let currentFrame = 0;
let animationInProgress = false;
let lastFrameTime = 0;
const frameDuration = 100;

const arrowLeft = new Image();
arrowLeft.src = 'media/sprites/arrows/arrowLeft.png';

const arrowRight = new Image();
arrowRight.src = 'media/sprites/arrows/arrowRight.png';

const arrowUp = new Image();
arrowUp.src = 'media/sprites/arrows/arrowUp.png';

const arrowDown = new Image();
arrowDown.src = 'media/sprites/arrows/arrowDown.png';

let score = 0;
let notes = [];  // Armazena as notas
let keyNotes = [arrowLeft, arrowDown, arrowUp, arrowRight];  // Armazena as notas
let speed = 5;   // Velocidade de descida das notas
let keys = {};   // Para registrar teclas pressionadas
let hitTolerance = 30;  // Tolerância de colisão para acerto
let hitLineY = 600;  // Linha onde o jogador deve acertar as notas
let feedback = [];  // Para armazenar o feedback de precisão ("Perfect", "Good", etc.)
let feedbackDuration = 400;  // Duração do feedback na tela (ms)

let nextNoteIndex = 0;  // Controla qual nota será gerada a seguir

const beatMap = [
    { time: 6044, direction: 'up' },
    { time: 6294, direction: 'right' },
    { time: 6544, direction: 'up' },
    { time: 6919, direction: 'down' },
    { time: 7169, direction: 'right' },
    { time: 7419, direction: 'up' },
    { time: 7669, direction: 'up' },
    { time: 7794, direction: 'left' },
    { time: 8044, direction: 'right' },
    { time: 8294, direction: 'down' },
    { time: 8544, direction: 'up' },
    { time: 8919, direction: 'up' },
    { time: 9169, direction: 'right' },
    { time: 9419, direction: 'up' },
    { time: 9669, direction: 'up' },
    { time: 9794, direction: 'right' },
    { time: 10044, direction: 'up' },
    { time: 10294, direction: 'right' },
    { time: 10544, direction: 'right' },
    { time: 10919, direction: 'up' },
    { time: 11169, direction: 'up' },
    { time: 11419, direction: 'down' },
    { time: 11669, direction: 'up' },
    { time: 11794, direction: 'down' },
    { time: 12044, direction: 'up' },
    { time: 12294, direction: 'right' },
    { time: 12544, direction: 'left' },
    { time: 12919, direction: 'right' },
    { time: 13169, direction: 'down' },
    { time: 13419, direction: 'down' },
    { time: 13669, direction: 'left' },
    { time: 13794, direction: 'up' },
    { time: 14044, direction: 'up' },
    { time: 14294, direction: 'down' },
    { time: 14544, direction: 'right' },
    { time: 14919, direction: 'left' },
    { time: 15169, direction: 'down' },
    { time: 15419, direction: 'left' },
    { time: 15669, direction: 'right' },
    { time: 15794, direction: 'down' },
    { time: 16044, direction: 'up' },
    { time: 16169, direction: 'right' },
    { time: 16294, direction: 'left' },
    { time: 16544, direction: 'left' },
    { time: 16794, direction: 'right' },
    { time: 16919, direction: 'down' },
    { time: 17544, direction: 'left' },
    { time: 17794, direction: 'right' },
    { time: 18044, direction: 'right' },
    { time: 18169, direction: 'down' },
    { time: 18294, direction: 'left' },
    { time: 18544, direction: 'down' },
    { time: 18794, direction: 'down' },
    { time: 18919, direction: 'up' },
    { time: 19544, direction: 'left' },
    { time: 19794, direction: 'right' },
    { time: 20044, direction: 'right' },
    { time: 20169, direction: 'up' },
    { time: 20294, direction: 'up' },
    { time: 20544, direction: 'up' },
    { time: 20794, direction: 'right' },
    { time: 21044, direction: 'down' },
    { time: 21419, direction: 'up' },
    { time: 21794, direction: 'left' },
    { time: 22044, direction: 'left' },
    { time: 22169, direction: 'down' },
    { time: 22294, direction: 'left' },
    { time: 22544, direction: 'left' },
    { time: 22794, direction: 'right' },
    { time: 22919, direction: 'down' },
    { time: 23169, direction: 'down' },
    { time: 23419, direction: 'down' },
    { time: 23669, direction: 'up' },
    { time: 23794, direction: 'right' },
    { time: 24044, direction: 'right' },
    { time: 24294, direction: 'up' },
    { time: 24544, direction: 'down' },
    { time: 24794, direction: 'left' },
    { time: 24919, direction: 'down' },
    { time: 25294, direction: 'down' },
    { time: 25419, direction: 'up' },
    { time: 25669, direction: 'down' },
    { time: 25794, direction: 'up' },
    { time: 26044, direction: 'right' },
    { time: 26169, direction: 'up' },
    { time: 26294, direction: 'right' },
    { time: 26544, direction: 'up' },
    { time: 26794, direction: 'up' },
    { time: 26919, direction: 'up' },
    { time: 27294, direction: 'up' },
    { time: 27419, direction: 'up' },
    { time: 27669, direction: 'up' },
    { time: 27794, direction: 'down' },
    { time: 28044, direction: 'up' },
    { time: 28169, direction: 'up' },
    { time: 28294, direction: 'right' },
    { time: 28544, direction: 'down' },
    { time: 28794, direction: 'left' },
    { time: 28919, direction: 'right' },
    { time: 29044, direction: 'left' },
    { time: 29419, direction: 'down' },
    { time: 29794, direction: 'left' },
    { time: 30044, direction: 'down' },
    { time: 30419, direction: 'right' },
    { time: 30544, direction: 'left' },
    { time: 30794, direction: 'right' },
    { time: 30919, direction: 'up' },
    { time: 31294, direction: 'up' },
    { time: 31419, direction: 'right' },
    { time: 31669, direction: 'down' },
    { time: 31794, direction: 'up' },
    { time: 32044, direction: 'right' },
    { time: 32419, direction: 'left' },
    { time: 32544, direction: 'right' },
    { time: 32794, direction: 'down' },
    { time: 32919, direction: 'left' },
    { time: 33169, direction: 'up' },
    { time: 33294, direction: 'up' },
    { time: 33544, direction: 'left' },
    { time: 33794, direction: 'up' },
    { time: 34044, direction: 'down' },
    { time: 34419, direction: 'down' },
    { time: 34669, direction: 'left' },
    { time: 34919, direction: 'right' },
    { time: 35169, direction: 'down' },
    { time: 35419, direction: 'left' },
    { time: 35669, direction: 'up' },
    { time: 35919, direction: 'right' },
    { time: 36044, direction: 'up' },
    { time: 36419, direction: 'down' },
    { time: 36544, direction: 'left' },
    { time: 36794, direction: 'right' },
    { time: 37044, direction: 'right' },
    { time: 37419, direction: 'left' },
    { time: 37794, direction: 'left' },
    { time: 38044, direction: 'down' },
    { time: 38419, direction: 'left' },
    { time: 38544, direction: 'down' },
    { time: 38919, direction: 'right' },
    { time: 39294, direction: 'up' },
    { time: 39419, direction: 'down' },
    { time: 39669, direction: 'right' },
    { time: 39919, direction: 'left' },
    { time: 40044, direction: 'down' },
    { time: 40294, direction: 'right' },
    { time: 40544, direction: 'up' },
    { time: 40794, direction: 'right' },
    { time: 40919, direction: 'down' },
    { time: 41169, direction: 'down' },
    { time: 41419, direction: 'right' },
    { time: 41669, direction: 'up' },
    { time: 41794, direction: 'right' },
    { time: 42044, direction: 'down' },
    { time: 42419, direction: 'up' },
    { time: 42544, direction: 'up' },
    { time: 42794, direction: 'right' },
    { time: 42919, direction: 'down' },
    { time: 43044, direction: 'up' },
    { time: 43294, direction: 'up' },
    { time: 43544, direction: 'down' },
    { time: 43794, direction: 'left' },
    { time: 43919, direction: 'left' },
    { time: 44044, direction: 'right' },
    { time: 44419, direction: 'left' },
    { time: 44669, direction: 'down' },
    { time: 44919, direction: 'left' },
    { time: 45044, direction: 'right' },
    { time: 45419, direction: 'up' },
    { time: 45794, direction: 'down' },
    { time: 46044, direction: 'left' },
    { time: 46419, direction: 'left' },
    { time: 46544, direction: 'down' },
    { time: 46794, direction: 'left' },
    { time: 47044, direction: 'up' },
    { time: 47169, direction: 'left' },
    { time: 47294, direction: 'down' },
    { time: 47419, direction: 'up' },
    { time: 47544, direction: 'up' },
    { time: 47794, direction: 'up' },
    { time: 48044, direction: 'left' },
    { time: 48294, direction: 'down' },
    { time: 48544, direction: 'right' },
    { time: 48919, direction: 'down' },
    { time: 49044, direction: 'up' },
    { time: 49294, direction: 'left' },
    { time: 49544, direction: 'left' },
    { time: 49669, direction: 'right' },
    { time: 49919, direction: 'left' },
    { time: 50044, direction: 'right' },
    { time: 50419, direction: 'up' },
    { time: 50544, direction: 'down' },
    { time: 50794, direction: 'left' },
    { time: 51044, direction: 'up' },
    { time: 51294, direction: 'left' },
    { time: 51544, direction: 'up' },
    { time: 51794, direction: 'left' },
    { time: 52044, direction: 'down' },
    { time: 52294, direction: 'left' },
    { time: 52544, direction: 'right' },
    { time: 52794, direction: 'down' },
    { time: 53044, direction: 'right' },
    { time: 53419, direction: 'up' },
    { time: 53794, direction: 'left' },
    { time: 54044, direction: 'down' },
    { time: 54294, direction: 'down' },
    { time: 54544, direction: 'left' },
    { time: 54794, direction: 'down' },
    { time: 54919, direction: 'left' },
    { time: 55044, direction: 'left' },
    { time: 55419, direction: 'up' },
    { time: 55544, direction: 'down' },
    { time: 55794, direction: 'up' },
    { time: 56044, direction: 'down' },
    { time: 56419, direction: 'left' },
    { time: 56544, direction: 'left' },
    { time: 56794, direction: 'up' },
    { time: 57044, direction: 'left' },
    { time: 57419, direction: 'up' },
    { time: 57544, direction: 'down' },
    { time: 57794, direction: 'right' },
    { time: 58044, direction: 'up' },
    { time: 60294, direction: 'right' },
    { time: 60544, direction: 'down' },
    { time: 60794, direction: 'right' },
    { time: 61044, direction: 'left' },
    { time: 61419, direction: 'down' },
    { time: 61794, direction: 'up' },
    { time: 62044, direction: 'right' },
    { time: 62294, direction: 'down' },
    { time: 62669, direction: 'right' },
    { time: 62794, direction: 'left' },
    { time: 62919, direction: 'right' },
    { time: 63044, direction: 'down' },
    { time: 63294, direction: 'up' },
    { time: 63544, direction: 'down' },
    { time: 63794, direction: 'up' },
    { time: 64044, direction: 'right' },
    { time: 64294, direction: 'left' },
    { time: 64544, direction: 'right' },
    { time: 64919, direction: 'left' },
    { time: 65044, direction: 'left' },
    { time: 65294, direction: 'left' },
    { time: 65419, direction: 'left' },
    { time: 65669, direction: 'down' },
    { time: 66044, direction: 'left' },
    { time: 66294, direction: 'right' },
    { time: 66544, direction: 'down' },
    { time: 66794, direction: 'left' },
    { time: 67044, direction: 'left' },
    { time: 67294, direction: 'left' },
    { time: 67544, direction: 'down' },
    { time: 67795, direction: 'right' },
    { time: 68044, direction: 'right' },
    { time: 68294, direction: 'up' },
    { time: 68544, direction: 'right' },
    { time: 68794, direction: 'down' },
    { time: 69044, direction: 'left' },
    { time: 69419, direction: 'down' },
    { time: 69794, direction: 'right' },
    { time: 70044, direction: 'up' },
    { time: 70294, direction: 'up' },
    { time: 70544, direction: 'up' },
    { time: 70794, direction: 'up' },
    { time: 71044, direction: 'right' },
    { time: 71419, direction: 'right' },
    { time: 71544, direction: 'left' },
    { time: 71794, direction: 'right' },
    { time: 72044, direction: 'down' },
    { time: 72419, direction: 'right' },
    { time: 72544, direction: 'up' },
    { time: 72794, direction: 'up' },
    { time: 73044, direction: 'up' },
    { time: 73419, direction: 'up' },
    { time: 73544, direction: 'right' },
    { time: 73794, direction: 'left' },
    { time: 74044, direction: 'down' },
    { time: 74106, direction: 'right' },
    { time: 76294, direction: 'down' },
    { time: 76544, direction: 'left' },
    { time: 76794, direction: 'left' },
    { time: 77044, direction: 'right' },
    { time: 77419, direction: 'down' },
    { time: 77794, direction: 'left' },
    { time: 78044, direction: 'down' },
    { time: 91419, direction: 'right' },
    { time: 94044, direction: 'right' },
    { time: 94294, direction: 'up' },
    { time: 94544, direction: 'down' },
    { time: 94919, direction: 'right' },
    { time: 95169, direction: 'left' },
    { time: 95419, direction: 'up' },
    { time: 95794, direction: 'left' },
    { time: 96044, direction: 'up' },
    { time: 96294, direction: 'left' },
    { time: 96544, direction: 'right' },
    { time: 96919, direction: 'up' },
    { time: 97169, direction: 'left' },
    { time: 97419, direction: 'down' },
    { time: 97794, direction: 'left' },
    { time: 98044, direction: 'down' },
    { time: 98169, direction: 'down' },
    { time: 98294, direction: 'left' },
    { time: 98544, direction: 'left' },
    { time: 98919, direction: 'left' },
    { time: 99169, direction: 'down' },
    { time: 99419, direction: 'left' },
    { time: 99794, direction: 'right' },
    { time: 100044, direction: 'down' },
    { time: 100169, direction: 'right' },
    { time: 100294, direction: 'right' },
    { time: 100419, direction: 'up' },
    { time: 100544, direction: 'left' },
    { time: 100919, direction: 'left' },
    { time: 101169, direction: 'right' },
    { time: 101419, direction: 'up' },
    { time: 101794, direction: 'left' },
    { time: 102044, direction: 'right' },
    { time: 102169, direction: 'up' },
    { time: 102294, direction: 'right' },
    { time: 102544, direction: 'down' },
    { time: 102919, direction: 'left' },
    { time: 103169, direction: 'up' },
    { time: 103419, direction: 'up' },
    { time: 103794, direction: 'left' },
    { time: 104044, direction: 'right' },
    { time: 104294, direction: 'right' },
    { time: 104544, direction: 'down' },
    { time: 104919, direction: 'down' },
    { time: 105169, direction: 'down' },
    { time: 105419, direction: 'right' },
    { time: 105794, direction: 'left' },
    { time: 106044, direction: 'right' },
    { time: 106294, direction: 'right' },
    { time: 106544, direction: 'down' },
    { time: 106919, direction: 'up' },
    { time: 107169, direction: 'left' },
    { time: 107419, direction: 'up' },
    { time: 107794, direction: 'down' },
    { time: 107919, direction: 'right' },
    { time: 108294, direction: 'right' },
    { time: 108544, direction: 'up' },
    { time: 108919, direction: 'right' },
    { time: 109044, direction: 'left' },
    { time: 109294, direction: 'up' },
    { time: 109419, direction: 'right' },
    { time: 109669, direction: 'down' },
    { time: 109794, direction: 'right' },
    { time: 110044, direction: 'right' },
    { time: 110419, direction: 'down' },
    { time: 110544, direction: 'right' },
    { time: 110919, direction: 'down' },
    { time: 111169, direction: 'right' },
    { time: 111419, direction: 'right' },
    { time: 111669, direction: 'right' },
    { time: 111794, direction: 'up' },
    { time: 112044, direction: 'right' },
    { time: 112669, direction: 'left' },
    { time: 112919, direction: 'right' },
    { time: 113169, direction: 'left' },
    { time: 113419, direction: 'right' },
    { time: 113544, direction: 'left' },
    { time: 113794, direction: 'up' },
    { time: 114044, direction: 'left' },
    { time: 114669, direction: 'down' },
    { time: 114919, direction: 'down' },
    { time: 115169, direction: 'right' },
    { time: 115419, direction: 'down' },
    { time: 115544, direction: 'down' },
    { time: 115794, direction: 'up' },
    { time: 116044, direction: 'up' },
    { time: 116419, direction: 'up' },
    { time: 116544, direction: 'right' },
    { time: 116919, direction: 'up' },
    { time: 117169, direction: 'right' },
    { time: 117419, direction: 'left' },
    { time: 117544, direction: 'left' },
    { time: 117794, direction: 'right' },
    { time: 118044, direction: 'down' },
    { time: 118419, direction: 'up' },
    { time: 118544, direction: 'down' },
    { time: 118794, direction: 'right' },
    { time: 118919, direction: 'down' },
    { time: 119169, direction: 'up' },
    { time: 119419, direction: 'up' },
    { time: 119544, direction: 'left' },
    { time: 119794, direction: 'down' },
    { time: 120044, direction: 'up' },
    { time: 120669, direction: 'right' },
    { time: 120794, direction: 'left' },
    { time: 120919, direction: 'down' },
    { time: 121169, direction: 'right' },
    { time: 121419, direction: 'down' },
    { time: 121544, direction: 'right' },
    { time: 121794, direction: 'left' },
    { time: 122044, direction: 'down' },
    { time: 122419, direction: 'down' },
    { time: 122544, direction: 'up' },
    { time: 122794, direction: 'down' },
    { time: 122919, direction: 'up' },
    { time: 123294, direction: 'down' },
    { time: 123544, direction: 'right' },
    { time: 123794, direction: 'up' },
    { time: 124044, direction: 'down' },
    { time: 124669, direction: 'down' },
    { time: 124794, direction: 'up' },
    { time: 124919, direction: 'up' },
    { time: 125169, direction: 'right' },
    { time: 125419, direction: 'right' },
    { time: 125544, direction: 'up' },
    { time: 125794, direction: 'up' },
    { time: 126044, direction: 'up' },
    { time: 126419, direction: 'up' },
    { time: 126544, direction: 'down' },
    { time: 126919, direction: 'right' },
    { time: 127544, direction: 'right' },
    { time: 127794, direction: 'left' },
    { time: 128044, direction: 'down' },
    { time: 128669, direction: 'left' },
    { time: 128794, direction: 'down' },
    { time: 128919, direction: 'right' },
    { time: 129169, direction: 'down' },
    { time: 129419, direction: 'left' },
    { time: 129544, direction: 'up' },
    { time: 129794, direction: 'up' },
    { time: 130044, direction: 'down' },
    { time: 130669, direction: 'up' },
    { time: 130919, direction: 'right' },
    { time: 131169, direction: 'left' },
    { time: 131544, direction: 'down' },
    { time: 131669, direction: 'down' },
    { time: 131794, direction: 'right' },
    { time: 132044, direction: 'down' },
    { time: 132419, direction: 'right' },
    { time: 132544, direction: 'left' },
    { time: 132794, direction: 'down' },
    { time: 132919, direction: 'left' },
    { time: 133544, direction: 'up' },
    { time: 133794, direction: 'up' },
    { time: 134044, direction: 'left' },
    { time: 134419, direction: 'left' },
    { time: 134544, direction: 'left' },
    { time: 134919, direction: 'down' },
    { time: 135544, direction: 'up' },
    { time: 135794, direction: 'left' },
    { time: 136044, direction: 'up' },
    { time: 136419, direction: 'right' },
    { time: 136544, direction: 'left' },
    { time: 136794, direction: 'right' },
    { time: 136919, direction: 'right' },
    { time: 137544, direction: 'up' },
    { time: 137794, direction: 'up' },
    { time: 138044, direction: 'left' },
    { time: 138294, direction: 'right' },
    { time: 138544, direction: 'left' },
    { time: 138919, direction: 'right' },
    { time: 139544, direction: 'up' },
    { time: 139794, direction: 'right' },
    { time: 140044, direction: 'left' },
    { time: 140294, direction: 'right' },
    { time: 140544, direction: 'right' },
    { time: 140919, direction: 'right' },
    { time: 141169, direction: 'left' },
    { time: 141419, direction: 'up' },
    { time: 141794, direction: 'left' },
    { time: 142044, direction: 'right' },
    // Adicione mais tempos conforme necessário
];

// Carregar a música
const music = new Audio('media/musics/music2.mp3');

for (let i = 0; i < 5; i++) { // Supondo que você tenha 6 imagens na sequência
    const img = new Image();
    img.src = `media/sprites/player/player${i}.png`; // Substitua pelo caminho correto
    playerFrames.push(img);
}

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
    srcImg.src = direction === 'left' ?
        'media/sprites/arrows/arrowLeftActive.png' :
        direction === 'down' ?
            'media/sprites/arrows/arrowDownActive.png' :
            direction === 'up' ?
                'media/sprites/arrows/arrowUpActive.png' :
                'media/sprites/arrows/arrowRightActive.png';
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

// Função para desenhar as setas de colisão
function drawHitLine(timestamp) {
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

    // Animação idle do player
    if (timestamp - lastFrameTime > frameDuration) {
        currentFrame++;
        lastFrameTime = timestamp;

        if (currentFrame >= playerFrames.length) {
            currentFrame = 0;
            animationInProgress = false; // Termina a animação
        }
    }
    ctx.drawImage(playerFrames[currentFrame], canvas.width - 615, 400, 200, 200);
    if (currentFrame >= playerFrames.length) {
        currentFrame = 0;
        animationInProgress = false; // Termina a animação
    }
}


// Função para desenhar o feedback (Perfect, Good, Miss)
function drawFeedback() {
    feedback.forEach((fb, index) => {
        if (fb.text === 'Miss') {
            ctx.fillStyle = 'gray';
        } else if (fb.text === 'Ok') {
            ctx.fillStyle = 'white';
        } else if (fb.text === 'Good') {
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
function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpar o canvas

    drawHitLine(timestamp);  // Desenhar a linha de colisão
    moveNotes();  // Mover as notas
    drawNotes();  // Desenhar as notas
    drawFeedback();  // Desenhar o feedback de precisão

    // Exibir a pontuação
    document.getElementById('score').innerText = 'Score: ' + score;

    // Sincronizar as notas com a batida da música
    if (nextNoteIndex < beatMap.length && music.currentTime * 1000 >= beatMap[nextNoteIndex].time) {
        spawnNote(beatMap[nextNoteIndex].direction);  // Criar nota na direção especificada
        nextNoteIndex++;  // Avançar para a próxima nota da lista
    }

    requestAnimationFrame(gameLoop);
}