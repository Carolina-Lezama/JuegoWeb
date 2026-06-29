export class EscenaEleccion extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaEleccion' });
    }

    create() {
        // ==============================================================
        // 1. FONDO (Centrado en 1650x900)
        // ==============================================================
        this.fondo = this.add.image(825, 450, 'eleccion').setDepth(0).setScale(1); // <-- Modifica la escala aquí

        // ==============================================================
        // 2. TEXTOS (Títulos)
        // ==============================================================
        // Columna Izquierda (X: 412, Y: 72)
        this.historia = this.add.text(412, 100, 'HISTORIA', {
            fontSize: '100px', // Nota: El tamaño base se controla mejor cambiando este fontSize
            fontFamily: 'Silkscreen',
            color: '#00d4ff',
            fontStyle: 'bold',
            stroke: '#6b21b6',
            strokeThickness: 4,
            shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 8, fill: true },
            align: 'center'
        }).setOrigin(0.5).setScale(1); // <-- Modifica la escala aquí

        // Columna Derecha (X: 1155, Y: 72)
        this.lucha = this.add.text(1240, 100, 'LUCHA', {
            fontSize: '100px', 
            fontFamily: 'Silkscreen',
            color: '#ffd700',
            fontStyle: 'bold',
            stroke: '#ff6b00',
            strokeThickness: 4,
            shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 8, fill: true },
            align: 'center'
        }).setOrigin(0.5).setScale(1); // <-- Modifica la escala aquí

        // ==============================================================
        // 3. TEXTOS (Descripciones)
        // ==============================================================
        // Columna Izquierda (X: 412, Y: 270)
        this.historiaDes = this.add.text(412, 350, 'Descubre\nla aventura', {
            fontSize: '50px',
            fontFamily: 'Silkscreen',
            color: '#00ffd5',
            fontStyle: 'bold',
            stroke: '#6b21b6',
            strokeThickness: 2,
            shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 6, fill: true },
            align: 'center',
            lineSpacing: 6,
            wordWrap: { width: 300 }
        }).setOrigin(0.5).setScale(1); // <-- Modifica la escala aquí

        // Columna Derecha (X: 1155, Y: 270)
        this.luchaDes = this.add.text(1240, 350, 'Ir directo\na la batalla', {
            fontSize: '50px',
            fontFamily: 'Silkscreen',
            color: '#ffd700',
            fontStyle: 'bold',
            stroke: '#ff6b00',
            strokeThickness: 2,
            shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 6, fill: true },
            align: 'center',
            lineSpacing: 6,
            wordWrap: { width: 300 }
        }).setOrigin(0.5).setScale(1); // <-- Modifica la escala aquí

        // ==============================================================
        // 4. BOTONES / ICONOS INTERACTIVOS
        // ==============================================================
        // Columna Izquierda (X: 412, Y: 585)
        this.icono_historia = this.add.image(412, 585, 'icono_historia')
            .setInteractive({ useHandCursor: true })
            .setDepth(1)
            .setScale(1.6); // <-- Modifica la escala aquí

        // Columna Derecha (X: 1155, Y: 585)
        this.icono_lucha = this.add.image(1240, 585, 'icono_lucha')
            .setInteractive({ useHandCursor: true })
            .setDepth(1)
            .setScale(1.6); // <-- Modifica la escala aquí

        // --- Eventos de Clic ---
        this.icono_historia.on('pointerdown', () => {
            this.scene.start('EscenaIntroduccionUno'); 
        });

        this.icono_lucha.on('pointerdown', () => {
            this.scene.start('EscenaMapa');
        });

        // --- Eventos Hover (Feedback Visual) ---
        // Guardamos las escalas que hayas asignado arriba para que el Hover sea relativo
        this.escalaHistoriaBase = this.icono_historia.scaleX;
        this.escalaLuchaBase = this.icono_lucha.scaleX;

        this.icono_historia.on('pointerover', () => this.icono_historia.setScale(this.escalaHistoriaBase * 1.05));
        this.icono_historia.on('pointerout', () => this.icono_historia.setScale(this.escalaHistoriaBase));

        this.icono_lucha.on('pointerover', () => this.icono_lucha.setScale(this.escalaLuchaBase * 1.05));
        this.icono_lucha.on('pointerout', () => this.icono_lucha.setScale(this.escalaLuchaBase));
        
        // ¡Adiós aplicarReescalado!
    }
}