import { getState } from '../globals.js';
import { reescalarGlobalFlexible, createAndAdaptTextFlexible, agregarEfectoHover } from '../uiHelpers.js';

export class EscenaBosque2 extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaBosque2' });
    }

    create() {
        // 1. ELEMENTOS VISUALES ESTÁTICOS
        this.fondo = this.add.image(0, 0, 'fondoBosque').setDepth(1);
        
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
        // Obtenemos el nombre del jugador desde el estado global (o usamos 'Viajero' si no hay sesión)
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

        // Texto adaptativo
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

        // 5. RESPONSIVIDAD Y EFECTOS VISUALES
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());

        agregarEfectoHover(this.boton);
        agregarEfectoHover(this.botonS);
    }

    actualizarEscenaPorDialogo(dialogoIndex) {
        // Índices en los que habla cada personaje
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

    aplicarReescalado() {
        reescalarGlobalFlexible(this, [
            { obj: this.fondo, posX: 0.5, posY: 0.5, escalaRelativa: 1, autoFill: true },
            
            // Recuadros
            { obj: this.recuadro, posX: 0.43, posY: 0.22, escalaRelativa: 1.7 },
            { obj: this.recuadroPe, posX: 0.3, posY: 0.2, escalaRelativa: 1.18 },
            { obj: this.recuadroMa, posX: 0.3, posY: 0.2, escalaRelativa: 1.18 },
            
            // Interfaz
            { obj: this.boton, posX: 0.3, posY: 0.44, escalaRelativa: 0.34 },
            { obj: this.botonS, posX: 0.1, posY: 0.43, escalaRelativa: 0.34 },
            
            // Actores
            { obj: this.gato, posX: 0.51, posY: 0.81, escalaRelativa: 0.3 },
            { obj: this.mago, posX: 0.72, posY: 0.62, escalaRelativa: 0.38 }
        ]);

        // Guardar escalas base para el efecto Hover
        this.boton.escalaBase = this.boton.scale;
        this.botonS.escalaBase = this.botonS.scale;
    }
}