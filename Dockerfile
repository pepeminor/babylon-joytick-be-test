FROM heroiclabs/nakama:3.22.0

# copy module JS (game logic)
COPY ./modules /nakama/data/modules

# entrypoint chạy nakama
CMD ["/nakama/nakama", "--name", "nakama1", "--logger.level", "DEBUG", "--database.address", "${DATABASE_URL}", "--runtime.path", "/nakama/data/modules"]
