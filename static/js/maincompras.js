const btnAbrirModalCompra = document.querySelector("#btnAbrirModalCompra");
const modalCarrito = document.querySelector("#modalCarrito");
const btn_cancelarcarrito = document.querySelector("#btn_cancelarcarrito");
const titulocarrito = document.querySelector("#titulocarrito");
const norden = document.querySelector("#norden");
const btncerraModalcar = document.querySelector("#btncerraModalcar");
const modalAgregarProducto = document.querySelector("#modalAgregarProducto");
const btnagregarcar = document.querySelector("#btnagregarcar");

const btnmodificarCarrito = document.querySelector("#btnmodificarCarrito");
const btnEliminarCarrito = document.querySelector("#btnEliminarCarrito");
const btncancerlaPedido = document.querySelector("#btncancerlaPedido");



const txtidproductoc = document.querySelector("#txtidproductoc");
const nombreproductocompra = document.querySelector("#nombreproductocompra");
const txtdescripcioncompra = document.querySelector("#txtdescripcioncompra");
const txtpreciocompra = document.querySelector("#txtpreciocompra");
const txtcantidadcompra = document.querySelector("#txtcantidadcompra");
const txtsubtotal = document.querySelector("#txtsubtotal");
const txtnameImagen = document.querySelector("#txtnameImagen");
const idprov = document.querySelector("#idprov");

if (btnAbrirModalCompra) {
    btnAbrirModalCompra.addEventListener("click", (e) => {
        modalCarrito.showModal();
        procesosAbrirModal();
    });
}

if (btn_cancelarcarrito) {
    btn_cancelarcarrito.addEventListener("click", (e) => {
        modalCarrito.close();
    });
}
if (btncerraModalcar) {
    btncerraModalcar.addEventListener("click", (e) => {
        modalAgregarProducto.close();
    });
}

async function procesosAbrirModal() {
    await obtenerOrdenCompora();
    ListarProductos();

}


async function obtenerOrdenCompora() {
    let retorno = 0;
    try {
        const response = await axios.get("http://127.0.0.1:8000/seleccionarOrden", {
        });
        if (response.status === 200) {
            retorno = response.data.orden;
            titulocarrito.innerHTML = `Compras, Orden No. ${retorno}`;
            norden.value = retorno;
        }
    } catch (e) {
        console.log(e);
        return 0;
    }
    return retorno;
}


txtcantidadcompra.addEventListener("change", function () {
    let sub = txtcantidadcompra.value * txtpreciocompra.value;
    txtsubtotal.value = sub;
});


let dataCarrito = localStorage.getItem("dataCarrito"); //Obtener datos de localStorage
dataCarrito = JSON.parse(dataCarrito);


if (dataCarrito === null) {
    dataCarrito = [];
}

if (btnagregarcar) {
    btnagregarcar.addEventListener("click", (e) => {
        const validar = document.querySelector("#txtcantidadcompra");
        if (validar.value != 0) {
            const retorno = AgregarCarrito();
            if (retorno == 1) {
                modalAgregarProducto.close();
                alertasuccess("Producto Agregado Correctamente A La Orden");
            }
        } else {
            modalAgregarProducto.close();
            Swal.fire({
                title: "Error",
                text: "Por favor elegir la cantidad del producto!",
                icon: "info"
            });
        }

    });
}


function AgregarCarrito() {
    // Seleccionamos los datos de los inputs de formulario
    let datos_cliente = JSON.stringify({
        id: txtidproductoc.value,
        producto: nombreproductocompra.value,
        descripcion: txtdescripcioncompra.value,
        precio: txtpreciocompra.value,
        cantidad: txtcantidadcompra.value,
        subtotal: txtsubtotal.value,
        imagen: txtnameImagen.value,
        idprov: idprov.value
    });

    dataCarrito.push(datos_cliente); // Guardar datos en el array definido globalmente
    localStorage.setItem("dataCarrito", JSON.stringify(dataCarrito));
    return 1;
}


let tabla = $("#tablecarrito").DataTable({
    language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
    },
    scrollY: true,
    scrollX: true,
    "bDestroy": true // Cambia a true para permitir la destrucción de la tabla
});


function ListarProductos() {
    tabla.clear();
    let total = 0;
    let contador = 0;
    for (let i in dataCarrito) {
        contador++;
        let d = JSON.parse(dataCarrito[i]);
        tabla.row.add([
            contador,
            d.id,
            d.producto,
            d.descripcion,
            d.precio,
            d.cantidad,
            d.subtotal,
            d.imagen,
            d.idprov
        ]);

        total += Number(d.subtotal);
    }

    txttotal.value = total;

    tabla.draw();
    ocultarColumna(7);
    ocultarColumna(1);
}


