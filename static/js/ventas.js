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

    // Manejo de detalles de venta
    let detalles = [];

    $('#btnAgregarDetalle').on('click', function() {
        let detalle = {
            ProductoId: prompt('Ingrese Producto ID'),
            Cantidad: prompt('Ingrese Cantidad'),
            PrecioUnitario: prompt('Ingrese Precio Unitario'),
            EmpleadoId: prompt('Ingrese Empleado ID')
        };

        // Validación básica
        if (!detalle.ProductoId || !detalle.Cantidad || !detalle.PrecioUnitario || !detalle.EmpleadoId) {
            Swal.fire('Error', 'Por favor completa todos los campos de detalle.', 'error');
            return;
        }

        // Agregar el detalle a la tabla
        $('#detallesVenta tbody').append(`
            <tr>
                <td>${detalle.ProductoId}</td>
                <td>${detalle.Cantidad}</td>
                <td>${detalle.PrecioUnitario}</td>
                <td>${detalle.EmpleadoId}</td>
                <td><button class="btn btn-danger btnEliminarDetalle">Eliminar</button></td>
            </tr>
        `);

        // Agregar a la lista de detalles
        detalles.push(detalle);
    });

    // Enviar formulario para agregar venta
    $('#btnEnviarVenta').on('click', function() {
        let formData = {
            ClienteID: $('#cliente_id').val(),
            FechaVenta: $('#fecha_venta').val(),
            Total: $('#total').val(),
            Detalles: detalles
        };

        // Validación básica
        if (!formData.ClienteID || !formData.FechaVenta || !formData.Total || detalles.length === 0) {
            Swal.fire('Error', 'Por favor completa todos los campos.', 'error');
            return;
        }

        $.ajax({
            url: 'http://127.0.0.1:8000/agregarVenta',  // Cambia la URL según tu API
            method: 'POST',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(response) {
                Swal.fire('Éxito', 'Venta agregada correctamente.', 'success').then(() => {
                    obtenerVentas();  // Actualizar la tabla al agregar una nueva venta
                    document.getElementById('modalVentas').close();  // Cerrar el modal
                    detalles = [];  // Limpiar los detalles
                    $('#detallesVenta tbody').empty();  // Limpiar la tabla de detalles
                });
            },
            error: function(error) {
                Swal.fire('Error', 'Hubo un problema al agregar la venta.', 'error');
                console.error(error);
            }
        });
    });

    // Obtener y mostrar las ventas en la tabla
    function obtenerVentas() {
        $.ajax({
            url: 'http://127.0.0.1:8000/ventas',  // Cambia la URL según tu API
            method: 'GET',
            success: function(response) {
                const ventas = response.ventas;
                const tableBody = $('#tableVentas tbody');
                tableBody.empty();  // Limpiar la tabla antes de rellenarla

                ventas.forEach(venta => {
                    tableBody.append(`
                        <tr>
                            <td>${venta.VentaId}</td>
                            <td>${venta.ClienteID}</td>
                            <td>${venta.FechaVenta}</td>
                            <td>${venta.Total}</td>
                            <td>
                                <button class="btn btn-danger btnEliminarVenta">Eliminar</button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function(error) {
                Swal.fire('Error', 'Hubo un problema al obtener las ventas.', 'error');
                console.error(error);
            }
        });
    }

// Función para cargar los clientes en el dropdown
function cargarClientes() {
    $.ajax({
        url: 'http://127.0.0.1:8000/ClienteDropDown',
        method: 'GET',
        success: function(response) {
            console.log("Respuesta de clientes:", response);  // Verifica la respuesta en la consola

            // Limpiar las opciones actuales
            $('#cliente_id').empty();
            $('#cliente_id').append('<option value="">Seleccione un cliente</option>');

            // Verifica si la respuesta tiene la estructura correcta
            if (response.clientes && Array.isArray(response.clientes)) {
                // Iterar sobre los clientes recibidos y agregar opciones al dropdown
                response.clientes.forEach(cliente => {
                    console.log("Agregando cliente:", cliente);  // Mensaje para cada cliente
                    $('#cliente_id').append(`<option value="${cliente.ClienteID}">${cliente.nombre}</option>`);
                });
            } else {
                Swal.fire('Error', 'La respuesta de clientes no es válida.', 'error');
                console.error("Estructura incorrecta:", response);
            }
        },
        error: function(error) {
            Swal.fire('Error', 'Hubo un problema al cargar los clientes.', 'error');
            console.error("Error en la petición AJAX:", error);
        }
    });
}

    // Abrir modal para agregar venta y cargar clientes
    $('#btnAgregarVenta').on('click', function() {
        cargarClientes();  // Llamar a la función para cargar los clientes
        document.getElementById('modalVentas').showModal();
    });

    



    $(document).ready(function() {
        // Función para buscar productos en el backend
        function buscarProductos(query) {
            $.ajax({
                url: `http://127.0.0.1:8000/ProductoDropDown?q=${query}`,
                method: 'GET',
                success: function(response) {
                    mostrarResultados(response.productos);  // Mostrar los productos encontrados
                },
                error: function(error) {
                    console.error('Error al buscar productos:', error);
                }
            });
        }
    
        // Mostrar los productos en el dropdown
        function mostrarResultados(productos) {
            const $resultados = $('#resultados');
            $resultados.empty();  // Limpiar resultados previos
    
            if (productos.length === 0) {
                $resultados.addClass('hidden');  // Ocultar el dropdown si no hay resultados
                return;
            }
    
            productos.forEach(producto => {
                const $item = $(`
                    <div class="product-item" data-id="${producto.id}" data-stock="${producto.cantidad}" data-price="${producto.precio_venta}">
                        <div class="product-name">${producto.nombre}</div>
                        <div class="product-description">${producto.descripcion}</div>
                    </div>
                `);
    
                // Al hacer clic en un producto, llenar el formulario con los detalles del producto
                $item.on('click', function() {
                    const stock = $(this).data('stock');
                    const price = $(this).data('price');
    
                    $('#precio_unitario').val(price);  // Establecer el precio unitario
                    $('#existenciasSeleccionadas').text(`Existencias disponibles: ${stock}`);  // Mostrar existencias
                    $resultados.addClass('hidden');  // Ocultar el dropdown
                });
    
                $resultados.append($item);
            });
    
            $resultados.removeClass('hidden');  // Mostrar el dropdown
        }
    
        // Capturar evento de escritura en el input de búsqueda
        $('#buscarProducto').on('input', function() {
            const query = $(this).val();
    
            if (query.length > 2) {  // Buscar productos solo si el texto tiene más de 2 caracteres
                buscarProductos(query);  // Llamar a la función para buscar productos
            } else if (query.length === 0) {  // Si el input está vacío
                $('#resultados').empty();  // Limpiar los resultados
                $('#resultados').addClass('hidden');  // Ocultar el dropdown
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
