"use strict";
class GameScene extends Phaser.Scene {

    constructor (){
        super('GameScene'); 
        //Etiquetas
        this.etiPeces; 
        this.etiVidas;
        
        //Variables globales
        this.datosPartida = {
            peces:0,
            vida:3,
            tiempoTranscurrido:0.0
        }
        this.spr_jugador;
        this.jugador = null;
       
        
        //Inventario
        this.nPecesBoca = 0;
        
        //Maquina de estados jugador
        this.QUIETO = 0;
        this.CAMINAR_IZQ = 1;
        this.CAMINAR_DER = 2;
        this.estadoActual = this.QUIETO;
        this.encenderAnimacion = true;

        //Variables movimiento jugador
        this.velocidad = 100;
        this.jugadorX;
        this.jugadorY;
        
        //Menu pausa
        this.pausa = false;
        this.volCanviando = false;
        
        //Temporizadores
        this.temporizadorVida = 100;
        this.tempVidaFuncionando = false;
        
        this.temporizadorBaile = 100;
        this.tempBaileFuncionando = false;

        //Musica i sonidos

        this.music
        this.dejarPez
        this.aguaRio
        //this.mordiscoPez
        this.mordiscoPirana
        this.rataHuye
        this.rataViene
        this.salmonVolando
        this.volumenPrincipal

        this.music;
        this.dejarPez;
        this.aguaRio;
       // this.mordiscoPez;
        this.mordiscoPirana;
        this.rataHuye;
        this.rataViene;
        this.salmonVolando;
        this.musicVolumen = 0.2;
        this.aguaVolumen = 0.5;
    }
   
    preload (){	

        //Cargar partida
        this.carrgarPartida();

        //Color del fondo
        this.cameras.main.setBackgroundColor("#d1d1d1")

        //Sprites
        this.load.image('spr_mapa','../../ASSETS/mapaPrincipal.png');
        this.load.image('spr_puente','../../ASSETS/puente.png');
        this.load.image('spr_cesta0','../../ASSETS/cesta_0.png');
        this.load.image('spr_cesta1','../../ASSETS/cesta_1.png');
        this.load.image('spr_cesta2','../../ASSETS/cesta_2.png');
        this.load.image('spr_cesta3','../../ASSETS/cesta_3.png');
        this.load.image('spr_cesta4','../../ASSETS/cesta_4.png');
        this.load.image('spr_cesta5','../../ASSETS/cesta_5.png');
        this.load.image('spr_fondoMenuPausa','../../ASSETS/fondoMenuPausa.png');
        this.load.image('spr_barraPausa','../../ASSETS/MenuPausa/Barra Volumen.png');
        this.load.image('spr_bola','../../ASSETS/MenuPausa/Bola.png');
        this.load.image('spr_btn_guardarSalir','../../ASSETS/MenuPausa/Boton_guardar_salir.png');
        this.load.image('spr_btn_continuar','../../ASSETS/MenuPausa/Boton_continuar.png');
        
        //Hojas de sprite
        this.load.spritesheet('spr_oso','../../ASSETS/oso_64.png',{frameWidth: 64,frameHeight: 64});
        this.load.spritesheet('spr_oso_repuesto','../../ASSETS/oso_32.png',{frameWidth: 32,frameHeight: 32});
        this.load.spritesheet('spr_salmon','../../ASSETS/spr_salmon.png',{frameWidth: 32,frameHeight: 32});  
        this.load.spritesheet('spr_piranya','../../ASSETS/spr_piranya.png',{frameWidth: 32,frameHeight: 32});          
        this.load.spritesheet('spr_raton','../../ASSETS/raton_32.png',{frameWidth: 32,frameHeight: 32});
        
        //carga de sonidos
        this.load.audio('musica', ['../../ASSETS/sounds/StardewValleyOSTSpring.mp3']);
        this.load.audio('cesta', ['../../ASSETS/sounds/dejarPezCesta.wav']);
        this.load.audio('aguaRio', ['../../ASSETS/sounds/aguaRio.wav']);
        //this.load.audio('mordiscoPez', ['../../ASSETS/sounds/mordiscoPez.wav']);
        this.load.audio('mordiscoPirana', ['../../ASSETS/sounds/mordiscoPirana.wav']);
        this.load.audio('rataHuye', ['../../ASSETS/sounds/rataHuye.mp3']);
        this.load.audio('rataViene', ['../../ASSETS/sounds/RataViene.mp3']);
        this.load.audio('salmonVolando', ['../../ASSETS/sounds/salmonVolando.mp3']);
	}
    
