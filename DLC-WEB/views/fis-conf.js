// fis.media('local').match('*', {
//   release: 'mis/$0' // 所有资源发布时产出到 /MIS 目录下
// });

// fis-parser-node-sass
fis.match('*.scss', {
  parser: fis.plugin('node-sass'),
  rExt: '.css'
});

fis.match('*.{css,scss}', {
  optimizer: fis.plugin('clean-css')
});

// fis-optimizer-png-compressor 插件进行压缩，已内置
fis.match('*.png', {
  optimizer: fis.plugin('png-compressor')
});

// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
});

//对CSS进行图片合并
fis.match('*.css',{
  useSprite:true
});

//fis3-hook-module
// fis.hook('module', {
//   mode: 'amd' // 模块化支持 amd 规范，适应 require.js
// });

//product evn

// 所有js, css 加 hash
fis.match('*.{js,css,scss}', {
  useHash: true
});

// 所有图片加 hash
fis.match('image', {
  useHash: true
});

fis.match('*.js', {
  optimizer: fis.plugin('uglify-js')
});

fis.match('::packager', {
  postpackager: fis.plugin('loader', {
    allInOne: true
  })
});

//debug
// 所有js, css 加 hash
// fis.media('debug').match('*.{js,css,scss}', {
//   useHash: false
// });

// 所有图片加 hash
// fis.media('debug').match('image', {
//   useHash: false
// });

fis.media('debug').match('*.js', {
  optimizer: null
});

fis.media('debug').match('::packager', {
  postpackager: null
});

// fis.media('debug').match('*',{
//   deploy: fis.plugin('local-deliver', {
//     to: 'C:/Users/Jerry/AppData/Local/.fis3-tmp/dlc'
//   })
// })