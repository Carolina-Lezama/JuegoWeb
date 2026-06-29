// La importación de uiHelpers.js ya no es necesaria, la eliminamos.

export class EscenaInstrucciones extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaInstrucciones' });
    }

    create() {
        // ==============================================================
        // 1. GESTIÓN DE AUDIO
        // ==============================================================
        if (!this.sound.get('musicaFondo')) {
            this.musica = this.sound.add('musicaFondo', { loop: true, volume: 0.5 });
            this.musica.play();
        } else {
            this.musica = this.sound.get('musicaFondo');
            if (!this.musica.isPlaying) {
                this.musica.play();
            }
        }

        // ==============================================================
        // 2. CREACIÓN DE INTERFAZ (UI) Y POSICIONAMIENTO DIRECTO
        // ==============================================================
        
        // Fondo centrado
        this.fondo = this.add.image(825, 450, 'instrucciones').setScale(1); 

        // Panel semitransparente con borde neón
        this.panel = this.add.rectangle(825, 450, 1100, 720, 0x0c1022, 0.8)
            .setStrokeStyle(3, 0x00ffc3)
            .setScale(1); // <-- Modifica la escala aquí

        // Título principal centrado en la parte superior
        this.titulo = this.add.text(825, 135, 'INSTRUCCIONES', {
            fontSize: '40px',
            color: '#00ffc3',
            fontStyle: 'bold',
            fontFamily: 'Silkscreen'
        }).setOrigin(0.5).setScale(1.3); // <-- Modifica la escala aquí

        // Contenido de las instrucciones
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
            '----------------------',
            ' INTERACTUAR',
            'Presiona E para inspeccionar locaciones',
            '----------------------',
            ' OBJETOS',
            'Recoger objetos del mapa puede dar habilidades',
            '----------------------',
            ' PERSONAJE / GATO',
            'Equipa el espejo y haz click en él para cambiar de personaje'
        ];

        // Texto centrado horizontalmente, alineado hacia abajo desde la posición Y: 250
        this.texto = this.add.text(825, 180, textoInstrucciones, {
            fontSize: '32px',
            color: '#ffffff',
            align: 'left',
            fontFamily: 'Silkscreen',
            lineSpacing: 6,
            wordWrap: { width: 1100 } // Ajustado un poco para que quepa bien dentro del panel de 900
        }).setOrigin(0.5, 0).setScale(0.75); // <-- Modifica la escala aquí

        // ==============================================================
        // 3. BOTÓN Y EVENTOS
        // ==============================================================
        
        // Botón de regreso (Esquina superior izquierda)
        this.regreso = this.add.image(115, 135, 'regreso').setInteractive({ useHandCursor: true }).setScale(1.3); // <-- Modifica la escala aquí

        this.regreso.on('pointerdown', () => {
            if (window.ultimaEscenaActiva) {
                this.scene.resume(window.ultimaEscenaActiva);
            }
            this.scene.stop();
        });

        // Guardamos dinámicamente la escala que le hayas puesto arriba para usarla en el Hover
        this.escalaBaseBoton = this.regreso.scaleX;

        // Feedback visual al pasar el mouse (Hover effect)
        this.regreso.on('pointerover', () => {
            this.regreso.setScale(this.escalaBaseBoton * 1.1); // Crece 10%
        });

        this.regreso.on('pointerout', () => {
            this.regreso.setScale(this.escalaBaseBoton); // Vuelve a su tamaño base
        });


    }
}