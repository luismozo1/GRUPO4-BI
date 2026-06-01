# =============================================================
# MODELO MACHINE LEARNING - 4 ALGORITMOS
# Plataforma BI - Congestión Vehicular Lima Norte
# =============================================================
# Modelos:
#   1. Regresión Lineal     → Predicción del tiempo de viaje
#   2. Regresión Lineal     → Predicción del flujo vehicular
#   3. Árbol de Decisiones  → Nivel de congestión (Bajo/Medio/Alto)
#   4. Árbol de Decisiones  → Zona crítica o no crítica
# =============================================================
# INSTRUCCIONES:
#   pip install pandas scikit-learn numpy
#   python Clase_Machine_Learning\modelo_ml.py
# =============================================================

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error, accuracy_score
from sklearn.preprocessing import LabelEncoder
import json, sys, os

# =============================================================
# 👇 CAMBIA AQUÍ EL NOMBRE DEL CSV QUE QUIERES USAR
CSV_NOMBRE = 'Prueba500Registros.csv'   # o 'Prueba500Registros.csv'
# =============================================================

carpeta_ml = os.path.dirname(os.path.abspath(__file__))
carpeta    = os.path.dirname(carpeta_ml)  # carpeta raíz del proyecto
csv_encontrado = os.path.join(carpeta, CSV_NOMBRE)

if not os.path.exists(csv_encontrado):
    print(f"ERROR: No se encontró '{CSV_NOMBRE}' en la carpeta raíz del proyecto.")
    print(f"Archivos CSV disponibles:")
    for f in os.listdir(carpeta):
        if f.endswith('.csv'):
            print(f"  → {f}")
    sys.exit(1)

print(f"[OK] Cargando: {CSV_NOMBRE}")
df = pd.read_csv(csv_encontrado)
print(f"[OK] {len(df)} registros cargados.")

# ── FEATURE ENGINEERING ──────────────────────────────────────────
df['fecha']      = pd.to_datetime(df['fecha'])
df['dia_semana'] = df['fecha'].dt.dayofweek
df['mes']        = df['fecha'].dt.month
tiene_hora       = 'hora' in df.columns

le = LabelEncoder()
df['clima_enc']    = le.fit_transform(df['condicion_clima'])
df['evento_enc']   = le.fit_transform(df['tipo_evento'])
df['via_enc']      = le.fit_transform(df['avenida_via'])
df['distrito_enc'] = le.fit_transform(df['distrito'])
df['vehiculo_enc'] = le.fit_transform(df['vehiculo_predominante'])

def nivel_congestion(s):
    if s < 40:   return 'Bajo'
    elif s < 70: return 'Medio'
    else:        return 'Alto'

df['nivel_congestion'] = df['congestion_score'].apply(nivel_congestion)
df['zona_critica']     = (df['congestion_score'] >= 70).astype(int)

hora_col = ['hora'] if tiene_hora else []

# ── MODELO 1: Regresión Lineal → Tiempo de Viaje ─────────────────
print("\n[MODELO 1] Regresión Lineal → Tiempo de Viaje")
f1 = hora_col + ['flujo_vehicular','velocidad_promedio','clima_enc','via_enc','evento_enc','dia_semana']
X1, y1 = df[f1], df['tiempo_viaje']
X1_tr, X1_te, y1_tr, y1_te = train_test_split(X1, y1, test_size=0.2, random_state=42)
m1 = LinearRegression()
m1.fit(X1_tr, y1_tr)
p1 = m1.predict(X1_te)
r2_m1  = round(r2_score(y1_te, p1) * 100, 2)
mse_m1 = round(mean_squared_error(y1_te, p1), 2)
acc_m1 = round(np.mean(np.abs(p1 - y1_te) <= 15) * 100, 2)
ej_tiempo = round(float(m1.predict(X1_te.iloc[[0]])[0]), 1)
print(f"  R²: {r2_m1}%  |  Accuracy (±15min): {acc_m1}%  |  MSE: {mse_m1}")
print(f"  Ejemplo de salida: {ej_tiempo} minutos")

