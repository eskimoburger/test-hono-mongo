$BASE_URL = "http://localhost:8080"

Write-Host "=== 1. Health Check ==="
Invoke-RestMethod -Uri "$BASE_URL" | ConvertTo-Json
Write-Host ""

Write-Host "=== 2. Create Post ==="
$body1 = @{ title = "First Post"; content = "Hello from Hono + MongoDB!" } | ConvertTo-Json
$created = Invoke-RestMethod -Uri "$BASE_URL/posts" -Method Post -ContentType "application/json" -Body $body1
$created | ConvertTo-Json
$postId = $created._id
Write-Host "Created post ID: $postId"
Write-Host ""

Write-Host "=== 3. Create Second Post ==="
$body2 = @{ title = "Second Post"; content = "Another post here" } | ConvertTo-Json
Invoke-RestMethod -Uri "$BASE_URL/posts" -Method Post -ContentType "application/json" -Body $body2 | ConvertTo-Json
Write-Host ""

Write-Host "=== 4. Get All Posts ==="
Invoke-RestMethod -Uri "$BASE_URL/posts" | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "=== 5. Get Single Post ==="
Invoke-RestMethod -Uri "$BASE_URL/posts/$postId" | ConvertTo-Json
Write-Host ""

Write-Host "=== 6. Update Post ==="
$body3 = @{ title = "Updated Post"; content = "This content has been updated" } | ConvertTo-Json
Invoke-RestMethod -Uri "$BASE_URL/posts/$postId" -Method Put -ContentType "application/json" -Body $body3 | ConvertTo-Json
Write-Host ""

Write-Host "=== 7. Verify Update ==="
Invoke-RestMethod -Uri "$BASE_URL/posts/$postId" | ConvertTo-Json
Write-Host ""

Write-Host "=== Done! ==="
