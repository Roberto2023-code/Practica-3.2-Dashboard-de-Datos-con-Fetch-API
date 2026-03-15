/**
 * PRÁCTICA 1: Explorador Interactivo del DOM - Versión Pro
 * Incluye: Edición In-place, Contador Dinámico y MutationObserver
 */

// 1. SELECCIÓN DE ELEMENTOS
const btnAgregar = document.getElementById('btnAgregar');
const inputTarea = document.getElementById('nuevaTarea');
const lista      = document.getElementById('listaTareas');
const titulo     = document.getElementById('titulo');

// 2. GESTIÓN DE PERSISTENCIA
function guardarTareas() {
    const tareas = [];
    document.querySelectorAll('#listaTareas li').forEach(li => {
        const span = li.querySelector('span');
        if (span) { // Solo guardamos si no está en modo edición
            tareas.push({
                texto: span.textContent,
                completada: li.classList.contains('completada')
            });
        }
    });
    localStorage.setItem('tareas_v2', JSON.stringify(tareas));
}

function cargarTareas() {
    const datos = localStorage.getItem('tareas_v2');
    if (!datos) return;
    JSON.parse(datos).forEach(t => crearElementoTarea(t.texto, t.completada));
}

// 3. PASO 1 Y 2: CREACIÓN Y EDICIÓN DE TAREAS
function crearElementoTarea(texto, estaCompletada = false) {
    const li      = document.createElement('li'); // [cite: 14]
    const span    = document.createElement('span');
    const btnEdit = document.createElement('button'); // Paso 1: Botón editar
    const btnDel  = document.createElement('button');

    span.textContent = texto;
    if (estaCompletada) li.classList.add('completada'); // [cite: 15]

    btnEdit.textContent = '✏️';
    btnEdit.className   = 'btn-editar';
    
    btnDel.textContent  = '✕';
    btnDel.className    = 'btn-eliminar';

    // PROGRAMAR FUNCIÓN EDITAR (Paso 2 - Sin prompt)
    btnEdit.addEventListener('click', () => {
        const actualTexto = span.textContent;
        const inputEdit = document.createElement('input');
        inputEdit.type = 'text';
        inputEdit.value = actualTexto;
        inputEdit.className = 'edit-input';

        // Reemplazar span por input en el DOM
        li.replaceChild(inputEdit, span);
        inputEdit.focus();

        // Finalizar edición al presionar Enter o perder foco
        const finalizarEdicion = () => {
            const nuevoTexto = inputEdit.value.trim() || actualTexto;
            span.textContent = nuevoTexto;
            li.replaceChild(span, inputEdit);
            guardarTareas();
        };

        inputEdit.addEventListener('keyup', (e) => { if (e.key === 'Enter') finalizarEdicion(); });
        inputEdit.addEventListener('blur', finalizarEdicion);
    });

    // Eventos base
    btnDel.addEventListener('click', () => { li.remove(); guardarTareas(); }); // [cite: 16, 32]
    span.addEventListener('click', () => { li.classList.toggle('completada'); guardarTareas(); });

    li.append(span, btnEdit, btnDel);
    lista.appendChild(li);
}

// 4. PASO 3 Y 4: CONTADOR Y MUTATION OBSERVER
// Función para actualizar atributos y contenido (Paso 3)
function actualizarContador() {
    const total = lista.querySelectorAll('li').length;
    titulo.textContent = `Mi Lista de Tareas (${total})`; // 
    titulo.setAttribute('data-count', total); // 
}

// Implementar MutationObserver (Paso 4)
const observer = new MutationObserver(() => {
    actualizarContador();
    console.log("DOM detectó un cambio en la lista."); // 
});

// Empezar a observar cambios en los hijos de la lista
observer.observe(lista, { childList: true }); // 

// 5. CONTROLADORES DE EVENTOS
function agregarTarea() {
    const texto = inputTarea.value.trim();
    if (!texto) return;
    crearElementoTarea(texto);
    inputTarea.value = '';
    inputTarea.focus();
    guardarTareas();
}

btnAgregar.addEventListener('click', agregarTarea); // 
inputTarea.addEventListener('keyup', (e) => { if (e.key === 'Enter') agregarTarea(); }); // 

// Actividad 3: Estilo directo por dblclick
const colores = ['#1F3864', '#2E5FA3', '#E8A020', '#27AE60'];
let colorIdx = 0;
titulo.addEventListener('dblclick', () => {
    colorIdx = (colorIdx + 1) % colores.length;
    titulo.style.color = colores[colorIdx]; // 
});

// INICIO
cargarTareas();
actualizarContador();