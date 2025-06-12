import logging
import os
import requests
from datetime import datetime
from azure.storage.blob import BlobServiceClient
from azure.functions import TimerRequest
import azure.functions as func

# Configuración desde variables de entorno o GitHub Secrets
STORAGE_CONNECTION_STRING = os.getenv("STORAGE_CONNECTION_STRING")
CONTAINER_SOURCE = os.getenv("CONTAINER_SOURCE", "kodekloudfiles")
CONTAINER_INPUTS = os.getenv("CONTAINER_INPUTS", "kodekloud-inputs")
ARCHIVE_FOLDER = os.getenv("ARCHIVE_FOLDER", "archive")
TRIGGER_URL = os.getenv("TRIGGER_URL")  # URL completa de la Azure Function HTTP a invocar

# Crear cliente del servicio de blobs usando la connection string
blob_service_client = BlobServiceClient.from_connection_string(STORAGE_CONNECTION_STRING)

def run_my_logic():
    logging.info("Verificando archivos requeridos en el contenedor fuente...")

    source_container = blob_service_client.get_container_client(CONTAINER_SOURCE)
    input_container = blob_service_client.get_container_client(CONTAINER_INPUTS)
    required_files = {"activity_leaderboard.xlsx", "KodeKloud2025Admin.xlsx"}

    # Validar si los archivos requeridos están en el contenedor fuente
    source_blobs = list(source_container.list_blobs())
    found_files = {blob.name for blob in source_blobs if blob.name in required_files}

    if not required_files.issubset(found_files):
        logging.info("Archivos requeridos aún no están presentes en el contenedor fuente.")
        return

    logging.info("Archivos requeridos detectados. Moviendo archivos existentes en el contenedor de entrada a /backup...")

    # Mover todos los archivos .xlsx y .json de kodekloud-inputs a /backup
    input_blobs = list(input_container.list_blobs())
    for blob in input_blobs:
        if blob.name.endswith(".xlsx") or blob.name.endswith(".json"):
            src_blob = input_container.get_blob_client(blob.name)
            backup_blob = input_container.get_blob_client(f"{ARCHIVE_FOLDER}/{blob.name}")
            backup_blob.start_copy_from_url(src_blob.url)
            src_blob.delete_blob()

    logging.info("Moviendo archivos requeridos al contenedor de entrada...")

    for filename in required_files:
        src_blob = source_container.get_blob_client(filename)
        dst_blob = input_container.get_blob_client(filename)
        dst_blob.start_copy_from_url(src_blob.url)
        src_blob.delete_blob()

    logging.info("Llamando a la Azure Function para generar el reporte...")
    response = requests.get(TRIGGER_URL)
    logging.info(f"Respuesta de la función: {response.status_code} - {response.text}")


@app.timer_trigger(schedule="0 * * * * *", arg_name="mytimer", run_on_startup=False, use_monitor=False)
def main(mytimer: TimerRequest) -> None:
    logging.info(f"Timer triggered at {datetime.utcnow().isoformat()}Z")
    try:
        run_my_logic()
    except Exception as e:
        logging.error(f"Error ejecutando la función: {str(e)}")
