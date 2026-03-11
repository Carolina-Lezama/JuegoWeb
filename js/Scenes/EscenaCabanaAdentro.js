import { objetosDelPersonaje, datosObjetos,objetos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId  } from '../responsive.js';
//--- ESCENA DE LA CABAÑA ADENTRO

export class EscenaCabanaAdentro  extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaCabanaAdentro' });
    }
    preload() {
    }
        create() {
        this.fondo = this.add.image(0, 0, 'FondoCabanaAdentro');
        this.recuadro = this.add.image(0, 0, 'recuadro').setInteractive().setDepth(2).setVisible(false);
        this.recuadroMa = this.add.image(0, 0, 'recuadroM').setInteractive().setDepth(2).setVisible(true);
        this.recuadroPe = this.add.image(0, 0, 'recuadroP').setInteractive().setDepth(2).setVisible(false);
        this.fondoObjeto = this.add.image(0, 0, 'FondoObjeto').setVisible(false).setDepth(4);
        this.botonD = this.add.image(0, 0, 'botonDescripcion').setDepth(4).setVisible(false);
        this.botonI = this.add.image(0, 0, 'botonInventario').setInteractive().setDepth(10).setVisible(false);
        this.botonSa = this.add.image(0, 0, 'botonSalir').setInteractive().setDepth(4).setVisible(false);
        this.gato = this.add.sprite(0, 0, 'gato');
        this.gato.setFlipX(true); 
        this.mago = this.add.sprite(0, 0, 'mago');
        this.mago.setFlipX(true); 
        this.boton = this.add.image(0, 0, 'botonSiguiente').setInteractive();
        this.botonS = this.add.image(0, 0, 'botonSaltar').setInteractive();
        this.objetoEspejo = this.add.sprite(0, 0, 'objetoEspejo').setVisible(false).setDepth(10);
        this.anims.create({
            key: 'gato-movimiento',
            frames: this.anims.generateFrameNumbers('gato', { start: 0, end: 7 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'objetoEspejo-movimiento',
            frames: this.anims.generateFrameNumbers('objetoEspejo', { start: 0, end: 6 }),
            frameRate: 3,
            repeat: -1});
            
        this.anims.create({
            key: 'mago-movimiento',
            frames: this.anims.generateFrameNumbers('mago', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        let e_uno = 'Thalor: Primero te dare un objeto que te ayudara a volver a ser humano, dejame buscarlo';
        let e_dos = 'Thalor: Aqui tienes';
        // Agregar el objeto con id 1 a objetosDelPersonaje después de e_dos
        objetosDelPersonaje[1] = extraerDatosObjetoPorId(1) || {id:0, nombre:'',descripcion:'',cantidad:0,rareza:''};
        // Guardar el objeto en la base de datos para el usuario activo
        fetch('/Juego/api/guardar_objeto_usuario.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ objeto_id: 1 })
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
        let e_tres = '';
        let e_cuatro = 'Carlitos: ¿Cómo debo usarlo?';
        let e_cinco = 'Thalor: Abre el inventario (click en el icono o presiona R) y equipa el objeto, puedes colocarte hasta 6 objetos; los demas seguiran en inventario.';
        let e_seis ='Muy bien, ahora veremos como funciona.'
        this.dialogos = [
            e_uno,e_dos,e_tres,e_cuatro,e_cinco,e_seis
        ];
        this.dialogoActual = 0;
        this.texto = createAndAdaptTextFlexible(this, {
            text: this.dialogos[this.dialogoActual],
            posX: 0.74,
            posY: 0.19,
            maxWidth: 850,
            maxHeight: 500,
            fontSizeInicial: 36,
            fontSizeMinimo: 10,
            originX: 0.5,
            originY: 0.5,
            config: {
                fontFamily: 'Silkscreen',
                color: '#000000',
                align: 'center'
            }
        });
        objetosDelPersonaje[1]= extraerDatosObjetoPorId(1) || {id:0, nombre:'',descripcion:'',cantidad:0,rareza:''};
        this.texto2 = createAndAdaptTextFlexible(this, {
            text: (objetosDelPersonaje[1].nombre || '') + '\n\n' +
                  (objetosDelPersonaje[1].descripcion || '') + '\n\nCantidad de usos maximo: ' +
                  (objetosDelPersonaje[1].cantidad || 'Sin limite') + '\n\nRareza: ' +
                  (objetosDelPersonaje[1].rareza || ''),
            posX: 0.3,
            posY: 0.49,
            maxWidth: 850,
            maxHeight: 500,
            fontSizeInicial: 38,
            fontSizeMinimo: 10,
            originX: 0.5,
            originY: 0.5,
            config: {
                fontFamily: 'Silkscreen',
                color: '#ffffff',
                align: 'center'
            }
        });
        this.texto2.setVisible(false);
        this.gato.anims.play('gato-movimiento', true);
        this.mago.anims.play('mago-movimiento', true);

        this.botonS.on('pointerdown', () => {
            this.scene.start('EscenaTutorialUno');
                });

        this.botonI.on('pointerdown', () => {
            this.dialogoActual++;
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.launch('EscenaInventario');
            this.scene.pause();
        });
        this.input.keyboard.on('keydown-R', () => {
            this.dialogoActual++;
            window.ultimaEscenaActiva = this.scene.key; // Guarda el nombre de la escena actual
            this.scene.launch('EscenaInventario');
            this.scene.pause(); // Pausa esta escena sin reiniciarla
        });
    this.boton.on('pointerdown', () => {
        this.dialogoActual++;
        if (this.dialogoActual < this.dialogos.length) {
            this.texto.setText(this.dialogos[this.dialogoActual]);
            this.actualizarEscenaPorDialogo(this.dialogoActual);
        } else {
            this.scene.start('EscenaTutorialUno');
        }
    });
    this.botonSa.on('pointerdown', () => {
        this.dialogoActual++;
        if (this.dialogoActual < this.dialogos.length) {
            this.texto.setText(this.dialogos[this.dialogoActual]);
            this.actualizarEscenaPorDialogo(this.dialogoActual);
        }
    });
    this.aplicarReescalado();
    this.scale.on('resize', () => {
        this.aplicarReescalado();
    });
}
    actualizarEscenaPorDialogo(dialogoIndex) {
        const mostrarMago = [0, 1, 2, 4, 5];
        const mostrarPe = [3];
        const mostrarNormal = [];
        this.recuadro.setVisible(false);
        this.recuadroMa.setVisible(false);
        this.recuadroPe.setVisible(false);
        this.objetoEspejo.setVisible(false);
        this.mago.setVisible(true);
        this.gato.setVisible(true);
        this.boton.setVisible(true);
        this.botonS.setVisible(true);
        this.fondo.setVisible(true);
        this.fondoObjeto.setVisible(false);
        this.botonD.setVisible(false);
        this.botonI.setVisible(false);
        this.botonSa.setVisible(false);
        this.texto2.setVisible(false);
        if (mostrarMago.includes(dialogoIndex)) {
            this.recuadroMa.setVisible(true);
            if (dialogoIndex === 2) {
                this.objetoEspejo.anims.play('objetoEspejo-movimiento').setVisible(true);
                this.fondo.setVisible(false);
                this.recuadroMa.setVisible(false);
                this.mago.setVisible(false);
                this.gato.setVisible(false);
                this.boton.setVisible(false);
                this.botonS.setVisible(false);
                this.fondoObjeto.setVisible(true);
                this.botonD.setVisible(true);
                this.botonSa.setVisible(true);
                this.texto2.setVisible(true);
                this.texto2.setDepth(20);
            }else if (dialogoIndex===4){
                this.botonI.setVisible(true);
            } 
        } else if (mostrarPe.includes(dialogoIndex)) {
            this.recuadroPe.setVisible(true);
        } else if (mostrarNormal.includes(dialogoIndex)) {
            this.recuadro.setVisible(true);
        }   
    }
    aplicarReescalado() {
        reescalarGlobalFlexible(this.scale, [
            {
                obj: this.fondo,
                autoFill: true,
                originX: 0.5,
                originY: 1
            },
            {
                obj: this.recuadro,
                posX: getPosEscala(0.85, 0),
                posY: getPosEscala(0.22, 0),
                escalaRelativa: getPosEscala(1.5, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.recuadroPe,
                posX: getPosEscala(0.73, 0),
                posY: getPosEscala(0.19, 0),
                escalaRelativa: getPosEscala(1.03, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.recuadroMa,
                posX: getPosEscala(0.73, 0),
                posY: getPosEscala(0.19, 0),
                escalaRelativa: getPosEscala(1.04, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.boton,
                posX: getPosEscala(0.73, 0),
                posY: getPosEscala(0.4207, 0),
                escalaRelativa: getPosEscala(0.32, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.botonS,
                posX: getPosEscala(0.9, 0),
                posY: getPosEscala(0.409, 0),
                escalaRelativa: getPosEscala(0.32, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.gato,
                posX: getPosEscala(0.44, 0),
                posY: getPosEscala(0.81, 0),
                escalaRelativa: getPosEscala(0.24, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.mago,
                posX: getPosEscala(0.24, 0),
                posY: getPosEscala(0.67, 0),
                escalaRelativa: getPosEscala(0.3, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.objetoEspejo,
                posX: getPosEscala(0.73, 0),
                posY: getPosEscala(0.5, 0),
                escalaRelativa: getPosEscala(0.7, 0),
                originX: 0.5,
                originY: 0.5
            },            
            {
                obj: this.fondoObjeto,
                posX: getPosEscala(0.5, 0),
                posY: getPosEscala(0.5, 0),
                escalaRelativa: getPosEscala(2, 0),
                originX: 0.5,
                originY: 0.5
            },            
            {
                obj: this.botonD,
                posX: getPosEscala(0.3, 0),
                posY: getPosEscala(0.2, 0),
                escalaRelativa: getPosEscala(0.55, 0),
                originX: 0.5,
                originY: 0.5
            },            
            {
                obj: this.botonSa,
                posX: getPosEscala(0.3, 0),
                posY: getPosEscala(0.8, 0),
                escalaRelativa: getPosEscala(0.3, 0),
                originX: 0.5,
                originY: 0.5
            },            
            {
                obj: this.botonI,
                posX: getPosEscala(0.05, 0),
                posY: getPosEscala(0.1, 0),
                escalaRelativa: getPosEscala(0.15, 0),
                originX: 0.5,
                originY: 0.5
            }         
        ]);
        this.fondo.setPosition(this.scale.width / 2, this.scale.height );
        this.texto.setOrigin(0.5, 0.5).setDepth(3);
        this.boton.setOrigin(0.5, 0.5).setDepth(4);
        this.botonS.setOrigin(0.5, 0.5).setDepth(4);
    }
    update() {}
}
