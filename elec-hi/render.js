const electron = require('electron');
const remote = electron.remote;

onload = function () {
    var webview = document.querySelector('webview');

    webview.addEventListener("dom-ready", function () {
        //webview.openDevTools();
    });

    webview.addEventListener('console-message', function (e) {
        console.warn('webview message:', e.message);
    });

    webview.addEventListener('ipc-message', function (event) {
        console.log(event.channel);
        if(event.channel.length > 1){
            var select = event.channel[0]
            var content = event.channel[1]
            var flag = select.toString().split('>')[(select.toString().split('>').length-1)].toString()
            if(flag.indexOf('a') >= 0){
                var text = $('#list-target').val() + content + '\n';
                $('#list-target').val(text);
            }
            if (event.channel[event.channel.length-1] == 'step4'){
                $('#detail-target').append('<tr><td><div class="input-group input-group-sm"><input type="text" class="form-control"></div></td><td><b>'+select+'</b></td></tr>')
            }
            if (event.channel[event.channel.length-1] == 'step3'){
                var step = event.channel[1];
                var url = event.channel[0];
                $('#step').attr('value',step);
                $('#step3').attr('times',step);
                $('#step3').attr('url',url)
                $("#3a").attr('class','alert alert-success alert-dismissible');
            }
            if (event.channel[event.channel.length-1] == 'auto'){
                var list_det = event.channel[event.channel.length-2];
                $('#step2').attr('selector',list_det);
            }
        }else{
            var lastUrl = event.channel[0]
            $('#step4').attr('next',lastUrl);
        }
    });

    webview.addEventListener('did-stop-loading', function (e) {
        webview.send(window.location.href.split('_')[1])
    });
};

