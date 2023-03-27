module.exports = function (RED) {

  function MessageFollowerNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.config = config;
    node.property1 = config.property1;
    node.property2 = config.property2;
    node.items = config.items;
    var numItems = node.items.length;
    node.order = config.order;
    node.ignore = config.ignore;

    var msgBuffer = generateBufferArray(node.items);
    var msgBufferPos = 0;
    var success = undefined;
    node.status({ fill: "yellow", shape: "ring", text: "Awaiting first msg" });

    node.on('input', function (msg) {
      if (msg.topic == 'reset') {
        msgBuffer = generateBufferArray(node.items);
        msgBufferPos = 0;
        success = undefined;
        node.status({ fill: "yellow", shape: "ring", text: "Awaiting first msg" });
      } else {
        if (success == undefined) {
          const msgProp1 = msg[node.property1];
          const msgProp2 = msg[node.property2];
          const itemProp1 = RED.util.evaluateNodeProperty(node.items[msgBufferPos].prop1, node.items[msgBufferPos].prop1type, node)
          const itemProp2 = RED.util.evaluateNodeProperty(node.items[msgBufferPos].prop2, node.items[msgBufferPos].prop2type, node)
          if (node.order == '1') {
            if (msgProp1 === itemProp1 && msgProp2 === itemProp2) {
              msgBufferPos++;
              node.status({ fill: "yellow", shape: "ring", text: "Position: " + msgBufferPos });
            } else {  // identifier does not match.
              if (node.ignore === '1') {
                success = false;
              }
            }
            if (msgBufferPos >= numItems) {
              if (success == undefined) success = true;
            }
          } else {
            let msgBufferFind = msgBuffer.find(obj =>
              RED.util.evaluateNodeProperty(obj.prop1, obj.prop1type, node) === msgProp1
              && RED.util.evaluateNodeProperty(obj.prop2, obj.prop2type, node) === msgProp2
              && obj.msg === false
            );
            if (msgBufferFind != undefined) {
              msgBufferFind.msg = true;
              msgBufferPos++;
              node.status({ fill: "yellow", shape: "ring", text: "count: " + msgBufferPos });
            } else {
              if (node.ignore === '1') {
                success = false;
              }
            }
            if (msgBuffer.find(obj => obj.msg == false) == undefined) {
              if (success === undefined) success = true;
            }
          }
        }

        if (success != undefined) {
          if (success) {
            node.status({ fill: "green", shape: "ring", text: "success" });
          }
          else {
            node.status({ fill: "red", shape: "ring", text: "fail" });
          }
          node.send({ payload: success });
        }
      }
    });
  }

  function generateBufferArray(orgArray) {
    return Array.from(orgArray).map(obj => ({ ...obj, msg: false }));
  }

  RED.nodes.registerType("msg-follower", MessageFollowerNode);
}