window.addEventListener('polymer-ready', function(e) {

    var qf = document.getElementById('qunit-fixture');

    module('::w-ajax::');

    asyncTest( '事件集成测试', function() {

        expect( 4 );


        gmu('w-ajax-test1',{
            domReady: function() {
                var ajax = gmu.find('#ajax')[0];

                gmu.addEvent(ajax, 'before-send', function(e) {
                    ok(true);
                });

                gmu.addEvent(ajax, 'success', function(e) {
                    ok(e.detail.response.version == '1.0')
                });

                gmu.addEvent(ajax, 'data-change', function(e) {
                    ok(true)
                });

                gmu.addEvent(ajax, 'complete', function(e) {
                    ok(true);

                    setTimeout(function() {
                        start();
                    }, 100);
                });

                ajax.go();
            }
        });

        qf.innerHTML = '\
        <polymer-element name="w-ajax-test1" extends="w-core">\
          <template>\
            <content></content>\
          </template>\
        </polymer-element>\
        <w-ajax id="ajax" url="data.json" params=\'{"alt":"json", "q":"chrome"}\'></w-ajax>\
        <w-ajax-test1></w-ajax-test1>\
        ';
    });
      
});
