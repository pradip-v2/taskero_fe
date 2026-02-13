#!/bin/bash
set -e

base_url="http://localhost:8001"

if [ "$1" = "dev" ]; then
    base_url="https://dev.example.com"
fi

if [ "$1" = "prod" ]; then
    base_url="https://api.example.com"
fi

# Use curl instead of wget
curl -sSL "$base_url/api/schema/" -o api_schema.yaml

rm -rf ./src/api/hooks/
rm -rf ./src/api/schemas/
rm -rf ./src/api/types/
rm -f ./src/api/index.ts

yarn run kubb generate --config kubb.config.ts

rm -f api_schema.yaml
