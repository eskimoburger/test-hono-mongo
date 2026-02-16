#!/bin/bash

BASE_URL="http://localhost:8080"

echo "=== 1. Health Check ==="
curl -s $BASE_URL | jq .
echo ""

# --- Colors ---
echo "=== 2. Create Colors ==="
COLOR1=$(curl -s -X POST $BASE_URL/colors \
  -H "Content-Type: application/json" \
  -d '{"name_color": "CMYK"}')
echo $COLOR1 | jq .
COLOR1_ID=$(echo $COLOR1 | jq -r '._id')

COLOR2=$(curl -s -X POST $BASE_URL/colors \
  -H "Content-Type: application/json" \
  -d '{"name_color": "Pantone"}')
echo $COLOR2 | jq .
echo ""

# --- Type Works ---
echo "=== 3. Create Type Works ==="
TW1=$(curl -s -X POST $BASE_URL/type-works \
  -H "Content-Type: application/json" \
  -d '{"name_tw": "นามบัตร"}')
echo $TW1 | jq .
TW1_ID=$(echo $TW1 | jq -r '._id')

TW2=$(curl -s -X POST $BASE_URL/type-works \
  -H "Content-Type: application/json" \
  -d '{"name_tw": "โบรชัวร์"}')
echo $TW2 | jq .
echo ""

# --- Printers ---
echo "=== 4. Create Printers ==="
P1=$(curl -s -X POST $BASE_URL/printers \
  -H "Content-Type: application/json" \
  -d '{"name_printer": "Epson L3210"}')
echo $P1 | jq .

P2=$(curl -s -X POST $BASE_URL/printers \
  -H "Content-Type: application/json" \
  -d '{"name_printer": "Canon G3010"}')
echo $P2 | jq .
echo ""

# --- Companies ---
echo "=== 5. Create Companies ==="
COMP1=$(curl -s -X POST $BASE_URL/companies \
  -H "Content-Type: application/json" \
  -d '{"company": "บริษัท เอบีซี จำกัด", "tax": "0105561234567", "count": 0}')
echo $COMP1 | jq .
COMP1_ID=$(echo $COMP1 | jq -r '._id')

COMP2=$(curl -s -X POST $BASE_URL/companies \
  -H "Content-Type: application/json" \
  -d '{"company": "ร้านค้า XYZ", "tax": null, "count": 0}')
echo $COMP2 | jq .
echo ""

# --- Admins ---
echo "=== 6. Create Admins ==="
ADMIN1=$(curl -s -X POST $BASE_URL/admins \
  -H "Content-Type: application/json" \
  -d '{"user_name": "Admin", "password": "1234", "role": "Admin"}')
echo $ADMIN1 | jq .

ADMIN2=$(curl -s -X POST $BASE_URL/admins \
  -H "Content-Type: application/json" \
  -d '{"user_name": "SuperAdmin", "password": "4321", "role": "SuperAdmin"}')
echo $ADMIN2 | jq .
echo ""

# --- Orders ---
echo "=== 7. Create Orders ==="
ORDER1=$(curl -s -X POST $BASE_URL/orders \
  -H "Content-Type: application/json" \
  -d "{\"id_company\": \"$COMP1_ID\", \"customer_name\": \"สมชาย ใจดี\", \"phone\": \"0812345678\", \"email\": \"somchai@email.com\", \"line\": \"somchai_line\", \"address\": \"123 ถ.สุขุมวิท กรุงเทพฯ\", \"start_date\": \"2026-02-16\", \"end_date\": \"2026-02-20\", \"type_work\": \"$TW1_ID\", \"count_work\": 500, \"detail_work\": \"นามบัตร 2 หน้า พิมพ์สี CMYK\", \"file\": \"namecard_somchai.pdf\"}")
echo $ORDER1 | jq .
ORDER1_ID=$(echo $ORDER1 | jq -r '._id')
echo ""

# --- Verify all data ---
echo "=== 8. Get All Companies ==="
curl -s $BASE_URL/companies | jq .
echo ""

echo "=== 9. Get All Admins ==="
curl -s $BASE_URL/admins | jq .
echo ""

echo "=== 10. Get All Orders ==="
curl -s $BASE_URL/orders | jq .
echo ""

echo "=== 11. Get All Printers ==="
curl -s $BASE_URL/printers | jq .
echo ""

echo "=== 12. Get All Colors ==="
curl -s $BASE_URL/colors | jq .
echo ""

echo "=== 13. Get All Type Works ==="
curl -s $BASE_URL/type-works | jq .
echo ""

# --- Update test ---
echo "=== 14. Update Order ==="
curl -s -X PUT $BASE_URL/orders/$ORDER1_ID \
  -H "Content-Type: application/json" \
  -d '{"count_work": 1000, "detail_work": "นามบัตร 2 หน้า พิมพ์สี CMYK จำนวน 1000 ใบ"}' | jq .
echo ""

echo "=== 15. Verify Updated Order ==="
curl -s $BASE_URL/orders/$ORDER1_ID | jq .
echo ""

echo "=== Done! ==="
