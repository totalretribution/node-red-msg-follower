RED.nodes.registerType('msg-follower', {
  category: 'function',
  color: '#a6bbcf',
  defaults:
  {
    name: { value: "" },
    property1: {
      value: "topic", required: true,
      validate: RED.validators.typedInput("propertyType", false)
    },
    property1Type: { value: "msg", required: true },
    property2: {
      value: "payload", required: true,
      validate: RED.validators.typedInput("propertyType", false)
    },
    property2Type: { value: "msg", required: true },
    items: { value: [{ prop1: "", prop1type: "str", prop2: "", prop2type: "str" }], required: true },
    order: { value: "1", required: true },
    ignore: { value: "1", required: true }
  },
  inputs: 1,
  outputs: 1,
  icon: "file.png",
  label: function () {
    return this.name || "msg-follower";
  },
  oneditprepare: function () {
    var node = this;
    $("#node-input-property1").typedInput({ default: this.property1Type || 'msg', types: ['msg'] });
    $("#node-input-property2").typedInput({ default: this.property2Type || 'msg', types: ['msg'] });

    if (this.order != "" && this.order != undefined) {
      $("#node-input-order").val(this.order);
      $("#node-input-order").change();
    } else {
      $("#node-input-order").val('0');
      $("#node-input-order").change();
    }

    $("#node-input-items-container").css('min-height', '150px').css('min-width', '550px').css('height', '595px').editableList({
      addItem: function (container, i, opt) {
        // debugger;
        if (!opt.hasOwnProperty('item')) {  // A User created item.
          opt.item = {};
        }

        opt.element = container;
        let item = opt.item;
        if (!item.hasOwnProperty('prop1') || item.prop1 == undefined) {
          item.prop1 = '';
        }
        if (!item.hasOwnProperty('prop1type') || item.prop1type == undefined) {
          item.prop1type = 'str';
        }
        if (!item.hasOwnProperty('prop2') || item.prop2 == undefined) {
          item.prop2 = '';
        }
        if (!item.hasOwnProperty('prop2type') || item.prop2type == undefined) {
          item.prop2type = 'str';
        }
        container.css({
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          display: "flex",
          "align-items": "center"
        });
        let inputRows = $('<div></div>', { style: "flex-grow:1" }).appendTo(container);

        let row1 = $('<div></div>', { style: "display: flex;" }).appendTo(inputRows);
        $('<label/>', { for: "node-input-item-property1-" + i, style: "margin-left: 3px; width:6em;" }).text("Property 1").appendTo(row1);
        let property1Field = $('<input/>', { id: "node-input-item-property1-" + i, class: "node-input-item-property1", type: "text", style: "width: 100%;" }).appendTo(row1)
        .typedInput({ default: item.idtype, types: ['str', 'num', 'bool', 'jsonata'] });
        property1Field.typedInput('value', item.prop1);

        let row2 = $('<div></div>', { style: "display: flex;" }).appendTo(inputRows);
        $('<label/>', { for: "node-input-item-property2-" + i, style: "margin-left: 3px; width:6em;" }).text("Property 2").appendTo(row2);
        let property2Field = $('<input/>', { id: "node-input-item-property2-" + i, class: "node-input-item-property2", type: "text", style: "width: 100%;" }).appendTo(row2)
        .typedInput({ default: item.proptype, types: ['str', 'num', 'bool', 'jsonata'] });
        property2Field.typedInput('value', item.prop2);

        let finalspan = $('<span/>', { style: "margin-left: 5px;" }).appendTo(container);
        finalspan.append(' &#8594; <span class="node-input-item-index">' + (i + 1) + '</span> ');
        property1Field.typedInput("focus");
      },
      removeItem: function (opt) {
        debugger;
        let items = $("#node-input-items-container").editableList('items');
        items.each(function (i) {
          $(this).find(".node-input-item-index").html(i + 1);
        });
      },
      sortable: true,
      removable: true
    });

    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      $("#node-input-items-container").editableList('addItem', { item: { prop1: item.prop1, prop1type: item.prop1type, prop2: item.prop2, prop2type: item.prop2type } });
    }
  },
  oneditsave: function () {
    var node = this;
    node.items = [];
    this.property1Type = $("#node-input-property1").typedInput('type');
    this.property2Type = $("#node-input-property2").typedInput('type');
    let items = $("#node-input-items-container").editableList('items');
    items.each(function (i) {
      const item = $(this);
      const prop1 = item.find(".node-input-item-property1").typedInput('value');
      const prop1Type = item.find(".node-input-item-property1").typedInput('type');
      const prop2 = item.find(".node-input-item-property2").typedInput('value');
      const prop2Type = item.find(".node-input-item-property2").typedInput('type');
      const itemObj = { prop1: prop1, prop1Type: prop1Type, prop2: prop2, prop2Type: prop2Type };
      node.items.push(itemObj);
    });
  },
});