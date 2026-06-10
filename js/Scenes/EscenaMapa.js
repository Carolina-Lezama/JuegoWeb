import { getState } from '../globals.js';
import { reescalarGlobalFlexible, createAndAdaptTextFlexible, agregarEfectoHover } from '../uiHelpers.js';

export class EscenaMapa extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaMapa' });
    }

    create() {
        // 1. FONDOS Y ELEMENTOS ESTÁTICOS
        this.EscenaMapa = this.add.image(0, 0, 'EscenaMapa').setDepth(0);
        
        // 2. BOTONES E INTERFAZ
        this.regreso = this.add.image(0, 0, 'regreso').setDepth(10).setInteractive({ useHandCursor: true });
        this.botonFinalizar = this.add.image(0, 0, 'botonFinalizar').setDepth(10).setInteractive({ useHandCursor: true });
        
        // Íconos de Niveles / Enemigos
        this.IconoCaballero = this.add.image(0, 0, 'IconoCaballero').setDepth(10).setInteractive({ useHandCursor: true });
        this.IconoCalaca = this.add.image(0, 0, 'IconoCalaca').setDepth(10).setInteractive({ useHandCursor: true });
        this.IconoDuende = this.add.image(0, 0, 'IconoDuende').setDepth(10).setInteractive({ useHandCursor: true });
        this.IconoSlime = this.add.image(0, 0, 'IconoSlime').setDepth(10).setInteractive({ useHandCursor: true });

        // 3. PERSONAJES Y ANIMACIONES
        this.gato = this.add.sprite(0, 0, 'gato').setDepth(5).setFlipX(true);
        this.mago = this.add.sprite(0, 0, 'mago').setDepth(5).setFlipX(true);

        // Protección de animaciones
        if (!this.anims.exists('gato-movimiento')) {
            this.anims.create({ key: 'gato-movimiento', frames: this.anims.generateFrameNumbers('gato', { start: 0, end: 7 }), frameRate: 3, repeat: -1 });
        }
        if (!this.anims.exists('mago-movimiento')) {
            this.anims.create({ key: 'mago-movimiento', frames: this.anims.generateFrameNumbers('mago', { start: 0, end: 4 }), frameRate: 5, repeat: -1 });
        }

        this.gato.play('gato-movimiento');
        this.mago.play('mago-movimiento');

        // 4. TEXTOS (Puntuación)
        // Extraemos los puntos actualizados desde el Gestor de Estado
        const puntosActuales = getState().puntosTotales || 0;

        this.texto1 = createAndAdaptTextFlexible(this, {
            text: 'Puntos',
            posX: 0.5, posY: 0.1, maxWidth: 950, fontSizeInicial: 110,
            originX: 0.5, originY: 0.5, color: '#000000'
        }).setDepth(5);

        this.texto2 = createAndAdaptTextFlexible(this, {
            text: String(puntosActuales), // Convertimos a string por seguridad
            posX: 0.5, posY: 0.25, maxWidth: 950, fontSizeInicial: 85,
            originX: 0.5, originY: 0.5, color: '#000000'
        }).setDepth(5);

        // 5. EVENTOS DE NAVEGACIÓN
        this.regreso.on('pointerdown', () => this.scene.start('EscenaInicio'));
        this.botonFinalizar.on('pointerdown', () => this.scene.start('EscenaFinal'));
        
        // Rutas de Combate
        this.IconoSlime.on('pointerdown', () => this.scene.start('EscenaPeleaSlime'));
        this.IconoCaballero.on('pointerdown', () => this.scene.start('EscenaCastilloIfernal'));
        this.IconoCalaca.on('pointerdown', () => this.scene.start('EscenaCementerio'));
        this.IconoDuende.on('pointerdown', () => this.scene.start('EscenaCasaAbandonada'));

        // 6. EFECTOS VISUALES (Hover)
        agregarEfectoHover(this.regreso);
        agregarEfectoHover(this.botonFinalizar, 1.05); // Crece un poco menos por ser un botón grande
        agregarEfectoHover(this.IconoSlime, 1.1);
        agregarEfectoHover(this.IconoCaballero, 1.1);
        agregarEfectoHover(this.IconoCalaca, 1.1);
        agregarEfectoHover(this.IconoDuende, 1.1);

        // 7. RESPONSIVIDAD
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());
    }

    aplicarReescalado() {
        reescalarGlobalFlexible(this, [
            { obj: this.EscenaMapa, posX: 0.5, posY: 0.5, originX: 0.5, originY: 0.5, escalaRelativa: 1, autoFill: true },
            
            // Botones de sistema
            { obj: this.regreso, posX: 0.05, posY: 0.1, escalaRelativa: 0.16 },
            { obj: this.botonFinalizar, posX: 0.5, posY: 0.5, escalaRelativa: 0.5 },
            
            // Íconos de nivel (Distribución en cuadrícula)
            { obj: this.IconoSlime, posX: 0.2, posY: 0.3, escalaRelativa: 0.32 },
            { obj: this.IconoDuende, posX: 0.8, posY: 0.3, escalaRelativa: 0.32 },
            { obj: this.IconoCalaca, posX: 0.2, posY: 0.7, escalaRelativa: 0.32 },
            { obj: this.IconoCaballero, posX: 0.8, posY: 0.7, escalaRelativa: 0.32 },
            
            // Personajes decorativos
            { obj: this.gato, posX: 0.58, posY: 0.9, escalaRelativa: 0.19 },
            { obj: this.mago, posX: 0.44, posY: 0.8, escalaRelativa: 0.22 }
        ]);

        // Guardar escalas base para el efecto Hover
        this.regreso.escalaBase = this.regreso.scale;
        this.botonFinalizar.escalaBase = this.botonFinalizar.scale;
        this.IconoSlime.escalaBase = this.IconoSlime.scale;
        this.IconoCaballero.escalaBase = this.IconoCaballero.scale;
        this.IconoCalaca.escalaBase = this.IconoCalaca.scale;
        this.IconoDuende.escalaBase = this.IconoDuende.scale;
    }
}