# Stage 1: Build React frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Stage 2: Python backend + built frontend
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt ./backend/
RUN pip install -r backend/requirements.txt
COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
WORKDIR /app/backend
CMD gunicorn app:app --bind 0.0.0.0:$PORT