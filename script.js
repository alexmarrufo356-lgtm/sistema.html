// Lógica básica para manejar el inventario
let inventario = [];

function agregarProducto(producto) {
    // Validar si el código ya existe
    const existe = inventario.find(p => p.codigo === producto.codigo);
    
    if (existe) {
        alert("¡Error! Ya existe un producto con este código. Usa la función de edición.");
        return;
    }
    
    inventario.push(producto);
    renderizarTabla();
}

function renderizarTabla() {
    const tbody = document.getElementById("lista-productos");
    tbody.innerHTML = "";
    inventario.forEach(p => {
        tbody.innerHTML += `<tr>
            <td>${p.codigo}</td>
            <td>${p.nombre}</td>
            <td>${p.marca}</td>
            <td>${p.vehiculo}</td>
            <td>${p.stock}</td>
            <td>${p.precio}$</td>
            <td><button>Editar</button> <button>Borrar</button></td>
        </tr>`;
    });
}