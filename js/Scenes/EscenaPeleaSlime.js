import { EscenaCombateBase } from './EscenaCombateBase.js';

export class EscenaPeleaSlime extends EscenaCombateBase {
    constructor() {
        // Le pasamos al padre la configuración específica de ESTE nivel
        super({ 
            key: 'EscenaPeleaSlime',
            mapaJson: 'EscenaPeleaSlimeJson',
            tilesetImg: 'EscenaPeleaSlime',
            dañoEnemigo: 5,
            puntosRecompensa: 15,
            velocidadEnemigo: 60
        });
    }

    // Sobreescribimos ÚNICAMENTE la creación de enemigos
    crearEnemigos(mapWidth, mapHeight) {
        this.grupoEnemigos = this.physics.add.group();

        const crearSlime = (key, x, y, escala) => {
            const slime = this.grupoEnemigos.create(x, y, key).setDepth(4).setScale(escala);
            slime.setCollideWorldBounds(true);
            slime.vida = 25;
            slime.enRetroceso = false;
            
            this.physics.add.collider(slime, this.paredes);
            
            const animKey = `${key}-anim`;
            if (!this.anims.exists(animKey)) {
                this.anims.create({ key: animKey, frames: this.anims.generateFrameNumbers(key, { start: 0, end: 4 }), frameRate: 6, repeat: -1 });
            }
            slime.play(animKey);
            
            this.enemigos.push(slime);
        };

        // Instanciamos los Slimes en sus posiciones iniciales
        crearSlime('slimeVerde', mapWidth * 0.8, mapHeight * 0.75, 0.75);
        crearSlime('slimeRojo', mapWidth * 0.7, mapHeight * 0.75, 0.8);
    }
}   