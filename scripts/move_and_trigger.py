import logging
import os
import requests
from datetime import datetime
from azure.storage.blob import BlobServiceClient
from azure.functions import TimerRequest
import azure.functions as func

# Configuración desde variables de entorno o GitHub Secrets
STORAGE_CONNECTION_STRING = os.getenv("STORAGE_CONNECTION_STRING")
CONTAINER_SOURCE = os.getenv("CONTAINER_SOURCE", "kodekloudfile")
CONTAINER_INPUTS = os.getenv("CONTAINER_INPUTS", "kodekloud-inputs")
ARCHIVE_FOLDER = os.getenv("ARCHIVE_FOLDER", "archive")
TRIGGER_URL = os.getenv("TRIGGER_URL")  # URL completa de la Azure Function HTTP a invocar

# Crear cliente del servicio de blobs usando la connection string
blob_service_client = BlobServiceClient.from_connection_string(STORAGE_CONNECTION_STRING)

def run_my_logic():
    logging.info("Verificando archivos en el contenedor...")
    container_client = blob_service_client.get_container_client(CONTAINER_SOURCE)
    blobs = list(container_client.list_blobs())

    # Buscar los archivos requeridos
    required_files = {"activity_leaderboard.xlsx", "KodeKloud2025Admin.xlsx"}
    found_files = {blob.name for blob in blobs if blob.name in required_files}

    if required_files.issubset(found_files):
        logging.info("Archivos requeridos detectados. Ejecutando lógica de movimiento e invocación...")

        # Mover todos los archivos .xlsx y .json a /archive antes de continuar
        for blob in blobs:
            if blob.name.endswith(".xlsx") or blob.name.endswith(".json"):
                source_blob = container_client.get_blob_client(blob.name)
                archive_blob = container_client.get_blob_client(f"{ARCHIVE_FOLDER}/{blob.name}")
                archive_blob.start_copy_from_url(source_blob.url)
                source_blob.delete_blob()

        # Copiar los archivos requeridos desde /archive al contenedor de entrada
        dest_container = blob_service_client.get_container_client(CONTAINER_INPUTS)
        for file_name in required_files:
            archive_blob = container_client.get_blob_client(f"{ARCHIVE_FOLDER}/{file_name}")
            dest_blob = dest_container.get_blob_client(file_name)
            dest_blob.start_copy_from_url(archive_blob.url)

        # Llamar la Azure Function HTTP para generar el reporte
        response = requests.get(TRIGGER_URL)
        logging.info(f"Function trigger HTTP status: {response.status_code}")
    else:
        logging.info("Archivos requeridos aún no están presentes.")


@app.timer_trigger(schedule="0 * * * * *", arg_name="mytimer", run_on_startup=False, use_monitor=False)
def main(mytimer: TimerRequest) -> None:
    logging.info(f"Timer triggered at {datetime.utcnow().isoformat()}Z")
    try:
        run_my_logic()
    except Exception as e:
        logging.error(f"Error ejecutando la función: {str(e)}")
