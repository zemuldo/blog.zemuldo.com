let a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
let b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function dataURItoBlob(dataURI) {
    let byteString = atob(dataURI.split(',')[1])

    // separate out the mime component

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length)
    let ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }

    // write the ArrayBuffer to a blob, and you're done
    return new Blob([ab])
}

export function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
}

export function inWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str;
}

export function peopleL(no) {
    return no > 1 ? `${toTitleCase(inWords(no))}others` : `One other person`
}

export function peopleU(no) {
    return no > 1 ? `People like this` : `Person likes this`
}

export function blogUrl(b) {
    return `${b.type}/${b.topics[0]}/${b.author.userName }-${b.title.split(' ').join('-')}-${b.date.split(' ').join('-')}-${b.id.toString()}`
}

export function updateReplies(c, cs) {
    return new Promise(function (resolve, reject) {
        cs.forEach(function (thisC) {
            if (thisC._id === c.parrent_id) {
                console.log('+++++++++++parent found')
                thisC.chat ? thisC.chat.comments.push(c) : thisC.chat = {
                    comments: [
                        c
                    ]
                }
                resolve(cs)
                return true
            }
            if (thisC.chat) {
                updateReplies(c, thisC.chat.comments)
            }
        })
    })
        .then(o=>{
            return o
        })
        .catch(e=>{
            console.log(e)
        })
}