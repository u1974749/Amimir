var config = {
    type: Phaser.AUTO,
    width: 800, //Anchura del canvas
    height: 600, //Altura del canvas
    parent: 'game_area',    
    physics:
    {
        default: 'arcade',
        arcade:{
            gravity: {y:0},
            debug: false
        }
    },
    scene: [ GameScene ] //Array de escenas del juego
};

var game = new Phaser.Game(config);

