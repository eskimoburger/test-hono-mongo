$BASE_URL = "http://localhost:8080"

Write-Host "=== 1. All Posts Before Delete ==="
$posts = Invoke-RestMethod -Uri "$BASE_URL/posts"
$posts | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "=== 2. Deleting All Posts ==="
foreach ($post in $posts) {
    $id = $post._id
    Write-Host "Deleting $id ..."
    Invoke-RestMethod -Uri "$BASE_URL/posts/$id" -Method Delete | ConvertTo-Json
}
Write-Host ""

Write-Host "=== 3. Verify All Deleted (should be empty) ==="
Invoke-RestMethod -Uri "$BASE_URL/posts" | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "=== Done! ==="
