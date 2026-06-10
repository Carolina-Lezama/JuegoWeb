import { EscenaCombateBase } from './EscenaCombateBase.js';

export class EscenaCastilloIfernal extends EscenaCombateBase {
    constructor() {
        // Le pasamos al padre la configuración específica de ESTE nivel
        super({ 
            key: 'EscenaCastilloIfernal',
            mapaJson: 'CastilloIfernalJSON',
            tilesetImg: 'CastilloIfernal',
            dañoEnemigo: 55,       // Daño crítico de los caballeros
            puntosRecompensa: 50,  // Recompensa alta
            velocidadEnemigo: 65   // Ligeramente más rápidos que los slimes
        });
    }

    // Sobreescribimos ÚNICAMENTE la creación de enemigos para usar al Caballero
    crearEnemigos(mapWidth, mapHeight) {
        this.grupoEnemigos = this.physics.add.group();

        const crearCaballero = (x, y) => {
            // El caballero usa escala 1 (es más grande que los slimes)
            const caballero = this.grupoEnemigos.create(x, y, 'Caballero').setDepth(4).setScale(1);
            caballero.setCollideWorldBounds(true);
            caballero.vida = 125; // Vida alta asignada al caballero
            caballero.enRetroceso = false;
            
            // Físicas contra las paredes del mapa
            this.physics.add.collider(caballero, this.paredes);
            
            // Animación del caballero
            if (!this.anims.exists('caballero-anim')) {
                this.anims.create({ 
                    key: 'caballero-anim', 
                    frames: this.anims.generateFrameNumbers('Caballero', { start: 0, end: 4 }), 
                    frameRate: 6, 
                    repeat: -1 
                });
            }
            caballero.play('caballero-anim');
            
            this.enemigos.push(caballero);
        };

        // Instanciamos los Caballeros en sus posiciones iniciales
        crearCaballero(mapWidth * 0.8, mapHeight * 0.75);
        crearCaballero(mapWidth * 0.7, mapHeight * 0.75);
    }
}