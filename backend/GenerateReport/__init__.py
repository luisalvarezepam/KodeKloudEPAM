import logging
import azure.functions as func
import tempfile
import os
import sys
from .generate_report import generate_report, download_blob_to_file


def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        logging.info("✅ Azure Function 'GenerateReport' triggered")

        with tempfile.TemporaryDirectory() as tmpdir:
            admin_path = os.path.join(tmpdir, "admin.xlsx")
            activity_path = os.path.join(tmpdir, "activity.xlsx")
            output_excel_path = os.path.join(tmpdir, "kodekloud_report.xlsx")
            output_json_path = os.path.join(tmpdir, "kodekloud_data.json")

            # 🔽 Descargar archivos desde Blob
            download_blob_to_file("kodekloud-inputs", "KodeKloud2025Admin.xlsx", admin_path)
            download_blob_to_file("kodekloud-inputs", "activity_leaderboard.xlsx", activity_path)

            # 🧠 Generar reporte y subir JSON al blob
            generate_report(admin_path, activity_path, output_excel_path, output_json_path)
            logging.info("✅ Report generated and JSON uploaded to Blob Storage as 'kodekloud_data.json'")

            # 🔁 Retornar contenido JSON en la respuesta
            with open(output_json_path, "r") as f:
                return func.HttpResponse(f.read(), mimetype="application/json")

    except Exception as e:
        logging.exception("❌ Error while generating the report")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
