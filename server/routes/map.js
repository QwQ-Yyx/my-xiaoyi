/**
 * ============================================================
 * Map Routes - 非遗地图路由
 * ============================================================
 * 路由列表:
 *   GET  /api/map/points       - 获取所有地图点位 (支持筛选/搜索/分页)
 *   GET  /api/map/points/:id   - 获取单个点位详情
 *   GET  /api/map/regions      - 获取地区统计
 * ============================================================
 * 注意: 所有地图相关路由都以 /points 为前缀
 *   /api/map/points     -> 获取所有点位
 *   /api/map/points/:id -> 获取单个点位
 *   /api/map/regions    -> 获取地区统计
 * ============================================================
 */

import express from 'express';
const router = express.Router();

// 导入地图控制器
import mapController from '../controllers/mapController.js';

// GET /api/map/points - 获取所有地图点位列表
router.get('/points', mapController.getAllPoints);

// GET /api/map/regions - 获取地区统计数据
router.get('/regions', mapController.getRegions);

// GET /api/map/points/:id - 根据 ID 获取单个点位详情
router.get('/points/:id', mapController.getPointById);

// 导出路由模块
export default router;