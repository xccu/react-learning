## ADDED Requirements

### Requirement: 系统能够验证用户登录
系统必须允许用户通过用户名和密码登录，登录时验证用户是否存在且密码正确。

#### Scenario: 正确用户名和密码登录成功
- **WHEN** 用户输入已存在的用户名和正确的密码点击"登录"
- **THEN** 系统验证成功，保存用户信息到 Redux store，跳转到主页

#### Scenario: 用户名不存在时登录失败
- **WHEN** 用户输入不存在的用户名点击"登录"
- **THEN** 系统提示"用户名或密码错误"，不保存用户信息

#### Scenario: 密码错误时登录失败
- **WHEN** 用户输入正确的用户名但错误的密码点击"登录"
- **THEN** 系统提示"用户名或密码错误"，不保存用户信息

#### Scenario: 空用户名时阻止登录
- **WHEN** 用户未填写用户名点击"登录"
- **THEN** 系统提示"用户名不能为空"，不执行登录

#### Scenario: 空密码时阻止登录
- **WHEN** 用户未填写密码点击"登录"
- **THEN** 系统提示"密码不能为空"，不执行登录

#### Scenario: 登录失败时保持登录态
- **WHEN** 用户登录失败
- **THEN** 系统不保存登录态，用户仍处于未登录状态

### Requirement: 系统记录当前登录用户信息
系统必须在登录成功后将当前用户信息保存到 Redux Store 中。

#### Scenario: 登录时保存用户信息
- **WHEN** 用户登录成功
- **THEN** 系统保存当前用户的用户名、角色等信息到 Redux store 的 currentUser 字段

#### Scenario: 用户信息跨页面可用
- **WHEN** 用户在任意页面读取 currentUser
- **THEN** 通过 useSelector 从 Redux store 中读取当前用户信息

#### Scenario: 退出登录时清除用户信息
- **WHEN** 用户点击退出登录
- **THEN** 系统清除 Redux store 中的 currentUser 信息