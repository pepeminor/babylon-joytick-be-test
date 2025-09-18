FROM heroiclabs/nakama:3.22.0

# copy module JS (game logic)
COPY ./modules /nakama/data/modules

# copy config (nếu có)
# COPY ./local.yml /nakama/data/

# entrypoint chạy nakama
CMD ["/nakama/nakama",
    "--name", "nakama1",
    "--logger.level", "DEBUG",
    "--database.address", "postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?sslmode=disable",
    "--runtime.path", "/nakama/data/modules"]
