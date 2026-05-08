import { Low } from 'lowdb';
import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 兼容 ESModule 的 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据库文件路径
const DB_PATH = path.join(__dirname, 'db.json');

// 如果数据库文件不存在，创建一个空的 JSON 文件
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({}, null, 2));
}

// 用 JSONFilePreset 创建实例（v7 推荐方式，无需额外依赖）
const db = await JSONFilePreset(DB_PATH, {
  heritages: [],
  inheritors: [],
  courses: [],
  videos: [],
  news: [],
  products: [],
  posts: [],
  mapPoints: [],
  users: []
});

/**
 * 通用数据库工具函数（和原来的接口完全一样，控制器不用改）
 */
const dbUtils = {
  getAll: async function (collection) {
    return db.data[collection] || [];
  },

  getById: async function (collection, id) {
    const items = db.data[collection] || [];
    return items.find(item => item.id === id) || null;
  },

  filter: async function (collection, predicate) {
    const items = db.data[collection] || [];
    return items.filter(predicate);
  },

  insert: async function (collection, data) {
    if (!db.data[collection]) {
      db.data[collection] = [];
    }
    db.data[collection].push(data);
    await db.write();
    return data;
  },

  paginate: function (items, page, limit) {
    page = Math.max(1, parseInt(page) || 1);
    limit = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const total = items.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);
    return {
      data: paginatedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },

  matchesSearch: function (item, keyword, fields) {
    if (!keyword || !keyword.trim()) return true;
    const lowerKeyword = keyword.toLowerCase();
    return fields.some(field => {
      const value = item[field];
      return value && typeof value === 'string' && value.toLowerCase().includes(lowerKeyword);
    });
  },

  matchesField: function (item, field, value) {
    if (!value || value === '' || value === 'all') return true;
    return item[field] === value;
  }
};

// 导出（修正了重复声明的问题）
export { db };
export const getAll = dbUtils.getAll;
export const getById = dbUtils.getById;
export const filter = dbUtils.filter;
export const insert = dbUtils.insert;
export const paginate = dbUtils.paginate;
export const matchesSearch = dbUtils.matchesSearch;
export const matchesField = dbUtils.matchesField;

export default {
  db,
  getAll,
  getById,
  filter,
  insert,
  paginate,
  matchesSearch,
  matchesField
};