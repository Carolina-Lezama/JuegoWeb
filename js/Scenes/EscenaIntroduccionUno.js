import { getState } from '../globals.js';

export class EscenaIntroduccionUno extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaIntroduccionUno' });
    }

    create() {
        // ==============================================================
        // 1. DETERMINAR QUÉ PERSONAJE USAR (Mapeo de Claves)
        // ==============================================================
        const estado = getState();
        
        // 1.1 Leemos la elección de la interfaz (ej. 'personaje1' o 'gato2')
        const seleccionInterfaz = estado.personajeHumanoEnUso || estado.personajeGatoEnUso || 'personaje1';

        // 1.2 Diccionario para traducir el icono del menú al SpriteSheet real.
        // Si tienes los spritesheet de los gatos cargados en el Preload, asegúrate de añadirlos aquí.
        const mapaSprites = {
            'personaje1': 'SpritePersonaje1',
            'personaje2': 'SpritePersonaje2',
            'personaje3': 'SpritePersonaje3',
            'personaje4': 'SpritePersonaje4',
            
            // Ejemplo de mapeo para gatos (ajusta los nombres a los que uses en tu PreloadScene)
            'gato1': 'SpriteGato1', 
            'gato2': 'SpriteGato2',
            'gato3': 'SpriteGato3',
            'gato4': 'SpriteGato4'
        };

        // 1.3 Asignamos el Spritesheet animado. Si la selección no está en el mapa, hacemos fallback a 'SpritePersonaje1'
        this.claveAnimada = mapaSprites[seleccionInterfaz] || 'SpritePersonaje1';


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
        // 3. PERSONAJE Y ANIMACIONES (Usando la clave MAPEADA)
        // ==============================================================
        
        // Ahora usamos this.claveAnimada (ej. 'SpritePersonaje1')
        this.personaje = this.add.sprite(280, 612, this.claveAnimada).setDepth(3).setScale(1); 

        // Nombramos la animación para que sea única por personaje
        const nombreAnimacion = `caminata-${this.claveAnimada}`;

        if (!this.anims.exists(nombreAnimacion)) {
            this.anims.create({
                key: nombreAnimacion,
                // Generamos los 5 frames que mencionaste (0 al 4)
                frames: this.anims.generateFrameNumbers(this.claveAnimada, { start: 0, end: 4 }),
                frameRate: 5,
                repeat: -1
            });
        }

        if (!this.anims.exists('fondoAnimadoFinal')) {
            this.anims.create({
                key: 'fondoAnimadoFinal',
                frames: this.anims.generateFrameNumbers('fondoAnimado', { start: 0, end: 38 }),
                frameRate: 8,
                repeat: 0
            });
        }

        // Reproducimos la animación correcta
        this.personaje.play(nombreAnimacion);

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
            this.personaje.setVisible(false);
            
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