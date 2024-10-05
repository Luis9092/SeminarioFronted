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


@app.route("/agregarProducto", methods=["POST"])
def AgregarProducto():
    nombreproducto = request.form["nombreproducto"]
    file = request.files["imagenProducto"]
    txtprecio = request.form["txtprecio"]
    txtproveedor = request.form["txtProveedor"]
    txtcategoria = request.form["txtcategoria"]
    txtdescripcion = request.form["txtdescripcion"]
    nombre = file.filename
    pro = Producto()
    respuesta = {"mensaje": "Por favor revisar los datos.", "estado": 0}
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

    return json.dumps(respuesta)


@app.route("/salir")
def salir():
    session.clear()
    return redirect(url_for("root"))


if __name__ == "__main__":
    app.run(debug=True)
