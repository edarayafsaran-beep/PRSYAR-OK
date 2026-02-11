#!/bin/bash

# سیدی داتابەیس بۆ Railway
# لیاڤی البۆت ئیتیل RR_DEPLOYMENT=true

echo "Seeding database..."

# Admin لۆگین
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin Officer",
    "militaryId": "ADMIN123"
  }' -s | jq .

# Officer لۆگین 
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Sarbaz Ahmed",
    "militaryId": "987654321"
  }' -s | jq .

echo "Seeding complete!"
