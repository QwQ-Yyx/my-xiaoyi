/**
 * ============================================================
 * Heritage Routes - 非遗项目路由
 * ============================================================
 * 路由列表:
 *   GET  /api/heritage       - 获取所有非遗项目 (支持筛选/搜索/分页)
 *   GET  /api/heritage/:id   - 获取单个非遗项目详情
 *   GET  /api/heritage/categories - 获取所有分类
 *   GET  /api/heritage/regions    - 获取所有地区
 * ============================================================
 */

import express from 'express';
const router = express.Router();

// 导入非遗项目控制器
import heritageController from '../controllers/heritageController.js';

// GET /api/heritage - 获取所有非遗项目列表
router.get('/', heritageController.getAllHeritages);

// GET /api/heritage/:id - 根据 ID 获取单个非遗项目详情
router.get('/:id', heritageController.getHeritageById);

// GET /api/heritage/categories - 获取所有分类
router.get('/categories', heritageController.getCategories);

// GET /api/heritage/regions - 获取所有地区
router.get('/regions', heritageController.getRegions);

// 导出路由模块
export default router;