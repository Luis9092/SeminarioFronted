const btnAgregarCliente = document.querySelector("#btnAgregarCliente");
const modalcliente = document.querySelector("#modalcliente");

const btn_cancelarcliente = document.querySelector("#btn_cancelarcliente");



if (btnAgregarCliente) {
    btnAgregarCliente.addEventListener("click", (e) => {
        e.preventDefault();
        modalcliente.showModal();
        // btnActualizarCliente.style.display = "none";
        // btnEliminarCliente.style.display = "none";
        // hidefechac.style.display = "none";
        limpiarFormCliente();
    });
}

if (btn_cancelarcliente) {
    btn_cancelarcliente.addEventListener("click", () => {
        modalcliente.close();
    });
}

const txttotal = document.querySelector("#txttotal");
const txtnombrecliente = document.querySelector("#txtnombrecliente");
const txtapellidoscliente = document.querySelector("#txtapellidoscliente");
const txttelefonoCli = document.querySelector("#txttelefonoCli");
const txtcorreocliente = document.querySelector("#txtcorreocliente");
const txtnit = document.querySelector("#txtnit");
const txtdireccion = document.querySelector("#txtdireccion");

// label ERRORES
const txterrorNombres = document.querySelector("#txterrorNombres");
const txterrorApellidos = document.querySelector("#txterrorApellidos");
const txtfinalphone = document.querySelector("#txtfinalphone");
const errorTelefono = document.querySelector("#errorTelefono");
const txterrorcorreo = document.querySelector("#txterrorcorreo");
const txterrornit = document.querySelector("#txterrornit");
const txterrroDireccion = document.querySelector("#txterrroDireccion");


let erroresvalidar = {
    txtnombrecliente: true,
    txtapellidoscliente: true,
    txttelefonoCli: true,
    txtcorreocliente: true,
    txtnit: true,
    txtdireccion: true,
};

const validatefield = (error, e) => {
    const fieldValue = e.target.value;
    const field_id = e.target.id;

    const regex = new RegExp(
        "^([A-ZÀ-ÅÇ-ÖÙ-Ý][a-zà-åç-öù-ÿ]+(?:[-' ][A-ZÀ-ÅÇ-ÖÙ-Ý][a-zà-åç-öù-ÿ]+)*)$"
    );

    if (fieldValue.trim().length === 0) {
        error.innerHTML = "*Por favor llenar el campo";
        error.style.color = "red";
        erroresvalidar[field_id] = true;

    } else if (!regex.test(fieldValue)) {
        error.style.color = "red";
        error.innerHTML = "*Inicial Mayúscula, solo se permiten letras";
        erroresvalidar[field_id] = true;

    } else {
        error.innerText = "Nombres";
        error.style.color = "var(--dark)";
        erroresvalidar[field_id] = false;

    }
    submitController();
};

if (txtnombrecliente) {
    txtnombrecliente.addEventListener("blur", (e) =>
        validatefield(txterrorNombres, e)
    );
    txtnombrecliente.addEventListener("input", (e) =>
        validatefield(txterrorNombres, e)
    );
}

if (txtapellidoscliente) {
    txtapellidoscliente.addEventListener("blur", (e) =>
        validatefield(txterrorApellidos, e)
    );
    txtapellidoscliente.addEventListener("input", (e) =>
        validatefield(txterrorApellidos, e)
    );
}



    





const validatePhoneNumberI = (TelI, error, phone, e) => {
    const fieldValue = e.target.value;
    const field_id = e.target.id;
    const phone2 = phone.getNumber();
    if (phone.isValidNumber()) {
        error.style.color = "var(--dark)";
        error.innerHTML = "Telefono";
        erroresvalidar[field_id] = false;

    } else if (fieldValue.trim().length === 0) {
        error.innerHTML = "*Por favor llenar el campo";
        error.style.color = "red";
        erroresvalidar[field_id] = true;


    } else {
        error.style.color = "red";
        error.innerText = "Número Invalido";
        erroresvalidar[field_id] = true;
    }
    submitController();
    TelI.value = phone2;
};

