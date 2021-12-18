// 首页点击
function header_index() {
    $('.nav>a').first().on('click', function (e) {
        e.preventDefault();
        location.href = '../html/index.html'
    })
};

// 设计服务点击
function header_service() {
    $('.nav .item a').on('click', function (e) {
        e.preventDefault();
        // 在其他页面点击设计服务
        if (location.href != 'http://localhost:8030/html/service.html') {
            location.href = 'http://localhost:8030/html/service.html';
        };
        const category = localStorage.getItem('category');
        if (category) {
            location.href = '../html/service.html';
        }
    })
}
// 设计师点击
function header_design() {
    $('.nav>a').last().on('click', function (e) {
        e.preventDefault();
        location.href = '../html/design.html'
    })
}
// 设计服务子类点击
function service_nav() {
    $('.submenu').on('click', 'a', function (e) {
        e.preventDefault();
        const category = $(this).attr('category')
        if(location.href == 'http://localhost:8030/html/service.html' && category == ''){
            getText();
            const thisA = $('.nav1 .item[category]').first();
            console.log(thisA)
            thisA.addClass('active').siblings().removeClass('active');
            $('.nav1_sub').css('display', 'none');
            return
        }
        if (location.href == 'http://localhost:8030/html/service.html' && category != '') {
            localStorage.setItem('category', category);
            // 使存在category属性的a标签变色
            const thisA = $('.nav1 .item[category=' + category + ']');

            thisA.addClass('active').siblings().removeClass('active');

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
            return
        }
        if (category == '') {
            $('.nav1_sub').css('display', 'none');
            localStorage.removeItem('category');
            localStorage.removeItem('sub_category');
            getText();
            location.href = 'http://localhost:8030/html/service.html'
            return;
        }

        location.href = 'http://localhost:8030/html/service.html';
        localStorage.setItem('category', category);
        // 使存在category属性的a标签变色
        const thisA = $('.nav1 .item[category=' + category + ']');
        thisA.addClass('active').siblings().removeClass('active');

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
    })
}

// 封装获得内容区域数据
async function getText(option) {
    // try {
        const res = await pAjax({
            url: `/aa/api/v1/services/`,
            data: option,
        });
        console.log(JSON.parse(res));
        renderC(JSON.parse(res));
        // 将本页的内容数据存到本地数据里面
        localStorage.setItem('data', res);
    // } 
    // catch (error) {
    //     console.log(error)
    // }
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
            service
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

export default {
    header_index,
    header_service,
    header_design,
    service_nav,
}