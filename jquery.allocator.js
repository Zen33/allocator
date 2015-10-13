/*
Allocator Plugin v0.09
By T.Z (tangzhen@me.com)
API：（151012）
.count: 个数
.val: 初始化值，可以为小数
.min: 最小值
.max: 最大值
.change(value, $controller): 发生变化对应事项，this为本体，value为当前值，$controller为当前上下操作本体
.callback(value): 创建后事项，this为本体，value为当前值
=============================================
再次$(selector).allocator({...})后会重新创建。
*/
$.fn.allocator = function(opts) {
    var $this = this,
        contents = '<div class="allocator-wrapper">',
        id = $this.attr('id'),
        totals,
        currentVal,
        decimalPlaceLength = 0,
        decimalPlaceIndex = -1,
        valArray = [],
        tmpValArray = [],
        getCurVal = function(index, len) {
            var val = '';

            $this.find('.allocator-main').each(function(i) {
                if (i === index) {
                    val += '.';
                }
                val += this.innerHTML;
            });
            return index === -1 ? parseInt(val) : parseFloat(val).toFixed(len);
        },
        getTmpVal = function(arr, index, len) {
            var val = '';

            $.each(arr, function(i) {
                if (i === index) {
                    val += '.';
                }
                val += arr[i];
            });
            return index === -1 ? parseInt(val) : parseFloat(val).toFixed(len);
        },
        init = function(opts, type) {
            if (opts.hasOwnProperty('val')) {
                var val = opts.val.toString();

                decimalPlaceIndex = val.indexOf('.');
                currentVal = val.replace(/[^\d]/g, ''); // replace( /^\D+/g, '');// match(/\d+/g);
                valArray = currentVal.split('');
                totals = valArray.length;
                decimalPlaceLength = totals - decimalPlaceIndex;
            } else {
                totals = opts.count || 1;
            }
            // $this.attr('allocator-index', decimalPlaceIndex);
            // $this.attr('allocator-length', decimalPlaceLength);
            opts.max = opts.max || null;
            opts.min = opts.min || null;
            for (var i = 0; i < totals; i++) {
                contents += '<ul><li id="allocator_up_' + id + '_' + i + '" class="allocator-up allocator-available allocator-controller">&nbsp;</li><li id="allocator_main_' + id + '_' + i + '" class="allocator-main">' + (valArray[i] || 0) + '</li><li id="allocator_down_' + id + '_' + i + '" class="allocator-down allocator-available allocator-controller">&nbsp;</li></ul>';
            }
            contents += '</div>';
            type ? $this.append(contents) : $this.html(contents);
            if (decimalPlaceIndex > -1) {
                currentVal = parseFloat(getCurVal(decimalPlaceIndex)).toFixed(decimalPlaceLength);
            } else {
                currentVal = 0;
            }
            tmpValArray = currentVal.toString().replace(/[^\d]/g, '').split('');
            opts.callback && opts.callback.call($this[0], currentVal);
        };

    if (!id) {
        return;
    }
    opts = opts || {};
    init(opts);
    // if ($this.hasClass('allocator-inside')) {
    //     return;
    // }
    $this.find('.allocator-up, .allocator-down').off('click.allocator').on('click.allocator', function(e) {
        // $this.on('click.allocator', '.allocator-up, .allocator-down', function(e) {
        var $that = $(e.target),
            $container = $that.closest('ul'),
            $main = $container.find('.allocator-main'),
            soloVal = parseInt($main.html()),
            index = $container.index(),
            tmpVal = parseInt(soloVal),
            hasChanged = false;

        if ($that.hasClass('allocator-down')) {
            if (soloVal > 0 && $that.hasClass('allocator-available')) {
                tmpValArray[index] = --tmpVal;
                if (opts.min && getTmpVal(tmpValArray, decimalPlaceIndex, decimalPlaceLength) < opts.min) {
                    tmpValArray[index] = ++tmpVal;
                    return;
                }
                $main.html(--soloVal);
                hasChanged = true;
            }
        } else {
            if (soloVal < 9 && $that.hasClass('allocator-available')) {
                tmpValArray[index] = ++tmpVal;
                if (opts.max && getTmpVal(tmpValArray, decimalPlaceIndex, decimalPlaceLength) > opts.max) {
                    tmpValArray[index] = --tmpVal;
                    return;
                }
                $main.html(++soloVal);
                hasChanged = true;
            }
        }
        if (hasChanged) {
            // currentVal = getCurVal(+$this.attr('allocator-index'), +$this.attr('allocator-length'));
            currentVal = getCurVal(decimalPlaceIndex, decimalPlaceLength);
            opts.change && opts.change.apply($this[0], [currentVal, $container.find('.allocator-controller')]);
        }
    });
    $this.addClass('allocator-inside');
};