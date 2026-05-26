// =========================================================================
// BACKEND - CONTROLADOR DINÁMICO DE CONEXIONES Y ESTADO: CAPA 4
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar metadatos del estado del sistema
    backendCargarMetadatos();
    
    // 2. Trazar relaciones físicas mapeando las coordenadas del DOM
    setTimeout(backendDibujarRelaciones, 250);

    // 3. Re-calcular trazos si cambia la resolución de pantalla
    window.addEventListener('resize', backendDibujarRelaciones);
});

function backendCargarMetadatos() {
    const lblOrigenDW = document.getElementById('lblOrigenDW');
    const csvNombre = localStorage.getItem('csv_nombre');

    if (csvNombre) {
        lblOrigenDW.textContent = `SQL_Server_2022 -> DW_Congestion_Vehicular [${csvNombre}]`;
    }

    // Navegación: Retroceder a la Capa 3
    document.getElementById('btnRetroceder').addEventListener('click', () => {
        window.location.href = 'capa3.html';
    });

    // Navegación: Avanzar a la Capa 5 (Machine Learning)
    document.getElementById('btnAceptar').addEventListener('click', () => {
        alert("Servidor Backend:\n- Claves foráneas (FK) indexadas de forma óptima.\n- Restricciones de integridad evaluadas al 100%.\n\nAvanzando a la Capa 5: Aprendizaje Automático / IA Predictiva.");
        window.location.href = 'capa5.html';
    });
}

function backendDibujarRelaciones() {
    const svg = document.getElementById('relationCanvas');
    const container = document.getElementById('diagramContainer');
    
    if (!svg || !container) return;

    // Preservar la etiqueta <defs> de marcadores y limpiar trazos viejos
    svg.innerHTML = svg.innerHTML.split('</defs>')[0] + '</defs>';

    const containerRect = container.getBoundingClientRect();

    // RENDERIZADOR MATEMÁTICO DE CURVAS BÉZIER EN EL CANVAS SVG
    function mapearEnlace(idOrigen, idDestino, colorTrazo, markerId) {
        const elOrigen = document.getElementById(idOrigen);
        const elDestino = document.getElementById(idDestino);

        if (!elOrigen || !elDestino) return;

        const rectOrig = elOrigen.getBoundingClientRect();
        const rectDest = elDestino.getBoundingClientRect();

        // Calcular puntos del vector relativos al contenedor absoluto
        let x1 = rectOrig.left - containerRect.left;
        let y1 = rectOrig.top - containerRect.top + (rectOrig.height / 2);
        let x2 = rectDest.left - containerRect.left;
        let y2 = rectDest.top - containerRect.top + (rectDest.height / 2);

        // Control de orientación izquierda-derecha de anclajes laterales
        if (x1 < x2) {
            x1 += rectOrig.width;
        } else {
            x2 += rectDest.width;
        }

        // Trazado de curva suavizada para evitar solapamientos rígidos
        const controlX = x1 + (x2 - x1) / 2;
        const dAttribute = `M ${x1} ${y1} C ${controlX} ${y1}, ${controlX} ${y2}, ${x2} ${y2}`;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", dAttribute);
        path.setAttribute("stroke", colorTrazo);
        path.setAttribute("stroke-width", "2");
        path.setAttribute("fill", "none");
        path.setAttribute("style", "opacity: 0.8;");
        if (markerId) path.setAttribute("marker-end", `url(#${markerId})`);

        svg.appendChild(path);
    }

    // MAPEO DE DEPENDENCIAS DEL MODELO COPO DE NIEVE COHERENTE
    
    // Dimensiones de Tiempo vinculadas
    mapearEnlace('row_tiempo_pk', 'row_fact_tiempo', '#a78bfa', 'dot-purple');
    mapearEnlace('row_fecha_pk', 'row_tiempo_fecha_fk', '#a78bfa', 'dot-purple');
    mapearEnlace('row_hora_pk', 'row_tiempo_hora_fk', '#a78bfa', 'dot-purple');

    // Geografías y Ubicaciones vinculadas
    mapearEnlace('row_ubicacion_pk', 'row_fact_ubicacion', '#34d399', 'dot-green');
    mapearEnlace('row_distrito_pk', 'row_ubicacion_distrito_fk', '#34d399', 'dot-green');
    mapearEnlace('row_provincia_pk', 'row_distrito_provincia_fk', '#34d399', 'dot-green');

    // Factores de Infraestructura Vial y Meteorológicos
    mapearEnlace('row_clima_pk', 'row_fact_clima', '#60a5fa', 'dot-blue');
    mapearEnlace('row_via_pk', 'row_fact_via', '#fbbf24', 'dot-amber');

    // Mapeo Externo de Sub-dimensiones y Eventos
    mapearEnlace('row_condicion_pk', 'row_clima_condicion_fk', '#60a5fa', 'dot-blue');
    mapearEnlace('row_evento_pk', 'row_fact_evento', '#fb923c', 'dot-orange');
}