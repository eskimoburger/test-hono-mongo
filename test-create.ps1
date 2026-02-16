$BASE_URL = "http://localhost:8080"

Write-Host "=== 1. Health Check ==="
Invoke-RestMethod -Uri "$BASE_URL" | ConvertTo-Json
Write-Host ""

Write-Host "=== 2. Login ==="
$loginBody = '{"user_name": "Admin", "password": "1234"}'
$loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
$loginResponse | ConvertTo-Json
$token = $loginResponse.token

if (-not $token) {
    Write-Host "Login failed. Make sure an admin exists."
    exit 1
}

Write-Host "Token: $($token.Substring(0, 30))..."
Write-Host ""

$headers = @{ Authorization = "Bearer $token" }

# --- Colors ---
Write-Host "=== 3. Create Colors ==="
$color1 = Invoke-RestMethod -Uri "$BASE_URL/colors" -Method Post -ContentType "application/json" `
  -Headers $headers -Body '{"name_color": "CMYK"}'
$color1 | ConvertTo-Json
$color1Id = $color1._id

Invoke-RestMethod -Uri "$BASE_URL/colors" -Method Post -ContentType "application/json" `
  -Headers $headers -Body '{"name_color": "Pantone"}' | ConvertTo-Json
Write-Host ""

# --- Type Works ---
Write-Host "=== 4. Create Type Works ==="
$tw1 = Invoke-RestMethod -Uri "$BASE_URL/type-works" -Method Post -ContentType "application/json" `
  -Headers $headers -Body '{"name_tw": "Business Card"}'
$tw1 | ConvertTo-Json
$tw1Id = $tw1._id

Invoke-RestMethod -Uri "$BASE_URL/type-works" -Method Post -ContentType "application/json" `
  -Headers $headers -Body '{"name_tw": "Brochure"}' | ConvertTo-Json
Write-Host ""

# --- Printers ---
Write-Host "=== 5. Create Printers ==="
Invoke-RestMethod -Uri "$BASE_URL/printers" -Method Post -ContentType "application/json" `
  -Headers $headers -Body '{"name_printer": "Epson L3210"}' | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/printers" -Method Post -ContentType "application/json" `
  -Headers $headers -Body '{"name_printer": "Canon G3010"}' | ConvertTo-Json
Write-Host ""

# --- Companies ---
Write-Host "=== 6. Create Companies ==="
$comp1 = Invoke-RestMethod -Uri "$BASE_URL/companies" -Method Post -ContentType "application/json" `
  -Headers $headers -Body '{"company": "ABC Co., Ltd.", "tax": "0105561234567", "count": 0}'
$comp1 | ConvertTo-Json
$comp1Id = $comp1._id

Invoke-RestMethod -Uri "$BASE_URL/companies" -Method Post -ContentType "application/json" `
  -Headers $headers -Body '{"company": "XYZ Shop", "tax": null, "count": 0}' | ConvertTo-Json
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
Invoke-RestMethod -Uri "$BASE_URL/orders" -Method Post -ContentType "application/json" `
  -Headers $headers -Body $orderBody | ConvertTo-Json
Write-Host ""

# --- Verify ---
Write-Host "=== 8. Get All Data ==="
foreach ($col in @("companies", "admins", "orders", "printers", "colors", "type-works")) {
    Write-Host "--- $col ---"
    Invoke-RestMethod -Uri "$BASE_URL/$col" -Headers $headers | ConvertTo-Json -Depth 10
}
Write-Host ""

# --- Test without token ---
Write-Host "=== 9. Test Without Token (should 401) ==="
try {
    Invoke-RestMethod -Uri "$BASE_URL/companies"
} catch {
    Write-Host "Got 401 Unauthorized (expected)"
}
Write-Host ""

Write-Host "=== Done! ==="
