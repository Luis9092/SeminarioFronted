from flask import Flask
from flask import render_template, request, redirect, Response, session, url_for
from model.autenticarse import autenticarse
import json
import requests
from werkzeug.utils import secure_filename
import os
from model.productos import Producto

at = autenticarse()

app = Flask(__name__)
app.secret_key = "luiscasas12345"


@app.route("/")
def root():
    return render_template("login.html")


@app.route("/dashboard")
def home():
    per = session.get("perfil")
    if "perfil" not in session or not session["perfil"]:
        return redirect(url_for("root"))
    return render_template("index.html", per=per)


@app.route("/crearcuenta")
def crearcuenta():
    return render_template("crearcuenta.html")


@app.route("/productos")
def productos():
    per = session.get("perfil")
    if "perfil" not in session or not session["perfil"]:
        return redirect(url_for("root"))

    url = "http://127.0.0.1:8000/verProductor"

    response = requests.get(url)
    if response.status_code == 200:
        tableProductos = response.json()
        return render_template("productos.html", tableProductos=tableProductos, per=per)

    return render_template("productos.html", tableProductos=[], per=per)


@app.route("/adminuser")
def admin_users():
    per = session.get("perfil")
    if "perfil" not in session or not session["perfil"]:
        return redirect(url_for("root"))
    return render_template("adminuser.html", per=per)


# rutasOperaciones
@app.route("/crearUsuario", methods=["POST"])
def crearUsuario():
    nombres = request.form["txtnombres"]
    apellidos = request.form["txtapellidos"]
    correo = request.form["txtCorreoUsuario"]
    pasw = request.form["txtPassword"]
    retorno = at.crearCuenta(nombres, apellidos, correo, pasw)

    return json.dumps(retorno)


@app.route("/iniciarsesion", methods=["POST"])
def iniciarSesion():
    correo = request.form["txtCorreoUsuario"]
    pasw = request.form["txtPassword"]
    url = "http://127.0.0.1:8000/autenticarUsuario/<correo><pasw>"
    parametros = {"correo": correo, "pasw": pasw}
    retorno = requests.get(url, parametros)
    if retorno.status_code == 200:
        per = retorno.json()
        session["perfil"] = per
        session["nombres"] = per["nombres"] + " " + per["apellidos"]
        print(per)
        respuesta = {"estado": 1, "mensaje": "Autenticacion Encontrada"}
        return json.dumps(respuesta)
    else:
        respuesta = {"estado": 0, "mensaje": "Por Favor Verificar Los Datos"}
        return json.dumps(respuesta)

    # return redirect(url_for("root"))


@app.route("/productosOperaciones/<string:accion>", methods=["POST"])
def productosOperaciones(accion):
    operacion = accion
    nombreproducto = request.form["nombreproducto"]
    file = request.files["imagenProducto"]
    txtprecio = request.form["txtprecio"]
    txtproveedor = request.form["txtProveedor"]
    txtcategoria = request.form["txtcategoria"]
    txtdescripcion = request.form["txtdescripcion"]
    txtid = request.form["txtid"]
    txtnameAnterior = request.form["txtnameAnterior"]

    nombre = file.filename
    pro = Producto()
    respuesta = {"mensaje": "Por favor revisar los datos.", "estado": 0}
    urlActualizar = "http://127.0.0.1:8000/modificarProducto"
    if operacion == "agregar":
        if file:
            filename = secure_filename(file.filename)
            file.save("static/" + filename)
            url = "http://127.0.0.1:8000/agregarProducto"

            # Parámetros a enviar

            # Hacer la solicitud POST con el archivo
            with open("static/" + filename, "rb") as f:
                # Archivo a subir
                files = {"file": f}

                # Hacer la solicitud POST
                response = requests.post(
                    url,
                    files=files,
                    data={
                        "nombre": nombreproducto,
                        "descripcion": txtdescripcion,
                        "precio": float(txtprecio),
                        "proveedorid": int(txtproveedor),
                        "idcategoria": int(txtcategoria),
                    },
                )
                if response.status_code == 200:
                    print("hecho con exito xdxd")
                    respuesta = {
                        "mensaje": "Producto agregado correctamente!!",
                        "estado": 1,
                    }

        ruta = "static/" + nombre
        if os.path.isfile(ruta):
            os.remove(ruta)
        pro.eliminarImagenResultadoServer(nombre)

    if operacion == "actualizar":
        try:
            archivo_temporal = ""
            nombreTemporal = ""
            if file.filename == "":
                nombreTemporal = "empty_file.txt"
                archivo_temporal = "static/" + "empty_file.txt"
                filename = secure_filename("empty_file.txt")
                with open("static/empty_file.txt", "w") as f:
                    pass

            else:
                nombreTemporal = file.filename
                archivo_temporal = "static/" + nombreTemporal
                filename = secure_filename(nombreTemporal)
                file.save("static/" + nombreTemporal)

            with open(archivo_temporal, "rb") as f:

                files = {"file": f}
                response = requests.put(
                    urlActualizar,
                    files=files,
                    data={
                        "nombre": nombreproducto,
                        "descripcion": txtdescripcion,
                        "precio": float(txtprecio),
                        "proveedorid": int(txtproveedor),
                        "idcategoria": int(txtcategoria),
                        "idproducto": int(txtid),
                        "NombreImagen": str(txtnameAnterior),
                    },
                )

                if response.status_code == 200:
                    print("hecho con exito xdxd")
                    respuesta = {
                        "mensaje": "Producto modificado correctamente!!",
                        "estado": 1,
                    }

        except Exception as e:
            print(f"Ocurrió un error: {e}")
            respuesta = {
                "mensaje": "Error al modificar el producto.",
                "estado": 0,
            }
    if operacion == "eliminar":
        retorno = pro.eliminarProducto(id=txtid, nombreImagen=txtnameAnterior)
        print(retorno)
        if retorno == 1:
            respuesta = {
                "mensaje": "Producto Eliminado Correctamente",
                "estado": 1,
            }
        else:
            respuesta = {
                "mensaje": "Por favor verificar el manual de incidencias",
                "estado": 0,
            }

    return json.dumps(respuesta)


