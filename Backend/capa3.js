// Backend/capa3.js
// Servidor de control para la Capa 3 (Proceso ETL)
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Parámetros técnicos para interactuar con SQL Server Management Studio 22
const dbConfig = {
    user: 'tu_usuario_sql',          
    password: 'tu_password_sql',    
    server: 'localhost',            
    database: 'DW_Congestion_Vehicular',
    options: {
        encrypt: false,             
        trustServerCertificate: true 
    }
};

// ENDPOINT / RUTA DE CONTROL: Dispara el pipeline de limpieza y estructuración multidimensional
app.post('/api/capa3/etl', (req, res) => {
    console.log("[LOG BACKEND] Orden recibida. Iniciando motor de limpieza ETL en SQL Server 2022...");
    
    // Aquí el backend invocará tu lógica de limpieza en las siguientes clases:
    /*
    let pool = await sql.connect(dbConfig);
    // Ejecutar queries de conversión e inserción final en dimensiones
    */

    res.json({
        success: true,
        message: "[SERVIDOR] Pipeline ejecutado. Tablas de dimensiones y tabla de hechos pobladas correctamente."
    });
});

const PORT = 3002; // Usamos el puerto 3002 para esta capa
app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`[BACKEND ACTIVO] Lógica de la Capa 3 (ETL) en el puerto ${PORT}`);
    console.log(`================================================================`);
});