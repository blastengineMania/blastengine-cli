# blastengine（ブラストエンジン）用CLIツール

本ツールはCUIでblastengineを操作するツールです。

## インストール

```
$ npm i blastengine-cli -g
```

## 初期設定

ユーザー名、APIキー、デフォルトのメール送信元アドレス（オプション）を設定します。

```
$ be init -k YOUR_API_KEY \
  -u YOUR_USER_NAME \
	-f from@example.com
```

設定ファイルは `(ホームディレクトリ)/.blastengine/config.json` に保存されます。

## メールテンプレートの作成

トランザクションメール（即時発送メール）用のテンプレートの作成します。

```
$ be transaction create
メールを /path/to/2023-04-14-17-35-46.mdに保存しました。編集してください。
```

生成されるファイルはメタデータ付きのMarkdownファイルです。本文はそのままテキストとしてメール本文に使われます（HTML変換されません）。

## メールの送信

トランザクションメール（即時発送メール）を送信します。送信時には上記メールテンプレートを利用します。

```
$ be transaction send -p ./2023-04-14-17-35-46.md
```

## License

MIT
