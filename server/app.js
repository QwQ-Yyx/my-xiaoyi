/**
 * ============================================================
 * 荆楚遗韵 - Express 应用主入口
 * ============================================================
 * 湖北非物质文化遗产数字平台后端服务
 * 技术栈: Node.js + Express + lowdb + cors
 * ============================================================
 */

// 加载环境变量
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// 兼容 ESModule 的 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 导入路由聚合模块
import routes from './routes/index.js';

// 导入统一错误处理中间件
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// 创建 Express 应用实例
const app = express();

// 从环境变量读取端口，默认 3000
const PORT = process.env.PORT || 3000;

// 从环境变量读取 Node 环境，默认 development
const NODE_ENV = process.env.NODE_ENV || 'development';

// 从环境变量读取 CORS 配置，默认允许所有来源
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// ============================================================
// 中间件配置
// ============================================================

// 解析 JSON 请求体 (Content-Type: application/json)
app.use(express.json());

// 解析 URL-encoded 请求体 (Content-Type: application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// CORS 跨域配置
// 开发阶段允许所有来源，生产阶段可配置白名单
app.use(cors({
  origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ============================================================
// 路由挂载
// ============================================================

// 健康检查接口 (用于部署平台探活)
app.get('/health', function (req, res) {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      env: NODE_ENV,
      timestamp: new Date().toISOString()
    },
    message: '服务运行正常'
  });
});

// 挂载所有 API 路由，前缀为 /api
app.use('/api', routes);

// ============================================================
// 错误处理 (404 和全局错误)
// ============================================================

// 404 路由未找到处理
app.use(notFoundHandler);

// 全局错误处理中间件 (必须放在最后)
app.use(errorHandler);

// ============================================================
// 启动服务器（Vercel 兼容版）
// ============================================================

// 本地开发时启动监听，Vercel 环境自动忽略
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, function () {
    console.log('========================================');
    console.log('  荆楚遗韵 - 非遗数字平台后端服务');
    console.log('========================================');
    console.log('  环境:', NODE_ENV);
    console.log('  端口:', PORT);
    console.log('  CORS:', CORS_ORIGIN);
    console.log('  地址: http://localhost:' + PORT);
    console.log('========================================');
  });
}

// 导出 app 给 Vercel 使用
export default app;