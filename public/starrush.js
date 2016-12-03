

var GAMEWIDTH = 800;
var GAMEHEIGHT = 600;

var game = new Phaser.Game(GAMEWIDTH, GAMEHEIGHT, Phaser.AUTO, 'starrush', { preload: preload, create: create, update: update, render: render });
function preload() {
    game.load.image("buttonImage", 'assets/buttons/right-arrow.png');
    game.load.image("buttonImageLeft", 'assets/buttons/left-arrow.png');
    game.load.image("buttonSelect", 'assets/buttons/spacebar.png');
    game.load.image("background", 'assets/skies/sunset.png');
    game.load.image("loadingBackground", 'assets/demoscene/raster-blue.png');
    game.load.image("invisiblesprite", 'assets/sprites/invisiblesprite.png');
    game.load.spritesheet("character1", 'assets/sprites/plsplswork.png', 1378/16, 125, 16);
    game.load.spritesheet("character2", 'assets/sprites/plswork.png', 90, 154, 12);
    game.load.spritesheet("character3", 'assets/sprites/character3spritesheet.png', 108, 153, 7);

}

var content = [
    " ",
    "Ibrahim Productions Presents",
    " ",
    "A Game Made With Phaser ",
    " ",
    "UnNamed Game!",

];

var text;
var index = 0;
var line = '';

var pls = 0;

var gameStateOn = false;
var gameStateText;
var playerText;


var characterNumber = 1;
var character1 = null;
var character2 = null;
var character3 = null;
var theInvisibleSprite;

var health = 10;
var speed = 300;
var damage = 15;

var OFFSET =  0 - 400 + (GAMEWIDTH*1.5);



function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, GAMEWIDTH*3, GAMEHEIGHT);

    game.add.sprite(0 + OFFSET, 0, 'background');


    var moveRight = game.add.sprite(600 + OFFSET, 300, 'buttonImage');
    moveRight.scale.setTo(0.5, 0.5);
    moveRight.anchor.set(0.5);
    moveRight.inputEnabled = true;
    moveRight.events.onInputDown.add(buttonRightClicked, newStats, this);

    //moveRight.events.onInputDown.add(newStats, this);

    var moveLeft = game.add.sprite(250 + OFFSET, 310, 'buttonImageLeft');
    moveLeft.scale.setTo(0.5, 0.5);
    moveLeft.anchor.set(0.5);
    moveLeft.inputEnabled = true;
    moveLeft.events.onInputDown.add(buttonLeftClicked, this);

    var selectCharacter = game.add.sprite(435 + OFFSET, 490, 'buttonSelect');
    selectCharacter.anchor.setTo(0.5);
    selectCharacter.inputEnabled = true;
    selectCharacter.events.onInputDown.add(selectButtonClicked, this);

    character1 = game.add.sprite(400 + OFFSET, 200, 'character1');
    character1.scale.setTo(1.1, 1.1);
    character1.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15], 10, true);

    character2 = game.add.sprite(400 + OFFSET, 200, 'character2');
    character3 = game.add.sprite(400 + OFFSET, 200, 'character3');
    character1.kill();
    //character1.animations.add('')
    character2.kill();
    character2.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 1], 10, true);
    character3.kill();
    character3.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    //test code
    /*var testNinja = game.add.sprite(0, 0, 'character3');
    testNinja.frame = 0;*/

    /*var testCode = game.add.sprite(0, 0, 'character3');
    testCode.animations.add('test', [0, 1, 2, 3, 4, 5, 6, 7], 15, true);
    testCode.animations.play('test');*/
    var makeLoadingBackground = game.add.sprite(0, 0, 'loadingBackground');
    makeLoadingBackground.scale.setTo(80.0, 30.0);
    text = game.add.text(32, 380, '', { font: "30pt Courier", fill: "#19cb65", stroke: "#119f4e", strokeThickness: 2 });
    nextLine();

    theInvisibleSprite = game.add.sprite(0, 0, 'invisiblesprite');
    theInvisibleSprite.enableBody = true;
    game.camera.follow(theInvisibleSprite);
    console.log(theInvisibleSprite.x);
}

function updateLine() {
    if (line.length < content[index].length)
    {
        line = content[index].substr(0, line.length + 1);
        // text.text = line;
        text.setText(line);
    }
    else
    {
        //  Wait 2 seconds then start a new line
        pls++;
        game.time.events.add(Phaser.Timer.SECOND * 2, nextLine, this);

    }
    //game.time.events.add(Phaser.Timer.SECOND + 15, )
}



function nextLine() {
    index++;

    if (index < content.length)
    {
        line = '';
        game.time.events.repeat(80, content[index].length + 1, updateLine, this);
    }
}



var character3Shown = false;
var character2Shown = false;
var character1Shown = false;
function update() {
    if(theInvisibleSprite == null) {
        console.log("ERROR FIX ME NNOW PLS");
        return;
    }


    if(pls === 5) {
        theInvisibleSprite.x = 1.5* GAMEWIDTH;
        //console.log("pls: ");
        console.log(theInvisibleSprite.x)

    }





    console.log(pls)


        if(characterNumber === 1) {
        if(character1Shown === false) {
            character1Shown = true;
            character1.reset(380 + OFFSET, 200);
        }


        character2.kill()
        //character1.reset(380, 200)
        character2Shown = false;
        character1.animations.play('right');
    }

    if(characterNumber === 2) {
        if(character2Shown === false) {
            character2Shown = true;
            character2.reset(380 + OFFSET, 200);
        }
        character1.kill();
        character3.kill();
        character3Shown = false
        character1Shown = false;
        character2.animations.play('right');
    }
    if(characterNumber === 3) {
        if(character3Shown === false) {
            character3Shown = true;
            character3.reset(380 + OFFSET, 200);
        }
        character2.kill();
        character3.animations.play('right');
        character2Shown = false;


        //character3.reset(380, 200);
        //character3.frame = 3;
    }

    if(gameStateOn === true) {
        gameStateText = game.add.text(16 + OFFSET, 16, 'Game Is Starting... Please Wait', { fontSize: '16px', fill: '#555' });
    }




}


function render() {

}


function buttonRightClicked() {
    console.log('buttonRightClicked was called :D');
    characterNumber++;
    if(characterNumber > 3) {
        characterNumber = 3;
    }

}

function buttonLeftClicked() {
    characterNumber--;
    if(characterNumber < 1) {
        characterNumber++;
    }
}

function selectButtonClicked() {
    gameStateOn = true;
}

function newStats() {
    playerText.destroy();
}
