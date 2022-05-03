var fs = require('fs')
var shell = require('shelljs')

function getChat(uname, doctor, callback)
{
    let file = './chat/' + doctor + uname + '.txt'
    let fileOpen = __dirname + '\\chat\\' + doctor + uname + '.txt'
    try
    {
        if (!fs.existsSync(fileOpen))
            fs.writeFileSync(fileOpen, '', function (err) {
                if (err) throw err;
                console.log('Saved! ' + file);
            });
    }
    catch(err) {
        console.error(err)
    }

    return fs.readFileSync(fileOpen, 'utf8')
}

function sendMessage(uname, doctor, src, isDoc)
{
    let fileOpen = __dirname + '\\chat\\' + doctor + uname + '.txt'
    let msg
    if (isDoc)
        msg = 'd'
    else
        msg = 'u'
    msg += src
    msg += '\n'
    console.log(fileOpen)
    fs.appendFileSync(fileOpen, msg, function (err) {
        if (err) throw err;
        console.log('Appended into ' + file + ' message: ' + msg);
    });
}

module.exports =
    {
        getChat: getChat,
        sendMessage: sendMessage
    }