# ── MODELO 2: Regresión Lineal → Flujo Vehicular ─────────────────
print("\n[MODELO 2] Regresión Lineal → Flujo Vehicular")
f2 = hora_col + ['dia_semana','clima_enc','evento_enc','via_enc']
X2, y2 = df[f2], df['flujo_vehicular']
X2_tr, X2_te, y2_tr, y2_te = train_test_split(X2, y2, test_size=0.2, random_state=42)
m2 = LinearRegression()
m2.fit(X2_tr, y2_tr)
p2 = m2.predict(X2_te)
r2_m2  = round(r2_score(y2_te, p2) * 100, 2)
mse_m2 = round(mean_squared_error(y2_te, p2), 2)
acc_m2 = round(np.mean(np.abs(p2 - y2_te) <= 100) * 100, 2)
ej_flujo = max(0, round(float(m2.predict(X2_te.iloc[[0]])[0])))
print(f"  R²: {r2_m2}%  |  Accuracy (±100veh): {acc_m2}%  |  MSE: {mse_m2}")
print(f"  Ejemplo de salida: {ej_flujo} vehículos")

# ── MODELO 3: Árbol de Decisiones → Nivel de Congestión ──────────
print("\n[MODELO 3] Árbol de Decisiones → Nivel de Congestión")
f3 = hora_col + ['flujo_vehicular','velocidad_promedio','clima_enc','dia_semana','congestion_score']
X3, y3 = df[f3], df['nivel_congestion']
X3_tr, X3_te, y3_tr, y3_te = train_test_split(X3, y3, test_size=0.2, random_state=42)
m3 = DecisionTreeClassifier(max_depth=5, random_state=42)
m3.fit(X3_tr, y3_tr)
p3 = m3.predict(X3_te)
acc_m3   = round(accuracy_score(y3_te, p3) * 100, 2)
ej_nivel = m3.predict(X3_te.iloc[[0]])[0]
print(f"  Accuracy: {acc_m3}%")
print(f"  Ejemplo de salida: {ej_nivel}")

# ── MODELO 4: Árbol de Decisiones → Zona Crítica ─────────────────
print("\n[MODELO 4] Árbol de Decisiones → Zona Crítica")
f4 = ['flujo_vehicular','tiempo_viaje','congestion_score','via_enc','evento_enc']
X4, y4 = df[f4], df['zona_critica']
X4_tr, X4_te, y4_tr, y4_te = train_test_split(X4, y4, test_size=0.2, random_state=42)
m4 = DecisionTreeClassifier(max_depth=5, random_state=42)
m4.fit(X4_tr, y4_tr)
p4 = m4.predict(X4_te)
acc_m4 = round(accuracy_score(y4_te, p4) * 100, 2)
zona_mas_critica = df.groupby('distrito')['congestion_score'].mean().idxmax()
ej_zona = f'{zona_mas_critica} — Crítica' if m4.predict(X4_te.iloc[[0]])[0] == 1 else f'{zona_mas_critica} — No Crítica'
print(f"  Accuracy: {acc_m4}%")
print(f"  Ejemplo de salida: {ej_zona}")

# ── PREDICCIONES ANALÍTICAS ───────────────────────────────────────

# Zonas críticas
zonas = df.groupby('distrito')['congestion_score'].apply(
    lambda x: round((x > 65).sum() / len(x) * 100)
).reset_index()
zonas.columns = ['zona','probabilidad']
zonas = zonas.sort_values('probabilidad', ascending=False).head(2)
zonas_list = zonas.to_dict('records')

# Horarios pico
if tiene_hora:
    def franja(h):
        franjas = [(0,2,'00:00 - 02:00'),(2,4,'02:00 - 04:00'),(4,6,'04:00 - 06:00'),
                   (6,8,'06:00 - 08:00'),(8,10,'08:00 - 10:00'),(10,12,'10:00 - 12:00'),
                   (12,14,'12:00 - 14:00'),(14,16,'14:00 - 16:00'),(16,18,'16:00 - 18:00'),
                   (18,20,'18:00 - 20:00'),(20,22,'20:00 - 22:00'),(22,24,'22:00 - 00:00')]
        for ini, fin, nombre in franjas:
            if ini <= h < fin: return nombre
        return '00:00 - 02:00'
    df['franja'] = df['hora'].apply(franja)
    horarios_pico = df.groupby('franja')['congestion_score'].mean().sort_values(ascending=False).head(2).index.tolist()
else:
    horarios_pico = ['07:00 - 09:00', '17:00 - 19:00']

# Día crítico
dias = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']
peor_dia = dias[df.groupby('dia_semana')['congestion_score'].mean().idxmax()]

