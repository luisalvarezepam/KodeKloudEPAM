import logging
import azure.functions as func
import tempfile
import os
from generate_report import generate_report

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        files = req.files
        admin_file = files.get('admin')
        activity_file = files.get('activity')

        if not admin_file or not activity_file:
            return func.HttpResponse("Missing files. Provide 'admin' and 'activity'.", status_code=400)

        with tempfile.TemporaryDirectory() as tmpdir:
            admin_path = os.path.join(tmpdir, "admin.xlsx")
            activity_path = os.path.join(tmpdir, "activity.xlsx")
            json_path = os.path.join(tmpdir, "kodekloud_data.json")
            excel_path = os.path.join(tmpdir, "kodekloud_report.xlsx")

            admin_file.save(admin_path)
            activity_file.save(activity_path)

            generate_report(admin_path, activity_path, excel_path, json_path)

            with open(json_path, "r") as f:
                return func.HttpResponse(f.read(), mimetype="application/json")

    except Exception as e:
        logging.exception("Error in function")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
