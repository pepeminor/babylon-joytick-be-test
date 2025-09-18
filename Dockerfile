FROM heroiclabs/nakama:3.22.0

COPY ./modules /nakama/data/modules

CMD sh -c "/nakama/nakama --name nakama1 --logger.level DEBUG --runtime.path /nakama/data/modules --database.address $DATABASE_URL"
