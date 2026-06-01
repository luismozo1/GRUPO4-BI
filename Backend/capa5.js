// =========================================================================
// BACKEND CAPA 5 - LEE PREDICCIONES DEL JSON GENERADO POR PYTHON (4 MODELOS)
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    controladorCapa5IA();
});

function controladorCapa5IA() {
    const btnEntrenar = document.getElementById('btnEntrenar');
    const btnAceptar  = document.getElementById('btnAceptar');
    const consoleIA   = document.getElementById('consoleIA');

    btnEntrenar.addEventListener('click', () => {
        btnEntrenar.disabled = true;
        consoleIA.innerHTML = "<span class='text-info'>[INFO] Extrayendo matrices de la tabla fact_congestion...</span><br>";

        setTimeout(() => {
            consoleIA.innerHTML += "[MODELO 1] Regresión Lineal → Predicción Tiempo de Viaje...<br>";
            consoleIA.scrollTop = consoleIA.scrollHeight;
        }, 600);
        setTimeout(() => {
            consoleIA.innerHTML += "[MODELO 2] Regresión Lineal → Predicción Flujo Vehicular...<br>";
            consoleIA.scrollTop = consoleIA.scrollHeight;
        }, 1100);
        setTimeout(() => {
            consoleIA.innerHTML += "[MODELO 3] Árbol de Decisiones → Nivel de Congestión (Bajo/Medio/Alto)...<br>";
            consoleIA.scrollTop = consoleIA.scrollHeight;
        }, 1600);
        setTimeout(() => {
            consoleIA.innerHTML += "[MODELO 4] Árbol de Decisiones → Identificación de Zonas Críticas...<br>";
            consoleIA.scrollTop = consoleIA.scrollHeight;
        }, 2100);

        setTimeout(() => {
            fetch('../Clase_Machine_Learning/predicciones_ml.json')
                .then(res => {
                    if (!res.ok) throw new Error('JSON no encontrado');
                    return res.json();
                })
                .then(data => {
                    const m = data.modelos;

                    // ── MÉTRICAS ─────────────────────────────────────
                    document.getElementById('lblMetricaR2').textContent  = `${data.metricas_principales.r2}%`;
                    document.getElementById('lblMetricaAcc').textContent = `${data.metricas_principales.accuracy}%`;
                    document.getElementById('lblMetricaMSE').textContent = data.metricas_principales.mse;

                    // ── TABLA: EJEMPLOS DE SALIDA ─────────────────────
                    // Modelo 1: Tiempo de viaje (extraer solo el número)
                    const tiempoVal = m.regresion_tiempo_viaje.ejemplo_salida.replace(' minutos','');
                    document.getElementById('ejTiempoViaje').textContent = tiempoVal;

                    // Modelo 2: Flujo vehicular (extraer solo el número)
                    const flujoVal = m.regresion_flujo_vehicular.ejemplo_salida.replace(' vehículos','');
                    document.getElementById('ejFlujoVehicular').textContent = flujoVal;

                    // Modelo 3: Nivel de congestión
                    const nivelEl = document.getElementById('ejNivelCongestion');
                    nivelEl.textContent = m.arbol_nivel_congestion.ejemplo_salida;
                    if (m.arbol_nivel_congestion.ejemplo_salida === 'Alto')       nivelEl.style.color = '#ef4444';
                    else if (m.arbol_nivel_congestion.ejemplo_salida === 'Medio') nivelEl.style.color = '#f97316';
                    else                                                           nivelEl.style.color = '#22c55e';

                    // Modelo 4: Zona crítica
                    const zonaEl = document.getElementById('ejZonaCritica');
                    zonaEl.textContent = m.arbol_zona_critica.ejemplo_salida;
                    zonaEl.style.color = m.arbol_zona_critica.ejemplo_salida === 'Crítica' ? '#ef4444' : '#22c55e';

                    // ── LOG CONSOLA ───────────────────────────────────
                    consoleIA.innerHTML += `<span class='text-success'>[M1] ✔ Regresión Lineal — R²: ${m.regresion_tiempo_viaje.r2}% | Salida: ${m.regresion_tiempo_viaje.ejemplo_salida}</span><br>`;
                    consoleIA.innerHTML += `<span class='text-success'>[M2] ✔ Regresión Lineal — R²: ${m.regresion_flujo_vehicular.r2}% | Salida: ${m.regresion_flujo_vehicular.ejemplo_salida}</span><br>`;
                    consoleIA.innerHTML += `<span class='text-success'>[M3] ✔ Árbol Decisiones — Accuracy: ${m.arbol_nivel_congestion.accuracy}% | Salida: ${m.arbol_nivel_congestion.ejemplo_salida}</span><br>`;
                    consoleIA.innerHTML += `<span class='text-success'>[M4] ✔ Árbol Decisiones — Accuracy: ${m.arbol_zona_critica.accuracy}% | Salida: ${m.arbol_zona_critica.ejemplo_salida}</span><br>`;
                    consoleIA.scrollTop = consoleIA.scrollHeight;

                    // ── PREDICCIONES ANALÍTICAS ───────────────────────
                    const zonas = data.zonas_criticas;
                    document.getElementById('ansZonas').innerHTML =
                        `Zonas con mayor propensión a embotellamientos: <strong class='text-white'>${zonas.map(z => `${z.zona} (${z.probabilidad}%)`).join(', ')}</strong>.`;

                    const horas = data.horarios_pico;
                    document.getElementById('ansHorarios').innerHTML =
                        `Se registrarán los picos de tráfico más altos en los rangos de: <strong class='text-white'>${horas.join(' y ')}</strong>.`;

                    const tramos = data.tramos_lentos;
                    document.getElementById('ansTramos').innerHTML =
                        `Tramos viales con menores velocidades estimadas: <strong class='text-danger'>${tramos.map(t => `${t.via} (${t.velocidad} km/h)`).join(', ')}</strong>.`;

                    const imp = data.impacto_incidentes;
                    document.getElementById('ansAccidentes').innerHTML =
                        `Los incidentes de tránsito elevan la congestión <strong class='text-warning'>+${imp.incrementoScore} puntos</strong> y reducen la velocidad de desfogue en un <strong class='text-warning'>${imp.reducVelocidadPct}%</strong>.`;

                    document.getElementById('ansDias').innerHTML =
                        `El día proyectado con mayor densidad y saturación vehicular es el <strong class='text-white'>${data.dia_critico}</strong>.`;

                    const v = data.vehiculo_critico;
                    document.getElementById('ansVehiculo').innerHTML =
                        `El parque automotor que más aporta al índice de saturación corresponde a: <strong class='text-warning'>${v.tipo} (${v.impacto})</strong>.`;

                    const cuellos = data.cuellos_botella;
                    document.getElementById('ansCuellos').innerHTML =
                        `Puntos críticos de estrangulamiento de flujo: <strong class='text-warning'>${cuellos.join(' y ')}</strong>.`;

                    consoleIA.innerHTML += "<span class='text-success'>[ÉXITO] 4 modelos Python ejecutados correctamente.</span><br>";
                    consoleIA.scrollTop = consoleIA.scrollHeight;
                    btnAceptar.disabled = false;
                })
                .catch(() => {
                    consoleIA.innerHTML += "<span class='text-danger'>[ERR] No se encontró predicciones_ml.json.</span><br>";
                    consoleIA.innerHTML += "<span class='text-warning'>[AYUDA] Ejecuta: python Clase_Machine_Learning/modelo_ml.py</span><br>";
                    consoleIA.scrollTop = consoleIA.scrollHeight;
                    btnEntrenar.disabled = false;
                });
        }, 2600);
    });

    document.getElementById('btnRetroceder').addEventListener('click', () => {
        window.location.href = 'capa4.html';
    });

    document.getElementById('btnAceptar').addEventListener('click', () => {
        alert('Capa 5 completada.\nAvanzando a la Capa 6: Estructuración y Compilación del Servidor Semántico (SSAS).');
        window.location.href = 'capa6.html';
    });
}