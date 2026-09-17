## Context

web-api-server 当前所有增删改操作仅在内存中进行，重启后数据丢失。对比 react-app 的 mockApi（`mockAdapter.ts` 中实现了对 mockApi 内存数据的增删改），需要实现 JSON 文件持久化，确保数据操作后自动写入文件。

## Goals / Non-Goals

**Goals:**
- 每次增删改操作后自动将数据写回 JSON 文件
- 创建 data/initial/ 目录备份初始化 JSON 文件
- 创建 data/backup/ 目录存储运行时备份
- 创建 restore_data.bat 批处理脚本还原初始化数据
- 创建 backup_data.py 启动时自动备份当前数据

**Non-Goals:**
- 不包含数据库集成
- 不包含增量备份（每次全量覆盖）
- 不包含并发锁（单线程环境）

## Decisions

### 1. 写入时机
- **选择**: 每次增删改操作完成后立即写入
- **理由**: 与 react-app mockApi 行为一致；数据实时持久化，不丢失
- **替代方案**: 定时批量写入（复杂且可能丢失数据）

### 2. 备份策略
- **选择**: 启动时自动备份到 data/backup/ 目录
- **理由**: 保留操作前的数据快照，便于回滚
- **替代方案**: 手动备份（易遗忘）

### 3. 还原脚本
- **选择**: Python 脚本 + .bat 批处理
- **理由**: .bat 方便双击执行，Python 脚本确保跨平台兼容
- **替代方案**: 纯批处理复制命令

### 4. 项目结构
```
web-api-server/
├── data/
│   ├── time_entries.json      # 运行时数据
│   ├── users.json
│   ├── roles.json
│   ├── initial/               # 初始化备份
│   │   ├── time_entries.json
│   │   ├── users.json
│   │   └── roles.json
│   └── backup/                # 运行时备份
│       ├── time_entries.json
│       ├── users.json
│       └── roles.json
├── backup_data.py             # 备份脚本
├── restore_data.py            # 还原脚本
├── restore_data.bat           # Windows 批处理入口
└── data_loader.py             # 数据加载/保存模块
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| JSON 写入失败导致操作失败 | 捕获异常但不阻塞请求，记录日志 |
| 并发写入冲突 | 单线程环境，不涉及并发 |
| 备份文件占用空间 | 仅保留一份备份，后续可扩展版本管理 |