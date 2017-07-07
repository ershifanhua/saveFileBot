// Require Nodejs v4+

// index.js
const Weixinbot = require('./lib/weixinbot')
const fs = require('fs')
const mkdirp = require('mkdirp')
// will send qrcode to your email address
const bot = new Weixinbot({ receiver: '495233007@qq.com' })
function getTime(format, timestamp) {
  function fix2number(n) {
    return [0, n].join('').slice(-2);
  }
  var curDate = new Date();
  if (timestamp) curDate.setTime(timestamp*1000)
  if (format == undefined) return curDate;
  format = format.replace(/Y/i, curDate.getFullYear());
  format = format.replace(/m/i, fix2number(curDate.getMonth() + 1));
  format = format.replace(/d/i, fix2number(curDate.getDate()));
  format = format.replace(/H/i, fix2number(curDate.getHours()));
  format = format.replace(/i/i, fix2number(curDate.getMinutes()));
  format = format.replace(/s/i, fix2number(curDate.getSeconds()));
  format = format.replace(/ms/i, curDate.getMilliseconds());
  return format;
}

function mkdir(route, file, mesg) {
  if (!fs.existsSync(route)) {
    mkdirp(route, function (err) {
      if (err) console.error(err)
      else writeFile(route +'/'+ file, mesg)
    });
  } else {
    writeFile(route +'/'+ file, mesg)
  }
}

function writeFile(file, msg) {
  fs.appendFile(file, msg+'\n', function () {
    console.log('追加内容完成');
  });
}

// will emit when bot fetch a new qrcodeUrl
bot.on('qrcode', (qrcodeUrl) => {
  console.log(qrcodeUrl)
})

bot.on('friend', (msg) => {
  let userName = (msg.User.RemarkName || msg.User.NickName)
  let route = userName+'/'+getTime('Y.M.D', msg.CreateTime)
  let userMsg = msg.Member.NickName +': '+msg.Content+'  '+getTime('Y/M/D H:i:s', msg.CreateTime)
  mkdir(route,'fridnd.txt',userMsg)
  bot.sendText(msg.FromUserName, 'HELLO')
})
bot.on('group', (msg) => {
  let file = msg.Group.NickName.replace(/<.*?>/ig, "")
  let userName = msg.Group.MemberList.filter(function(item){
    return (item.UserName === msg.ToUserName)
  })
  let route = userName[0].NickName+'/'+getTime('Y.M.D', msg.CreateTime)
  let groupMsg = (msg.GroupMember.DisplayName || msg.GroupMember.NickName) +':'+msg.Content+'  '+getTime('Y/M/D H:i:s', msg.CreateTime)
  mkdir(route,file+'.txt',groupMsg)
})

bot.run()