# Tramos lentos
tramos = df.groupby('avenida_via')['velocidad_promedio'].mean().reset_index()
tramos.columns = ['via','velocidad']
tramos['velocidad'] = tramos['velocidad'].round(1)
tramos = tramos.sort_values('velocidad').head(2).to_dict('records')

# Impacto incidentes
df_inc     = df[(df['tipo_evento'] != 'Ninguno') | (df['condicion_clima'] != 'Despejado')]
incremento = round(max(0, df_inc['congestion_score'].mean() - df['congestion_score'].mean()), 1) if len(df_inc) > 0 else 0
reduc_vel  = round(incremento * 0.8)
evento_top = df_inc['tipo_evento'].value_counts().index[0] if len(df_inc) > 0 else 'Ninguno'
climas_nc  = df[df['condicion_clima'] != 'Despejado']['condicion_clima'].value_counts()
clima_top  = climas_nc.index[0] if len(climas_nc) > 0 else 'Ninguno'

# Vehículo crítico
df_crit    = df[df['congestion_score'] > 50]
veh_counts = df_crit['vehiculo_predominante'].value_counts()
veh_tipo   = veh_counts.index[0] if len(veh_counts) > 0 else 'No detectado'
veh_cnt    = int(veh_counts.iloc[0]) if len(veh_counts) > 0 else 0

# Cuellos de botella
df_cuello = df[df['congestion_score'] >= 85].copy()
df_cuello['punto'] = df_cuello['avenida_via'] + ' (' + df_cuello['distrito'] + ')'
cuellos = df_cuello['punto'].unique().tolist()[:2]
if not cuellos:
    cuellos = ['Ningún tramo supera el 85%']

# ── EXPORTAR JSON ─────────────────────────────────────────────────
resultado = {
    "modelos": {
        "regresion_tiempo_viaje": {
            "algoritmo":        "Regresión Lineal",
            "tipo":             "Supervisado - Regresión",
            "r2":               r2_m1,
            "accuracy":         acc_m1,
            "mse":              mse_m1,
            "ejemplo_salida":   f"{ej_tiempo} minutos",
            "variables_entrada": ["hora","flujo_vehicular","velocidad_promedio","condicion_clima","avenida_via","tipo_evento","dia_semana"]
        },
        "regresion_flujo_vehicular": {
            "algoritmo":        "Regresión Lineal",
            "tipo":             "Supervisado - Regresión",
            "r2":               r2_m2,
            "accuracy":         acc_m2,
            "mse":              mse_m2,
            "ejemplo_salida":   f"{ej_flujo} vehículos",
            "variables_entrada": ["hora","dia_semana","condicion_clima","tipo_evento","avenida_via"]
        },
        "arbol_nivel_congestion": {
            "algoritmo":        "Árbol de Decisiones",
            "tipo":             "Supervisado - Clasificación",
            "accuracy":         acc_m3,
            "ejemplo_salida":   ej_nivel,
            "variables_entrada": ["hora","flujo_vehicular","velocidad_promedio","condicion_clima","dia_semana"]
        },
        "arbol_zona_critica": {
            "algoritmo":        "Árbol de Decisiones",
            "tipo":             "Supervisado - Clasificación",
            "accuracy":         acc_m4,
            "ejemplo_salida":   ej_zona,
            "variables_entrada": ["flujo_vehicular","tiempo_viaje","congestion_score","avenida_via","tipo_evento"]
        }
    },
    "metricas_principales": {
        "r2":       r2_m1,
        "accuracy": acc_m3,
        "mse":      mse_m1
    },
    "zonas_criticas":   zonas_list,
    "horarios_pico":    horarios_pico,
    "dia_critico":      peor_dia,
    "tramos_lentos":    tramos,
    "impacto_incidentes": {
        "eventoTop":        evento_top,
        "climaTop":         clima_top,
        "incrementoScore":  str(incremento),
        "reducVelocidadPct": reduc_vel
    },
    "vehiculo_critico": {"tipo": veh_tipo, "impacto": f"{veh_cnt} registros críticos"},
    "cuellos_botella":  cuellos
}

salida = os.path.join(carpeta_ml, 'predicciones_ml.json')
with open(salida, 'w', encoding='utf-8') as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2)

print(f"\n[LISTO] predicciones_ml.json generado con {CSV_NOMBRE} — {len(df)} registros.")