const electron = require('electron');
const ipc = electron.ipcRenderer;

function highlight() {
    var prev;
    function handler(event) {
        if (event.target === document.body ||
            (prev && prev === event.target)) {
            return;
        }
        if (prev) {
            // prev.className = prev.className.replace(/\bhlhlhl\b/, '');
            prev.style.backgroundColor = 'transparent';
            prev = undefined;
        }
        if (event.target) {
            prev = event.target;
            // prev.className += " hlhlhl";
            prev.style.backgroundColor = '#c7dcfc';
        }
    }

    if (document.body.addEventListener) {
        document.body.addEventListener('mouseover', handler, false);
    } else if (document.body.attachEvent) {
        document.body.attachEvent('mouseover', function (e) {
            return handler(e || window.event);
        });
    } else {
        document.body.onmouseover = handler;
    }
}

function step2() {
    var queue = new Array();
    $('a').click(function (event) {
        event.preventDefault();
        console.log($('a').attr('href'));
    });

    $('body').click(function (e) {
        var selector = $(e.target).getSelector();
        /*console.log($(selector[0]).text());*/
        var txt = $(e.target).text().replace(/\s+/g, ' ').trim();
        var url = []
        url.push($(e.target).attr('href'));
        if(url.length > 0){
            ipc.sendToHost(url);
        }
        queue.push(selector[0])
        if(queue.length >= 2){
            temp1 = queue.pop();
            last = temp1;
            temp1 = temp1.split('>');
            temp2 = queue.pop().split('>');
            /*比较temp1 temp2 进行后续操作*/
            var sum = 0
            var flag = -1;

            for(var i = 0; i < temp1.length && i < temp2.length; i++){
                if(temp1.length != temp2.length){
                    break;
                }
                if(temp1[i].toString() == temp2[i].toString()){
                    continue;
                }else{
                    flag = i;
                    sum++;
                }
            }
            if(sum == 1 && flag >= 0){
                var select = temp1.join('>')
                var tmp = new Array();
                for(var i = 0; i < temp1.length; i++){
                    tmp[i] = temp1[i];
                }
                for(var j = flag; j < tmp.length; j++){
                    tmp[j] = tmp[j].replace(/(:eq\(\d+\))/g, '')
                }
                tmp = tmp.join('>')
                
                var num = parseInt(temp1[flag].match(/\d+/g)[0], 10)
                var auto_flag = 0;
                for(var i = num;;i++){
                    temp1[flag] = temp1[flag].replace(/\d+/g, i)
                    select = temp1.join('>')
                    console.log(select);
                    if($(select).text().replace(/\s+/g, ' ').trim()){
                        selector = []
                        txt = []
                        selector.push(select)
                        txt.push($(select).text().replace(/\s+/g, ' ').trim());
                        var channel = [];
                        channel.push(selector);
                        channel.push(txt);
                        if(auto_flag == 1){
                            channel.push(tmp)
                            channel.push('auto');
                        }
                        auto_flag = 1;
                        ipc.sendToHost(channel);

                    }else{
                        break;
                    }       
                }
            }else{
                queue = []
                queue.push(last);
                selector = []
                txt = []
                selector.push(last)
                txt.push($(last).text().replace(/\s+/g, ' ').trim());
                var channel = [];
                channel.push(selector);
                channel.push(txt);
                ipc.sendToHost(channel);
            }
        }else{
            var channel = [];
            channel.push(selector);
            channel.push(txt);
            ipc.sendToHost(channel);
        }
    });
}

function step3() {
    var queue = new Array();
    $('a').click(function (event) {
        event.preventDefault();
        console.log($('a').attr('href'));
    });

    $('body').click(function (e) {
        var url = $(e.target).attr('href');
        queue.push(url)
        if(queue.length >= 2){
            temp1 = queue.pop();
            last = temp1;
            temp1 = temp1.split('?');
            temp2 = queue.pop().split('?');
            tmp1 = temp1[temp1.length-1].split('&')
            tmp2 = temp2[temp2.length-1].split('&')
            /*比较temp1 temp2 进行后续操作*/
            var sum = 0
            var flag = -1;

            for(var i = 0; i < tmp1.length && i < tmp2.length; i++){
                if(tmp1.length != tmp2.length){
                    break;
                }
                if(tmp1[i].toString() == tmp2[i].toString()){
                    continue;
                }else{
                    flag = i;
                    sum++;
                }
            }
            if(sum == 1 && flag >= 0){
                var num1 = parseInt(tmp1[flag].match(/\d+/g)[0], 10);
                var num2 = parseInt(tmp2[flag].match(/\d+/g)[0], 10);
                tmp1[flag] = tmp1[flag].replace(num1, '%s');
                temp1[temp1.length-1] = tmp1.join('&');
                res_url = temp1.join('?');
                step = num1-num2;
                var channel = [];
                channel.push(res_url);
                channel.push(step);
                channel.push('step3');
                ipc.sendToHost(channel);

                
            }else{
                queue = []
                queue.push(last);
            }
        }
    });
}

function step4() {
    $('a').click(function (event) {
        event.preventDefault();
        //console.log($('a').attr('href'));
    });

    $('body').click(function (e) {
        var selector = $(e.target).getSelector();
        /*console.log($(selector[0]).text());*/
        var txt = $(e.target).text().replace(/\s+/g, ' ').trim();
        var channel = [];
        channel.push(selector);
        channel.push(txt);
        channel.push('step4');
        ipc.sendToHost(channel);

    });
}

window.onload = () => {
    window.$ = window.jQuery = require('jquery');
    require('jquery-selectorator');
    require('./assets/js/selectorator.min.js');

    highlight();

    ipc.on('2', function() {
        step2()
    });

    ipc.on('3', function() {
        step3()
    });

    ipc.on('4', function() {
        step4()
    });

    
};