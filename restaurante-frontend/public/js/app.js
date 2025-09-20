// Configuración de la API - APUNTAR AL BACKEND REAL
const API_URL = 'https://tallerelevita2-1.onrender.com/api'; // Tu backend en la nube
// const API_URL = 'http://localhost:3000/api'; // Si tu backend está local descomenta esta línea

// Estado de la aplicación
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Verificar autenticación al cargar cualquier página
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Inicializar aplicación
async function initializeApp() {
    // Obtener información del usuario si existe
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }

    // Verificar token si existe
    if (authToken) {
        const isValid = await verifyToken();
        if (!isValid) {
            // Token inválido, limpiar y redireccionar al login
            clearAuthData();
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        } else {
            // Token válido, mostrar información del usuario donde corresponda
            displayUserInfo();
        }
    } else {
        // No hay token, redireccionar al login si estamos en página protegida
        const publicPages = ['/login', '/register', '/'];
        if (!publicPages.includes(window.location.pathname)) {
            window.location.href = '/login';
        }
    }
}

// Función para mostrar alertas
function showAlert(elementId, message, type = 'error') {
    const alertElement = document.getElementById(elementId);
    if (alertElement) {
        alertElement.textContent = message;
        alertElement.className = `alert alert-${type}`;
        alertElement.classList.remove('hidden');
        
        setTimeout(() => {
            alertElement.classList.add('hidden');
        }, 5000);
    }
}

// Función para hacer requests a la API
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    // Agregar token si existe
    if (authToken) {
        options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Agregar datos si es POST/PUT
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error en la petición');
        }

        return result;
    } catch (error) {
        console.error('Error en API:', error);
        throw error;
    }
}

// Verificar token
async function verifyToken() {
    try {
        // Intentar hacer una petición autenticada
        await apiRequest('/users');
        return true;
    } catch (error) {
        console.log('Token inválido:', error.message);
        return false;
    }
}

// Limpiar datos de autenticación
function clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;
}

// Mostrar información del usuario en páginas protegidas
function displayUserInfo() {
    const userInfoElement = document.getElementById('userInfo');
    const userDetailsElement = document.getElementById('userDetails');
    
    if (currentUser && userDetailsElement) {
        userDetailsElement.innerHTML = `
            <p><strong>Nombre:</strong> ${currentUser.name}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Rol:</strong> ${currentUser.role}</p>
        `;
    }

    if (currentUser && userInfoElement) {
        userInfoElement.classList.remove('hidden');
    }
}

// Función de login
async function login(credentials) {
    try {
        showLoading('loginForm', true);
        const response = await apiRequest('/auth/login', 'POST', credentials);
        
        if (response.success) {
            authToken = response.token;
            currentUser = response.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showAlert('loginAlert', 'Login exitoso', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        }
    } catch (error) {
        showAlert('loginAlert', error.message || 'Error al iniciar sesión', 'error');
    } finally {
        showLoading('loginForm', false);
    }
}

// Función de registro
async function register(userData) {
    try {
        showLoading('registerForm', true);
        const response = await apiRequest('/auth/register', 'POST', userData);
        
        if (response.success) {
            authToken = response.token;
            currentUser = response.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showAlert('registerAlert', 'Registro exitoso', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        }
    } catch (error) {
        showAlert('registerAlert', error.message || 'Error al registrarse', 'error');
    } finally {
        showLoading('registerForm', false);
    }
}

// Función de logout
async function logout() {
    try {
        // Intentar hacer logout en el servidor (opcional)
        await apiRequest('/auth/logout', 'POST');
    } catch (error) {
        console.log('Error en logout del servidor:', error);
    } finally {
        clearAuthData();
        window.location.href = '/login';
    }
}

// Mostrar/ocultar estado de carga
function showLoading(formId, show) {
    const form = document.getElementById(formId);
    if (form) {
        if (show) {
            form.classList.add('loading');
        } else {
            form.classList.remove('loading');
        }
    }
}

// Event listeners globales
document.addEventListener('DOMContentLoaded', function() {
    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const credentials = {
                email: formData.get('email'),
                password: formData.get('password')
            };
            await login(credentials);
        });
    }

    // Formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                role: formData.get('role')
            };
            await register(userData);
        });
    }

    // Botón de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Enlaces de navegación entre login y registro
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/login';
        });
    }
    
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/register';
        });
    }
});

// Funciones utilitarias globales
window.appUtils = {
    apiRequest,
    showAlert,
    logout,
    getCurrentUser: () => currentUser,
    getAuthToken: () => authToken
};