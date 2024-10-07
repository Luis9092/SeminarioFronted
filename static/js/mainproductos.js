const btnAgregarProducto = document.querySelector("#btnAgregarProductos");
const modalProductos = document.querySelector("#modalProductos");
const btn_cancelarProducto = document.querySelector("#btn_cancelarProducto");
const btnenviardProducto = document.querySelector("#btnenviardProducto");



// INPUTS
const nombreproducto = document.querySelector("#nombreproducto");
const imagenProducto = document.querySelector("#imagenProducto");
const txtprecio = document.querySelector("#txtprecio");
const txtProveedor = document.querySelector("#txtProveedor");
const txtcategoria = document.querySelector("#txtcategoria");
const txtdescripcion = document.querySelector("#txtdescripcion");
const txtfecha = document.querySelector("#txtfecha");
const verImagen = document.querySelector("#verImagen");
const hideFecha = document.querySelector(".hidefecha");
const txtexistencia = document.querySelector("#txtexistencia");


if (btnAgregarProducto) {
    btnAgregarProducto.addEventListener("click", (e) => {
        limpiarForm();
        modalProductos.showModal();
    })
}

if (btn_cancelarProducto) {
    btn_cancelarProducto.addEventListener("click", (e) => {
        modalProductos.close();


    })
}

function validarArchivo(archivo) {
    const tiposValidos = ['image/jpeg', 'image/png', 'image/jpg'];
    return tiposValidos.includes(archivo.type);
}

// PRIMER PASO VALIDAR LAS ENTRADAS DE ARCHIVOS
const inputarchivoFoto = document.querySelector('#imagenProducto');
let estadoProductoForm = 0;

if (inputarchivoFoto) {
    inputarchivoFoto.addEventListener('change', function () {
        const archivo = this.files[0];
        if (archivo) {
            if (validarArchivo(archivo)) {
                const fileReader = new FileReader();

                fileReader.onload = function (event) {
                    // fotoPerfiluser.src = event.target.result;
                    estadoProductoForm = 1;
                    btnenviardProducto.disabled = false;
                    alertModal("#00dfdf", "Imagen Agregada correctamente!!", "success",)
                };

                fileReader.readAsDataURL(archivo);
            } else {
                estadoProductoForm = 0;
                alertModal("#ff0055", "El archivo no es válido. Debe ser JPG, PNG o JPEG.", "error",)
            }
        }
    });
}

if (btnenviardProducto) {
    btnenviardProducto.addEventListener("click", () => {
        if (estadoProductoForm == 1) {
            EnviarformProducto();
        }
    });
}

let formProducto = $("#formProducto");


function EnviarformProducto() {
    formProducto.submit(function (e) {
        e.preventDefault();

        $.ajax({
            type: formProducto.attr("method"),
            url: formProducto.attr("action"),
            data: new FormData(this),
            processData: false,
            contentType: false,
            success: function (response) {
                const respuesta = JSON.parse(response);
                console.log(respuesta.estado);
                modalProductos.close();

                if (respuesta.estado == 0) {
                    Swal.fire({
                        title: "Error",
                        text: respuesta.mensaje,
                        icon: "error",
                        confirmButtonColor: "#ff004c",
                    }).then(function () {
                        // window.location.replace("/miperfil");
                    });
                } else {
                    Swal.fire({
                        title: "Excelente!!",
                        text: respuesta.mensaje,
                        icon: "success",
                        confirmButtonColor: "#008d49",
                    }).then(function () {
                        window.location.replace("/productos");
                    });
                }
            },
            error: function (error) {
                alert(error);
            },
        });
    });
}

function alertModal(color, mensaje, icon) {

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        iconColor: color,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: icon,
        title: mensaje
    });
}

$(document).ready(function () {
    $("#tableProductos").DataTable({
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
        },
        scrollY: true,
        scrollX: true,
    });
})



$("#tableProductos").on("click", "tr td", function (evt) {
    let id, descripcion, idProveedor, idcategoria,
        nombre,
        precio,
        cantidad,
        precioVenta,
        imagen,
        fechaIngreso;

    target = $(event.target);
    id = target.parent("tr").find("td").eq(0).html();
    descripcion = target.parent("tr").find("td").eq(1).html();
    idProveedor = target.parent("tr").find("td").eq(2).html();
    idcategoria = target.parent("tr").find("td").eq(3).html();

    nombre = target.parent("tr").find("td").eq(5).html();
    precio = target.parent("tr").find("td").eq(6).html();
    cantidad = target.parent("tr").find("td").eq(7).html();
    precioVenta = target.parent("tr").find("td").eq(8).html();
    fechaIngreso = target.parent("tr").find("td").eq(10).html();
    imagen = target.parent("tr").find("td").eq(11).html();

    nombreproducto.value = nombre;
    hideFecha.style.display = "block";
    txtprecio.value = precio; txtProveedor.value = idProveedor; txtcategoria.value = idcategoria; txtdescripcion.value = descripcion;
    txtfecha.value = fechaIngreso;
    verImagen.src = imagen;
    txtexistencia.value = cantidad;
    modalProductos.showModal();
});

function limpiarForm() {
    nombreproducto.value = "";
    hideFecha.style.display = "none";
    txtprecio.value = 0;
    txtProveedor.value = 1;
    txtcategoria.value = 1;
    txtdescripcion.value = "";
    txtexistencia.value = 0;
    verImagen.src = "/static/img/granada.png";
}
