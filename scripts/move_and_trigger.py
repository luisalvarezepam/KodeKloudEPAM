import os
import requests
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

# Config
STORAGE_URL = "https://strepamkkeast2.blob.core.windows.net"
SOURCE_CONTAINER = "kodekloudfiles"
DEST_CONTAINER = "kodekloud-inputs"
BACKUP_FOLDER = "backup"
TRIGGER_URL = "https://epamkkgenerator.azurewebsites.net/api/GenerateReport?code=K7rd1y9vc7tF99DktxAC_HuZzHNG_Py_Xz-eOwNY3dQbAzFuIYdn4A=="

credential = DefaultAzureCredential()
blob_service_client = BlobServiceClient(account_url=STORAGE_URL, credential=credential)

def move_old_files():
    dest_client = blob_service_client.get_container_client(DEST_CONTAINER)
    blobs = list(dest_client.list_blobs())

    for blob in blobs:
        if blob.name.endswith(".xlsx") or blob.name.endswith(".json"):
            source_blob = dest_client.get_blob_client(blob.name)
            backup_blob = dest_client.get_blob_client(f"{BACKUP_FOLDER}/{blob.name}")
            backup_blob.start_copy_from_url(source_blob.url)
            source_blob.delete_blob()

def move_new_files():
    source_client = blob_service_client.get_container_client(SOURCE_CONTAINER)
    dest_client = blob_service_client.get_container_client(DEST_CONTAINER)
    required_files = ["activity_leaderboard.xlsx", "KodeKloud2025Admin.xlsx"]

    for filename in required_files:
        source_blob = source_client.get_blob_client(filename)
        dest_blob = dest_client.get_blob_client(filename)
        dest_blob.start_copy_from_url(source_blob.url)
        source_blob.delete_blob()

def call_trigger():
    response = requests.get(TRIGGER_URL)
    print(f"Function response status: {response.status_code}")
    print(response.text)

if __name__ == "__main__":
    move_old_files()
    move_new_files()
    call_trigger()
