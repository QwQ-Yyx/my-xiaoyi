/**
 * ============================================================
 * Auth Controller - 认证控制器
 * ============================================================
 * 处理用户认证的业务逻辑，包括:
 * - 用户登录 (模拟)
 * - 用户注册 (模拟)
 * - 获取当前用户信息 (模拟)
 * ============================================================
 * 注意: 本系统为演示项目，使用模拟认证，
 * 实际生产环境应使用 JWT + 密码加密
 * ============================================================
 */

import { insert } from '../data/db.js';
// 数据库集合名称
const COLLECTION = 'users';

/**
 * 模拟用户登录
 * 接收用户名和密码，验证成功后返回模拟用户信息和 token
 * 请求体: { username: string, password: string }
 */

export function login(req, res, next) {
  try {
    const body = req.body;
    
    // 参数校验
    if (!body.username || body.username.trim() === '') {
      const error = new Error('用户名不能为空');
      error.status = 400;
      throw error;
    }
    
    if (!body.password || body.password.trim() === '') {
      const error = new Error('密码不能为空');
      error.status = 400;
      throw error;
    }
    
    // 模拟登录验证 (实际应从数据库验证)
    // 演示项目: 接受任意用户名密码，返回模拟用户
    const username = body.username.trim();
    const now = new Date().toISOString();
    
    // 生成模拟用户数据
    const user = {
      id: 'user-' + Date.now(),
      username: username,
      nickname: username,
      avatar: 'https://picsum.photos/id/64/200/200',
      email: username + '@example.com',
      role: 'user',
      createdAt: now
    };
    
    // 生成模拟 token (实际应使用 JWT)
    const token = 'mock_token_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    
    res.json({
      success: true,
      data: {
        user: user,
        token: token
      },
      message: '登录成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 模拟用户注册
 * 接收注册信息，创建模拟用户
 * 请求体: { username: string, password: string, email?: string }
 */
export function register(req, res, next) {
  try {
    const body = req.body;
    
    // 参数校验
    if (!body.username || body.username.trim() === '') {
      const error = new Error('用户名不能为空');
      error.status = 400;
      throw error;
    }
    
    if (!body.password || body.password.trim() === '') {
      const error = new Error('密码不能为空');
      error.status = 400;
      throw error;
    }
    
    if (body.password.length < 6) {
      const error = new Error('密码长度不能少于6位');
      error.status = 400;
      throw error;
    }
    
    const username = body.username.trim();
    const now = new Date().toISOString();
    
    // 创建模拟用户
    const user = {
      id: 'user-' + Date.now(),
      username: username,
      nickname: body.nickname || username,
      avatar: 'https://picsum.photos/id/65/200/200',
      email: body.email || username + '@example.com',
      role: 'user',
      createdAt: now
    };
    
    // 存入数据库 (实际应加密密码)
    insert(COLLECTION, user);
    
    // 生成模拟 token
    const token = 'mock_token_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    
    res.status(201).json({
      success: true,
      data: {
        user: user,
        token: token
      },
      message: '注册成功'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 获取当前用户信息 (模拟)
 * 实际应从请求头的 token 中解析用户信息
 */
export function getCurrentUser(req, res, next) {
  try {
    // 模拟返回当前登录用户信息
    const now = new Date().toISOString();
    const user = {
      id: 'user-mock-001',
      username: 'demo_user',
      nickname: '荆楚文化爱好者',
      avatar: 'https://picsum.photos/id/64/200/200',
      email: 'demo@jingchu.com',
      role: 'user',
      createdAt: '2024-01-01T00:00:00.000Z'
    };
    
    res.json({
      success: true,
      data: user,
      message: '获取用户信息成功'
    });
  } catch (err) {
    next(err);
  }
}

// 导出控制器函数
export default {
  login,
  register,
  getCurrentUser
};
