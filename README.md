# Calorie Tracker (React + TypeScript + Spring Boot)

Aplicacion didactica para registrar calorias de **comidas** y **ejercicios**, ahora con:

- calendario por dia,
- busqueda/carga por fecha,
- guardado manual al backend,
- persistencia local (`localStorage`) como cache,
- API REST en Spring Boot 3 con PostgreSQL.

## Que vas a practicar

- `useState` para estado local de UI.
- `useReducer` para reglas globales de actualizacion.
- Props y callbacks para pasar datos entre componentes.
- Persistencia local y sincronizacion con backend.
- Integracion React <-> Spring Boot.

## Stack

### Frontend
- React 19
- TypeScript
- Vite
- D3.js

### Backend
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Flyway
- PostgreSQL

## Estructura principal

```text
src/
  App.tsx
  components/
    Form.tsx
    ActivityList.tsx
    CalorieSummary.tsx
    CaloriesChart.tsx
    DateFilter.tsx
  reducers/
    activity-reducer.ts
  services/
    activity-api.ts
  types/
    index.ts

backend/
  pom.xml
  docker-compose.yml
  src/main/java/com/calories/backend/
    config/WebConfig.java
    controller/ActivityController.java
    controller/ApiExceptionHandler.java
    dto/ActivityDto.java
    dto/BulkSaveActivitiesRequest.java
    entity/ActivityEntity.java
    repository/ActivityRepository.java
    service/ActivityService.java
  src/main/resources/
    application.properties
    db/migration/V1__create_activities_table.sql
```

## Flujo didactico de estado (paso a paso)

1. `App.tsx` crea el estado global con `useReducer(activityReducer, ...)`.
2. `Form.tsx` usa `useState` para controlar inputs y validar.
3. Al guardar, `Form` envia una accion con `dispatch`.
4. `activityReducer.ts` actualiza `state.activities` de forma inmutable.
5. React re-renderiza `ActivityList`, `CalorieSummary` y `CaloriesChart`.
6. `App.tsx` guarda la lista del dia en `localStorage` (cache por fecha).
7. Al cambiar fecha en `DateFilter.tsx`, se intenta cargar desde backend; si falla, usa cache local.

## Como se pasan datos entre componentes

- **Padre a hijo (props):** `App` envia `activities`, `selectedDate`, `dispatch` y callbacks.
- **Hijo a padre (callbacks):** `ActivityList` llama `onEdit`, `onDelete`, `onReset`, `onSaveToBackend`.
- **Regla clave:** el estado global vive en `App`; los hijos solo notifican eventos.

## Endpoints del backend

- `GET /api/activities?date=YYYY-MM-DD`
  - devuelve actividades del dia.
- `POST /api/activities/bulk`
  - reemplaza actividades del dia enviado.

Payload de ejemplo:

```json
{
  "date": "2026-03-27",
  "activities": [
    {
      "id": "a1",
      "category": 1,
      "name": "Desayuno",
      "calories": 450,
      "date": "2026-03-27"
    }
  ]
}
```

## Levantar proyecto local

### 1) Frontend

```bash
npm install
npm run dev
```

Frontend en `http://localhost:5173`.

### 2) Base de datos PostgreSQL

```bash
cd backend
docker compose up -d
```

### 3) Backend Spring Boot

```bash
cd backend
mvn spring-boot:run
```

Backend en `http://localhost:8080`.

## Variables de entorno utiles

Frontend (`.env` en raiz):

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

Backend (`application.properties` ya trae defaults):

- `DB_URL`
- `DB_USER`
- `DB_PASSWORD`
- `SERVER_PORT`

## Explicacion corta: `useState` vs `useReducer`

- `useState`: para cosas locales del componente (inputs, loading, mensajes UI).
- `useReducer`: para estado compartido y reglas claras (guardar, editar, eliminar, resetear, setear lista).

Piensalo asi:

- `useState` = borrador temporal.
- `useReducer` = libro contable oficial.

## Que hace cada accion del reducer

En `src/reducers/activity-reducer.ts`:

- `save-activity`: agrega una actividad.
- `update-activity`: actualiza por `id`.
- `delete-activity`: elimina por indice.
- `set-activities`: reemplaza lista al cargar por fecha.
- `reset-activities`: limpia el dia actual.

## Flujo de guardado al backend

1. Usuario pulsa **Guardar en backend** en `ActivityList`.
2. `App` llama `saveActivitiesByDate()` de `src/services/activity-api.ts`.
3. Backend valida y guarda en PostgreSQL.
4. El frontend actualiza estado con la respuesta confirmada.

## Ejercicios recomendados (modo aprendizaje)

1. Cambiar `delete-activity` para borrar por `id` en vez de indice.
2. Agregar autenticacion simple (token fijo) entre frontend y backend.
3. Crear endpoint para resumen diario (`/api/activities/summary?date=...`).
4. Agregar pruebas unitarias del reducer y del servicio backend.
