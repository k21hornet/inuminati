# git pull
git pull origin main

# docker-compose down
docker-compose down

# イメージタグ
FRONTEND_IMAGE_TAG="0.2.0"
BACKEND_IMAGE_TAG="0.2.0"
DATABASE_IMAGE_TAG="0.2.0"

# イメージ名
FRONTEND_IMAGE_NAME="inuminati-web"
BACKEND_IMAGE_NAME="inuminati-api"
DATABASE_IMAGE_NAME="database"

# 以前生成したイメージを削除
if docker image inspect "${FRONTEND_IMAGE_NAME}":"${FRONTEND_IMAGE_TAG}" > /dev/null 2>&1; then
    docker image rm "${FRONTEND_IMAGE_NAME}":"${FRONTEND_IMAGE_TAG}"
fi
if docker image inspect "${BACKEND_IMAGE_NAME}":"${BACKEND_IMAGE_TAG}" > /dev/null 2>&1; then
    docker image rm "${BACKEND_IMAGE_NAME}":"${BACKEND_IMAGE_TAG}"
fi
if docker image inspect "${DATABASE_IMAGE_NAME}":"${DATABASE_IMAGE_TAG}" > /dev/null 2>&1; then
    docker image rm "${DATABASE_IMAGE_NAME}":"${DATABASE_IMAGE_TAG}"
fi

# イメージの生成
docker buildx build --platform linux/amd64 -t "${FRONTEND_IMAGE_NAME}":"${FRONTEND_IMAGE_TAG}" -f ./inuminati-web/Dockerfile --load ./inuminati-web
docker buildx build --platform linux/amd64 -t "${BACKEND_IMAGE_NAME}":"${BACKEND_IMAGE_TAG}" -f ./inuminati-api/Dockerfile --load ./inuminati-api
docker buildx build --platform linux/amd64 -t "${DATABASE_IMAGE_NAME}":"${DATABASE_IMAGE_TAG}" -f ./database/Dockerfile --load ./database

# コンテナ起動
docker-compose up -d
