# @scow/grpc-api

## 0.3.0

### Minor Changes

- 2981664: 门户所有作业列增加开始、结束时间列，增加时间说明
- 2ac7a9b: 当已存在的账户中有用户未导入，则可以勾选该账户并导入
- 1562ebb: 提交作业时增加 GPU 选项

### Patch Changes

- 858c7a6: 创建用户时备注改为非必填，修复成功时不展示提示的问题

## 0.2.0

### Minor Changes

- 882a247a1: 重构 app 的 sbatch options，gRPC 中与 custom_attributes 一起发送
- d4b0cde25: 创建 web 类交互式应用时由前端传入 base path，将节点名解析为 IP 地址的工作由 portal-server 完成
- db62f70af: 管理系统 GetJobs API 增加 start_bi_job_index 参数，用于获取从某一个 bi_job_index 开始的作业信息
- 0eb41fed5: 导入用户功能只支持导入默认租户

### Patch Changes

- 1c8a948d8: 把代码中 SavedJobs 字样全部改为 JobTemplate

## 0.1.3

### Patch Changes

- e7a5c8b8f: 在发布的文件中添加 buf.yaml