if (txttelefonoCli) {

    const phoneInput = window.intlTelInput(txttelefonoCli, {
        preferredCountries: ["gt", "mx", "sv", "hn", "us"],
        utilsScript:
            "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });

    txttelefonoCli.addEventListener("blur", (e) =>
        validatePhoneNumberI(txtfinalphone, errorTelefono, phoneInput, e)
    );

    txttelefonoCli.addEventListener("input", (e) =>
        validatePhoneNumberI(txtfinalphone, errorTelefono, phoneInput, e)
    );

}


const validateEmailB = (error, e) => {
    const fieldValue = e.target.value;
    const regex = new RegExp("^(.*)@(gmail|googlemail|(.*.)google).com");
    const field_id = e.target.id;


    if (fieldValue.trim().length === 0) {
        error.innerHTML = "*Por favor llenar el campo";
        error.style.color = "red";
        erroresvalidar[field_id] = true;

    } else if (!regex.test(fieldValue)) {
        error.innerHTML = "*No cumple como un correo válido.";
        error.style.color = "red";
        erroresvalidar[field_id] = true;

    } else {
        error.style.color = "var(--dark)";
        error.innerText = "Correo";
        erroresvalidar[field_id] = false;

    }
    submitController();
};
const validateNit = (error, e) => {
    const fieldValue = e.target.value;
    const regex = new RegExp(/^\d{8}-[0-9kK]$/);
    const field_id = e.target.id;


    if (fieldValue.trim().length === 0) {
        error.innerHTML = "*Por favor llenar el campo";
        error.style.color = "red";
        erroresvalidar[field_id] = true;

    } else if (!regex.test(fieldValue)) {
        error.innerHTML = "*No cumple como un NIT válido.";
        error.style.color = "red";
        erroresvalidar[field_id] = true;

    } else {
        error.style.color = "var(--dark)";
        error.innerText = "NIT válido";
        erroresvalidar[field_id] = false;

    }

    submitController();
};

const validateDireccion = (error, e) => {
    const fieldValue = e.target.value;
    const field_id = e.target.id;


    if (fieldValue.trim().length === 0) {
        error.innerHTML = "*Por favor llenar el campo";
        error.style.color = "red";
        erroresvalidar[field_id] = true;
    } else {
        error.style.color = "var(--dark)";
        error.innerText = "Direccion";
        erroresvalidar[field_id] = false;
    }

    submitController();
};

if (txtcorreocliente) {
    txtcorreocliente.addEventListener("blur", (e) =>
        validateEmailB(txterrorcorreo, e)
    );
    txtcorreocliente.addEventListener("input", (e) =>
        validateEmailB(txterrorcorreo, e)
    );

}

if (txtnit) {
    txtnit.addEventListener("blur", (e) =>
        validateNit(txterrornit, e));

    txtnit.addEventListener("input", (e) =>
        validateNit(txterrornit, e));
}

if (txtdireccion) {
    txtdireccion.addEventListener("blur", (e) =>
        validateDireccion(txterrroDireccion, e));

    txtdireccion.addEventListener("input", (e) =>
        validateDireccion(txterrroDireccion, e));

}




const btnenviarCliente = document.querySelector("#btnenviarCliente");
const btnActualizarCliente = document.querySelector("#btnActualizarCliente");
const btnEliminarCliente = document.querySelector("#btnEliminarCliente");

submitController = () => {
    if (
        erroresvalidar.txtnombrecliente ||
        erroresvalidar.txtapellidoscliente ||
        erroresvalidar.txttelefonoCli ||
        erroresvalidar.txtcorreocliente ||
        erroresvalidar.txtnit ||
        erroresvalidar.txtdireccion
    ) {
        btnenviarCliente.disabled = true;
        btnActualizarCliente.disabled = true;
        btnEliminarCliente.disabled = true;

    } else {
        btnenviarCliente.disabled = false;
        btnActualizarCliente.disabled = false;
        btnEliminarCliente.disabled = false;
    }

};

let botonCliente = document.getElementsByName("accionCliente");

for (const btn of botonCliente) {
    btn.addEventListener("click", function (e) {
        let valor = this.value;
        alert(valor);
        submitController();

        notificarProcesoCliente(valor);

    });
}


function notificarProcesoCliente(valor) {
    Swal.fire({
        target: document.querySelector("#modalcliente"),
        title: `Desea ${valor} el cliente?`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0080ff",
        cancelButtonColor: "#D2122E",
        cancelButtonText: "Cancelar",
        confirmButtonText: `Si, ${valor}`,
    }).then((result) => {
        if (result.isConfirmed) {
            enviarformCliente(valor);
        }
    });
}


function enviarformCliente(valor) {

    let formProducto = $("#formCliente");

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

                modalcliente.close();

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
                        window.location.replace("/clientes");
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
$(document).ready(function () {
    $("#tableClientes").DataTable({
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
        },
        scrollY: true,
        scrollX: true,
    });
})
const txtfechaCreacionc = document.querySelector("#txtfechaCreacionc");
const hidefechac = document.querySelector("#hidefechac");
const idc = document.querySelector("#txtidCliente");

$("#tableClientes").on("click", "tr td", function (evt) {
    let id, nombres, apellidos, telefono,
        correo,
        nit,
        direccion,
        fechaCreacon;

    target = $(event.target);
    id = target.parent("tr").find("td").eq(0).html();
    nombres = target.parent("tr").find("td").eq(2).html();
    apellidos = target.parent("tr").find("td").eq(3).html();
    telefono = target.parent("tr").find("td").eq(4).html();

    correo = target.parent("tr").find("td").eq(5).html();
    nit = target.parent("tr").find("td").eq(6).html();
    direccion = target.parent("tr").find("td").eq(7).html();
    fechacreacion = target.parent("tr").find("td").eq(8).html();

    idc.value = id;
    txtnombrecliente.value = nombres;
    txtapellidoscliente.value = apellidos;
    txttelefonoCli.value = telefono;
    txtfinalphone.value = telefono;
    txtcorreocliente.value = correo;
    txtnit.value = nit;
    txtdireccion.value = direccion;
    txtfechaCreacionc.value = fechacreacion;



    hidefechac.style.display = "block";
    btnEliminarCliente.style.display = "block";
    btnActualizarCliente.style.display = "block";
    btnenviarCliente.style.display = "none";


    modalcliente.showModal();
});



function limpiarFormCliente() {
    txtnombrecliente.value = "";
    txtapellidoscliente.value = "";
    txttelefonoCli.value = "";
    txtcorreocliente.value = "";
    txtnit.value = "";
    txtdireccion.value = "";
    txtfechaCreacionc.value = "";
    btnEliminarCliente.style.display = "none";
    btnActualizarCliente.style.display = "none";
    btnenviarCliente.style.display = "block";
    hidefechac.style.display = "none";

    txterrorNombres.innerHTML = "Nombres";
    txterrorApellidos.innerHTML = "Apellidos";
    errorTelefono.innerHTML = "Telefono";
    txterrorcorreo.innerHTML = "Correo";
    txterrornit.innerHTML = "NIT";
    txterrroDireccion.innerHTML = "Direccion";

    txterrorNombres.style.color = "var(--dark)";
    txterrorApellidos.style.color = "var(--dark)";
    errorTelefono.style.color = "var(--dark)";
    txterrorcorreo.style.color = "var(--dark)";
    txterrornit.style.color = "var(--dark)";
    txterrroDireccion.style.color = "var(--dark)";
}