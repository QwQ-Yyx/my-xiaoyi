/**
 * ============================================================
 * Learning Routes - 在线课程路由
 * ============================================================
 * 路由列表:
 *   GET  /api/learning            - 获取所有课程 (支持筛选/搜索/分页)
 *   GET  /api/learning/categories - 获取课程分类
 *   GET  /api/learning/:id        - 获取单个课程详情
 * ============================================================
 */

import express from 'express';
const router = express.Router();

// 导入课程控制器
import learningController from '../controllers/learningController.js';
// GET /api/learning - 获取所有课程列表
router.get('/', learningController.getAllCourses);

// GET /api/learning/categories - 获取课程分类列表
router.get('/categories', learningController.getCategories);

// GET /api/learning/:id - 根据 ID 获取单个课程详情
router.get('/:id', learningController.getCourseById);

// 导出路由模块
export default router;