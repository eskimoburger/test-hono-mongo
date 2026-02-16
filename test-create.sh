#!/bin/bash

BASE_URL="http://localhost:8080"

echo "=== 1. Health Check ==="
curl -s $BASE_URL | jq .
echo ""

# --- Create admin first (no auth needed for first setup) ---
# We need an admin to login, so we'll create one via direct DB or use a seed
# For first run, temporarily remove JWT middleware or use this workaround:

echo "=== 2. Login ==="
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"user_name": "Admin", "password": "1234"}')
echo $LOGIN_RESPONSE | jq .
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed. Make sure an admin exists in the database."
  echo "Create one first: POST /admins with a valid JWT or seed the DB."
  exit 1
fi

echo "Token: ${TOKEN:0:30}..."
echo ""

AUTH="Authorization: Bearer $TOKEN"

# --- Colors ---
echo "=== 3. Create Colors ==="
COLOR1=$(curl -s -X POST $BASE_URL/colors \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{"name_color": "CMYK"}')
echo $COLOR1 | jq .
COLOR1_ID=$(echo $COLOR1 | jq -r '._id')

curl -s -X POST $BASE_URL/colors \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{"name_color": "Pantone"}' | jq .
echo ""

# --- Type Works ---
echo "=== 4. Create Type Works ==="
TW1=$(curl -s -X POST $BASE_URL/type-works \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{"name_tw": "นามบัตร"}')
echo $TW1 | jq .
TW1_ID=$(echo $TW1 | jq -r '._id')

curl -s -X POST $BASE_URL/type-works \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{"name_tw": "โบรชัวร์"}' | jq .
echo ""

# --- Printers ---
echo "=== 5. Create Printers ==="
curl -s -X POST $BASE_URL/printers \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{"name_printer": "Epson L3210"}' | jq .

curl -s -X POST $BASE_URL/printers \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{"name_printer": "Canon G3010"}' | jq .
echo ""

# --- Companies ---
echo "=== 6. Create Companies ==="
COMP1=$(curl -s -X POST $BASE_URL/companies \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{"company": "บริษัท เอบีซี จำกัด", "tax": "0105561234567", "count": 0}')
echo $COMP1 | jq .
COMP1_ID=$(echo $COMP1 | jq -r '._id')

curl -s -X POST $BASE_URL/companies \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{"company": "ร้านค้า XYZ", "tax": null, "count": 0}' | jq .
echo ""

# --- Orders ---
echo "=== 7. Create Orders ==="
ORDER1=$(curl -s -X POST $BASE_URL/orders \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d "{\"id_company\": \"$COMP1_ID\", \"customer_name\": \"สมชาย ใจดี\", \"phone\": \"0812345678\", \"email\": \"somchai@email.com\", \"line\": \"somchai_line\", \"address\": \"123 ถ.สุขุมวิท กรุงเทพฯ\", \"start_date\": \"2026-02-16\", \"end_date\": \"2026-02-20\", \"type_work\": \"$TW1_ID\", \"count_work\": 500, \"detail_work\": \"นามบัตร 2 หน้า พิมพ์สี CMYK\", \"file\": \"namecard_somchai.pdf\"}")
echo $ORDER1 | jq .
ORDER1_ID=$(echo $ORDER1 | jq -r '._id')
echo ""

# --- Verify ---
echo "=== 8. Get All Data ==="
for col in companies admins orders printers colors type-works; do
  echo "--- $col ---"
  curl -s $BASE_URL/$col -H "$AUTH" | jq .
done
echo ""

# --- Test without token (should fail) ---
echo "=== 9. Test Without Token (should 401) ==="
curl -s $BASE_URL/companies | jq .
echo ""

echo "=== Done! ==="
