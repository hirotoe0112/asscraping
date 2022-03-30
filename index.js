const puppetter = require('puppeteer');
const fs = require('fs');

puppetter.launch().then(async browser => {
    const page = await browser.newPage();
    const res = await page.goto('https://audiostock.jp/artists/56028');

    const newaudioselector = "section#audios";
    const audiolistselector = "section#audios div.player-audio-info-main div.text-truncate";
    const linkselector = "section#audios div.player-audio-info-main div.text-truncate a";

    //アーティストページのhtmlを取得
    const data = await page.evaluate((selector) => {
        return document.querySelector(selector).innerHTML;
    }, newaudioselector);

    //アーティストページの新着作品一覧を取得
    const data2 = await page.evaluate((selector) => {
        const list = Array.from(document.querySelectorAll(selector));
        return list.map(data => data.innerHTML);
    }, audiolistselector);

    //アーティストページの新着作品一覧のリンクとタイトルを取得
    const data3 = await page.evaluate((selector) => {
        const list = Array.from(document.querySelectorAll(selector));
        var result = [];
        list.forEach(element => {
            var item = {
                href: element.href,
                title: element.textContent
            }
            result.push(item);
        });
        return result;
    }, linkselector);

    //const html = await res.text();
    //fs.writeFile('artist.html', html, 'utf8', (err) => {
    //    console.log(err);
    //});
    fs.writeFile('artistaudio.html', data, 'utf8', (err) => {
        console.log(err);
    });
    fs.writeFile('audiolist.json', JSON.stringify(data3), 'utf8', (err) => {
        console.log(err);
    });
    browser.close();
});