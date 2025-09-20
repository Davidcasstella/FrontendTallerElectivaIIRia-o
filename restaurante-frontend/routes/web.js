const express = require('express');
const router = express.Router();

// Middleware para verificar autenticación en rutas web
const requireAuth = (req, res, next) => {
  // En el cliente verificaremos el token con JavaScript
  // Esta es solo la ruta, la lógica estará en el frontend
  next();
};

// Ruta principal - redirige al login
router.get('/', (req, res) => {
  res.redirect('/login');
});

// Ruta de login
router.get('/login', (req, res) => {
  res.render('login', { 
    title: 'Iniciar Sesión',
    error: null 
  });
});

// Ruta de registro
router.get('/register', (req, res) => {
  res.render('register', { 
    title: 'Registro',
    error: null 
  });
});

// Ruta del dashboard (protegida)
router.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', { 
    title: 'Dashboard',
    user: null // Se llenará con JavaScript desde localStorage
  });
});

// Ruta de productos
router.get('/products', requireAuth, (req, res) => {
  res.render('products', { 
    title: 'Productos',
    user: null
  });
});

// Ruta de pedidos
router.get('/orders', requireAuth, (req, res) => {
  res.render('orders', { 
    title: 'Pedidos',
    user: null
  });
});

module.exports = router;