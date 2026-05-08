/**
 * ============================================================
 * Shop Routes - 文创商城路由
 * ============================================================
 * 路由列表:
 *   GET  /api/shop            - 获取所有商品 (支持筛选/搜索/分页)
 *   GET  /api/shop/categories - 获取商品分类
 *   GET  /api/shop/:id        - 获取单个商品详情
 * ============================================================
 */

import express from 'express';
const router = express.Router();

// 导入商城控制器
import shopController from '../controllers/shopController.js';

// GET /api/shop - 获取所有商品列表（修正了拼写错误！）
router.get('/', shopController.getAllProducts);

// GET /api/shop/categories - 获取商品分类列表
router.get('/categories', shopController.getCategories);

// GET /api/shop/:id - 根据 ID 获取单个商品详情
router.get('/:id', shopController.getProductById);

// 导出路由模块
export default router;