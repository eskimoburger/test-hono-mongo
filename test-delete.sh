#!/bin/bash

BASE_URL="http://localhost:8080"

echo "=== Deleting all data ==="
echo ""

for collection in orders companies admins printers colors type-works; do
  echo "--- Deleting all $collection ---"
  for ID in $(curl -s $BASE_URL/$collection | jq -r '.[]._id'); do
    echo "  Deleting $ID ..."
    curl -s -X DELETE $BASE_URL/$collection/$ID | jq .
  done
  echo ""
done

echo "=== Verify all empty ==="
for collection in orders companies admins printers colors type-works; do
  echo "--- $collection ---"
  curl -s $BASE_URL/$collection | jq .
done
echo ""

echo "=== Done! ==="
