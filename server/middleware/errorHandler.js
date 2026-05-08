/**
 * ============================================================
 * 统一错误处理中间件
 * ============================================================
 * 处理 404 路由未找到和全局服务器错误
 * 统一响应格式: { success: boolean, data: null, message: string }
 * ============================================================
 */

/**
 * 404 路由未找到处理中间件
 * 当没有任何路由匹配请求时，会进入此中间件
 */
export function notFoundHandler(req, res, next) {
  // 构造 404 错误对象
  const error = new Error('请求的资源不存在: ' + req.originalUrl);
  error.status = 404;
  
  // 传递给下一个错误处理中间件
  next(error);
}

/**
 * 全局错误处理中间件
 * 捕获应用中的所有错误，统一格式化响应
 * Express 通过 4 个参数识别错误处理中间件
 */
export function errorHandler(err, req, res, next) {
  // 确定 HTTP 状态码: 使用错误对象的 status 或默认为 500
  const statusCode = err.status || err.statusCode || 500;
  
  // 确定错误消息
  const message = err.message || '服务器内部错误';
  
  // 开发环境下打印错误堆栈
  if (process.env.NODE_ENV === 'development') {
    console.error('[ErrorHandler] 错误详情:');
    console.error('  状态码:', statusCode);
    console.error('  消息:', message);
    console.error('  堆栈:', err.stack);
  }
  
  // 生产环境下隐藏敏感信息 (500 错误显示通用消息)
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = '服务器内部错误，请稍后重试';
  }
  
  // 发送统一格式的错误响应
  res.status(statusCode).json({
    success: false,
    data: null,
    message: message
  });
}