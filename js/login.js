// 添加用户名验证
jQuery.validator.addMethod('nameTest',(value) => {
    const nameReg = /^[a-z][0-9a-z]{3,8}$/i;
    return nameReg.test(value);
})
// 添加密码验证
jQuery.validator.addMethod('passTest',value => {
    const passReg = /^[0-9a-z]{6,10}$/i;
    return passReg.test(value);
})

$('form').validate({
    rules:{
        username:{
            required:true,
            nameTest:true,
        },
        password:{
            required:true,
            passTest:true,
        },
        arg:{
            required:true,
        }
    },
    messages:{
        username:{
            required:'用户名必填',
            nameTest:'用户名由4-9位数字、字母，且开头为字母组成'
        },
        password:{
            required:'密码必填',
            passTest:'密码由6-10位数字、字母组成'
        },
        arg:{
            required:'请阅读并同意协议'
        }
    },

    submitHandler:function(){
        const user = $('input[name=username]').val();
        const pass = $('input[name=password]').val();
        $.ajax({
            url:'http://localhost:8030/login',
            data:{
                username:user,
                password:pass,
            },
            success:function(res){
                if(!res.code){
                    alert(res.msg);
                    return
                }
                setCookie('login',user,10);
                location.href = '../html/index.html';
            }
        })
    }
})