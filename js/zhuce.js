
// 往validate里添加扩展方法（正则验证）
// 添加用户名正则验证
jQuery.validator.addMethod('testName',(value) => {
    const nameReg = /^[a-z][0-9a-z]{3,8}$/i;
    return nameReg.test(value);
});
// 添加手机号正则验证
jQuery.validator.addMethod('testTel',(value) => {
    const telReg = /^1[3-9]\d{9}$/;
    return telReg.test(value);
});
// 添加密码正则验证
jQuery.validator.addMethod('testPass', value => {
    const passReg = /^[0-9a-z]{6,10}$/i;
    return passReg.test(value);
});

// 设置获取随机验证码
$('.btn1').on('click',function(){
    const rei = parseInt((Math.random()*899999)+100000);
    $('input[name=request]').val(rei);
})


// 设置注册页面的表单提交
$('form').validate({
    rules: {
        username: {
            required: true,
            testName: true,
        },
        tel:{
            required: true,
            testTel: true,
        },
        password:{
            required: true,
            testPass: true,
        },
    },
    messages: {
        username:{
            required:'用户名必填',
            testName:'用户名由4-9位数字、字母，且开头为字母组成',
        },
        tel:{
            required:'手机号码必填',
            testTel:'手机号码格式不正确'
        },
        password:{
            required:'密码必填',
            testPass:'密码设置不符合要求'
        },
    },
    submitHandler:function(){
        const user = $('input[name=username]');
        const pass = $('input[name=password]');
        const tel = $('input[name=tel]');
        $.ajax({
            url:'http://localhost:8030/get',
            data:{
                username:user.val(),
                tel:tel.val(),
                password:pass.val(),
            },
            success:function(res){
                console.log(res);
                if(!res.code){
                    alert(res.msg);
                    return;
                }
                alert(res.msg);
                location.href = './login.html';
            },
        })
    }
});

