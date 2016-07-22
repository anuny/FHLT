前端轻量化代码高亮插件
=====================


> 压缩后18KB,Gip压缩后
> 已扩展语言：`Apache`，`Css`，`Html`，`Java`，`Javascript`，`Json`，`Markdown`，`Php`，`Shell`，`Sql`
> 已扩展主题：`light`，`gray`，`blue`，`red`，`dark`
> 语言可自行扩展，主题可自行扩展

## 使用 [![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](./LICENSE)


```javascript 

// 简单使用
highlight.init();

// 自定义参数
var hl = highlight.init({
	element:'pre', //代码元素名称
	height:500,    //代码最小高度(number|'auto')
	width:500,     //代码宽度(number|'auto')
	clsName:'HL',  // 高亮样式前缀
	theme:'light', // 默认主题
	lineNum:true,  // 是否显示行号
	wrap:true      // 是否自动换行
})

// 切换主题
hl.setTheme('dark')

```


## [查看演示](./doc/validator.md)


