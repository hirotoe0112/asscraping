const puppetter = require('puppeteer');
const fs = require('fs');

puppetter.launch().then(async browser => {
    const page = await browser.newPage();
    let res = await page.goto('https://audiostock.jp/artists/56028');

    const newaudioselector = "section#audios";
    const audiolistselector = "section#audios div.player-audio-info-main div.text-truncate";
    const linkselector = "section#audios div.player-audio-info-main div.text-truncate a";

    //アーティストページのhtmlを取得
    //const data = await page.evaluate((selector) => {
    //    return document.querySelector(selector).innerHTML;
    //}, newaudioselector);

    //アーティストページの新着作品一覧を取得
    //const data2 = await page.evaluate((selector) => {
    //    const list = Array.from(document.querySelectorAll(selector));
    //    return list.map(data => data.innerHTML);
    //}, audiolistselector);

    //アーティストページの新着作品一覧のリンクとタイトルを取得
    const data3 = await page.evaluate((selector) => {
        const list = Array.from(document.querySelectorAll(selector));
        var result = [];
        list.forEach(element => {
            var item = {
                url: element.href,
                title: element.textContent
            }
            result.push(item);
        });
        return result;
    }, linkselector);

    //作品ページのhtmlを取得
    //res = await page.goto(data3[0].url);
    //const iframeselector = "div.contents-side-inner input";
    //アーティストページのhtmlを取得
    //const data4 = await res.text();
    //iframeタグを取得
    //const data5 = await page.evaluate((selector) => {
    //    const list = Array.from(document.querySelectorAll(selector));
    //    return list[0].value;
    //}, iframeselector);
    //iframeタグを取得しなくてもURLに作品番号だけ変えればOKっぽい

    //iframeタグを取得２
    var idlist = [];
    var taglist = [];
    data3.forEach(item => {
        var url = item.url;
        var id = url.split("/")[url.split("/").length - 1];
        idlist.push(id);
        var iframe = '<iframe width="100%" height="100" scrolling="no" frameborder="no" src="https://audiostock.jp/embed?id=' + id + '"></iframe>';
        taglist.push(iframe);
    });

    //const html = await res.text();
    //fs.writeFile('artist.html', html, 'utf8', (err) => {
    //    console.log(err);
    //});
    //fs.writeFile('artistaudio.html', data, 'utf8', (err) => {
    //    console.log(err);
    //});
    fs.writeFile('audiolist.json', JSON.stringify(data3), 'utf8', (err) => {
        console.log(err);
    });
    //fs.writeFile('iframe.txt', data5, 'utf8', (err) => {
    //    console.log(err);
    //});
    fs.writeFile('iframe2.txt', JSON.stringify(taglist), 'utf8', (err) => {
        console.log(err);
    });
    browser.close();
});