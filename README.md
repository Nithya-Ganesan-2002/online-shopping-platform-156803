# Project Repository

This repository contains the ecommerce platform.

Backend (Express, MongoDB):
- Location: ecommerce_backend
- Features: User auth (JWT), product browsing/search/filtering, cart management, checkout with mock payment, and order history.
- API Docs: Visit /docs once the server is running. OpenAPI JSON at /openapi.json.

Quick start:
1. Copy ecommerce_backend/.env.example to ecommerce_backend/.env and fill values (MONGO_URI, JWT_SECRET).
2. Install dependencies:
   - cd ecommerce_backend
   - npm install
3. Run in dev:
   - npm run dev
4. Build OpenAPI spec to file (optional):
   - npm run docs:build

Env variables needed (in ecommerce_backend/.env):
- PORT, HOST, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN (optional), PAYMENT_MODE (mock), PAYMENT_CURRENCY (default USD).