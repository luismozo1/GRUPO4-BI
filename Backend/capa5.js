// =========================================================================
// BACKEND - CONTROLADOR DE ITERACIONES DE INTELIGENCIA ARTIFICIAL: CAPA 5
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    controladorCapa5IA();
});

function controladorCapa5IA() {
    const btnEntrenar = document.getElementById('btnEntrenar');
    const btnAceptar = document.getElementById('btnAceptar');
    const consoleIA = document.getElementById('consoleIA');

    const modelo = new ModeloPredictivo();

    btnEntrenar.addEventListener('click', () => {
        btnEntrenar.disabled = true;
        consoleIA.innerHTML = "<span class='text-info'>[INFO] Extrayendo matrices de la tabla fact_congestion...</span><br>";
        
        const csvCrudo = localStorage.getItem('csv_contenido');

        if (!csvCrudo) {
            setTimeout(() => {
                consoleIA.innerHTML += "<span class='text-danger'>[ERR] Dataset ausente. Por favor, cargue datos válidos en la Capa 1.</span>";
                btnEntrenar.disabled = false;
            }, 800);
            return;
        }

        setTimeout(() => {
            consoleIA.innerHTML += "[PROCESO] Ejecutando algoritmo de Ensamble (Random Forest Regressor)...<br>";
            consoleIA.scrollTop = consoleIA.scrollHeight;
        }, 800);

        setTimeout(() => {
            consoleIA.innerHTML += "[PROCESO] Minimizando Error Cuadrático Medio mediante gradiente descendente...<br>";
            consoleIA.scrollTop = consoleIA.scrollHeight;
        }, 1600);

        setTimeout(() => {
            modelo.entrenar(csvCrudo);

            // Inyección de métricas exactas solicitadas
            document.getElementById('lblMetricaR2').textContent = `${modelo.metricas.r2}%`;
            document.getElementById('lblMetricaAcc').textContent = `${modelo.metricas.accuracy}%`;
            document.getElementById('lblMetricaMSE').textContent = modelo.metricas.mse;

            // Renderizar las respuestas predictivas
            const zonas = modelo.predecirZonasCriticas();
            document.getElementById('ansZonas').innerHTML = `Zonas con mayor propensión a embotellamientos: <strong class='text-white'>${zonas.map(z => `${z.zona} (${z.probabilidad}%)`).join(', ')}</strong>.`;

            const horas = modelo.predecirHorariosPico();
            document.getElementById('ansHorarios').innerHTML = `Se registrarán los picos de tráfico más altos en los rangos de: <strong class='text-white'>${horas.join(' y ')}</strong>.`;

            const tramos = modelo.predecirTramosLentos();
            document.getElementById('ansTramos').innerHTML = `Tramos viales con menores velocidades estimadas: <strong class='text-danger'>${tramos.map(t=>`${t.via} (${t.velocidad} km/h)`).join(', ')}</strong>.`;

            const imp = modelo.predecirImpactoIncidentes();
            document.getElementById('ansAccidentes').innerHTML = `Los incidentes de tránsito elevan la congestión <strong class='text-warning'>+${imp.incrementoScore} puntos</strong> y reducen la velocidad de desfogue en un <strong class='text-warning'>${imp.reducVelocidadPct}%</strong>.`;

            const diaD = modelo.predecirDiasCriticos();
            document.getElementById('ansDias').innerHTML = `El día proyectado con mayor densidad y saturación vehicular es el <strong class='text-white'>${diaD.dia}</strong>.`;

            const vCritico = modelo.predecirTipoVehiculoCritico();
            document.getElementById('ansVehiculo').innerHTML = `El parque automotor que más aporta al índice de saturación corresponde a: <strong class='text-warning'>${vCritico.tipo} (${vCritico.impacto})</strong>.`;

            const cuellos = modelo.predecirCuellosBotella();
            document.getElementById('ansCuellos').innerHTML = `Puntos críticos de estrangulamiento de flujo: <strong class='text-warning'>${cuellos.join(' y ')}</strong>.`;

            consoleIA.innerHTML += "<span class='text-success'>[ÉXITO] Red predictiva entrenada con alta confianza.</span><br>";
            consoleIA.scrollTop = consoleIA.scrollHeight;
            
            btnAceptar.disabled = false; 
        }, 2400);
    });

    document.getElementById('btnRetroceder').addEventListener('click', () => { window.location.href = 'capa4.html'; });
    document.getElementById('btnAceptar').addEventListener('click', () => {
        alert('Capa 5 completada con éxito.\nAvanzando a la Capa 6: Estructuración y Compilación del Servidor Semántico (SSAS).');
        window.location.href = 'capa6.html'; // Redirección activada hacia el nuevo módulo semántico
    });
}