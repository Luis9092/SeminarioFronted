//18122022
/* global Swal */
const txtCorreoUsuario = document.querySelector("#txtCorreoUsuario");
const txtPassword = document.querySelector("#txtPassword");
const eye_show = document.querySelector("#eye-show");
const eye_hide = document.querySelector("#eye-hide");

let Ifacebook = "",
  Itwitter = "",
  Iinstragram = "";
eye_show.onclick = () => {
  if (txtPassword.type === "password") {
    txtPassword.type = "text";
    eye_show.classList.replace("show", "hide");
    eye_hide.classList.replace("hide", "show");
  }
};

eye_hide.onclick = () => {
  if (txtPassword.type === "text") {
    txtPassword.type = "password";
    eye_show.classList.replace("hide", "show");
    eye_hide.classList.replace("show", "hide");
  }
};

let verificar_input = {
  txtCorreoUsuario: true,
  txtPassword: true,
};

document.querySelector("#accion").addEventListener("click", (e) => {
  e.preventDefault();
  EnviarDatos();
});

window.addEventListener("load", () => {
  let txtfrase = document.querySelector("#txt_frase");
  txtfrase.innerHTML =
    "He aprendido que la verdadera lucha no es contra los demás, sino contra uno mismo. Las cosas deben continuar, incluso en la derrota; nada se obtiene sin esfuerzo. Tienes que tener disciplina y paciencia";
});

let timerInterval;
function EnviarDatos() {
  submitController();
}

function ValidacionLogin(icono, color, mensaje) {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    iconColor: color,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: icono,
    title:
      "<h5 style='color:" + color + "; font-size:15px;' >" + mensaje + "</h5>",
  }).then(function () {
    // window.location.replace("Modulos?modulo=dashboard");
  });
}
txtCorreoUsuario.addEventListener("input", (e) => validatefieldWhite(e));
txtPassword.addEventListener("input", (e) => validatefieldWhite(e));
txtCorreoUsuario.addEventListener("change", (e) => validateEmailB(e));

const validatefieldWhite = (e) => {
  const fieldValue = e.target.value;
  const field_id = e.target.id;
  if (fieldValue.trim().length === 0) {
    verificar_input[field_id] = true;
  } else {
    verificar_input[field_id] = false;
  }
};

const validateEmailB = (e) => {
  const fieldValue = e.target.value;
  const field_id = e.target.id;
  const regex = new RegExp("^(.*)@(gmail|googlemail|(.*.)google).com");

  if (fieldValue.trim().length === 0) {
    verificar_input[field_id] = true;
    ValidacionLogin("warning", "#FF0000", "Por favor llenar el formulario*");
  } else if (!regex.test(fieldValue)) {
    verificar_input[field_id] = true;
    ValidacionLogin("warning", "#FF0000", "Tiene que ser una direccion de correo valida*");
  } else {
    verificar_input[field_id] = false;
  }
};


submitController = () => {
  if (verificar_input.txtCorreoUsuario || verificar_input.txtPassword) {
    ValidacionLogin("warning", "#FF0000", "Por favor llenar los campos correctamente*");
  } else {
    Swal.fire({
      title: '<h5 style="color:#08bb40; " >Creando Cuenta...</h5>',
      html: "Enviando datos en <b></b>.",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft();
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        EnviarData();
      }
    });
  }
};


let frmModPass = $("#frm_crearUser");

function EnviarData() {
  $.ajax({
    type: frmModPass.attr("method"),
    url: "/crearUsuario",
    data: frmModPass.serialize(),
    success: function (response) {
      const respuesta = JSON.parse(response);

      if (respuesta.estado == 0) {
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          iconColor: "#ff0e1d",
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "warning",
          title:
            "<h5 style='color:#ff0044; font-size:15px;'>Formulario Llenado incorrectamente</h5>",
        });
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          iconColor: "#08bb40",
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title:
            "<h5 style='font-size:15px;' >Usuario Creado Correctamente</h5>",
        }).then(function () {
          window.location.replace("/");
          // alert("Ha entrado");
        });
      }
    },
    error: function (error) {
      alert(error);
    },
  });
}
