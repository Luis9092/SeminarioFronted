const btnAgregarProveedor = document.querySelector("#btnAgregarProveedor");
const modalProveedores = document.querySelector("#modalProveedores");
const btn_cancelarProveedor = document.querySelector("#btn_cancelarProveedor");
const $modalActualizar = $('#modalActualizarProveedor');
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
            url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
        },
        scrollY: true,
        scrollX: true,
    });
    
});


$(document).ready(function() {
    // Evento de clic para el botón de enviar proveedor
    $('#btnenviarProveedor').on('click', function() {
        // Recopilar los datos del formulario
        const proveedorData = {
            id: 1,
            nombre: $('#nombre').val(),
            telefono: $('#telefono').val(),
            email: $('#email').val()
        };

        // Validación simple (puedes hacerla más robusta si lo necesitas)
        if (!proveedorData.nombre || !proveedorData.telefono || !proveedorData.email) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        // Mostrar un alert con los datos que se van a enviar
        alert(`Datos a enviar:\nNombre: ${proveedorData.nombre}\nTeléfono: ${proveedorData.telefono}\nEmail: ${proveedorData.email}`);

        // Enviar los datos al endpoint usando AJAX
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8000/crearProveedor",  // El endpoint de tu API
            contentType: "application/json",
            data: JSON.stringify(proveedorData),  // Convertir los datos en JSON
            success: function(response) {
                alert("Proveedor agregado exitosamente");
                // Cierra el modal
                $('#modalProveedores')[0].close();
                // Aquí puedes agregar código para actualizar la lista de proveedores en la interfaz si es necesario
            },
            error: function(xhr, status, error) {
                alert("Ocurrió un error al agregar el proveedor. Inténtalo de nuevo.");
            }
        });
    });

    // Evento para cancelar y cerrar el modal
    $('#btn_cancelarProveedor').on('click', function() {
        $('#modalProveedores')[0].close();  // Cerrar el modal
    });
});



$('.delete-btn').on('click', function() {
    const proveedorId = $(this).data('id');  // Obtener el ID del proveedor

    // Confirmación antes de eliminar
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar el proveedor con ID: ${proveedorId}?`);

    if (!confirmar) {
        return;  // Si el usuario cancela, no hacer nada
    }

    // Hacer la petición AJAX para eliminar el proveedor
    $.ajax({
        type: "DELETE",
        url: `http://127.0.0.1:8000/eliminarProveedor/${proveedorId}`,  // Endpoint del backend
        success: function(response) {
            alert("Proveedor eliminado exitosamente.");

            // Eliminar la fila correspondiente de la tabla sin recargar la página
            $(`tr[data-id="${proveedorId}"]`).remove();
        },
        error: function(xhr, status, error) {
            alert("Ocurrió un error al intentar eliminar el proveedor.");
        }
    });
});




$('.update-btn').on('click', function() {
    const proveedorId = $(this).data('id');
    const proveedorRow = $(`tr[data-id="${proveedorId}"]`);
    
    // Llenar el formulario de actualización con los datos del proveedor
    $('#nombreActualizar').val(proveedorRow.data('nombre'));
    $('#telefonoActualizar').val(proveedorRow.data('telefono'));
    $('#emailActualizar').val(proveedorRow.data('email'));
    $('#proveedorIdActualizar').val(proveedorId);
    
    // Mostrar el modal
    $modalActualizar[0].showModal();
});

// Evento para el botón "Actualizar" dentro del modal
$('#btnActualizarProveedor').on('click', function() {
    const proveedorId = $('#proveedorIdActualizar').val();
    const nombre = $('#nombreActualizar').val();
    const telefono = $('#telefonoActualizar').val();
    const email = $('#emailActualizar').val();

    // Validación básica
    if (!nombre || !telefono || !email) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Hacer la petición AJAX para actualizar el proveedor
    $.ajax({
        type: "PUT",
        url: `http://127.0.0.1:8000/actualizarProveedor/${proveedorId}`,  // Endpoint del backend
        contentType: "application/json",
        data: JSON.stringify({
            id : proveedorId,
            nombre: nombre,
            telefono: telefono,
            email: email
        }),
        success: function(response) {
            alert("Proveedor actualizado exitosamente.");
            
            // Actualizar la fila de la tabla con los nuevos datos
            const proveedorRow = $(`tr[data-id="${proveedorId}"]`);
            proveedorRow.data('nombre', nombre);
            proveedorRow.data('telefono', telefono);
            proveedorRow.data('email', email);
            proveedorRow.find('td:nth-child(2)').text(nombre);
            proveedorRow.find('td:nth-child(3)').text(telefono);
            proveedorRow.find('td:nth-child(4)').text(email);

            // Cerrar el modal
            $modalActualizar[0].close();
        },
        error: function(xhr, status, error) {
            alert("Ocurrió un error al intentar actualizar el proveedor.");
        }
    });
});

// Botón para cancelar y cerrar el modal
$('#btnCancelarActualizar').on('click', function() {
    $modalActualizar[0].close();
});