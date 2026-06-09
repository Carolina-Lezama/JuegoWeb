// Solo importamos la función de reescalado visual, ya que esta escena no modifica datos globales.
import { reescalarGlobalFlexible } from '../uiHelpers.js';

export class EscenaMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaMenu' });
    }

    create() {
        // 1. CREACIÓN DE INTERFAZ (UI)
        // Las posiciones exactas las manejará aplicarReescalado, pero asignamos el Depth (Z-Index).
        this.fondo = this.add.image(0, 0, 'FondoMenu').setDepth(1);
        this.fondoMenuNegro = this.add.image(0, 0, 'fondoMenuNegro').setDepth(2);
        
        // Botón de regreso
        this.regreso = this.add.image(0, 0, 'regreso').setDepth(5).setInteractive({ useHandCursor: true });
        this.regreso.on('pointerdown', () => this.cerrarMenuPorPausa());
        
        // Textos/Letreros estáticos
        this.opcionesLetra = this.add.image(0, 0, 'opcionesLetra').setDepth(2);
        this.MusicaLetra = this.add.image(0, 0, 'MusicaLetra').setDepth(2);
        this.si = this.add.image(0, 0, 'si').setDepth(4);
        this.no = this.add.image(0, 0, 'no').setDepth(4);

        // Checkpoints (Botones para Sí/No)
        this.checkpoint1 = this.add.image(0, 0, 'checkpoint').setDepth(2).setInteractive({ useHandCursor: true });
        this.checkpoint2 = this.add.image(0, 0, 'checkpoint').setDepth(2).setInteractive({ useHandCursor: true });
        
        // Indicadores de decisión (El "check" visual que marca la opción elegida)
        this.decision1 = this.add.image(0, 0, 'decision').setDepth(3);
        this.decision2 = this.add.image(0, 0, 'decision').setDepth(3).setVisible(false);

        // 2. LÓGICA DE EVENTOS (Audio)
        this.checkpoint1.on('pointerdown', () => this.actualizarEstadoMusica(true));
        this.checkpoint2.on('pointerdown', () => this.actualizarEstadoMusica(false));

        // 3. INICIALIZACIÓN DE ESTADO
        // Verificamos si la música ya estaba sonando antes de entrar al menú para mantener congruencia visual
        const musicaExistente = this.sound.get('musicaFondo');
        const estaSonando = musicaExistente ? musicaExistente.isPlaying : false;
        this.actualizarEstadoMusica(estaSonando);

        // 4. RESPONSIVIDAD
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());
    }

    aplicarReescalado() {
        // Aprovechamos el modo FIT: posiciones relativas (0 a 1) limpias y directas.
        reescalarGlobalFlexible(this, [
            { obj: this.fondo, posX: 0.5, posY: 0.5, escalaRelativa: 1, autoFill: true },
            { obj: this.fondoMenuNegro, posX: 0.5, posY: 0.5, escalaRelativa: 1.6 },
            { obj: this.regreso, posX: 0.05, posY: 0.1, escalaRelativa: 0.16 },
            { obj: this.opcionesLetra, posX: 0.5, posY: 0.2, escalaRelativa: 0.6 },
            { obj: this.MusicaLetra, posX: 0.25, posY: 0.4, escalaRelativa: 0.4 },
            { obj: this.checkpoint1, posX: 0.47, posY: 0.4, escalaRelativa: 0.1 },
            { obj: this.checkpoint2, posX: 0.6, posY: 0.4, escalaRelativa: 0.1 },
            { obj: this.decision1, posX: 0.47, posY: 0.4, escalaRelativa: 0.05 },
            { obj: this.decision2, posX: 0.6, posY: 0.4, escalaRelativa: 0.05 },
            { obj: this.si, posX: 0.47, posY: 0.32, escalaRelativa: 0.057 },
            { obj: this.no, posX: 0.6, posY: 0.323, escalaRelativa: 0.064 }
        ]);
    }

    actualizarEstadoMusica(activar) {
        this.estadoMusica = activar;
        let musica = this.sound.get('musicaFondo');

        if (activar) {
            // Si no existe, la creamos
            if (!musica) {
                musica = this.sound.add('musicaFondo', { loop: true, volume: 0.5 });
            }
            // Si existe pero no suena, le damos play
            if (!musica.isPlaying) {
                musica.play();
            }
            // Actualización visual
            this.decision1.setVisible(true);
            this.decision2.setVisible(false);
        } else {
            // Si apagamos y la música existe y suena, la detenemos
            if (musica && musica.isPlaying) {
                musica.stop(); 
            }
            // Actualización visual
            this.decision1.setVisible(false);
            this.decision2.setVisible(true);
        }
    }

    cerrarMenuPorPausa() {
        if (window.ultimaEscenaActiva) {
            this.scene.stop(); // Destruye esta escena de menú
            this.scene.resume(window.ultimaEscenaActiva); // Despierta la escena que quedó congelada atrás
        }
    }
}