window.addEventListener('polymer-ready', function(e) {

    var qf = document.getElementById('qunit-fixture');

    module('::w-core::基础方法测试');

    test( 'mixin', function() {

        var obj1 = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5
        };

        var obj2 = {
            a: 2,
            b: undefined,
            c: false,
            d: 0,
            e: null,
            f: [1, 2, 3],
            g: {
                a: 1
            },
            h: function() {
                return 1;
            }
        };

        gmu.mixin(obj1, obj2);

        ok( obj1.a == 2 );
        ok( obj1.b == 2 );
        ok( obj1.c == false );
        ok( obj1.d == 0 );
        ok( obj1.e == null );
        ok( obj1.f[0] == 1 );
        ok( obj1.g.a == 1 );
        ok( obj1.h() == 1 );
    });


    test( 'find', function() {

        qf.innerHTML = '<div id="container"><span class="findme"></span></div><div><span class="findme"></span></div>';

        var allSpans = gmu.find('.findme');
        var spanInContainer = gmu.find('.findme', gmu.find('#container')[0]);

        ok( allSpans.length == 2 );
        ok( spanInContainer.length == 1 );
    });



    test( 'bind', function() {

        function invoke() {
            return this.value;
        }

        var obj1 = {
            invoke: invoke,
            value: 1
        };

        var obj2 = {
            invoke: invoke,
            value: 2
        };


        ok( obj1.invoke() == 1 );
        ok( obj2.invoke() == 2 );

        obj2.invoke = gmu.bind(obj2.invoke,obj1);

        ok( obj2.invoke() == 1 );
    });

    module('::w-core::继承一致性');


    asyncTest( '子组件能继承父组件的公开属性以及方法；', function() {

        expect( 5 );

        gmu('w-core-test1',{
            ready: function() {

                ok(this.sourceSelector == '#ss');
                ok(this.name == 'miller');
                ok(this.find('span').length == 1);

                start();
            },
            sourceSelectorChanged: function() {
                ok(true);
            },
            nameChanged: function() {
                ok(true);
            }
        });

        qf.innerHTML = '\
        <polymer-element name="w-core-test1" attributes="name" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <w-core-test1 name="miller" sourceSelector="#ss"><span>hello</span></w-core-test1>';

    });

    module('::w-core::生命周期事件');

    asyncTest( '所有生命周期方法被调用时都应该触发事件；', function() {

        expect( 1 );

        var phases = [];

        var lifeCycles = [
            'created',
            'ready',
            'attached',
            'domready',
            'detached'
        ];

        gmu('w-core-test2',{
            created: function() {

                var w3 = this.find('w-core-test3')[0];

                lifeCycles.forEach(function(phase) {
                    w3.addEventListener(phase, function(e){
                        phases.push(e.type);
                    }, false);
                });
            }
        });

        gmu('w-core-test3',{
            domReady: function() {
                this.parentNode.removeChild(this);

                setTimeout(function(){

                    ok(lifeCycles.join() == phases.join());

                    start();

                }, 0);
            }
        });

        qf.innerHTML = '\
        <polymer-element name="w-core-test2" attributes="name" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <polymer-element name="w-core-test3" attributes="name" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <w-core-test2><w-core-test3></w-core-test3></w-core-test2>';

    });

    module('::w-core::生命周期序列');

    asyncTest( '父组件与子组件在初始化时是由外往内；', function() {

        expect( 6 );

        var inc = 0;

        gmu('w-core-test4',{
            created: function() {
                ok( inc++ == 0 );
            },

            ready: function() {
                ok( inc++ == 1 );
            },
            
            attached: function() {
                ok( inc++ == 2 );
            },

            domReady: function() {
                start();
            }
        });

        gmu('w-core-test5',{
            created: function() {
                ok( inc++ == 3 );
            },

            ready: function() {
                ok( inc++ == 4 );
            },
            
            attached: function() {
                ok( inc++ == 5 );
            }
        });

        qf.innerHTML = '\
        <polymer-element name="w-core-test4" attributes="name" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <polymer-element name="w-core-test5" attributes="name" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <w-core-test4><w-core-test5></w-core-test5></w-core-test4>';

    });

    
    asyncTest( '父组件domReady在子组件初始化完后触发；', function() {

        expect( 5 );

        var inc = 0;

        gmu('w-core-test6',{

            domReady: function() {
                ok(inc++ == 3);
            }
        });

        gmu('w-core-test7',{
            created: function() {
                ok( inc++ == 0 );
            },

            ready: function() {
                ok( inc++ == 1 );
            },
            
            attached: function() {
                ok( inc++ == 2 );
            },

            domReady: function() {
                ok(inc++ == 4);
                start();
            }
        });

        qf.innerHTML = '\
        <polymer-element name="w-core-test6" attributes="name" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <polymer-element name="w-core-test7" attributes="name" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <w-core-test6><w-core-test7></w-core-test7></w-core-test6>';

    });

    module('::w-data::数据源相关');

    asyncTest( '组件的数据源元素只有一个；', function() {

        expect( 3 );

        var inc = 0;

        gmu('w-core-test8',{
            data: {a:1},

            dataChanged: function() {
                // exec twice
                ok( true, 'dataChanged: ' + this.data.a );
            }
        });

        gmu('w-core-test9',{
            domReady: function() {

                // 外部数据源不会导致监听组件触发 data-change
                this.$.test1.addEventListener('data-change', function(e){
                    // Don't go here
                    ok(false);
                }, false)

                // 内部数据源的 data-change 事件会冒泡
                this.$.test2.addEventListener('data-change', function(e){
                    ok(e.detail.from == 'ajax1', 'event detail');
                }, false);

                this.$.ajax.fire('data-change', {from:'ajax1',newVal:{a:2}} );

                gmu.find('#model')[0].fire('data-change', {from:'model1',newVal:{a:3}} );
                
                

                setTimeout(function() {
                    start();
                }, 100);

            }
        });

        
        qf.innerHTML = '\
        <polymer-element name="w-core-test8" attributes="name" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <polymer-element name="w-core-test9" extends="w-core">\
            <template>\
                <w-core-test8 id="test1" sourceSelector="#model"></w-core-test8>\
                <w-core-test8 id="test2">\
                    <w-ajax id="ajax"></w-ajax>\
                </w-core-test8>\
            </template>\
        </polymer-element>\
        <w-model id="model"></w-model>\
        <w-core-test9></w-core-test9>';
    });
    
    asyncTest( '数据源变更后视图渲染模式；', function() {

        expect( 11 );

        var inc = 0;

        gmu('w-core-test10',{
            render: function() {
                var div = document.createElement('div');
                div.name = 'div';

                return div;
            }
        });

        gmu('w-core-test11',{
            domReady: function() {
                gmu.find('#ajax')[0].fire('data-change', {from:'ajax1',newVal:{a:2}} );
                this.$.innerajax.fire('data-change', {from:'ajax1',newVal:{a:2}} );

                ok(this.$.test101.childNodes.length == 1);
                ok(this.$.test102.childNodes.length == 2);
                ok(this.$.test103.childNodes.length == 2);
                ok(this.$.test104.childNodes.length == 1);
                ok(this.$.test105.childNodes.length == 3);

                ok(this.$.test101.firstChild.tagName.toLowerCase() == 'span');
                ok(this.$.test102.firstChild.name == 'div');
                ok(this.$.test103.lastChild.name == 'div');
                ok(this.$.test102.firstChild.name == 'div');
                ok(this.$.test105.firstChild.id == 'innerajax');
                ok(this.$.test105.lastChild.name == 'div');

                setTimeout(function() {
                    start();
                }, 100);
            }
        });

        
        qf.innerHTML = '\
        <polymer-element name="w-core-test10" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <polymer-element name="w-core-test11" extends="w-core">\
          <template>\
            <w-core-test10 id="test101" sourceSelector="#ajax" viewUpdateMode="no"><span>Hi</span></w-core-test10>\
            <w-core-test10 id="test102" sourceSelector="#ajax" viewUpdateMode="prepend"><span>Hi</span></w-core-test10>\
            <w-core-test10 id="test103" sourceSelector="#ajax" viewUpdateMode="append"><span>Hi</span></w-core-test10>\
            <w-core-test10 id="test104" sourceSelector="#ajax"><span>Hi</span></w-core-test10>\
            <w-core-test10 id="test105" viewUpdateMode="replace"><w-ajax id="innerajax"></w-ajax><w-on></w-on><span>Hi</span></w-core-test10>\
          </template>\
        </polymer-element>\
        <w-ajax id="ajax"></w-ajax>\
        <w-core-test11></w-core-test11>\
        ';
    });

    module('::w-data::事件元素');

    asyncTest( '事件元素解析', function() {

        expect( 6 );

        var inc = 0;

        gmu('w-core-test12', {
            domReady: function() {
                ok(this.eventTags);
                ok(this.eventTags[0].name == 'click');
                ok(this.eventTags[0].target == '#mediv');
                ok(this.eventTags[0].action.property == 'foo');
                ok(this.eventTags[0].action.value == '1');

                ok(this.eventTags[1].action.method == 'inc');
                start();
            }
        });

        
        qf.innerHTML = '\
        <polymer-element name="w-core-test12" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <w-core-test12>\
            <w-ajax>\
                <w-on event="click" target="#mediv" action="bar=2"></w-on>\
            </w-ajax>\
            <w-on event="click" target="#mediv" action="foo=1"></w-on>\
            <w-on event="change" target="#mediv" action="inc"></w-on>\
            <w-on event="add" target="#mediv" action="inc1"></w-on>\
        </w-core-test12>\
        ';
    });

    
    asyncTest( '事件监听', function() {

        expect( 4 );

        var inc = 0;

        gmu('w-core-test13', {

            foo: 0,

            inc: function() {
                inc++;
                ok(inc == 1);
            },

            inc1: function() {
                ok(this.inc1._e_.detail.from == 'add');
            }
        });

        gmu('w-core-test14', {

            fireClick: function() {
                this.fire( 'click' );
            },

            fireChange: function() {
                this.fire( 'change' );
            },

            fireAdd: function() {
                this.fire( 'add', {from: 'add'} );
            },

            domReady: function() {

                var mediv = gmu.find('#mediv')[0];

                ok(mediv.foo == 0);

                this.fireClick();

                ok(mediv.foo == 1);

                this.fireChange();
                this.fireAdd();

                setTimeout(function(){
                    start();
                }, 100);
                
            }
        });

        
        qf.innerHTML = '\
        <polymer-element name="w-core-test13" attributes="foo" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <polymer-element name="w-core-test14" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <w-core-test13 id="mediv"></w-core-test13>\
        <w-core-test14>\
            <w-on event="click" target="#mediv" action="foo=1"></w-on>\
            <w-on event="change" target="#mediv" action="inc"></w-on>\
            <w-on event="add" target="#mediv" action="inc1"></w-on>\
        </w-core-test14>\
        ';
    });
      
});
