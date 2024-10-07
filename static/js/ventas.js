// ventas.js

$(document).ready(function() {
    // Inicializar DataTable
    $('#tableVentas').DataTable();

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
                    location.reload();
                });
            },
            error: function(error) {
                Swal.fire('Error', 'Hubo un problema al agregar la venta.', 'error');
                console.error(error);
            }
        });
    });

    // Manejar eliminación de ventas
    $('.delete-btn').on('click', function(event) {
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
                            location.reload();
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
    $('.btnVerDetalle').on('click', function() {
        let ventaId = $(this).data('ventaid');
        window.location.href = '/detalleVenta/' + ventaId;
    });
});
