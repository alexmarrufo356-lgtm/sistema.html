import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAuKQkjl6lJkANXbNc90u4ErScfJvtqiYI",
  authDomain: "sistemaventas-7ba29.firebaseapp.com",
  projectId: "sistemaventas-7ba29",
  storageBucket: "sistemaventas-7ba29.firebasestorage.app",
  messagingSenderId: "454587610356",
  appId: "1:454587610356:web:7dd06a24d05d262b82daa1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para guardar mercancía
export async function guardarMercancia(producto) {
    try {
        const docRef = await addDoc(collection(db, "inventario"), producto);
        console.log("Producto guardado con ID: ", docRef.id);
        alert("Producto guardado con éxito");
    } catch (e) {
        console.error("Error al guardar: ", e);
    }
}
// Añadimos el "encendido" para que el botón funcione
document.getElementById("btnGuardar").addEventListener("click", async () => {
    const producto = {
        codigo: document.getElementById("codigo").value,
        nombre: document.getElementById("nombre").value,
        marca: document.getElementById("marca").value,
        precio: document.getElementById("precio").value,
        stock: document.getElementById("stock").value
    };

    // Llamamos a la función que ya tenías
    await guardarMercancia(producto);
});