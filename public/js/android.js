android = (function(){
    var token = '';

    function current_user(user){
        if(user){
            android.put('user.current', user);
            return user;
        }
        user = android.get('user.current');
        if(!user){
            U.api.user.info(function(){
                location.href = ROOT_URL + '/view/login.html' + (location.search || '?') + '&success_cbf=' + encodeURIComponent(location.pathname + location.search + location.hash);
            });
        }
        return user;
    }

    function getOrSetToken(_token){
        if(_token){
            token = _token;
        }
        return token;
    }

    function noop(){
        //todo
    }

    var funs = {
        // 获取版本
        version: function(){
            return "1.0";
        },
        // 获取应用名称
        app_name: function(){
            return 'triplint';
        },
        is_user: function(){
            return !!android.get('user.current');
        },
        user: function(){
            return android.get('user.current');
        },
        current_user: current_user,
        // 获得存储值
        "get": function(key){
            return JSON.parse(sessionStorage[key] || '""');
        },
        "_get": function(key){
            return sessionStorage[key];
        },
        // 设置固定存储值
        "put": function(key, value){
            if(Object.prototype.toString.call(value) !== '[object Undefined]'){
                sessionStorage[key] = JSON.stringify(value);
            }
        },
        "_put": function(key, value){
            sessionStorage[key] = value;
        },
        // 获得gps地址
        "gps": (function(){
            function getGps(callback){
                if((typeof(BMap) != 'undefined') && (typeof(coordtransform) != 'undefined')){
                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function(r){
                        if(this.getStatus() == BMAP_STATUS_SUCCESS){
                            if(callback){
                                var wgs = coordtransform.bd09towgs84(r.point.lng, r.point.lat);
                                callback(wgs[0], wgs[1]);
                            }
                        }
                    }, {enableHighAccuracy: true});
                }
            }

            var longitude = 0.0;
            var latitude = 0.0;

            getGps(function(lon, lat){
                longitude = Number(lon);
                latitude = Number(lat);
            });

            return function(callback){
                getGps(callback);
                return longitude + ',' + latitude;
            }
        })(),
        // 用浏览器打开地址
        "open_url": function(url){
            location.href = url;
        },
        "redirect": function(url, tip){
            if(typeof jQuery != 'undefined'){
                var $html = jQuery('<div>' +
                    '<div class="weui-mask_transparent"></div>' +
                    '<div class="weui-toast">' +
                    '<i class="weui-loading weui-icon_toast"></i>' +
                    '<p class="weui-toast__content">支付中...</p>' +
                    '</div></div>');
                $html.find('p').text(tip || '跳转中');
                $('body').append($html);
                setTimeout(function(){
                    $html.remove();
                }, 15000);
            }
            setTimeout(function(){
                location.href = url;
            }, 500);
        },
        // alert 你懂的
        "alert": function(msg, confirm_txt, callback){
            confirm_txt = confirm_txt || '确认';
            if(jQuery){
                var $weui = jQuery('<div class="js_dialog">' +
                    '<div class="weui-mask"></div>' +
                    '<div class="weui-dialog">' +
                    '<div class="weui-dialog__bd">...</div>' +
                    '<div class="weui-dialog__ft"><a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">确认</a></div>' +
                    '</div>' +
                    '</div>');
                $weui.find('.weui-dialog__bd').html(msg);
                $weui.find('a').text(confirm_txt).click(function(){
                    if(!callback || callback()){
                        $weui.remove();
                    }
                });
                $('body').append($weui);
                $weui.show();
            }else{
                alert(msg);
            }
        },
        "confirm": function(option, callback){
            callback = callback || option['callback'];
            if(confirm(option['message'])){
                callback(true);
            }else{
                callback(false);
            }
        },
        "select": function(opts){
            opts = opts || [
                {
                    'name': 'confirm',
                    'text': '确认',
                    'callback': function(next){
                        return next();
                    }
                }
            ];
            var html = '<div>' +
                '<div class="weui-mask" id="iosMask" style="display: none"></div>' +
                '<div class="weui-actionsheet" id="iosActionsheet">' +
                '<div class="weui-actionsheet__menu">' +
                '</div>' +
                '<div class="weui-actionsheet__action">' +
                '<div class="weui-actionsheet__cell cancel" id="iosActionsheetCancel">取消</div>' +
                '</div></div></div>';

            var $html = $(html);
            var len = opts.length;
            var $item = false;
            var option = {};

            $('body').append($html);
            function closeIt(){
                $html.find('#iosActionsheet').removeClass('weui-actionsheet_toggle');
                $html.find('.weui-mask').fadeOut(500);
                setTimeout(function(){
                    $html.remove();
                }, 500);
            }

            $html.find('.cancel').click(function(){
                $html.find('#iosActionsheet').removeClass('weui-actionsheet_toggle');
                $html.find('.weui-mask').fadeOut(500);
                setTimeout(function(){
                    $html.remove();
                }, 500);
            });

            for(var i = 0; i < len; i++){
                option = opts[i];
                $item = $('<div class="weui-actionsheet__cell"></div>').text(option['text'] || option['name']);
                $item.click((function(cbf){
                    return function(){
                        cbf(closeIt)
                    }
                })(option['callback']));
                $html.find('.weui-actionsheet__menu').append($item);
            }
            $html.find('.weui-mask').fadeIn(200);
            $html.find('#iosActionsheet').addClass('weui-actionsheet_toggle');
        },
        // 应用后台任务提示
        "notify": function(title, msg){
            //todo
            alert(title + ": " + msg);
        },
        "token": getOrSetToken,
        "setupShareInfo": function(title, summary, imgUrl, link){}
    };

    if(typeof(android) != 'undefined'){
        android.get = function(key){
            try{
                return JSON.parse(android._get(key) || '""');
            }catch(e){
                return '';
            }
        };
        android.put = function(k, v){
            return android._put(k, JSON.stringify(v));
        };
        android.current_user = current_user;
        android.user = funs['user'];
        android.is_user = funs['is_user'];
        android.token = getOrSetToken;
        android.alert = funs['alert'];
        android.redirect = android['redirect'] ? android['redirect'] : funs['redirect'];

        if(!android['confirm']){
            android['confirm'] = funs['confirm'];
        }
        if(!android['setupShareInfo']){
            android['setupShareInfo'] = funs['setupShareInfo'];
        }
        return android;
    }

    return funs;
})();
