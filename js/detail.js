// 导入头部
import header from './header.js';

// 导入头部点击
import header_click from './header_click.js';

// 引入头部渲染
import renderN from './renderNav.js';

// 将顶部渲染到页面上去
$('.container').html(header());

// 讲获取的头部点击获取到具体函数并渲染
const {
    header_index,
    header_service,
    header_design,
    service_nav
} = header_click;

// 打开页面时，判断是否登录
const login = getCookie('login');
if (login) {
    $('.login').css('display', 'none');
    $('.register').css('display', 'none');
    // 将用户名渲染到页面当中；
    // $('.login_register').text('欢迎'+login + ',');
    const a1 = $('<p class="user">欢迎' + login + ',<span class="del">退出<span></p>');
    a1.appendTo($('.login_register'))
    // 给退出设置样式
    $('.del').css('color', 'blue').css('cursor', 'pointer')
    // 点击退出时，清除cookie，
    $('.del').on('click', () => {
        console.log(1)
        setCookie('login', login, -1);
        $('.user').remove();
        $('.login').css('display', 'inline-block');
        $('.register').css('display', 'inline-block');
    })
}
// 点击登录或注册跳转到相应页面
$('.login').click(() => {
    location.href = 'http://localhost:8030/html/login.html';
});

$('.register').click(() => {
    location.href = 'http://localhost:8030/html/zhuce.html';
});

// 调用首页点击
header_index();
// 调用服务页点击
header_service();
// 调用设计师页点击
header_design();

// 获取本地数据里的nav内容，渲染到头部，并调用头部导航点击
const data = JSON.parse(localStorage.getItem('nav'));
renderN(data, '.submenu div');
service_nav()


// 获得本地里存储的数据
const service_id = localStorage.getItem('service_id');

getContent(service_id);

// 封装获取内容
async function getContent(id) {
    try {
        const res = await pAjax({
            url: `/aa/api/v2/services/${id}`
        });
        console.log(JSON.parse(res));
        localStorage.setItem('details', res);
        renderLeft(JSON.parse(res));
        renderRight1(JSON.parse(res));
        renderRight2(JSON.parse(res));
        // 绑定点击事件
        $('.user1').on('click','.use_img' ,() => {
            // console.log(1)
           let user_id =  $('.user1').attr('user_id');
           console.log(user_id )
           location.href = `http://localhost:8030/html/user.html?${user_id}`;
        })
        $('.user1').on('click','.user_names' ,() => {
            // console.log(1)
           let user_id =  $('.user1').attr('user_id');
           location.href = `http://localhost:8030/html/user.html?${user_id}`;
        })
    } catch (error) {
        console.log(error);
    };
};

// 封装渲染左半部分的页面
function renderLeft(data) {
    // 获得所有小图
    // if()
    let imgs = ''
    data.desc.forEach(item => {
        if (item.type == 'image') {
            imgs += `<a href="#">
            <img src="https://muse-img.huabanimg.com/${item.image.key}_/fw/820" alt="">
        </a>`
        } else {
            imgs += `<a href="#" style="color:#000;">${item.text}</a>`
        }
    });

    // 获得拓展服务
    if (data.extra.urgent && data.extra.sub_services.length == 0) {
        var server = `<h3 class="server">加急服务</h3>
        <div class="prices">
            <div class="price">
                <p><input type="checkbox">
                    <span class="intro">加急服务，${data.extra.urgent.number}天完成</span>
                    <span class="money">￥${data.extra.urgent.price}/个</span>
                </p>
            </div>
        </div>`
    } else if (data.extra.urgent && data.extra.sub_services.length != 0) {
        // 获取所有拓展
        let expend = data.extra.sub_services.map(item => {
            return `<div class="price">
            <p><input type="checkbox">
                <span class="intro">${item.name}</span>
                <span class="money">￥${item.price}/个</span>
            </p>
        </div>`
        }).join('')

        var server = `<h3 class="server">加急服务</h3>
        <div class="prices">
            <div class="price">
                <p><input type="checkbox">
                    <span class="intro">加急服务，${data.extra.urgent.number}天完成</span>
                    <span class="money">￥${data.extra.urgent.price}/个</span>
                </p>
            </div>
        </div>
        <h3 class="server">拓展服务</h3>
        <div class="prices">
            ${expend}
        </div>`
    } else if (!data.extra.urgent && data.extra.sub_services.length != 0) {
        let expend = data.extra.sub_services.map(item => {
            return `<div class="price">
            <p><input type="checkbox">
                <span class="intro">${item.name}</span>
                <span class="money">￥${item.price}/个</span>
            </p>
        </div>`
        }).join('')

        var server = `<h3 class="server">拓展服务</h3>
        <div class="prices">
            ${expend}
        </div>`
    }

    const str = `
    <!-- 标题 -->
    <p>
        <a href="./service.html">设计服务</a>
        <span>»</span>
        <span class="name">${data.name}</span>
    </p>
    <!-- 题目 -->
    <h3 class="title">${data.name}</h3>
    <!-- 大图 -->
    <a href="#">
        <img src="https://muse-img.huabanimg.com/${data.cover[0].key}_/fw/880" alt="" class="bigImg">
    </a>
    <!-- 小图 -->
    <div class="contents_left2">
        <h3>服务说明</h3>
        <div class="allImg">
            <div class="smallImg">
                ${imgs}
            </div>
        </div>
    </div>
    <!-- 时间 -->
    <div class="contents_time">
        <h3>预估完成时间</h3>
        <p class="thinkT">${data.complete_in.unit == 'day' ?data.complete_in.number + '天' : data.complete_in.number + '周'}</p>
        ${server ?server : ''}
    </div>
    <!-- 分割 -->
    <div class="light"></div>
    <div class="contents_buy">
        <button class="buy">购买</button>
    </div>

`
    $('.contents_left').html(str)

}

