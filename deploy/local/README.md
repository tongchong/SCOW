# SCOW 本地部署

https://pkuhpc.github.io/SCOW/docs/deploy/SCOW

## 注意

此仓库的内容由[PKUHPC/SCOW](https://github.com/PKUHPC/SCOW)的`deploy/local`的目录通过GitHub Actions自动生成。如果需要提交issue或者PR，请提交到SCOW仓库中。

## 要求

系统中已安装python3，并能够使用`python3`命令调用。

## 编写配置文件

```shell
# 1. 复制配置文件
cp config-example.py config.py

# 2，根据需求修改config.py

```
> 每次运行`./compose.sh ××× `时，会根据最新`config.py`的重新生成`docker-compose.json`和`db.sh`文件
## 服务启动与停止

```shell
# 启动服务
./compose.sh up -d

# 停止服务
./compose.sh down
```

> `./compose.sh`支持所有基于`Docker Compose`文件的`docker-compose`命令，如：up、down、ps、restart等。

## 日志收集说明

前提是开启了日志收集功能。各服务日志收集在配置的参数`FLUENTD.LOG_DIR`目录下：

```shell
# 进入日志收集目录
cd {FLUENTD.LOG_DIR}

# 各服务日志存放在该服务名对应的文件夹下
tree -L 1
.
├── auth		 
├── db
├── gateway
├── mis_service
├── mis_web
├── portal-web
└── redis

# 服务日志按日期分割，日志文件命名规则为：{service_name}.yyyymmdd.log
# 例如portal-web日志：
cd portal-web/
ll
-rw-r-----. 1 100 65533 3.1K Oct 12 17:03 portal-web.20221012.log
-rw-r-----. 1 100 65533  27K Oct 13 19:03 portal-web.20221013.log
-rw-r-----. 1 100 65533 113K Oct 14 15:50 portal-web.20221014.log
-rw-r-----. 1 100 65533  83K Oct 15 18:39 portal-web.20221015.log
```

## 连接至管理系统数据库

当部署好了管理系统后，可以在仓库下运行`./db.sh`连接并进入数据库。


# 授权协议

SCOW 使用 [木兰宽松许可证, 第2版](http://license.coscl.org.cn/MulanPSL2) 开源协议。