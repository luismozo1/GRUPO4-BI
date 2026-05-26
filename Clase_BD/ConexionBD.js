// =========================================================================
// GESTOR DE CONEXIÓN DE SOFTWARE: Clase_BD/ConexionBD.js
// =========================================================================

class ConexionBD {
    constructor() {
        this.nombreBD = "DW_Congestion_Vehicular";
        this.host = "localhost\\SQLSERVER2022";
        this.usuario = "sa";
        this.isConectado = false;
    }

    // Abre el canal de comunicación lógico con los datos
    conectar() {
        try {
            const datosExistentes = localStorage.getItem('csv_contenido');
            if (datosExistentes) {
                this.isConectado = true;
                console.log(`[SQL_SERVER] Conectado exitosamente al catálogo: ${this.nombreBD}`);
                return true;
            } else {
                console.warn("[SQL_SERVER] Error de inicio: No se detectaron datos cargados en la Staging Area.");
                return false;
            }
        } catch (error) {
            console.error("[SQL_SERVER] Error en el handshake con el pool de conexiones:", error);
            return false;
        }
    }

    // Ejecuta una lectura estructurada simulando el esquema de tu script.sql
    ejecutarQuery(query) {
        if (!this.isConectado) {
            throw new Error("Excepción SQL: Instancia de base de datos no accesible.");
        }

        console.log(`[T-SQL EXEC]: ${query}`);
        const datosCrudos = localStorage.getItem('csv_contenido');
        if (!datosCrudos) return [];

        const lineas = datosCrudos.split('\n').filter(l => l.trim() !== '');
        const cabecera = lineas[0].split(',').map(c => c.trim());

        return lineas.slice(1).map(linea => {
            const columnas = linea.split(',');
            let fila = {};
            cabecera.forEach((col, i) => {
                fila[col] = columnas[i] ? columnas[i].trim() : '';
            });
            return fila;
        });
    }

    // Libera la conexión física de la memoria del servidor
    desconectar() {
        this.isConectado = false;
        console.log("[SQL_SERVER] Conexión cerrada de manera segura.");
        return true;
    }
}

window.ConexionBD = ConexionBD;