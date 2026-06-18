const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Conexión a MongoDB Atlas usando tu variable de entorno
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 Conectado exitosamente a MongoDB Atlas (CRUD Tareas)"))
  .catch(err => console.error("❌ Error de conexión:", err));

// Modelo de Datos (Esquema de la Tarea)
const TareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  prioridad: { type: String, required: true }
});

const Tarea = mongoose.model('Tarea', TareaSchema);

// === RUTAS DEL API (CRUD) ===

// 1. READ: Obtener todas las tareas
app.get('/tareas', async (req, res) => {
  try {
    const listaTareas = await Tarea.find();
    res.json(listaTareas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las tareas", error });
  }
});

// 2. CREATE: Guardar una nueva tarea
app.post('/tareas', async (req, res) => {
  try {
    const nuevaTarea = new Tarea(req.body);
    await nuevaTarea.save();
    res.json({ mensaje: "¡Tarea guardada exitosamente!", nuevaTarea });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar la tarea", error });
  }
});

// 3. UPDATE: Actualizar una tarea existente por su ID
app.put('/tareas/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const tareaActualizada = await Tarea.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ mensaje: "¡Tarea actualizada exitosamente!", tareaActualizada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar la tarea", error });
  }
});

// 4. DELETE: Eliminar una tarea por su ID
app.delete('/tareas/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Tarea.findByIdAndDelete(id);
    res.json({ mensaje: "¡Tarea eliminada correctamente!" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al intentar eliminar la tarea", error });
  }
});

// Puerto asignado por Render o local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Servidor CRUD activo en el puerto ${PORT}`));