/**
 * ============================================================
 * Community Routes - 交流社区路由
 * ============================================================
 * 路由列表:
 *   GET    /api/community            - 获取所有帖子 (支持筛选/排序/分页)
 *   GET    /api/community/categories - 获取社区分类
 *   GET    /api/community/:id        - 获取单个帖子详情
 *   POST   /api/community            - 创建新帖子 (模拟)
 * ============================================================
 */

import express from 'express';
const router = express.Router();

// 导入社区控制器
import  communityController from '../controllers/communityController.js';

// GET /api/community - 获取所有帖子列表
router.get('/', communityController.getAllPosts);

// GET /api/community/categories - 获取社区分类列表
router.get('/categories', communityController.getCategories);

// GET /api/community/:id - 根据 ID 获取单个帖子详情
router.get('/:id', communityController.getPostById);

// POST /api/community - 创建新帖子
router.post('/', communityController.createPost);

// 导出路由模块
export default router;
