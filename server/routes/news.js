/**
 * ============================================================
 * News Routes - 新闻资讯路由
 * ============================================================
 * 路由列表:
 *   GET  /api/news            - 获取所有新闻 (支持筛选/搜索/分页)
 *   GET  /api/news/categories - 获取新闻分类
 *   GET  /api/news/:id        - 获取单个新闻详情
 * ============================================================
 */

import express from 'express';
const router = express.Router();

// 导入新闻控制器
import newsController from '../controllers/newsController.js';
// GET /api/news - 获取所有新闻列表
router.get('/', newsController.getAllNews);

// GET /api/news/categories - 获取新闻分类列表
router.get('/categories', newsController.getCategories);

// GET /api/news/:id - 根据 ID 获取单个新闻详情
router.get('/:id', newsController.getNewsById);

// 导出路由模块
export default router;