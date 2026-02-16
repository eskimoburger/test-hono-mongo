$BASE_URL = "http://localhost:8080"

Write-Host "=== Deleting all data ==="
Write-Host ""

$collections = @("orders", "companies", "admins", "printers", "colors", "type-works")

foreach ($col in $collections) {
    Write-Host "--- Deleting all $col ---"
    $items = Invoke-RestMethod -Uri "$BASE_URL/$col"
    foreach ($item in $items) {
        $id = $item._id
        Write-Host "  Deleting $id ..."
        Invoke-RestMethod -Uri "$BASE_URL/$col/$id" -Method Delete | ConvertTo-Json
    }
    Write-Host ""
}

Write-Host "=== Verify all empty ==="
foreach ($col in $collections) {
    Write-Host "--- $col ---"
    Invoke-RestMethod -Uri "$BASE_URL/$col" | ConvertTo-Json -Depth 10
}
Write-Host ""

Write-Host "=== Done! ==="
