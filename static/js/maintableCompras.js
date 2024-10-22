//18122022
class DataTable {
    element;
    headers;
    items;
    CopyItems;
    selected;
    pagination;
    numberOfEntries;
    headerButtons;
    constructor(selector, headerButtons) {
        this.element = document.querySelector(selector);
        this.headers = [];
        this.items = [];
        this.pagination = {
            total: 0,
            noItemsPerPage: 0,
            noPages: 0,
            actua: 0,
            pointer: 0,
            diff: 0,
            lastPageBeforeDots: 0,
            noButtonsBeforeDots: 4,
        };
        this.selected = [];
        this.numberOfEntries = 10;
        this.headerButtons = headerButtons;
    }

    parse() {
        const headers = [...this.element.querySelector("thead tr").children];
        const trs = [...this.element.querySelector("tbody").children];
        headers.forEach((element) => {
            this.headers.push(element.textContent);
        });
        // console.log(this.headers);  SELECCIONAOD TODOS LOS DATOS

        trs.forEach((tr) => {
            const cells = [...tr.children];
            const item = {
                id: this.generateUUUID(),
                values: [],
            };
            cells.forEach((cell) => {
                if (cell.children.length > 0) {
                    const statusElement = [...cell.children][0];
                    const status = statusElement.getAttribute("class");
                    if (status != null) {
                        item.values.push(`<span class='${status}'></span>`);
                    }
                } else {
                    item.values.push(cell.textContent);
                }
            });
            this.items.push(item);
        });
        // console.log(this.items) Items;
        this.makeTable();
    }

    makeTable() {
        this.CopyItems = [...this.items];
        this.initPagination(this.items.length, this.numberOfEntries);
        const container = document.createElement("div");
        container.id = this.element.id;
        this.element.innerHTML = "";
        this.element.replaceWith(container);
        this.element = container;
        this.createHTML();
        this.renderHeaders();
        this.renderRows();
        this.renderPagesButtons();
        this.renderHeaderButtons();
        this.renderSearch();

        this.renderSelectEntries();
        // this.sizeInput();
    }

    initPagination(total, entries) {
        this.pagination.total = total;
        this.pagination.noItemsPerPage = entries;
        this.pagination.noPages = Math.ceil(
            this.pagination.total / this.pagination.noItemsPerPage
        );
        this.pagination.actua = 1;
        this.pagination.pointer = 0;
        this.pagination.diff =
            this.pagination.noItemsPerPage -
            (this.pagination.total % this.pagination.noItemsPerPage);
    }

    generateUUUID() {
        return (Date.now() * Math.floor(Math.random() * 100000)).toString();
    }
    //
    createHTML() {
        this.element.innerHTML = `
    <div class="datatable-container">
        
    <div class="header-tools">
    
    <div class="tools">
    <ul class="header-buttons-container">  </ul>
    </div>
    
 
    <div class="search">
   <i class='bx bx-search-alt' ></i>
    <input type="text"  placeholder="Buscar Producto"  class="search-input" >
</div>
    </div>
    <div class="table-section">
    <table class="datatable">
    <thead>
    <tr>
    </tr>
    </thead>
    <tbody>
    </tbody>
    
    </table>
    </div>
    <div class="footer-tools" >
    <div class="list-items">
    Ver
    <select name="n-entries" id="n-enties" class="n-entries">
    </select>
    
    </div>
    
    <div class="pages"></div>
    
    
    </div>
    
    
    </div>
    `;
    }

    renderHeaders() {
        this.element.querySelector("thead tr").innerHTML = "";
        this.headers.forEach((header) => {
            this.element.querySelector("thead tr").innerHTML += `<th>${header}</th>`;
        });
    }