$("#tablecarrito").on("click", "tr td", function (evt) {
    let id, nombre, descripcion,
        precio,
        cantidad,
        imagen,
        subtotal;

    target = $(event.target);
    id = target.parent("tr").find("td").eq(1).html();
    nombre = target.parent("tr").find("td").eq(2).html();
    descripcion = target.parent("tr").find("td").eq(3).html();
    precio = target.parent("tr").find("td").eq(4).html();
    cantidad = target.parent("tr").find("td").eq(5).html();
    subtotal = target.parent("tr").find("td").eq(6).html();
    imagen = target.parent("tr").find("td").eq(7).html();

    txtidcompra.value = id;
    nombreproductocompra.value = nombre;
    txtdescripcioncompra.value = descripcion;
    verImagencompra.src = imagen;
    txtpreciocompra.value = precio;
    txtcantidadcompra.value = cantidad;
    txtsubtotal.value = subtotal;

    btnmodificarCarrito.style.display = "block";
    btnEliminarCarrito.style.display = "block";
    btnagregarcar.style.display = "none";

    modalCarrito.close();
    modalAgregarProducto.showModal();

});


if (btnmodificarCarrito) {
    btnmodificarCarrito.addEventListener("click", (e) => {
        e.preventDefault();
        const id = txtidproductoc.value;

        const index = dataCarrito.findIndex(item => JSON.parse(item).id === id);
        if (index !== -1) {
            dataCarrito[index] = JSON.stringify({
                id: txtidproductoc.value,
                producto: nombreproductocompra.value,
                descripcion: txtdescripcioncompra.value,
                precio: txtpreciocompra.value,
                cantidad: txtcantidadcompra.value,
                subtotal: txtsubtotal.value,
                imagen: txtnameImagen.value,
                idprov: idprov.value
            });
            localStorage.setItem("dataCarrito", JSON.stringify(dataCarrito));
            modalAgregarProducto.close();
            alertasuccess("Producto Modificado En La Orden");

            // mostrartotal();
        } else {
            console.error("ID no encontrado en el carrito");
        }
    });
}

if (btnEliminarCarrito) {
    btnEliminarCarrito.addEventListener("click", (e) => {
        e.preventDefault();
        const id = txtidcompra.value;
        const index = dataCarrito.findIndex(item => JSON.parse(item).id === id);
        if (index !== -1) {
            Eliminarproductocarrito(index);
        }

    });

}

function Eliminarproductocarrito(e) {
    dataCarrito.splice(e, 1); // Args (posición en el array, numero de items a eliminar)
    localStorage.setItem("dataCarrito", JSON.stringify(dataCarrito));
    modalAgregarProducto.close();
    alertasuccess("Producto Eliminado Correctamente De La Orden");
}


if (btncancerlaPedido) {
    btncancerlaPedido.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("dataCarrito");
        location.reload();

    });
}


function mostrartotal() {
    let uno = document.querySelectorAll("#txtsubtotal");
    let total = 0;

    uno.forEach((item) => {
        if (isNaN(parseFloat(item.value))) {
            total += 0;
        } else {
            total += parseFloat(item.value);
        }
    });

    document.getElementById("total").value = total;
}


function ocultarColumna(index) {
    const tabla = document.getElementById("tablecarrito");

    // Ocultar celdas en cada fila
    for (let i = 0; i < tabla.rows.length; i++) {
        const celda = tabla.rows[i].cells[index];
        if (celda) {
            celda.style.display = "none";
        }
    }
}

function alertasuccess(mensaje) {
    Swal.fire({
        title: "Producto",
        text: mensaje,
        icon: "success",
        showCloseButton: true,

    });
}

if (btncancerlaPedido) {
    btncancerlaPedido.addEventListener("click", (e) => {
        localStorage.removeItem("dataCarrito");
        window.location.replace("/compras");

    });
}

function limpiarFormProducto() {
    btnmodificarCarrito.style.display = "none";
    btnEliminarCarrito.style.display = "none";
    btnagregarcar.style.display = "block";
    txtcantidadcompra.value = 0;
    txtsubtotal.value = 0;
    txtdescripcioncompra.value = "";
    nombreproductocompra.value = "";
    txtpreciocompra.value = 0;

}
let fechaActual = function () {
    let hoy = new Date();
    let fecha =
        hoy.getDate() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getFullYear();
    let hora = hoy.getHours() + ":" + hoy.getMinutes() + ":" + hoy.getSeconds();

    return (fechaYHora = fecha + " " + hora);
};


const btnrealizarPedido = document.querySelector("#btnrealizarPedido");