    create (){	

        //Definicion de entradas de teclado
        
        //Menu de pausa
        this.input.keyboard.on('keydown-ESC', () => {
            this.pausarJuego(this);             
        });
            
        //Mapa de fondo
        this.add.image(400,300,'spr_mapa');	
        
        //Creación del jugador
        {
            //Instanciar Jugador.
            this.jugador = this.physics.add.sprite(300,480,'spr_oso');
            this.jugador.setDepth(3);
            this.jugador.setCollideWorldBounds(true);
      
            
            //Animación de mover Jugador.
            this.anims.create({
                key: 'mov',
                frames: this.anims.generateFrameNumbers('spr_oso',{start: 0, end: 3}),
                frameRate: 9,
                repeat: -1
            })

            //Animación Jugador quieto.
            this.anims.create({
                key: 'quieto',
                frames: this.anims.generateFrameNumbers('spr_oso',{start: 8, end: 8}),
                frameRate: 9,
                repeat: -1
            })

            this.cursor = this.input.keyboard.createCursorKeys();
        }

        //Instanciar Objetos estaticos
        {
            //Instanciamos la cesta
            this.cesta = this.physics.add.sprite(70, 480,'spr_cesta0');
            //Inicializamos el menu de pausa
            {
                this.menuPausa = this.add.group();
                this.menuPausa.create(400,300,'spr_fondoMenuPausa');
                this.menuPausa.create(400,300,'spr_barraPausa');
                this.bola = this.physics.add.sprite(400,300,'spr_bola'); //bola                
                this.btnGuardarSalir = this.physics.add.sprite(400,380,'spr_btn_guardarSalir'); //btnGuardar
                this.btnContinuar = this.physics.add.sprite(400,220,'spr_btn_continuar'); //btnContinuar
                this.menuPausa.add(this.btnContinuar);
                this.menuPausa.add(this.btnGuardarSalir);        
                this.menuPausa.add(this.bola);
                this.menuPausa.setDepth(1000);

                
                this.menuPausa.setActive(this.pausa).setVisible(this.pausa);
                this.bola.setInteractive();
                this.btnGuardarSalir.setInteractive();
                this.btnContinuar.setInteractive();
                this.bola.on('pointerdown', () => {
                    this.volCanviando = true;
                });
                this.input.on('pointerup', () => {
                    this.volCanviando = false;
                });

                this.btnGuardarSalir.on('pointerdown', () => {
                    this.guardarPartida();
                    loadpage("../index.html");
                });

                this.btnContinuar.on('pointerdown', () => {
                    this.pausarJuego(this);
                });
            }
           
            
            this.puente = this.physics.add.sprite(400,300,'spr_puente');	
            this.puente.setDepth(2)
            this.vida1 = this.physics.add.sprite(670,300,'spr_oso_repuesto');
            this.vida1.flipX = true;
            this.vida2 = this.physics.add.sprite(740,390,'spr_oso_repuesto');
        }

        //Definimos las colisiones.
        {
            this.physics.add.overlap(this.cesta,this.jugador,(cesta,jugador)=>this.osoPoneEnCesta(cesta,jugador));
        }
        
        //Definimos los animales
        {
            this.salmon = new Salmon(this,this.jugador);
            this.salmon.create();
            
            this.raton = new Raton(this);
            this.raton.create();

            this.piranya = new Piranya(this,this.jugador);
            this.piranya.create();
        }
        
        //Asignamos a las variables sus corresponpondientes sonidos
        {
            this.dejarPez = this.sound.add('cesta');
            this.rataHuye = this.sound.add('rataHuye');
            this.rataViene = this.sound.add('rataViene');
           // this.mordiscoPez = this.sound.add('mordiscoPez');
            this.mordiscoPirana = this.sound.add('mordiscoPirana');
            this.salmonVolando = this.sound.add('salmonVolando');
            this.music = this.sound.add('musica');
            this.agua = this.sound.add('aguaRio');
            this.music.loop = true;
            this.agua.loop = true;
            this.music.play();
            this.agua.play();
            this.music.volume = this.musicVolumen;
            this.agua.volume = this.aguaVolumen;
        }

        //Creacion de Etiquetas
        {
            this.etiPeces = this.add.text(16,16, 'Peces: ' + this.datosPartida.peces,{fontSize:'32px',fill: '#000'});
            this.etiVida = this.add.text(600,16, 'Vida: ' + this.datosPartida.vida,{fontSize:'32px',fill: '#000'})
        }
	}
	
