FROM heroiclabs/nakama:3.22.0

COPY ./modules /nakama/data/modules

ENTRYPOINT ["/nakama/nakama"]
CMD ["--name", "nakama1", "--logger.level", "DEBUG", "--runtime.path", "/nakama/data/modules"]
