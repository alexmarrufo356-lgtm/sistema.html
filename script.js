import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

let carrito = []; // Lista temporal de la venta

// --- LÓGICA DE INVENTARIO ---
async function cargarInventario() {
    const tabla = document.getElementById("cuerpo-tabla");
    const select = document.getElementById("select-productos");
    if (!tabla) return;
    
    tabla.innerHTML = "";
    if (select) select.innerHTML = "";
    
    const querySnapshot = await getDocs(collection(db, "inventario"));
    querySnapshot.forEach((doc) => {
        const p = doc.data();
        const id = doc.id;
        tabla.innerHTML += `<tr>
            <td>${p.nombre}</td><td>$${p.precio}</td><td>${p.stock}</td>
            <td><button onclick="borrarProducto('${id}')">Borrar</button></td>
        </tr>`;
        if (select) select.innerHTML += `<option value="${id}">${p.nombre} ($${p.precio})</option>`;
    });
}

// --- LÓGICA DE VENTAS ---
window.agregarAVenta = async () => {
    const id = document.getElementById("select-productos").value;
    const snap = await getDoc(doc(db, "inventario", id));
    const prod = snap.data();
    carrito.push({ id, ...prod });
    
    const lista = document.getElementById("lista-venta");
    lista.innerHTML += `<tr><td>${prod.nombre}</td><td>$${prod.precio}</td><td></td></tr>`;
};

window.procesarVenta = async () => {
    for (let item of carrito) {
        const prodRef = doc(db, "inventario", item.id);
        const nuevoStock = parseInt(item.stock) - 1;
        await updateDoc(prodRef, { stock: nuevoStock });
    }
    
    // Generar Factura (Simple)
    document.getElementById("contenedor-factura").innerHTML = `<h4>FACTURA</h4>` + 
        carrito.map(i => `<p>${i.nombre} - $${i.precio}</p>`).join("");
    
    carrito = [];
    document.getElementById("lista-venta").innerHTML = "";
    alert("Venta procesada y stock actualizado");
    cargarInventario();
};

// --- FUNCIONES BÁSICAS ---
window.borrarProducto = async (id) => {
    await deleteDoc(doc(db, "inventario", id));
    cargarInventario();
};

document.getElementById("btnGuardar").addEventListener("click", async () => {
    await addDoc(collection(db, "inventario"), {
        nombre: document.getElementById("nombre").value,
        precio: document.getElementById("precio").value,
        stock: document.getElementById("stock").value
    });
    cargarInventario();
});

cargarInventario();