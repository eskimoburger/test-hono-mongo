#!/bin/bash

BASE_URL="http://localhost:8080"

echo "=== Login ==="
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"user_name": "Admin", "password": "1234"}')
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed."
  exit 1
fi

AUTH="Authorization: Bearer $TOKEN"
echo "Logged in."
echo ""

echo "=== Deleting all data ==="
echo ""

for collection in orders companies printers colors type-works; do
  echo "--- Deleting all $collection ---"
  for ID in $(curl -s $BASE_URL/$collection -H "$AUTH" | jq -r '.[]._id'); do
    echo "  Deleting $ID ..."
    curl -s -X DELETE $BASE_URL/$collection/$ID -H "$AUTH" | jq .
  done
  echo ""
done

echo "=== Verify all empty ==="
for collection in orders companies printers colors type-works; do
  echo "--- $collection ---"
  curl -s $BASE_URL/$collection -H "$AUTH" | jq .
done
echo ""

echo "=== Done! ==="
