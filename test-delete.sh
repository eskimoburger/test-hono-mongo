#!/bin/bash

BASE_URL="http://localhost:8080"

echo "=== 1. All Posts Before Delete ==="
curl -s $BASE_URL/posts | jq .
echo ""

echo "=== 2. Deleting All Posts ==="
for POST_ID in $(curl -s $BASE_URL/posts | jq -r '.[]._id'); do
  echo "Deleting $POST_ID ..."
  curl -s -X DELETE $BASE_URL/posts/$POST_ID | jq .
done
echo ""

echo "=== 3. Verify All Deleted (should be empty) ==="
curl -s $BASE_URL/posts | jq .
echo ""

echo "=== Done! ==="
