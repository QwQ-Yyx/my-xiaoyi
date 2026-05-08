/**
 * ============================================================
 * Map Controller - 非遗地图控制器
 * ============================================================
 * 处理地图点位的业务逻辑，包括:
 * - 获取所有地图点位
 * - 获取单个点位详情
 * - 获取地区统计
 * ============================================================
 */

import { getAll, getById, paginate, matchesSearch, matchesField } from '../data/db.js';

// 数据库集合名称
const COLLECTION = 'mapPoints';

// 可搜索的字段名
const SEARCH_FIELDS = ['name', 'description', 'region', 'address'];

/**
 * 获取所有地图点位
 * 支持查询参数:
 *   - type: 按类型筛选 (museum/workshop/heritage/site)
 *   - region: 按地区筛选
 *   - search: 关键词搜索
 *   - page: 页码 (默认1)
 *   - limit: 每页数量 (默认10)
 */
export async function getAllPoints(req, res, next) {
  try {
    // 从数据库获取所有数据
    let items = await getAll(COLLECTION);
    
    // 获取查询参数
    const type = req.query.type;
    const region = req.query.region;
    const search = req.query.search;
    const page = req.query.page;
    const limit = req.query.limit;
    
    // 按类型筛选
    if (type && type !== 'all') {
      items = items.filter(function (item) {
        return item.type === type;
      });
    }
    
    // 按地区筛选
    if (region && region !== 'all') {
      items = items.filter(function (item) {
        return item.region === region;
      });
    }
    
    // 关键词搜索 (在名称、描述、地区、地址中搜索)
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
      message: '获取地图点位列表成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 根据 ID 获取单个点位详情
 * 如果找不到对应的点位，返回 404 错误
 */
export async function getPointById(req, res, next) {
  try {
    const id = req.params.id;
    const item = await getById(COLLECTION, id);
    
    if (!item) {
      const error = new Error('地图点位不存在: ' + id);
      error.status = 404;
      throw error;
    }
    
    res.json({
      success: true,
      data: item,
      message: '获取地图点位详情成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 获取地区统计数据
 * 统计各地区的点位数量和各类型分布
 */
export async function getRegions(req, res, next) {
  try {
    const items = await getAll(COLLECTION);
    
    // 按地区统计
    const regionStats = {};
    const typeStats = {};
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // 地区统计
      if (!regionStats[item.region]) {
        regionStats[item.region] = 0;
      }
      regionStats[item.region]++;
      
      // 类型统计
      if (!typeStats[item.type]) {
        typeStats[item.type] = 0;
      }
      typeStats[item.type]++;
    }
    
    // 转换地区统计为数组格式
    const regionList = [];
    const regionKeys = Object.keys(regionStats);
    for (let j = 0; j < regionKeys.length; j++) {
      regionList.push({
        region: regionKeys[j],
        count: regionStats[regionKeys[j]]
      });
    }
    
    // 转换类型统计为数组格式
    const typeList = [];
    const typeKeys = Object.keys(typeStats);
    for (let k = 0; k < typeKeys.length; k++) {
      typeList.push({
        type: typeKeys[k],
        count: typeStats[typeKeys[k]]
      });
    }
    
    res.json({
      success: true,
      data: {
        total: items.length,
        regions: regionList,
        types: typeList
      },
      message: '获取地区统计成功'
    });
  } catch (err) {
    next(err);
  }
}

// 导出控制器函数（和路由里的函数名完全一致！）
export default {
  getAllPoints,
  getPointById,
  getRegions
};