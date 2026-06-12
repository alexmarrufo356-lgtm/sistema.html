import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

// --- CÓDIGO ORIGINAL TUYO ---
export async function guardarMercancia(producto) {
    try {
        const docRef = await addDoc(collection(db, "inventario"), producto);
        console.log("Producto guardado con ID: ", docRef.id);
        alert("Producto guardado con éxito");
    } catch (e) {
        console.error("Error al guardar: ", e);
    }
}

document.getElementById("btnGuardar").addEventListener("click", async () => {
    const producto = {
        codigo: document.getElementById("codigo").value,
        nombre: document.getElementById("nombre").value,
        marca: document.getElementById("marca").value,
        precio: document.getElementById("precio").value,
        stock: document.getElementById("stock").value
    };
    await guardarMercancia(producto);
});

window.calcularVenta = function() {
    const tasa = parseFloat(document.getElementById('tasa').value) || 0;
    const precio = parseFloat(document.getElementById('precioVenta').value) || 0;
    const totalUsd = precio * 1.35;
    const totalBs = totalUsd * tasa;
    document.getElementById('total-usd').innerText = '$' + totalUsd.toFixed(2);
    document.getElementById('total-bs').innerText = totalBs.toLocaleString('es-VE', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' Bs.';
}

// --- NUEVA LÓGICA DE VENTAS ---
let carrito = [];

window.agregarAVenta = async function(idProducto) {
    const snap = await getDoc(doc(db, "inventario", idProducto));
    const prod = snap.data();
    carrito.push({ id: idProducto, ...prod });
    alert(prod.nombre + " añadido a la venta");
};

window.procesarVenta = async function() {
    if (carrito.length === 0) return alert("El carrito está vacío");

    for (let item of carrito) {
        const ref = doc(db, "inventario", item.id);
        const prod = (await getDoc(ref)).data();
        await updateDoc(ref, { stock: parseInt(prod.stock) - 1 });
    }

    const facturaHtml = `
        <h3>FACTURA - ${new Date().toLocaleString()}</h3>
        <p>Local: Mi Negocio</p>
        <ul>${carrito.map(i => `<li>${i.nombre} - $${i.precio}</li>`).join("")}</ul>
        <p>Total: $${carrito.reduce((acc, i) => acc + parseFloat(i.precio), 0)}</p>
    `;
    
    document.getElementById("facturas").innerHTML = facturaHtml;
    carrito = [];
    alert("Venta realizada y stock actualizado");
};

window.borrarVenta = function() {
    carrito = [];
    alert("Venta borrada");
};