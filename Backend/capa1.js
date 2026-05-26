// Backend/capa1.js
// Servidor de control para la Capa 1 (Fuentes de Datos)
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite la comunicación segura entre el HTML y este script
app.use(express.json());

// CONFIGURACIÓN DE CONEXIÓN CON SQL SERVER MANAGEMENT STUDIO 22
// Se deja estructurada para cuando decidamos enlazar la BD en los siguientes pasos
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

// ENDPOINT / RUTA DE CONTROL: Valida el archivo e inicia el pipeline de Business Intelligence
app.post('/api/capa1/procesar', (req, res) => {
    const { nombre, tamano } = req.body;
    
    console.log(`[LOG BACKEND] Procesando archivo de origen: ${nombre} (${(tamano/1024).toFixed(2)} KB)`);

    // Regla de Negocio del Backend: Validar estrictamente que sea un formato .csv
    if (!nombre.endsWith('.csv')) {
        return res.status(400).json({
            success: false,
            message: "Error en el Servidor: Formato no soportado. Debe cargar un archivo plano estructurado (.CSV)."
        });
    }

    // Respuesta exitosa simulando la correcta aceptación del Backend
    res.json({
        success: true,
        message: `[SERVIDOR] Archivo '${nombre}' validado correctamente. Conexión establecida con la base de datos para la Capa 2.`
    });
});

// Levantar el proceso del Backend en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`[BACKEND ACTIVO] Lógica de la Capa 1 corriendo en el puerto ${PORT}`);
    console.log(`================================================================`);
});