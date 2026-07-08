import { getState, getGatoActivo } from '../globals.js'; // <-- Agregado getGatoActivo

export class EscenaMapa extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaMapa' });
    }

    create() {
        // ==============================================================
        // 1. FONDOS Y ELEMENTOS ESTÁTICOS (Base 1650 x 900)
        // ==============================================================
        this.EscenaMapa = this.add.image(825, 450, 'EscenaMapa').setDepth(0).setScale(1); 
        
        // ==============================================================
        // 2. BOTONES E INTERFAZ
        // ==============================================================
        this.regreso = this.add.image(82, 90, 'regreso').setDepth(10).setInteractive({ useHandCursor: true }).setScale(1.2);
        this.botonFinalizar = this.add.image(825, 450, 'botonFinalizar').setDepth(10).setInteractive({ useHandCursor: true }).setScale(1.5);
        
        // Íconos de Niveles / Enemigos
        this.IconoSlime = this.add.image(330, 270, 'IconoSlime').setDepth(10).setInteractive({ useHandCursor: true }).setScale(1.7);
        this.IconoDuende = this.add.image(1320, 270, 'IconoDuende').setDepth(10).setInteractive({ useHandCursor: true }).setScale(1.7);
        this.IconoCalaca = this.add.image(330, 630, 'IconoCalaca').setDepth(10).setInteractive({ useHandCursor: true }).setScale(1.7);
        this.IconoCaballero = this.add.image(1320, 630, 'IconoCaballero').setDepth(10).setInteractive({ useHandCursor: true }).setScale(1.7);

        // ==============================================================
        // 3. PERSONAJES Y ANIMACIONES (Gato Dinámico)
        // ==============================================================
        const claveGato = getGatoActivo(); // <-- Determinamos el gato activo

        this.gato = this.add.sprite(957, 810, claveGato).setDepth(5).setFlipX(true).setScale(1);
        this.mago = this.add.sprite(726, 720, 'mago').setDepth(5).setFlipX(true).setScale(1.2);

        // Animación dinámica para el gato
        const animGato = `movimiento-${claveGato}`;
        if (!this.anims.exists(animGato)) {
            this.anims.create({ 
                key: animGato, 
                frames: this.anims.generateFrameNumbers(claveGato, { start: 0, end: 7 }), // Ajusta el 'end' si tu sprite tiene menos frames
                frameRate: 3, 
                repeat: -1 
            });
        }

        // Animación estática del mago
        if (!this.anims.exists('mago-movimiento')) {
            this.anims.create({ 
                key: 'mago-movimiento', 
                frames: this.anims.generateFrameNumbers('mago', { start: 0, end: 4 }), 
                frameRate: 5, 
                repeat: -1 
            });
        }

        this.gato.play(animGato);
        this.mago.play('mago-movimiento');

        // ==============================================================
        // 4. TEXTOS (Puntuación)
        // ==============================================================
        const puntosActuales = getState().puntosTotales || 0;

        this.texto1 = this.add.text(825, 90, 'Puntos', {
            fontFamily: 'Arial', 
            fontSize: '110px',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5).setDepth(5).setScale(1);

        this.texto2 = this.add.text(825, 225, String(puntosActuales), {
            fontFamily: 'Arial', 
            fontSize: '85px',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5).setDepth(5).setScale(1);

        // ==============================================================
        // 5. EVENTOS DE NAVEGACIÓN
        // ==============================================================
        this.regreso.on('pointerdown', () => this.scene.start('EscenaInicio'));
        this.botonFinalizar.on('pointerdown', () => this.scene.start('EscenaFinal'));
        
        // Rutas de Combate
        this.IconoSlime.on('pointerdown', () => this.scene.start('EscenaPeleaSlime'));
        this.IconoCaballero.on('pointerdown', () => this.scene.start('EscenaCastilloIfernal'));
        this.IconoCalaca.on('pointerdown', () => this.scene.start('EscenaCementerio'));
        this.IconoDuende.on('pointerdown', () => this.scene.start('EscenaCasaAbandonada'));

        // ==============================================================
        // 6. EFECTOS VISUALES (Hover)
        // ==============================================================
        this.agregarEfectoHover(this.regreso, 1.1);
        this.agregarEfectoHover(this.botonFinalizar, 1.05); 
        this.agregarEfectoHover(this.IconoSlime, 1.1);
        this.agregarEfectoHover(this.IconoCaballero, 1.1);
        this.agregarEfectoHover(this.IconoCalaca, 1.1);
        this.agregarEfectoHover(this.IconoDuende, 1.1);
    }

    agregarEfectoHover(boton, multiplicador) {
        boton.escalaBase = boton.scaleX;
        boton.on('pointerover', () => boton.setScale(boton.escalaBase * multiplicador));
        boton.on('pointerout', () => boton.setScale(boton.escalaBase));
    }
}