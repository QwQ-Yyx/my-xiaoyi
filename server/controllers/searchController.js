/**
 * ============================================================
 * Search Controller - 搜索控制器
 * ============================================================
 * 处理全局搜索的业务逻辑
 * 支持在非遗项目、传承人、新闻、视频、商品中搜索
 * ============================================================
 */

import { getAll } from '../data/db.js';

/**
 * 全局搜索
 * 支持查询参数:
 *   - q: 搜索关键词 (必填)
 *   - type: 搜索类型 (all/heritage/inheritors/news/videos/shop，默认all)
 *   - page: 页码 (默认1)
 *   - limit: 每页数量 (默认10)
 */
export function search(req, res, next) {
  try {
    // 获取搜索关键词
    const keyword = req.query.q;
    const type = req.query.type || 'all';
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    
    // 校验关键词
    if (!keyword || keyword.trim() === '') {
      const error = new Error('请输入搜索关键词');
      error.status = 400;
      throw error;
    }
    
    const searchTerm = keyword.trim().toLowerCase();
    const results = {};
    
    // 搜索非遗项目
    if (type === 'all' || type === 'heritage') {
      const heritages = getAll('heritages').filter(function (item) {
        return matchesKeyword(item, searchTerm, ['name', 'description', 'category', 'region', 'tags']);
      });
      results.heritages = heritages;
    }
    
    // 搜索传承人
    if (type === 'all' || type === 'inheritors') {
      const inheritors = getAll('inheritors').filter(function (item) {
        return matchesKeyword(item, searchTerm, ['name', 'bio', 'specialty', 'region', 'title']);
      });
      results.inheritors = inheritors;
    }
    
    // 搜索新闻
    if (type === 'all' || type === 'news') {
      const news = getAll('news').filter(function (item) {
        return matchesKeyword(item, searchTerm, ['title', 'summary', 'content', 'tags']);
      });
      results.news = news;
    }
    
    // 搜索视频
    if (type === 'all' || type === 'videos') {
      const videos = getAll('videos').filter(function (item) {
        return matchesKeyword(item, searchTerm, ['title', 'description', 'category']);
      });
      results.videos = videos;
    }
    
    // 搜索商品
    if (type === 'all' || type === 'shop') {
      const products = getAll('products').filter(function (item) {
        return matchesKeyword(item, searchTerm, ['name', 'description', 'category', 'tags']);
      });
      results.products = products;
    }
    
    // 计算总结果数
    let totalCount = 0;
    const keys = Object.keys(results);
    for (let i = 0; i < keys.length; i++) {
      totalCount += results[keys[i]].length;
    }
    
    res.json({
      success: true,
      data: {
        keyword: keyword.trim(),
        type: type,
        totalCount: totalCount,
        results: results
      },
      message: '搜索完成，共找到 ' + totalCount + ' 条结果'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 检查数据项是否匹配关键词
 * 在指定字段中搜索关键词 (不区分大小写)
 * @param {Object} item - 数据项
 * @param {string} keyword - 搜索关键词
 * @param {string[]} fields - 要搜索的字段名数组
 * @returns {boolean} 是否匹配
 */
function matchesKeyword(item, keyword, fields) {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const value = item[field];
    
    if (value) {
      if (typeof value === 'string') {
        // 字符串字段: 检查是否包含关键词
        if (value.toLowerCase().indexOf(keyword) !== -1) {
          return true;
        }
      } else if (Array.isArray(value)) {
        // 数组字段 (如标签): 检查数组元素是否包含关键词
        for (let j = 0; j < value.length; j++) {
          if (typeof value[j] === 'string' && value[j].toLowerCase().indexOf(keyword) !== -1) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

// 导出控制器函数
export default {
  search
};