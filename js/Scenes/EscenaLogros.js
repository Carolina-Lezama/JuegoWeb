import { objetosDelPersonaje, datosObjetos, objetos, getLogros, objetosActivos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible, cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId } from '../responsive.js';

export class EscenaLogros extends Phaser.Scene {
  constructor() {
    super({ key: 'EscenaLogros' });
    this.logrosNovato = [];
    this.logrosAvanzado = [];
    this.logrosMaestro = [];
    this.elementosLogros = [];
    this.filtroActual = 'todos'; // 'todos', 'novato', 'avanzado', 'maestro'
  }

  preload() {
  }
  create() {
    this.regreso=this.add.image(0,0, 'regreso').setOrigin(0, 0).setDepth(100).setInteractive();
    this.regreso.on('pointerdown', () => {
      this.cerrarLogrosPorPausa();
    });
    this.fondo = this.add.image(0, 0, 'fondoLogros').setOrigin(0, 0).setDepth(1);
    this.tituloLogros = this.add.image(0, 0, 'tituloLogros').setOrigin(0, 0).setDepth(1);
    // Clasificar logros por tipo
    this.clasificarLogros();

    // Crear botones de filtro
    this.crearBotonesFiltro();

    // Crear contenedor scroll y máscara
    this.scrollContainer = this.add.container(0, 0).setDepth(20);
    const maskShape = this.add.graphics().fillRect(0, 300, this.scale.width, this.scale.height - 250);
    const mask = maskShape.createGeometryMask();
    this.scrollContainer.setMask(mask);
    maskShape.setVisible(false);

    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      this.scrollContainer.y -= deltaY * 0.3;
      this.limitarScroll();
    });

    this.input.on('pointermove', (pointer) => {
      if (pointer.isDown) {
        const delta = pointer.position.y - pointer.prevPosition.y;
        this.scrollContainer.y += delta;
        this.limitarScroll();
      }
    });

    // Mostrar todos los logros inicialmente
    this.renderizarLogros('todos');

    // Crear contenedor para logros con depth superior
    this.contenedorLogros = this.add.container(0, 0).setDepth(10);

    // Aplicar reescalado inicial
    this.aplicarReescaladoInicial();
    this.scale.on('resize', () => {
      this.aplicarReescaladoInicial();
    });
  
  }

    cerrarLogrosPorPausa() {
        if (window.ultimaEscenaActiva) {
            this.scene.stop(); // Cierra el inventario
            this.scene.resume(window.ultimaEscenaActiva); // Reanuda la anterior si la pausaste // Vuelve a la escena donde estaba el jugador
        }
    }

  limitarScroll() {
    const minY = -this.scrollContainer.height + 400;
    const maxY = 0;
    if (this.scrollContainer.y < minY) this.scrollContainer.y = minY;
    if (this.scrollContainer.y > maxY) this.scrollContainer.y = maxY;
  }
  clasificarLogros() {
    const logrosData = getLogros();
    if (!logrosData || !Array.isArray(logrosData)) return;

    // Limpiar arrays
    this.logrosNovato = [];
    this.logrosAvanzado = [];
    this.logrosMaestro = [];

    // Clasificar por tipo
    logrosData.forEach(logro => {
      switch (logro.tipo?.toLowerCase()) {
        case 'novato':
          this.logrosNovato.push(logro);
          break;
        case 'avanzado':
          this.logrosAvanzado.push(logro);
          break;
        case 'maestro':
          this.logrosMaestro.push(logro);
          break;
      }
    });
  }

  crearBotonesFiltro() {

    this.botonNovato = this.add.image(0, 0, 'novatoLogros').setOrigin(0, 0).setDepth(3);
    this.botonTodos = this.add.image(0, 0, 'todosLogros').setOrigin(0, 0).setDepth(3);
    this.botonAvanzado = this.add.image(0, 0, 'avanzadoLogros').setOrigin(0, 0).setDepth(3);
    this.botonMaestro = this.add.image(0, 0, 'maestroLogros').setOrigin(0, 0).setDepth(3);

    this.botonTodos.setInteractive().on('pointerdown', () => {
      this.renderizarLogros('todos');
    });
    this.botonNovato.setInteractive().on('pointerdown', () => {
      this.renderizarLogros('novato');
    });
    this.botonAvanzado.setInteractive().on('pointerdown', () => {
      this.renderizarLogros('avanzado');
    });
    this.botonMaestro.setInteractive().on('pointerdown', () => {
      this.renderizarLogros('maestro');
    });
  }

  limpiarLogros() {
    if (this.elementosLogros) {
      this.elementosLogros.forEach(el => {
        if (el && typeof el.destroy === 'function') {
          el.destroy();
        }
      });
    }
    this.elementosLogros = [];
    if (this.contenedorLogros) {
      this.contenedorLogros.removeAll();
    }
  }

  renderizarLogros(filtro = 'todos') {
    this.filtroActivo = filtro;
    this.limpiarLogros();
    let logros = getLogros();
    if (filtro !== 'todos') {
      logros = logros.filter(l => l.tipo === filtro);
    }

    // Renderizar cada logro como un recuadro con imagen y textos
    const startY = 430;//eje y 
    const espacioY = 310;//espacio entre cada logro
    logros.forEach((logro, i) => {
      const y = startY + i * espacioY;
      const posX = 280 / this.scale.width;
      const posY = (y - 45) / this.scale.height;
      
      let recuadroKey = '';
      if (logro.tipo === 'novato') recuadroKey = 'recuadroLogroNovato';
      else if (logro.tipo === 'avanzado') recuadroKey = 'recuadroLogroMaestro';
      else if (logro.tipo === 'maestro') recuadroKey = 'recuadroLogroMitico';
      let recuadro = null;
      if (recuadroKey) {
        recuadro = this.add.image(550, y, recuadroKey).setDisplaySize(650, 280).setOrigin(0.5);
        recuadro.setDepth(2);
      } 
      let img = null;
      if (logro.imagen) {
        img = this.add.image(710, y, logro.imagen).setDisplaySize(140, 140).setOrigin(0.5);
        img.setDepth(3);
      };      
      
    const nombre = createAndAdaptTextFlexible(this, {
        text: logro.nombre,
        posX: posX,
        posY: posY,
        maxWidth: 330,
        maxHeight: 300,
        fontSizeInicial: 24,
        fontSizeMinimo: 8,
        originX: 0,
        originY: 0.5,
        config: {
            fontFamily: 'Silkscreen',
            color: '#000000',
            align: 'center'
        }
    });
    nombre.setDepth(4);
    const posXDesc = 280 / this.scale.width;
    const posYDesc = (y + 19) / this.scale.height;

    const desc = createAndAdaptTextFlexible(this, {
        text: logro.descripcion,
        posX: posXDesc,
        posY: posYDesc,
        maxWidth: 320,
        maxHeight: 500,
        fontSizeInicial: 15,
        fontSizeMinimo: 6,
        originX: 0,
        originY: 0.5,
        config: {
            fontFamily: 'Silkscreen',
            color: '#000000',
            align: 'left'
        }
    });
    desc.setDepth(4);
          // Añadir todo al contenedor scrollable
      this.scrollContainer.add([recuadro, img, nombre, desc]);
      this.elementosLogros.push(recuadro, img, nombre, desc);

      this.elementosLogros.push(recuadro, img, nombre, desc);
      const totalAltura = logros.length * espacioY;
      this.scrollContainer.setSize(this.scale.width, totalAltura);

    });
  }

  mostrarLogros(filtro = 'todos') {
    this.limpiarLogros();
    let logrosAMostrar = [];
    
    switch (filtro) {
      case 'novato':
        logrosAMostrar = this.logrosNovato;
        break;
      case 'avanzado':
        logrosAMostrar = this.logrosAvanzado;
        break;
      case 'maestro':
        logrosAMostrar = this.logrosMaestro;
        break;
      case 'todos':
      default:
        logrosAMostrar = [...this.logrosNovato, ...this.logrosAvanzado, ...this.logrosMaestro];
        break;
    }

    // Crear elementos para cada logro
    logrosAMostrar.forEach((logro, index) => {
      this.crearElementoLogro(logro, index);
    });

  }

  crearElementoLogro(logro, index) {
    const yOffset = index * 120; // Espacio entre logros

    // Determinar el recuadro según el tipo
    let recuadroKey = 'recuadroLogroNovato';
    switch (logro.tipo?.toLowerCase()) {
      case 'avanzado':
        recuadroKey = 'recuadroLogroAvanzado'; // Si tienes uno específico, si no, usa Novato
        break;
      case 'maestro':
      case 'mitico':
        recuadroKey = 'recuadroLogroMaestro';
        break;
    }
    console.log('Usando recuadro:', recuadroKey);

    // Crear recuadro de fondo con depth
    const recuadro = this.add.image(0, yOffset, recuadroKey).setOrigin(0, 0).setDepth(11);
    recuadro.setVisible(true);
    console.log('Recuadro creado en', recuadro.x, recuadro.y, 'visible:', recuadro.visible);

    // Crear imagen del logro con depth
    let imagenLogro = null;
    if (logro.imagen && this.textures.exists(`logro_${logro.id}`)) {
      imagenLogro = this.add.image(50, yOffset + 25, `logro_${logro.id}`).setOrigin(0, 0).setDepth(12);
      imagenLogro.setDisplaySize(60, 60); // Ajustar tamaño
      imagenLogro.setVisible(true);
      console.log('Imagen logro creada:', `logro_${logro.id}`);
    } else {
      console.log('No existe textura para', `logro_${logro.id}`);
    }

    // Crear textos con depth
    const textoNombre = createAndAdaptTextFlexible(this, {
      x: 130, y: yOffset + 15,
      text: logro.nombre || 'Sin nombre',
      style: {
        fontSize: '18px',
        fill: '#333333',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        wordWrap: { width: 400 }
      }
    });
    textoNombre.setDepth(13);
    textoNombre.setVisible(true);
    console.log('Texto nombre:', textoNombre.text, textoNombre.x, textoNombre.y);

    const textoDescripcion = createAndAdaptTextFlexible(this, {
      x: 130, y: yOffset + 40,
      text: logro.descripcion || 'Sin descripción',
      style: {
        fontSize: '14px',
        fill: '#666666',
        fontFamily: 'Arial',
        wordWrap: { width: 400 }
      }
    });
    textoDescripcion.setDepth(13);
    textoDescripcion.setVisible(true);
    console.log('Texto descripcion:', textoDescripcion.text, textoDescripcion.x, textoDescripcion.y);

    const textoPuntos = createAndAdaptTextFlexible(this, {
      x: 130, y: yOffset + 70,
      text: `Puntos: ${logro.puntos || 0}`,
      style: {
        fontSize: '16px',
        fill: '#FF6B35',
        fontFamily: 'Arial',
        fontWeight: 'bold'
      }
    });
    textoPuntos.setDepth(13);
    textoPuntos.setVisible(true);
    console.log('Texto puntos:', textoPuntos.text, textoPuntos.x, textoPuntos.y);

    // Guardar elementos para poder limpiarlos después
    const elementoLogro = {
      recuadro,
      imagenLogro,
      textoNombre,
      textoDescripcion,
      textoPuntos
    };


  }
  limpiarLogros() {
    if (this.elementosLogros) {
      this.elementosLogros.forEach(el => {
        if (el && typeof el.destroy === 'function') {
          el.destroy();
        }
      });
    }
    this.elementosLogros = [];
    if (this.contenedorLogros) {
      this.contenedorLogros.removeAll();
    }
  }

  aplicarReescaladoInicial() {
    reescalarGlobalFlexible(this.scale, [
          {
            obj: this.fondo,
            autoFill: true,
            originX: 0.5,
            originY: 0.5
          },        
          {
            obj: this.regreso,
            posX: getPosEscala(0.05, 0),
            posY: getPosEscala(0.1, 0),
            escalaRelativa: getPosEscala(0.16, 0),
            originX: 0.5,
            originY: 0.5
          },        
          {
            obj: this.tituloLogros,
            posX: getPosEscala(0.5, 0),
            posY: getPosEscala(0.1, 0),
            escalaRelativa: getPosEscala(0.8, 0),
            originX: 0.5,
            originY: 0.5
          },        
          {
            obj: this.botonNovato,
            posX: getPosEscala(0.4, 0),
            posY: getPosEscala(0.26, 0),
            escalaRelativa: getPosEscala(0.13, 0),
            originX: 0.5,
            originY: 0.5
          },        
          {
            obj: this.botonMaestro,
            posX: getPosEscala(0.8, 0),
            posY: getPosEscala(0.26, 0),
            escalaRelativa: getPosEscala(0.13, 0),
            originX: 0.5,
            originY: 0.5
          },        
          {
            obj: this.botonTodos,
            posX: getPosEscala(0.2, 0),
            posY: getPosEscala(0.26, 0),
            escalaRelativa: getPosEscala(0.13, 0),
            originX: 0.5,
            originY: 0.5
          },        
          {
            obj: this.botonAvanzado,
            posX: getPosEscala(0.6, 0),
            posY: getPosEscala(0.26, 0),
            escalaRelativa: getPosEscala(0.13, 0),
            originX: 0.5,
            originY: 0.5
          },        
          {
            obj: this.contenedorLogros,
            posX: getPosEscala(0.2, 0),
            posY: getPosEscala(0.2, 0),
            escalaRelativa: getPosEscala(0.13, 0),
            originX: 0.5,
            originY: 0.5
          }
    ]);
  }

  update() {
  }
}