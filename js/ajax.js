function ajax(option) {
    // 判断地址是否存在
    if (!option.url) {
        throw new Error('url地址是必填的');
    }
    // 判断结果回调函数是否存在
    if (!option.success) {
        throw new Error('success回调函数是必填的');
    }
    // 设置初始值
    let params = {
        url: option.url,

        type: option.type || 'get',

        data: option.data || '',

        async: option.async == false ? false : true,

        success: option.success,

        err: option.err || function () {}
    }
    // 确认type的类型
    if (!(params.type == 'get' || params.type == 'post')) {
        throw new Error('type只能为get或者post');
    }
    // 确认data里是否为字符串或者对象
    if (!(Object.prototype.toString.call(params.data) == '[object String]' || Object.prototype.toString.call(params.data) == '[object Object]')) {
        throw new Error('data只能为字符串或对象');
    }
    // 判断data字符串里是否存在=号
    if (Object.prototype.toString.call(params.data) == '[object String]' && params.data != '' && !params.data.includes('=')) {
        throw new Error('data为字符串内，只能说key=value形式');
    }
    // 判断success是否为回调函数
    if (Object.prototype.toString.call(params.success) != '[object Function]') {
        throw new Error('success必须为函数类型');
    }
    // 如果data为对象
    if (Object.prototype.toString.call(params.data) == '[object Object]') {
        let str = '';
        for (let key in params.data) {
            str += key + '=' + params.data[key] + '&';
        }
        // 截取最后一个&
        params.data = str.slice(0, -1)
    }

    let xhr = new XMLHttpRequest();

    if (params.type == 'get') {
        xhr.open(params.type, params.url + '?' + params.data, params.async);

        xhr.send();
    } else {
        xhr.open(params.type, params.url, params.async);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
        xhr.send(params.data);
    }

    if (params.async == false) {
        // 如果http状态码为2.3开头
        if (/^[23]\d{2}$/.test(xhr.status)) {
            params.success(xhr.responseText);
            return;
        }
        
        params.err(xhr.statusText)
        // 返回错误
    }

    xhr.onload = function () {
        if (/^[23]\d{2}$/.test(xhr.status)) {
            params.success(xhr.responseText);
            return;
        }
        params.err(xhr.statusText);
        // 返回错误
    }
}

// 二次封装ajax获得一个promise的函数
function pAjax(option){
    let p = new Promise((resolve,reject) => {
        ajax({
            url:option.url,
            type:option.type,
            data:option.data,
            async:option.async,
            success:function(res){
                resolve(res);
            },
            err:function(res1){
                reject(res1);
            }
        });
    });
    return p
}