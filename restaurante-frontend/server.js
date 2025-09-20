require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

// Configuración básica de Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrcAttr: ["'unsafe-inline'"], // Esto permite onclick
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://tallerelevita2-1.onrender.com", "http://localhost:3000"]
    }
  }
}));

// Rutas básicas
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { 
    title: 'Iniciar Sesión'
  });
});

app.get('/register', (req, res) => {
  res.render('register', { 
    title: 'Registro'
  });
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard', { 
    title: 'Dashboard'
  });
});

app.get('/products', (req, res) => {
  res.render('products', { 
    title: 'Productos'
  });
});

// Nuevas rutas para productos
app.get('/products/new', (req, res) => {
  res.render('product-form', { 
    title: 'Nuevo Producto',
    mode: 'create',
    product: null
  });
});

app.get('/products/edit/:id', (req, res) => {
  res.render('product-form', { 
    title: 'Editar Producto',
    mode: 'edit',
    productId: req.params.id
  });
});

// Ruta para pedidos (la crearemos después)
app.get('/orders', (req, res) => {
  res.render('orders', { 
    title: 'Pedidos'
  });
});

// Ruta para gestión de usuarios (solo admin)
app.get('/users', (req, res) => {
  res.render('users', { 
    title: 'Gestión de Usuarios'
  });
});

// Ruta para gestión de categorías
app.get('/categories', (req, res) => {
  res.render('categories', { 
    title: 'Gestión de Categorías'
  });
});

// Ruta para formulario de categoría
app.get('/categories/new', (req, res) => {
  res.render('category-form', { 
    title: 'Nueva Categoría',
    mode: 'create'
  });
});

app.get('/categories/edit/:id', (req, res) => {
  res.render('category-form', { 
    title: 'Editar Categoría',
    mode: 'edit',
    categoryId: req.params.id
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).send(`
    <h1>404 - Página no encontrada</h1>
    <p>La página ${req.url} no existe.</p>
    <a href="/login">Volver al Login</a>
  `);
});

// Manejo de errores generales
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).send(`
    <h1>500 - Error interno del servidor</h1>
    <p>${error.message}</p>
    <a href="/login">Volver al Login</a>
  `);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Frontend servidor escuchando en http://localhost:${PORT}`);
  console.log(`🌐 Ve a http://localhost:${PORT}/login para empezar`);
});