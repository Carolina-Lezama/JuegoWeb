import { EscenaCombateBase } from './EscenaCombateBase.js';

export class EscenaCasaAbandonada extends EscenaCombateBase {
    constructor() {
        // Enviamos la configuración específica de este mapa al constructor del padre
        super({ 
            key: 'EscenaCasaAbandonada',
            mapaJson: 'CasaAbandonadaJSON',
            tilesetImg: 'CasaAbandonada',
            dañoEnemigo: 25,       // El duende quita 25 puntos de vida por golpe
            puntosRecompensa: 20,  // Otorga 20 puntos al ser derrotado
            velocidadEnemigo: 60   // Velocidad de persecución estándar
        });
    }

    // Instanciamos exclusivamente el duende correspondiente a este mapa
    crearEnemigos(mapWidth, mapHeight) {
        this.grupoEnemigos = this.physics.add.group();

        const crearDuende = (x, y, escala) => {
            const duende = this.grupoEnemigos.create(x, y, 'Duende').setDepth(4).setScale(escala);
            duende.setCollideWorldBounds(true);
            duende.vida = 35; // Vida asignada al duende
            duende.enRetroceso = false;
            
            // Físicas contra los límites sólidos de la casa abandonada
            this.physics.add.collider(duende, this.paredes);
            
            // Animación cíclica protegida
            if (!this.anims.exists('duende-anim')) {
                this.anims.create({ 
                    key: 'duende-anim', 
                    frames: this.anims.generateFrameNumbers('Duende', { start: 0, end: 4 }), 
                    frameRate: 6, 
                    repeat: -1 
                });
            }
            duende.play('duende-anim');
            
            this.enemigos.push(duende);
        };

        // Instanciamos al Duende usando las posiciones calculadas dinámicamente del mapa
        crearDuende(mapWidth * 0.8, mapHeight * 0.75, 0.6);
    }
}