
var Vue = require('vue');
var VueRouter = require('vue-router');
Vue.use(VueRouter);

var navStep = Vue.extend({
    name: 'nav-step',
    template: '#nav-step',
    data: function () {
        var step = this.$route.path.split('_')[1];
        if (step == 1) {
            return { act1: 'active', act2: '', act3: '', act4: '', act5:'' };
        } else if (step == 2) {
            return { act1: '', act2: 'active', act3: '', act4: '', act5:'' };
        } else if (step == 3) {
            return { act1: '', act2: '', act3: 'active', act4: '', act5:'' };
        } else if (step == 4) {
            return { act1: '', act2: '', act3: '', act4: 'active', act5:'' };
        } else if (step == 5) {
            return { act1: '', act2: '', act3: '', act4: '', act5:'active' };
        }
    },
    methods: {
    }
});


var nextStep = Vue.extend({
    name: 'next-step',
    template: '#next-step',
    data: function () {
        var step = parseInt(this.$route.path.split('_')[1]) + 1;
        if (step == 5) {
            $('#step3').attr('start',$('#start').val());
            $('#step3').attr('end',$('#end').val());
            document.querySelector('webview').src = $('#step4').attr('next');
        }

        if (step == 6) {
            //window.location='edit.html';
            data = []
            var res = {};
            res['sleep'] = 5;
            res['list'] = {};
            res['list']['detail-sel'] = $('#step2').attr('selector');
            res['list']['init'] = $('#step3').attr('url');
            res['list']['start'] = $('#step3').attr('start');
            res['list']['end'] = $('#step3').attr('end');
            res['list']['times'] = $('#step3').attr('times');
            tmp = []
            len = $('tbody tr').length
            for(var i = 0; i < len; i++){
                temp = {}
                temp['name'] = $('tbody tr:eq('+i+') td:eq(0) input').val();
                temp['selector'] = $('tbody tr:eq('+i+') td:eq(1)').text();
                tmp.push(temp);
            }
            res['detail'] = tmp;
            data.push(res);
            var jsonString = JSON.stringify(data);
            var result = JSON.stringify(JSON.parse(jsonString), null, 4);
            var YAML = require('json2yaml')
            ymlText = YAML.stringify(res);
            $('.web').html('');
            $('#edit').attr('style','');
            var editor = ace.edit("text");
            editor.setValue(ymlText.replace('---\n',''));
            $('pre').text();
        }

        return { step: 'step_' + step };
    },
    methods: {
        nextPage: function () {
            var webview = document.querySelector('webview');
            webview.reload();
        }
    }
});


var step1 = Vue.extend({
    name: 'step1',
    template: '#step1',
    components: {
        'next-step': nextStep,
        'nav-step': navStep
    },
    data: function () {
        return {
            loc: 'https://movie.douban.com/tag/动画'
        };
    },
    methods: {
        openURL: function () {
            document.querySelector('webview').src = this.$data.loc;
        }
    }
});

var step2 = Vue.extend({
    name: 'step2',
    template: '#step2',
    components: {
        'next-step': nextStep,
        'nav-step': navStep
    },
    data: function () {
        return {};
    },
    methods: {}
});

var step3 = Vue.extend({
    name: 'step3',
    template: '#step3',
    components: {
        'next-step': nextStep,
        'nav-step': navStep
    },
    data: function () {
        return {};
    },
    methods: {}
});

var step4 = Vue.extend({
    name: 'step4',
    template: '#step4',
    components: {
        'next-step': nextStep,
        'nav-step': navStep
    },
    data: function () {
        return {};
    },
    methods: {}
});

var step5 = Vue.extend({
    name: 'step5',
    template: '#step5',
    components: {
        'next-step': nextStep,
        'nav-step': navStep
    },
    data: function () {
        return {};
    },
    methods: {}
});


var App = Vue.extend({});
var router = new VueRouter();

router.map({
    '/step_1': {
        component: step1
    },
    '/step_2': {
        component: step2
    },
    '/step_3': {
        component: step3
    },
    '/step_4': {
        component: step4
    },
    '/step_5': {
        component: step5
    }
});

router.start(App, '#main');
router.redirect({
    '*': '/step_1'
});
