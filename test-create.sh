#!/bin/bash

BASE_URL="http://localhost:8080"

echo "=== 1. Health Check ==="
curl -s $BASE_URL | jq .
echo ""

echo "=== 2. Create Post ==="
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "First Post", "content": "Hello from Hono + MongoDB!"}')
echo $CREATE_RESPONSE | jq .
POST_ID=$(echo $CREATE_RESPONSE | jq -r '._id')
echo "Created post ID: $POST_ID"
echo ""

echo "=== 3. Create Second Post ==="
curl -s -X POST $BASE_URL/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Second Post", "content": "Another post here"}' | jq .
echo ""

echo "=== 4. Get All Posts ==="
curl -s $BASE_URL/posts | jq .
echo ""

echo "=== 5. Get Single Post ==="
curl -s $BASE_URL/posts/$POST_ID | jq .
echo ""

echo "=== 6. Update Post ==="
curl -s -X PUT $BASE_URL/posts/$POST_ID \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Post", "content": "This content has been updated"}' | jq .
echo ""

echo "=== 7. Verify Update ==="
curl -s $BASE_URL/posts/$POST_ID | jq .
echo ""

echo "=== Done! ==="
