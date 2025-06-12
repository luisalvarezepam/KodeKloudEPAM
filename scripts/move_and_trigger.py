import logging
import os
import requests
from azure.storage.blob import BlobServiceClient

# Configuración desde variables de entorno o secretos de GitHub
STORAGE_CONNECTION_STRING = os.getenv("STORAGE_CONNECTION_STRING")
CONTAINER_SOURCE = os.getenv("CONTAINER_SOURCE", "kodekloudfile")
CONTAINER_INPUTS = os.getenv("CONTAINER_INPUTS", "kodekloud-inputs")
ARCHIVE_FOLDER = os.getenv("ARCHIVE_FOLDER", "archive")
TRIGGER_URL = os.getenv("TRIGGER_URL")  # URL completa de la Azure Function

# Crear cliente del servicio de blobs
blob_service_client = BlobServiceClient.from_connection_string(STORAGE_CONNECTION_STRING)

def run_my_logic():
    print("Verificando archivos en el contenedor...")
    container_client = blob_service_client.get_container_client(CONTAINER_SOURCE)
    blobs = list(container_client.list_blobs())

    required_files = {"activity_leaderboard.xlsx", "KodeKloud2025Admin.xlsx"}
    found_files = {blob.name for blob in blobs if blob.name in required_files}

    if required_files.issubset(found_files):
        print("Archivos requeridos detectados. Moviendo archivos y llamando a la función...")

        for blob in blobs:
            if blob.name.endswith(".xlsx") or blob.name.endswith(".json"):
                src = container_client.get_blob_client(blob.name)
                dst = container_client.get_blob_client(f"{ARCHIVE_FOLDER}/{blob.name}")
                dst.start_copy_from_url(src.url)
                src.delete_blob()

        dest_container = blob_service_client.get_container_client(CONTAINER_INPUTS)
        for file_name in required_files:
            src = container_client.get_blob_client(f"{ARCHIVE_FOLDER}/{file_name}")
            dst = dest_container.get_blob_client(file_name)
            dst.start_copy_from_url(src.url)

        response = requests.get(TRIGGER_URL)
        print(f"Azure Function ejecutada, status: {response.status_code}")
    else:
        print("Archivos requeridos aún no están presentes.")

if __name__ == "__main__":
    run_my_logic()
