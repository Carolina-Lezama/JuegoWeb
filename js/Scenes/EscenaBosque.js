import { reescalarGlobalFlexible, createAndAdaptTextFlexible, agregarEfectoHover } from '../uiHelpers.js';

export class EscenaBosque extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaBosque' });
    }

    create() {
        // 1. ELEMENTOS VISUALES ESTÁTICOS Y DE INTERFAZ
        this.fondo = this.add.image(0, 0, 'fondoBosque').setDepth(1);
        
        // Recuadros de diálogo
        this.recuadro = this.add.image(0, 0, 'recuadro').setDepth(2);
        this.recuadroMa = this.add.image(0, 0, 'recuadroM').setDepth(2).setVisible(false);
        this.recuadroPe = this.add.image(0, 0, 'recuadroP').setDepth(2).setVisible(false);
        
        // Botones interactivos
        this.boton = this.add.image(0, 0, 'botonSiguiente').setDepth(4).setInteractive({ useHandCursor: true });
        this.botonS = this.add.image(0, 0, 'botonSaltar').setDepth(4).setInteractive({ useHandCursor: true });

        // 2. PERSONAJES Y ANIMACIONES
        this.personaje = this.add.sprite(0, 0, 'personajeUsar').setDepth(3);
        this.mago = this.add.sprite(0, 0, 'mago').setDepth(3).setVisible(false);
        this.animacionFondoBosque = this.add.sprite(0, 0, 'fondoAnimadoBosque').setDepth(10).setVisible(false);

        // Protección de animaciones (vital si la escena se reinicia)
        if (!this.anims.exists('personaje-movimiento')) {
            this.anims.create({
                key: 'personaje-movimiento',
                frames: this.anims.generateFrameNumbers('personajeUsar', { start: 0, end: 4 }),
                frameRate: 5,
                repeat: -1
            });
        }
        if (!this.anims.exists('mago-movimiento')) {
            this.anims.create({
                key: 'mago-movimiento',
                frames: this.anims.generateFrameNumbers('mago', { start: 0, end: 4 }),
                frameRate: 5,
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

        this.personaje.play('personaje-movimiento');

        // 3. SISTEMA DE DIÁLOGOS
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
        
        this.texto = createAndAdaptTextFlexible(this, {
            text: this.dialogos[this.dialogoActual],
            posX: 0.31,
            posY: 0.19,
            maxWidth: 970,
            fontSizeInicial: 38,
            originX: 0.5,
            originY: 0.5,
            color: '#000000'
        }).setDepth(5);

        // 4. LÓGICA DE EVENTOS Y TRANSICIÓN
        const animarFondo = () => {
            this.texto.setVisible(false);
            this.boton.setVisible(false);
            this.botonS.setVisible(false);
            this.recuadro.setVisible(false);
            this.recuadroMa.setVisible(false);
            this.recuadroPe.setVisible(false);
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

        // 5. RESPONSIVIDAD Y EFECTOS
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());

        agregarEfectoHover(this.boton);
        agregarEfectoHover(this.botonS);
    }

    actualizarEscenaPorDialogo(dialogoIndex) {
        // NOTA DE ARQUITECTURA: Esto está "hardcodeado". En el futuro, si los diálogos
        // vienen de la base de datos, cada diálogo debería incluir un campo 'actor' 
        // (ej: { texto: "...", actor: "mago" }) para evitar usar estos arreglos fijos.
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

    aplicarReescalado() {
        reescalarGlobalFlexible(this, [
            { obj: this.fondo, posX: 0.5, posY: 0.5, escalaRelativa: 1, autoFill: true },
            { obj: this.animacionFondoBosque, posX: 0.5, posY: 0.5, escalaRelativa: 1, autoFill: true },
            
            // Recuadros de texto (Se enciman en la misma posición)
            { obj: this.recuadro, posX: 0.43, posY: 0.22, escalaRelativa: 1.7 },
            { obj: this.recuadroPe, posX: 0.3, posY: 0.2, escalaRelativa: 1.18 },
            { obj: this.recuadroMa, posX: 0.3, posY: 0.2, escalaRelativa: 1.18 },
            
            // Interfaz
            { obj: this.boton, posX: 0.3, posY: 0.44, escalaRelativa: 0.34 },
            { obj: this.botonS, posX: 0.1, posY: 0.43, escalaRelativa: 0.34 },
            
            // Actores
            { obj: this.personaje, posX: 0.51, posY: 0.69, escalaRelativa: 0.32 },
            { obj: this.mago, posX: 0.72, posY: 0.62, escalaRelativa: 0.38 }
        ]);

        // Guardamos escalas para el Hover
        this.boton.escalaBase = this.boton.scale;
        this.botonS.escalaBase = this.botonS.scale;
    }
}