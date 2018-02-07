module.exports = {

  getBlogTemplate: (details) => {
    let html =
            '<!doctype html>\n' +
            '<html lang="en">\n' +
            '<head>\n' +
            '    <meta charset="utf-8">\n' +
            '    <meta name="author" content="Danstan Otieno Onyango">\n' +
            '    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n' +
            '    <link rel="shortcut icon" href="/static/img/icons/icon-256x256.png">\n' +
            '    <meta name="description" content=' + details.description + '>\n' +
            '    <meta name="keywords" content="Tech Articles, Business Articles, Blogs, BigData, Artificila Intelligence, Marchine Learning, Business Development">\n' +
            '    <title>' + details.title + '</title>\n' +
            '</head>\n' +
            '<body>\n' +
            '<div style="margin: 4% 20% 0% 20%;">' +
            '<h1 style="text-align: center">' + details.title +
            '</h1>' +
            '<a href="/">'+
            '<img style="height:20%;  width:90%; margin-left: 2%" src=' + details.imgSRC + '>' +
            '</a>'+
            '<hr >' +
            '<p style="text-align: left;">\n' + details.description +
            '</p>\n' +
            '</div>' +
            '<div id="root"></div>\n' +
            '<!--This is the main entry point to this project-->\n' +
            '</body>\n'+
            '</html>\n'
    return html
  }
}
