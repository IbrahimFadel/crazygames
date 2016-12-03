
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phasermario', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('sky', 'pmassets/sky.png');
    game.load.image('ground', 'pmassets/platform.png');
    game.load.image('star', 'pmassets/star.png');
    game.load.spritesheet('dude', 'pmassets/dude.png', 32, 48);
    game.load.image('backdrop', 'pmassets/remember-me.jpg');
        game.load.image('diamond', 'pmassets/diamond.jpg');
    game.load.spritesheet('badGuy', 'pmassets/baddie.png', 30, 30);
    game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
     game.load.image('bullet', 'pmassets/bullets.png');
    game.load.image('powerup', 'pmassets/powerup.png');
    game.load.image('coin', 'assets/Coin.jpg');
    game.load.image('menuScreen', 'assets/skies/space1.png');

}
var gameOver = false;
var badGuy;
var player;
var platforms;
var cursors;
var ground;
var stars;
var score = 0;
var scoreText;
var ledges = new Array();
var hiddenLedge;
var bullet;
var bullets;
var bulletTime = 0;
var lastDirection = 1;
var MenuButton;
var background;
function create() {





gameOver = true;



    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.world.setBounds(0, 0, 800*8, 600);


    //  A simple background for our game
    //game.add.sprite(0, 0, 'backdrop');
    //game.add.sprite(1920, 0, 'backdrop');
    game.add.sprite(0, 0, 'sky')
   for (var i = 0; i < 8; i++) {
      game.add.sprite(i * 800 + 800, 0, 'sky')
    }



    /*for (var i = 0; i < 3; i++) {
        var powerup = game.add.sprite(700 + 500 * i, 300 + random(0, 10), 'powerup')
        powerup.scale.setTo(0.21, 0.21);
    }*/

    var powerup = game.add.sprite(700 + 800, 300, 'powerup');
    var powerup1 = game.add.sprite(1200 + 800, 200, 'powerup');
    var powerup2 = game.add. sprite (3000 + 800, 30, 'powerup');
    powerup.scale.setTo(0.21, 0.21);
    powerup1.scale.setTo(0.21, 0.21);
    powerup2.scale.setTo(0.21, 0.21);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;


    // Here we create the ground.
    ground = platforms.create(0, game.world.height - 64, 'ground');

    background = game.add.sprite(0, 0, 'menuScreen');
    MenuButton = game.add.button(400, 400, 'button', actionOnClick, this, 2, 1, 0);

    MenuButton.onInputOver.add(MenuButtonOver, this);
    MenuButton.onInputOut.add(MenuButtonOut, this);
    MenuButton.onInputUp.add(MenuButtonUp, this);

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(20, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //ledge.scale.setTo(1, 2);
    hiddenLedge = platforms.create(0 + 800, 0 - 64, 'ground');
    hiddenLedge.body.immovable = true;
    hiddenLedge.scale.setTo(20, 2);
    //  Now let's create two ledges

    for (var i = 0; i < 6; i++) {
        ledges[i] = platforms.create(200 + 500 * i + 800, 600 - i * 100, 'ground')
        ledges[i].body.immovable = true;
        ledges[i].body.collideWorldBounds = false;
        ledges[i].body.allowGravity = false;

    }
    // The player and its settings
    player = game.add.sprite(32 + 800, game.world.height - 150, 'dude');
    badGuy = game.add.sprite(750 + 800, 600 - 250, 'badGuy');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);




   game.physics.arcade.enable(badGuy);
   badGuy.body.gravity.y = 300;


    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 30; i++)
    {
        game.physics.arcade.overlap(star, ground);
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 100 + 800, 40, 'star');
        //  Let gravity do its thing
        star.body.gravity.y = 300;
        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.5 + Math.random(10, 30) * 0.2;
        star.body.mass = 1;
    }





    diamonds = game.add.group();
    diamonds.enableBody = true;
    for (var i = 0; i < 7; i++) {
        var diamond = diamonds.create(i * 500 + 800, 40, 'diamond');
        diamond.scale.setTo(0.05, 0.05);
        diamond.body.gravity.y = 300;
        diamond.body.bounce.y = 0.05 + Math.random(10, 30) * 0.2;
    }
    //  The score
bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    //  All 40 of them
    bullets.createMultiple(5, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    createPowerup = game.add.sprite(70 + 800, 0, 'powerup');

}


