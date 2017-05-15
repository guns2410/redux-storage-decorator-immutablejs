import decorator from '../';
import assert from 'assert';

const STATE = {
    key: { foo: 'bar' },
    nested: { key: { foo: 'baz' } },
};

const ENGINE = {
    save: () => {},
    load: () => new Promise(function l(resolve) {
        return resolve(STATE);
    }),
};

describe('decorator', () => {
    it('should be a function which return save, load', () => {
        const ret = decorator(ENGINE);
        assert.equal(typeof ret.load, 'function');
        assert.equal(typeof ret.save, 'function');
    });
    it('should support key and nested key', (done) => {
        const ret = decorator(ENGINE, ['key', ['nested', 'key']]);
        ret.load().then((state) => {
            assert.equal(typeof state.key.get, 'function');
            assert.equal(typeof state.nested.key.get, 'function');
            done();
        }, (error) => done(error));
    });
    it('should support nested key not in already in state', (done) => {
        const ret = decorator(ENGINE, [['nested', 'not-in-key', 'foo', 'bar']]);
        ret.load().then((state) => {
            assert.equal(state.nested['not-in-key'], undefined);
            done();
        }, (error) => done(error));
    });
});
