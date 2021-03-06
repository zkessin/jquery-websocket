/*
 * jQuery Web Sockets Plugin v0.0.3
 * https://github.com/dchelimsky/jquery-websocket
 * http://code.google.com/p/jquery-websocket/
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2010 by shootaroo (Shotaro Tsubouchi).
 */
(function($){
     var nullFunc = function() {
     };
     
     $.extend({
        websocket: function(url, s) {
            var ws = WebSocket ? new WebSocket( url ) : {
                send	: function(m){ 
		    return false;
		},
                close	: nullFunc
            };
            var settings = {
                open	: nullFunc,
                close	: nullFunc,
                message	: nullFunc,
                options	: {},
                events	: {}
            };
            $.extend(settings, $.websocketSettings, s);
            $(ws)
                .bind('open',		settings.open)
                .bind('close',		settings.close)
                .bind('message',	settings.message)
                .bind('message', function(e){
                    var m = $.evalJSON(e.originalEvent.data);
                    var h = settings.events[m.type];
                    if (h) h.call(this, m);
                });
            ws._send = ws.send;
	    ws.sendLiteral = function (data) {		
		return this._send(JSON.stringify(data));
	    },
	    ws.sendString  = function (data){
		return this._send(data);
	    },
            ws.send = function(type, data) {
                var m			= {type: type};
                m			= $.extend(true, m, $.extend(true, {}, settings.options, m));
                if (data) {
		    m.data	= data;
		}
                return this._send(JSON.stringify(m));
            };
            $(window).unload(function(){ 
				 ws.close(); 
				 ws = null ;
			     });
            return ws;
        }
    });
})(jQuery);
