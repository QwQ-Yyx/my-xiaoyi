/**
 * ============================================================
 * Shop Controller - 文创商城控制器
 * ============================================================
 * 处理文创商城商品的业务逻辑，包括:
 * - 获取所有商品列表 (支持分页、筛选、搜索)
 * - 获取单个商品详情
 * - 获取商品分类
 * ============================================================
 */

import { getAll, getById, paginate, matchesSearch, matchesField } from '../data/db.js';

// 数据库集合名称
const COLLECTION = 'products';

// 可搜索的字段名
const SEARCH_FIELDS = ['name', 'description', 'category', 'tags'];

/**
 * 获取所有商品
 * 支持查询参数:
 *   - category: 按分类筛选
 *   - search: 关键词搜索
 *   - page: 页码 (默认1)
 *   - limit: 每页数量 (默认10)
 */
export async function getAllProducts(req, res, next) {
  try {
    // 从数据库获取所有数据
    let items = await getAll(COLLECTION);
    
    // 获取查询参数
    const category = req.query.category;
    const search = req.query.search;
    const page = req.query.page;
    const limit = req.query.limit;
    
    // 按分类筛选
    if (category && category !== 'all') {
      items = items.filter(function (item) {
        return item.category === category;
      });
    }
    
    // 关键词搜索 (在名称、描述、分类、标签中搜索)
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
      message: '获取商品列表成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 根据 ID 获取单个商品详情
 * 如果找不到对应的商品，返回 404 错误
 */
export async function getProductById(req, res, next) {
  try {
    const id = req.params.id;
    const item = await getById(COLLECTION, id);
    
    if (!item) {
      const error = new Error('商品不存在: ' + id);
      error.status = 404;
      throw error;
    }
    
    res.json({
      success: true,
      data: item,
      message: '获取商品详情成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 获取所有商品分类列表
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
      message: '获取商品分类列表成功'
    });
  } catch (err) {
    next(err);
  }
}

// 导出控制器函数（只导出存在的函数！）
export default {
  getAllProducts,
  getProductById,
  getCategories
};