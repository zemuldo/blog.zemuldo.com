module.exports = {

    getBlogTemplate:(details) => {
        let html =
            '<!doctype html>\n' +
            '<html lang="en">\n' +
            '<head>\n' +
            '    <meta charset="utf-8">\n' +
            '    <meta name="author" content="Danstan Otieno Onyango">\n' +
            '    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n' +
            '    <link rel="shortcut icon" href="img/icons/NN.png">\n' +
            '    <link rel="stylesheet" type="text/css" href="./semantic.min.css" />\n' +
            '    <link rel="stylesheet" type="text/css" href="./styles.css" />\n' +
            '    <meta name="description" content='+details.description+'>\n' +
            '    <meta name="keywords" content="Tech Articles, Business Articles, Blogs, BigData, Artificila Intelligence, Marchine Learning, Business Development">\n' +
            '    <title>'+details.title+'</title>\n' +
            '</head>\n' +
            '<body>\n' +
            '<div style="margin: 4% 20% 0% 20%;">' +
            '<h2 style="text-align: center">' +details.title+
            '</h2>'+
            '<img style="height:20%;  width:60%; margin-left: 20%" src='+details.imgSRC+'>'+
            '<hr >'+
            '<p style="text-align: left;">\n' +details.description+
            '</p>\n' +
            '</div>'+
            '<div id="root"></div>\n' +
            '<!--This is the main entry point to this project-->\n' +
            '</body>\n' +
            '\n' +
            '</html>\n'

        return html
}
}