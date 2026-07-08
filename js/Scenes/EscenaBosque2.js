import { getState, getGatoActivo } from '../globals.js';

export class EscenaBosque2 extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaBosque2' });
    }

    create() {
        // ==============================================================
        // 1. DETERMINAR QUÉ GATO USAR (Fuente Única de Verdad)
        // ==============================================================
        const claveGato = getGatoActivo();

        // ==============================================================
        // 2. ELEMENTOS VISUALES ESTÁTICOS
        // ==============================================================
        this.fondo = this.add.image(825, 450, 'fondoBosque').setDepth(1).setScale(1); // <-- Modifica la escala aquí
        
        // Recuadros de diálogo
        this.recuadro = this.add.image(500, 170, 'recuadro').setDepth(2).setScale(1.85, 1.35); // <-- Modifica la escala aquí
        this.recuadroMa = this.add.image(500, 170, 'recuadroM').setDepth(2).setVisible(false).setScale(1.85, 1.35); // <-- Modifica la escala aquí
        this.recuadroPe = this.add.image(500, 170, 'recuadroP').setDepth(2).setVisible(false).setScale(1.85, 1.35); // <-- Modifica la escala aquí
        
        // Botones interactivos
        this.boton = this.add.image(545, 396, 'botonSiguiente').setDepth(4).setInteractive({ useHandCursor: true }).setScale(0.8); // <-- Modifica la escala aquí
        this.botonS = this.add.image(185, 396, 'botonSaltar').setDepth(4).setInteractive({ useHandCursor: true }).setScale(0.8); // <-- Modifica la escala aquí

        // ==============================================================
        // 3. PERSONAJES Y ANIMACIONES
        // ==============================================================
        
        // 3.1 Renderizamos al Gato (X: 0.51, Y: 0.81 -> X: 841, Y: 729)
        this.gato = this.add.sprite(770, 695, claveGato).setDepth(3).setScale(1); // <-- Modifica la escala aquí
        const animGato = `caminata-${claveGato}`;
        
        if (!this.anims.exists(animGato)) {
            this.anims.create({
                key: animGato,
                // Ajusta el end según los frames que realmente tenga tu spritesheet de gato
                frames: this.anims.generateFrameNumbers(claveGato, { start: 0, end: 4 }), 
                frameRate: 3,
                repeat: -1
            });
        }
        
        // 3.2 Mago (Misma posición que en la escena anterior: X: 1188, Y: 558)
        this.mago = this.add.sprite(1008, 575, 'mago').setDepth(3).setScale(1.2); // <-- Modifica la escala aquí
        if (!this.anims.exists('mago-movimiento')) {
            this.anims.create({
                key: 'mago-movimiento',
                frames: this.anims.generateFrameNumbers('mago', { start: 0, end: 4 }),
                frameRate: 4,
                repeat: -1
            });
        }

        this.gato.play(animGato);
        this.mago.play('mago-movimiento');

        // ==============================================================
        // 4. SISTEMA DE DIÁLOGOS
        // ==============================================================
        const nombreJugador = getState().jugador?.jugador || getState().jugador?.nombre_jugador || 'Viajero';

        this.dialogos = [
            '(El niño, ahora transformado en un gato, no podía decir nada.)',
            'Mago desconocido (desde su mente): Por ahora tendremos que hablar mentalmente. Dime, ¿cómo te sientes?',
            'Gato (niño): ¿Por qué soy un gato?',
            'Mago desconocido: Los gatos son inteligentes. Vayamos a mi casa: te daré unas herramientas que utilizarás. Luego, partirás.',
            'Gato (niño): ¿Me dejarás solo? ¿Qué se supone que debo hacer?',
            'Mago desconocido: Así es tu destino. Por cierto, ¿cómo te llamas? Mi nombre es Thalor.',
            'Gato (niño): Soy ...',
            nombreJugador // Inserción dinámica del nombre
        ];
        
        this.dialogoActual = 0;

        // Texto nativo centrado
        this.texto = this.add.text(511, 171, this.dialogos[this.dialogoActual], {
            fontSize: '38px',
            color: '#000000',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5).setDepth(5).setScale(1); // <-- Modifica la escala aquí

        // ==============================================================
        // 5. LÓGICA DE EVENTOS Y TRANSICIÓN
        // ==============================================================
        const avanzarEscena = () => {
            // Limpieza del input residual del DOM (si existe)
            document.getElementById('nombreInput')?.remove();
            this.scene.start('EscenaCabanaAfuera');
        };

        this.botonS.on('pointerdown', () => avanzarEscena());
        
        this.boton.on('pointerdown', () => {
            this.dialogoActual++;
            if (this.dialogoActual < this.dialogos.length) {
                this.texto.setText(this.dialogos[this.dialogoActual]);
                this.actualizarEscenaPorDialogo(this.dialogoActual);
            } else {
                avanzarEscena();
            }
        });

        // ==============================================================
        // 6. EVENTOS HOVER (Feedback Visual)
        // ==============================================================
        this.agregarEfectoHover(this.boton, 1.1);
        this.agregarEfectoHover(this.botonS, 1.1);
    }

    actualizarEscenaPorDialogo(dialogoIndex) {
        const mostrarMago = [1, 3, 5];
        const mostrarPe = [2, 4, 6, 7];
        const mostrarNormal = [0];

        // Ocultar todos los recuadros por defecto
        this.recuadro.setVisible(false);
        this.recuadroMa.setVisible(false);
        this.recuadroPe.setVisible(false);

        // Mostrar el correspondiente
        if (mostrarMago.includes(dialogoIndex)) {
            this.recuadroMa.setVisible(true);
        } else if (mostrarPe.includes(dialogoIndex)) {
            this.recuadroPe.setVisible(true);
        } else if (mostrarNormal.includes(dialogoIndex)) {
            this.recuadro.setVisible(true);
        }   
    }

    agregarEfectoHover(boton, multiplicador) {
        boton.escalaBase = boton.scaleX;
        boton.on('pointerover', () => boton.setScale(boton.escalaBase * multiplicador));
        boton.on('pointerout', () => boton.setScale(boton.escalaBase));
    }
}