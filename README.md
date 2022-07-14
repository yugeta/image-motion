img-motion
===
```
Date : 2022.07.03
Author : Yugeta.Koji
```

# Summary
- pngやgifなどの画像ファイルを組み合わせてアニメーションのデータとして扱えるオブジェクトを生成するツール
- Webページで扱える様に、CSSとJavascriptのみで構成されたオブジェクトができあがる。
- Javascriptなどを使い、class名（data属性等）を切り替えることで事前に登録されたアニメーションパターンを切り替えることができる。
- 登録したimg-motionデータは、api的に呼び出す事も可能だが、jsonファイルで出力する事も可能。
- img-motionデータの保存先を同一サーバー内であれば、設定することが可能。
- img-motionデータをHTMLで表示するためのタグが出力される。


# Howto : 作成方法
1. 使用する画像を登録（複数）
2. 画像の配置を決める
3. Boneと重なりを決める（表示順番）
  - ※階層構造によって表示順番が決定されます。
4. アニメーションを設定する（複数登録）※アニメーションには、key値を設定する（walk,run等）
5. 動作確認


# Howto : オプション
- キャラクタが手に持つアイテムなどは、表示非表示切り替えにより、連動することができる。
- 左右反転を使う事が可能
- オブジェクト連動機能 : 任意のアイテムを、特定の画像(bone)と連動して動くようにセットすることが可能
- キーやタッチイベントによる、モーション切り替え処理の実装（任意メソッドを実行することでもモーション切り替えが可能）


# Howto : 表示（操作）方法
- javascriptモジュールをHTMLのheadタグ内で読み込む
- htmlに任意のオブジェクトタグを埋め込む

# Install
- $ git clone http://git.ideacompo.com/2/image_motion.git
- $ mkdir plugin | cd plugin
- $ git clone http://git.ideacompo.com/2/svgEmbed.git
- 