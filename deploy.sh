# .env から設定を読み込む
if [ ! -f .env ]; then
  exit 1
fi
# shellcheck disable=SC1091
source .env

# イメージタグ
MUZZLE_IMAGE_TAG="${MUZZLE_VERSION}"
BRAIN_IMAGE_TAG="${BRAIN_VERSION}"

# イメージ名
MUZZLE_IMAGE_NAME="inusidian-muzzle"
BRAIN_IMAGE_NAME="inusidian-brain"
# Docker Registry リポジトリ名
DOCKER_REGISTRY_REPOSITORY_NAME="${DOCKER_REGISTRY_REPOSITORY_NAME}"
# Docker Registry イメージタグ名
DOCKER_REGISTRY_MUZZLE_IMAGE_TAG="muzzle-${MUZZLE_IMAGE_TAG}"
DOCKER_REGISTRY_BRAIN_IMAGE_TAG="brain-${BRAIN_IMAGE_TAG}"

# 以前生成したイメージを削除
if docker image inspect "${MUZZLE_IMAGE_NAME}:${MUZZLE_IMAGE_TAG}" > /dev/null 2>&1; then
    docker image rm "${MUZZLE_IMAGE_NAME}:${MUZZLE_IMAGE_TAG}"
fi
if docker image inspect "${BRAIN_IMAGE_NAME}":"${BRAIN_IMAGE_TAG}" > /dev/null 2>&1; then
    docker image rm "${BRAIN_IMAGE_NAME}:${BRAIN_IMAGE_TAG}"
fi

# イメージの生成
docker buildx build --platform linux/amd64 --load -t "${BRAIN_IMAGE_NAME}:${BRAIN_IMAGE_TAG}" ./brain
docker buildx build --platform linux/amd64 --load -t "${MUZZLE_IMAGE_NAME}:${MUZZLE_IMAGE_TAG}" ./muzzle

# イメージにタグ付け
docker tag "${MUZZLE_IMAGE_NAME}:${MUZZLE_IMAGE_TAG}" "${DOCKER_REGISTRY_REPOSITORY_NAME}:${DOCKER_REGISTRY_MUZZLE_IMAGE_TAG}"
docker tag "${BRAIN_IMAGE_NAME}:${BRAIN_IMAGE_TAG}" "${DOCKER_REGISTRY_REPOSITORY_NAME}:${DOCKER_REGISTRY_BRAIN_IMAGE_TAG}"

# レジストリにプッシュ
docker push "${DOCKER_REGISTRY_REPOSITORY_NAME}:${DOCKER_REGISTRY_BRAIN_IMAGE_TAG}"
docker push "${DOCKER_REGISTRY_REPOSITORY_NAME}:${DOCKER_REGISTRY_MUZZLE_IMAGE_TAG}"
