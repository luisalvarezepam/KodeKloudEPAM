#!/bin/bash

echo "🔁 Activando entorno virtual..."
source .venv/bin/activate

echo "🔁 Estableciendo variables de entorno..."
export AzureWebJobsStorage="UseDevelopmentStorage=true"
export FUNCTIONS_WORKER_RUNTIME=python
export PYTHONPATH=$PWD

echo "🚀 Iniciando Azure Functions localmente..."
func start