const express = require('express');
const sql = require('mssql');
require('dotenv').config();

const app = express();
app.use(express.json());

// Middleware para registrar las solicitudes en la terminal
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

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

// Conectar a SQL Server
sql.connect(config)
  .then(() => console.log("✅ Conectado a SQL Server"))
  .catch(err => console.error("❌ Error de conexión", err));

// Importar rutas
const proveedoresRoutes = require('./routes/proveedores');
app.use('/api', proveedoresRoutes);

// 📌 Ruta raíz para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('🚀 Servidor funcionando correctamente');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
