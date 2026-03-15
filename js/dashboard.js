/**
 * PRÁCTICA 3.2: Dashboard de Datos con Fetch API
 * Código Limpio y Corregido
 */

import { obtenerUsuarios, obtenerPostsDeUsuario } from './api.js';

// 1. SELECCIÓN DE ELEMENTOS
const contenedor      = document.getElementById('contenedor-usuarios');
const btnCargar       = document.getElementById('btnCargar');
const btnLimpiar      = document.getElementById('btnLimpiar');
const spinner         = document.getElementById('spinner');
const estado          = document.getElementById('estado');
const buscador        = document.getElementById('busqueda');
const modal           = document.getElementById('modal-posts');
const modalContenido  = document.getElementById('modal-contenido');
const btnCerrarModal  = document.getElementById('btnCerrarModal');

// 2. FUNCIONES DE UTILIDAD
function mostrarEstado(mensaje, tipo = 'info') {
    estado.textContent = mensaje;
    estado.className = `estado-${tipo}`;
}

function generarFechaEspanol() {
    const ahora = new Date();
    const diasAtras = Math.floor(Math.random() * 30);
    ahora.setDate(ahora.getDate() - diasAtras);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return ahora.toLocaleDateString('es-MX', opciones);
}

// 3. LÓGICA DEL MODAL (Abrir y Cerrar)
function cerrarModal() {
    modal.style.display = 'none';
    modal.hidden = true;
    modalContenido.innerHTML = '';
    document.body.style.overflow = 'auto'; 
}

async function abrirModal(usuario) {
    modal.style.display = 'flex';
    modal.hidden = false;
    document.getElementById('modal-titulo').textContent = `Publicaciones de ${usuario.name}`;
    modalContenido.innerHTML = '<div id="spinner-modal">⏳ Cargando publicaciones...</div>';
    document.body.style.overflow = 'hidden';

    try {
        const posts = await obtenerPostsDeUsuario(usuario.id);
        modalContenido.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-card-modal';
            postElement.innerHTML = `
                <span class="post-fecha">📅 ${generarFechaEspanol()}</span>
                <h4>${post.title}</h4>
                <p>${post.body}</p>
            `;
            modalContenido.appendChild(postElement);
        });
    } catch (error) {
        modalContenido.innerHTML = `<p class="estado-error">Error: ${error.message}</p>`;
    }
}

// 4. RENDERIZADO DE INTERFAZ
function crearTarjetaUsuario(usuario) {
    const card = document.createElement('article');
    card.className = 'tarjeta-usuario';
    card.innerHTML = `
        <h3>${usuario.name}</h3>
        <p>📧 ${usuario.email}</p>
        <button class="btn-posts">Ver publicaciones ✏️</button>
    `;
    card.querySelector('.btn-posts').addEventListener('click', () => abrirModal(usuario));
    return card;
}

async function manejarCarga() {
    spinner.hidden = false;
    contenedor.innerHTML = '';
    mostrarEstado('Solicitando datos a la API...', 'info');
    try {
        const usuarios = await obtenerUsuarios();
        usuarios.forEach(u => contenedor.appendChild(crearTarjetaUsuario(u)));
        mostrarEstado(`${usuarios.length} usuarios cargados exitosamente`, 'ok');
    } catch (err) {
        mostrarEstado(`Error: ${err.message}`, 'error');
    } finally {
        spinner.hidden = true;
    }
}

// 5. ASIGNACIÓN DE EVENTOS
btnCargar.addEventListener('click', manejarCarga);

btnLimpiar.addEventListener('click', () => {
    contenedor.innerHTML = ''; 
    if (buscador) buscador.value = ''; 
    mostrarEstado('Dashboard limpio.', 'info');
    spinner.hidden = true;
});

btnCerrarModal.addEventListener('click', cerrarModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
});

if (buscador) {
    buscador.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.tarjeta-usuario').forEach(card => {
            const nombre = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = nombre.includes(query) ? 'flex' : 'none';
        });
    });
}