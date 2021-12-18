function setCookie(key,value,expires){
    if(!key){
        throw new Error('key值必须有')
    }

    // 判断value值
    let t = Object.prototype.toString.call(value);
    let val = value && t == '[object String]' ?value :'';

    expires = expires ?expires :( t =='[object Number]' ?value :'');

    if(expires){
        let data = new Date();
        let time = data.getTime() - 8*60*60*1000 + expires*60*1000;
        data.setTime(time);
        document.cookie = `${key}=${val};expires=${data};path=/`
        return
    }
    document.cookie = `${key}=${val};path=/`;
}

function getCookie(key){
    let res = document.cookie;
    let obj = {};
    let arr = res.split('; ')
    arr.forEach(item => {
        let [key,value] = item.split('=');
        obj[key] = value;
    })
    if(key){
        return obj[key]
    }
    return obj;
}