window.addEventListener('polymer-ready', function(e) {

    var qf = document.getElementById('qunit-fixture');

    module('::w-json::');

    asyncTest( '公共属性及方法', function() {

        expect( 2 );


        gmu('w-json-test1',{
            domReady: function() {
                var jsonTag = gmu.find('#json-data1')[0];

                var value = jsonTag.getValue();
                ok(value.e[0] == 'f', 'init value');

                value.e[0] = 'g';

                jsonTag.setValue(value);

                ok(jsonTag.getValue().e[0] == 'g', 'modified value');

                setTimeout(function() {
                    start();
                }, 100);
            }
        });

        qf.innerHTML = '\
        <polymer-element name="w-json-test1" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <w-json-test1></w-json-test1>\
        <w-json id="json-data1" json=\'{"a":1,"b":"c","d":true,"e":["f"]}\'></w-json>';
    });


    asyncTest( '通过修改 json 属性修改数据', function() {

        expect( 2 );


        gmu('w-json-test2',{
            domReady: function() {
                var jsonTag = gmu.find('#json-data2')[0];
                var inc = 0;

                gmu.addEvent( jsonTag, 'data-change', function(e) {
                    inc += e.detail.oldVal.a;
                    inc += e.detail.newVal.a;

                    ok(inc == 3, 'inc equal 3');
                    ok(jsonTag.getValue().a == 2, 'new val equal 2');
                });

                var json = JSON.parse(jsonTag.json);
                json.a = 2;

                jsonTag.json = JSON.stringify(json);

                setTimeout(function() {
                    start();
                }, 100);
            }
        });

        qf.innerHTML = '\
        <polymer-element name="w-json-test2" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <w-json-test2></w-json-test2>\
        <w-json id="json-data2" json=\'{"a":1,"b":"c","d":true,"e":["f"]}\'></w-json>';
    });
      
});
