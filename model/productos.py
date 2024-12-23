import requests

class Producto():
    def __init__(self) -> None:
        pass
    
    def eliminarImagenResultadoServer(self, image_name):
        api_url = "http://127.0.0.1:8000/eliminarimagenServer"
        url = f"{api_url}/{image_name}"

        try:
            # Realizar la solicitud DELETE
            response = requests.delete(url)

            # Comprobar el código de estado de la respuesta
            if response.status_code != 200:
                return 0
            return 1
        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return 0
        
    def extraer_nombre_imagen(self, url):
        # Dividir la URL por '/' y obtener el último elemento
        nombre_imagen = url.split('/')[-1]
        return nombre_imagen
    
    def eliminarProducto(self,  id, nombreImagen):
        nombre = self.extraer_nombre_imagen(nombreImagen)
        
        api_url = "http://127.0.0.1:8000/eliminarproducto"
        url = f"{api_url}/{id}/{nombre}"
        
        try:
            response = requests.delete(url)
            if response.status_code == 200:
                return 1
            return 0   
        except Exception as e:
            print(f"Ocurrió un error: {e}")
            return 0