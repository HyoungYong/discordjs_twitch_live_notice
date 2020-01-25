const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

const getHtml = async () => {
  try {
    return await axios.get("https://www.ubisoft.com/ko-kr/game/rainbow-six/siege/news-updates");
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then(html => {
    const urlList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("div.updatesFeed__items").children("a.updatesFeed__item");

    $bodyList.each(function(i, e) {
      urlList[i] = {
        title: $(this).find('h2.updatesFeed__item__wrapper__content__title').text(),
        subtitle: $(this).find('p.updatesFeed__item__wrapper__content__abstract').text(),
        imgURL: $(this).find('div.updatesFeed__item__wrapper__media img').attr('src'),
        URL: 'https://www.ubisoft.com' + $(this).attr('href'),
        year: $(this).find('span.date__year').text(),
        month: $(this).find('span.date__month').text(),
        day: $(this).find('span.date__day').text()
      };
    });

    return urlList;

  }).then(res => log(res));

// #app > div.r6s-newslist.undefined > div:nth-child(3) > div > div > div.updatesFeed__items > a:nth-child(1) > div
// getHtml()
//   .then(html => {
//     let ulList = [];
//     const $ = cheerio.load(html.data);
//     const $bodyList = $("div.updatesFeed__items").children("li.section02");

//     $bodyList.each(function(i, elem) {
//       ulList[i] = {
//           title: $(this).find('strong.news-tl a').text(),
//           url: $(this).find('strong.news-tl a').attr('href'),
//           image_url: $(this).find('p.poto a img').attr('src'),
//           image_alt: $(this).find('p.poto a img').attr('alt'),
//           summary: $(this).find('p.lead').text().slice(0, -11),
//           date: $(this).find('span.p-time').text()
//       };
//     });

//     const data = ulList.filter(n => n.title);
//     return data;
//   })
//   .then(res => log(res));

//   console.log(log);