import { EscenaCombateBase } from './EscenaCombateBase.js';

export class EscenaCementerio extends EscenaCombateBase {
    constructor() {
        // Pasamos al padre la configuración específica de este nivel
        super({ 
            key: 'EscenaCementerio',
            mapaJson: 'CementerioJSON',
            tilesetImg: 'Cementerio',
            dañoEnemigo: 25,       // Daño intermedio de la calavera
            puntosRecompensa: 35,  // Otorga 35 puntos al vencerla
            velocidadEnemigo: 60   // Velocidad estándar de persecución
        });
    }

    // Definimos únicamente el enemigo único de este mapa
    crearEnemigos(mapWidth, mapHeight) {
        this.grupoEnemigos = this.physics.add.group();

        const crearCalavera = (x, y, escala) => {
            const calavera = this.grupoEnemigos.create(x, y, 'Calavera').setDepth(4).setScale(escala);
            calavera.setCollideWorldBounds(true);
            calavera.vida = 80; // Vida intermedia del enemigo
            calavera.enRetroceso = false;
            
            // Físicas contra las paredes del cementerio
            this.physics.add.collider(calavera, this.paredes);
            
            // Animación de la Calavera
            if (!this.anims.exists('calavera-anim')) {
                this.anims.create({ 
                    key: 'calavera-anim', 
                    frames: this.anims.generateFrameNumbers('Calavera', { start: 0, end: 4 }), 
                    frameRate: 6, 
                    repeat: -1 
                });
            }
            calavera.play('calavera-anim');
            
            this.enemigos.push(calavera);
        };

        // Instanciamos la Calavera usando las dimensiones proporcionales del mapa escalado
        crearCalavera(mapWidth * 0.8, mapHeight * 0.75, 1.2);
    }
}