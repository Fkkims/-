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

// 渲染头部样式
$('.container').html(header());

// 调用首页点击
header_index();
// 调用服务页点击
header_service();
// 调用设计师页点击
header_design();

// 打开首页时，判断是否登录
const login = getCookie('login');
if (!login) {
    location.href = '../html/login.html';
} else {
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
        setCookie('login', login, -1);
        $('.user').remove();
        $('.login').css('display', 'inline-block');
        $('.register').css('display', 'inline-block');
        location.reload();
    })
}
// 点击登录或注册跳转到相应页面
$('.login').click(() => {
    location.herf = '../html/login.html';
});

$('.register').click(() => {
    location.href = '../html/zhuce.html';
});

// 获取本地数据里的nav内容，渲染到头部，并调用头部导航点击
const data = JSON.parse(localStorage.getItem('nav'));
renderN(data, '.submenu div');
service_nav()

// 轮播图
let mySwiper = new Swiper('.swiper-container', {
    // direction: 'vertical', // 垂直切换选项
    loop: true, // 循环模式选项

    autoplay: {
        delay: 3000, //自动播放，3s切换
        disableOnInteraction: false, //不禁用自动播放
    },

    effect: 'fade', //浅淡切换
    fadeEffect: {
        crossFade: true,
    }, //透明度消失
});

// 第二幅轮播图
let mySwiper1 = new Swiper('.swiper1', {
    direction: 'horizontal', // 垂直切换选项
    // loop: true, // 循环模式选项

    loop: true, // 循环模式选项

    slidesPerView: 3,
    slidesPerGroup: 3, //定义3个显示以及3个一组
    spaceBetween: 20,

    observer: true,
    observeParents: true,
    // effect:'fade',//浅淡切换
    // fadeEffect: {
    //     crossFade: true,
    //   },//透明度消失

    // 如果需要分页器
    pagination: {
        el: '.swiper-pagination',
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});


// 添加页面滚动事件使顶部变色
$(window).on('scroll', () => {
    if ($('html').scrollTop() == 0) {
        $('.header').addClass('top');
    } else {
        $('.header').removeClass('top');
    }
});