// =========================================================================
// BACKEND CAPA 6 - DATOS 100% REALES DEL CSV
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    controladorCapa6Semantica();
});

function controladorCapa6Semantica() {
    const btnProcesarCubo = document.getElementById('btnProcesarCubo');
    const btnAceptar = document.getElementById('btnAceptar');
    const consoleSemantica = document.getElementById('consoleSemantica');
    let chartInstancia = null;

    document.getElementById('btnRetroceder').addEventListener('click', () => {
        window.location.href = 'capa5.html';
    });

    document.getElementById('btnAceptar').addEventListener('click', () => {
        alert('Estructura Semántica compilada con éxito.\nAvanzando a la Capa 7: Dashboards finales de Visualización BI.');
        // window.location.href = 'capa7.html';
    });

    btnProcesarCubo.addEventListener('click', () => {
        btnProcesarCubo.disabled = true;
        consoleSemantica.innerHTML = "<span class='text-info'>[SSAS-INFO] Abriendo canal analítico directo con el Dataset de la Capa 1...</span><br>";

        const csvContenido = localStorage.getItem('csv_contenido');

        if (!csvContenido) {
            setTimeout(() => {
                consoleSemantica.innerHTML += "<span class='text-danger'>[SSAS-ERR] Error: No se localizó el archivo CSV en memoria. Regrese a la Capa 1.</span>";
                btnProcesarCubo.disabled = false;
            }, 800);
            return;
        }

        setTimeout(() => {
            consoleSemantica.innerHTML += "[SSAS-PROCESS] Inicializando lectura de la tabla de hechos (fact_congestion)...<br>";
            consoleSemantica.scrollTop = consoleSemantica.scrollHeight;
        }, 500);

        setTimeout(() => {
            consoleSemantica.innerHTML += "[SSAS-PROCESS] Cruzando llaves foráneas con dimensiones geográficas y temporales...<br>";
            consoleSemantica.scrollTop = consoleSemantica.scrollHeight;
        }, 1000);

        setTimeout(() => {
            consoleSemantica.innerHTML += "[SSAS-PROCESS] Ejecutando consultas multidimensionales MDX y compilando KPIs...<br>";
            consoleSemantica.scrollTop = consoleSemantica.scrollHeight;
        }, 1500);

        setTimeout(() => {

            // ── PARSEO DEL CSV ──────────────────────────────────────────
            const lineas = csvContenido.split(/\r?\n/).filter(l => l.trim() !== '');
            const separador = lineas[0].includes(';') ? ';' : ',';
            const cabecera = lineas[0].split(separador).map(c => c.trim().toLowerCase().replace(/['"]/g, ''));

            // Índices dinámicos por nombre de columna
            const idx = {
                distrito:   cabecera.findIndex(c => c.includes('distr')),
                via:        cabecera.findIndex(c => c.includes('aven') || c.includes('via')),
                velocidad:  cabecera.findIndex(c => c.includes('veloc')),
                flujo:      cabecera.findIndex(c => c.includes('flujo')),
                score:      cabecera.findIndex(c => c.includes('score')),
                tiempo:     cabecera.findIndex(c => c.includes('tiem')),
                clima:      cabecera.findIndex(c => c.includes('clima')),
                evento:     cabecera.findIndex(c => c.includes('event')),
                vehiculo:   cabecera.findIndex(c => c.includes('vehic')),
            };

            // Acumuladores
            let totalRegistros = 0;
            let sumaVelocidad = 0, contVelocidad = 0;
            let sumaFlujo = 0;
            let sumaTiempo = 0, contTiempo = 0;
            let maxScore = 0;
            let distritosData = {};  // { nombre: { sumaScore, cont } }

            for (let i = 1; i < lineas.length; i++) {
                const cols = lineas[i].split(separador).map(c => c.trim().replace(/['"]/g, ''));
                if (cols.length < 3) continue;
                totalRegistros++;

                const vel   = idx.velocidad !== -1 ? parseFloat(cols[idx.velocidad]) : NaN;
                const flujo = idx.flujo     !== -1 ? parseFloat(cols[idx.flujo])     : NaN;
                const score = idx.score     !== -1 ? parseFloat(cols[idx.score])     : NaN;
                const tiem  = idx.tiempo    !== -1 ? parseFloat(cols[idx.tiempo])    : NaN;
                const dis   = idx.distrito  !== -1 ? cols[idx.distrito]              : '';

                if (!isNaN(vel)   && vel > 0)   { sumaVelocidad += vel; contVelocidad++; }
                if (!isNaN(flujo) && flujo >= 0) { sumaFlujo += flujo; }
                if (!isNaN(tiem)  && tiem > 0)  { sumaTiempo += tiem; contTiempo++; }
                if (!isNaN(score) && score > maxScore) maxScore = score;

                // Agrupar por distrito REAL del CSV
                if (dis) {
                    if (!distritosData[dis]) distritosData[dis] = { sumaScore: 0, cont: 0 };
                    if (!isNaN(score) && score > 0) {
                        distritosData[dis].sumaScore += score;
                        distritosData[dis].cont++;
                    }
                }
            }

            // ── CALCULAR KPIs REALES ────────────────────────────────────
            const promVelocidad = contVelocidad > 0 ? (sumaVelocidad / contVelocidad) : 0;
            const promTiempo    = contTiempo    > 0 ? Math.round(sumaTiempo / contTiempo) : 0;

            // Ocupación: estimada como (score promedio / 100) * 100
            let sumaScoreTotal = 0, contScore = 0;
            Object.values(distritosData).forEach(d => { sumaScoreTotal += d.sumaScore; contScore += d.cont; });
            const promOcupacion = contScore > 0 ? (sumaScoreTotal / contScore) : 0;

            // ── INYECTAR EN HTML ────────────────────────────────────────
            document.getElementById('valTotalRegistros').textContent = totalRegistros.toLocaleString('es-PE');
            document.getElementById('valVelPromedio').textContent    = `${promVelocidad.toFixed(2)} km/h`;
            document.getElementById('valFlujoTotal').textContent     = `${Math.round(sumaFlujo).toLocaleString('es-PE')} veh.`;
            document.getElementById('valOcupacionProm').textContent  = `${promOcupacion.toFixed(2)}%`;
            document.getElementById('valTiempoViaje').textContent    = `${promTiempo} min`;
            document.getElementById('valMaxScore').textContent       = `${maxScore.toFixed(2)} pts`;

            // ── GRÁFICO POR DISTRITO REAL ───────────────────────────────
            const colores = [
                'rgba(239,68,68,0.85)',
                'rgba(245,158,11,0.85)',
                'rgba(6,182,212,0.85)',
                'rgba(249,115,22,0.85)',
                'rgba(16,185,129,0.85)',
                'rgba(139,92,246,0.85)',
                'rgba(236,72,153,0.85)',
            ];

            // Ordenar distritos por score promedio descendente
            const distritosOrdenados = Object.entries(distritosData)
                .filter(([, d]) => d.cont > 0)
                .map(([nombre, d]) => ({ nombre, promedio: d.sumaScore / d.cont }))
                .sort((a, b) => b.promedio - a.promedio);

            const labels  = distritosOrdenados.map(d => d.nombre);
            const valores = distritosOrdenados.map(d => parseFloat(d.promedio.toFixed(1)));
            const bgColors     = labels.map((_, i) => colores[i % colores.length]);
            const borderColors = bgColors.map(c => c.replace('0.85', '1'));

            document.getElementById('contenedorGrafico').style.display = 'block';
            const ctx = document.getElementById('chartCongestionDistritos').getContext('2d');
            if (chartInstancia) chartInstancia.destroy();

            chartInstancia = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Score Promedio de Congestión',
                        data: valores,
                        backgroundColor: bgColors,
                        borderColor: borderColors,
                        borderWidth: 2,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: ctx => ` Score: ${ctx.parsed.y} pts`
                            }
                        }
                    },
                    scales: {
                        x: { ticks: { color: '#ffffff', font: { weight: 'bold', size: 12 } }, grid: { display: false } },
                        y: { min: 0, max: 100, ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } }
                    }
                }
            });

            consoleSemantica.innerHTML += `<span class='text-success'>[SSAS-SUCCESS] ¡Cubo Tabular Compilado! ${totalRegistros} registros procesados. ${labels.length} distritos analizados.</span><br>`;
            consoleSemantica.scrollTop = consoleSemantica.scrollHeight;
            btnAceptar.disabled = false;

        }, 2200);
    });
}