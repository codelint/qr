/**
 * Date: 14-4-9
 * Time: 下午2:50
 * Author: Ray.Zhang <codelint@foxmail.com>
 */
U = typeof(U) == 'undefined' ? {} : U;
U.api_entry = typeof(U.api_entry) == 'undefined' ? '' : U.api_entry;

U.ajax = (function($){
    var retryInterval = 500;
    var retryTimes = 1;
    var baseurl = (U && U.api_entry) || '';

    function _url(url){
        return url.slice(0, 1) == '/' ? (baseurl + url) : url;
    }

    return {
        url: _url,
        getUrlParam: function(name){
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r != null) return unescape(r[2]);
            return null;
        },
        ajaxHtml: function(url, callback, tries){
            var ajaxHtml = arguments.callee;
            tries = tries || retryTimes;
            $.ajax({
                type: "get",
                url: _url(url),
                success: function(html){
                    callback(null, html);
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            ajaxHtml(url, callback, tries);
                        }, retryInterval);
                    }else{
                        callback(e, null);
                    }
                }
            })
        },
        postForm: function(url, data, callback, tries){
            var postJson = arguments.callee;
            tries = tries || retryTimes;
            $.ajax({
                type: "post",
                url: _url(url),
                data: data,
                success: function(json){
                    callback(null, json);
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            postJson(url, data, callback, tries);
                        }, retryInterval);
                    }else{
                        callback(e, null);
                    }
                },
                contentType: 'application/x-www-form-urlencoded'
            });
        },
        postJson: function(url, data, callback, tries){
            var postJson = arguments.callee;
            tries = tries || retryTimes;
            $.ajax({
                type: "post",
                url: _url(url),
                data: JSON.stringify(data),
                success: function(json){
                    callback(null, json);
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            postJson(url, data, callback, tries);
                        }, retryInterval);
                    }else{
                        callback(e, null);
                    }
                },
                contentType: "application/json",
                dataType: "json"
            });
        },
        sysnGet: function(url, data, callback){
            var sysnGet = arguments.callee;
            var tries = retryTimes;
            url += '?';
            $.each(data, function(index, value){
                url += index + '=' + value + '&';
            });
            //var time = parseInt(new Date().getTime()/1000)+10;
            url += 'callback=?';
            $.ajax({
                url: _url(url),
                jsonp: "callback",
                dataType: "jsonp",
                success: function(json){
                    if(json.data && json.data.code){
                        alert('请重试!');
                    }
                    else if(json.data){
                        callback(null, json.data);
                    }
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            sysnGet(url, data, callback);
                        }, retryInterval);
                    }else{
                        callback(e, null);
                    }
                }
            });
        },
        getJson: function(url, callback, tries){
            var getJson = arguments.callee;
            tries = tries || retryTimes;
            $.ajax({
                type: "get",
                url: _url(url),
                success: function(json){
                    callback(null, json);
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            getJson(url, callback, tries);
                        }, retryInterval);
                    }else{
                        callback(e, null);
                    }
                },
                contentType: "application/json",
                dataType: "json"
            });
        },
        apiGet: function(url, data, callback){
            // var url = method.indexOf('/') < 0 ? _url('/open/api?method=' + method) : method;
            url = url.indexOf('?') < 0 ? url + "?" : url;
            if(arguments.length < 3){
                callback = data;
            }else{
                _.each(data, function(v, k){
                    url += ('&' + k + '=' + v)
                });
            }

            this.getJson(url, function(e, json){
                if(e){
                    return callback(e);
                }else{
                    if(!json.status){
                        callback({message:'未知错误，请联系管理员'}, json);
                    }else if(json['status']['code'] > 0){
                        callback(json['status'], json['data']);
                    }else{
                        callback(null, json['data']);
                    }
                }
            });
        },
        apiPost: function(url, data, callback){
            // var url = method.indexOf('/') < 0 ? _url('/open/api?method=' + method) : method;
            // url = url.indexOf('?') < 0 ? url + "?" : url;
            // if(arguments.length < 3){
            //     callback = data;
            // }else{
            //     _.each(data, function(v, k){
            //         url += ('&' + k + '=' + v)
            //     });
            // }

            this.postJson(url, data, function(e, json){
                if(e){
                    return callback(e);
                }else{
                    if(!json.status){
                        callback({message: '未知错误，请联系管理员'}, json);
                    }else if(json['status']['code'] > 0){
                        callback(json['status'], json['data']);
                    }else{
                        callback(null, json['data']);
                    }
                }
            });
        },
        baseurl: function(){
            return baseurl;
        }
    }
})(jQuery);

//# sourceMappingURL=ajaxtool.js.map