	update (){    
        
        //Actualiza el HUD
        {
            this.etiPeces.text = "Peces: " + this.datosPartida.peces;
            this.etiVida.text = "Vida: " + this.datosPartida.vida;

            //Logica del menu de pausa
            {

                if(this.pausa){
                    
                    if(this.volCanviando){
                        let xBol = Phaser.Math.Clamp(this.input.x,280,510);
                        this.bola.setX(xBol);
                        //calculo del volumne
                        this.volumenPrincipal = ((xBol - 280) / 230); //Calculo de 0 a 1.
                        this.volumenPrincipal = this.volumenPrincipal * this.volumenPrincipal; //¡El volumen no es lineal! Cómo programarlo BIEN By Alva Majo.
                        this.music.volume = this.musicVolumen * this.volumenPrincipal;
                        this.agua.volume = this.aguaVolumen * this.volumenPrincipal;
                        this.dejarPez.volume = this.volumenPrincipal;
                        //this.mordiscoPez.volume = this.volumenPrincipal;
                        this.mordiscoPirana.volume = this.volumenPrincipal;
                        this.rataHuye.volume = this.volumenPrincipal;
                        this.rataViene.volume = this.volumenPrincipal;
                        this.salmonVolando.volume = this.volumenPrincipal;
                    }
                }  
            }
        }
        
        
        //Maquina de estados Jugador
        switch(this.estadoActual)
        {   
            //Logica del estado
            case(this.QUIETO):
                if(this.encenderAnimacion)
                {
                    this.jugador.anims.play('quieto');
                    this.encenderAnimacion = false;
                }
                this.jugador.setVelocityX(0);
                
                //Condicion cambio de estado
                if(this.cursor.left.isDown){this.encenderAnimacion = true;this.estadoActual = this.CAMINAR_IZQ;} 
                else if(this.cursor.right.isDown) {this.encenderAnimacion = true;this.estadoActual = this.CAMINAR_DER;}
                break;
            case(this.CAMINAR_DER):
                //Logica del estado
                if(this.encenderAnimacion)
                {
                    this.jugador.anims.play('mov');
                    this.encenderAnimacion = false;
                    this.jugador.flipX = false;
                }
                this.jugador.setVelocityX(this.velocidad);
                //Actualizo la pos del jugador para los enemigos
                this.jugadorX = this.jugador.x;
                this.jugadorY = this.jugador.y;
                //Condicion cambio de estado
                if(!this.cursor.right.isDown) {this.encenderAnimacion = true;this.estadoActual = this.QUIETO;}
                break;
            case(this.CAMINAR_IZQ):
                //Logica del estado
                if(this.encenderAnimacion)
                {
                    this.jugador.anims.play('mov');
                    this.encenderAnimacion = false;
                    this.jugador.flipX = true;
                }
                
                this.jugador.setVelocityX(-this.velocidad);
                //Actualizo la pos del jugador para los enemigos
                this.jugadorX = this.jugador.x;
                this.jugadorY = this.jugador.y;
                //Condicion cambio de estado
                if(!this.cursor.left.isDown) {this.encenderAnimacion = true;this.estadoActual = this.QUIETO;}
                break;
        }
        //Actualiza el comportamiento de los salmones
        this.salmon.update();
        
        //Actualiza el sprite de la cesta
        if (this.datosPartida.peces >= 30){
            this.cesta.setTexture('spr_cesta5')
        }
        else if (this.datosPartida.peces >= 20){
            this.cesta.setTexture('spr_cesta4')
        }
        else if (this.datosPartida.peces >= 10){
            this.cesta.setTexture('spr_cesta3')
        }
        else if (this.datosPartida.peces >= 3){
            this.cesta.setTexture('spr_cesta2')
        }
        else if (this.datosPartida.peces > 0){
            this.cesta.setTexture('spr_cesta1')
        }
        else{
            this.cesta.setTexture('spr_cesta0')
        }

        //Al perder una vida, para pasar a la siguiente o mostrar puntuación al morir
        if (this.tempVidaFuncionando){
            this.temporizadorVida -= 1;
        
            if (this.datosPartida.vida > 0){
                switch (this.temporizadorVida)
                {                
                    case (0):
                        if (this.datosPartida.vida == 2) this.vida2.destroy();
                        else this.vida1.destroy();
                        this.ososVisibles();
                        this.tempVidaFuncionando = false;
                        break;
                    case (20):
                        this.ososNoVisibles();
                        break;
                    case (40):
                        this.ososVisibles();
                        break;
                    case (60):
                        this.ososNoVisibles();
                        break;
                    case (80):
                        this.ososVisibles();
                        break;
                }
            }
            else{ //GAME OVER
                this.etiPeces.setX(350);
                this.etiPeces.setY(250);
                this.jugador.setX(700);
                this.etiVida.visible = false;
                if (this.temporizadorVida < -100)
                {
                    localStorage.setItem("noPartida",JSON.stringify('true'));
                    loadpage("../");
                }
                    
            }

            if (this.tempBaileFuncionando){
                this.temporizadorBaile -= 1;

                switch (this.temporizadorBaile){
                    case (0):
                        this.giraOsos();
                        this.tempBaileFuncionando = false
                        break;
                    case (20):
                        this.giraOsos();
                        break;
                    case (40):
                        this.giraOsos();
                        break;
                    case (60):
                        this.giraOsos();
                        break;
                    case (80):
                        this.giraOsos();
                        break;

                }
            }
        }
            
        this.raton.update();
        this.piranya.update();
        this.datosPartida.tiempoTranscurrido += 1.0/60.0;
    
    }

