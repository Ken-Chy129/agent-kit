---
name: security-and-hardening
description: 加固代码以防范安全漏洞。在处理用户输入、认证鉴权、数据存储或外部集成时使用。在构建任何接受不可信数据、管理用户会话或与第三方服务交互的功能时使用。
---

# 安全加固

## 概述

面向 Web 应用的安全优先开发实践。将每个外部输入视为恶意的，将每个密钥视为神圣的，将每次授权检查视为必须的。安全不是一个阶段——它是对每一行涉及用户数据、认证或外部系统的代码的约束。

## 何时使用

- 构建任何接受用户输入的功能
- 实现认证（Authentication）或授权（Authorization）
- 存储或传输敏感数据
- 集成外部 API 或服务
- 添加文件上传、Webhook 或回调
- 处理支付或 PII（个人身份信息）数据

## 三级边界体系

### 始终执行（无例外）

- **在系统边界验证所有外部输入**（API 路由、表单处理器）
- **参数化所有数据库查询** —— 绝不将用户输入拼接到 SQL 中
- **编码输出** 以防止 XSS（使用框架自动转义，不要绕过它）
- **使用 HTTPS** 进行所有外部通信
- **使用 bcrypt/scrypt/argon2 哈希密码**（绝不存储明文）
- **设置安全响应头**（CSP、HSTS、X-Frame-Options、X-Content-Type-Options）
- **使用 httpOnly、secure、sameSite cookie** 管理会话
- **在每次发布前运行 `npm audit`**（或等效工具）

### 先询问（需要人工批准）

- 添加新的认证流程或更改认证逻辑
- 存储新类别的敏感数据（PII、支付信息）
- 添加新的外部服务集成
- 更改 CORS 配置
- 添加文件上传处理器
- 修改速率限制或节流策略
- 授予提升的权限或角色

### 绝不执行

- **绝不将密钥提交到版本控制**（API 密钥、密码、令牌）
- **绝不记录敏感数据**（密码、令牌、完整信用卡号）
- **绝不将客户端验证作为安全边界**
- **绝不为了方便而禁用安全响应头**
- **绝不对用户提供的数据使用 `eval()` 或 `innerHTML`**
- **绝不将会话存储在客户端可访问的存储中**（如用 localStorage 存储认证令牌）
- **绝不向用户暴露堆栈跟踪** 或内部错误详情

## OWASP Top 10 防护

### 1. 注入攻击（SQL、NoSQL、OS 命令）

```typescript
// 错误：通过字符串拼接导致 SQL 注入
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// 正确：参数化查询
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// 正确：使用参数化输入的 ORM
const user = await prisma.user.findUnique({ where: { id: userId } });
```

### 2. 认证失效

```typescript
// 密码哈希
import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 12;
const hashedPassword = await hash(plaintext, SALT_ROUNDS);
const isValid = await compare(plaintext, hashedPassword);

// 会话管理
app.use(session({
  secret: process.env.SESSION_SECRET,  // 从环境变量获取，而非硬编码
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,     // JavaScript 不可访问
    secure: true,       // 仅 HTTPS
    sameSite: 'lax',    // CSRF 防护
    maxAge: 24 * 60 * 60 * 1000,  // 24 小时
  },
}));
```

### 3. 跨站脚本攻击（XSS）

```typescript
// 错误：将用户输入渲染为 HTML
element.innerHTML = userInput;

// 正确：使用框架自动转义（React 默认支持）
return <div>{userInput}</div>;

// 如果必须渲染 HTML，先进行净化
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
```

### 4. 访问控制失效

```typescript
// 始终检查授权，而不仅仅是认证
app.patch('/api/tasks/:id', authenticate, async (req, res) => {
  const task = await taskService.findById(req.params.id);

  // 检查已认证用户是否拥有此资源
  if (task.ownerId !== req.user.id) {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Not authorized to modify this task' }
    });
  }

  // 继续更新
  const updated = await taskService.update(req.params.id, req.body);
  return res.json(updated);
});
```

### 5. 安全配置错误

```typescript
// 安全响应头（Express 可使用 helmet）
import helmet from 'helmet';
app.use(helmet());

// 内容安全策略（CSP）
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],  // 尽可能收紧
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'"],
  },
}));

// CORS —— 限制为已知来源
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
}));
```

### 6. 敏感数据泄露

```typescript
// 绝不在 API 响应中返回敏感字段
function sanitizeUser(user: UserRecord): PublicUser {
  const { passwordHash, resetToken, ...publicFields } = user;
  return publicFields;
}

// 使用环境变量存储密钥
const API_KEY = process.env.STRIPE_API_KEY;
if (!API_KEY) throw new Error('STRIPE_API_KEY not configured');
```

## 输入验证模式

### 边界处的 Schema 验证

