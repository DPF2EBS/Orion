(function () {
    var TagGraph = function (options) {
        var default_option = {
            targetElSelector:"a",
            dataMatcher:function (el) {
                //判断el是否有符合的数据，如果有，返回 text 或者value  ， 如果没有 返回false
                return false;
            },
            renderColor:true,
            percent:true
        }

        this.options = default_option;
        if (options) {
            for (var o in options) {
                if (options.hasOwnProperty(o)) {
                    this.options[o] = options[o];
                }
            }
        }


    }

    TagGraph.prototype = {
        constructor:TagGraph,
        display:function () {
            var option = this.options,
                self = this,
                elements = [],
                noPositionElements = [],
                container = $('<div class="wr-tag-container"></div>').appendTo(document.body);
            $('<div class="wr-close-bg"></div>').appendTo(container)
            $('<a class="wr-close" href="javascript:void(0);" title="点击关闭标签图">×</a>').appendTo(container).click(function () {
                self.destroy();
            });
            $(option.targetElSelector).each(function (i, el) {
                var e = $(el),
                    res = option.dataMatcher(e)

                if (res !== false) {
                    var offset = e.offset();
                    if (offset.left <= 0 || offset.top <= 0) {
                        noPositionElements.push({
                            res:res,
                            el:e
                        })
                    } else {
                        var tag = $('<span class="wr-tag-item"></span>').css({
                            left:e.offset().left - 10,
                            top:e.offset().top - 20
                        }).text(option.percent ? (res + "%") : res).appendTo(container)
                        tag.data('tag_value', res);
                        tag.data('related_node', e);
                        elements.push(tag);
                    }
                }
            });
            this.container = container;

            this.elements = elements;

            this.layoutNoPositionElements(noPositionElements);

            this.colorize();
            this.hover();
        },
        destroy:function () {
            this.container.remove();
            this.elements = [];

        },
        colorize:function () {
            if (!this.elements.length) {
                return;
            }
            var self = this;
            var clone = this.elements.slice(0);
            clone.sort(function (a, b) {
                return a.data('tag_value') - b.data('tag_value');
            });
            var max = clone[clone.length - 1].data('tag_value');
            this.elements.forEach(function (el) {
                var percent = el.data('tag_value') / max,
                    rgb = self.hsvToRgb(0, 20 + percent * 200, percent * 100 + 50);
                el.css('background-color', 'rgb(' + rgb.join(',') + ')');
            });
//            this.elements.forEach(function (el) {
//                el.css('background-color', self.color(el.data('tag_value') / max));
//            });
        },
        hsvToRgb:function (h, s, v) {
            var r, g, b;
            var i;
            var f, p, q, t;
            // Make sure our arguments stay in-range
            h = Math.max(0, Math.min(360, h));
            s = Math.max(0, Math.min(100, s));
            v = Math.max(0, Math.min(100, v));
            // We accept saturation and value arguments from 0 to 100 because that's
            // how Photoshop represents those values. Internally, however, the
            // saturation and value are calculated from a range of 0 to 1. We make
            // That conversion here.
            s /= 100;
            v /= 100;
            if (s == 0) {
                // Achromatic (grey)
                r = g = b = v;
                return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            }

            h /= 60; // sector 0 to 5
            i = Math.floor(h);
            f = h - i; // factorial part of h
            p = v * (1 - s);
            q = v * (1 - s * f);
            t = v * (1 - s * (1 - f));

            switch (i) {
                case 0:
                    r = v;
                    g = t;
                    b = p;
                    break;

                case 1:
                    r = q;
                    g = v;
                    b = p;
                    break;

                case 2:
                    r = p;
                    g = v;
                    b = t;
                    break;

                case 3:
                    r = p;
                    g = q;
                    b = v;
                    break;

                case 4:
                    r = t;
                    g = p;
                    b = v;
                    break;

                default:
                    // case 5:
                    r = v;
                    g = p;
                    b = q;
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        },
        color:function (percent) {
            percent = percent * 1400;
            return 'hsl(360, ' + parseInt(percent * 4) + '%, 50%)';
        },
        hover:function () {
            this.elements.forEach(function (el) {
                var mask;
                el.hover(function () {
                    mask = $('<div></div>');
                    var origin = el.data('related_node')
                    mask.css({
                        'background-color':'blue',
                        'opacity':.3,
                        'width':origin.width(),
                        'height':origin.height(),
                        'position':'absolute',
                        'left':origin.offset().left,
                        'top':origin.offset().top,
                        'z-index':10000
                    }).appendTo(document.body)
                }, function () {
                    mask.remove()
                });
            })
        },
        on:function (type, fn) {
            this.elements.forEach(function (el) {
                el[type](fn);
            });
        },
        resize:function () {
            this.elements.forEach(function (e) {
                var link = e.data('related_node');
                e.css({
                    left:link.offset().left - 10,
                    top:link.offset().top - 20
                })
            });
        },
        layoutNoPositionElements:function (els) {
            if (!els.length) {
                return;
            }
            var container = $('<div class="wr-nop">\
                    <div class="wr-nop-tag">无法定位的标签</div>\
                    <div class="wr-nop-list"></div>\
                </div>'),
                option = this.options,
                elements = this.elements;
            els.forEach(function (el) {
                var list = $('<dl><dt></dt><dd></dd></dl>').appendTo(container.find('.wr-nop-list'));
                var tag = $('<span class="wr-nop-tag-item"></span>').text(option.percent ? (el.res + "%") : el.res).appendTo(list.find('dt'));
                el.el.clone().appendTo(list.find('dd'));
                tag.data('tag_value', el.res);
                tag.data('related_node', el.el);
                elements.push(tag);
            });
            container.appendTo(this.container)
            var left = -container.find('.wr-nop-list').width() - 2;
            container.css({
                'left':left
            });
            container.find('.wr-nop-tag').toggle(function () {
                container.stop().animate({left:0}, 500)
            }, function () {
                container.stop().animate({left:left}, 500)
            });
        }

    }

    this.TagGraph = TagGraph;
})();