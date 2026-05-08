/**
 * ============================================================
 * Auth Routes - 认证路由
 * ============================================================
 * 路由列表:
 *   POST  /api/auth/login    - 用户登录 (模拟)
 *   POST  /api/auth/register - 用户注册 (模拟)
 *   GET   /api/auth/me       - 获取当前用户信息 (模拟)
 * ============================================================
 */

import express from 'express';
const router = express.Router();

// 导入认证控制器
import authController from '../controllers/authController.js';

// POST /api/auth/login - 用户登录
router.post('/login', authController.login);

// POST /api/auth/register - 用户注册
router.post('/register', authController.register);

// GET /api/auth/me - 获取当前用户信息
router.get('/me', authController.getCurrentUser);

// 导出路由模块
export default router;