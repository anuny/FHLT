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
