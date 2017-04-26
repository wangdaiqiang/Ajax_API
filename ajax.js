var Ajax = function() {
    var request = xmlHttpRequest();

    this.get = function(opts, callback) {
        var defaults = {
        	url:'',
        	data:'',
            async:true
        }
        defaults = objToObj(opts,defaults)

        if(typeof defaults.data === 'object' && JSON.stringify(defaults.data) !== '{}') defaults.url = defaults.url + '?' + encodeFormData(defaults.data);
        request.onreadystatechange = function() {
            //如果请求完成且成功
            if (request.readyState === 4 && request.status === 200) {
                //获得响应的类型
                var type = request.getResponseHeader('Content-Type');
                //检查类型，这样我们就不能在将来得到HTML文档
                if (type.indexOf('xml') !== -1 && request.responseXML) {
                    callback(request.responseXML) //Document对象响应
                } else if (type === 'application/json; charset=utf-8') {
                    callback(JSON.parse(request.responseText)) //JSON对象响应
                } else {
                    callback(request.responseText) //字符串响应
                }
            }
        }
        request.open("GET", defaults.url,defaults.async);
        request.send(null)
    };

    this.post = function(opts,callback){
    	var defaults = {
        	url:'',
        	data:'',
            async:true,
            ContentType:'application/x-www-form-urlencoded'
        }
        defaults = objToObj(opts,defaults)
    	request.onreadystatechange = function() {
            //如果请求完成且成功
            if (request.readyState === 4 && request.status === 200) {
                //获得响应的类型
                var type = request.getResponseHeader('Content-Type');
                //检查类型，这样我们就不能在将来得到HTML文档
                if (type.indexOf('xml') !== -1 && request.responseXML) {
                    callback(request.responseXML) //Document对象响应
                } else if (type === 'application/json; charset=utf-8') {
                    callback(JSON.parse(request.responseText)) //JSON对象响应
                } else {
                    callback(request.responseText) //字符串响应
                }
            }
        }
        
       request.open("POST", defaults.url,defaults.async);
       request.setRequestHeader('Content-Type',defaults.ContentType)
       switch(defaults.ContentType){
       	   case 'application/x-www-form-urlencoded':
           defaults.data = encodeFormData(defaults.data);
           break;
           case 'application/json':
           defaults.data = JSON.stringify(defaults.data);
           break;
       }
       request.send(defaults.data)
    };

    //把obj1覆盖obj2，只覆盖obj2中存在的属性
    function objToObj(obj1,obj2){
    	for(key in obj1){
        	if(!obj2.hasOwnProperty(key)) continue;
        	obj2[key] = obj1[key];
        }
        return obj2;
    }


    //实例化XMLHttpRequest对象
    function xmlHttpRequest() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else { //在IE5和IE6中模拟XMLHttpRequest()构造函数
            window.XMLHttpRequest = function() {
                try {
                    //如果可用，则使用Active对象的最新版本
                    return new ActiveXObject('Msxml2.XMLHTTP.6.0');
                } catch (e1) {
                    try {
                        //否则，回退到较旧版本
                        return new ActiveXObject('Msxml2.XMLHTTP.3.0')
                    } catch (e2) {
                        //否则，抛错
                        throw new Error('XMLHttpRequest is not supported')
                    }
                }
            };
        }
    }


    /**
     * 传入对象，变成application/x-www-form-urlencoded格式
     */
    function encodeFormData(data) {
        if (!data) return '';
        var pairs = [];
        for (var name in data) {
            if (!data.hasOwnProperty(name)) continue;
            if (typeof data[name] === 'function') continue;
            var value = data[name].toString();
            name = encodeURIComponent(name.replace('%20', '+'));
            value = encodeURIComponent(value.replace('%20', '+'));
            pairs.push(name + "=" + value);
        }
        return pairs.join('&');
    }
}
