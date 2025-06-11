import base64
import json
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    principal_encoded = req.headers.get("x-ms-client-principal")
    if not principal_encoded:
        return func.HttpResponse(
            "Unauthorized: missing client principal",
            status_code=401
        )

    # Decodificar el token base64
    try:
        principal_decoded = base64.b64decode(principal_encoded).decode("utf-8")
        principal = json.loads(principal_decoded)
    except Exception as e:
        return func.HttpResponse(
            f"Error decoding principal: {str(e)}",
            status_code=400
        )

    # Siempre retornar 'authenticated' si existe principal
    roles = ["authenticated"]

    return func.HttpResponse(
        json.dumps({ "roles": roles }),
        status_code=200,
        mimetype="application/json"
    )