```typescript
import { z } from 'zod';

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().datetime().optional(),
});

// 在路由处理器中验证
app.post('/api/tasks', async (req, res) => {
  const result = CreateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: result.error.flatten(),
      },
    });
  }
  // result.data 现在已经过类型检查和验证
  const task = await taskService.create(result.data);
  return res.status(201).json(task);
});
```

### 文件上传安全

```typescript
// 限制文件类型和大小
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function validateUpload(file: UploadedFile) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new ValidationError('File type not allowed');
  }
  if (file.size > MAX_SIZE) {
    throw new ValidationError('File too large (max 5MB)');
  }
  // 不要信任文件扩展名——如果关键，请检查魔术字节
}
```

## npm audit 结果分诊

并非所有审计发现都需要立即处理。使用以下决策树：

```
npm audit 报告一个漏洞
├── 严重性：critical 或 high
│   ├── 漏洞代码在你的应用中是否可达？
│   │   ├── 是 --> 立即修复（更新、打补丁或替换依赖）
│   │   └── 否（仅开发依赖、未使用的代码路径）--> 尽快修复，但不阻塞发布
│   └── 是否有可用修复？
│       ├── 是 --> 更新到修复版本
│       └── 否 --> 检查变通方案，考虑替换依赖，或加入白名单并设定复查日期
├── 严重性：moderate
│   ├── 生产环境可达？--> 在下一个发布周期修复
│   └── 仅开发依赖？--> 方便时修复，记入待办
└── 严重性：low
    └── 在常规依赖更新时跟踪修复
```

**关键问题：**
- 漏洞函数是否真的在你的代码路径中被调用？
- 该依赖是运行时依赖还是仅开发依赖？
- 在你的部署上下文中漏洞是否可被利用（例如，客户端应用中的服务端漏洞）？

推迟修复时，记录原因并设定复查日期。

## 速率限制

```typescript
import rateLimit from 'express-rate-limit';

// 通用 API 速率限制
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100,                   // 每个时间窗口 100 个请求
  standardHeaders: true,
  legacyHeaders: false,
}));

// 认证端点的更严格限制
app.use('/api/auth/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,  // 每 15 分钟 10 次尝试
}));
```

## 密钥管理

```
.env 文件：
  ├── .env.example  → 已提交（包含占位值的模板）
  ├── .env          → 未提交（包含真实密钥）
  └── .env.local    → 未提交（本地覆盖）

.gitignore 必须包含：
  .env
  .env.local
  .env.*.local
  *.pem
  *.key
```

**提交前始终检查：**
```bash
# 检查是否意外暂存了密钥
git diff --cached | grep -i "password\|secret\|api_key\|token"
```

## 安全审查清单

```markdown
### 认证
- [ ] 密码使用 bcrypt/scrypt/argon2 哈希（盐轮次 ≥ 12）
- [ ] 会话令牌设置了 httpOnly、secure、sameSite
- [ ] 登录接口有速率限制
- [ ] 密码重置令牌会过期

### 授权
- [ ] 每个端点都检查用户权限
- [ ] 用户只能访问自己的资源
- [ ] 管理员操作需要管理员角色验证

### 输入
- [ ] 所有用户输入在边界处验证
- [ ] SQL 查询已参数化
- [ ] HTML 输出已编码/转义

### 数据
- [ ] 代码或版本控制中没有密钥
- [ ] API 响应中排除了敏感字段
- [ ] PII 静态加密（如适用）

### 基础设施
- [ ] 安全响应头已配置（CSP、HSTS 等）
- [ ] CORS 限制为已知来源
- [ ] 依赖已审计，无已知漏洞
- [ ] 错误消息不暴露内部细节
```

## 常见自我合理化

| 合理化借口 | 现实 |
|---|---|
| "这是内部工具，安全无所谓" | 内部工具也会被攻陷。攻击者专挑最薄弱的环节。 |
| "我们以后再加安全" | 安全改造比内建难 10 倍。现在就加。 |
| "没人会去利用这个漏洞" | 自动化扫描器会发现它。隐蔽式安全不是真正的安全。 |
| "框架会处理安全问题" | 框架提供工具，不提供保证。你仍然需要正确使用它们。 |
| "这只是个原型" | 原型会变成生产代码。从第一天起就养成安全习惯。 |

## 危险信号

- 用户输入直接传递给数据库查询、Shell 命令或 HTML 渲染
- 源代码或提交历史中存在密钥
- API 端点缺少认证或授权检查
- 缺少 CORS 配置或使用通配符（`*`）来源
- 认证端点没有速率限制
- 堆栈跟踪或内部错误暴露给用户
- 依赖存在已知的严重漏洞

## 验证

实现安全相关代码后：

- [ ] `npm audit` 没有 critical 或 high 级别漏洞
- [ ] 源代码或 git 历史中没有密钥
- [ ] 所有用户输入在系统边界处验证
- [ ] 每个受保护端点都检查了认证和授权
- [ ] 响应中存在安全响应头（用浏览器 DevTools 检查）
- [ ] 错误响应不暴露内部细节
- [ ] 认证端点已启用速率限制
