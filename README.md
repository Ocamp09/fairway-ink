# Fairway Ink

**Design and Purchase Custom Golf Ball Stencils**

Fairway Ink is a full-stack e-commerce platform that enables users to create personalized golf ball stencils and purchase physical versions of their designs. Users can upload, draw, or browse pre-made designs, which are processed and rendered as 3D printable models directly in the browser.

---

## 🌟 Features

### 🖥 Frontend (React / Next.js + Vite)
- https://github.com/Ocamp09/fairway-ink
- Intuitive UI with multi-page navigation
- Upload and draw images on HTML Canvas
- Convert images (PNG, JPG) to SVG with scaling tools
- Real-time 3D STL model preview using `react-three-fiber`
- Dynamic cart system with Stripe-based checkout

### 🛠 Backend (Golang, gRPC, MySQL)
- https://github.com/Ocamp09/fairway-ink-api
- RESTful API with handler/service architecture and unit tests
- Stripe Payment Intents integration for secure payments
- EasyPost integration for automated shipping rates and labels
- gRPC server for calling a Python image-to-SVG microservice

### 🧩 Stencil Creation Pipeline
- Python script (using `svgtrace`) to convert images to SVG
- Custom Blender Python script extrudes SVG and applies Boolean ops
- Generated stencil STL is rendered and previewed by user

### ☁️ Deployment
- AWS-hosted infrastructure:
  - UI: AWS Amplify
  - API: EC2
  - Database: RDS (MySQL)
- Fully Dockerized local development (API + DB)
- HTTPS with custom domains:
  - `https://fairway-ink.com`
  - `https://api.fairway-ink.com`

---

## 🚀 Tech Stack

- **Frontend**: React, Next.js, Vite, TailwindCSS, react-three-fiber
- **Backend**: Golang, gRPC, MySQL, Stripe API, EasyPost API
- **Scripting & Processing**: Python, svgtrace, Blender (Python API)
- **Infrastructure**: Docker, AWS EC2, RDS, Amplify, Nginx (TLS)

---

## 📸 Demo
https://fairway-ink.com

---

## 📦 Local Development

```bash
# Start the MySQL database using Docker
cd database/docker
docker-compose up -d

# Run the Go backend server
cd golang-api
go mod tidy
go run main.go

# Run the gRPC server
cd golang-api/grpc
pip3 install -r requirements.txt
python3 grpc_server.py

# Start the React frontend
npm install
npm run dev
