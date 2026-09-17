## Why

web-api-server 当前所有增删改操作仅在内存中进行，重启后数据丢失，无法持久化到 JSON 文件。对比 react-app 的 mockApi 功能，需要实现数据持久化，使每次增删改操作后立即写入 JSON 文件，确保数据不丢失。同时需要备份初始化 JSON 文件，并提供还原脚本。

## What Changes

- 修改 data_loader.py，增加 JSON 文件写入功能（save_time_entries, save_users, save_roles）
- 修改所有增删改路由文件，在数据操作完成后自动调用保存函数
- 创建 data/initial/ 目录，备份原始初始化 JSON 文件
- 创建 restore_data.bat 批处理脚本，执行后还原初始化 JSON 文件
- 启动时自动备份当前 JSON 到 data/backup/ 目录

## Capabilities

### New Capabilities
- `json-persistence`: JSON 文件持久化读写功能
- `data-restore`: 数据备份与还原脚本

## Impact

- 修改: web-api-server/data_loader.py（增加写入功能）
- 修改: web-api-server/routes_time_entry.py（增删改后持久化）
- 修改: web-api-server/routes_user.py（增删改后持久化）
- 修改: web-api-server/routes_role.py（增删改后持久化）
- 新增: web-api-server/data/initial/（备份目录）
- 新增: web-api-server/data/backup/（运行时备份目录）
- 新增: web-api-server/restore_data.bat（还原脚本）
- 新增: web-api-server/backup_data.py（备份脚本）