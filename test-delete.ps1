$BASE_URL = "http://localhost:8080"

Write-Host "=== Login ==="
$loginBody = '{"user_name": "Admin", "password": "1234"}'
$loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token

if (-not $token) {
    Write-Host "Login failed."
    exit 1
}

$headers = @{ Authorization = "Bearer $token" }
Write-Host "Logged in."
Write-Host ""

Write-Host "=== Deleting all data ==="
Write-Host ""

$collections = @("orders", "companies", "printers", "colors", "type-works")

foreach ($col in $collections) {
    Write-Host "--- Deleting all $col ---"
    $items = Invoke-RestMethod -Uri "$BASE_URL/$col" -Headers $headers
    foreach ($item in $items) {
        $id = $item._id
        Write-Host "  Deleting $id ..."
        Invoke-RestMethod -Uri "$BASE_URL/$col/$id" -Method Delete -Headers $headers | ConvertTo-Json
    }
    Write-Host ""
}

Write-Host "=== Verify all empty ==="
foreach ($col in $collections) {
    Write-Host "--- $col ---"
    Invoke-RestMethod -Uri "$BASE_URL/$col" -Headers $headers | ConvertTo-Json -Depth 10
}
Write-Host ""

Write-Host "=== Done! ==="
