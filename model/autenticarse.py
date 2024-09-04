import requests
from flask import session
import json


class autenticarse:
    def __init__(self) -> None:
        pass

    def autenticarusuario(self, email, pasw):
        url = "http://127.0.0.1:8000/api/inventario/log/<correol><pasw>"
        parametros = {"correol": email, "pasw": pasw}
        x = requests.get(url, parametros)
        response = {}
        if x.status_code == 200:
            data = x.json()
            session["nombres"] = data["nombres"]
            session["apellidos"] = data["apellidos"]
            m = data["pintarMenu"]
            print(m)
            response = {"status": 200, "estado": 1, "mensaje": m}
        else:
            response = {
                "status": 400,
                "estado": 0,
                "mensaje": "Las credenciales no son correctas!!",
            }
        return response

    def crearCuenta(self, nombres, apellidos, correo, pasw):
        url = "http://127.0.0.1:8000/crearUsuario"
        response = {}
        parametros = {
            "id": 0,
            "nombres": str(nombres),
            "apellidos": str(apellidos),
            "correo": str(correo),
            "password": str(pasw),
            "fecha": "",
            "idrol": 0,
            "menu": "",
        }
        retorno = requests.post(url, data=json.dumps(parametros))

        if retorno.status_code == 201:
            response = {"estado": 1, "mensaje": "Usuario Creado Correctamente"}
        else:
            response = {"estado": 0, "mensaje": "Por Favor Verificar Los Datos"}
        return response

    # def crearCliente(self):
    #     url = 'http://127.0.0.1:8000/api/agregarcliente'
    #     response = {}
    #     parametros = {
    #         "idcliente": 0,
    #         "nombres": str(self.nombres),
    #         "apellidos": str(self.apellidos),
    #         "nit": str(self.nit),
    #         "genero": int(self.genero),s
    #         "fecha_ingreso": "f",
    #         "correo": str(self.correo),
    #         "fecha_modificacion": "f",
    #        }

    #     x = requests.post(url, data=json.dumps(parametros))
    #     if x.status_code == 201:
    #         response = {"estado": 1, "mensaje": "Cliente agregado correctamente!!"}
    #     else:
    #         response = {"estado": 0, "mensaje": "Porfavor verificar los datos"}

    #     return response
