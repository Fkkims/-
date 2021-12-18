// 引入头部
import header from './header.js';

// 引入渲染头部函数
import renderN from './renderNav.js';

// 引入头部点击首页
import header_click from './header_click.js';


const {
    header_index,
    header_service,
    header_design,
    service_nav
} = header_click;

// localStorage.clear();

// 获取导航数据
getNav();

// 打开页面时根据本地来渲染页面
const category = localStorage.getItem('category');
if(category){
    getNav();
    getText({category : category});
    
    getN()
}else{
    getNav();
    getText();
    $('.nav1_sub').css('display', 'none');
}

localStorage.clear();

// 封装打开页面时的操作
async function getN() {
    try {
        let res = await pAjax({
            url: `../data/nav.json`,
        })
        console.log((JSON.parse(res)))
        // 将获得的数据以JSON数据存储在本地数据库里
        localStorage.setItem('nav', res);
        // 将获得的数据渲染到分类导航里
        renderN(JSON.parse(res), '.nav1 .nav_list', 'item');
        // 分类导航进行点击变色
        const thisA = $('.nav1 .item[category=' + category + ']');
        thisA.addClass('active').siblings().removeClass('active');

        const data = JSON.parse(localStorage.getItem('nav'));

        // 过滤并渲染子类导航
        const kid = data.filter(item => {
            return category == item.category
        })[0];
    
        $('.nav1_sub').css('display', 'block');
    
        renderS(kid.sub)

    } catch (error) {
        console.log(error)
    };
};

// 获取顶部内容元素并渲染头部
$('.header .container').html(header());

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
    $('.del').css('color', 'blue').css('cursor','pointer')
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
$('.login').click(() =>{
    location.href = 'http://localhost:8030/html/login.html';
});
console.log($('.login'))
$('.register').click(() => {
    location.href = 'http://localhost:8030/html/zhuce.html';
});

// 调用首页点击
header_index();
// 调用设计服务点击
header_service();
// 调用设计师点击
header_design();

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
        const sub_category = localStorage.getItem('sub_category');
        let local = `${creategory ?'category='+creategory:''}&limit=20&page=${idx}&${sub_category ?'sub_category='+sub_category :''}`;
        getText(local);
        $('html').animate({
            scrollTop:0,
        })
    }
});


// 调用设计服务子类点击
service_nav();


// 获取内容数据
getText();

// 给分类设置点击事件
$('.nav1').on('click', '.item', function (e) {
    e.preventDefault();
    // 设置点击变色效果
    $(this).addClass('active').siblings().removeClass('active');
    const category = $(this).attr('category')
    // 点击分类时，取消加急按钮
    $('.changes2 .box').removeClass('active');
    $('.changes2 .box i').removeClass('move');
    // 当点击为全部的时候，子类消失,且移除本地储存
    if (category == '') {
        $('.nav1_sub').css('display', 'none');
        localStorage.removeItem('category');
        localStorage.removeItem('sub_category');
        getText();
        return;
    }
    localStorage.setItem('category', category);

    // 获取存储本地上的数据
    const data = JSON.parse(localStorage.getItem('nav'));

    // 过滤并渲染子类导航
    const kid = data.filter(item => {
        return category == item.category
    })[0];
    $('.nav1_sub').css('display', 'block');
    renderS(kid.sub)

    // 点击分类重新渲染页面
    getText({
        category: category
    });
});

// 给子类设置点击事件
$('.nav1_sub').on('click', '.item', function (e) {
    e.preventDefault();
    // console.log(1)
    $(this).addClass('active').siblings().removeClass('active');

    // 获取点击当前子类的自定义属性并存储到本地数据
    const sub_category = $(this).attr('sub_category');
    localStorage.setItem('sub_category', sub_category);

    // 获取分类的自定义属性
    const category = localStorage.getItem('category');
    // 重新渲染页面
    getText({
        category: category,
        sub_category: sub_category
    });
})

