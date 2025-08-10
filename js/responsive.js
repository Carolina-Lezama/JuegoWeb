import { objetos, getObjetos,jugador,objetos_jugador,getObjetosUser,getUser } from './globals.js';

export function isMobile() {//true movi; false pc
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export function getPosEscala(pc, movil) {
    return isMobile() ? movil : pc;
}
export function extraerDatosObjetoPorId(id) {
    const objetos = getObjetos();
    if (!objetos) return null;
    const obj = objetos.find(o => o.id == id);
    if (!obj) return null;
    return {
        id: obj.id || 0 ,
        nombre: obj.nombre_objeto || '',
        descripcion: obj.descripcion || '',
        cantidad: obj.cantidad_max_uso || 0 ,
        rareza: obj.rareza || ''
    };
}
export function reescalarGlobalFlexible(gameSize, elementos = []) {
    const width = gameSize.width;
    const height = gameSize.height;
    const base = Math.min(width, height);
    const enMovil = isMobile();

    elementos.forEach(({
        obj,
        posX = 0.5,
        posY = 0.5,
        posXMovil = null,
        posYMovil = null,
        escalaRelativa = 0.3,
        escalaRelativaMovil = null,
        fontSizeRelativo = null,
        fontSizeRelativoMovil = null,
        originX = 0.5,
        originY = 0.5,
        autoFill = false
    }) => {
        if (!obj) return;

        const finalPosX = enMovil && posXMovil !== null ? posXMovil : posX;
        const finalPosY = enMovil && posYMovil !== null ? posYMovil : posY;
        const finalEscalaRelativa = enMovil && escalaRelativaMovil !== null ? escalaRelativaMovil : escalaRelativa;
        const finalFontSizeRelativo = enMovil && fontSizeRelativoMovil !== null ? fontSizeRelativoMovil : fontSizeRelativo;

        // Verificar si el objeto tiene setOrigin antes de llamarlo (los Containers no lo tienen)
        if (typeof obj.setOrigin === 'function') {
            obj.setOrigin(originX, originY);
        }

        obj.setPosition(width * finalPosX, height * finalPosY);

        if (autoFill && obj.texture) {
            const scaleX = width / obj.width;
            const scaleY = height / obj.height;
            const scale = Math.max(scaleX, scaleY);
            obj.setScale(scale);
            return;
        }

        if (finalFontSizeRelativo !== null && typeof obj.setFontSize === 'function') {
            const fontSize = width * finalFontSizeRelativo;
            obj.setFontSize(fontSize);
        } else if (obj.setScale) {
            const escala = (base * finalEscalaRelativa) / obj.width;
            obj.setScale(escala);
        }
    });
}

const PERSONAJES_CONFIG = {
    personaje1: '/Juego/assets/static/Sprites/personajeUno.png',
    personaje2: '/Juego/assets/static/Sprites/personajeDos.png',
    personaje3: '/Juego/assets/static/Sprites/personajeTres.png',
    personaje4: '/Juego/assets/static/Sprites/personajeCuatro.png'
};

const GATOS_CONFIG = {
    gato1: '/Juego/assets/static/Sprites/gatoUno.png',
    gato2: '/Juego/assets/static/Sprites/gatoDos.png',
    gato3: '/Juego/assets/static/Sprites/gatoTres.png',
    gato4: '/Juego/assets/static/Sprites/gatoCuatro.png'
};
export function cargarPersonajeActual(scene, personajeKey, spriteKey = 'personajeUsar') {
    const rutaArchivo = PERSONAJES_CONFIG[personajeKey] || PERSONAJES_CONFIG.personaje1;
    scene.load.spritesheet(spriteKey, rutaArchivo, { frameWidth: 215, frameHeight: 355 });
}

export function cargarGatoActual(scene, gatoKey, spriteKey = 'gatoUsar') {
    const rutaArchivo = GATOS_CONFIG[gatoKey] || GATOS_CONFIG.gato1;
    scene.load.spritesheet(spriteKey, rutaArchivo, { frameWidth: 215, frameHeight: 355 });
}

export function createAndAdaptTextFlexible(scene, {
    text,
    posX = 0.5,
    posY = 0.5,
    maxWidth,
    maxHeight,
    fontSizeInicial = 40,
    fontSizeMinimo = 10,
    fontSizeRelativo = null,
    posXMovil = null,
    posYMovil = null,
    fontSizeRelativoMovil = null,
    originX = 0.5,
    originY = 0.5,
    config = {}
}) {
    const width = scene.scale.width;
    const height = scene.scale.height;
    const base = Math.min(width, height);
    const enMovil = isMobile();

    const finalPosX = enMovil && posXMovil !== null ? posXMovil : posX;
    const finalPosY = enMovil && posYMovil !== null ? posYMovil : posY;
    const finalFontSizeRelativo = enMovil && fontSizeRelativoMovil !== null ? fontSizeRelativoMovil : fontSizeRelativo;

    let fontSize = fontSizeInicial;

    // Si se proporcionó fontSizeRelativo, lo calculamos directamente
    if (finalFontSizeRelativo !== null) {
        fontSize = width * finalFontSizeRelativo;
    }

    const defaultConfig = {
        fontFamily: 'Silkscreen',
        color: '#000000',
        align: 'center'
    };
    const finalConfig = { ...defaultConfig, ...config };

    const textObj = scene.add.text(width * finalPosX, height * finalPosY, text, {
        ...finalConfig,
        fontSize: fontSize,
        wordWrap: { width: maxWidth },
    });

    textObj.setOrigin(originX, originY);

    // Si no se usó tamaño relativo, hacemos ajuste hasta que quepa
    if (finalFontSizeRelativo === null) {
        while ((textObj.width > maxWidth || textObj.height > maxHeight) && fontSize > fontSizeMinimo) {
            fontSize -= 1;
            textObj.setFontSize(fontSize);
            textObj.setWordWrapWidth(maxWidth);
        }
    }

    return textObj;
}