if (btnrealizarPedido) {
    btnrealizarPedido.addEventListener("click", (e) => {
        AlertaAceptarCompra();
    });
}




function AlertaAceptarCompra() {
    Swal.fire({
        target: document.querySelector("#modalCarrito"),
        title: "¿Desea crear la compra?",
        text: "Se validara la compra primero que todo.",
        icon: "info",
        background: "#ffffff",
        showCancelButton: true,
        confirmButtonColor: "#0072ff",
        cancelButtonColor: "#D2122E",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sí, deseo comprar",
    }).then((result) => {
        if (result.value) {
            const orden = document.querySelector("#norden").value;
            const txtproveedorcompra = document.querySelector("#txtproveedorcompra").value;
            const fecha = fechaActual();
            enviarDataApi(orden, fecha, txtproveedorcompra);
        }
    });
}

async function enviarDataApi(orden, fecha, proveedor) {
    const retorno1 = await crearCompra(orden, fecha, proveedor)
    console.log(retorno1);
    if (retorno1 == 1) {
        const idfinal = await obtenercompraid(fecha);
        console.log(idfinal);
        const retorno2 = await crearCompraDetalle(idfinal);
        if (retorno2 == 1) {
            localStorage.removeItem("dataCarrito");
            modalCarrito.close();
            Swal.fire({
                title: "Pedido",
                text: "Pedido Enviado Correctamente.",
                icon: "success"
            });
        }
    }
}

async function crearCompra(orden, fecha, proveedor) {
    let retorno = 0;
    console.log("Orden " + orden);
    try {
        const response = await axios.post("http://127.0.0.1:8000/crearCompra", {
            "id": 0,
            "ordencomPra": Number(orden),
            "idproveedor": Number(proveedor),
            "fechaOrden": String(fecha),
            "fechaIngreso": ""
        });

        if (response.status === 200) {
            retorno = 1;
        }
    } catch (error) {
        console.log(error);
        retorno = 0;
    }

    return retorno; // Devuelve el valor de retorno
}
async function crearCompraDetalle(idcompra) {
    let retorno = 0;
    for (let i in dataCarrito) {
        let enviar = JSON.parse(dataCarrito[i]);
        try {
            const response = await axios.post("http://127.0.0.1:8000/crearCompraDetalle", {
                "id": 0,
                "idcompra": Number(idcompra),
                "idproducto": Number(enviar.id),
                "cantidad": Number(enviar.cantidad),
                "preciocostoUnitario": Number(enviar.precio)
            });

            if (response.status === 200) {
                retorno = 1;
            }
        } catch (error) {
            console.log(error);
            retorno = 0;
        }
    }

    return retorno; // Devuelve el valor de retorno
}

async function obtenercompraid(fechapedido) {
    let retorno = 0;
    try {
        const response = await axios.get("http://127.0.0.1:8000/seleccionarVenta/<fecha>", {
            params: {
                fecha: fechapedido,
            },
        });
        if (response.status === 200) {
            retorno = response.data.id;
            console.log(retorno);
        }
    } catch (e) {
        console.log(e);
        return 0;
    }
    return retorno;
}

const btnverProducto = document.querySelector("#btnverProducto");

if (btnverProducto) {
    btnverProducto.addEventListener("click", (e) => {
        modalAgregarProducto.showModal();
    });
}


$(document).ready(function () {
    $("#tableCompras").DataTable({
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
        },
        scrollY: true,
        scrollX: true,
    });
})

const modalCompraver = document.querySelector("#modalCompraver");
const btn_cancelarcompraver = document.querySelector("#btn_cancelarcompraver");
const btnsalir = document.querySelector("#btnsalir");

$("#tableCompras").on("click", "tr td", function (evt) {
    let id, orden, fechaCompra, estado, prov;
    target = $(event.target);
    id = target.parent("tr").find("td").eq(0).html();
    orden = target.parent("tr").find("td").eq(1).html();
    fechaCompra = target.parent("tr").find("td").eq(3).html();
    estado = target.parent("tr").find("td").eq(4).html();
    prov = target.parent("tr").find("td").eq(5).html();

    const txtverproveedor = document.querySelector("#txtverproveedor");
    const txtordenno = document.querySelector("#txtordenno");
    const txtfechaEnvio = document.querySelector("#txtfechaEnvio");
    const txtestado = document.querySelector("#txtestado");

    txtverproveedor.value = prov;
    txtordenno.value = "0" + orden;
    txtfechaEnvio.value = fechaCompra;
    txtestado.value = estado;
    modalCompraver.showModal();

});

if (btn_cancelarcompraver) {
    btn_cancelarcompraver.addEventListener("click", (e) => {
        e.preventDefault();
        modalCompraver.close();
    });
}