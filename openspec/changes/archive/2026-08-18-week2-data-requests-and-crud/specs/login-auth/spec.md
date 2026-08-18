## MODIFIED Requirements

### Requirement: 登录页面
系统 SHALL 提供登录页面，包含登录表单与基本校验，登录表单使用 React Hook Form 管理字段注册与校验，提交进行中禁用登录按钮。

#### Scenario: 登录表单字段校验
- **WHEN** 用户提交含空必填字段的登录表单
- **THEN** 系统提示校验错误，不发起登录

#### Scenario: 登录成功
- **WHEN** 用户填写有效凭证并提交
- **THEN** 系统保存登录状态并跳转至目标页面

#### Scenario: 登录提交中禁用按钮
- **WHEN** 用户提交登录表单且请求尚未完成
- **THEN** 登录按钮禁用，防止重复提交
