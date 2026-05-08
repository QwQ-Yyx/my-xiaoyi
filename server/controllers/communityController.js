/**
 * ============================================================
 * Community Controller - 交流社区控制器
 * ============================================================
 * 处理社区帖子的业务逻辑，包括:
 * - 获取所有帖子列表 (支持分页、筛选、排序)
 * - 获取单个帖子详情
 * - 创建新帖子 (模拟)
 * - 获取社区分类
 * ============================================================
 */

import { getAll, getById, insert, paginate, matchesSearch, matchesField } from '../data/db.js';

// 数据库集合名称
const COLLECTION = 'posts';

// 可搜索的字段名
const SEARCH_FIELDS = ['title', 'content', 'author', 'category'];

/**
 * 获取所有帖子
 * 支持查询参数:
 *   - category: 按分类筛选
 *   - sort: 排序方式 (latest-最新, hot-最热)
 *   - search: 关键词搜索
 *   - page: 页码 (默认1)
 *   - limit: 每页数量 (默认10)
 */
export async function getAllPosts(req, res, next) {
  try {
    // 从数据库获取所有数据
    let items = await getAll(COLLECTION);
    
    // 获取查询参数
    const category = req.query.category;
    const sort = req.query.sort;
    const search = req.query.search;
    const page = req.query.page;
    const limit = req.query.limit;
    
    // 按分类筛选
    if (category && category !== 'all') {
      items = items.filter(function (item) {
        return item.category === category;
      });
    }
    
    // 关键词搜索 (在标题、内容、作者、分类中搜索)
    if (search && search.trim() !== '') {
      items = items.filter(function (item) {
        return matchesSearch(item, search, SEARCH_FIELDS);
      });
    }
    
    // 排序处理
    if (sort === 'hot') {
      // 按热度排序 (views + likes * 2 综合计算)
      items.sort(function (a, b) {
        const hotA = a.views + a.likes * 2;
        const hotB = b.views + b.likes * 2;
        return hotB - hotA;
      });
    } else {
      // 默认按时间排序 (最新的在前)
      items.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
    
    // 分页处理
    const result = paginate(items, page, limit);
    
    // 返回成功响应
    res.json({
      success: true,
      data: result,
      message: '获取帖子列表成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 根据 ID 获取单个帖子详情
 * 如果找不到对应的帖子，返回 404 错误
 */
export async function getPostById(req, res, next) {
  try {
    const id = req.params.id;
    const item = await getById(COLLECTION, id);
    
    if (!item) {
      const error = new Error('帖子不存在: ' + id);
      error.status = 404;
      throw error;
    }
    
    res.json({
      success: true,
      data: item,
      message: '获取帖子详情成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 创建新帖子 (模拟)
 * 接收请求体中的帖子数据，生成 ID 和时间戳后存入数据库
 */
export async function createPost(req, res, next) {
  try {
    // 从请求体中获取帖子数据
    const body = req.body;
    
    // 参数校验
    if (!body.title || body.title.trim() === '') {
      const error = new Error('帖子标题不能为空');
      error.status = 400;
      throw error;
    }
    
    if (!body.content || body.content.trim() === '') {
      const error = new Error('帖子内容不能为空');
      error.status = 400;
      throw error;
    }
    
    // 生成新帖子对象
    const now = new Date().toISOString();
    const newPost = {
      id: 'post-' + Date.now(),
      title: body.title.trim(),
      author: body.author || '匿名用户',
      avatar: body.avatar || 'https://picsum.photos/id/100/200/200',
      category: body.category || '学习交流',
      content: body.content.trim(),
      images: body.images || [],
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: now,
      isHot: false
    };
    
    // 插入数据库
    await insert(COLLECTION, newPost);
    
    res.status(201).json({
      success: true,
      data: newPost,
      message: '帖子创建成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 获取所有社区分类列表
 * 从数据中动态提取所有不重复的分类
 */
export async function getCategories(req, res, next) {
  try {
    const items = await getAll(COLLECTION);
    
    // 使用对象键来去重
    const categoryMap = {};
    for (let i = 0; i < items.length; i++) {
      categoryMap[items[i].category] = true;
    }
    const categories = Object.keys(categoryMap);
    
    res.json({
      success: true,
      data: categories,
      message: '获取社区分类列表成功'
    });
  } catch (err) {
    next(err);
  }
}

// 导出控制器函数（只导出存在的函数！）
export default {
  getAllPosts,
  getPostById,
  createPost,
  getCategories
};