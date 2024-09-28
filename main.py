from flask import Flask
from flask import render_template, request, redirect, Response, session, url_for
from model.autenticarse import autenticarse
import json
import requests

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
    return render_template("productos.html", per=per)

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
        session["nombres"] = per["nombres"] +" "+ per["apellidos"]
        print(per)
        respuesta = {"estado": 1, "mensaje": "Autenticacion Encontrada"}
        return json.dumps(respuesta)
    else:
        respuesta = {"estado": 0, "mensaje": "Por Favor Verificar Los Datos"}
        return json.dumps(respuesta)

    # return redirect(url_for("root"))


@app.route("/salir")
def salir():
    session.clear()
    return redirect(url_for("root"))


if __name__ == "__main__":
    app.run(debug=True)
