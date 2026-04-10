#!/bin/bash

set -e

echo "=== Mini-OpenClaw VPS 部署脚本 ==="

# 创建数据目录
mkdir -p data/{sessions,knowledge,storage,memory,workspace,outputs}

# 停止旧容器
docker-compose down 2>/dev/null || true

# 拉取最新代码（如果使用 git）
# git pull origin main

# 构建并启动
docker-compose build --no-cache
docker-compose up -d

# 等待服务启动
echo "等待服务启动..."
sleep 5

# 检查状态
if docker-compose ps | grep -q "Up"; then
    echo "✅ 部署成功！"
    echo "🌐 访问地址: https://542009.best"
else
    echo "❌ 部署失败，请检查日志:"
    docker-compose logs
fi
