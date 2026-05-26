-- =========================================================
-- SCRIPT DE BASE DE DATOS: CONFIGURACIÓN GENERAL
-- Motor: SQL Server Management Studio 22
-- Caso de Estudio: Control de Congestión Vehicular Lima Norte
-- =========================================================

CREATE DATABASE DW_Congestion_Vehicular;
GO
USE DW_Congestion_Vehicular;
GO

-- =========================================================
-- [CAPA 2] TABLA TRANSITORIA (STAGING AREA)
-- =========================================================
-- Aquí cae el archivo en bruto en la Capa 2 antes de ser limpiado
CREATE TABLE stg_congestion_transito (
    id_stg INT IDENTITY(1,1) PRIMARY KEY,
    fecha VARCHAR(50),
    hora VARCHAR(50),
    dia_semana VARCHAR(50),
    mes VARCHAR(50),
    anio VARCHAR(50),
    distrito VARCHAR(100),
    zona VARCHAR(50),
    coordenadas VARCHAR(100),
    nombre_via VARCHAR(150),
    tipo_via VARCHAR(50),
    limite_velocidad VARCHAR(50),
    temperatura VARCHAR(50),
    humedad VARCHAR(50),
    condicion_clima VARCHAR(50),
    tipo_evento VARCHAR(100),
    descripcion_evento VARCHAR(255),
    tipo_vehiculo VARCHAR(50),
    cantidad_ejes VARCHAR(50),
    velocidad_promedio VARCHAR(50),
    flujo_vehicular VARCHAR(50),
    ocupacion_via VARCHAR(50),
    tiempo_viaje VARCHAR(50),
    fecha_carga DATETIME DEFAULT GETDATE()
);
GO

-- =========================================================
-- [CAPA 4] TABLAS DEFINITIVAS DEL DATA WAREHOUSE (MODELO ESTRELLA)
-- =========================================================

CREATE TABLE dim_tiempo (
    id_tiempo INT IDENTITY(1,1) PRIMARY KEY,
    fecha DATE NOT NULL,
    hora INT NOT NULL,
    dia_semana VARCHAR(15),
    mes VARCHAR(15),
    anio INT NOT NULL
);

CREATE TABLE dim_ubicacion (
    id_ubicacion INT IDENTITY(1,1) PRIMARY KEY,
    distrito VARCHAR(50) NOT NULL,
    zona VARCHAR(20) NOT NULL DEFAULT 'Lima Norte', 
    coordenadas VARCHAR(50)
);

CREATE TABLE dim_via (
    id_via INT IDENTITY(1,1) PRIMARY KEY,
    nombre_via VARCHAR(100) NOT NULL, 
    tipo_via VARCHAR(30),             
    limite_velocidad INT
);

CREATE TABLE dim_clima (
    id_clima INT IDENTITY(1,1) PRIMARY KEY,
    temperatura DECIMAL(4,2),
    humedad INT,
    condicion VARCHAR(30)             
);

CREATE TABLE dim_evento (
    id_evento INT IDENTITY(1,1) PRIMARY KEY,
    tipo_evento VARCHAR(50),          
    descripcion VARCHAR(255)
);

CREATE TABLE dim_vehiculo (
    id_vehiculo INT IDENTITY(1,1) PRIMARY KEY,
    tipo_vehiculo VARCHAR(30),        
    cantidad_ejes INT
);

CREATE TABLE fact_congestion (
    id_congestion INT IDENTITY(1,1) PRIMARY KEY,
    id_tiempo INT FOREIGN KEY REFERENCES dim_tiempo(id_tiempo),
    id_ubicacion INT FOREIGN KEY REFERENCES dim_ubicacion(id_ubicacion),
    id_via INT FOREIGN KEY REFERENCES dim_via(id_via),
    id_clima INT FOREIGN KEY REFERENCES dim_clima(id_clima),
    id_evento INT FOREIGN KEY REFERENCES dim_evento(id_evento),
    id_vehiculo INT FOREIGN KEY REFERENCES dim_vehiculo(id_vehiculo),
    
    -- Métricas / Indicadores del Negocio
    velocidad_promedio DECIMAL(5,2),
    flujo_vehicular INT,
    ocupacion_via DECIMAL(5,2),       
    tiempo_viaje INT                  
);
GO