const allSideMenu = document.querySelectorAll("#sidebar .side-menu li a");


let opcion = document.querySelectorAll(".opcion");

let abrirMenu = document.querySelectorAll(".abrir");

opcion.forEach(item => {
  let ala = item.id;

  item.addEventListener("click", (e) => {
    let valor = e.target;
    let elemento = e.target.parentNode;
    localStorage.setItem("ula", ala);

    if (elemento.children[1]) {
      elemento.children[1].classList.toggle("activo");
    }
  });
});

let getul = localStorage.getItem("ula");
if (getul && getul.length > 0) {
  let variable = "#" + getul;
  let casa = document.querySelectorAll(variable);
  casa.forEach(function (item) {
    item.classList.toggle("activo");
  });
}

//VER POR AQUI, ENVIAR SOLO UNA VARIABLE Y ACTIVAR SOLO UNA, LA QUE SE LE DIO CLICK
allSideMenu.forEach((item) => {
  const li = item.parentElement;
  
  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });

    localStorage.setItem("lia", li.id);
    li.classList.add("active");
  });
});

let get_lia = localStorage.getItem("lia");
if (get_lia.length != 0) {
  let variable = "#" + get_lia;
  document.querySelector(variable).classList.add("active");
}


// allSideMenu.forEach(item => {
//   const li = item.parentElement;
//   item.addEventListener('click', function () {
//     allSideMenu.forEach(i => {
//       i.parentElement.classList.remove('active');
//     })
//     //ELEMENTO EN EL CUAL SE ENCUENTRA
//     li.classList.add('active');
//   })
// });


const body = document.querySelector("body");
const sidebar_toggle = body.querySelector("#content nav .bx.bx-menu");
const modeToggle = body.querySelector("#switch-mode");
const sidebar = body.querySelector("#sidebar");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.toggle("dark");
}
let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
});

sidebar_toggle.addEventListener("click", () => {
  sidebar.classList.toggle("hide");
  if (sidebar.classList.contains("close")) {
    localStorage.setItem("status", "close");
  } else {
    localStorage.setItem("status", "open");
  }
});