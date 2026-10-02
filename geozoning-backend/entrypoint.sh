#!/bin/bash
set -e

MAX_RETRIES=30
RETRY_INTERVAL=2
HOST="${DB_HOST:-postgresql_db}"
PORT="${DB_PORT:-5432}"
count=0

echo "Waiting for PostgreSQL service to start at $HOST:$PORT........"

until (echo > /dev/tcp/"$HOST"/"$PORT") 2>/dev/null; do
    count=$((count + 1))

    if [ "$count" -ge "$MAX_RETRIES" ]; then
        echo "❌ Database did not become ready after $((MAX_RETRIES * RETRY_INTERVAL))s. Exiting."
        exit 1
    fi

    echo "Database is unavailable - retry $count/$MAX_RETRIES..."
    sleep "$RETRY_INTERVAL"
done

echo "PostgreSQL service is ready on  $HOST:$PORT! Continuing...."

# Show pending migrations before applying (great for debugging)
echo "📋 Pending migrations:"
uv run alembic history --indicate-current

echo "🚀 Running Alembic migrations..."

if uv run alembic upgrade head; then
    echo "✅ Migrations applied successfully."
else
    echo "❌ Migration failed. Container kept alive for debugging."
    echo "   → Inspect:  docker compose exec backend alembic history --indicate-current"
    echo "   → Rollback: docker compose exec backend alembic downgrade -1"
    echo "   → Check:    docker compose exec backend alembic current"
    while true; do sleep 3600; done
fi

echo "🟢 Starting FastAPI server..."
exec uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload



