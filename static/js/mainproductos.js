const btnAgregarProducto = document.querySelector("#btnAgregarProductos");
const modalProductos = document.querySelector("#modalProductos");
const btn_cancelarProducto = document.querySelector("#btn_cancelarProducto");
const btnenviardProducto = document.querySelector("#btnenviardProducto");
const btnEliminarProducto = document.querySelector("#btnEliminarProducto");
const btnActualizarProducto = document.querySelector("#btnActualizarProducto");


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
const txtid = document.querySelector("#txtid");
const txtnameAnterior = document.querySelector("#txtnameAnterior");


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
                    verImagen.src = event.target.result;
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


let boton = document.getElementsByName("accion");

for (const btn of boton) {
    btn.addEventListener("click", function (e) {
        let valor = this.value;

        if (valor == "agregar") {
            if (estadoProductoForm == 1) {
                notificarProceso(valor);
            }
        } else {
            notificarProceso(valor);
        }

    });
}

// if (btnenviardProducto) {
//     btnenviardProducto.addEventListener("click", () => {

//     });
// }




function notificarProceso(valor) {
    Swal.fire({
        target: document.querySelector("#modalProductos"),
        title: `Desea ${valor} el producto?`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0080ff",
        cancelButtonColor: "#D2122E",
        cancelButtonText: "Cancelar",
        confirmButtonText: `Si, ${valor}`,
    }).then((result) => {
        if (result.isConfirmed) {
            enviarformProducto(valor);
        }
    });
}


function enviarformProducto(valor) {

    let formProducto = $("#formProducto");

    formProducto.submit(function (e) {
        e.preventDefault();

        $.ajax({
            type: formProducto.attr("method"),
            url: formProducto.attr("action") + "/" + valor,
            data: new FormData(this),
            processData: false,
            contentType: false,
            success: function (response) {
                const respuesta = JSON.parse(response);

                modalProductos.close();

                if (respuesta.estado == 0) {
                    Swal.fire({
                        title: "Error",
                        text: respuesta.mensaje,
                        icon: "error",
                        confirmButtonColor: "#ff004c",
                    }).then(function () {

                    });
                } else {
                    Swal.fire({
                        title: "Excelente!!",
                        text: respuesta.mensaje,
                        icon: "success",
                        confirmButtonColor: "#0080ff",
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
    formProducto.trigger("submit");

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
    valores();
    obtenerVistaProductos();


});



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
    txtid.value = id;
    txtnameAnterior.value = imagen;
    btnEliminarProducto.style.display = "block";
    btnActualizarProducto.style.display = "block";
    btnenviardProducto.style.display = "none";

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
    verImagen.src = "/static/img/ventasimagen.jpg";
    btnEliminarProducto.style.display = "none";
    btnActualizarProducto.style.display = "none";
    btnenviardProducto.style.display = "block";

}

function valores() {
    const tabla = document.getElementById("tableProductos");
    const txtpasivo = document.querySelector("#txtpasivo");
    const txtganancia = document.querySelector("#txtganancia");
    const valores = [];
    let sumdinero = 0;

    if (tabla) { // Verificar si la tabla no es null
        for (let i = 1; i < tabla.rows.length; i++) {
            const can = tabla.rows[i].cells[7].innerText;
            let dinero = tabla.rows[i].cells[6].innerText;
            sumdinero += Number(dinero);

            valores.push(Number(can));
        }

        // Mostrar los valores
        const suma = valores.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
        if (txtpasivo) {
            txtpasivo.innerHTML = suma;
            txtganancia.innerHTML = "Q. " + sumdinero;

        }
    } else {
        // console.error("La tabla no existe.");
        if (txtpasivo) {
            txtpasivo.innerHTML = "0";
            txtganancia.innerHTML = "Q. 0";
        }

    }

}






async function obtenerVistaProductos() {
    let retorno = 0;
    try {
        const response = await axios.get("http://127.0.0.1:8000/vistaproductos", {
        });
        if (response.status === 200) {
            retorno = response.data;
            console.log(retorno);
            pintarChart(retorno);
        }
    } catch (e) {
        console.log(e);
        return 0;
    }
    return retorno;
}


function pintarChart(dias) {
    let diasSemana = [
        { dia: "Monday", cantidad: 0, diam: "Lunes" },
        { dia: "Tuesday", cantidad: 0, diam: "Martes" },
        { dia: "Wednesday", cantidad: 0, diam: "Miercoles" },
        { dia: "Thursday", cantidad: 0, diam: "Jueves" },
        { dia: "Friday", cantidad: 0, diam: "Viernes" },
        { dia: "Saturday", cantidad: 0, diam: "Sabado" },
        { dia: "Sunday", cantidad: 0, diam: "Domingo" }
    ];

    // Crear un objeto para acceder rápidamente a las cantidades
    const cantidades = {};
    dias.forEach(element => {
        cantidades[element.dia] = element.cantidad;
    });

    // Actualizar las cantidades en diasSemana
    diasSemana.forEach(element => {
        element.cantidad = cantidades[element.dia] || 0;
    });

    console.log(diasSemana);
    pintarDatosChart(diasSemana);
}

function pintarDatosChart(diasSemana) {
    let cantidaddias = [];
    let dias = [];

    diasSemana.forEach(element => {
        cantidaddias.push(element.cantidad);
        dias.push(element.diam);

    });

    var options = {
        series: [{
            name: 'Dia',
            type: 'column',
            data: cantidaddias,
        }, {
            name: 'Dia',
            type: 'line',
            data: cantidaddias
        }],
        chart: {
            height: 350,
            type: 'line',
        },
        stroke: {
            width: [0, 4]
        },
        colors: ['#bd6eff', '#00ff97'],

        dataLabels: {
            enabled: true,
            enabledOnSeries: [1]
        },
        labels: dias,
    };
    // var chart = new ApexCharts(document.querySelector("#chart"), options);
    // chart.render();
    var chartjs = document.querySelector("#chart");

    if (chartjs) { // Verificar si chart no es null
        var chart = new ApexCharts(chartjs, options);
        chart.render();
    } else {
        // console.error("El gráfico no se pudo crear.");
    }
}
