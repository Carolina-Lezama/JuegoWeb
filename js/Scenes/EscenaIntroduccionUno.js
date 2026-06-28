import { getState, getPersonajeActivo, getGatoActivo } from '../globals.js';

export class EscenaIntroduccionUno extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaIntroduccionUno' });
    }

    create() {
        // ==============================================================
        // 1. DETERMINAR QUÉ PERSONAJES USAR (Fuente Única de Verdad)
        // ==============================================================
        // Usamos las funciones del globals.js que ya resuelven el predeterminado
        const claveHumano = getPersonajeActivo(); 
        const claveGato = getGatoActivo(); 

        // ==============================================================
        // 2. ELEMENTOS VISUALES ESTÁTICOS
        // ==============================================================
        this.fondo = this.add.image(825, 900, 'fondoIntroduccionUno').setOrigin(0.5, 1).setDepth(1).setScale(1); 
        this.animacionFondo = this.add.sprite(825, 900, 'fondoAnimado').setOrigin(0.5, 1).setVisible(false).setDepth(10).setScale(1); 
        
        this.recuadro = this.add.image(1370, 225, 'recuadro').setDepth(2).setScale(1); 
        
        this.regreso = this.add.image(83, 90, 'regreso').setDepth(10).setInteractive({ useHandCursor: true }).setScale(1); 
        this.boton = this.add.image(1450, 432, 'botonSiguiente').setDepth(5).setInteractive({ useHandCursor: true }).setScale(1); 
        this.botonS = this.add.image(825, 414, 'botonSaltar').setDepth(5).setInteractive({ useHandCursor: true }).setScale(1); 

        // ==============================================================
        // 3. PERSONAJES Y ANIMACIONES
        // ==============================================================
        
        // 3.1 Renderizamos al Humano
        this.personaje = this.add.sprite(280, 612, claveHumano).setDepth(3).setScale(1); 
        const animHumano = `caminata-${claveHumano}`;

        if (!this.anims.exists(animHumano)) {
            this.anims.create({
                key: animHumano,
                frames: this.anims.generateFrameNumbers(claveHumano, { start: 0, end: 4 }),
                frameRate: 5,
                repeat: -1
            });
        }
        this.personaje.play(animHumano);



        // Animación del fondo final
        if (!this.anims.exists('fondoAnimadoFinal')) {
            this.anims.create({
                key: 'fondoAnimadoFinal',
                frames: this.anims.generateFrameNumbers('fondoAnimado', { start: 0, end: 38 }),
                frameRate: 8,
                repeat: 0
            });
        }

        // ==============================================================
        // 4. SISTEMA DE DIÁLOGOS
        // ==============================================================
        const dialogosAPI = getState().dialogos || {};
        
        this.dialogos = [
            dialogosAPI.introduccion_uno || 'Había una vez un niño que adoraba los mundos de fantasía, las historias de magia y los caballeros.',
            dialogosAPI.introduccion_dos || 'Vencer enemigos, ser un héroe... todos esos sueños que tiene un niño de ocho años.',
            dialogosAPI.introduccion_tres || 'Lastimosamente, el niño no sabía que había alguien más que podía conocer sus deseos… alguien que haría su sueño realidad, aunque no de la forma en que él lo esperaba.'
        ];
        this.dialogoActual = 0;

        this.texto = this.add.text(1170, 198, this.dialogos[this.dialogoActual], {
            fontSize: '41px',
            color: '#000000',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 970 } 
        }).setOrigin(0.5).setDepth(4).setScale(1); 

        // ==============================================================
        // 5. LÓGICA DE EVENTOS (Flujo de la escena)
        // ==============================================================
        const animarFondo = () => {
            this.texto.setVisible(false);
            this.boton.setVisible(false);
            this.botonS.setVisible(false);
            this.recuadro.setVisible(false);
            
            // Ocultamos ambos personajes
            this.personaje.setVisible(false);
            this.gato.setVisible(false);
            
            this.animacionFondo.setVisible(true);
            this.animacionFondo.play('fondoAnimadoFinal');
            
            this.animacionFondo.once('animationcomplete', () => {
                this.scene.start('EscenaBosque');
            });
        };

        this.regreso.on('pointerdown', () => this.scene.start('EscenaInicio'));
        
        this.botonS.on('pointerdown', () => animarFondo());
        
        this.boton.on('pointerdown', () => {
            this.dialogoActual++;
            if (this.dialogoActual < this.dialogos.length) {
                this.texto.setText(this.dialogos[this.dialogoActual]);
            } else {
                animarFondo();
            }
        });

        // ==============================================================
        // 6. EVENTOS HOVER (Feedback visual)
        // ==============================================================
        this.agregarEfectoHover(this.boton, 1.1);
        this.agregarEfectoHover(this.botonS, 1.1);
        this.agregarEfectoHover(this.regreso, 1.1);
    }

    agregarEfectoHover(boton, multiplicador) {
        boton.escalaBase = boton.scaleX;
        boton.on('pointerover', () => boton.setScale(boton.escalaBase * multiplicador));
        boton.on('pointerout', () => boton.setScale(boton.escalaBase));
    }
}