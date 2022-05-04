# electron-video-player

> YouTube-like UIのcheapなビデオプレーヤー

## 起動

```bash
npm i
npm start
```

ビルド済みバイナリは配布してません。各自electron-builderなりelectron-forgeなりでパッケージングしてください。

Windows 10で動作確認済み。

## 機能

- サポートされている動画形式
  - Electron（Chromium）でサポートされている動画形式と同じ
    - video/mp4
    - video/webm
    - video/ogg
- キーボードショートカット
  - `Spaceキー` - 動画の再生/一時停止
  - `o` - ファイルを開く
  - `l` - 動画のループ/ループ解除
  - `m` - 動画のミュート/ミュート解除
  - `左矢印キー/右矢印キー` - 5秒巻き戻し/早送り
  - `上矢印キー/下矢印キー` - 音量を5%上げる/下げる

## ライセンス

[Mozilla Public License 2.0](LICENSE)
