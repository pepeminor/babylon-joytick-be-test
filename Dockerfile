FROM heroiclabs/nakama:3.22.0

# Copy JS modules
COPY ./modules /nakama/data/modules

# Nếu có config riêng
# COPY ./local.yml /nakama/data/

# Entrypoint Nakama
ENTRYPOINT ["/nakama/nakama"]

# Dùng shell form để env expand
CMD --name nakama1 \
    --logger.level DEBUG \
    --database.address "postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:5432/${PGDATABASE}?sslmode=disable" \
    --runtime.path "/nakama/data/modules"
