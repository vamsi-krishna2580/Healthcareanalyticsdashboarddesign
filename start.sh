#!/bin/bash

echo "Starting backend..."
python app.py &

echo "Starting frontend static server..."
cd dist
python -m http.server 3000 &

wait
