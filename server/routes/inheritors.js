/**
 * ============================================================
 * Inheritors Routes - 传承人路由
 * ============================================================
 * 路由列表:
 *   GET  /api/inheritors       - 获取所有传承人 (支持筛选/搜索/分页)
 *   GET  /api/inheritors/:id   - 获取单个传承人详情
 * ============================================================
 */

import express from 'express';
const router = express.Router();

// 导入传承人控制器
import inheritorsController from '../controllers/inheritorsController.js';

// GET /api/inheritors - 获取所有传承人列表
router.get('/', inheritorsController.getAllInheritors);

// GET /api/inheritors/:id - 根据 ID 获取单个传承人详情
router.get('/:id', inheritorsController.getInheritorById);

// 导出路由模块
export default router;