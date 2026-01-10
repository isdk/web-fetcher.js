interface RetryConfig {
  // 基础配置
  maxAttempts?: number // 最大重试次数（默认 0，不重试）

  // 可重试的错误
  retryableErrors?: Array<string | RegExp | ErrorMatcher>

  // 不可重试的错误（优先级高于 retryableErrors）
  nonRetryableErrors?: Array<string | RegExp | ErrorMatcher>

  // 退避策略
  backoff?: BackoffConfig

  // 自定义重试判断
  shouldRetry?: (error: Error, attempt: number) => boolean
}

type ErrorMatcher = (error: Error) => boolean

interface BackoffConfig {
  strategy?: 'fixed' | 'linear' | 'exponential' // 默认 'exponential'
  initialDelay?: number // 初始延迟（毫秒），默认 1000
  maxDelay?: number // 最大延迟（毫秒），默认 30000
  multiplier?: number // 倍增因子（exponential），默认 2
  jitter?: boolean // 是否添加随机抖动，默认 true
}

// 内置错误分类器
class ErrorClassifier {
  // 默认可重试的错误类型
  static readonly RETRYABLE_PATTERNS = [
    /ENOTFOUND/, // DNS 解析失败
    /ECONNREFUSED/, // 连接被拒绝
    /ETIMEDOUT/, // 超时
    /timeout/i, // 通用超时
    /429/, // 限流
    /5\d{2}/, // 5xx 服务器错误
    /network\s+error/i, // 网络错误
    /socket\s+hang\s+up/i, // Socket 挂起
  ]

  // 默认不可重试的错误
  static readonly NON_RETRYABLE_PATTERNS = [
    /40[0134]/, // 400, 401, 403, 404
    /validation\s+error/i, // 验证错误
    /authentication/i, // 认证错误
    /authorization/i, // 授权错误
  ]

  static isRetryable(error: Error, config?: RetryConfig): boolean {
    // 1. 检查非可重试（优先级最高）
    if (config?.nonRetryableErrors) {
      if (this.matchesPatterns(error, config.nonRetryableErrors)) {
        return false
      }
    } else if (this.matchesPatterns(error, this.NON_RETRYABLE_PATTERNS)) {
      return false
    }

    // 2. 自定义判断
    if (config?.shouldRetry) {
      return config.shouldRetry(error, 0)
    }

    // 3. 检查可重试
    if (config?.retryableErrors) {
      return this.matchesPatterns(error, config.retryableErrors)
    }

    // 4. 默认策略
    return this.matchesPatterns(error, this.RETRYABLE_PATTERNS)
  }

  private static matchesPatterns(
    error: Error,
    patterns: Array<string | RegExp | ErrorMatcher>
  ): boolean {
    return patterns.some((pattern) => {
      if (typeof pattern === 'string') {
        return error.message.includes(pattern)
      } else if (pattern instanceof RegExp) {
        return pattern.test(error.message)
      } else {
        return pattern(error)
      }
    })
  }
}
