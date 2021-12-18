// 引入头部样式
import header from './header.js';
// 引入头部点击事件
import header_click from './header_click.js';
// 引入头部渲染
import renderN from './renderNav.js';

// 将头部点击事件赋值
const {
    header_index,
    header_service,
    header_design,
    service_nav
} = header_click;

localStorage.removeItem('category');

// 渲染头部样式
$('.container').html(header());

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

// 获得导航内容并渲染
const nav = JSON.parse(localStorage.getItem('nav'));
console.log(nav);
// renderN(nav, '.navs1_1');

// 给导航设置点击变色并重新渲染页面
$('.navs1_1').on('click', 'a', function (e) {
    e.preventDefault();

    $(this).addClass('active').siblings().removeClass('active');

    const category = $(this).attr('category');

    if(!category){
        getConcrete();
        return 
    }
    getConcrete({category:category});
})

// 获得具体内容数据以及渲染到页面内
getConcrete();

// 设置分页
const page = document.querySelector('.pagenation');
new Pagination(page, {
    pageInfo: {
        pagenum: 1, // 默认显示第一几页
        pagesize: 20, // 每一页多少条数据
        total: 1000, // 总共有多少条数据
        totalpage: 100, // 总共有多少页
    },
    textInfo: {
        first: "首页",
        prev: "上一页",
        next: "下一页",
        last: "末尾",
    },
    change(idx) {
        // 获取存储在本地数据的自定义属性并重新渲染内容
        const creategory = localStorage.getItem('category');
        let local = `${creategory ?'category='+creategory:''}&limit=20&page=${idx}`;
        getConcrete(local);
        // scrollTo({top:0});
        console.log($(window).scrollTop());
        $('html').animate({
            scrollTop: 0
        })
    }
});

// 封装获得具体内容数据以及渲染到页面内
async function getConcrete(option) {
    try {
        const res = await pAjax({
            url: 'https://muse.huaban.com/api/v1/users/',
            data: option,
        })
        console.log(JSON.parse(res));
        
        renderCon(JSON.parse(res));
    } catch (error) {
        console.log(error)
    }
}


// 封装渲染内容
function renderCon(data) {
    let transl = {
        ui_designer:'UI设计师',
        designer:'平面设计师',
        photographer:'摄影师',
        illustrator:'插画师',
        graphic:'漫画师',
        animator:'动画师',
        household_desiger:'家居设计师',
        interior_designer:'室内设计师',
        architect:'建筑设计师',
        costume_designer:'服装设计师',
        industrial_designer:'工业设计师',
        stylist:'造型师',
        game_designer:'游戏美术师',
        artisan:'手工艺人',
        other:'其他',
    };
    let str = '';
    data.forEach(item => {
        str += `<a href="http://localhost:8030/html/user.html?${item.user_id}">
        <div class="list">
            <div class="list1">
                <div class="list1_txt">
                    <h3>${item.username}</h3>
                    <p>
                        <span>${item.service_count !=0 ?item.service_count+'个设计服务' :''}</span>
                        ${item.extra.rating ?`<span>●</span>
                        <span>评价：</span>
                        <span>
                        <b class="${item.extra.rating > 0.5 ?'active' :''}">★</b> 
                        <b class="${item.extra.rating > 1.5 ?'active' :''}">★</b> 
                        <b class="${item.extra.rating > 2.5 ?'active' :''}">★</b> 
                        <b class="${item.extra.rating > 3.5 ?'active' :''}">★</b> 
                        <b class="${item.extra.rating > 4.5 ?'active' :''}">★</b> 
                         </span>` :''}
                        
                    </p>
                    <div class="ph">
                    ${item.category.map(item => {
                        return `<p>${transl[item]}</p>`
                    }).join('')}
                       
                    </div>
                </div>
                <img src="	https://hbimg.huabanimg.com/${item.avatar.key}_/both/140x140" alt="">
            </div>
            <div class="list2">
                ${item.desc}
            </div>
        </div>
    </a>`
    })
    $('.concretes').html(str);
}