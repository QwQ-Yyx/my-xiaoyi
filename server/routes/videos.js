/**
 * ============================================================
 * Videos Routes - 视频路由
 * ============================================================
 * 路由列表:
 *   GET  /api/videos            - 获取所有视频 (支持筛选/搜索/分页)
 *   GET  /api/videos/categories - 获取视频分类
 *   GET  /api/videos/:id        - 获取单个视频详情
 * ============================================================
 */

import express from 'express';
const router = express.Router();

// 导入视频控制器
import videosController from '../controllers/videosController.js';
// GET /api/videos - 获取所有视频列表
router.get('/', videosController.getAllVideos);

// GET /api/videos/categories - 获取视频分类列表
router.get('/categories', videosController.getCategories);

// GET /api/videos/:id - 根据 ID 获取单个视频详情
router.get('/:id', videosController.getVideoById);

// 导出路由模块
export default router;
