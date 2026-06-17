/**
 * Utilidades de Interfaz de Usuario y Responsividad
 */

export function isMobile(scene) {
    // Uso nativo de Phaser: Más rápido y seguro que Regex en el UserAgent
    if (scene && scene.sys) {
        const device = scene.sys.game.device;
        return device.os.android || device.os.iOS || device.os.windowsPhone;
    }
    // Fallback por si se llama fuera de una escena
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export function getPosEscala(pc, movil, scene) {
    return isMobile(scene) ? movil : pc;
}

/**
 * Posiciona y escala elementos.
 * NOTA DE ARQUITECTURA: Dado que usas Phaser.Scale.FIT, el canvas interno
 * siempre es 1650x900. Esta función se simplificó para evitar cálculos innecesarios.
 */
export function reescalarGlobalFlexible(scene, elementos = []) {
    const isMovil = isMobile(scene);
    const scaleManager = scene.scale || scene; 
    const { width, height } = scaleManager.gameSize; // Base 1650x900

    elementos.forEach(({
        obj,
        posX, posY, // Ya no forzamos el 0.5 por defecto aquí
        posXMovil = null, posYMovil = null,
        escalaRelativa, escalaRelativaMovil = null,
        originX = 0.5, originY = 0.5
    }) => {
        if (!obj) return;

        // 1. ORIGEN: Siempre lo centramos para que el escalado no desplace la imagen
        if (typeof obj.setOrigin === 'function') {
            obj.setOrigin(originX, originY);
        }

        // 2. POSICIONAMIENTO INTELIGENTE (Píxeles vs Porcentajes)
        if (posX !== undefined && posY !== undefined) {
            const finalPosX = (isMovil && posXMovil !== null) ? posXMovil : posX;
            const finalPosY = (isMovil && posYMovil !== null) ? posYMovil : posY;

            // Truco: Si el valor es menor o igual a 1.2 (ej: 0.5), es un porcentaje.
            // Si es mayor (ej: 450), asumimos que son los píxeles directos de tu código viejo.
            const xCalculado = (Math.abs(finalPosX) <= 1.2) ? width * finalPosX : finalPosX;
            const yCalculado = (Math.abs(finalPosY) <= 1.2) ? height * finalPosY : finalPosY;

            obj.setPosition(xCalculado, yCalculado);
        }

        // 3. ESCALADO SEGURO
        if (obj.setScale && escalaRelativa !== undefined) {
            const finalEscala = (isMovil && escalaRelativaMovil !== null) ? escalaRelativaMovil : escalaRelativa;
            obj.setScale(finalEscala);
        }
    });
}
/**
 * Crea texto con ajuste automático optimizado.
 */
export function createAndAdaptTextFlexible(scene, {
    text,
    posX = 0.5, posY = 0.5,
    maxWidth,
    fontSizeInicial = 40,
    color = '#000000',
    originX = 0.5, originY = 0.5
}) {
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;

    // Aprovechamos el wordWrap nativo de Phaser en lugar de un costoso bucle while
    const textObj = scene.add.text(width * posX, height * posY, text, {
        fontFamily: 'Silkscreen',
        color: color,
        fontSize: `${fontSizeInicial}px`,
        align: 'center',
        wordWrap: { width: maxWidth, useAdvancedWrap: true }
    });

    textObj.setOrigin(originX, originY);

    return textObj;
}

// Añadir al final de uiHelpers.js
export function agregarEfectoHover(boton, multiplicador = 1.1) {
    if (!boton || !boton.on) return;
    
    boton.on('pointerover', () => {
        if (boton.escalaBase === undefined) boton.escalaBase = boton.scale;
        boton.setScale(boton.escalaBase * multiplicador);
    });
    
    boton.on('pointerout', () => {
        if (boton.escalaBase !== undefined) boton.setScale(boton.escalaBase);
    });
}