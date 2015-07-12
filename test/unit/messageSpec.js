"use strict";

var Message = require('../../lib/message'),
    chai = require('chai'),
    expect = chai.expect;

describe('UNIT Message', function () {
  describe('constructor', function () {
    it('should create an empty message with a data object if not passed an object', function () {
      var mess = new Message();
      expect(mess.collapseKey).to.be.undefined;
      expect(mess.delayWhileIdle).to.be.undefined;
      expect(mess.timeToLive).to.be.undefined;
      expect(mess.dryRun).to.be.undefined;
      expect(mess.data).to.deep.equal({});
    });

    it('should call new on constructor if user does not', function () {
      var mess = Message();
      expect(mess).to.not.be.undefined;
      expect(mess).to.be.instanceOf(Message);
    });

    it('should create an message with properties passed in', function () {
      var obj = {
        collapseKey: 'Message',
        delayWhileIdle: true,
        timeToLive: 100,
        dryRun: true,
        data: {
          score: 98
        },
        notification: {}
      };
      var mess = new Message(obj);
      expect(JSON.stringify(mess)).to.equal(JSON.stringify(obj));
    });

    it('should only set properties passed into constructor', function () {
      var obj = {
        collapseKey: 'Message',
        delayWhileIdle: true,
        data: {
          score: 98
        },
        notification: {}
      };
      var mess = new Message(obj);
      expect(JSON.stringify(mess)).to.equal(JSON.stringify(obj));
      expect(mess.timeToLive).to.be.undefined;
      expect(mess.dryRun).to.be.undefined;
    });
  });

  describe('addData()', function () {
    it('should add properties to the message data object given a key and value', function () {
      var mess = new Message();
      mess.addData('myKey', 'Message');
      expect(mess.data.myKey).to.equal('Message');
    });

    it('should only set values on data object, not top level message', function () {
      var mess = new Message();
      mess.addData('collapseKey', 'Message');
      expect(mess.collapseKey).to.not.equal('Message');
      expect(mess.data.collapseKey).to.equal('Message');
    });

    it('should set the data property to the object passed in', function () {
      var mess = new Message();
      var obj = {
        message: 'hello',
        key: 'value'
      };
      mess.addData(obj);
      expect(mess.data).to.deep.equal(obj);
    });

    it('should overwrite data object when an object is passed in', function () {
      var data = {
        message: 'hello',
        key: 'value'
      };
      var mess = new Message({ data: { message: 'bye', prop: 'none' } });
      mess.addData(data);
      expect(mess.data).to.deep.equal(data);
    });

    it('should not overwrite data if not passed an object', function () {
      var data = {
        message: 'hello',
        key: 'value'
      };
      var mess = new Message({ data: data });
      mess.addData('adding');
      expect(mess.data).to.deep.equal(data);
    });

    it('should not overwrite data if passed an empty object', function () {
      var data = {
        message: 'hello',
        key: 'value'
      };
      var mess = new Message({ data: data });
      mess.addData({});
      expect(mess.data).to.deep.equal(data);
    });

    it.skip('should do something if not called properly');
  });

  describe('addDataWithKeyValue()', function () {
    it('should add properties to the message data object given a key and value', function () {
      var mess = new Message();
      mess.addDataWithKeyValue('myKey', 'Message');
      expect(mess.data.myKey).to.equal('Message');
    });

    it('should only set values on data object, not top level message', function () {
      var mess = new Message();
      mess.addDataWithKeyValue('collapseKey', 'Message');
      expect(mess.collapseKey).to.not.equal('Message');
      expect(mess.data.collapseKey).to.equal('Message');
    });

    it.skip('should do something if not called properly');
  });

  describe('addDataWithObject()', function () {
    it('should set the data property to the object passed in', function () {
      var mess = new Message();
      var obj = {
        message: 'hello',
        key: 'value'
      };
      mess.addDataWithObject(obj);
      expect(mess.data).to.deep.equal(obj);
    });

    it('should overwrite data object when an object is passed in', function () {
      var data = {
        message: 'hello',
        key: 'value'
      };
      var mess = new Message({ data: { message: 'bye', prop: 'none' } });
      mess.addDataWithObject(data);
      expect(mess.data).to.deep.equal(data);
    });

    it('should not overwrite data if not passed an object', function () {
      var data = {
        message: 'hello',
        key: 'value'
      };
      var mess = new Message({ data: data });
      mess.addDataWithObject('adding');
      expect(mess.data).to.deep.equal(data);
    });

    it('should not overwrite data if passed an empty object', function () {
      var data = {
        message: 'hello',
        key: 'value'
      };
      var mess = new Message({ data: data });
      mess.addDataWithObject({});
      expect(mess.data).to.deep.equal(data);
    });
  });

  describe('addNotification()', function () {
    it('should add attribute on notification object if pass key and value', function () {
      var mess = new Message();
      mess.addNotification('title', 'hello');
      mess.addNotification('icon', 'ic_launcher');
      mess.addNotification('body', 'world');
      expect(mess.notification.title).to.equal('hello');
      expect(mess.notification.icon).to.equal('ic_launcher');
      expect(mess.notification.body).to.equal('world');
    });

    it('should set the notification property to the object passed in', function () {
      var mess = new Message();
      var obj = {
        title: 'hello',
        icon: 'ic_launcher',
        body: 'world'
      };
      mess.addNotification(obj);
      expect(mess.notification).to.deep.equal(obj);
    });
  });
  
  describe('toJson()', function() {
    it('should return well-formed data for GCM if it is valid', function() {
      var m = new Message({
        delayWhileIdle: true,
        dryRun: true,
        data: {
          hello: "world"
        }
      });

      var json = m.toJson();

      expect(json.delay_while_idle).to.equal(true);
      expect(json.dry_run).to.equal(true);
      expect(json.data.hello).to.equal("world");
      expect(json.delayWhileIdle).to.be.an("undefined");
      expect(json.dryRun).to.be.an("undefined");
    });
    
    it('should return well-formed data for GCM if it describes a notification', function() {
      var notificationData = {
        title: "Hello, World",
        icon: 'ic_launcher',
        body: "This is a quick notification."
      };

      var m = new Message({ delayWhileIdle: true });
      m.addNotification(notificationData);

      var json = m.toJson();

      expect(json.delay_while_idle).to.equal(true);
      expect(json.notification).not.to.be.an("undefined");
      expect(json.notification).to.deep.equal(notificationData);
    });
    
    it('should ignore non-standard fields when serializing', function() {
      var m = new Message({
        timeToLive: 60 * 60 * 24,
        wrongField: "should be excluded",
        alsoThisFieldIsWrong: "and should not show up"
      });

      var json = m.toJson();

      expect(json.time_to_live).to.equal(60 * 60 * 24);
      expect(Object.keys(json).length).to.equal(1);
    });
  });

});
