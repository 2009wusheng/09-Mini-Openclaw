# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源码
COPY . .

# 构建
RUN npm run build

# 运行阶段
FROM node:20-alpine

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# 安装生产依赖
RUN npm ci --production

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["npm", "start"]
