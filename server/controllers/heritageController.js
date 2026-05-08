/**
 * ============================================================
 * Heritage Controller - 非遗项目控制器
 * ============================================================
 * 处理非遗项目的业务逻辑，包括:
 * - 获取所有非遗项目列表 (支持分页、筛选、搜索)
 * - 获取单个非遗项目详情
 * - 获取所有分类
 * - 获取所有地区
 * ============================================================
 */

import { getAll, getById, paginate, matchesSearch, matchesField } from '../data/db.js';

// 数据库集合名称（关键修复：改成复数，和数据文件完全一致！）
const COLLECTION = 'heritages';

// 可搜索的字段名
const SEARCH_FIELDS = ['name', 'description', 'region', 'tags'];

/**
 * 获取所有非遗项目
 * 支持查询参数:
 *   - category: 按分类筛选
 *   - region: 按地区筛选
 *   - level: 按级别筛选
 *   - search: 关键词搜索
 *   - page: 页码 (默认1)
 *   - limit: 每页数量 (默认10)
 */
export async function getAllHeritages(req, res, next) {
  try {
    // 从数据库获取所有数据
    let items = await getAll(COLLECTION);
    
    // 确保items是数组
    if (!Array.isArray(items)) {
      console.warn(`警告：${COLLECTION} 集合返回的不是数组，已转换为空数组`);
      items = [];
    }
    
    // 获取查询参数
    const category = req.query.category;
    const region = req.query.region;
    const level = req.query.level;
    const search = req.query.search;
    const page = req.query.page;
    const limit = req.query.limit;
    
    // 按分类筛选
    if (category && category !== 'all') {
      items = items.filter(function (item) {
        return matchesField(item, 'category', category);
      });
    }
    
    // 按地区筛选
    if (region && region !== 'all') {
      items = items.filter(function (item) {
        return matchesField(item, 'region', region);
      });
    }
    
    // 按级别筛选
    if (level && level !== 'all') {
      items = items.filter(function (item) {
        return matchesField(item, 'level', level);
      });
    }
    
    // 关键词搜索 (在名称、描述、地区、标签中搜索)
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
      message: '获取非遗项目列表成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 根据 ID 获取单个非遗项目详情
 * 如果找不到对应的项目，返回 404 错误
 */
export async function getHeritageById(req, res, next) {
  try {
    const id = req.params.id;
    const item = await getById(COLLECTION, id);
    
    if (!item) {
      const error = new Error('非遗项目不存在: ' + id);
      error.status = 404;
      throw error;
    }
    
    res.json({
      success: true,
      data: item,
      message: '获取非遗项目详情成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 获取所有非遗分类列表
 * 从数据中动态提取所有不重复的分类
 */
export async function getCategories(req, res, next) {
  try {
    let items = await getAll(COLLECTION);
    
    // 确保items是数组
    if (!Array.isArray(items)) {
      items = [];
    }
    
    // 使用对象键来去重，然后提取为数组
    const categoryMap = {};
    for (let i = 0; i < items.length; i++) {
      categoryMap[items[i].category] = true;
    }
    const categories = Object.keys(categoryMap);
    
    res.json({
      success: true,
      data: categories,
      message: '获取分类列表成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 获取所有地区列表
 * 从数据中动态提取所有不重复的地区
 */
export async function getRegions(req, res, next) {
  try {
    let items = await getAll(COLLECTION);
    
    // 确保items是数组
    if (!Array.isArray(items)) {
      items = [];
    }
    
    // 使用对象键来去重
    const regionMap = {};
    for (let i = 0; i < items.length; i++) {
      regionMap[items[i].region] = true;
    }
    const regions = Object.keys(regionMap);
    
    res.json({
      success: true,
      data: regions,
      message: '获取地区列表成功'
    });
  } catch (err) {
    next(err);
  }
}

// 导出控制器函数
export default {
  getAllHeritages,
  getHeritageById,
  getCategories,
  getRegions
};