/**
 * ============================================================
 * Learning Controller - 在线课程控制器
 * ============================================================
 * 处理在线学习课程的业务逻辑，包括:
 * - 获取所有课程列表 (支持分页、筛选、搜索)
 * - 获取单个课程详情
 * - 获取课程分类
 * ============================================================
 */

import { getAll, getById, paginate, matchesSearch, matchesField } from '../data/db.js';

// 数据库集合名称
const COLLECTION = 'courses';

// 可搜索的字段名
const SEARCH_FIELDS = ['title', 'description', 'instructor', 'tags'];

/**
 * 获取所有课程
 * 支持查询参数:
 *   - category: 按分类筛选
 *   - level: 按难度筛选 (入门/进阶/高级)
 *   - search: 关键词搜索
 *   - page: 页码 (默认1)
 *   - limit: 每页数量 (默认10)
 */
export async function getAllCourses(req, res, next) {
  try {
    // 从数据库获取所有数据
    let items = await getAll(COLLECTION);
    
    // 获取查询参数
    const category = req.query.category;
    const level = req.query.level;
    const search = req.query.search;
    const page = req.query.page;
    const limit = req.query.limit;
    
    // 按分类筛选
    if (category && category !== 'all') {
      items = items.filter(function (item) {
        return item.category === category;
      });
    }
    
    // 按难度筛选
    if (level && level !== 'all') {
      items = items.filter(function (item) {
        return item.level === level;
      });
    }
    
    // 关键词搜索 (在标题、描述、讲师、标签中搜索)
    if (search && search.trim() !== '') {
      items = items.filter(function (item) {
        return matchesSearch(item, search, SEARCH_FIELDS);
      });
    }
    
    // 分页处理
    const result = paginate(items, page, limit);
    
    // 返回成功响应
    res.json({
      success: true,
      data: result,
      message: '获取课程列表成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 根据 ID 获取单个课程详情
 * 如果找不到对应的课程，返回 404 错误
 */
export async function getCourseById(req, res, next) {
  try {
    const id = req.params.id;
    const item = await getById(COLLECTION, id);
    
    if (!item) {
      const error = new Error('课程不存在: ' + id);
      error.status = 404;
      throw error;
    }
    
    res.json({
      success: true,
      data: item,
      message: '获取课程详情成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 获取所有课程分类列表
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
      message: '获取课程分类列表成功'
    });
  } catch (err) {
    next(err);
  }
}

// 导出控制器函数（只导出存在的函数！）
export default {
  getAllCourses,
  getCourseById,
  getCategories
};