window.addEventListener('polymer-ready', function(e) {

    var qf = document.getElementById('qunit-fixture');

    module('::w-model::');

    asyncTest( 'dataField属性测试1', function() {

        expect( 1 );


        gmu('w-model-test1',{

            dataChanged: function() {
                ok(this.data[0] == 'f');

                start();
            }
        });

        qf.innerHTML = '\
        <polymer-element name="w-model-test1" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <w-model-test1>\
            <w-model id="model-data" dataField="e">\
                <w-json id="json-data" json=\'{"a":1,"b":"c","d":true,"e":["f"]}\'></w-json>\
            </w-model>\
        </w-model-test1>\
        ';
    });

    asyncTest( 'dataField属性测试2', function() {

        expect( 1 );


        gmu('w-model-test2',{

            dataChanged: function() {
                ok(this.data == 1);

                start();
            }
        });

        qf.innerHTML = '\
        <polymer-element name="w-model-test2" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <w-model-test2>\
            <w-model id="model-data" dataField="b.c.d">\
                <w-json id="json-data" json=\'{"a":1,"b":{"c":{"d":1}}}\'></w-json>\
            </w-model>\
        </w-model-test2>\
        ';
    });

    asyncTest( 'dataUpdateMode属性测试 - prepend', function() {

        expect( 1 );

        var counter = 0;

        gmu('w-model-test3',{

            domReady: function() {
                var json = gmu.find('#json-data')[0];

                json.setValue([{b:2}]);
            },

            dataChanged: function() {
                counter++;

                // 会执行两次
                // 1. w-json 初始化
                // 2. setValue 接口设置数据
                if (counter == 2) {
                    ok(this.data[0].b ==2);
                    start();
                }
            }
        });

        qf.innerHTML = '\
        <polymer-element name="w-model-test3" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <w-model-test3>\
            <w-model id="model-data" dataUpdateMode="prepend">\
                <w-json id="json-data" json=\'[{"a":1}]\'></w-json>\
            </w-model>\
        </w-model-test3>\
        ';
    });

    asyncTest( 'dataUpdateMode属性测试 - append', function() {

        expect( 1 );

        var counter = 0;

        gmu('w-model-test4',{

            domReady: function() {
                var json = gmu.find('#json-data')[0];

                json.setValue([{b:2}]);
            },

            dataChanged: function() {
                counter++;

                // 会执行两次
                // 1. w-json 初始化
                // 2. setValue 接口设置数据
                if (counter == 2) {
                    ok(this.data[1].b ==2);
                    start();
                }
            }
        });

        qf.innerHTML = '\
        <polymer-element name="w-model-test4" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <w-model-test4>\
            <w-model id="model-data" dataUpdateMode="append">\
                <w-json id="json-data" json=\'[{"a":1}]\'></w-json>\
            </w-model>\
        </w-model-test3>\
        ';
    });
});
