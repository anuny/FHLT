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
		options = options || {};
		var element = options.element||'pre',
			clsName = options.clsName||'FHLT',
			height  = options.height||'auto',
			width   = options.width||'auto',
		    theme   = options.theme || 'light',
		    wrap    = options.wrap || true,
		    lineNum = options.lineNum || true;
		highlight.addOptions({element:element,clsName:clsName,height:height,width:width,theme:theme,wrap:wrap,lineNum:lineNum})
		highlight(element,height,width,lineNum,wrap,clsName);
		var style = highlight.extendThemes(highlight.options.themes,clsName,theme,element);
		highlight.options.styleEle=highlight.addStyle(style,clsName)
		return highlight;
	};
	window.highlight = highlight
})();
(function(highlight) 
{
    var language = {};
	
	var public={
		COM:{
			HASH:'(\\#.*)|',
			SLASH:'(\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/)|'
		},
		STR:"(\"(?:[^\"\\\\]|\\\\[\\s\\S])*\"|'(?:[^'\\\\]|\\\\[\\s\\S])*')|",
		NUM:'\\b(\\d+(?:\\.\\d+)?(?:[Ee][-+]?(?:\\d)+)?)\\b|'
	}
	
	// html扩展
    language.html = 
	{
		// 样式
        cls:[ "com", "tag", "attr", "str" ],
        reg:
		{
			// 注释
            com:"(&lt;\\!--[\\s\\S]*?--&gt;)|",
            // 标签
            tag:"(&lt;\\/?\\w+(?:.*?)&gt;)|"
        },
        markup:true,
		// 内联 javascript css
        include:
		[ 
			{
				lang:"javascript",
				wrapper:"<script>([\\s\\S]*?)<\\/script>"
			}, 
			{
				lang:"css",
				wrapper:"<style>([\\s\\S]*?)<\\/style>"
			} 
		]
    };
	
	// css扩展
    language.css = {
        cls:[ "com", "slt", "attr", "str", "brt" ],
        reg:
		{
			//注释
            com:public.COM.SLASH,
            //选择器
            ele:"([^{\\\n\\$\\|]*?){|",
            //属性名
            obj:"(?:([\\w-]+?)\\s*\\:([\\w\\s\"',\\-\\#\\.,\\,\\/,\\(,\\)]*))|",
            // 符号
            brt:"(\\;|\\!important)"
        }
    };
	
	// javascript扩展
    language.javascript = language.js = 
	{
        cls:[ "com", "str", "bui", "key", "obj", "num", "ope", "brt", "reg" ],
        reg:
		{
            // 注释
            com:public.COM.SLASH,
            // 字符串
            str:"(\"(?:[^\"\\\\]|\\\\[\\s\\S])*\"|'(?:[^'\\\\]|\\\\[\\s\\S])*')|",
            // 保留函数
            bui:"\\b(alert|all|anchor|anchors|area|assign|blur|button|checkbox|clearInterval|clearTimeout|clientInformation|close|closed|confirm|constructor|crypto|defaultStatus|document|element|elements|embed|embeds|event|fileUpload|focus|frame|innerHeight|innerWidth|link|location|mimeTypes|navigate|navigator|frames|frameRate|hidden|history|image|images|offscreenBuffering|open|opener|option|options|outerHeight|outerWidth|onblur|onclick|onerror|onfocus|onkeydown|onkeypress|onkeyup|onmouseover|onload|onmouseup|onmousedown|onsubmit|packages|pageXOffset|pageYOffset|parent|password|pkcs11|plugin|prompt|propertyIsEnum|radio|screenX|screenY|scroll|secure|self|status|submit|setTimeout|setInterval|taint|text|textarea|top|window)\\b|",
            // 关键字
            key:"\\b(abstract|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|foreach|final|finally|float|for|from|function|false|goto|if|implements|import|in|instanceof|int|interface|let|long|native|NaN|new|null|of|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|true|throws|transient|try|typeof|then |var|void|volatile|while|with)\\b|",
            // 保留对象
            obj:"\\b(Array|apply|Boolean|concat|call|cos|charAt|Date|decodeURI|decodeURIComponent|eval|encodeURI|encodeURIComponent|escape|fixed|getTime|hasOwnProperty|Infinity|indexOf|isFinite|isNaN|isPrototypeOf|join|log|lastIndexOf|Math|match|max|min|Number|Object|push|pop|print|prototype|parseFloat|parseInt|RegExp|reset|replace|String|substring|substr|sub|sup|slice|sort|shift|search|slice|splice|split|select|toString|toLowerCase|toUpperCase|toSource|unshift|unescape|untaint|valueOf|write|writeln)\\b|",
            // 数字
            num:public.NUM,
            // 操作符 
            ope:"(\\+|\\-|\\*|\\/|\\%|\\=|\\==|\\===|\\!=|\\!==|\\&=|\\*=|\\+=|\\-=|\\<=|\\>=|\\&lt;|\\&gt;|\\?|\\.|\\,|\\;|\\~|\\`|\\!|\\:|\\^|\\\"|'|\\&amp;|\\|)|",
            brt:"(\\[|\\]|\\{|\\}|\\(|\\))|",
            // 正则表达式
            reg:"(?:^|[^\\)\\]\\}])(\\/(?!\\*)(?:\\.|[^\\/\n])+?\\/[gim]*)|"
        }
    };
	
	// json扩展
    language.json = {
        cls:[ "com", "attr", "str", "num", "brt" ],
        reg:
		{
			// 注释
            com:public.COM.SLASH,
			// 对象名
            attr:"([^{\\n\\$\\|]*?):|",
			// 值(字符串)
            str:public.STR,
			// 值(数字)
            num:public.NUM,
			// 值(符号)
            brt:"(\\{|\\}|\\[|\\])|"
        }
    };
	
	// php扩展
    language.php = 
	{
        //对应的类名称
        cls:[ "com", "mrk", "str", "key", "vars", "obj", "num", "ope", "brt" ],
        //相应的正则表达式
        reg:
		{
			// 注释
            com:public.COM.SLASH,
            // 标签
            mrk:"(&lt;\\?php|\\?&gt;)|",
            // 字符串
            str:public.STR,
            // 关键字	
            key:"(?:[^$_@a-zA-Z0-9])?(and|base64_decode|base64_encode|copy|Cos|count|crypt|current|date|dbase_close|delete|dir|dirname|each|end|else|elseif|endif|if|ereg|eregi|eval|exec|Exp|explode|extract|exception|fclose|or|substr|this|xor|mktime|str_replace|strrpos|mail|function|while|for|foreach)(?![$_@a-zA-Z0-9])|",
            // 变量名
            "var":"(\\$[\\w][\\w\\d]*)|",
            //内置函数(部分)
            obj:"(?:[^$_@A-Za-z0-9])?(array|as|break|case|class|const|continue|default|die|do|echo|empty|exit|extends|global|include|include_once|isset|list|new|print|require|require_once|return|static|switch|unset|use|var|final|interface|implements|public|private|protected|abstract|clone|try|catch|throw|int|string|bool|classic|object)(?:[^$_@A-Za-z0-9])|",
            //数字
            num:public.NUM,
            // 操作符
            ope:"(\\+|\\-|\\*|\\/|\\%|\\=|\\==|\\===|\\!=|\\!==|\\&=|\\*=|\\+=|\\-=|\\<=|\\>=|\\&lt;|\\&gt;|\\?|\\.|\\,|\\;|\\~|\\`|\\!|\\:|\\^|\\\"|'|\\&amp;|\\|)|",
			// 函数符
            brt:"(\\[|\\]|\\{|\\}|\\(|\\))|"
        },
        //父级语言
        wrapper:"html",
        //内容 ,用于push到wrapper的include
        content:
		{
            lang:"php",
            wrapper:"(<\\?php(?:[\\s\\S]*?)\\?>)"
        }
    };
	
	// shell扩展
    language.shell = 
	{
        cls:[ "com", "key", "key", "vars", "path", "url" ],
        reg:
		{
			// 注释
            com:public.COM.HASH,
            // linux关键字
            linux:"\\b(cd|cp|du|fuser|install|chmod|chown|apt-get|apt-cdrom|apt-cache|basename|find|ln|locate|ls|dir|mkdir|mv|pwd|rename|rm|rmdir|touch|updatedb|whereis|which|ar|arj|bunzip2|bzcat|bzip2|bzip2recover|bzless|bzmore|compress|cpio|dump|gunzip|gzexe|gzip|lha|resotre|tar|unarj|uncompress|unzip|zcat|zforce|zip|zipinfo|znew|cat|cksum|cmp|col|colrm|comm|csplit|cut|diff3|diff|diffstat|ed|emacs|ex|expand|fmt|fold|grep|egrep|fgrep|head|ispell|jed|joe|join|less|look|more|od|paste|pico|sed|sort|spell|split|sum|tac|tail|tee|tr|unexpand|uniq|vi|wc|alias|bg|bind|declare|dirs|echo|enable|eval|exec|exit|export|fc|fg|hash|history|jobs|kill|logout|popd|pushd|set|shopt|ulimit|umask|unalias|unset|accept|cancel|disable|enable|lp|lpadmin|lpc|lpq|lpr|lprm|lpstat|pr|reject|bc|cal|clear|consoletype|ctrlaltdel|date|dircolors|eject|halt|hostid|hwclock|info|login|man|md5sum|mesg|mtools|mtoolstest|poweroff|reboot|shutdown|sleep|stat|talk|wall|whatis|who|whoami|write|yes|chfn|chsh|finger|gpasswd|groupadd|groupdel|groupmod|groups|grpck|grpconv|grpunconv|logname|passwd|pwck|pwconv|pwunconv|su|useradd|userdel|usermod|users|init|killall|nice|nohup|pgrep|pidof|pkill|ps|pstree|renice|w|watch|badblocks|blockdev|chattr|convertquota|df|dumpe2fs|e2fsck|e2image|e2label|edquota|fdisk|findfs|fsck|grub|hdparm|lilo|lsattr|mkbootdisk|mke2fs|mkfs|mkinitrd|mkisofs|mknod|mkswap|mktemp|mount|parted|quota|quotacheck|quotaoff|quotaon|quotastat|repquota|swapoff|swapon|sync|tune2fs|umount|depmod|dmesg|free|insmod|iostat|ipcs|kernelversion|lsmod|modinfo|modprobe|mpstat|rmmod|sar|slabtop|sysctl|tload|top|uname|uptime|vmstat|startx|xauth|xhost|xinit|xlsatoms|xlsclients|xlsfonts|xset|chroot|nmap|scp|sftp|slogin|ssh|sudo|awk|gawk|expr|gcc|gdb|ldd|make|nm|perl|php|test|arch|at|atq|atrm|batch|chkconfig|crontab|last|lastb|logrotate|logsave|logwatch|lsusb|patch|rpm|runlevel|service|telinit|yum|dnsdomainname|domainname|hostname|ifcfg|ifconfig|ifdown|ifup|nisdomainname|route|ypdomainname|arp|arping|arpwatch|dig|elinks|elm|host|ipcalc|lynx|mail|ncftp|netstat|nslookup|pine|ping|rsh|telnet|tftp|tracepath|traceroute|wget|arptables|ip|iptables|iptables-save|iptables-restore|tcpdump|ab|apachectl|exportfs|htdigest|htpasswd|httpd|mailq|mysqladmin|msqldump|mysqlimport|mysqlshow|nfsstat|sendmail|showmount|smbclient|smbmount|smbpasswd|squid|sshd|dpkg|cmake|source)\\b|",
			// dos关键字
            dos:"\\b(winver|wupdmgr|wscript|mstsc|net|start|stop|netstat|regedit|cmd|chkdsk|gpedit|ping|ipconfig|kill|del|move|at|telnet|open|copy|xcopy|arp|dir|set|pause|if|goto|call|for|echo|echo|findstr|find|title|color|prompt|ver|winver|format|md|replace|ren|tree|type|more|taskmgr|tlntadmn|exit|path|REM|netsh)\\b|",
			// 参数 -xx
            par:"(\\s\\-.*?\\s|\\:.*?\\!)|",
            // 路径 /xxx/xxx
            path:"(\\/.*\\s|\\/.*\\n)|",
            // 网址 http://xxx.xxx
            url:"([a-zA-z]+\\:\\/\\/[^\\s]*)|"
        }
    };
	
	// sql扩展
    var sqlKey = "backup|alter|print|if|abs|avg|case|cast|coalesce|convert|count|current_timestamp|current_user|day|isnull|left|lower|month|nullif|replace|right|session_user|space|substring|sum|system_user|upper|user|yearabsolute|action|add|after|alter|as|asc|at|authorization|begin|bigint|binary|bit|by|cascade|char|character|check|checkpoint|close|collate|column|commit|committed|connect|connection|constraint|contains|continue|create|cube|current|current_date|current_time|cursor|database|date|deallocate|dec|decimal|declare|default|delete|desc|distinct|double|drop|dynamic|else|end|end-exec|escape|except|exec|execute|false|fetch|first|float|for|force|foreign|forward|free|from|full|function|global|goto|grant|group|grouping|having|hour|ignore|index|inner|insensitive|insert|instead|int|integer|intersect|into|is|isolation|key|last|level|load|local|max|min|minute|modify|move|name|national|nchar|next|no|numeric|of|off|on|only|open|option|order|out|output|partial|password|precision|prepare|primary|prior|privileges|procedure|public|read|real|references|relative|repeatable|restrict|return|returns|revoke|rollback|rollup|rows|rule|schema|scroll|second|section|select|sequence|serializable|set|size|smallint|static|statistics|table|temp|temporary|then|time|timestamp|to|top|transaction|translation|trigger|true|truncate|uncommitted|union|unique|update|values|varchar|varying|view|when|where|with|workall|use|createtable|dbcc|while|droptable|setup|nocount", sqlOpe = "all|and|any|between|cross|in|join|like|not|null|or|outer|some";
    language.sql = 
	{
        cls:[ "com", "key", "obj", "vars", "str", "num"],
        reg:
		{
			//注释
            com:"(\\-\\-.*|\\/\\*[\\s\\S]*?\\*\\/)|",
            // 关键字
            key:"\\b(" + sqlKey + "|" + sqlKey.toUpperCase() + ")\\b|",
			// 关键字2
            obj:"\\b(" + sqlOpe + "|" + sqlOpe.toUpperCase() + ")\\b|",
			// 变量
            vars:"(\\@[\\w][\\w\\d]*)|",
			// 字符串
            str:public.STR,
			// 数字
            num:public.NUM
			
        }
    };
	
	// apache扩展
    language.apache = 
	{
        cls:[ "com", 'mrk',"key", "obj", "vars", "str", "num", 'obj'],
        reg:
		{
			//注释
            com:public.COM.HASH,
			mark:"(&lt;\\/?\\w+(?:.*?)&gt;)|",
            // 关键字
            key:"\\b(ServerRoot|PidFile|Mutex|Listen|LoadModule|User|Group|ServerAdmin|ServerName|DocumentRoot|DirectoryIndex|Require|ErrorLog|LogLevel|LogFormat|CustomLog|Redirect|Alias|ScriptAlias|ScriptAliases|Scriptsock|AllowOverride|Options|TypesConfig|AddType|AddEncoding|AddHandler|Filters|AddOutputFilter|MIMEMagicFile|ErrorDocument|MaxRanges|EnableMMAP|EnableSendfile|Supplemental|Server-pool|Include|Configure|SSLSessionCache|SSLSessionCacheTimeout|LimitRequestBody|SSLRandomSeed|BrowserMatch|RequestHeader|unset|DNT|Order|Allow|OFFExecCGI|FollowSymLinks|Indexes|None|Deny|prefork|StartServers|MinSpareServers|MaxSpareServers|MaxClients|MaxRequestsPerChild|UserDir|chmod|warn|RewriteMap|RewriteCond|RewriteRule|ExpiresActive|ExpiresByType)\\b|",
			// 关键字2
            obj:"\\b(All|all|On|on|off|Off)\\b|",
			// 变量
            vars:"([\\%|\\$]{\\/?\\w+(?:.*?)\\})|",
			// 字符串
            str:public.STR,
			// 数字
            num:public.NUM,
			brt:"(\\s\\[\\/?\\w+(?:.*?)\\])|"
        }
    };
	
	// markdown扩展
    language.markdown = language.mkdown = language.md = language.mkd = 
	{
        cls:["key", "key", "mrk", "obj",'obj',"mrk","url","","str","url"],
        reg:
		{
			h1_6:public.COM.HASH,
			h1:'(.*?\\n[=_]{1}.+\\n)|',
			strong:'([*_]{2}.+?[*_]{2})|',
			itc:'([*_]{1}.+?[*_]{1})|',
			quote:'(\\&gt;\\s.*)|',
			mark:"(&lt;\\/?\\w+(?:.*?)&gt;)|",
			link:'((\\[(.*?)\\])|\\((.*?)\\)|[a-zA-z]+\\:\\/\\/[^\\s]*|\\/.*\\s|\\/.*\\n)|'	
        },
		include:
		[ 
			{
				lang:['([^`|^`\\s].*\\n)'],
				wrapper:"(\\```[\\s\\S]*?\\```)"
			}
		]
    };
	
	// java扩展
    language.java = language.jsp = language.jsf =
	{
        cls:[ "com", "str", "key", "num", "ope", "brt", "reg" ],
        reg:
		{
            // 注释
            com:public.COM.SLASH,
            // 字符串
            str:"(\"(?:[^\"\\\\]|\\\\[\\s\\S])*\"|'(?:[^'\\\\]|\\\\[\\s\\S])*')|",
            // 关键字
            key:"\\b(strictfp|abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|false|true|null)\\b|",
            // 数字
            num:public.NUM,
            // 操作符 
            ope:"(\\+|\\-|\\*|\\/|\\%|\\=|\\==|\\===|\\!=|\\!==|\\&=|\\*=|\\+=|\\-=|\\<=|\\>=|\\&lt;|\\&gt;|\\?|\\.|\\,|\\;|\\~|\\`|\\!|\\:|\\^|\\\"|'|\\&amp;|\\|)|",
            brt:"(\\[|\\]|\\{|\\}|\\(|\\))|",
            // 正则表达式
            reg:"(?:^|[^\\)\\]\\}])(\\/(?!\\*)(?:\\.|[^\\/\n])+?\\/[gim]*)|"
        }
    };
	highlight.addOptions({langs:language});
	for(var lang in language)highlight.extendLanguage(lang,language[lang]);
})(highlight);
(function(highlight) {
    var themes = {}, 
	public = {
        PRE:'font-family:Monaco,Consolas,"Lucida Console","Courier New",serif;font-size:12px;line-height:20px; position: relative;*padding-bottom: 20px; cursor: text; overflow: hidden;width: auto; margin:10px auto; padding:10px',
        BEFORE:"position:absolute; top:10px; right:10px;font-style: italic;font-size: 20px;z-index: -1;opacity: 0.4;filter:alpha(opacity=40); z-index:1;content: attr(data-language);",
        WARP:"white-space:pre-wrap;word-wrap:break-word",
        OL_SPA:"Letter-spacing: 0.1px;",
        OL_LINE:"padding-left:40px;",
        OL_LIST:"display: list-item; padding-left:10px;list-style: decimal outside;"
    };
    themes.light = {
        public:public,
        main:"border:1px #CCC solid;background:#FFFFFF;color:#000066;",
        before:"color: goldenrod;",
        list:"border-left:#ddd solid 2px;",
        com:"color:#999",
        mrk:"color:#00f; font-weight: bold;",
        vars:"color:#f0f ",
        key:"color:#009 ;font-weight: bold",
        str:"color:#00f ",
        num:"color:#f00 ",
        obj:"color:#099 ",
        path:"color:#00f ;",
        url:"color:#00f ; text-decoration:underline",
        brt:"color:#000099;font-weight:bold;",
        ope:"color:#009;",
        attr:"color:#909",
        reg:"color:#006600; ",
        tag:"color:#00f ",
        bui:"color:#909 ",
        slt:"color:#f0f "
    }
	themes.gray = {
        public:public,
        main:"border:1px #CCC solid;background:#f9f9f9;color:#000066;",
        before:"color: goldenrod;",
        list:"border-left:#ddd solid 2px;",
        com:" color:#007400 ",
        mrk:" color:#00f; font-weight: bold;",
        vars:" color:#0854FF ",
        key:" color:#AA0D91 ;",
        str:" color:#C41A16 ",
        num:" color:#f00 ",
        obj:" color:#41AAB1 ",
        path:" color:#C41A16 ;",
        url:" color:#C41A16 ; text-decoration:underline",
        brt:" color:#000;font-weight:bold;",
        ope:" color:#009;",
        attr:" color:#909",
        reg:" color:#f00;",
        tag:" color:#881280 ",
        bui:" color:#DB00DB ",
        slt:"color:#f0f "
    }
	themes.blue = {
        public:public,
        main:"background:#102144;color:#C7D4E2;",
        before:"color: #7A8994;",
        list:"border-left:#204187 solid 2px;",
        com:" color:#606C68; ",
        mrk:" color: #EB03DF; font-weight: bold; ",
        vars:" color:#8DFFFF ",
        key:" color:#8D8DFF ;font-weight: bold",
        str:" color:#8CC21D ",
        num:" color:#05FFFF ",
        obj:" color:#63A7FF ",
        path:" color:#8CC21D ;",
        url:" color:#8CC21D ; text-decoration:underline",
        brt:" color:#FFBD2E;font-weight:bold;",
        ope:" color:#FFAE00;",
        attr:" color:#D9684C",
        reg:" color:#ff7d27",
        tag:" color:#8D8DFF ",
        bui:" color:#EB03DF ",
        slt:"color:#EB03DF "
    }
	themes.red = {
        public:public,
        main:"background:#240612;color:#FFEAEA;",
        before:"color: #7A8994;",
        list:"border-left:#5B0D2C solid 2px;",
        com:" color:#0056D0; background:#000 ",
        mrk:" color: #EB03DF; font-weight: bold; ",
        vars:" color:#FD971F; ",
        key:" color:#DA1A6E ;font-weight: bold",
        str:" color:#05D8FF ;background:#400A5E",
        num:" color:#f00 ",
        obj:" color:#A6E22E ",
        path:" color:#05D8FF ;background:#400A5E",
        url:" color:#05D8FF ; background:#400A5E",
        brt:" color:#FFBD2E;font-weight:bold;",
        ope:" color:#FFAE00;",
        attr:" color:#66D9EF",
        reg:" color:#f00;background:#490612",
        tag:" color:#FF0077 ",
        bui:" color:#EB03DF ",
        slt:"color:#EB03DF "
    }
	themes.dark = {
        public:public,
        main:"background:#394147;color:#fff;",
        before:"color: #7A8994;",
        list:"border-left:#546068 solid 2px;",
        com:" color:#3AE857; ",
        mrk:" color: #EB03DF; font-weight: bold; ",
        vars:" color:#f0f ",
        key:" color:#FFAE00 ;font-weight: bold",
        str:" color:#05D8FF ",
        num:" color:#f00 ",
        obj:" color:#A6E22E ",
        path:" color:#05D8FF ;",
        url:" color:#05D8FF ; text-decoration:underline",
        brt:" color:#FFBD2E;font-weight:bold;",
        ope:" color:#FFAE00;",
        attr:" color:#ff0",
        reg:" color:#ff7d27;",
        tag:" color:#FF0077 ",
        bui:" color:#EB03DF ",
        slt:"color:#EB03DF "
    };
	highlight.addOptions({themes:themes});
})(highlight);

