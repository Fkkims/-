function renderN(data,name,other){
    const str = data.map((item,index) => {
        return `<a class="${other ?other :''} ${index == 0 ?'active' :''}" href="" category="${item.category}">${item.name}</a>`
    }).join('')
    $(name).html(str);
}

export default renderN;