/**
 * ============================================================
 * Inheritors Controller - 传承人控制器
 * ============================================================
 * 处理传承人的业务逻辑
 * 支持获取列表、详情、分类筛选、搜索和分页
 * ============================================================
 */

import { getAll, getById, paginate, matchesSearch, matchesField } from '../data/db.js';

// 数据库集合名称
const COLLECTION = 'inheritors';

/**
 * 获取所有传承人列表
 * 支持查询参数:
 *   - page: 页码 (默认1)
 *   - limit: 每页数量 (默认10)
 *   - keyword: 搜索关键词
 *   - category: 分类筛选
 *   - region: 地区筛选
 *   - level: 级别筛选 (国家级/省级/市级)
 */
export async function getAllInheritors(req, res, next) {
  try {
    const { page = 1, limit = 10, keyword, category, region, level } = req.query;
    let list = await getAll(COLLECTION);

    // 关键词搜索
    if (keyword) {
      list = list.filter(item => matchesSearch(item, keyword, ['name', 'bio', 'specialty', 'region']));
    }

    // 分类筛选
    if (category) {
      list = list.filter(item => matchesField(item, 'category', category));
    }

    // 地区筛选
    if (region) {
      list = list.filter(item => matchesField(item, 'region', region));
    }

    // 级别筛选
    if (level) {
      list = list.filter(item => matchesField(item, 'level', level));
    }

    // 分页
    const result = paginate(list, page, limit);
    res.json({
      success: true,
      data: result,
      message: '获取传承人列表成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 根据 ID 获取单个传承人详情
 */
export async function getInheritorById(req, res, next) {
  try {
    const item = await getById(COLLECTION, req.params.id);
    if (!item) {
      const error = new Error('传承人不存在');
      error.status = 404;
      throw error;
    }

    res.json({
      success: true,
      data: item,
      message: '获取传承人详情成功'
    });
  } catch (err) {
    next(err);
  }
}

// 导出控制器函数（只导出存在的函数！）
export default {
  getAllInheritors,
  getInheritorById
};