function update() {


    if (player.y < 0) {
        player.y = 0;
    }

    if (player.x < 0) {
        player.x = 0;
    }

    if (gameOver) {
        return;
    }

    game.physics.arcade.collide(badGuy, platforms);

    game.physics.arcade.overlap(badGuy, player, collidePlayerBadguy, null, this);

    //game.physics.arcade.overlap(player, powerup, collectPowerUp, null, this);

    game.physics.arcade.overlap(badGuy, bullets, killBadGuy, null, this);

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    for (var i = 0; i < 6; i++) {
        game.physics.arcade.collide(stars, ledges[i]);
        //game.physics.arcade.collide(ledges[i], ground);
        game.physics.arcade.collide(stars, ledges[i]);
    }


    game.physics.arcade.collide(stars, ground);


    game.physics.arcade.collide(diamonds, platforms);


    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);
    //game.physics.arcade.overlap(player, powerup, collectPowerUp, null, this);

    for (var i = 0; i < 6; i++) {
        game.physics.arcade.overlap(ledges[i], hiddenLedge, bounceDown, null, this);
    }

     for (var i = 0; i < 6; i++) {
        game.physics.arcade.overlap(ledges[i], ground, bounceUp, null, this);
    }

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;


    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -300;

        player.animations.play("left");

        lastDirection = 0;
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 300;

        player.animations.play('right');

        lastDirection = 1;
 }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }


    if (cursors.down.isDown) {
        player.body.velocity.y = 370;
        cursors.right.isDown = false;
        cursors.left.isDown = false;
    }
     if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        fireBullet();
    }



    /*if (player === touching()) {
        player.kill();
    }*/
}


function fireBullet(){
        if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(player.body.x + 16, player.body.y + 16);
            bullet.lifespan = 2000;
            //bullet.rotation = player.rotation;
            //game.physics.arcade.velocityFromRotation(player.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + 200;
            if (lastDirection === 0) {
                bullet.body.velocity.x = -400;
                //player.animations.play('left');
                //player.animations.stop = true;
            } else {
                bullet.body.velocity.x = 400;
                //player.animations.play('right');
                //player.animations.stop = true;

            }
        }
    }
}

function collectStar (player, star) {

    // Removes the star from the screen
    star.kill();
       //  Add and update the score
    score += 10;
   // scoreText.text = 'Score: ' + score;

}

function collectDiamond (player, diamond) {
    diamond.kill();

    score += 30;
}

function collectPowerUp (player, powerup) {
    powerup.kill();
    player.body.velocity.x = 500;
}

function killBadGuy (badGuy, bullet) {
    console.log("Kill Badguy Was Executed :D");
    badGuy.kill();
    score += 50;
}


function collidePlayerBadguy (badGuy, player) {
    player.body.x = 32;
    player.body.y = game.world.height - 160;
    score -= 50;
    //scoreText.text = 'Score' + score;

    if (score <= -1) {
        game.add.sprite(0, 0, 'sky');
        gameOver = true;
    }
}

function bounceDown (ledge, hiddenLedge) {
    ledge.body.velocity.y = 150;
}

function bounceUp (ledge, ground) {
    console.log("BounceUP was called :)")
    ledge.body.velocity.y = -150;
}

function MenuButtonUp() {
    console.log('button up', arguments);
}

function MenuButtonOver() {
    console.log('button over');
}

function MenuButtonOut() {
    console.log('button out');
}

function actionOnClick () {

    gameOver = false;
    game.camera.follow(player);
    player.x = 0;
    player.y = game.world.height - 150;
    MenuButton.destroy();
    background.destroy();

}

function render() {
    if (score <= -1) {
        //game.add.sprite(0, 0, 'sky');
       // scoreText.text = 'Game Over';
        player.body.immovable = true;
        game.debug.text("Game Over :(", 300, 300);
    } else {
        game.debug.text("Score: " + score, 32, 32);
        }
        scoreText = game.add.text(16, 16, 'Use the Left, Right, and up Arrow Keys To Move', { fontSize: '16px', fill: '#000' });
        scoreText = game.add.text(16, 50, ', and use Space to Shoot. The Goal of the Game ', {fontSize: '16px, fill: #000'});
        scoreText = game.add.text(16, 85, 'is to collect all the Stars, and Diamonds while', {fontSize: '16px, fill: #000'});
        scoreText = game.add.text(16, 120, 'avoiding the badguy', {fontSize: '16px, fill: #000'});
}
