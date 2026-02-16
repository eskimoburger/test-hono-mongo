$BASE_URL = "http://localhost:8080"

Write-Host "=== 1. Health Check ==="
Invoke-RestMethod -Uri "$BASE_URL" | ConvertTo-Json
Write-Host ""

# --- Colors ---
Write-Host "=== 2. Create Colors ==="
$color1 = Invoke-RestMethod -Uri "$BASE_URL/colors" -Method Post -ContentType "application/json" `
  -Body '{"name_color": "CMYK"}'
$color1 | ConvertTo-Json
$color1Id = $color1._id

$color2 = Invoke-RestMethod -Uri "$BASE_URL/colors" -Method Post -ContentType "application/json" `
  -Body '{"name_color": "Pantone"}'
$color2 | ConvertTo-Json
Write-Host ""

# --- Type Works ---
Write-Host "=== 3. Create Type Works ==="
$tw1 = Invoke-RestMethod -Uri "$BASE_URL/type-works" -Method Post -ContentType "application/json" `
  -Body '{"name_tw": "Business Card"}'
$tw1 | ConvertTo-Json
$tw1Id = $tw1._id

$tw2 = Invoke-RestMethod -Uri "$BASE_URL/type-works" -Method Post -ContentType "application/json" `
  -Body '{"name_tw": "Brochure"}'
$tw2 | ConvertTo-Json
Write-Host ""

# --- Printers ---
Write-Host "=== 4. Create Printers ==="
Invoke-RestMethod -Uri "$BASE_URL/printers" -Method Post -ContentType "application/json" `
  -Body '{"name_printer": "Epson L3210"}' | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/printers" -Method Post -ContentType "application/json" `
  -Body '{"name_printer": "Canon G3010"}' | ConvertTo-Json
Write-Host ""

# --- Companies ---
Write-Host "=== 5. Create Companies ==="
$comp1 = Invoke-RestMethod -Uri "$BASE_URL/companies" -Method Post -ContentType "application/json" `
  -Body '{"company": "ABC Co., Ltd.", "tax": "0105561234567", "count": 0}'
$comp1 | ConvertTo-Json
$comp1Id = $comp1._id

Invoke-RestMethod -Uri "$BASE_URL/companies" -Method Post -ContentType "application/json" `
  -Body '{"company": "XYZ Shop", "tax": null, "count": 0}' | ConvertTo-Json
Write-Host ""

# --- Admins ---
Write-Host "=== 6. Create Admins ==="
Invoke-RestMethod -Uri "$BASE_URL/admins" -Method Post -ContentType "application/json" `
  -Body '{"user_name": "Admin", "password": "1234", "role": "Admin"}' | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/admins" -Method Post -ContentType "application/json" `
  -Body '{"user_name": "SuperAdmin", "password": "4321", "role": "SuperAdmin"}' | ConvertTo-Json
Write-Host ""

# --- Orders ---
Write-Host "=== 7. Create Orders ==="
$orderBody = @{
  id_company    = $comp1Id
  customer_name = "Somchai Jaidee"
  phone         = "0812345678"
  email         = "somchai@email.com"
  line          = "somchai_line"
  address       = "123 Sukhumvit Rd, Bangkok"
  start_date    = "2026-02-16"
  end_date      = "2026-02-20"
  type_work     = $tw1Id
  count_work    = 500
  detail_work   = "Business Card 2 sides CMYK"
  file          = "namecard_somchai.pdf"
} | ConvertTo-Json
$order1 = Invoke-RestMethod -Uri "$BASE_URL/orders" -Method Post -ContentType "application/json" -Body $orderBody
$order1 | ConvertTo-Json
$order1Id = $order1._id
Write-Host ""

# --- Verify all data ---
Write-Host "=== 8. Get All Companies ==="
Invoke-RestMethod -Uri "$BASE_URL/companies" | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "=== 9. Get All Admins ==="
Invoke-RestMethod -Uri "$BASE_URL/admins" | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "=== 10. Get All Orders ==="
Invoke-RestMethod -Uri "$BASE_URL/orders" | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "=== 11. Get All Printers ==="
Invoke-RestMethod -Uri "$BASE_URL/printers" | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "=== 12. Get All Colors ==="
Invoke-RestMethod -Uri "$BASE_URL/colors" | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "=== 13. Get All Type Works ==="
Invoke-RestMethod -Uri "$BASE_URL/type-works" | ConvertTo-Json -Depth 10
Write-Host ""

# --- Update test ---
Write-Host "=== 14. Update Order ==="
Invoke-RestMethod -Uri "$BASE_URL/orders/$order1Id" -Method Put -ContentType "application/json" `
  -Body '{"count_work": 1000, "detail_work": "Business Card 2 sides CMYK 1000 pcs"}' | ConvertTo-Json
Write-Host ""

Write-Host "=== 15. Verify Updated Order ==="
Invoke-RestMethod -Uri "$BASE_URL/orders/$order1Id" | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "=== Done! ==="
