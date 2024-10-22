import json
import requests


class Cliente:
    def __init__(self) -> None:
        pass

    def constructorCliente(
        self, id, nombres, apellidos, telefono, email, nit, direccion, fechaCreacion
    ):
        self.id = id
        self.nombres = nombres
        self.apellidos = apellidos
        self.telefono = telefono
        self.email = email
        self.nit = nit
        self.direccion = direccion
        self.fechaCreacion = fechaCreacion

    def agregarCliente(self):
        url = "http://127.0.0.1:8000/agregarCliente"
        data = {
            "id": 0,
            "nombres": self.nombres,
            "apellidos": self.apellidos,
            "telefono": self.telefono,
            "email": self.email,
            "nit": self.nit,
            "direccion": self.direccion,
            "fechaCreacion": "",
        }
        respuesta = {
            "mensaje": "Error al agregar el cliente.",
            "estado": 0,
        }

        try:
            response = requests.post(url, data=json.dumps(data))
            if response.status_code == 200:
                respuesta = {
                    "mensaje": "Cliente Agregado Correctamente Al Sistema.",
                    "estado": 1,
                }
                return respuesta

        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return respuesta

    def modificarCliente(self):
        url = "http://127.0.0.1:8000/modificarCliente"
        data = {
            "id": self.id,
            "nombres": self.nombres,
            "apellidos": self.apellidos,
            "telefono": self.telefono,
            "email": self.email,
            "nit": self.nit,
            "direccion": self.direccion,
            "fechaCreacion": "",
        }
        respuesta = {
            "mensaje": "Error al modificar el cliente.",
            "estado": 0,
        }

        try:
            response = requests.put(url, data=json.dumps(data))
            if response.status_code == 200:
                respuesta = {
                    "mensaje": "Cliente Modificado Correctamente en el Sistema.",
                    "estado": 1,
                }
                return respuesta

        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return respuesta

    def eliminarCliente(self):
        url = "http://127.0.0.1:8000/eliminarCliente"
        urlfinal = f"{url}/{self.id}"
        respuesta = {
            "mensaje": "Error al eliminar el cliente.",
            "estado": 0,
        }
        try:
            response = requests.delete(urlfinal)
            if response.status_code == 200:
                respuesta = {
                    "mensaje": "Cliente Eliminado Correctamente.",
                    "estado": 1,
                }
            return respuesta
        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return respuesta
