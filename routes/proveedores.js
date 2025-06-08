const express = require('express');
const sql = require('mssql');
require('dotenv').config();

const router = express.Router();

// Configuración de conexión a SQL Server
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// 📌 Obtener todos los proveedores (GET)
router.get('/proveedores', async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT id, nombres, contacto FROM PROVEEDORES');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send("❌ Error al obtener proveedores: " + error.message);
  }
});

// 📌 Agregar un proveedor (POST)
router.post('/proveedores', async (req, res) => {
  try {
    let { nombres, contacto } = req.body; // Extrae los datos enviados

    if (!nombres || !contacto) {
      return res.status(400).send("❌ Error: Todos los campos son requeridos.");
    }

    let pool = await sql.connect(config);
    await pool.request()
      .input('nombres', sql.VarChar, nombres)
      .input('contacto', sql.VarChar, contacto)
      .query('INSERT INTO PROVEEDORES (nombres, contacto) VALUES (@nombres, @contacto)');

    res.status(201).send("✅ Proveedor agregado correctamente.");
  } catch (error) {
    res.status(500).send("❌ Error al agregar proveedor: " + error.message);
  }
});

// 📌 Actualizar un proveedor (PUT)
router.put('/proveedores/:id', async (req, res) => {
  try {
    let { id } = req.params;  // Obtiene el ID del proveedor desde la URL
    let { nombres, contacto } = req.body;  // Obtiene los datos del cuerpo de la solicitud

    if (!nombres || !contacto) {
      return res.status(400).send("❌ Error: Todos los campos son requeridos.");
    }

    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombres', sql.VarChar, nombres)
      .input('contacto', sql.VarChar, contacto)
      .query('UPDATE PROVEEDORES SET nombres = @nombres, contacto = @contacto WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("❌ Error: No se encontró el proveedor.");
    }

    res.send("✅ Proveedor actualizado correctamente.");
  } catch (error) {
    res.status(500).send("❌ Error al actualizar proveedor: " + error.message);
  }
});

// 📌 Eliminar un proveedor (DELETE)
router.delete('/proveedores/:id', async (req, res) => {
  try {
    let { id } = req.params;  // Obtiene el ID del proveedor desde la URL

    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM PROVEEDORES WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("❌ Error: No se encontró el proveedor.");
    }

    res.send("✅ Proveedor eliminado correctamente.");
  } catch (error) {
    res.status(500).send("❌ Error al eliminar proveedor: " + error.message);
  }
});

module.exports = router;
