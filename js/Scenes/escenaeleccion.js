// Importación limpia: solo necesitamos la función de reescalado
import { reescalarGlobalFlexible } from '../uiHelpers.js';

export class EscenaEleccion extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaEleccion' });
    }

    create() {
        // 1. FONDO
        this.fondo = this.add.image(0, 0, 'eleccion').setDepth(0);

        // 2. TEXTOS (Títulos)
        this.lucha = this.add.text(0, 0, 'LUCHA', {
            fontSize: '52px',
            fontFamily: 'Silkscreen',
            color: '#ffd700',
            fontStyle: 'bold',
            stroke: '#ff6b00',
            strokeThickness: 4,
            shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 8, fill: true },
            align: 'center'
        }).setOrigin(0.5);

        this.historia = this.add.text(0, 0, 'HISTORIA', {
            fontSize: '52px',
            fontFamily: 'Silkscreen',
            color: '#00d4ff',
            fontStyle: 'bold',
            stroke: '#6b21b6',
            strokeThickness: 4,
            shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 8, fill: true },
            align: 'center'
        }).setOrigin(0.5);

        // 3. TEXTOS (Descripciones)
        this.luchaDes = this.add.text(0, 0, 'Ir directo\na la batalla', {
            fontSize: '28px',
            fontFamily: 'Silkscreen',
            color: '#ffd700',
            fontStyle: 'bold',
            stroke: '#ff6b00',
            strokeThickness: 2,
            shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 6, fill: true },
            align: 'center',
            lineSpacing: 6,
            wordWrap: { width: 200 }
        }).setOrigin(0.5);

        this.historiaDes = this.add.text(0, 0, 'Descubre\nla aventura', {
            fontSize: '28px',
            fontFamily: 'Silkscreen',
            color: '#00ffd5',
            fontStyle: 'bold',
            stroke: '#6b21b6',
            strokeThickness: 2,
            shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 6, fill: true },
            align: 'center',
            lineSpacing: 6,
            wordWrap: { width: 200 }
        }).setOrigin(0.5);

        // 4. BOTONES / ICONOS INTERACTIVOS
        this.icono_lucha = this.add.image(0, 0, 'icono_lucha').setInteractive({ useHandCursor: true }).setDepth(1);
        this.icono_historia = this.add.image(0, 0, 'icono_historia').setInteractive({ useHandCursor: true }).setDepth(1);

        // --- Eventos de Clic ---
        this.icono_lucha.on('pointerdown', () => {
            this.scene.start('EscenaMapa');
        });

        this.icono_historia.on('pointerdown', () => {
            this.scene.start('EscenaIntroduccionUno'); 
        });

        // --- Eventos Hover (Feedback Visual) ---
        this.icono_lucha.on('pointerover', () => this.icono_lucha.setScale(this.escalaLuchaBase * 1.05));
        this.icono_lucha.on('pointerout', () => this.icono_lucha.setScale(this.escalaLuchaBase));

        this.icono_historia.on('pointerover', () => this.icono_historia.setScale(this.escalaHistoriaBase * 1.05));
        this.icono_historia.on('pointerout', () => this.icono_historia.setScale(this.escalaHistoriaBase));

        // 5. RESPONSIVIDAD
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());
    }

    aplicarReescalado() {
        // Uso de escala limpia basada en modo FIT
        reescalarGlobalFlexible(this, [
            { obj: this.fondo, posX: 0.5, posY: 0.5, escalaRelativa: 1, autoFill: true },
            { obj: this.icono_historia, posX: 0.25, posY: 0.65, escalaRelativa: 0.36 },
            { obj: this.icono_lucha, posX: 0.7, posY: 0.65, escalaRelativa: 0.36 },
            { obj: this.historia, posX: 0.25, posY: 0.08, escalaRelativa: 0.8 },
            { obj: this.lucha, posX: 0.71, posY: 0.08, escalaRelativa: 0.65 },
            { obj: this.historiaDes, posX: 0.25, posY: 0.3, escalaRelativa: 0.3 },
            { obj: this.luchaDes, posX: 0.7, posY: 0.3, escalaRelativa: 0.3 }
        ]);

        // Guardamos las escalas base para el efecto Hover
        this.escalaHistoriaBase = this.icono_historia.scale;
        this.escalaLuchaBase = this.icono_lucha.scale;
    }
}