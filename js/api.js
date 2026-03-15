// js/api.js - Módulo de servicios de red
const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Obtiene la lista completa de usuarios
 * @returns {Promise<Array>} Arreglo de objetos de usuario
 */
export async function obtenerUsuarios() {
    try {
        const respuesta = await fetch(`${BASE_URL}/users`);
        if (!respuesta.ok) throw new Error(`HTTP Error: ${respuesta.status}`); // 
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        throw error;
    }
}

/**
 * ACTIVIDAD 2: Obtiene los posts de un usuario específico
 * @param {number} userId - ID del usuario a consultar
 * @returns {Promise<Array>} Arreglo de posts del usuario
 */
export async function obtenerPostsDeUsuario(userId) {
    try {
        // Realizamos la petición filtrada por ID de usuario 
        const respuesta = await fetch(`${BASE_URL}/posts?userId=${userId}`);
        
        if (!respuesta.ok) {
            throw new Error(`No se pudieron obtener los posts (Status: ${respuesta.status})`);
        }
        
        return await respuesta.json(); // 
    } catch (error) {
        console.error(`Error al obtener posts del usuario ${userId}:`, error);
        throw error;
    }
}