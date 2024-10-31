const ventanaPerfil = document.querySelector("#ventanaPerfil");
const modalPerfilUser = document.querySelector("#modalPerfilUser");
const btn_salirPerfil = document.querySelector("#btn_salirPerfil");
const btnsalirPerfil = document.querySelector("#btnsalirPerfil");
const txtcontrasenia = document.querySelector("#txtcontrasenia");
const txtrepetircontrasenia = document.querySelector("#txtrepetircontrasenia");
const btncambiarpasss = document.querySelector("#btncambiarpasss");

if (ventanaPerfil) {
    ventanaPerfil.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Hola");
        modalPerfilUser.showModal();
    });
}

if (btn_salirPerfil) {
    btn_salirPerfil.addEventListener("click", (e) => {
        modalPerfilUser.close();
    });
}

if (btnsalirPerfil) {
    btnsalirPerfil.addEventListener("click", (e) => {
        modalPerfilUser.close();
    });
}



const validarContrasenia = (e) => {
    const contrasenia = e.target.value;

    try {

        const longitudMinima = 8;
        const tieneMayuscula = /[A-Z]/.test(contrasenia);
        const tieneMinuscula = /[a-z]/.test(contrasenia);
        const tieneNumero = /[0-9]/.test(contrasenia);
        const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(contrasenia);

        if (contrasenia.length >= longitudMinima &&
            tieneMayuscula &&
            tieneMinuscula &&
            tieneNumero &&
            tieneCaracterEspecial) {

            alert("valido");
        } else {
            alert("no cumple con los requisitos.")
        }
    } catch (error) {
        alert("error en la validacion");
    }
};

// if (txtcontrasenia) {
//     txtcontrasenia.addEventListener("onchange", (e) =>
//         validarContrasenia(e)
//     );
// }

// if (txtrepetircontrasenia) {
//     txtrepetircontrasenia.addEventListener("onchange", (e) =>
//         validarContrasenia(e)
//     );
// }

if (btncambiarpasss) {
    btncambiarpasss.addEventListener("click", (e) => {
        e.preventDefault();
        const contrasenia = txtcontrasenia.value;
        const contra1 = txtcontrasenia.value;
        const contra2 = txtrepetircontrasenia.value;
        console.log(contra1);
        console.log(contra2);
        try {

            const longitudMinima = 8;
            const tieneMayuscula = /[A-Z]/.test(contrasenia);
            const tieneMinuscula = /[a-z]/.test(contrasenia);
            const tieneNumero = /[0-9]/.test(contrasenia);
            const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(contrasenia);

            if (contrasenia.length >= longitudMinima &&
                tieneMayuscula &&
                tieneMinuscula &&
                tieneNumero &&
                tieneCaracterEspecial && contra1 != "", contra2 != "" && contra1 === contra2) {
                alerta22("Correcto", "Contrasenia Valida");
                notificarProcesoCambiuoPass("modificar");
            } else {
                alerta22("Error", "El tamanio minimo es de 8 caracteres, tiene que tener mayuscula, numeros, caracter especial y minusculas. Tienen que coincidir ambas contrasenias.")
            }

        } catch (error) {
            alerta22("Error", "Error en la validacion de contrasenias");
        }


    });
}


function notificarProcesoCambiuoPass(valor) {
    Swal.fire({
        target: document.querySelector("#modalPerfilUser"),
        title: `Desea ${valor} la contrasenia?`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0080ff",
        cancelButtonColor: "#D2122E",
        cancelButtonText: "Cancelar",
        confirmButtonText: `Si, ${valor}`,
    }).then((result) => {
        if (result.isConfirmed) {
            enviarformCambiarpass(valor);
        }
    });
}


function enviarformCambiarpass(valor) {

    let formpass = $("#formOperacionespass");
    formpass.submit(function (e) {
        e.preventDefault();

        $.ajax({
            type: formpass.attr("method"),
            url: formpass.attr("action") + "/" + valor,
            data: new FormData(this),
            processData: false,
            contentType: false,
            success: function (response) {
                const respuesta = JSON.parse(response);

                modalPerfilUser.close();

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
                        window.location.reload();
                    });
                }
            },
            error: function (error) {
                alert(error);
            },
        });
    });
    formpass.trigger("submit");
}



function alerta22(titulo, mensaje) {
    Swal.fire({
        target: document.querySelector("#modalPerfilUser"),

        title: titulo,
        text: mensaje,
        icon: "info",
        showConfirmButton: true,
    });
}

