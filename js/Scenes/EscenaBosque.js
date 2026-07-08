import { getPersonajeActivo } from '../globals.js';

export class EscenaBosque extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaBosque' });
    }

    create() {
        // ==============================================================
        // 1. DETERMINAR QUÉ PERSONAJES USAR (Fuente Única de Verdad)
        // ==============================================================
        const claveHumano = getPersonajeActivo();

        // ==============================================================
        // 2. ELEMENTOS VISUALES ESTÁTICOS Y DE INTERFAZ
        // ==============================================================
        // Fondo centrado
        this.fondo = this.add.image(825, 450, 'fondoBosque').setDepth(1).setScale(1); // <-- Modifica la escala aquí
        
        // Recuadros de diálogo (Posiciones adaptadas de los porcentajes X: 0.43/0.3, Y: 0.22/0.2)
        this.recuadro = this.add.image(500, 170, 'recuadro').setDepth(2).setScale(1.85, 1.35); // <-- Modifica la escala aquí
        this.recuadroMa = this.add.image(500, 170, 'recuadroM').setDepth(2).setVisible(false).setScale(1.85, 1.35); // <-- Modifica la escala aquí
        this.recuadroPe = this.add.image(500, 170, 'recuadroP').setDepth(2).setVisible(false).setScale(1.85, 1.35); // <-- Modifica la escala aquí
        
        // Botones interactivos (X: 0.3/0.1, Y: 0.44/0.43)
        this.boton = this.add.image(545, 396, 'botonSiguiente').setDepth(4).setInteractive({ useHandCursor: true }).setScale(0.8); // <-- Modifica la escala aquí
        this.botonS = this.add.image(185, 396, 'botonSaltar').setDepth(4).setInteractive({ useHandCursor: true }).setScale(0.8); // <-- Modifica la escala aquí

        // ==============================================================
        // 3. PERSONAJES Y ANIMACIONES
        // ==============================================================
        // Animación de fondo
        this.animacionFondoBosque = this.add.sprite(825 , 450, 'fondoAnimadoBosque').setDepth(10).setVisible(false).setScale(1.05, 1.01); // <-- Modifica la escala aquí


        this.personaje = this.add.sprite(720, 645, claveHumano).setDepth(3).setScale(1); // <-- Modifica la escala aquí
        const animHumano = `caminata-${claveHumano}`;
        if (!this.anims.exists(animHumano)) {
            this.anims.create({
                key: animHumano,
                frames: this.anims.generateFrameNumbers(claveHumano, { start: 0, end: 4 }),
                frameRate: 4,
                repeat: -1
            });
        }
        this.personaje.play(animHumano);


        // 3.3 Mago (X: 0.72, Y: 0.62 -> X: 1188, Y: 558)
        this.mago = this.add.sprite(1008, 575, 'mago').setDepth(3).setVisible(false).setScale(1.2); // <-- Modifica la escala aquí
        if (!this.anims.exists('mago-movimiento')) {
            this.anims.create({
                key: 'mago-movimiento',
                frames: this.anims.generateFrameNumbers('mago', { start: 0, end: 4 }),
                frameRate: 4,
                repeat: -1
            });
        }

        if (!this.anims.exists('fondoAnimadoBosqueFinal')) {
            this.anims.create({
                key: 'fondoAnimadoBosqueFinal',
                frames: this.anims.generateFrameNumbers('fondoAnimadoBosque', { start: 0, end: 36 }),
                frameRate: 5,
                repeat: 0
            });
        }

        // ==============================================================
        // 4. SISTEMA DE DIÁLOGOS
        // ==============================================================
        this.dialogos = [
            'El niño fue llevado a un mundo desconocido que él no podía reconocer: ¿dónde estaba y qué hacía él allí?',
            'A lo lejos, escuchó que alguien se acercaba; parecía ser un hombre alto, con ropas extrañas.',
            'Mago desconocido: ¿Quién eres tú? No eres de por aquí, ¿verdad? ¿Necesitas ayuda?',
            'Niño: No sé qué pasó… Tengo miedo. ¿Qué debo hacer?',
            '(El hombre pensó por un instante, con la mirada fija en el niño.)',
            'Mago desconocido: A veces, los sueños que dan miedo… solo están tomando una nueva forma. Pero primero necesitas valor, pequeño viajero. ¿Estás dispuesto a descubrir lo que este mundo guarda para ti?',
            '(El niño lo miró con duda, cuidadoso por el miedo. No sabía qué responder.)',
            'Te daré una pequeña ayuda… algo que te guíe para descubrir tu propósito aquí.'
        ];
        
        this.dialogoActual = 0;
        
        // Texto nativo centrado en el recuadro principal
        this.texto = this.add.text(511, 171, this.dialogos[this.dialogoActual], {
            fontSize: '38px',
            color: '#000000',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 870 }
        }).setOrigin(0.5).setDepth(5).setScale(1); // <-- Modifica la escala aquí

        // ==============================================================
        // 5. LÓGICA DE EVENTOS Y TRANSICIÓN
        // ==============================================================
        const animarFondo = () => {
            this.texto.setVisible(false);
            this.boton.setVisible(false);
            this.botonS.setVisible(false);
            this.recuadro.setVisible(false);
            this.recuadroMa.setVisible(false);
            this.recuadroPe.setVisible(false);
            
            // Ocultamos a todos los actores
            this.personaje.setVisible(false);
            this.mago.setVisible(false);
            
            this.animacionFondoBosque.setVisible(true);
            this.animacionFondoBosque.play('fondoAnimadoBosqueFinal');
            
            this.animacionFondoBosque.once('animationcomplete', () => {
                this.scene.start('EscenaBosque2');
            });
        };

        this.botonS.on('pointerdown', () => animarFondo());
        
        this.boton.on('pointerdown', () => {
            this.dialogoActual++;
            if (this.dialogoActual < this.dialogos.length) {
                this.texto.setText(this.dialogos[this.dialogoActual]);
                this.actualizarEscenaPorDialogo(this.dialogoActual);
            } else {
                animarFondo();
            }
        });

        // ==============================================================
        // 6. EVENTOS HOVER (Feedback Visual)
        // ==============================================================
        this.agregarEfectoHover(this.boton, 1.1);
        this.agregarEfectoHover(this.botonS, 1.1);
    }

    actualizarEscenaPorDialogo(dialogoIndex) {
        // NOTA DE ARQUITECTURA: Esto está "hardcodeado". En el futuro, si los diálogos
        // vienen de la base de datos, cada diálogo debería incluir un campo 'actor'.
        const mostrarMago = [2, 5, 7];
        const mostrarPe = [3];
        const mostrarNormal = [4, 6];
        const mostrarAnimacion = [0, 1];

        // Oculta todo primero (Reset visual)
        this.recuadro.setVisible(false);
        this.recuadroMa.setVisible(false);
        this.recuadroPe.setVisible(false);
        this.mago.setVisible(false);

        if (mostrarMago.includes(dialogoIndex)) {
            this.mago.setVisible(true);
            this.recuadroMa.setVisible(true);
            this.mago.play('mago-movimiento', true);
        } else if (mostrarPe.includes(dialogoIndex)) {
            this.recuadroPe.setVisible(true);
            this.mago.setVisible(true);
        } else if (mostrarNormal.includes(dialogoIndex)) {
            this.recuadro.setVisible(true);
            this.mago.setVisible(true);
        } else if (mostrarAnimacion.includes(dialogoIndex)) {
            this.recuadro.setVisible(true);
            // El mago se queda oculto
        }
    }

    agregarEfectoHover(boton, multiplicador) {
        boton.escalaBase = boton.scaleX;
        boton.on('pointerover', () => boton.setScale(boton.escalaBase * multiplicador));
        boton.on('pointerout', () => boton.setScale(boton.escalaBase));
    }
}