# Ver Proveedores
@app.route("/proveedores")
def proveedores():
    per = session.get("perfil")
    if "perfil" not in session or not session["perfil"]:
        return redirect(url_for("root"))

    url = "http://127.0.0.1:8000/verProveedores"
    response = requests.get(url)

    if response.status_code == 200:
        tableProveedores = response.json()
        return render_template(
            "proveedores.html", tableProveedores=tableProveedores, per=per
        )

    return render_template("proveedores.html", tableProveedores=[], per=per)


# Eliminar Proveedor
@app.route("/eliminarProveedor/<int:proveedor_id>", methods=["POST"])
def eliminarProveedor(proveedor_id):
    url = f"http://127.0.0.1:8000/eliminarProveedor/{proveedor_id}"

    response = requests.delete(url)

    if response.status_code == 200:
        return json.dumps(
            {
                "mensaje": f"Proveedor {proveedor_id} eliminado correctamente",
                "estado": 1,
            }
        )
    else:
        return json.dumps({"mensaje": "Error al eliminar el proveedor.", "estado": 0})


@app.route("/ventas")
def ventas():
    per = session.get("perfil")
    if "perfil" not in session or not session["perfil"]:
        return redirect(url_for("root"))

    url = "http://127.0.0.1:8000/obtenerVentas"
    response = requests.get(url)

    if response.status_code == 200:
        tableVentas = response.json()
        return render_template("ventas.html", tableVentas=tableVentas, per=per)

    return render_template("ventas.html", tableVentas=[], per=per)


@app.route("/agregarVenta", methods=["POST"])
def agregarVenta():
    data = request.get_json()

    url = "http://127.0.0.1:8000/crearVenta"
    response = requests.post(url, json=data)

    if response.status_code == 200:
        return json.dumps({"mensaje": "Venta agregada correctamente!", "estado": 1})
    else:
        return json.dumps({"mensaje": "Error al agregar la venta.", "estado": 0})


@app.route("/eliminarVenta/<int:venta_id>", methods=["POST"])
def eliminarVenta(venta_id):
    url = f"http://127.0.0.1:8000/eliminarVenta/{venta_id}"

    response = requests.delete(url)

    if response.status_code == 200:
        return json.dumps(
            {"mensaje": f"Venta {venta_id} eliminada correctamente", "estado": 1}
        )
    else:
        return json.dumps({"mensaje": "Error al eliminar la venta.", "estado": 0})


# Ver Proveedores


# Agregar Proveedor
@app.route("/agregarProveedor", methods=["POST"])
def agregarProveedor():
    nombre = request.form["nombre"]
    telefono = request.form["telefono"]
    email = request.form["email"]

    url = "http://127.0.0.1:8000/crearProveedor"
    data = {"nombre": nombre, "telefono": telefono, "email": email}

    response = requests.post(url, json=data)

    if response.status_code == 200:
        respuesta = {"mensaje": "Proveedor agregado correctamente!", "estado": 1}
    else:
        respuesta = {"mensaje": "Error al agregar proveedor.", "estado": 0}

    return json.dumps(respuesta)


@app.route("/ventas")
def ventasrender():
    per = session.get("perfil")
    if "perfil" not in session or not session["perfil"]:
        return redirect(url_for("root"))
    return render_template("ventas.html", per=per)


@app.route("/compras")
def comprasrender():
    per = session.get("perfil")
    if "perfil" not in session or not session["perfil"]:
        return redirect(url_for("root"))
    return render_template("compras.html", per=per)


@app.route("/salir")
def salir():
    session.clear()
    return redirect(url_for("root"))


if __name__ == "__main__":
    app.run(debug=True)
