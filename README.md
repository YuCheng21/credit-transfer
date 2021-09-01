# 學生學程查詢系統

![overview](overview.png)

## Overview

課程抵免申請系統提供系上需要抵免成績的學生完成相關的抵免作業。

## Usage

本專案使用 webpack 編譯靜態檔案，啟動服務前需執行一次編譯，產生靜態檔案。

```bash
cd static
npm run deploy
```

接著使用 Docker 建立容器啟動系統。

```bash
docker-compose up -d
```

預設將在連接埠 `20020` 啟動服務。

- `main.py`

    主要程式進入點。

- `config.py`

    相關配置參數檔案。
