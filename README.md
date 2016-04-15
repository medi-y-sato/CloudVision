CloudVision APIを叩くIonic Project
=====================

CloudVision API Keyを取得したうえで、下記ファイルを書き換えて下さい。

```JavaScript:./www/js/const.js
.constant('apiConst', {
  'api_key': 'YOUR_CLOUDVISION_API_KEY'
})
```

そのうえでnpmでionicを導入すれば、各種 ionic-cli でビルドなり何なり出来ます。

```bash
$ npm install -g ionic
$ npm install
$ ionic serve
```

