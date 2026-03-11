import { objetosDelPersonaje, datosObjetos, objetos, objetosActivos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu, jugador, puntosTotales } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible, cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId } from '../responsive.js';

//--- ESCENA DE LA CABAÑA ADENTRO
export class EscenaFinal extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaFinal' });
    }

    preload() {
        // asumo que ya cargaste spritesheets y audios en otra parte del preload global
    }

    create() {
        // --- Animación parte uno ---
        this.AnimacionFinalParteUno = this.add.sprite(0, 0, 'AnimacionFinalParteUno').setVisible(true);
        this.anims.create({
            key: 'AnimacionFinalParteUno-movimiento',
            frames: this.anims.generateFrameNumbers('AnimacionFinalParteUno', { start: 0, end: 31 }),
            frameRate: 5,
            repeat: 0
        });

        // Fondo y elementos UI (depths: fondo=2, recuadro/boton=3, personaje=4, texto=5)
        this.FondoTelevision = this.add.image(0, 0, 'FondoTelevision').setVisible(false).setDepth(2);
        this.ImagenFinal = this.add.image(0, 0, 'ImagenFinal').setVisible(false).setDepth(6);

        this.recuadroPe = this.add.image(0, 0, 'recuadroP').setDepth(3).setVisible(false);
        this.botonSiguiente = this.add.image(0, 0, 'botonSiguiente').setInteractive().setDepth(5).setVisible(false);

        // Personaje (niño) — debe quedar por encima del recuadro y el botón
        this.personaje = this.add.sprite(0, 0, 'personajeUsar').setVisible(false).setDepth(4);
        this.anims.create({
            key: 'personaje-movimiento',
            frames: this.anims.generateFrameNumbers('personajeUsar', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });

        // Texto adaptativo — darle depth superior al recuadro
        this.texto = createAndAdaptTextFlexible(this, {
            text: '',
            posX: 0.28,
            posY: 0.18,
            maxWidth: 970,
            maxHeight: 500,
            fontSizeInicial: 38,
            fontSizeMinimo: 10,
            originX: 0.5,
            originY: 0.5,
            config: {
                fontFamily: 'Silkscreen',
                color: '#000000',
                align: 'center'
            }
        }).setDepth(5).setVisible(false);

        // --- Animación parte dos (transición) ---
        this.AnimacionFinalParteDos = this.add.sprite(0, 0, 'AnimacionFinalParteDos').setVisible(false).setDepth(2);
        this.anims.create({
            key: 'AnimacionFinalParteDos-movimiento',
            frames: this.anims.generateFrameNumbers('AnimacionFinalParteDos', { start: 0, end: 7 }),
            frameRate: 3,
            repeat: 0
        });

        // --- Animación parte tres (loop infinito mientras dura musicaFinal) ---
        this.AnimacionFinalParteTres = this.add.sprite(0, 0, 'AnimacionFinalParteTres').setVisible(false).setDepth(6);
        this.anims.create({
            key: 'AnimacionFinalParteTres-movimiento',
            frames: this.anims.generateFrameNumbers('AnimacionFinalParteTres', { start: 0, end: 3 }), // ajusta end según tu spritesheet
            frameRate: 5,
            repeat: -1
        });

        // Diálogos
        let e_uno = 'Ese fue un sueño muy raro.';
        let e_dos = 'Mejor escuchemos un rato la radio.';
        this.dialogos = [e_uno, e_dos];
        this.dialogoActual = 0;
        this.texto.setText(this.dialogos[this.dialogoActual]);

        // listener: cuando termine la primera animación (parte uno)
        this.AnimacionFinalParteUno.on('animationcomplete', () => {
            // Ocultar la animación 1 y mostrar fondo + UI
            this.AnimacionFinalParteUno.setVisible(false);
            this.FondoTelevision.setVisible(true);

            // mostrar personaje y texto por encima del recuadro y botón
            this.personaje.setVisible(true);
            this.personaje.anims.play('personaje-movimiento', true);

            this.recuadroPe.setVisible(true);
            this.botonSiguiente.setVisible(true);
            this.botonSiguiente.setInteractive();

            this.texto.setVisible(true);
        });

        // Botón siguiente: avanzar diálogos
        this.botonSiguiente.on('pointerdown', () => {
            this.dialogoActual++;
            if (this.dialogoActual < this.dialogos.length) {
                this.texto.setText(this.dialogos[this.dialogoActual]);
                // Llamar función existente si la tienes
                if (typeof this.actualizarEscenaPorDialogo === 'function') {
                    this.actualizarEscenaPorDialogo(this.dialogoActual);
                }
            } else {
                // Se acabaron los diálogos: iniciar secuencia de cierre
                this.iniciarSecuenciaFinal();
            }
            
        });

        // Iniciar la animación parte uno
        this.AnimacionFinalParteUno.anims.play('AnimacionFinalParteUno-movimiento', true);

        // Reescalado inicial y on resize
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());

        // Música de fondo: si no existe, crearla y reproducirla (lógica original preservada)
        if (!this.sound.get('musicaFondo')) {
            this.musica = this.sound.add('musicaFondo', { loop: true, volume: 0.5 });
            this.musica.play();
        } else {
            this.musica = this.sound.get('musicaFondo');
            if (!this.musica.isPlaying) {
                this.musica.play();
            }
        }
        console.log(jugador.email)
                console.log(puntosTotales)

            fetch('/Juego/api/actualizar_puntos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: jugador.email,
                puntos: puntosTotales
             })
        })
        .then(res => res.json())
        .then(data => {
            if (data && !data.error) {
                console.log('Objeto guardado en BD:', data);
            } else {
                console.warn('Error al guardar objeto en BD:', data.error);
            }
        })
        .catch(err => console.error('Error AJAX guardar objeto:', err));
        ;
    } // end create

    // Función que inicia la secuencia final (parte2 -> parte3 -> musicaFinal)
    iniciarSecuenciaFinal() {
        // Ocultar rápidamente recuadro y boton (para que no se vean al inicio de la animación)
        if (this.recuadroPe) this.recuadroPe.setVisible(false);
        if (this.botonSiguiente) {
            this.botonSiguiente.disableInteractive();
            this.botonSiguiente.setVisible(false);
            this.personaje.anims.stop();
            this.personaje.setVisible(false);
            this.texto.setVisible(false);  
        }

        // Reproducir animación parte dos (transición)
        this.AnimacionFinalParteDos.setVisible(true).setDepth(2);
        this.AnimacionFinalParteDos.anims.play('AnimacionFinalParteDos-movimiento', true);

        // Cuando termine la animación parte dos, empezar parte tres y la música final
        this.AnimacionFinalParteDos.once('animationcomplete', () => {
            // Ocultar elementos restantes que ya no deben verse (fondo, personaje, texto)
            if (this.FondoTelevision) this.FondoTelevision.setVisible(false);
            if (this.personaje) {
                this.personaje.anims.stop();
                this.personaje.setVisible(false);
            }
            if (this.texto) this.texto.setVisible(false);
            if (this.recuadroPe) this.recuadroPe.setVisible(false);
            if (this.botonSiguiente) this.botonSiguiente.setVisible(false);

            // Mostrar la animación parte tres en loop
            this.AnimacionFinalParteTres.setVisible(true).setDepth(6);
            this.AnimacionFinalParteTres.anims.play('AnimacionFinalParteTres-movimiento', true);

            // Pausar música de fondo si existe
            const musicaFondo = this.sound.get('musicaFondo');
            if (musicaFondo && musicaFondo.isPlaying) {
                musicaFondo.pause();
            }

            // Reproducir musicaFinal (una sola vez). Asegurarse de escuchar su evento 'complete'
            let musicaFinal = this.sound.get('musicaFinal');
            if (!musicaFinal) {
                musicaFinal = this.sound.add('musicaFinal', { loop: false, volume: 0.5 });
            }

            // Si ya está sonando por alguna razón, detenerla y reproducir desde el inicio
            if (musicaFinal.isPlaying) {
                musicaFinal.stop();
            }

            musicaFinal.once('complete', () => {
                // Al terminar la pista (32 s), detener/ocultar animacion 3 y ocultar todo
                if (this.AnimacionFinalParteTres) {
                    this.AnimacionFinalParteTres.anims.stop();
                    this.AnimacionFinalParteTres.setVisible(false);
                }
                // Ocultar absolutamente todo lo que queda visible
                this.ocultarTodo();

                // Mostrar ImagenFinal
                if (this.ImagenFinal) {
                    this.ImagenFinal.setVisible(true);
                    this.ImagenFinal.setDepth(10);
                }
                
            });
            musicaFinal.play();
        });
    }

    // Oculta todos los elementos que maneja la escena (util para limpieza final)
    ocultarTodo() {
        const arr = [
            'AnimacionFinalParteUno',
            'AnimacionFinalParteDos',
            'AnimacionFinalParteTres',
            'FondoTelevision',
            'recuadroPe',
            'botonSiguiente',
            'personaje',
            'texto'
        ];
        arr.forEach(name => {
            if (this[name] && typeof this[name].setVisible === 'function') {
                this[name].setVisible(false);
            }
        });
    }

    aplicarReescalado() {
        reescalarGlobalFlexible(this.scale, [
            { obj: this.AnimacionFinalParteUno, autoFill: true, originX: 0.5, originY: 0.5 },
            { obj: this.FondoTelevision, autoFill: true, originX: 0.5, originY: 0.5 },
            { obj: this.ImagenFinal, autoFill: true, originX: 0.5, originY: 0.5 },

            { obj: this.personaje, posX: getPosEscala(0.5, 0), posY: getPosEscala(0.8, 0), escalaRelativa: getPosEscala(0.5, 0), originX: 0.5, originY: 0.5 },
            { obj: this.recuadroPe, posX: getPosEscala(0.3, 0), posY: getPosEscala(0.2, 0), escalaRelativa: getPosEscala(1.18, 0), originX: 0.5, originY: 0.5 },
            { obj: this.botonSiguiente, posX: getPosEscala(0.3, 0), posY: getPosEscala(0.44, 0), escalaRelativa: getPosEscala(0.34, 0), originX: 0.5, originY: 0.5 },
            { obj: this.AnimacionFinalParteDos, autoFill: true, originX: 0.5, originY: 0.5 },
            { obj: this.AnimacionFinalParteTres, autoFill: true, originX: 0.5, originY: 0.5 }
        ]);

        // Centrar principales
        if (this.AnimacionFinalParteUno) this.AnimacionFinalParteUno.setPosition(this.scale.width / 2, this.scale.height / 2);
        if (this.FondoTelevision) this.FondoTelevision.setPosition(this.scale.width / 2, this.scale.height / 2);
        if (this.ImagenFinal) this.ImagenFinal.setPosition(this.scale.width / 2, this.scale.height / 2);
        if (this.AnimacionFinalParteDos) this.AnimacionFinalParteDos.setPosition(this.scale.width / 2, this.scale.height / 2);
        if (this.AnimacionFinalParteTres) this.AnimacionFinalParteTres.setPosition(this.scale.width / 2, this.scale.height / 2);

    }

    update() {
        // nada por ahora
    }
}
