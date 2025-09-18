FROM heroiclabs/nakama:3.22.0

# copy module JS
COPY ./modules /nakama/data/modules

# để default entrypoint của nakama, chỉ override CMD
ENTRYPOINT ["/nakama/nakama"]

CMD ["--name=nakama1", "--logger.level=DEBUG", "--database.address=postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?sslmode=disable", "--runtime.path=/nakama/data/modules"]
