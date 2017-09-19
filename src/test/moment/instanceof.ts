import { module, test } from '../qunit';
import moment from '../../moment';

module('instanceof');

test('instanceof', function (assert) {
    var mm = moment([2010, 0, 1]);

    var extend = function (a, b) {
        var i;
        for (i in b) {
            a[i] = b[i];
        }
        return a;
    };

    assert.equal(moment() instanceof moment, true, 'simple moment object');
    assert.equal(extend({}, moment()) instanceof moment, false, 'extended moment object');
    assert.equal(moment(null) instanceof moment, true, 'invalid moment object');

    assert.equal(new Date() instanceof moment, false, 'date object is not moment object');
    assert.equal(Object instanceof moment, false, 'Object is not moment object');
    assert.equal(('foo' as any) instanceof moment, false, 'string is not moment object');
    assert.equal((1 as any) instanceof moment, false, 'number is not moment object');
    assert.equal((NaN as any) instanceof moment, false, 'NaN is not moment object');
    assert.equal((null as any) instanceof moment, false, 'null is not moment object');
    assert.equal((undefined as any) instanceof moment, false, 'undefined is not moment object');
});
