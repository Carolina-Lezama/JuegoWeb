import { reescalarGlobalFlexible, createAndAdaptTextFlexible, agregarEfectoHover } from '../uiHelpers.js';

export class EscenaCabanaAfuera extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaCabanaAfuera' });
    }

    create() {
        // 1. ELEMENTOS VISUALES ESTÁTICOS
        this.fondo = this.add.image(0, 0, 'FondoCabana').setDepth(1);
        
        // Recuadros de diálogo
        this.recuadro = this.add.image(0, 0, 'recuadro').setDepth(2);
        this.recuadroMa = this.add.image(0, 0, 'recuadroM').setDepth(2).setVisible(false);
        this.recuadroPe = this.add.image(0, 0, 'recuadroP').setDepth(2).setVisible(false);
        
        // Botones interactivos
        this.boton = this.add.image(0, 0, 'botonSiguiente').setDepth(4).setInteractive({ useHandCursor: true });
        this.botonS = this.add.image(0, 0, 'botonSaltar').setDepth(4).setInteractive({ useHandCursor: true });

        // 2. PERSONAJES Y ANIMACIONES
        this.gato = this.add.sprite(0, 0, 'gato').setDepth(3);
        this.mago = this.add.sprite(0, 0, 'mago').setDepth(3);

        // Protección de creación de animaciones
        if (!this.anims.exists('gato-movimiento')) {
            this.anims.create({
                key: 'gato-movimiento',
                frames: this.anims.generateFrameNumbers('gato', { start: 0, end: 7 }),
                frameRate: 3,
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

        this.gato.play('gato-movimiento');
        this.mago.play('mago-movimiento');

        // 3. SISTEMA DE DIÁLOGOS
        this.dialogos = [
            '(Llegan a la casa del mago, que es una cabaña acogedora en medio del bosque)',
            'Thalor: Esta es mi casa. ¿Qué te parece? Es linda, ¿no?',
            'Gato (niño): Miau, miau, miau. (Es acogedora como mi casa.)',
            'Thalor: Rápido, entremos. La noche es peligrosa. Saldremos mañana, para que te vayas.',
            '(Entran a casa.)'
        ];
        
        this.dialogoActual = 0;

        // Texto adaptativo
        this.texto = createAndAdaptTextFlexible(this, {
            text: this.dialogos[this.dialogoActual],
            posX: 0.74,
            posY: 0.19,
            maxWidth: 850,
            fontSizeInicial: 36,
            originX: 0.5,
            originY: 0.5,
            color: '#000000'
        }).setDepth(5);

        // 4. LÓGICA DE EVENTOS Y TRANSICIÓN
        const avanzarEscena = () => {
            // Limpiamos el DOM por seguridad como en la escena anterior
            document.getElementById('nombreInput')?.remove();
            this.scene.start('EscenaCabanaAdentro');
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

        // 5. RESPONSIVIDAD Y EFECTOS
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());

        agregarEfectoHover(this.boton);
        agregarEfectoHover(this.botonS);
    }

    actualizarEscenaPorDialogo(dialogoIndex) {
        const mostrarMago = [1, 3];
        const mostrarPe = [2];
        const mostrarNormal = [0, 4];

        // Ocultar todos los recuadros primero
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

    aplicarReescalado() {
        reescalarGlobalFlexible(this, [
            // Fondo anclado a la base inferior
            { obj: this.fondo, posX: 0.5, posY: 1, originX: 0.5, originY: 1, escalaRelativa: 1, autoFill: true },
            
            // Recuadros
            { obj: this.recuadro, posX: 0.85, posY: 0.22, escalaRelativa: 1.5 },
            { obj: this.recuadroPe, posX: 0.73, posY: 0.19, escalaRelativa: 1.03 },
            { obj: this.recuadroMa, posX: 0.73, posY: 0.19, escalaRelativa: 1.04 },
            
            // Botones
            { obj: this.boton, posX: 0.73, posY: 0.42, escalaRelativa: 0.32 },
            { obj: this.botonS, posX: 0.9, posY: 0.41, escalaRelativa: 0.32 },
            
            // Actores
            { obj: this.gato, posX: 0.24, posY: 0.81, escalaRelativa: 0.24 },
            { obj: this.mago, posX: 0.44, posY: 0.67, escalaRelativa: 0.3 }
        ]);

        // Guardar escalas base para el Hover
        this.boton.escalaBase = this.boton.scale;
        this.botonS.escalaBase = this.botonS.scale;
    }
}