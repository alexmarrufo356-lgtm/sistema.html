import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAuKQKj16lJkANXbNc90u4ErScfJvtqiYI",
    authDomain: "sistemaventas-7ba29.firebaseapp.com",
    projectId: "sistemaventas-7ba29",
    storageBucket: "sistemaventas-7ba29.appspot.com",
    messagingSenderId: "454587610356",
    appId: "1:454587610356:web:7dd06a24d05d262b82daa1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para cargar los datos en la tabla (Inventario)
async function cargarInventario() {
    const tabla = document.getElementById("cuerpo-tabla");
    if (!tabla) return; // Por si no estamos en la página correcta
    
    tabla.innerHTML = ""; 
    const querySnapshot = await getDocs(collection(db, "inventario"));
    
    querySnapshot.forEach((doc) => {
        const p = doc.data();
        const id = doc.id;
        tabla.innerHTML += `<tr>
            <td>${p.codigo}</td><td>${p.nombre}</td><td>${p.marca}</td><td>${p.precio}</td><td>${p.stock}</td>
            <td>
                <button class="btn-editar" onclick="editarProducto('${id}')">Editar</button>
                <button class="btn-borrar" onclick="borrarProducto('${id}')">Borrar</button>
            </td>
        </tr>`;
    });
}

// Función Borrar
window.borrarProducto = async function(id) {
    if(confirm("¿Seguro que quieres borrar este producto?")) {
        await deleteDoc(doc(db, "inventario", id));
        cargarInventario();
    }
}

// Función Editar (preparada para el siguiente paso)
window.editarProducto = function(id) {
    alert("Función de edición preparada para el ID: " + id);
}

// Guardar nueva mercancía
document.getElementById("btnGuardar").addEventListener("click", async () => {
    const producto = {
        codigo: document.getElementById("codigo").value,
        nombre: document.getElementById("nombre").value,
        marca: document.getElementById("marca").value,
        precio: document.getElementById("precio").value,
        stock: document.getElementById("stock").value
    };
    await addDoc(collection(db, "inventario"), producto);
    alert("Producto guardado");
    cargarInventario(); // Recarga la tabla al guardar
});

// Calculadora
window.calcularVenta = function() {
    const tasa = parseFloat(document.getElementById('tasa').value) || 0;
    const precio = parseFloat(document.getElementById('precioVenta').value) || 0;
    const totalUsd = precio * 1.35;
    const totalBs = totalUsd * tasa;
    document.getElementById('total-usd').innerText = '$' + totalUsd.toFixed(2);
    document.getElementById('total-bs').innerText = totalBs.toLocaleString('es-VE', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' Bs.';
}

// Cargar inventario al iniciar
cargarInventario();