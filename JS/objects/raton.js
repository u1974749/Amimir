class Raton{
    constructor(escena){
        this.escena = escena;


        //ENEMIGO
        this.velocidadEnemigo = 120;
        this.destinoX =50;
        this.destinoY = 500;
        this.cestaX = 50;
        this.cestaY = 500;
        this.huirX = 50;
        this.huirY = -100;
        this.direccion = {x:0,y:0};
    

        //Maquina de estados ENEMIGO
        this.RATIRCESTA = 0;
        this.RATHUIR = 1;
        this.RATBUSCAR = 2;
        this.RATQUIETO = 3;
        this.estadoActualRata = this.RATQUIETO;
        this.osoCerca = false;
        this.tiempoBuscar = 400;
        this.ContadorBuscar = this.tiempoBuscar;
        this.distSusto = 150;
        this.tiempoAparecer =  Phaser.Math.Between(500, 1600);
        this.contadorAparecer = this.tiempoAparecer;
        this.ratioRobo = 120; //Cada cuanto roba un pez
        this.contRatioRobo = this.ratioRobo; //Cada cuanto roba un pez
        this.encenderAnimacion = true;
        
        //animacion salmon cesta
        this.speedY;
        this.speedX;
        this.animacionSalmon = false;
    }

    create(){
        //instancio el enemigo
        this.raton = this.escena.physics.add.sprite(100,-50,'spr_raton');
        //Animación IrCesta Rata
        this.escena.anims.create({
            key: 'rat_mov',
            frames: this.escena.anims.generateFrameNumbers('spr_raton',{start: 12, end: 15}),
            frameRate: 9,
            repeat: -1
        })
        this.escena.anims.create({
            key: 'rat_huir',
            frames: this.escena.anims.generateFrameNumbers('spr_raton',{start: 20, end: 23}),
            frameRate: 9,
            repeat: -1
        })

        this.escena.anims.create({
            key: 'rat_buscar',
            frames: this.escena.anims.generateFrameNumbers('spr_raton',{start: 8, end: 8}),
            frameRate: 9,
            repeat: -1
        })
        
        this.raton.anims.play('rat_mov');
       
    }

    update(){
       
        if(!this.escena.pausa){
             //ENEMIGO
        this.direccion = this.Direccion(); 

        //MAQUINA DE ESTADOS RATON
        switch(this.estadoActualRata)
        {
            case(this.RATQUIETO):
            if(this.encenderAnimacion){
                this.raton.anims.play('rat_mov');
                this.encenderAnimacion = false;
            }
                this.raton.setVelocityX(0);
                this.raton.setVelocityY(0);

                this.contadorAparecer -= 1;
                //logica canvio de estado
                if(this.osoCerca){
                    this.estadoActualRata = this.RATHUIR;
                    this.encenderAnimacion = true;
                }
                if(this.contadorAparecer <= 0){
                    this.tiempoAparecer =  Phaser.Math.Between(500, 1600); 
                    this.estadoActualRata = this.RATIRCESTA;                    
                    this.contadorAparecer = this.tiempoAparecer;
                    this.encenderAnimacion = true;
                }                
                break;
            case(this.RATIRCESTA):
                if(this.encenderAnimacion){
                    this.escena.rataViene.play()
                    this.raton.anims.play('rat_mov');
                    this.encenderAnimacion = false;
                }
                this.destinoX = this.cestaX; this.destinoY = this.cestaY; //Marca el destino en la cesta.
                this.raton.setVelocityX(this.velocidadEnemigo * this.direccion.x);
                this.raton.setVelocityY(this.velocidadEnemigo * this.direccion.y);

                //logica canvio de estado
                if(this.DistanciaJugador() < this.distSusto){
                    this.escena.rataHuye.play();
                    this.estadoActualRata = this.RATHUIR;
                    this.encenderAnimacion = true;
                }
                else if(this.DistanciaCesta() < 80){
                    this.estadoActualRata = this.RATBUSCAR;
                    this.encenderAnimacion = true;
                }
                break;
            case(this.RATBUSCAR):
                if(this.encenderAnimacion){
                    this.raton.anims.play('rat_buscar');
                    this.encenderAnimacion = false;
                }
                this.raton.setVelocityX(0);
                this.raton.setVelocityY(0);

                if(this.contRatioRobo <= 0 && this.escena.datosPartida.peces != 0){
                    this.RobarPez();
                    this.contRatioRobo = this.ratioRobo - (this.escena.datosPartida.tiempoTranscurrido * 0.2); 
                    this.contRatioRobo = Phaser.Math.Clamp( this.contRatioRobo, 50, 800);
             
                }

                this.contRatioRobo -= 1;
                this.ContadorBuscar -= 1;
                //Condicion cambio de estado
                if(this.ContadorBuscar <= 0){
                    this.estadoActualRata = this.RATHUIR;
                    this.ContadorBuscar = this.tiempoBuscar;
                    this.contRatioRobo = this.ratioRobo;
                    this.encenderAnimacion = true;
                }
                if(this.DistanciaJugador() < this.distSusto){
                    this.estadoActualRata = this.RATHUIR;
                    this.ContadorBuscar = this.tiempoBuscar;
                    this.contRatioRobo = this.ratioRobo;
                    this.encenderAnimacion = true;
                }
                

                break;
            case(this.RATHUIR):
                if(this.encenderAnimacion){
                    this.raton.anims.play('rat_huir');
                    this.encenderAnimacion = false;
                }
                
                this.destinoX = this.huirX; this.destinoY = this.huirY; //Marca el destino como huida.
                this.raton.setVelocityX(this.velocidadEnemigo * this.direccion.x);
                this.raton.setVelocityY(this.velocidadEnemigo * this.direccion.y);
                if(this.DistanciaDest() < 1){
                    this.estadoActualRata = this.RATQUIETO;
                    this.encenderAnimacion = true;
                }
                break;
            

        }
        }
       
        //Animacion salmon
        {
            if(this.animacionSalmon)
            {
                this.escena.salmonVolando.play()
                this.salmon = this.escena.physics.add.sprite(70,470,'spr_salmon');
                this.speedY = -400;
                if(Phaser.Math.Between(0,1))
                    this.speedX = 50;
                else
                    this.speedX = -50
                this.animacionSalmon = false;
            }
            if(this.salmon){
                this.salmon.angle = 90;
                this.speedY += 15;
                this.salmon.setVelocityY(this.speedY);
                this.salmon.setVelocityX(this.speedX);
                this.salmon;
            }
           
            
        }

    }

    //Metodos

    RobarPez(){
        this.escena.datosPartida.peces -= 1;
        this.animacionSalmon = true;

    }

    //Pre:--Post: Calcula el vector de direccion Normalizado segun el origen y el destino.
    Direccion() {
             
        var ratonX = this.raton.x;
        var ratonY = this.raton.y;
        var xDir = this.destinoX - ratonX;
        var yDir = this.destinoY - ratonY;
        var mod = Math.sqrt(xDir*xDir+yDir*yDir); // normaliza el vector Fachero.
        xDir = xDir / mod;
        yDir = yDir /mod;
        var res = {x:xDir,y:yDir};        
        return res;

    }

    //Pre:-- Post: devuelve la distancia en pixeles de la cesta.
    DistanciaCesta(){
        var ratonX = this.raton.x;
        var ratonY = this.raton.y;
        var xLengh = this.cestaX - ratonX;
        var yLengh = this.cestaY - ratonY;
        var mod = Math.sqrt(xLengh*xLengh+yLengh*yLengh);
        return mod;
    }

    //Pre:-- Post: devuelve la distancia del jugador.
    DistanciaJugador(){
        var ratonX = this.raton.x;
        var ratonY = this.raton.y;
        var xLengh = this.escena.jugadorX - ratonX;
        var yLengh = this.escena.jugadorY - ratonY;
        var mod = Math.sqrt(xLengh*xLengh+yLengh*yLengh);
        return mod;
    }

    DistanciaDest(){
        var ratonX = this.raton.x;
        var ratonY = this.raton.y;
        var xLengh = this.destinoX - ratonX;
        var yLengh = this.destinoY - ratonY;
        var mod = Math.sqrt(xLengh*xLengh+yLengh*yLengh);
        return mod;
    }

}








