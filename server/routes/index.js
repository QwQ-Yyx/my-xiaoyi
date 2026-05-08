/**
 * ============================================================
 * Routes Index - 路由聚合模块
 * ============================================================
 * 将所有业务路由聚合到统一的 Router 实例中
 * 并挂载到 /api 前缀下
 * 
 * 挂载路径:
 *   /api/heritage   -> 非遗项目路由
 *   /api/inheritors -> 传承人路由
 *   /api/learning   -> 在线课程路由
 *   /api/videos     -> 视频路由
 *   /api/news       -> 新闻资讯路由
 *   /api/shop       -> 文创商城路由
 *   /api/community  -> 交流社区路由
 *   /api/map        -> 非遗地图路由
 *   /api/auth       -> 认证路由
 *   /api/search     -> 全局搜索路由
 * ============================================================
 */

import express from 'express';
const router = express.Router();

// 导入各业务模块路由
import heritageRoutes from './heritage.js';
import inheritorsRoutes from './inheritors.js';
import learningRoutes from './learning.js';
import videosRoutes from './videos.js';
import newsRoutes from './news.js';
import shopRoutes from './shop.js';
import communityRoutes from './community.js';
import mapRoutes from './map.js';
import authRoutes from './auth.js';

// 导入搜索控制器
import searchController from '../controllers/searchController.js';

// 挂载各业务路由
router.use('/heritage', heritageRoutes);
router.use('/inheritors', inheritorsRoutes);
router.use('/learning', learningRoutes);
router.use('/videos', videosRoutes);
router.use('/news', newsRoutes);
router.use('/shop', shopRoutes);
router.use('/community', communityRoutes);
router.use('/map', mapRoutes);
router.use('/auth', authRoutes);

// 全局搜索路由
router.get('/search', searchController.search);

export default router;