// 设置点击加急服务
$('.changes2 .box').on('click', function () {
    let data = JSON.parse(localStorage.getItem('data'));
    // 有这个类名的话就移除，没有就添加
    if (!($(this).hasClass('active'))) {
        $(this).addClass('active');
        $('.changes2 .box i').addClass('move');
        let data1 = data.filter(item => {
            return item.extra.urgent
        })
        if(data.length < 20){
            renderC(data1)
            return
        }
        let n = 2;

        // 调用加急
        other();

        async function other() {
            try {
                // 循环到data1数组里充满20个数据
                while (data1.length < 20) {
                    const creategory = localStorage.getItem('category');
                    const sub_category = localStorage.getItem('sub_category');
                    let local = `${creategory ?'category='+creategory:''}&limit=20&page=${n}&${sub_category ?'sub_category='+sub_category :''}`;

                    let res = await pAjax({
                        url: `/aa/api/v1/services/`,
                        data: local,
                    })
                    // 筛选有加急的
                    let res1 = JSON.parse(res).filter(item => {
                        return item.extra.urgent
                    })
                    // 将加急的添加到data1里面
                    res1.forEach(item1 => {
                        if(data1.length >= 20){
                            return
                        }
                        data1.push(item1)
                    })
                    renderC(data1);
                    n++
                }
            } catch (error) {
                console.log(error)
            }
            console.log(data1)
        }
        return
    }
    $(this).removeClass('active');
    $('.changes2 .box i').removeClass('move');
    renderC(data);
})

// 设置点击商品跳转详情页
$('.list_content').on('click','.pimg',function(e){
    // console.log(1);
    const service_id = $(this).attr('service_id');
    console.log(service_id);
    localStorage.setItem('service_id',service_id);
    location.href = 'http://localhost:8030/html/detail.html'
});

// 封装获取导航数据
async function getNav() {
    try {
        let res = await pAjax({
            url: `../data/nav.json`,
        })
        console.log((JSON.parse(res)))
        // 将获得的数据以JSON数据存储在本地数据库里
        localStorage.setItem('nav', res);
        // 将获得的数据渲染到顶部导航
        renderN(JSON.parse(res), '.submenu div');
        // 将获得的数据渲染到分类导航里
        renderN(JSON.parse(res), '.nav1 .nav_list', 'item');
    } catch (error) {
        console.log(error)
    };
};
gets()
async function gets(){
    const res = await pAjax({
        url: `/aa/api/v1/services/`,
        data: 'urgent=true',
    });
    console.log(JSON.parse(res));
}


// 封装获得内容区域数据
async function getText(option) {
    try {
        const res = await pAjax({
            url: `/aa/api/v1/services/`,
            data: option,
        });
        console.log(JSON.parse(res));
        renderC(JSON.parse(res));
        // 将本页的内容数据存到本地数据里面
        localStorage.setItem('data', res);
    } catch (error) {
        console.log(error)
    }
}

// 封装渲染子类导航
function renderS(data) {
    let str = data.map(item => {
        return `<a class="item" sub_category="${item.sub_category}">${item.name}</a>`
    })
    $('.nav1_sub .nav_list').html(str)
}

// 封装渲染内容
function renderC(data) {
    const str = data.map(item => {
        return `<div class="item">
        <img
            src="https://muse-img.huabanimg.com/${item.cover[0].key}_/both/280x280"
            alt=""
            service_id="${item.service_id}"
            class="pimg"
        />
        <label class="title">${item.name}</label>
        <footer class="extra">
            <label class="price">
            ${item.price == 0 ?'价格面议' :'￥'+item.price+'<small>/'+item.unit+'</small>'}
                
            </label>
            <p class="tip">${item.extra.urgent ?'提供加急服务' :''} ${item.extra.sub_services.length != 0 ?'提供拓展服务' :''}</p>
        </footer>
    </div>`
    })
    $('.list_content').html(str);
}