    ososVisibles(){
        if (this.datosPartida.vida == 2) this.vida2.visible = true;
        else this.vida1.visible = true;
        this.jugador.visible = true;
    }
    
    ososNoVisibles(){
        if (this.datosPartida.vida == 2) this.vida2.visible = false;
        else this.vida1.visible = false;
        this.jugador.visible = false;
    }

    osoPierdeVida(jugador){
        this.mordiscoPirana.play();
        jugador.setX(700);
        
        this.nPecesBoca = 0;
        this.datosPartida.vida -= 1;
        
        this.temporizadorVida = 100;
        this.tempVidaFuncionando = true;
        this.ososNoVisibles();
    }

    giraOsos(){
        this.vida1.flipX = !this.vida1.flipX
        this.vida2.flipX = !this.vida2.flipX
    }

    ososBailando(){
        this.temporizadorBaile = 100;
        this.tempBaileFuncionando = true;
        this.giraOsos();
    }
    
    osoPoneEnCesta(cesta,jugador){
        if (this.nPecesBoca > 0) {
            this.dejarPez.play();
            this.ososBailando();
            this.datosPartida.peces += this.nPecesBoca;
            this.nPecesBoca = 0;
        }
        
    }

    

    //Carga la partida del localStorage
    carrgarPartida(){
        //Detectar si hay partida guardada.
        {
            var noPartida;
            var json = localStorage.getItem("noPartida");
            if(!(json === null) && !(json === undefined))
            {
                noPartida = JSON.parse(json);
            }	
            else
            {
                noPartida = true;
            }
            if(noPartida == "false") noPartida = false;
        }
        if(!noPartida)
        {
            console.log("Se Carrgo");
            //Accedo a la configuración de las opciones
            var json = localStorage.getItem("datosPartida") || '{"peces":0,"vida":3}';      
            this.datosPartida = JSON.parse(json);
        }
        
    }
    //Guarda la partida a localStorage
    guardarPartida(){
       localStorage.setItem("datosPartida",JSON.stringify(this.datosPartida));
       localStorage.setItem("noPartida",JSON.stringify('false'));
       var aux = localStorage.getItem("noPartida");
       console.log(aux);

    }
    //Pausa el juego
    pausarJuego(escnea){
        escnea.pausa = !escnea.pausa;          
        escnea.menuPausa.setActive(escnea.pausa).setVisible(escnea.pausa);
       
        if(escnea.pausa)            
        escnea.physics.pause();
        else 
        escnea.physics.resume();
    }
}


