var rq = require('request-promise'); //网络请求
const cheerio = require('cheerio'); //操作dom
const fs = require('fs'); //读写文件

//因为一些网站在解决盗链问题时是根据Referer的值来判断的，所以在请求头上添加Referer属性就好（可以填爬取网站的地址）。
//另外Referer携带的数据 是用来告诉服务器当前请求是从哪个页面请求过来的。
const headers = {
    Referer: 'https://www.nvshens.com/g/24656/'
};

//自定义mac本地下载目录，需预先创建，windows路径可参考评论
const basePath = 'H:/hzq/node_reptile_data/';

let downloadPath;

module.exports = {
    //请求页面
    async getPage(url) {
        // res 为网站的html
        let res = await rq({ url });
        return { url, res };
    },

    //判断页面是否存在相册
    getTitle(html) {
        const $ = cheerio.load(html);
        if ($('#htilte').text()) {
            downloadPath = basePath + $('#htilte').text();
            //创建相册
            if (!fs.existsSync(downloadPath)) {
                fs.mkdirSync(downloadPath);
                console.log(`${downloadPath}文件夹创建成功`);
            }
            return true;
        } else {
            return false;
        }
    },

    //下载相册照片
    async download(data) {
        if (data) {
            var $ = cheerio.load(data);
            $('#hgallery')
                .children()
                .each(async (i, elem) => {
                    const imgSrc = $(elem).attr('src');
                    const imgPath =
                        '/' +
                        imgSrc
                            .split('/')
                            .pop()
                            .split('.')[0] +
                        '.' +
                        imgSrc.split('.').pop();
                    console.log(`${downloadPath + imgPath}下载中`);
                    await rq({
                        url: imgSrc,
                        resolveWithFullResponse: true,
                        headers
                    }).pipe(fs.createWriteStream(downloadPath + imgPath));
                });
            console.log('page done');
        }
    }
};
