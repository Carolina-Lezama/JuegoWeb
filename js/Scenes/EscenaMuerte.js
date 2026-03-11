import { objetosDelPersonaje, datosObjetos,objetos,objetosActivos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu,objetos_jugador } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId  } from '../responsive.js';

export class EscenaMuerte extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaMuerte' });
    }

    create() {
        // Fondo negro
        this.cameras.main.setBackgroundColor('#000000');

        // Texto "Has perdido"
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 60, 'Has perdido', {
            font: 'bold 88px Silkscreen',
            fill: '#ff4444',
            align: 'center',
            stroke: '#fff',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Botón reiniciar
        const boton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 60, 'Reiniciar', {
            font: 'bold 48px Silkscreen',
            fill: '#ffffff',
            backgroundColor: '#222',
            padding: { left: 20, right: 20, top: 20, bottom: 20 },
            align: 'center',
            borderRadius: 10
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        boton.on('pointerdown', () => {
            this.scene.start(window.ultimaEscenaActiva); // Reinicia la pelea
        });
    }
}
