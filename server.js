const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 Conectado a MongoDB Atlas para Tareas"))
  .catch(err => console.error("❌ Error:", err));

// NUEVO ESQUEMA: Estructura para una tarea
const TareaSchema = new mongoose.Schema({
  titulo: String,
  prioridad: String, // Ejemplo: Alta, Media, Baja
  completada: { type: Boolean, default: false }
});

const Tarea = mongoose.model('Tarea', TareaSchema);

// RUTAS
// GET: Traer todas las tareas
app.get('/tareas', async (req, res) => {
  try {
    const listaTareas = await Tarea.find();
    res.json(listaTareas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener tareas" });
  }
});

// POST: Crear una nueva tarea
app.post('/tareas', async (req, res) => {
  try {
    const nuevaTarea = new Tarea(req.body);
    await nuevaTarea.save();
    res.json({ mensaje: "¡Tarea guardada!", nuevaTarea });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar tarea" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));