// 封装渲染右半部分价格的页面
function renderRight1(data) {

    let stars = '';
    for (let i = 0; i < data.rating; i++) {
        stars += '★ '
    }

    if (data.extra.urgent && data.extra.sub_services.length == 0) {
        var str2 = `<h5>加急服务<span class="beca"> ？</span></h5>
       <p>
           <input type="checkbox">
           <label for="">加急服务，${data.extra.urgent.number}天完成
           </label>
           <span>￥${data.extra.urgent.price}</span>
       </p>`
    } else if (data.extra.urgent && data.extra.sub_services.length != 0) {
        // 获取所有拓展
        let expend = data.extra.sub_services.map(item => {
            return `<p>
            <input type="checkbox">
            <label for="">${item.name}
            </label>
            <span>￥${item.price}</span>
        </p>`
        }).join('')

        var str2 = `<h5>加急服务<span class="beca"> ？</span></h5>
        <p>
            <input type="checkbox">
            <label for="">加急服务，${data.extra.urgent.number}天完成
            </label>
            <span>￥${data.extra.urgent.price}</span>
        </p>
        <p class="cut"></p>
        <h5>拓展服务<span class="beca"> ？</span></h5>
        ${expend}`

    } else if (!data.extra.urgent && data.extra.sub_services.length != 0) {
        // 获取所有拓展
        let expend = data.extra.sub_services.map(item => {
            return `<p>
        <input type="checkbox">
        <label for="">${item.name}
        </label>
        <span>￥${item.price}</span>
    </p>`
        }).join('')

        var str2 = `<h5>拓展服务<span class="beca"> ？</span></h5>
        ${expend}`
    }

    let str1 = `<h3 class="meet">${data.price == 0 ?'价格面议' :data.price+'/'+data.unit}</h3>
    <p class="low">
        <span>基础服务价格</span>
        <a href="#">了解更多</a>
    </p>
    <p class="cut"></p>
    <p class="getIt">
        <span class="good">成交</span>
        <span class="num">${data.order_count}</span>
    </p>
    <p class="talk">
        <span class="about">评价</span>
        <span class="shark">${stars}</span>
    </p>
    <p class="cut"></p>
    <div class="space">
        ${str2 ?str2 :''}
        <button class="meet_buy">购买</button>
    </div>`

    $('.contents_right1').html(str1);
}

// 封装渲染右半部分用户
function renderRight2(data) {
    let times = data.user.extra.response_time;
    let d = parseInt(times / 60 / 60 / 24);
    let h = parseInt(times / 60 / 60 % 24);
    let m = parseInt(times / 60 % 60);
    let s = parseInt(times % 60);
    let thisT = `${d ?d+'天' :''}${h ?h+'时' :''}${m}分${s}秒`;
    let str3 = `<div class="user1" user_id="${data.user_id}">
    <div class="user_head">
        <img src="https://hbimg.huabanimg.com/${data.user.avatar.key}_/both/70x70" alt="" class="use_img">
    </div>
    <div class="user_name">
        <p class="user_names">${data.user.username}</p>
        <p class="user_talk">
            <i class="user_talks"></i>
            <span>聊天</span>
        </p>
    </div>
</div>
<p class="cut"></p>
<div class="time">
    <p class="node_time">
        <i></i>
        <span>平均响应时间</span>
        <span class="thatT">${thisT}</span>
    </p>
    <p class="card">
        <i></i>
        <span>实名认证</span>
        <span class="sure">已认证</span>
    </p>
</div>
<p class="cut"></p>
<p class="text">
    ${data.user.desc}
</p>`

    $('.contents_right2').html(str3);
}