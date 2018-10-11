const nvshens = require('./co');
const base_url = 'https://www.nvshens.com/g/'; //爬取相册网页的基本网址

let index = 1;
let start = 25380;
const end = 30000;

const main = async URL => {
    //1.请求网址
    const data = await nvshens.getPage(URL);
    //2.判断是否存在相册
    if (nvshens.getTitle(data.res)) {
        //3.下载照片
        await nvshens.download(data.res);
        //4.请求分页
        index++;
        const new_url = `${base_url}${start}/${index}.html`;
        main(new_url);
    } else {
        index = 1;
        console.log(`${base_url}${start}页面已完成`);
        start++;
        if (start < end) {
            //5.请求下一个网址
            main(base_url + start);
        } else {
            console.log(`${base_url}${end}所有页面已完成`);
        }
    }
};

main(base_url + start);
