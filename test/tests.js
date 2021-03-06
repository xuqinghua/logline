var assert = window.chai.assert;

describe('Logline', function() {
    before(function() {
        // runs before all tests in this block
    });

    after(function() {
        delete window.Logline._protocol;
    });

    it('should correctly globally exposed', function(done) {
        assert.isFunction(window.Logline, 'should be a constructor');
        assert.isObject(window.Logline.PROTOCOL, 'static interface using');
        assert.isFunction(window.Logline.using, 'static interface using');
        assert.isFunction(window.Logline.keep, 'static interface keep');
        assert.isFunction(window.Logline.clean, 'static interface clean');
        assert.isFunction(window.Logline.getAll, 'static interface getAll');
        done();
    });

    it('should be able to specialfy any available protocols', function(done) {
        for (var i = 0; i < Object.keys(window.Logline.PROTOCOL).length; i++) {
            window.Logline.using(window.Logline.PROTOCOL[Object.keys(window.Logline.PROTOCOL)[i]]);
            assert.equal(window.Logline._protocol, window.Logline.PROTOCOL[Object.keys(window.Logline.PROTOCOL)[i]], 'protocol should be properly setted');
            window.Logline.PROTOCOL[Object.keys(window.Logline.PROTOCOL)[i]].clean();
            delete window.Logline._protocol;
        }
        done();
    });

    it('should be able to create any available protocols instant', function(done) {
        for (var i = 0; i < Object.keys(window.Logline.PROTOCOL).length; i++) {
            window.Logline.using(window.Logline.PROTOCOL[Object.keys(window.Logline.PROTOCOL)[i]]);
            var logger = new window.Logline('a');
            assert.equal(window.Logline._protocol, window.Logline.PROTOCOL[Object.keys(window.Logline.PROTOCOL)[i]], 'protocol should be properly setted');
            assert.instanceOf(logger, window.Logline.PROTOCOL[Object.keys(window.Logline.PROTOCOL)[i]], 'log instance should be correctly created');
            window.Logline.PROTOCOL[Object.keys(window.Logline.PROTOCOL)[i]].clean();
            delete window.Logline._protocol;
        }
        done();
    });

});

if (window.Logline.PROTOCOL.INDEXEDDB && window.Logline.PROTOCOL.INDEXEDDB.support) {
    describe('IndexedDBLogger', function() {
        before(function() {
            window.Logline.using(window.Logline.PROTOCOL.INDEXEDDB);
            window.Logline.keep(0);
        });

        after(function() {
            window.Logline.clean();
            delete window.Logline._protocol;
        });



        it('should be able to add and get records', function(done) {
            var logger = new window.Logline('fucku');
            var randomVars = window.Math.random().toString(36).slice(2, 6);
            console.log(randomVars);
            logger.info('info', randomVars[0]);
            // logger.info('warn', randomVars[1]);
            // logger.info('error', randomVars[2]);
            // logger.info('critical', randomVars[3]);

            window.Logline.getAll(function(logs) {
                assert.isArray(logs, 'logs collect from database');
                assert.equal(logs[0].data, randomVars[0], 'record get from database is not the one we stored');
                // assert.equal(logs[1].data, randomVars[1], 'record get from database is not the one we stored');
                // assert.equal(logs[2].data, randomVars[2], 'record get from database is not the one we stored');
                // assert.equal(logs[3].data, randomVars[3], 'record get from database is not the one we stored');
                done();
            });
        });

        it('should be able to keep the logs only we wanted', function(done) {
            done();
        });

        it('should be able to clean up the logs', function(done) {
            window.Logline.clean();
            done();
        });
    });
}

