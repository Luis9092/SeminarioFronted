import requests

class Venta:
    def __init__(self) -> None:
        pass

    def crearVenta(self, cliente_id, fecha_venta, total, detalles):
        api_url = "http://127.0.0.1:8000/crearVenta"
        payload = {
            "ClienteID": cliente_id,
            "FechaVenta": fecha_venta,
            "Total": total,
            "Detalles": detalles  # Detalles es una lista de diccionarios con la información de los productos
        }

        try:
            response = requests.post(api_url, json=payload)
            if response.status_code != 200:
                return 0  # Error al crear la venta
            return response.json()  # Debería devolver el ID de la venta creada u otra respuesta adecuada
        except Exception as e:
            print(f"Ocurrió un error al crear la venta: {e}")
            return 0

    def obtenerVentaPorId(self, venta_id):
        api_url = f"http://127.0.0.1:8000/obtenerVenta/{venta_id}"

        try:
            response = requests.get(api_url)
            if response.status_code != 200:
                return 0  # Venta no encontrada
            return response.json()  # Retorna los detalles de la venta
        except Exception as e:
            print(f"Ocurrió un error al obtener la venta: {e}")
            return 0

    def actualizarVenta(self, venta_id, cliente_id, fecha_venta, total, detalles):
        api_url = f"http://127.0.0.1:8000/actualizarVenta/{venta_id}"
        payload = {
            "ClienteID": cliente_id,
            "FechaVenta": fecha_venta,
            "Total": total,
            "Detalles": detalles  # Lista de detalles de la venta a actualizar
        }

        try:
            response = requests.put(api_url, json=payload)
            if response.status_code != 200:
                return 0  # Error al actualizar la venta
            return response.json()  # Respuesta exitosa
        except Exception as e:
            print(f"Ocurrió un error al actualizar la venta: {e}")
            return 0

    def eliminarVenta(self, venta_id):
        api_url = f"http://127.0.0.1:8000/eliminarVenta/{venta_id}"

        try:
            response = requests.delete(api_url)
            if response.status_code != 200:
                return 0  # Error al eliminar la venta
            return 1  # Venta eliminada con éxito
        except Exception as e:
            print(f"Ocurrió un error al eliminar la venta: {e}")
            return 0

    def obtenerTodasLasVentas(self):
        api_url = "http://127.0.0.1:8000/obtenerVentas"

        try:
            response = requests.get(api_url)
            if response.status_code != 200:
                return 0  # Error al obtener las ventas
            return response.json()  # Lista de ventas
        except Exception as e:
            print(f"Ocurrió un error al obtener las ventas: {e}")
            return 0
