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
            if (thisC._id === c.parent_id) {
                thisC.chat ? thisC.chat.comments.push(c) : thisC.chat = {
                    comments: [
                        c
                    ]
                }
                return true
            }
            if (thisC.chat) {
                updateReplies(c, thisC.chat.comments)
            }
        })
        resolve(cs)
    })
        .then(o=>{
            return o
        })
        .catch(e=>{
            console.log(e)
        })
}

export function deleteComments(_id, cs) {
    return new Promise(function (resolve, reject) {
        cs.map(function (thisC,index) {
            if (thisC._id === _id) {
                cs.splice(index, 1)
                return true
            }
            if (thisC.chat) {
                deleteComments(_id, thisC.chat.comments)
            }
        })
        resolve(cs)
    })
        .then(o=>{
            return o
        })
        .catch(e=>{
            console.log(e)
        })
}

export function notifyMe(m) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        let notification = new Notification(m);
        setTimeout(function () {
            notification.close()
        },8000)
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                let notification = new Notification(m);
                setTimeout(function () {
                    notification.close()
                },8000)
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
}