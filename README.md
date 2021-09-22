# 學生學程查詢系統

![overview](overview.png)

## Overview

課程抵免申請系統提供系上需要抵免成績的學生完成相關的抵免作業。

## Docker (Production)

### Configuration

- 配置環境變數，編輯檔案 `./docker/config.env`。

    ```text
    mysql_user=<db-user>
    mysql_password=<db-password>
    mysql_host=<db-host>
    SECRET_KEY=<secret-key>
    MYSQL_ROOT_PASSWORD=<db-password>
    ```

  - db-user : 資料庫的帳號
  - db-password : 資料庫的密碼
  - db-host : 資料庫的地址
  - secret-key : flask session 的金鑰

- 修改 Flask Server 為 Production 模式，編輯 `./main.py`。

    ```python
    # mode = 'development'
    mode = 'production'
    ```

### Startup

使用 Docker 建立容器啟動系統。

```bash
docker-compose up -d
```

預設將不啟動任何對外連接埠，只開啟 flask 容器內部 `80` 連接埠，須測試可透過 SSH Tunnel 開啟對應通道。


## Project Structure

- `main.py` : 主要程式進入點。

- `config.py` : 相關配置參數檔案。
