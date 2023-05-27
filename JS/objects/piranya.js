class Piranya{
    constructor(escena,jugador){
        this.escena = escena; 
        this.arrayPiranyas = [];
        this.tiempo = 100;
        this.nPiranya = 0;
        this.jugador = jugador;
        this.escena.tiempoTranscurrido = 0.0;
    }
    create(){
        this.invoca();
    }
    update(){
        if(!this.escena.pausa){
            this.tiempo -= 1;
            if (this.tiempo <= 0){
                this.invoca();
            }
            for (let i = 0; i < this.nPiranya; i++){
                if (this.arrayPiranyas[i].y > 620) this.arrayPiranyas[i].destroy();
            }
        }

      
       
    }
    invoca(){
        let vel = Phaser.Math.Between(30, 150);
        let posX = Phaser.Math.Between(270, 560);
        let tiempo = Phaser.Math.Between(100, 400);
        vel = vel + this.escena.datosPartida.tiempoTranscurrido*0.8;
        vel = Phaser.Math.Clamp(vel,30,150);
        tiempo -= this.escena.datosPartida.tiempoTranscurrido*0.8;
        tiempo = Phaser.Math.Clamp(tiempo,60,400);
        this.arrayPiranyas[this.nPiranya] = this.escena.physics.add.sprite(posX,-16,'spr_piranya');
        this.arrayPiranyas[this.nPiranya].setVelocityY(vel);
        this.arrayPiranyas[this.nPiranya].setDepth(1);
        
        { //Creamos la colision del salmon con el jugador.
            this.escena.physics.add.overlap(this.arrayPiranyas[this.nPiranya],this.jugador,(sal,jug)=>this.entroBocaOso(sal,jug));
        }
        
        this.tiempo = tiempo;
        this.nPiranya += 1;
    }
     //Se ejecuta cuando el pez toca el oso.
    entroBocaOso(pir,jug){
        if(pir.y < 450)
        {
            this.escena.osoPierdeVida(jug);
            this.escena.nPecesBoca = 0;
            pir.destroy();
        }
        
    }
}