import requests

class Proveedor():
    def __init__(self) -> None:
        pass

    def eliminarProveedor(self, proveedor_id):
        api_url = "http://127.0.0.1:8000/eliminarProveedor"
        url = f"{api_url}/{proveedor_id}"

        try:
            # Realizar la solicitud DELETE
            response = requests.delete(url)

            # Comprobar el código de estado de la respuesta
            if response.status_code != 200:
                return 0  # Error en la eliminación
            return 1  # Proveedor eliminado con éxito
        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return 0

    def agregarProveedor(self, nombre, telefono, email):
        api_url = "http://127.0.0.1:8000/crearProveedor"
        payload = {
            "nombre": nombre,
            "telefono": telefono,
            "email": email
        }

        try:
            # Realizar la solicitud POST para crear un proveedor
            response = requests.post(api_url, json=payload)

            # Comprobar el código de estado de la respuesta
            if response.status_code != 200:
                return 0  # Error al agregar el proveedor
            return 1  # Proveedor agregado con éxito
        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return 0

    def actualizarProveedor(self, proveedor_id, nombre, telefono, email):
        api_url = f"http://127.0.0.1:8000/actualizarProveedor/{proveedor_id}"
        payload = {
            "nombre": nombre,
            "telefono": telefono,
            "email": email
        }

        try:
            # Realizar la solicitud PUT para actualizar el proveedor
            response = requests.put(api_url, json=payload)

            # Comprobar el código de estado de la respuesta
            if response.status_code != 200:
                return 0  # Error al actualizar el proveedor
            return 1  # Proveedor actualizado con éxito
        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return 0

    def verProveedores(self):
        api_url = "http://127.0.0.1:8000/verProveedores"

        try:
            # Realizar la solicitud GET para obtener proveedores
            response = requests.get(api_url)

            # Comprobar el código de estado de la respuesta
            if response.status_code != 200:
                return 0  # Error al obtener proveedores
            return response.json()  # Lista de proveedores
        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return 0
