$(document).ready(function() {
    // Inicializar DataTable
    const table = $('#tableVentas').DataTable();

    // Función para obtener ventas
    function obtenerVentas() {
        $.ajax({
            url: 'http://127.0.0.1:8000/ventas',  // URL del backend
            method: 'GET',
            success: function(data) {
                // Limpiar la tabla actual
                table.clear();
                // Iterar sobre los datos y agregarlos a la tabla
                data.ventas.forEach(venta => {  // Asegúrate de acceder correctamente a la propiedad "ventas"
                    table.row.add([
                        venta.VentaId,
                        venta.ClienteID,
                        venta.FechaVenta,
                        venta.Total,
                        `
                        <button class="btnVerDetalle" data-ventaid="${venta.VentaId}">Ver Detalles</button>
                        <form method="POST" action="/eliminarVenta/${venta.VentaId}">
                            <button type="submit" class="delete-btn">Eliminar</button>
                        </form>
                        `
                    ]).draw();
                });
            },
            error: function(error) {
                console.error("Error al obtener ventas:", error);
            }
        });
    }

    // Llamar a la función para cargar las ventas al inicio
    obtenerVentas();

    // Abrir modal para agregar venta
    $('#btnAgregarVenta').on('click', function() {
        document.getElementById('modalVentas').showModal();
    });

    // Cerrar modal de agregar venta
    $('#btnCancelarVenta').on('click', function() {
        document.getElementById('modalVentas').close();
    });

    // Enviar formulario para agregar venta
    $('#btnEnviarVenta').on('click', function() {
        let formData = {
            ClienteID: $('#cliente_id').val(),
            FechaVenta: $('#fecha_venta').val(),
            Total: $('#total').val(),
            Detalles: []
        };

        // Validación básica
        if (!formData.ClienteID || !formData.FechaVenta || !formData.Total) {
            Swal.fire('Error', 'Por favor completa todos los campos.', 'error');
            return;
        }

        $.ajax({
            url: '/agregarVenta',
            method: 'POST',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(response) {
                Swal.fire('Éxito', 'Venta agregada correctamente.', 'success').then(() => {
                    obtenerVentas();  // Actualizar la tabla al agregar una nueva venta
                    document.getElementById('modalVentas').close();  // Cerrar el modal
                });
            },
            error: function(error) {
                Swal.fire('Error', 'Hubo un problema al agregar la venta.', 'error');
                console.error(error);
            }
        });
    });

    // Manejar eliminación de ventas
    $(document).on('click', '.delete-btn', function(event) {
        event.preventDefault();
        let ventaId = $(this).closest('form').attr('action').split('/').pop();

        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede revertir.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/eliminarVenta/' + ventaId,
                    method: 'POST',
                    success: function(response) {
                        Swal.fire('Eliminado', 'La venta ha sido eliminada.', 'success').then(() => {
                            obtenerVentas();  // Actualizar la tabla después de la eliminación
                        });
                    },
                    error: function(error) {
                        Swal.fire('Error', 'No se pudo eliminar la venta.', 'error');
                        console.error(error);
                    }
                });
            }
        });
    });



    // Manejar eliminación de ventas
    $(document).on('click', '.delete-btn', function(event) {
        event.preventDefault();
        let ventaId = $(this).closest('form').attr('action').split('/').pop();

        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede revertir.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/eliminarVenta/' + ventaId,
                    method: 'POST',
                    success: function(response) {
                        Swal.fire('Eliminado', 'La venta ha sido eliminada.', 'success').then(() => {
                            obtenerVentas();  // Actualizar la tabla después de la eliminación
                        });
                    },
                    error: function(error) {
                        Swal.fire('Error', 'No se pudo eliminar la venta.', 'error');
                        console.error(error);
                    }
                });
            }
        });
    });


    // Ver detalles de la venta
    $(document).on('click', '.btnVerDetalle', function() {
        let ventaId = $(this).data('ventaid');
        window.location.href = '/detalleVenta/' + ventaId;
    });
});
