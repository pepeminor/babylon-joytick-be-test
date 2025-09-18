FROM heroiclabs/nakama:3.22.0

# copy module JS (game logic)
COPY ./modules /nakama/data/modules

# entrypoint chạy nakama
CMD ["/bin/sh", "-c", "/nakama/nakama \
    --name nakama1 \
    --logger.level DEBUG \
    --database.address postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:5432/${PGDATABASE}?sslmode=require \
    --runtime.path /nakama/data/modules"]