    renderRows() {
        this.element.querySelector("tbody").innerHTML = "";
        let i = 0;
        const { pointer, total } = this.pagination;
        const limit = this.pagination.actua * this.pagination.noItemsPerPage;
        for (i = pointer; i < limit; i++) {
            if (i == total) {
                break;
            }

            const { id, values } = this.CopyItems[i];
            const checked = this.isChecked(id);

            let data = "";
            data += `
                <td class="table-checkbox">
                    <input type="checkbox" class="datatable-checkbox" name="check" data-id="${id}" ${checked ? "checked" : ""}/>
                </td>
            `;

            values.forEach((cell) => {
                data += `<td>${cell}</td>`;
            });

            this.element.querySelector("tbody").innerHTML += `<tr>${data}</tr>`;

            const modalAgregarProducto = document.querySelector("#modalAgregarProducto");

            document.querySelectorAll(".datatable-checkbox").forEach((checkbox) => {
                checkbox.addEventListener("click", (e) => {
                    const element = e.target;
                    const id = element.getAttribute("data-id");
                    this.selected = [];

                    $("input:checkbox").on("click", function (e) {
                        let $box = $(this);
                        if ($box.is(":checked")) {
                            let group = "input:checkbox[name='" + $box.attr("name") + "']";
                            $(group).prop("checked", false);
                            $box.prop("checked", true);
                        } else {
                            $box.prop("checked", false);
                        }
                    });

                    if (element.checked) {
                        const item = this.getItem(id);
                        this.selected.push(item);
                        console.log(item);
                        modalAgregarProducto.showModal();
                        this.addform(item.values);
                    } else {
                        this.removeSelected(id);
                    }


                    // this.SearchDisabled();
                });
            });
        }
    }

    isChecked(id) {
        const items = this.selected;
        let res = false;
        if (items.length == 0) {
            return false;
        }

        items.forEach((item) => {
            if (item.id == id) {
                res = true;
            }
        });
        return res;
    }

    getItem(id) {
        const res = this.items.filter((item) => item.id == id);
        if (res.length == 0) {
            return null; //verificar aqui
        }

        return res[0];
    }

    removeSelected(id) {
        const res = this.selected.filter((item) => item.id !== id);
        this.selected = [...res];
    }

    renderPagesButtons() {
        const pagesContainer = this.element.querySelector(".pages");
        let pages = "";
        const buttonsToShow = this.pagination.noButtonsBeforeDots;
        const actualIndex = this.pagination.actua;
        let limI = Math.max(actualIndex - 2, 1);
        let limS = Math.min(actualIndex + 2, this.pagination.noPages);
        const missinButtons = buttonsToShow - (limS - limI);
        if (Math.max(limI - missinButtons, 0)) {
            limI = limI - missinButtons;
        } else if (
            Math.min(limS + missinButtons, this.pagination.noPages) !=
            this.pagination.noPages
        ) {
            limS = limS + missinButtons;
        }

        if (limS < this.pagination.noPages - 2) {
            pages += this.getIteratedButtons(limI, limS);
            pages += "<li>...</li>";
            pages += this.getIteratedButtons(
                this.pagination.noPages - 1,
                this.pagination.noPages
            );
        } else {
            pages += this.getIteratedButtons(limI, this.pagination.noPages);
        }
        pagesContainer.innerHTML = `<ul>${pages}</ul>`;
        this.element.querySelectorAll(".pages li button").forEach((button) => {
            button.addEventListener("click", (e) => {
                this.pagination.actua = parseInt(e.target.getAttribute("data-page"));
                this.pagination.pointer =
                    this.pagination.actua * this.pagination.noItemsPerPage -
                    this.pagination.noItemsPerPage;
                this.renderRows();
                this.renderPagesButtons();
            });
        });
    }

    getIteratedButtons(start, end) {
        let res = "";
        for (let i = start; i <= end; i++) {
            if (i == this.pagination.actua) {
                res += `<li><span class="active">${i}</span></li>`;
            } else {
                res += `<li><button data-page="${i}"> ${i}</button></li>`;
            }
        }
        return res;
    }

    renderHeaderButtons() {
        let html = "";
        const buttonsContainer = this.element.querySelector(
            ".header-buttons-container"
        );
        const headerButtons = this.headerButtons;
        headerButtons.forEach((button) => {
            html += `<li><button id="${button.id}" title="${button.text}" > ${button.icon} </button></li>`;
            // console.log(button.id);
        });
        buttonsContainer.innerHTML = html;
        headerButtons.forEach((button) => {
            document
                .querySelector("#" + button.id)
                .addEventListener("click", button.action);
        });
    }

    renderSearch() {
        this.element
            .querySelector(".search-input")
            .addEventListener("input", (e) => {
                const query = e.target.value.trim().toLowerCase();
                if (query == "") {
                    this.CopyItems = [...this.items];
                    this.initPagination(this.CopyItems.length, this.numberOfEntries);
                    this.renderRows();
                    this.renderPagesButtons();
                    return;
                }

                this.search(query);
                this.initPagination(this.CopyItems.length, this.numberOfEntries);
                this.renderRows();
                this.renderPagesButtons();
                // this.SearchDisabled();

            });

    }

