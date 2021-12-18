import header from './header.js';

import renderN from './renderNav.js';

import header_click from './header_click.js';

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

// 获取网址里的用户ID
const id = location.search.split('?')[1];

// 将内容渲染到页面内
getData();

// 默认渲染设计服务
getService();

// 获得原创数据
// getProduct();

// 绑定设计服务点击事件
$('.service').on('click', () => {
    $('.service').addClass('active').siblings().removeClass('active');
    getService();
})

// 绑定原创点击事件
$('.product').on('click', () => {
    $('.product').addClass('active').siblings().removeClass('active');
    getProduct();
})

// 绑定个人介绍点击事件
$('.ownlist').on('click', () => {
    $('.ownlist').addClass('active').siblings().removeClass('active');
    renderOwnlist()
})

// getDat()
// async function getDat() {
//     try {
//         const res = await pAjax({
//             url: '/aa/api/v1/users/945234/boards/',
//         })
//         console.log(JSON.parse(res));
//     } catch (error) {
//         console.log(error)
//     }
// }

// 封装得到具体数据
async function getData(option) {
    try {
        const res = await pAjax({
            url: '/aa/api/v1/users/' + id,
            data: option,
        })
        console.log(JSON.parse(res));
        renderOwn(JSON.parse(res));
        localStorage.setItem('own', res);
    } catch (error) {
        console.log(error)
    }
}

// 封装渲染个人资料
function renderOwn(data) {
    // 计算响应时间
    const d = parseInt(data.extra.response_time / 60 / 60 / 24);
    const h = parseInt(data.extra.response_time / 60 / 60 % 24);
    const m = parseInt(data.extra.response_time / 60 % 60);
    const s = parseInt(data.extra.response_time % 60);

    const time = `${d != 0 ?d+'天' :'' }${h != 0 ?h+'时' :''}${m}分${s}秒`;

    // 根据评价来渲染星星
    let shark = '';
    for (let i = 1; i <= data.status; i++) {
        shark += ' ★';
    };

    const str = ` <div class="user_left">
    <img src="https://hbimg.huabanimg.com/${data.avatar.key}_/both/120x120"
        alt="">
    <div class="user_left1">
        <h3>${data.username}</h3>
        <p class="lab">
            <label>插画师･漫画师･手工艺人</label>
            <span>${data.city}</span>
        </p>
        <p class="intro">
            ${data.desc}
        </p>
    </div>
    <div class="talk">
        <p></p>
        <div>发起聊天</div>
    </div>
</div>
<div class="user_right">
    <div class="user_right1">
        <i></i>
        <label for="">平均响应时间</label>
        <span>${time}</span>
    </div>
    <div class="user_right2">
        <i></i>
        <label for="">实名认证</label>
        <span>已认证</span>
    </div>
    <div class="user_right3">
        <i></i>
        <label for="">评价</label>
        <span>${shark}</span>
    </div>
</div>`

    // 渲染到内容去
    $('.user1').html(str);
}

// 封装得到原创服务数据
async function getService() {
    try {
        const res = await pAjax({
            url: 'https://muse.huaban.com/api/v1/users/' + id + '/services/',
            data: 'limit=100',
        });
        renderService(JSON.parse(res));
    } catch (error) {
        console.log(error)
    };
}

// 封装渲染原创服务
function renderService(data) {
    // 给原创服务添加父元素
    $('.content').html($('<div class="contents_own"></div>'));
    let str = '';
    str = data.map(item => {
        return `<div class="item">
        <img src="https://muse-img.huabanimg.com/${item.cover[0].key}_/both/280x280"
            alt="" />
        <label class="title">${item.name}</label>
        <footer class="extra">
            <label class="price">
            ${item.price == 0 ?'价格面议' :'￥'+item.price+'<small>/'+item.unit+'</small>'}
            </label>
            <p class="tip">${item.extra.sub_services.length != 0 ?'提供可选拓展' :''}${item.extra.urgent ?'提供加急服务' :''}</p>
        </footer>
    </div>`
    }).join('');
    // 将内容添加到添加的父元素里面去
    $('.contents_own').html(str);
}

// 封装得到原创数据
async function getProduct() {
    try {
        const res = await pAjax({
            url: 'https://muse.huaban.com/api/v1/users/' + id + '/boards/'
        })
        console.log(JSON.parse(res));
        renderProduct(JSON.parse(res));
    } catch (error) {
        console.log(error);
    };
};

// 封装渲染原创数据
function renderProduct(data) {
    // 给原创添加父元素
    $('.content').html($('<div class="contents_own"></div>'));
    let str = '';
    console.log(data)
    str = data.map(item => {
        return ` <div class="item">
        <img src="https://hbimg.huabanimg.com/${item.cover.key}_/both/280x280"
            alt="" />
        <label class="title1">${item.title}</label>
        <footer class="extra">
            
            <p class="tip1">${item.pin_count}张图片</p>
        </footer>
    </div>`
    }).join('')

    // 渲染到父元素内
    $('.contents_own').html(str);
};

// 封装渲染个人介绍
function renderOwnlist() {
    const ownList = JSON.parse(localStorage.getItem('own'));
    console.log(ownList);

    // 计算响应时间
    const d = parseInt(ownList.extra.response_time / 60 / 60 / 24);
    const h = parseInt(ownList.extra.response_time / 60 / 60 % 24);
    const m = parseInt(ownList.extra.response_time / 60 % 60);
    const s = parseInt(ownList.extra.response_time % 60);

    const time = `${d != 0 ?d+'天' :'' }${h != 0 ?h+'时' :''}${m}分${s}秒`;

    // 添加个人介绍父元素
    $('.content').html($('<div class="contents_text"></div>'));

    const str = `<div class="item">
        <label for="">所在地</label>
        <p class="city">${ownList.city}</p>
    </div>
    <div class="item">
        <label for="">擅长领域</label>
        <p>插画师漫画师手工艺人</p>
    </div>
    <div class="item">
        <label for="">实名认证</label>
        <p>已认证</p>
    </div>
    <div class="item">
        <label for="">评分</label>
        <p class="status">${ownList.status}</p>
    </div>
    <div class="item">
        <label for="">响应时间</label>
        <p class="status">${time}</p>
    </div>
    <div class="item">
        <label for="">个人简介</label>
        <p class="person">${ownList.desc}</p>
    </div>`

    // 添加到父元素里面
    $('.contents_text').html(str);
}