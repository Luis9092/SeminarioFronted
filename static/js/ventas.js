
$(document).ready(function () {
    const modalVentas = document.querySelector("#modalVentas");

    // Inicializar DataTable
    const table = $("#tableVentas").DataTable({
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
        },
        scrollY: true,
        scrollX: true,
        "bDestroy": true
    });

    // Función para obtener ventas
    function obtenerVentas() {
        $.ajax({
            url: 'http://127.0.0.1:8000/ventas',  // URL del backend
            method: 'GET',
            success: function (data) {
                // Limpiar la tabla actual
                table.clear();
                // Iterar sobre los datos y agregarlos a la tabla
                data.ventas.forEach(venta => {
                    table.row.add([
                        venta.VentaId,
                        venta.ClienteID,
                        venta.FechaVenta,
                        venta.Total,
                        `
                        <button class="btnVerDetalle" data-ventaid="${venta.VentaId}">Ver Detalles</button>
                        <form method="POST" action="/eliminarVenta/${venta.VentaId}" class="d-inline">
                            <button type="submit" class="btn btn-danger delete-btn">Eliminar</button>
                        </form>
                        `
                    ]).draw();
                });
            },
            error: function (error) {
                console.error("Error al obtener ventas:", error);
            }
        });
    }

    // Llamar a la función para cargar las ventas al inicio
    obtenerVentas();

    // Cargar clientes en el dropdown
    function cargarClientes() {
        $.ajax({
            url: 'http://127.0.0.1:8000/ClienteDropDown',
            method: 'GET',
            success: function (response) {
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
            error: function (error) {
                Swal.fire('Error', 'Hubo un problema al cargar los clientes.', 'error');
                console.error("Error en la petición AJAX:", error);
            }
        });
    }

    // Abrir modal para agregar venta y cargar clientes
    $('#btnAgregarVenta').on('click', function () {
        cargarClientes();  // Llamar a la función para cargar los clientes
        document.getElementById('modalVentas').showModal();
    });

    // Botón para cancelar (cerrar modal)
    $('#btnCancelarVenta').on('click', function () {
        document.getElementById('modalVentas').close();
    });


    // Función para buscar productos en el backend
    let carrito = [];
    function buscarProductos(query) {
        $.ajax({
            url: `http://127.0.0.1:8000/ProductoDropDown?q=${query}`,
            method: 'GET',
            success: function (response) {
                mostrarResultados(response.productos);  // Mostrar los productos encontrados
            },
            error: function (error) {
                console.error('Error al buscar productos:', error);
            }
        });
    }

    // Mostrar los productos en el dropdown
    // Función para mostrar los resultados de la búsqueda
    function mostrarResultados(productos) {
        const $resultados = $('#resultados');
        $resultados.empty();  // Limpiar resultados previos

        const txtexistencias = document.querySelector("#txtexistencias");
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
            $item.on('click', function () {
                const stock = $(this).data('stock');
                const price = $(this).data('price');
                const nombreProducto = $(this).find('.product-name').text(); // Obtén el nombre completo del producto

                $('#buscarProducto').val(nombreProducto);  // Establecer el nombre completo en el campo de búsqueda
                $('#precio_unitario').val(price);  // Establecer el precio unitario
                // $('#existenciasSeleccionadas').text(`Existencias disponibles: ${stock}`);  // Mostrar existencias
                txtexistencias.value = stock;
                $('#producto-id').val($(this).data('id'));  // Establecer el ID del producto
                $resultados.addClass('hidden');  // Ocultar el dropdown
            });

            $resultados.append($item);
        });

        $resultados.removeClass('hidden');  // Mostrar el dropdown
    }

    // Capturar evento de escritura en el input de búsqueda
    $('#buscarProducto').on('input', function () {
        const query = $(this).val();

        if (query.length > 2) {  // Buscar productos solo si el texto tiene más de 2 caracteres
            buscarProductos(query);  // Llamar a la función para buscar productos
        } else if (query.length === 0) {  // Si el input está vacío
            $('#resultados').empty();  // Limpiar los resultados
            $('#resultados').addClass('hidden');  // Ocultar el dropdown
        }
    });

    // Función para agregar productos al carrito
    // Función para agregar productos al carrito
    $('#btnAgregarDetalle').on('click', function () {
        const nombreProducto = $('#buscarProducto').val(); // Nombre del producto ahora será el completo desde el dropdown
        const cantidad = parseInt($('#cantidad').val());
        const precioUnitario = parseFloat($('#precio_unitario').val());
        const productoId = $('#producto-id').val(); // Asegúrate de que el ID coincida con el campo HTML

        // Validar los datos antes de agregar al carrito
        if (!nombreProducto || cantidad <= 0 || isNaN(precioUnitario) || !productoId) {
            alert("Por favor, selecciona un producto y una cantidad válida.");
            return;
        }

        const subtotal = cantidad * precioUnitario;
        const txtexistencias = document.querySelector("#txtexistencias").value;
        // Agregar producto al carrito
        if (txtexistencias != 0 || cantidad <= txtexistencias) {
            carrito.push({
                productoId: productoId, // Aquí aseguramos que el ProductoId se incluya correctamente
                nombre: nombreProducto,  // Nombre del producto seleccionado
                cantidad,
                precioUnitario,
                subtotal
            });
        }


        // Actualizar la tabla del carrito
        actualizarCarrito();
    });






    // Función para actualizar la tabla del carrito
    function actualizarCarrito() {
        const $carritoBody = $('#carrito-body');
        $carritoBody.empty();  // Limpiar el cuerpo de la tabla
        let totalGeneral = 0;  // Inicializar total general

        carrito.forEach((item, index) => {
            // Agregar el ProductoId como un atributo data-producto-id
            const $row = $(`
                <tr data-producto-id="${item.productoId}">
                    <td>${item.nombre}</td>
                    <td>${item.cantidad}</td>
                    <td>$${item.precioUnitario.toFixed(2)}</td>
                    <td>$${item.subtotal.toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-eliminar" data-index="${index}">Eliminar</button></td>
                </tr>
            `);
            $carritoBody.append($row);
            totalGeneral += item.subtotal;  // Sumar el subtotal al total general
        });

        $('#total').val(totalGeneral.toFixed(2)); // Actualizar el total

        // Agregar evento para eliminar productos del carrito
        $('.btn-eliminar').on('click', function () {
            const index = $(this).data('index');
            carrito.splice(index, 1); // Eliminar producto del carrito
            actualizarCarrito(); // Actualizar la tabla del carrito
        });
    }








    // Función para realizar la venta
    // Evento de clic para el botón de enviar venta
    $('#btnEnviarVenta').off('click').on('click', function () {
        event.preventDefault(); // Prevenir el comportamiento por defecto del botón
        console.log("Botón de enviar venta presionado."); // Depuración

        const clienteId = $('#cliente_id').val();
        console.log("Cliente seleccionado:", clienteId); // Depuración

        if (!clienteId) {
            alert("Por favor, selecciona un cliente.");
            return;
        }

        // Validar que el carrito no esté vacío
        if ($('#carrito-body tr').length === 0) {
            alert("El carrito está vacío. Agrega productos antes de realizar la venta.");
            return;
        }

        // Crear objeto con los datos de la venta
        const ventaData = {
            ClienteID: clienteId,
            FechaVenta: $('#fecha_venta').val(),
            Total: parseFloat($('#total').val()), // Obtener el total directamente del campo
            Detalles: []
        };

        alert("Datos de venta a enviar: " + JSON.stringify(ventaData)); // Depuración
        console.log("Datos de venta: ", ventaData);
        // Iterar sobre el carrito y llenar el objeto ventaData
        $('#carrito-body tr').each(function () {
            const productoId = $(this).data('producto-id'); // Tomar el ProductoId desde el atributo data
            const cantidad = parseInt($(this).find('td:nth-child(2)').text()); // Cantidad
            const precioUnitario = parseFloat($(this).find('td:nth-child(3)').text().replace('$', '')); // Eliminar el signo de $ para convertir

            // Asegurarnos de que ambos valores sean válidos
            if (productoId && precioUnitario) {
                ventaData.Detalles.push({
                    ProductoId: productoId,
                    Cantidad: cantidad,
                    PrecioUnitario: precioUnitario
                });
            } else {
                console.error("Datos faltantes o inválidos: ProductoId o PrecioUnitario no son válidos.");
            }
        });

        console.log("Detalles de la venta:", ventaData.Detalles); // Depuración
        alert("Datos de venta a enviar: " + JSON.stringify(ventaData.Detalles)); // Depuración
        // Enviar los datos al servidor para crear la venta
        fetch('http://127.0.0.1:8000/crearVenta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Respuesta del servidor:", data); // Depuració
                modalVentas.close();
                Swal.fire('Éxito', 'Venta realizada correctamente.', 'success').then(() => {

                    $('#carrito-body').empty(); // Limpiar el carrito en la tabla
                    document.getElementById('modalVentas').close(); // Cerrar el modal
                    $('#total').val(''); // Opcional: limpiar el campo de total
                });
            })
            .catch(error => {
                console.error("Error en la petición:", error);
                Swal.fire('Error', 'Hubo un problema al realizar la venta.', 'error');
            });
    });








    // Manejar eliminación de ventas
    $(document).on('click', '.delete-btn', function (event) {
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
                    success: function (response) {
                        Swal.fire('Eliminado', 'La venta ha sido eliminada.', 'success').then(() => {
                            obtenerVentas();  // Actualizar la tabla después de la eliminación
                        });
                    },
                    error: function (error) {
                        Swal.fire('Error', 'No se pudo eliminar la venta.', 'error');
                        console.error(error);
                    }
                });
            }
        });
    });

    // Ver detalles de la venta
    $(document).on('click', '.btnVerDetalle', function () {
        let ventaId = $(this).data('ventaid');
        window.location.href = '/detalleVenta/' + ventaId;
    });
});
