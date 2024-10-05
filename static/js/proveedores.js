const btnAgregarProveedor = document.querySelector("#btnAgregarProveedor");
const modalProveedores = document.querySelector("#modalProveedores");
const btn_cancelarProveedor = document.querySelector("#btn_cancelarProveedor");
const btnenviarProveedor = document.querySelector("#btnenviarProveedor");
let estadoProveedorForm = 0;

// Mostrar modal para agregar proveedor
if (btnAgregarProveedor) {
    btnAgregarProveedor.addEventListener("click", () => {
        modalProveedores.showModal();
    });
}

// Cerrar modal al cancelar
if (btn_cancelarProveedor) {
    btn_cancelarProveedor.addEventListener("click", () => {
        modalProveedores.close();
    });
}

// Validación del formulario antes de enviar
btnenviarProveedor.addEventListener("click", () => {
    estadoProveedorForm = validarFormularioProveedor();
    if (estadoProveedorForm == 1) {
        EnviarformProveedor();
    }
});

// Función para validar campos del formulario
function validarFormularioProveedor() {
    const nombre = document.querySelector("#nombre").value;
    const telefono = document.querySelector("#telefono").value;
    const email = document.querySelector("#email").value;

    if (nombre === "" || telefono === "" || email === "") {
        alertModal("#ff0055", "Todos los campos son obligatorios.", "error");
        return 0;
    }

    // Validar que el email tenga formato correcto
    const regexEmail = /\S+@\S+\.\S+/;
    if (!regexEmail.test(email)) {
        alertModal("#ff0055", "El correo electrónico no es válido.", "error");
        return 0;
    }

    alertModal("#00dfdf", "Formulario validado correctamente!!", "success");
    return 1;
}

// Función para enviar el formulario
let formProveedor = $("#formProveedor");

function EnviarformProveedor() {
    formProveedor.submit(function (e) {
        e.preventDefault();

        $.ajax({
            type: formProveedor.attr("method"),
            url: formProveedor.attr("action"),
            data: new FormData(this),
            processData: false,
            contentType: false,
            success: function (response) {
                const respuesta = JSON.parse(response);
                modalProveedores.close();

                if (respuesta.estado == 0) {
                    Swal.fire({
                        title: "Error",
                        text: respuesta.mensaje,
                        icon: "error",
                        confirmButtonColor: "#ff004c",
                    }).then(function () {
                        // Acción en caso de error, opcional
                    });
                } else {
                    Swal.fire({
                        title: "Excelente!!",
                        text: respuesta.mensaje,
                        icon: "success",
                        confirmButtonColor: "#008d49",
                    }).then(function () {
                        window.location.replace("/proveedores");
                    });
                }
            },
            error: function (error) {
                alert("Error en el servidor.");
            },
        });
    });
}

// Función para mostrar alertas con SweetAlert
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
        },
    });

    Toast.fire({
        icon: icon,
        title: mensaje,
    });
}

// Cargar DataTable para mostrar la tabla de proveedores (opcional)
$(document).ready(function () {
    $("#tableProveedores").DataTable({
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
        },
        scrollY: true,
        scrollX: true,
    });
});
