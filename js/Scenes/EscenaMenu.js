// La importación de uiHelpers.js ya no es necesaria, la eliminamos.

export class EscenaMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaMenu' });
    }

    create() {
        // ==============================================================
        // 1. CREACIÓN DE INTERFAZ (UI) Y POSICIONAMIENTO DIRECTO
        // ==============================================================
        
        // Fondo base semitransparente o desenfocado (centrado en X: 825, Y: 450)
        this.fondo = this.add.image(825, 450, 'FondoMenu').setDepth(1).setScale(1); 
        
        // Panel negro central del menú
        this.fondoMenuNegro = this.add.image(825, 450, 'fondoMenuNegro').setDepth(2).setScale(1);
        
        // Botón de regreso (Esquina superior izquierda)
        this.regreso = this.add.image(100, 100, 'regreso').setDepth(5).setInteractive({ useHandCursor: true }).setScale(1.5); // <-- Modifica la escala aquí
        this.regreso.on('pointerdown', () => this.cerrarMenuPorPausa());
        
        // Títulos
        this.opcionesLetra = this.add.image(825, 180, 'opcionesLetra').setDepth(2).setScale(1.75); // <-- Modifica la escala aquí
        this.MusicaLetra = this.add.image(412, 380, 'MusicaLetra').setDepth(2).setScale(1.1); // <-- Modifica la escala aquí
        
        // Etiquetas "Sí" y "No"
        this.si = this.add.image(775, 300, 'si').setDepth(4).setScale(1.3); // <-- Modifica la escala aquí
        this.no = this.add.image(990, 300, 'no').setDepth(4).setScale(1.3); // <-- Modifica la escala aquí

        // Checkpoints (Botones  para hacer clic, debajo de "Sí" y "No")
        this.checkpoint1 = this.add.image(775, 380, 'checkpoint').setDepth(2).setInteractive({ useHandCursor: true }).setScale(1); // <-- Modifica la escala aquí
        this.checkpoint2 = this.add.image(990, 380, 'checkpoint').setDepth(2).setInteractive({ useHandCursor: true }).setScale(1); // <-- Modifica la escala aquí
        
        // Indicadores de decisión (La "palomita" o marca dentro del checkpoint)
        this.decision1 = this.add.image(775, 380, 'decision').setDepth(3).setScale(0.5); // <-- Modifica la escala aquí
        this.decision2 = this.add.image(990, 380, 'decision').setDepth(3).setVisible(false).setScale(0.5); // <-- Modifica la escala aquí

        // ==============================================================
        // 2. LÓGICA DE EVENTOS (Audio)
        // ==============================================================
        this.checkpoint1.on('pointerdown', () => this.actualizarEstadoMusica(true));
        this.checkpoint2.on('pointerdown', () => this.actualizarEstadoMusica(false));

        // ==============================================================
        // 3. INICIALIZACIÓN DE ESTADO
        // ==============================================================
        const musicaExistente = this.sound.get('musicaFondo');
        const estaSonando = musicaExistente ? musicaExistente.isPlaying : false;
        this.actualizarEstadoMusica(estaSonando);
    }

    actualizarEstadoMusica(activar) {
        this.estadoMusica = activar;
        let musica = this.sound.get('musicaFondo');

        if (activar) {
            if (!musica) {
                musica = this.sound.add('musicaFondo', { loop: true, volume: 0.5 });
            }
            if (!musica.isPlaying) {
                musica.play();
            }
            // Actualización visual: "Sí" marcado, "No" desmarcado
            this.decision1.setVisible(true);
            this.decision2.setVisible(false);
        } else {
            if (musica && musica.isPlaying) {
                musica.stop(); 
            }
            // Actualización visual: "Sí" desmarcado, "No" marcado
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