if (window.Logline.PROTOCOL.WEBSQL && window.Logline.PROTOCOL.WEBSQL.support) {
    describe('WebsqlLogger', function() {
        before(function() {
            window.Logline.using(window.Logline.PROTOCOL.WEBSQL);
            window.Logline.keep(0);
        });

        after(function() {
            delete window.Logline._protocol;
        });

        it('should be able to choose websql protocol and interfaces are accessable', function(done) {
            var logger = new window.Logline('test');
            assert.isFunction(logger.info, 'instance interface info');
            assert.isFunction(logger.warn, 'instance interface warn');
            assert.isFunction(logger.error, 'instance interface error');
            assert.isFunction(logger.critical, 'instance interface critical');

            var WebsqlLogger = window.Logline._protocol;
            assert.isFunction(WebsqlLogger.init, 'static interface init');
            assert.isFunction(WebsqlLogger.all, 'static interface all');
            assert.isFunction(WebsqlLogger.keep, 'static interface keep');
            assert.isFunction(WebsqlLogger.clean, 'static interface keep');
            done();
        });

        it('should be able to add and get records', function(done) {
            var logger = new window.Logline('test');
            var randomVars = window.Math.random().toString(36).slice(2,6);
            logger.info('info', randomVars[0]);
            logger.info('warn', randomVars[1]);
            logger.info('error', randomVars[2]);
            logger.info('critical', randomVars[3]);

            window.Logline._protocol.all(function(logs) {
                assert.isArray(logs, 'logs collect from database');
                assert.equal(logs[0].data, randomVars[0], 'record get from database is not the one we stored');
                assert.equal(logs[1].data, randomVars[1], 'record get from database is not the one we stored');
                assert.equal(logs[2].data, randomVars[2], 'record get from database is not the one we stored');
                assert.equal(logs[3].data, randomVars[3], 'record get from database is not the one we stored');
                done();
            });
        });

        it('should be able to keep the logs only we wanted', function(done) {
            window.Logline.keep(1);
            window.Logline.keep(.1);
            window.Logline.keep('a');
            window.Logline.keep({ a: 1 });
            done();
        });

        it('should be able to clean up the logs', function(done) {
            window.Logline.clean();
            done();
        });

    });
}

if (window.Logline.PROTOCOL.LOCALSTORAGE && window.Logline.PROTOCOL.LOCALSTORAGE.support) {
    describe('LocalStorageLogger', function() {
        before(function() {
            window.Logline.using(window.Logline.PROTOCOL.LOCALSTORAGE);
            window.Logline.keep(0);
        });

        after(function() {
            delete window.Logline._protocol;
        });

        it('should be able to choose localstorage protocol and interfaces are accessable', function(done) {
            var testLogger = new window.Logline('test');
            assert.isFunction(testLogger.info, 'prototype method `info` should be a function');
            assert.isFunction(testLogger.warn, 'prototype method `warn` should be a function');
            assert.isFunction(testLogger.error, 'prototype method `error` should be a function');
            assert.isFunction(testLogger.critical, 'prototype method `critical` should be a function');

            var LocalStorageLogger = window.Logline._protocol;
            assert.isFunction(LocalStorageLogger.init, 'method `init` should be a function');
            assert.isFunction(LocalStorageLogger.all, 'method `all` should be a function');
            assert.isFunction(LocalStorageLogger.keep, 'method `keep` should be a function');
            assert.isFunction(LocalStorageLogger.clean, 'method `clean` should be a function');
            done();
        });

        it('should be able to add and get records', function(done) {
            var logger = new window.Logline('test');
            var randomVars = window.Math.random().toString(36).slice(2, 6);
            logger.info('info', randomVars[0]);
            logger.info('warn', randomVars[1]);
            logger.info('error', randomVars[2]);
            logger.info('critical', randomVars[3]);

            window.Logline.getAll(function(logs) {
                assert.isArray(logs, 'logs collect from database should be an array');
                assert.equal(logs.length, 4, 'record length should be 4, currently ' + logs.length);
                assert.equal(logs[0].data, randomVars[0], 'record get from database is not the one we stored');
                assert.equal(logs[1].data, randomVars[1], 'record get from database is not the one we stored');
                assert.equal(logs[2].data, randomVars[2], 'record get from database is not the one we stored');
                assert.equal(logs[3].data, randomVars[3], 'record get from database is not the one we stored');
                done();
            });
        });

        it('should be able to keep the logs only we wanted', function() {
            window.Logline.keep(1);
            window.Logline.keep(.1);
            window.Logline.keep('a');
            window.Logline.keep({ a: 1 });
        });

        it('should be able to clean up the logs', function() {
            window.Logline.clean();
            if (window.localStorage.getItem('logline') !== null) {
                throw new Error('log database is not properly removed');
            }
        });

    });
}