    search(query) {
        let res = [];
        this.CopyItems = [...this.items];
        for (let i = 0; i < this.CopyItems.length; i++) {
            const { id, values } = this.CopyItems[i];
            const row = values;
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                if (cell.toLowerCase().indexOf(query) >= 0) {
                    res.push(this.CopyItems[i]);
                    break;
                }
            }
        }
        this.CopyItems = [...res];

    }

    // SearchDisabled() {
    //   const btn_agregar_cliente = document.querySelector(
    //     "#button-agregar-cliente"
    //   );
    //   const btn_agregar_reporte = document.querySelector(
    //     "#button-agregar-reporte"
    //   );
    //   const btn_actualizar_cliente = document.querySelector(
    //     "#button-actualizar-cliente"
    //   );
    //   const btn_eliminar_cliente = document.querySelector(
    //     "#button-eliminar-cliente"
    //   );
    //   const btn_ver_reporte = document.querySelector("#button-ver-reporte");
    //   if (this.selected.length == 0) {
    //     btn_agregar_cliente.disabled = false;
    //     btn_agregar_reporte.disabled = true;
    //     btn_actualizar_cliente.disabled = true;
    //     btn_ver_reporte.disabled = true;
    //     btn_eliminar_cliente.disabled = true;
    //   } else {
    //     if (this.selected.length == 1) {
    //       btn_agregar_cliente.disabled = true;
    //       btn_agregar_reporte.disabled = false;
    //       btn_actualizar_cliente.disabled = false;
    //       btn_ver_reporte.disabled = false;
    //       btn_eliminar_cliente.disabled = false;
    //     } else {
    //       btn_agregar_cliente.disabled = true;
    //       btn_agregar_reporte.disabled = true;
    //       btn_actualizar_cliente.disabled = true;
    //       btn_ver_reporte.disabled = true;
    //     }
    //   }
    // }

    renderSelectEntries() {
        const select = this.element.querySelector(".n-entries");
        const html = [10, 15].reduce((acc, item) => {
            return (acc += `<option value="${item}" ${this.numberOfEntries === item ? "selected" : ""
                }>${item}</option>`);
        }, "");
        select.innerHTML = html;
        this.element.querySelector(".n-entries").addEventListener("change", (e) => {
            const numberOfEntries = parseInt(e.target.value);
            this.numberOfEntries = numberOfEntries;
            this.initPagination(this.CopyItems.length, this.numberOfEntries);
            this.renderRows();
            this.renderPagesButtons();
            this.renderSearch();
        });
    }

    getSelected() {
        return this.selected;
    }

    add(item) {
        const row = {
            id: this.generateUUUID,
            values: [],
        };
        const status = `<span  class="${item[0]}"></span>`;
        item.shift();
        row.values = [status, ...items];
        this.items = [row, ...this.items];
        this.makeTable();
    }

    addform(data) {
        console.log(data);
        const btnmodificarCarrito = document.querySelector("#btnmodificarCarrito");
        const btnEliminarCarrito = document.querySelector("#btnEliminarCarrito");
        const btnagregarcar = document.querySelector("#btnagregarcar");

        const txtdescripcioncompra = document.querySelector("#txtdescripcioncompra");
        const nombreproductocompra = document.querySelector("#nombreproductocompra");
        const txtpreciocompra = document.querySelector("#txtpreciocompra");
        const verImagencompra = document.querySelector("#verImagencompra");
        const txtidproductoc = document.querySelector("#txtidproductoc");
        const txtnameImagen = document.querySelector("#txtnameImagen");
        const idprov = document.querySelector("#idprov")
        document.querySelector("#txtcantidadcompra").value = 0;
        document.querySelector("#txtsubtotal").value = 0;


        verImagencompra.src = data[8];
        txtdescripcioncompra.value = data[9];
        nombreproductocompra.value = data[2];
        txtpreciocompra.value = data[3];
        txtidproductoc.value = data[0];
        txtnameImagen.value = data[8];
        idprov.value = data[5]

        btnmodificarCarrito.style.display = "none";
        btnEliminarCarrito.style.display = "none";
        btnagregarcar.style.display = "block";

    }
}




const dt = new DataTable("#datatable", [
    {
        id: "button-agregar-cliente",
        text: "Realizar Compra",
        icon: "<i class='bx bxs-cart-add bx-tada' ></i>",
        action: function () {
        },
    },

    {
        id: "btnverProducto",
        text: "Ver producto",
        icon: "<i class='bx bx-show-alt' ></i>",
        action: function () {
        },
    },

    {
        id: "btnAbrirModalCompra",
        text: "Abrir Modal",
        icon: "<i class='bx bx-window-open' ></i>",
        action: function () {
        },
    },


]);

dt.parse();
