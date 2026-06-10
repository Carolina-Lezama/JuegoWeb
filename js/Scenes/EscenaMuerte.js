import { reescalarGlobalFlexible, agregarEfectoHover } from '../uiHelpers.js';

export class EscenaMuerte extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaMuerte' });
    }

    create() {
        // 1. FONDO NATIVO
        this.cameras.main.setBackgroundColor('#000000');

        // 2. TEXTOS INTERACTIVOS e INTERFAZ
        this.textoPerdido = this.add.text(0, 0, 'Has perdido', {
            fontFamily: 'Silkscreen',
            fontSize: '88px',
            fontStyle: 'bold',
            color: '#ff4444',
            align: 'center',
            stroke: '#ffffff',
            strokeThickness: 6
        });

        this.botonReiniciar = this.add.text(0, 0, 'Reiniciar', {
            fontFamily: 'Silkscreen',
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#ffffff',
            backgroundColor: '#222222',
            padding: { left: 20, right: 20, top: 20, bottom: 20 },
            align: 'center'
        }).setInteractive({ useHandCursor: true });

        // 3. EVENTOS DE REDIRECCIÓN
        this.botonReiniciar.on('pointerdown', () => {
            if (window.ultimaEscenaActiva) {
                this.scene.start(window.ultimaEscenaActiva); // Redirige a la pelea guardada
            } else {
                this.scene.start('EscenaMapa'); // Fallback de seguridad en caso de pérdida de referencia
            }
        });

        // 4. EFECTOS VISUALES (Hover)
        agregarEfectoHover(this.botonReiniciar);

        // 5. RESPONSIVIDAD
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());
    }

    aplicarReescalado() {
        reescalarGlobalFlexible(this, [
            { obj: this.textoPerdido, posX: 0.5, posY: 0.4 },
            { obj: this.botonReiniciar, posX: 0.5, posY: 0.6 }
        ]);
        
        // Guardamos la escala base tras el ajuste para mantener la integridad del efecto hover
        this.botonReiniciar.escalaBase = this.botonReiniciar.scale;
    }
}