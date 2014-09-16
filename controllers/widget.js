var _initted = false;
var _properties = {};
var _clicking = false;

if (arguments[0]) {
  var args = arguments[0];

  if (args.id) {
    exports.id = args.id;
    delete args.id;
  }

  applyProperties(arguments[0]);
}

function _onTouchstart(e) {
  //Ti.API.info("touchstart e.x,y="+[e.x,e.y].join(',')+" size="+[$.outer.size.width,$.outer.size.height].join(','));
  _clicking = true;
  _applyProperties(_properties.selectedStyle);
}

function _onTouchmove(e) {
  //Ti.API.info("touchmove e.x,y="+[e.x,e.y].join(',')+" size="+[$.outer.size.width,$.outer.size.height].join(','));
  if (e.x >= 0 && e.x < $.outer.size.width &&
      e.y >= 0 && e.y < $.outer.rect.height) {
    // outerの中にあれば選択状態
    //Ti.API.info("inside");
    _clicking = true;
    _applyProperties(_properties.selectedStyle);
  } else {
    // outerから外れたら選択状態解除
    //Ti.API.info("outside");
    _clicking = false;
    _applyProperties(_properties.defaultStyle);
  }
}

function _onTouchcancel(e) {
  //Ti.API.info("touchcancel");
  _clicking = false;
  _applyProperties(_properties.defaultStyle);
}

function _onTouchend(e) {
  // NOTE: outerから外れていてもtouchstartが発火する場合があるので
  // outerから外れたかどうかはtouchmoveでのみチェックし
  // touchendではチェックしない
  //Ti.API.info("touchend e.x,y="+[e.x,e.y].join(',')+" size="+[$.outer.size.width,$.outer.size.height].join(','));
  _applyProperties(_properties.defaultStyle);

  if (_clicking) {
    _clicking = false;
    $.trigger('click', { type: "click", source: $ });
  }
}

function applyProperties(properties) {
  //Ti.API.info("applyProperties1:"+JSON.stringify(properties));
  properties = properties || {};
  _.extend(_properties, properties);

  if (_properties.selectedStyle) {
    _properties.defaultStyle = _.pick(_properties, _.keys(_properties.selectedStyle));
  }

  //Ti.API.info("_applyProperties2:"+JSON.stringify(_properties));
  _applyProperties(_properties);
}

function setTitle(title) {
  if (!_initted) {
    return false;
  }

  $.label.applyProperties({
    text: title
  });

  return true;
}

function getTitle() {
  if (!_initted) {
    return;
  }

  return $.label.getText();
}

function hide() {
  _properties.visible = false;
  $.outer.hide();
}

function show() {
  delete _properties.visible;
  $.outer.show();
}

function disable() {
  $.outer.touchEnabled = false;
  _applyProperties(_properties.selectedStyle);
}

function enable() {
  $.outer.touchEnabled = true;
  _applyProperties(_properties.defaultStyle);
}

function _applyProperties(properties) {
  if (!properties) return;
  _applyOuterProperties(properties);
  _applyInnerProperties(properties);
  _applyLabelProperties(properties);
}

function _applyOuterProperties(properties) {
  if (!properties) return;
  var apply = _.pick(properties,
		     'width', 'height',
		     'top', 'right', 'bottom', 'left', 'center',
		     'backgroundColor', 'backgroundGradient', 'backgroundImage', 'backgroundLeftCap', 'backgroundTopCap', 'backgroundRepeat',
		     'borderColor', 'borderWidth', 'borderRadius',
		     'opacity', 'visible',
		     'bubbleParent'
		    );

  if (_.size(apply)) $.outer.applyProperties(apply);
}

function _applyInnerProperties(properties) {
  if (!properties) return;
  var apply = {};

  if (properties.padding !== undefined) {
    apply.top = properties.padding;
    apply.bottom = properties.padding;
    apply.left = properties.padding;
    apply.right = properties.padding;
  }
  if (properties.paddingTop !== undefined) apply.top = properties.paddingTop;
  if (properties.paddingBottom !== undefined) apply.bottom = properties.paddingBottom;
  if (properties.paddingLeft !== undefined) apply.left = properties.paddingLeft;
  if (properties.paddingRight !== undefined) apply.right = properties.paddingRight;
  //Ti.API.info("_applyInnerProperties2:"+JSON.stringify(apply));

  if (_.size(apply)) $.inner.applyProperties(apply);
}

function _applyLabelProperties(properties) {
  if (!properties) return;
  var apply = _.pick(properties, 'color', 'font');
  if (properties.title !== undefined) apply.text = properties.title;

  if (_.size(apply)) $.label.applyProperties(apply);
}

/*** EXPORTS ***/

exports.applyProperties = applyProperties;

// hide & show
exports.hide = hide;
exports.show = show;

// title
exports.setTitle = setTitle;
exports.getTitle = getTitle;

Object.defineProperty($, "title", {
  get: getTitle,
  set: setTitle
});

// disable & enable
exports.disable = disable;
exports.enable = enable;

// events
exports.addEventListener = $.on;
exports.removeEventListener = $.off;
exports.fireEvent = $.trigger;
