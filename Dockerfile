# Sử dụng image chính thức của Nakama
FROM heroiclabs/nakama:3.22.0

# Copy JS modules (game logic)
COPY ./modules /nakama/data/modules

# Nếu có file config riêng thì copy vào (tùy chọn)
# COPY ./local.yml /nakama/data/

# Entrypoint chạy Nakama
ENTRYPOINT ["/nakama/nakama"]

CMD ["--name=nakama1", "--logger.level=DEBUG", "--database.address=postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:5432/${PGDATABASE}?sslmode=disable", "--runtime.path=/nakama/data/modules"]
