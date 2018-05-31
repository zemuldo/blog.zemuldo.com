module.exports = {
  getBlogTemplate: (details) => {
    let html =
      `<!doctype html>\n` +
      `<html lang="en">\n` +
      `<head>\n` +
      `<meta charset="utf-8">\n` +
      `<meta name="author" content="Danstan Otieno Onyango">\n` +
      `<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n` +
      `<link rel="shortcut icon" href="/static/img/icons/icon-256x256.png">\n` +
      `<meta name="description" content= ${details.description} >\n` +
      `<meta name="twitter:card" content="${details.imgSRC}">\n` +
      `<meta name="twitter:site" content="@zemuldo">\n` +
      `<meta name="twitter:title" content="Top 10 Things Ever">\n` +
      `<meta name="twitter:description" content="Up than 200 characters.">\n` +
      `<meta name="twitter:creator" content="@zemuldo">\n`
    `<meta name="twitter:image" content="${details.imgSRC}">\n` +
    `<meta name="twitter:domain" content="blog.zemuldo.com">\n` +
    `<meta name="keywords" content=" ${details.keyWords} ">\n` +
    `<title> ${details.title} </title>\n` +
    `</head>\n` +
    `<body>\n` +
    `<div style="margin: 2% 20% 0% 20%;">` +
    `<h1>${details.title}` +
    `</h1>` +
    `<a href="/">` +
    `<img style="height:20%;  width:90%;" src= ${details.imgSRC}>` +
    `</a>` +
    `<p style="text-align: left;">\n ${details.description}` +
    `</p>\n` +
    `</div>` +
    `<div id="root"></div>\n` +
    `<!--This is the main entry point to this project-->\n` +
    `</body>\n` +
    `</html>\n`
    return html
  }
}