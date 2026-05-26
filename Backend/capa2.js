// Lógica del Frontend para la Capa 2 - Staging Area (CON AUTO-SCROLL CORREGIDO)
document.addEventListener('DOMContentLoaded', function() {
    const stagingProgressBar = document.getElementById('stagingProgressBar');
    const stagingConsole = document.getElementById('stagingConsole');
    const btnRetroceder = document.getElementById('btnRetroceder');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnAceptar = document.getElementById('btnAceptar');

    // Estado para controlar si la carga simulada terminó
    let cargaFinalizada = false;

    // Iniciar la simulación automáticamente al cargar la página de la Capa 2
    ejecutarSimulacionStaging();

    // Botón Retroceder: Nos regresa físicamente a la carpeta de la Capa 1
    btnRetroceder.addEventListener('click', function() {
        if (cargaFinalizada || confirm('¿Desea detener el volcado y regresar a la selección de archivo?')) {
            window.location.href = '../Capa1/index.html';
        }
    });

    // Botón Cancelar: Alerta de interrupción del proceso
    btnCancelar.addEventListener('click', function() {
        if (!cargaFinalizada) {
            if (confirm('¿Está seguro de que desea abortar la inserción en el Staging Area? Se limpiará la tabla temporal.')) {
                window.location.href = '../Capa1/index.html';
            }
        } else {
            if (confirm('La carga ya finalizó. ¿Desea limpiar el Staging Area y regresar al inicio?')) {
                window.location.href = '../Capa1/index.html';
            }
        }
    });

    // Botón Aceptar: Validará si la carga ya terminó antes de dejarte ir a la Capa 3
    btnAceptar.addEventListener('click', function() {
        if (!cargaFinalizada) {
            alert('Por favor, espere a que termine el volcado masivo en el Staging Area antes de avanzar.');
            return;
        }
        alert('Datos listos en Staging. Avanzando a la Capa 3: Proceso ETL (Limpieza de datos)...');
        // Aquí se redireccionará en el futuro: window.location.href = '../Capa3/index.html';
    });

    // ============================================================
    // SIMULACIÓN TÉCNICA DEL VOLCADO (Aquí está la corrección)
    // ============================================================
    function ejecutarSimulacionStaging() {
        let progreso = 0;
        
        // Mensajes iniciales en la consola
        stagingConsole.innerHTML = `[INFO] Estableciendo canal con SQL Server Management Studio 22...<br>`;
        stagingConsole.innerHTML += `[INFO] Conectado a la BD: DW_Congestion_Vehicular.<br>`;

        // Intervalo que añade líneas de log progresivamente
        const intervalo = setInterval(() => {
            progreso += 10; // Subimos de 10 en 10 para más registros
            stagingProgressBar.style.width = progreso + '%';
            stagingProgressBar.textContent = progreso + '%';

            // Logs que simulan las fases técnicas internas
            if (progreso === 10) stagingConsole.innerHTML += `[SQL] Analizando tabla transitoria 'stg_congestion_transito'...<br>`;
            if (progreso === 20) stagingConsole.innerHTML += `[SQL] Mapeando campos crudos desde 'trafico_lima_norte.csv'...<br>`;
            if (progreso === 30) stagingConsole.innerHTML += `[INFO] Insertando bloque indexado de 5,000 registros...<br>`;
            if (progreso === 40) stagingConsole.innerHTML += `[INFO] Insertando bloque indexado de 10,000 registros...<br>`;
            if (progreso === 50) stagingConsole.innerHTML += `[SQL] Validando tipos de datos VARCHAR transitorios...<br>`;
            if (progreso === 60) stagingConsole.innerHTML += `[INFO] Insertando bloque indexado de 15,000 registros...<br>`;
            if (progreso === 70) stagingConsole.innerHTML += `[INFO] Insertando bloque indexado de 20,000 registros...<br>`;
            if (progreso === 80) stagingConsole.innerHTML += `[SQL] Registrando logs de carga en la auditoría...<br>`;
            if (progreso === 90) stagingConsole.innerHTML += `[INFO] Finalizando inserción masiva...<br>`;
            
            if (progreso === 100) {
                stagingConsole.innerHTML += `<span class="text-success">[ÉXITO] Total de 45,280 filas volcadas correctamente en el Staging Area.</span><br>`;
                stagingProgressBar.classList.remove('progress-bar-animated');
                cargaFinalizada = true;
                clearInterval(intervalo);
            }

            // ========================================================
            // CORRECCIÓN: Auto-scroll al final del panel
            // ========================================================
            // Esta línea asegura que el contenido siempre se desplace hacia abajo
            // para mostrar el registro más reciente automáticamente.
            stagingConsole.scrollTop = stagingConsole.scrollHeight;

        }, 500); // Velocidad de simulación (medio segundo por registro)
    }
});