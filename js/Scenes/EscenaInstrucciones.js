// Solo importamos la función de reescalado visual. No necesitamos globals aquí.
import { reescalarGlobalFlexible } from '../uiHelpers.js';

export class EscenaInstrucciones extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaInstrucciones' });
    }

    create() {
        // 1. GESTIÓN DE AUDIO
        if (!this.sound.get('musicaFondo')) {
            this.musica = this.sound.add('musicaFondo', { loop: true, volume: 0.5 });
            this.musica.play();
        } else {
            this.musica = this.sound.get('musicaFondo');
            if (!this.musica.isPlaying) {
                this.musica.play();
            }
        }

        // 2. CREACIÓN DE INTERFAZ (UI)
        this.fondo = this.add.image(0, 0, 'instrucciones');

        // Panel semitransparente con borde neón
        this.panel = this.add.rectangle(0, 0, 900, 600, 0x0c1022, 0.8)
            .setStrokeStyle(3, 0x00ffc3);

        this.titulo = this.add.text(0, 0, 'INSTRUCCIONES', {
            fontSize: '40px',
            color: '#00ffc3',
            fontStyle: 'bold',
            fontFamily: 'Silkscreen' // Aseguramos que use tu fuente pixel-art
        }).setOrigin(0.5);

        // Contenido
        const textoInstrucciones = [
            'MOVIMIENTO',
            'Usa W A S D  para moverte',
            '----------------------',
            ' COMBATE',
            'Presiona clic izquierdo para atacar',
            'Derrota enemigos para ganar puntos',
            '----------------------',
            ' INVENTARIO',
            'Presiona R para abrir inventario',
            'Selecciona objetos para usarlos',
            '----------------------',
            ' INTERACTUAR',
            'Presiona E para inspeccionar locaciones',
            '----------------------',
            ' OBJETOS',
            'Recoge objetos del mapa',
            'Algunos otorgan habilidades especiales',
            '----------------------',
            ' PERSONAJE / GATO',
            'Equipa el espejo y haz click en él para',
            'cambiar de personaje'
        ];

        this.texto = this.add.text(0, 0, textoInstrucciones, {
            fontSize: '32px',
            color: '#ffffff',
            align: 'left',
            fontFamily: 'Silkscreen',
            lineSpacing: 6,
            wordWrap: { width: 1000 }
        }).setOrigin(0.5, 0);

        // 3. BOTÓN Y EVENTOS
        this.regreso = this.add.image(0, 0, 'regreso').setInteractive({ useHandCursor: true });

        this.regreso.on('pointerdown', () => {
            if (window.ultimaEscenaActiva) {
                this.scene.resume(window.ultimaEscenaActiva);
            }
            this.scene.stop();
        });

        // Feedback visual al pasar el mouse (Hover effect)
        this.regreso.on('pointerover', () => {
            this.regreso.setScale(this.escalaBaseBoton * 1.1); // Crece 10%
        });

        this.regreso.on('pointerout', () => {
            this.regreso.setScale(this.escalaBaseBoton); // Vuelve a su tamaño base
        });

        // 4. RESPONSIVIDAD
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());
    }

    aplicarReescalado() {
        reescalarGlobalFlexible(this, [
            { obj: this.fondo, posX: 0.5, posY: 0.5, escalaRelativa: 1, autoFill: true },
            { obj: this.panel, posX: 0.5, posY: 0.45, escalaRelativa: 1.2 },
            { obj: this.titulo, posX: 0.5, posY: 0.13, escalaRelativa: 0.8 },
            { obj: this.texto, posX: 0.5, posY: 0.18, escalaRelativa: 0.77 },
            { obj: this.regreso, posX: 0.07, posY: 0.15, escalaRelativa: 0.2 }
        ]);

        // Guardamos la escala real que 'reescalarGlobalFlexible' le asignó al botón
        // para usarla en nuestro efecto de 'pointerover'/'pointerout'.
        this.escalaBaseBoton = this.regreso.scale;
    }
}