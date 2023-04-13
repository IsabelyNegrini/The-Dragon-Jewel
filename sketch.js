var JOGO = 1;
var FIM = 0;
var gameState = JOGO;
var pedraImg, pedra;
var dragão, dragão_running
var bônusGroup, bônusImg
var explorer, explorer_running, explorer_collided;
var groundImg, invisibleGround, ground
var jumpSound, spookySound, collidedSound;
var nuvem1, nuvem2, nuvem3, nuvem4;
var moon, moonImg;
var gameOver;
var score = 0

function preload(){
//carregando os sons
jumpSound = loadSound("jump.wav");
spookySound = loadSound("SomDeFundo.mp3");
collidedSound = loadSound ("collided.wav");

//carregando as imagens
moonImg = loadImage ("Lua.png");
explorer_collided = loadAnimation ("Collided.png");
explorer_running = loadAnimation ("Run1.png", "Run2.png", "Run3.png", "Run4.png", "Run5.png", "Run6.png");
groundImg = loadImage ("Chão.png");
bônusImg = loadImage ("Bônus.jpg");

nuvem1 = loadImage ("Nuvem1.png");
nuvem2 = loadImage ("Nuvem2.png");
nuvem3 = loadImage ("Nuvem3.png");
nuvem4 = loadImage ("Nuvem4.png");

dragão_running = loadAnimation ("Dragão1.png", "Dragão2.png", "Dragão3.png");
pedraImg = loadImage ("Pedra.png");
gameOverImg = loadImage ("GameOver.png");
}

function setup() {
createCanvas(windowWidth,windowHeight);

spookySound.loop();

//criando a lua
moon = createSprite (width-100, 100, 10, 10);
moon.addImage (moonImg);
moon.scale = 0.4

//criando o menino
explorer = createSprite(80,height-130,20,80);
explorer.addAnimation("running", explorer_running);
explorer.scale = 0.6;

gameOver = createSprite (width/2,height/2- 50);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.8
gameOver.visible = false;

//criando o chão
ground = createSprite(width/2,height,width,2);
ground.addImage("ground", groundImg);
ground.x = width/2;
ground.velocityX = -(6 + 3* score /1)

bônusGroup = new Group();
dragãoGroup = new Group();
pedraGroup = new Group();
nuvemGroup = new Group();

invisibleGround = createSprite(width/2, height-0, width, 125);
invisibleGround.visible = false;
}

function draw() {
background(20);
textSize(20);
fill("with");
text ("Pontuação: " + score, height-30, 50);

if (gameState === JOGO){

if (bônusGroup.isTouching(explorer)){
bônusGroup.destroyEach();
score = score +1
}

gameOver.visible = false;

ground.velocityX = -6;  
ground.velocityX = -(6 + 3* score /2)

if (ground.x<900){
ground.x = ground.width/2;
}

if ((touches.length > 0 || keyDown ("SPACE")) && explorer.y >= height-180){
explorer.velocityY = -10
jumpSound.play();
touches = []
}

explorer.velocityY = explorer.velocityY +0.8

explorer.collide(invisibleGround);
spawnPedra();
spawnDragão();
spawnBônus();
spawnNuvens();

if (pedraGroup.isTouching(explorer) || dragãoGroup.isTouching(explorer)){
collidedSound.play();
score = 0;
gameState = FIM;
} 
}

else if (gameState === FIM){
gameOver.visible = true;

textSize(20);
fill("with");
text("Precione a seta para direita ou toque na tela para reiniciar", height-230, 300)

//para velocidade a cada objeto do jogo
ground.velocityX = 0;
explorer.velocityY = 0
bônusGroup.setVelocityXEach(0);
pedraGroup.setVelocityXEach(0);
dragãoGroup.setVelocityXEach(0);
nuvemGroup.setVelocityXEach(0);

//mudar a animação do explorador
explorer.changeAnimation ("collided", explorer_collided);

//definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
pedraGroup.setLifetimeEach(-1);
dragãoGroup.setLifetimeEach(-1);
bônusGroup.setLifetimeEach(-1);
nuvemGroup.setLifetimeEach(-1);

if (touches.length>0 || keyDown("RIGHT")){
reset();
touches = [];
}
}

drawSprites();
}

function spawnBônus(){
//gerar cereja
if(frameCount % 200 === 0){
var bônus = createSprite(width+20, height-95,40,10);
bônus.y = Math.round(random(700,850));
bônus.addImage(bônusImg);
bônus.scale = 0.07;
bônus.velocityX = -8;

//atribuir tempo de vida a cereja
bônus.lifetime = 250;

//ajustar profundidade
bônus.depth = explorer.depth;

//adicionar a cereja ao grupo
bônusGroup.add(bônus);
}
}

function spawnDragão() {
if (frameCount % 160 === 0){
var dragão = createSprite(width+20, height-300, 40, 10);
dragão.y = Math.round(random(530, 620));
dragão.setCollider('circle', 0, 0, 45);
dragão.addAnimation("running", dragão_running);
dragão.scale = 1.2;
dragão.velocityX = -4;

dragão.lifetime = 900;

explorer.depth = dragão.depth;
dragão.depth+=1;

dragãoGroup.add(dragão);
}
}

function spawnPedra(){
if (frameCount % 100 === 0){
var pedra = createSprite(width+20, height-70, 40, 10);
pedra.velocityX = -(6 + 3* score/2);
pedra.setCollider('circle', 0, 0, 45);
pedra.addImage(pedraImg);
pedra.scale = 0.9;
pedra.velocityX = -6;
pedra.lifetime = 500;
pedra.depth = explorer.depth;
explorer.depth+=1
pedraGroup.add(pedra);

}
}

function reset(){
gameState = JOGO;
gameOver.visible = false;

pedraGroup.destroyEach();
bônusGroup.destroyEach();
dragãoGroup.destroyEach();
nuvemGroup.destroyEach();

explorer.changeAnimation("running", explorer_running);
}

function spawnNuvens(){
if(frameCount %100 === 0){
var nuvem = createSprite (height+1000,140,20,30);
nuvem.setCollider('circle',0,0,45);
nuvem.velocityX = -4

var rand = Math.round(random(1,4));
switch(rand){
case 1: nuvem.addImage(nuvem1);
break;
case 2: nuvem.addImage(nuvem2);
break;
case 3: nuvem.addImage(nuvem3);
break;
case 4: nuvem.addImage(nuvem4);
default: break;
}
nuvem.scale = 0.8;
nuvem.lifetime = 900;
nuvemGroup.add(nuvem);
}
}