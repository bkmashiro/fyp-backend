# Sanpu Backend

install

```bash
$ pnpm i
```
configure

设置环境变量

根据.env.example创建.env文件，设置环境变量

根据.env.development.example创建.env.development文件，设置环境变量


run in dev mode

```bash
$ pnpm dev
```


## Database

关于数据库：先安装 `PostgreSQL` ，然后安装 `PostGIS` 扩展。


### Setup Database

#### 安装插件

```sql
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_raster;
```
启用驱动
```sql
SET postgis.gdal_enabled_drivers = 'ENABLE_ALL';
SET postgis.enable_outdb_rasters = True;
```
