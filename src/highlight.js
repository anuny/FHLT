(function() {
	var hasClass = function (node, className) {
		return new RegExp('(\\s|^)' + className + '(\\s|$)').test(node.className);
	};

	var addClass = function(node, className)
	{
		if(!hasClass(node, className))node.className = [ node.className, className].join(' ').replace(/(^\s+)|(\s+$)/g, '');
	};
	
	var removeClass = function(node, className)
	{
		if(hasClass(node, className))node.className = node.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), ' ').replace(/(^\s+)|(\s+$)/g, '');
	};
	var highlight = function (element,height,width,lineNum,wrap,clsName)
	{
		var pres  = document.getElementsByTagName(element),
			len   = pres.length,
			pre   = null,
			index = 0,
			lang  = 'javascript',
			html,outer;
	
		/**
		 * 转义html字符
		 * @param {String} html 要转义的html代码
		 * @returns {String} 转义后的html字符串
		 */
		var parseHTML = function (html)
		{
			return html.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/(\r?\n)$/g,'');
		};
	
		/**
		 * 添加行号
		 * @param {Number} nums 行数
		 * @returns {string}
		 */
		var addLineNumber = function (html)
		{
			var newHtml = '<ol start="1">',
			    htmls   = html.split('\n');
			for(var i=0,len=htmls.length;i<len;i++)
			{
				newHtml+='<li>'+htmls[i]+'</li>'
			};
			newHtml += '</ol>';
			return lineNum ? newHtml : html
		};
		
		/**
		 * 根据语言高亮代码
		 * @param {String} html
		 * @param {String} lang
		 * @param {Boolean} findParent
		 * @returns {*}
		 */
		var hlbylanguage = function (html, lang, findParent)
		{	
			if(!(lang in highlight.language))
			{
				return findParent ? addLineNumber(html) : html
			};
			var l = highlight.language[lang];
			if(findParent && l.wrapper) l = highlight.language[l.wrapper];
			if(!l) return findParent ? addLineNumber(html) : html;
			html = ' ' + html + ' ';
			var pattern     = l.reg,
				markup      = l.markup,
				cls         = l.cls || [],
				defaultCls  = (cls.length === 0),
				inc         = l.include,
				olanghl     = [],
				placeholder =[],
				pl          = '',
				language    = '',
				wrapper,
				incLang;
			for(var type in pattern)
			{
				language +=pattern[type];
				defaultCls && cls.push(type);
			};
			pattern = new RegExp(language,'g');
			
			//提取其他语言的代码
			if(inc && inc.length > 0)
			{
				
				for(i=0; i< inc.length; i+=1)
				{
					wrapper = new RegExp('string' == typeof inc[i].lang?inc[i].wrapper.replace(/</g,'&lt;').replace(/>/g,'&gt;'):inc[i].wrapper,'gi');
					html = html.replace(wrapper,function($0,$1)
					{
						incLang = 'string' == typeof inc[i].lang?inc[i].lang:
						$0.match(new RegExp(inc[i].lang[0],'gi'))[0].replace(/\s|\n/,'').replace(/(^\s*)|(\s*$)/g, "");
						pl = '{@' + Math.random() + '@}';
						placeholder.push(pl);
						olanghl.push(hlbylanguage($1,incLang, false));
						return $0.replace($1,pl);
					});
					
				}
			};
			
			html = html.replace(pattern,function()
			{
				var args = Array.prototype.slice.call(arguments,0),
					currArg1 = null,
					currArg  = null,
					len      = args.length - 2,
					index    = len;
					
				for(; index > 0; index-=1)
				{
					currArg = args[index];
					if(currArg)
					{
						
						if(markup && cls[index-1] === 'tag')
						{
							
							currArg1 = currArg.replace(/(\w+)=(".*?")/g,'<span class="' + highlight.language.html.cls[2] + '">$1</span>=<span class="' + highlight.language.html.cls[3]+'">$2</span>')
						};
	
						if(cls[index-1] == 'com' /*|| cls[index-1] == 'code'*/)
						{
							var currArgs = currArg.split('\n'),
							_currArgs    = '',
							curLen       = currArgs.length;
							for(var i=0,len=currArgs.length;i<len;i++)
							{
								_currArgs += '<span class="'+ cls[index-1] +'">'+ currArgs[i] +'</span>' + (i==len-1 ? '' : '\n')
							};
							args[0] = args[0].replace(args[0],_currArgs);
						} else
						{
							var __currArg='<span class="'+ cls[index-1] +'">'+ (currArg1 !== null ?currArg1:currArg) +'</span>';
							args[0] = args[0].replace(currArg,__currArg);
						};
					}
				};
				
				return args[0];
			});

			//高亮包含的其他语言
			placeholderLen = placeholder.length;
			
			
			if(placeholderLen>0)
			{
				for(i = 0; i< placeholderLen; i++)
				{
					var newReg = new RegExp('{@.*?'+placeholder[i].replace(/[{@}]/g,'')+'.*?@}','g');
					html = html.replace(newReg,placeholder[i]);
					html = html.replace(placeholder[i], olanghl[i]);
				}
			}
	
			/*
			 * 替换首行第一个空格
			 */
			var rep = function ($0)
			{
				return /^\s+$/.test($0) ? "" : $0.replace(/(\s+)$/,"")
			};
			html = html.replace(/^(\<.*?\>)*(\s)|(\s)$/g,rep);
			return findParent ? addLineNumber(html) : html;
		};
		
		for(; index < len; index += 1)
		{
			pre = pres[index];
			// 添加主样式
			addClass(pre,clsName);
			
			
			// 添加风格样式
			//addClass(pre,'HL-'+theme);
			
			// 添加行号
			if(lineNum)addClass(pre,clsName+'-hasLine');
			
			// 设置最大高度
			if(height && height!=='auto' && pre.offsetHeight>height)pre.style.height=height+'px',pre.style.overflowY = 'auto';
			
			// 设置宽度
			
			if(width&&width!=='auto')pre.style.width=width+'px';
			
			// 设置自动换行	
			wrap?addClass(pre,clsName+'-wrap'):pre.style.overflowX = 'auto';
			
			// 获取语言
			lang = (pre.getAttribute('data-language') || lang).toLowerCase();
			if(typeof langName !== 'undefined' && lang !== langName)continue;
			html = parseHTML(pre.innerHTML);
			if(pre.outerHTML)
			{
				outer = pre.outerHTML.match(/<\w+\s*(.*?)>/)[1];
				pre.outerHTML = '<pre '+outer+'>'+ hlbylanguage(html,lang,true) + '</pre>';
			} else
			{
				pre.innerHTML = hlbylanguage(html,lang,true);
			}
		}
	};
	
	highlight.options = {};
	
	highlight.language = highlight.language || {};
	/**
	 * 扩展语言
	 * @param {String} langName 语言名称
	 * @param {Object} langObj  配置参数
	 */
	highlight.extendLanguage = function(langName, langObj)
	{
		highlight.language[langName] = langObj;
		if(langObj.wrapper)highlight.language[langObj.wrapper].include.push(langObj.content);
	}
	
	function addCss(node,css){
		if ('styleSheet' in node) 
		{
			node.setAttribute('type', 'text/css')
			node.styleSheet.cssText = css
		} else {
			node.innerHTML = css
		}
		return node
	}
	
	
	highlight.addStyle = function(css,id)
	{
		var style = '<style id="'+id+'">'+css+'</style>'
		var head = document.getElementsByTagName('head')[0]||document.documentElement;
		var style;
		
		if('string' == typeof id){
			id = id+'-themes';
			style = document.createElement('style');
			style.id = id;
			head.appendChild(addCss(style,css));
			style = null;
			return document.getElementById(id);
		}else{
			style = id;
			addCss(style,css);
			return style;
		}
		
	}

	highlight.extendThemes = function(themes,clsName,theme,element)
	{
		if(!themes) return;
		var style='';
		theme = themes[theme];
		var prefix = element+'.'+clsName;
		for(var i in theme){
			var sty;
			switch(i)
			{
				case 'public':
				var pre=theme[i].PRE,
				before = theme[i].BEFORE,
				wrap = theme[i].WARP,
				ol = theme[i].OL_SPA,
				hasLine = theme[i].OL_LINE,
				li = theme[i].OL_LIST;
				sty =prefix+'{'+pre+'}'+
					 prefix+':before{'+before+'}'+
					 prefix+'-wrap{'+wrap+'}'+
					 prefix+' ol{'+ol+'}'+
					 prefix+'-hasLine ol{'+hasLine+'}'+
					 prefix+' ol li{'+li+'}'
				break;
				case 'main':
				sty = prefix+'{'+theme[i]+'}'
				break;
				case 'before':
				sty = prefix+':before{'+theme[i]+'}'
				break;
				case 'list':
				sty = prefix+' ol li{'+theme[i]+'}'
				break;
				default:
				sty = prefix+' .'+i+'{'+theme[i]+'}'
			}
			style+=sty;
		};
		return style;
	}
	
	// 改变主题
	highlight.setTheme = function(theme)
	{
		var opts = highlight.options;
		var style = highlight.extendThemes(opts.themes,opts.clsName,theme,opts.element);
		highlight.addStyle(style,opts.styleEle)
	};
	
	highlight.addOptions = function(options)
	{
		for(var opt in options) highlight.options[opt] = options[opt];
	};
	
	// 实例化
	highlight.init = function (options)
	{
		var element = options.element||'pre',
			clsName = options.clsName||'FHLT',
			height  = options.height||'auto',
			width   = options.width||'auto',
		    theme   = options.theme || 'light',
		    wrap    = options.wrap || false,
		    lineNum = options.lineNum || false;
		highlight.addOptions({element:element,clsName:clsName,height:height,width:width,theme:theme,wrap:wrap,lineNum:lineNum})
		highlight(element,height,width,lineNum,wrap,clsName);
		var style = highlight.extendThemes(highlight.options.themes,clsName,theme,element);
		highlight.options.styleEle=highlight.addStyle(style,clsName)
		return highlight;
	};
	window.highlight = highlight
})();
