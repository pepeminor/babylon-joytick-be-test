FROM heroiclabs/nakama:3.22.0

# copy module JS (game logic)
COPY ./modules /nakama/data/modules
