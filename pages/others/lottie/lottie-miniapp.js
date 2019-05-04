'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function registerComposition(comp) {
  this.compositions.push(comp);
}

function ProjectInterface () {
  /* eslint consistent-return: 0 */
  function thisProjectFunction(name) {
    var i = 0;
    var len = this.compositions.length;
    while (i < len) {
      if (this.compositions[i].data && this.compositions[i].data.nm === name) {
        if (this.compositions[i].prepareFrame && this.compositions[i].data.xt) {
          this.compositions[i].prepareFrame(this.currentFrame);
        }
        return this.compositions[i].compInterface;
      }
      i += 1;
    }
  }

  thisProjectFunction.compositions = [];
  thisProjectFunction.currentFrame = 0;

  thisProjectFunction.registerComposition = registerComposition;

  return thisProjectFunction;
}

var defaultCurveSegments = 200;

function rafFactory() {
  // if (typeof requestAnimationFrame !== 'undefined') return requestAnimationFrame;
  var lastTime = Date.now();
  return function Raf(callback) {
    var currTime = Date.now();
    // pref：优化js密集计算 资源竞争恶性循环
    var timeToCall = Math.max(0, 16 + (currTime - lastTime));
    // let timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

var raf = rafFactory();

function createSizedArray(len) {
  return Array.apply(null, {
    length: len
  });
}

function createTypedArray(type, len) {
  if (type === 'float32') {
    return new Float32Array(len);
  } else if (type === 'int16') {
    return new Int16Array(len);
  } else if (type === 'uint8c') {
    return new Uint8ClampedArray(len);
  }
  return null;
}

function createTag(type) {
  var tag = {};
  switch (type) {
    case 'canvas':
      tag.getContext = function () {
        // TODO: get temp canvas
      };
      return tag;
    default:
      return tag;
  }
}

function randomString(length, chars) {
  if (chars === undefined) {
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  }
  var i = void 0;
  var result = '';
  for (i = length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }return result;
}

var subframeEnabled = true;

function getDescriptor(object, prop) {
  return Object.getOwnPropertyDescriptor(object, prop);
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var BaseEvent = function () {
  function BaseEvent() {
    classCallCheck(this, BaseEvent);
  }

  createClass(BaseEvent, [{
    key: "triggerEvent",
    value: function triggerEvent(eventName, args) {
      if (this._cbs[eventName]) {
        var len = this._cbs[eventName].length;
        for (var i = 0; i < len; i++) {
          this._cbs[eventName][i](args);
        }
      }
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(eventName, callback) {
      if (!this._cbs[eventName]) {
        this._cbs[eventName] = [];
      }
      this._cbs[eventName].push(callback);

      return function () {
        this.removeEventListener(eventName, callback);
      }.bind(this);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(eventName, callback) {
      if (!callback) {
        this._cbs[eventName] = null;
      } else if (this._cbs[eventName]) {
        var i = 0;
        var len = this._cbs[eventName].length;
        while (i < len) {
          if (this._cbs[eventName][i] === callback) {
            this._cbs[eventName].splice(i, 1);
            i -= 1;
            len -= 1;
          }
          i += 1;
        }
        if (!this._cbs[eventName].length) {
          this._cbs[eventName] = null;
        }
      }
    }
  }]);
  return BaseEvent;
}();

var _cos = Math.cos;
var _sin = Math.sin;
var _tan = Math.tan;
var _rnd = Math.round;

var Matrix = function () {
  function Matrix() {
    classCallCheck(this, Matrix);

    this._identity = true;
    this._identityCalculated = false;
    this.props = new Float32Array(16);
    this.reset();
  }

  createClass(Matrix, [{
    key: 'reset',
    value: function reset() {
      this.props[0] = 1;
      this.props[1] = 0;
      this.props[2] = 0;
      this.props[3] = 0;
      this.props[4] = 0;
      this.props[5] = 1;
      this.props[6] = 0;
      this.props[7] = 0;
      this.props[8] = 0;
      this.props[9] = 0;
      this.props[10] = 1;
      this.props[11] = 0;
      this.props[12] = 0;
      this.props[13] = 0;
      this.props[14] = 0;
      this.props[15] = 1;
      return this;
    }
  }, {
    key: 'rotate',
    value: function rotate(angle) {
      if (angle === 0) {
        return this;
      }
      var mCos = _cos(angle);
      var mSin = _sin(angle);
      return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
  }, {
    key: 'rotateX',
    value: function rotateX(angle) {
      if (angle === 0) {
        return this;
      }
      var mCos = _cos(angle);
      var mSin = _sin(angle);
      return this._t(1, 0, 0, 0, 0, mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1);
    }
  }, {
    key: 'rotateY',
    value: function rotateY(angle) {
      if (angle === 0) {
        return this;
      }
      var mCos = _cos(angle);
      var mSin = _sin(angle);
      return this._t(mCos, 0, mSin, 0, 0, 1, 0, 0, -mSin, 0, mCos, 0, 0, 0, 0, 1);
    }
  }, {
    key: 'rotateZ',
    value: function rotateZ(angle) {
      if (angle === 0) {
        return this;
      }
      var mCos = _cos(angle);
      var mSin = _sin(angle);
      return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
  }, {
    key: 'shear',
    value: function shear(sx, sy) {
      return this._t(1, sy, sx, 1, 0, 0);
    }
  }, {
    key: 'skew',
    value: function skew(ax, ay) {
      return this.shear(_tan(ax), _tan(ay));
    }
  }, {
    key: 'skewFromAxis',
    value: function skewFromAxis(ax, angle) {
      var mCos = _cos(angle);
      var mSin = _sin(angle);
      return this._t(mCos, mSin, 0, 0, -mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, _tan(ax), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      // return this._t(mCos, mSin, -mSin, mCos, 0, 0)._t(1, 0, _tan(ax), 1, 0, 0)._t(mCos, -mSin, mSin, mCos, 0, 0);
    }
  }, {
    key: 'scale',
    value: function scale(sx, sy, sz) {
      sz = isNaN(sz) ? 1 : sz;
      if (sx === 1 && sy === 1 && sz === 1) {
        return this;
      }
      return this._t(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1);
    }
  }, {
    key: 'setTransform',
    value: function setTransform(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      this.props[0] = a;
      this.props[1] = b;
      this.props[2] = c;
      this.props[3] = d;
      this.props[4] = e;
      this.props[5] = f;
      this.props[6] = g;
      this.props[7] = h;
      this.props[8] = i;
      this.props[9] = j;
      this.props[10] = k;
      this.props[11] = l;
      this.props[12] = m;
      this.props[13] = n;
      this.props[14] = o;
      this.props[15] = p;
      return this;
    }
  }, {
    key: 'translate',
    value: function translate(tx, ty, tz) {
      tz = tz || 0;
      if (tx !== 0 || ty !== 0 || tz !== 0) {
        return this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1);
      }
      return this;
    }
  }, {
    key: 'transform',
    value: function transform(a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2, m2, n2, o2, p2) {
      var _p = this.props;

      if (a2 === 1 && b2 === 0 && c2 === 0 && d2 === 0 && e2 === 0 && f2 === 1 && g2 === 0 && h2 === 0 && i2 === 0 && j2 === 0 && k2 === 1 && l2 === 0) {
        // NOTE: commenting this condition because TurboFan deoptimizes code when present
        // if(m2 !== 0 || n2 !== 0 || o2 !== 0){
        _p[12] = _p[12] * a2 + _p[15] * m2;
        _p[13] = _p[13] * f2 + _p[15] * n2;
        _p[14] = _p[14] * k2 + _p[15] * o2;
        _p[15] *= p2;
        // }
        this._identityCalculated = false;
        return this;
      }

      var a1 = _p[0];
      var b1 = _p[1];
      var c1 = _p[2];
      var d1 = _p[3];
      var e1 = _p[4];
      var f1 = _p[5];
      var g1 = _p[6];
      var h1 = _p[7];
      var i1 = _p[8];
      var j1 = _p[9];
      var k1 = _p[10];
      var l1 = _p[11];
      var m1 = _p[12];
      var n1 = _p[13];
      var o1 = _p[14];
      var p1 = _p[15];

      /* matrix order (canvas compatible):
       * ace
       * bdf
       * 001
       */
      _p[0] = a1 * a2 + b1 * e2 + c1 * i2 + d1 * m2;
      _p[1] = a1 * b2 + b1 * f2 + c1 * j2 + d1 * n2;
      _p[2] = a1 * c2 + b1 * g2 + c1 * k2 + d1 * o2;
      _p[3] = a1 * d2 + b1 * h2 + c1 * l2 + d1 * p2;

      _p[4] = e1 * a2 + f1 * e2 + g1 * i2 + h1 * m2;
      _p[5] = e1 * b2 + f1 * f2 + g1 * j2 + h1 * n2;
      _p[6] = e1 * c2 + f1 * g2 + g1 * k2 + h1 * o2;
      _p[7] = e1 * d2 + f1 * h2 + g1 * l2 + h1 * p2;

      _p[8] = i1 * a2 + j1 * e2 + k1 * i2 + l1 * m2;
      _p[9] = i1 * b2 + j1 * f2 + k1 * j2 + l1 * n2;
      _p[10] = i1 * c2 + j1 * g2 + k1 * k2 + l1 * o2;
      _p[11] = i1 * d2 + j1 * h2 + k1 * l2 + l1 * p2;

      _p[12] = m1 * a2 + n1 * e2 + o1 * i2 + p1 * m2;
      _p[13] = m1 * b2 + n1 * f2 + o1 * j2 + p1 * n2;
      _p[14] = m1 * c2 + n1 * g2 + o1 * k2 + p1 * o2;
      _p[15] = m1 * d2 + n1 * h2 + o1 * l2 + p1 * p2;

      this._identityCalculated = false;
      return this;
    }
  }, {
    key: 'isIdentity',
    value: function isIdentity() {
      var props = this.props;
      if (!this._identityCalculated) {
        this._identity = !(props[0] !== 1 || props[1] !== 0 || props[2] !== 0 || props[3] !== 0 || props[4] !== 0 || props[5] !== 1 || props[6] !== 0 || props[7] !== 0 || props[8] !== 0 || props[9] !== 0 || props[10] !== 1 || props[11] !== 0 || props[12] !== 0 || props[13] !== 0 || props[14] !== 0 || props[15] !== 1);
        this._identityCalculated = true;
      }
      return this._identity;
    }
  }, {
    key: 'equals',
    value: function equals(matr) {
      var i = 0;
      var props = this.props;
      while (i < 16) {
        if (matr.props[i] !== props[i]) {
          return false;
        }
        i += 1;
      }
      return true;
    }
  }, {
    key: 'clone',
    value: function clone(matr) {
      var i = void 0;
      var props = this.props;
      for (i = 0; i < 16; i += 1) {
        matr.props[i] = props[i];
      }
    }
  }, {
    key: 'cloneFromProps',
    value: function cloneFromProps(props) {
      var i = void 0;
      for (i = 0; i < 16; i += 1) {
        this.props[i] = props[i];
      }
    }
  }, {
    key: 'applyToPoint',
    value: function applyToPoint(x, y, z) {
      var props = this.props;
      return {
        x: x * props[0] + y * props[4] + z * props[8] + props[12],
        y: x * props[1] + y * props[5] + z * props[9] + props[13],
        z: x * props[2] + y * props[6] + z * props[10] + props[14]
      };
      /* return {
       x: x * me.a + y * me.c + me.e,
       y: x * me.b + y * me.d + me.f
       }; */
    }
  }, {
    key: 'applyToX',
    value: function applyToX(x, y, z) {
      var props = this.props;
      return x * props[0] + y * props[4] + z * props[8] + props[12];
    }
  }, {
    key: 'applyToY',
    value: function applyToY(x, y, z) {
      var props = this.props;
      return x * props[1] + y * props[5] + z * props[9] + props[13];
    }
  }, {
    key: 'applyToZ',
    value: function applyToZ(x, y, z) {
      var props = this.props;
      return x * props[2] + y * props[6] + z * props[10] + props[14];
    }
  }, {
    key: 'inversePoint',
    value: function inversePoint(pt) {
      var props = this.props;
      var determinant = props[0] * props[5] - props[1] * props[4];
      var a = props[5] / determinant;
      var b = -props[1] / determinant;
      var c = -props[4] / determinant;
      var d = props[0] / determinant;
      var e = (props[4] * props[13] - props[5] * props[12]) / determinant;
      var f = -(props[0] * props[13] - props[1] * props[12]) / determinant;
      return [pt[0] * a + pt[1] * c + e, pt[0] * b + pt[1] * d + f, 0];
    }
  }, {
    key: 'inversePoints',
    value: function inversePoints(pts) {
      var i = void 0;
      var len = pts.length;
      var retPts = [];
      for (i = 0; i < len; i += 1) {
        retPts[i] = this.inversePoint(pts[i]);
      }
      return retPts;
    }
  }, {
    key: 'applyToTriplePoints',
    value: function applyToTriplePoints(pt1, pt2, pt3) {
      var arr = createTypedArray('float32', 6);
      if (this.isIdentity()) {
        arr[0] = pt1[0];
        arr[1] = pt1[1];
        arr[2] = pt2[0];
        arr[3] = pt2[1];
        arr[4] = pt3[0];
        arr[5] = pt3[1];
      } else {
        var props = this.props;
        var p0 = props[0];
        var p1 = props[1];
        var p4 = props[4];
        var p5 = props[5];
        var p12 = props[12];
        var p13 = props[13];
        arr[0] = pt1[0] * p0 + pt1[1] * p4 + p12;
        arr[1] = pt1[0] * p1 + pt1[1] * p5 + p13;
        arr[2] = pt2[0] * p0 + pt2[1] * p4 + p12;
        arr[3] = pt2[0] * p1 + pt2[1] * p5 + p13;
        arr[4] = pt3[0] * p0 + pt3[1] * p4 + p12;
        arr[5] = pt3[0] * p1 + pt3[1] * p5 + p13;
      }
      return arr;
    }
  }, {
    key: 'applyToPointArray',
    value: function applyToPointArray(x, y, z) {
      var arr = void 0;
      if (this.isIdentity()) {
        arr = [x, y, z];
      } else {
        var props = this.props;
        arr = [x * props[0] + y * props[4] + z * props[8] + props[12], x * props[1] + y * props[5] + z * props[9] + props[13], x * props[2] + y * props[6] + z * props[10] + props[14]];
      }
      return arr;
    }
  }, {
    key: 'applyToPointStringified',
    value: function applyToPointStringified(x, y) {
      if (this.isIdentity()) {
        return x + ',' + y;
      }
      var _p = this.props;
      return Math.round((x * _p[0] + y * _p[4] + _p[12]) * 100) / 100 + ',' + Math.round((x * _p[1] + y * _p[5] + _p[13]) * 100) / 100;
    }
  }, {
    key: 'toCSS',
    value: function toCSS() {
      // Doesn't make much sense to add this optimization. If it is an identity matrix, it's very likely this will get called only once since it won't be keyframed.
      /* if(this.isIdentity()) {
          return '';
      } */
      var i = 0;
      var props = this.props;
      var cssValue = 'matrix3d(';
      var v = 10000;
      while (i < 16) {
        cssValue += _rnd(props[i] * v) / v;
        cssValue += i === 15 ? ')' : ',';
        i += 1;
      }
      return cssValue;
    }
  }, {
    key: 'roundMatrixProperty',
    value: function roundMatrixProperty(val) {
      var v = 10000;
      if (val < 0.000001 && val > 0 || val > -0.000001 && val < 0) {
        return _rnd(val * v) / v;
      }
      return val;
    }
  }, {
    key: 'to2dCSS',
    value: function to2dCSS() {
      // Doesn't make much sense to add this optimization. If it is an identity matrix, it's very likely this will get called only once since it won't be keyframed.
      /* if(this.isIdentity()) {
          return '';
      } */
      var props = this.props;
      var roundMatrixProperty = this.roundMatrixProperty;
      var _a = roundMatrixProperty(props[0]);
      var _b = roundMatrixProperty(props[1]);
      var _c = roundMatrixProperty(props[4]);
      var _d = roundMatrixProperty(props[5]);
      var _e = roundMatrixProperty(props[12]);
      var _f = roundMatrixProperty(props[13]);
      return 'matrix(' + _a + ',' + _b + ',' + _c + ',' + _d + ',' + _e + ',' + _f + ')';
    }
  }, {
    key: '_t',
    value: function _t() {
      return this.transform.apply(this, arguments);
    }
  }]);
  return Matrix;
}();

var CVContextData = function () {
  function CVContextData() {
    classCallCheck(this, CVContextData);

    this.saved = [];
    this.cArrPos = 0;
    this.cTr = new Matrix();
    this.cO = 1;
    var i = void 0;
    var len = 15;
    this.savedOp = new Float32Array(len);
    for (i = 0; i < len; i += 1) {
      this.saved[i] = new Float32Array(16);
    }
    this._length = len;
  }

  createClass(CVContextData, [{
    key: 'duplicate',
    value: function duplicate() {
      var newLength = this._length * 2;
      var currentSavedOp = this.savedOp;
      this.savedOp = new Float32Array(newLength);
      this.savedOp.set(currentSavedOp);
      var i = 0;
      for (i = this._length; i < newLength; i += 1) {
        this.saved[i] = new Float32Array(16);
      }
      this._length = newLength;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.cArrPos = 0;
      this.cTr.reset();
      this.cO = 1;
    }
  }]);
  return CVContextData;
}();

/* eslint-disable vars-on-top */
var emptyChar = {
  w: 0,
  size: 0,
  shapes: []
};
var combinedCharacters = [];
// Hindi characters
combinedCharacters = combinedCharacters.concat([2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403]);

var Font = function () {
  function Font() {
    classCallCheck(this, Font);

    this.fonts = [];
    this.chars = null;
    this.typekitLoaded = 0;
    this.isLoaded = false;
    this.initTime = Date.now();
  }

  createClass(Font, [{
    key: 'addChars',
    value: function addChars(chars) {
      if (!chars) {
        return;
      }
      if (!this.chars) {
        this.chars = [];
      }
      var i;
      var len = chars.length;
      var j;
      var jLen = this.chars.length;
      var found;

      for (i = 0; i < len; i += 1) {
        j = 0;
        found = false;
        while (j < jLen) {
          if (this.chars[j].style === chars[i].style && this.chars[j].fFamily === chars[i].fFamily && this.chars[j].ch === chars[i].ch) {
            found = true;
          }
          j += 1;
        }
        if (!found) {
          this.chars.push(chars[i]);
          jLen += 1;
        }
      }
    }
  }, {
    key: 'addFonts',
    value: function addFonts(fontData) /* defs */{
      if (!fontData) {
        this.isLoaded = true;
        return;
      }
      if (this.chars) {
        this.isLoaded = true;
        this.fonts = fontData.list;
        return;
      }

      var fontArr = fontData.list;
      var i = void 0;
      var len = fontArr.length;
      var _pendingFonts = len;
      for (i = 0; i < len; i += 1) {
        var shouldLoadFont = true;
        fontArr[i].loaded = false;
        fontArr[i].monoCase = this.setUpNode(fontArr[i].fFamily, 'monospace');
        fontArr[i].sansCase = this.setUpNode(fontArr[i].fFamily, 'sans-serif');
        if (!fontArr[i].fPath) {
          fontArr[i].loaded = true;
          _pendingFonts -= 1;
        } else if (fontArr[i].fOrigin === 'p' || fontArr[i].origin === 3) {
          if (shouldLoadFont) {
            if (wx.loadFontFace) {
              wx.loadFontFace({
                family: fontArr[i].fFamily,
                source: fontArr[i].fPath,
                fail: function fail(e) {
                  console.error(e);
                }
              });
            } else {
              console.warn('下载字体文件方法：wx.loadFontFace 基础库 2.1.0 开始支持');
            }
          }
        } else if (fontArr[i].fOrigin === 't' || fontArr[i].origin === 2) {
          console.warn('not support');
          // Font is already loaded
          shouldLoadFont = false;
        }

        // fontArr[i].helper = createHelper(defs, fontArr[i]);
        fontArr[i].cache = {};
        this.fonts.push(fontArr[i]);
      }

      if (_pendingFonts === 0) {
        this.isLoaded = true;
      } else {
        // On some cases even if the font is loaded, it won't load correctly when measuring text on canvas.
        // Adding this timeout seems to fix it
        setTimeout(this.checkLoadedFonts.bind(this), 100);
      }
    }
  }, {
    key: 'setUpNode',
    value: function setUpNode(font, family) {
      console.log(font, family);
    }
  }, {
    key: 'checkLoadedFonts',
    value: function checkLoadedFonts() {
      // ignore
    }
  }, {
    key: 'getCharData',
    value: function getCharData(char, style, font) {
      var i = 0;
      var len = this.chars.length;
      while (i < len) {
        if (this.chars[i].ch === char && this.chars[i].style === style && this.chars[i].fFamily === font) {
          return this.chars[i];
        }
        i += 1;
      }
      if (console.warn) {
        console.warn('Missing character from exported characters list: ', char, style, font);
      }
      return emptyChar;
    }
  }, {
    key: 'getFontByName',
    value: function getFontByName(name) {
      var i = 0;
      var len = this.fonts.length;
      while (i < len) {
        if (this.fonts[i].fName === name) {
          return this.fonts[i];
        }
        i += 1;
      }
      return this.fonts[0];
    }
  }, {
    key: 'measureText',
    value: function measureText() /* char, fontName, size */{
      return 0;
    }
  }, {
    key: 'loaded',
    value: function loaded() {
      return this.isLoaded;
    }
  }], [{
    key: 'getCombinedCharacterCodes',
    value: function getCombinedCharacterCodes() {
      return combinedCharacters;
    }
  }]);
  return Font;
}();

var BaseRenderer = function () {
  function BaseRenderer() {
    classCallCheck(this, BaseRenderer);
  }

  createClass(BaseRenderer, [{
    key: 'checkLayers',
    value: function checkLayers(num) {
      var i = void 0;
      var len = this.layers.length;
      var data = void 0;
      this.completeLayers = true;
      for (i = len - 1; i >= 0; i--) {
        if (!this.elements[i]) {
          data = this.layers[i];
          if (data.ip - data.st <= num - this.layers[i].st && data.op - data.st > num - this.layers[i].st) {
            this.buildItem(i);
          }
        }
        this.completeLayers = this.elements[i] ? this.completeLayers : false;
      }
      this.checkPendingElements();
    }
  }, {
    key: 'createItem',
    value: function createItem(layer) {
      switch (layer.ty) {
        case 2:
          return this.createImage(layer);
        case 0:
          return this.createComp(layer);
        case 1:
          return this.createSolid(layer);
        case 3:
          return this.createNull(layer);
        case 4:
          return this.createShape(layer);
        case 5:
          return this.createText(layer);
        case 13:
          return this.createCamera(layer);
        default:
          break;
      }
      return this.createNull(layer);
    }
  }, {
    key: 'createCamera',
    value: function createCamera() {
      throw new Error('You\'re using a 3d camera. Try the html renderer.');
    }
  }, {
    key: 'buildAllItems',
    value: function buildAllItems() {
      var i = void 0;
      var len = this.layers.length;
      for (i = 0; i < len; i += 1) {
        this.buildItem(i);
      }
      this.checkPendingElements();
    }
  }, {
    key: 'includeLayers',
    value: function includeLayers(newLayers) {
      this.completeLayers = false;
      var i = void 0;
      var len = newLayers.length;
      var j = void 0;
      var jLen = this.layers.length;
      for (i = 0; i < len; i += 1) {
        j = 0;
        while (j < jLen) {
          if (this.layers[j].id === newLayers[i].id) {
            this.layers[j] = newLayers[i];
            break;
          }
          j += 1;
        }
      }
    }
  }, {
    key: 'setProjectInterface',
    value: function setProjectInterface(pInterface) {
      this.globalData.projectInterface = pInterface;
    }
  }, {
    key: 'initItems',
    value: function initItems() {
      if (!this.globalData.progressiveLoad) {
        this.buildAllItems();
      }
    }
  }, {
    key: 'buildElementParenting',
    value: function buildElementParenting(element, parentName, hierarchy) {
      var elements = this.elements;
      var layers = this.layers;
      var i = 0;
      var len = layers.length;
      while (i < len) {
        if (layers[i].ind === parentName) {
          if (!elements[i] || elements[i] === true) {
            this.buildItem(i);
            this.addPendingElement(element);
          } else {
            hierarchy.push(elements[i]);
            elements[i].setAsParent();
            if (layers[i].parent !== undefined) {
              this.buildElementParenting(element, layers[i].parent, hierarchy);
            } else {
              element.setHierarchy(hierarchy);
            }
          }
        }
        i += 1;
      }
    }
  }, {
    key: 'addPendingElement',
    value: function addPendingElement(element) {
      this.pendingElements.push(element);
    }
  }, {
    key: 'searchExtraCompositions',
    value: function searchExtraCompositions(assets) {
      var i = void 0;
      var len = assets.length;
      for (i = 0; i < len; i += 1) {
        if (assets[i].xt) {
          var comp = this.createComp(assets[i]);
          comp.initExpressions();
          this.globalData.projectInterface.registerComposition(comp);
        }
      }
    }
  }, {
    key: 'setupGlobalData',
    value: function setupGlobalData(animData, fontsContainer) {
      this.globalData.fontManager = new Font();
      this.globalData.fontManager.addChars(animData.chars);
      this.globalData.fontManager.addFonts(animData.fonts, fontsContainer);
      this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem);
      this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem);
      this.globalData.elementLoaded = this.animationItem.elementLoaded.bind(this.animationItem);
      this.globalData.addPendingElement = this.animationItem.addPendingElement.bind(this.animationItem);
      this.globalData.frameId = 0;
      this.globalData.frameRate = animData.fr;
      this.globalData.nm = animData.nm;
      this.globalData.compSize = {
        w: animData.w,
        h: animData.h
      };
    }
  }]);
  return BaseRenderer;
}();

function Mixin(baseClass) {
  for (var _len = arguments.length, mixins = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    mixins[_key - 1] = arguments[_key];
  }

  var copyProps = function copyProps(target, source) {
    // this function copies all properties and symbols, filtering out some special ones
    Object.getOwnPropertyNames(source)
    // .concat(Object.getOwnPropertySymbols(source))
    .forEach(function (prop) {
      try {
        if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
          Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  var base = function (_baseClass) {
    inherits(base, _baseClass);

    function base() {
      var _ref;

      classCallCheck(this, base);

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var _this = possibleConstructorReturn(this, (_ref = base.__proto__ || Object.getPrototypeOf(base)).call.apply(_ref, [this].concat(args)));

      mixins.forEach(function (mixin) {
        var mixinConstructor = new mixin();
        copyProps(_this, mixinConstructor);
      });
      return _this;
    }

    return base;
  }(baseClass);

  mixins.forEach(function (mixin) {
    // outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
    var proto = mixin.prototype.__proto__;
    while (proto && proto.constructor !== Object) {
      copyProps(base.prototype, proto);
      proto = proto.__proto__;
    }

    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });

  return base;
}

var beziers = {};

// These values are established by empiricism with tests (tradeoff: performance VS precision)
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === 'function';

function A(aA1, aA2) {
  return 1.0 - 3.0 * aA2 + 3.0 * aA1;
}
function B(aA1, aA2) {
  return 3.0 * aA2 - 6.0 * aA1;
}
function C(aA1) {
  return 3.0 * aA1;
}

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier(aT, aA1, aA2) {
  return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
}

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope(aT, aA1, aA2) {
  return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
}

function binarySubdivide(aX, aA, aB, mX1, mX2) {
  var currentX = void 0;
  var currentT = void 0;
  var i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
  for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
    var currentSlope = getSlope(aGuessT, mX1, mX2);
    if (+currentSlope === 0) return aGuessT;
    var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }
  return aGuessT;
}

/**
 * points is an array of [ mX1, mY1, mX2, mY2 ]
 */
function BezierEasing(points) {
  this._p = points;
  this._mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  this._precomputed = false;

  this.get = this.get.bind(this);
}

BezierEasing.prototype = {

  get: function get(x) {
    var mX1 = this._p[0];
    var mY1 = this._p[1];
    var mX2 = this._p[2];
    var mY2 = this._p[3];
    if (!this._precomputed) this._precompute();
    if (mX1 === mY1 && mX2 === mY2) return x; // linear
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) return 0;
    if (x === 1) return 1;
    return calcBezier(this._getTForX(x), mY1, mY2);
  },

  // Private part

  _precompute: function _precompute() {
    var mX1 = this._p[0];
    var mY1 = this._p[1];
    var mX2 = this._p[2];
    var mY2 = this._p[3];
    this._precomputed = true;
    if (mX1 !== mY1 || mX2 !== mY2) {
      this._calcSampleValues();
    }
  },

  _calcSampleValues: function _calcSampleValues() {
    var mX1 = this._p[0];
    var mX2 = this._p[2];
    for (var i = 0; i < kSplineTableSize; ++i) {
      this._mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }
  },

  /**
   * getTForX chose the fastest heuristic to determine the percentage value precisely from a given X projection.
   */
  _getTForX: function _getTForX(aX) {
    var mX1 = this._p[0];
    var mX2 = this._p[2];
    var mSampleValues = this._mSampleValues;

    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;

    var initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    }
    return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
  }
};

function getBezierEasing(a, b, c, d, nm) {
  var str = nm || ('bez_' + a + '_' + b + '_' + c + '_' + d).replace(/\./g, 'p');
  if (beziers[str]) {
    return beziers[str];
  }
  var bezEasing = new BezierEasing([a, b, c, d]);
  beziers[str] = bezEasing;
  return bezEasing;
}

var ob = {};
ob.getBezierEasing = getBezierEasing;

function double(arr) {
  return arr.concat(createSizedArray(arr.length));
}

var pooling = {
  double: double
};

function pool_factory (initialLength, _create, _release, _clone) {
  var _length = 0;
  var _maxLength = initialLength;
  var pool = createSizedArray(_maxLength);

  function newElement() {
    var element = void 0;
    if (_length) {
      _length -= 1;
      element = pool[_length];
    } else {
      element = _create();
    }
    return element;
  }

  function release(element) {
    if (_length === _maxLength) {
      pool = pooling.double(pool);
      _maxLength *= 2;
    }
    if (_release) {
      _release(element);
    }
    pool[_length] = element;
    _length += 1;
  }

  function clone() {
    var clonedElement = newElement();
    return _clone(clonedElement);
  }

  return {
    clone: clone,
    newElement: newElement,
    release: release
  };
}

function create() {
  return createTypedArray('float32', 2);
}

var point_pool = pool_factory(8, create);

var ShapePath = function () {
  function ShapePath() {
    classCallCheck(this, ShapePath);

    this.c = false;
    this._length = 0;
    this._maxLength = 8;
    this.v = createSizedArray(this._maxLength);
    this.o = createSizedArray(this._maxLength);
    this.i = createSizedArray(this._maxLength);
  }

  createClass(ShapePath, [{
    key: 'setPathData',
    value: function setPathData(closed, len) {
      this.c = closed;
      this.setLength(len);
      var i = 0;
      while (i < len) {
        this.v[i] = point_pool.newElement();
        this.o[i] = point_pool.newElement();
        this.i[i] = point_pool.newElement();
        i += 1;
      }
    }
  }, {
    key: 'setLength',
    value: function setLength(len) {
      while (this._maxLength < len) {
        this.doubleArrayLength();
      }
      this._length = len;
    }
  }, {
    key: 'doubleArrayLength',
    value: function doubleArrayLength() {
      this.v = this.v.concat(createSizedArray(this._maxLength));
      this.i = this.i.concat(createSizedArray(this._maxLength));
      this.o = this.o.concat(createSizedArray(this._maxLength));
      this._maxLength *= 2;
    }
  }, {
    key: 'setXYAt',
    value: function setXYAt(x, y, type, pos, replace) {
      var arr = void 0;
      this._length = Math.max(this._length, pos + 1);
      if (this._length >= this._maxLength) {
        this.doubleArrayLength();
      }
      switch (type) {
        case 'v':
          arr = this.v;
          break;
        case 'i':
          arr = this.i;
          break;
        case 'o':
          arr = this.o;
          break;
        default:
          break;
      }
      if (!arr[pos] || arr[pos] && !replace) {
        arr[pos] = point_pool.newElement();
      }
      arr[pos][0] = x;
      arr[pos][1] = y;
    }
  }, {
    key: 'setTripleAt',
    value: function setTripleAt(vX, vY, oX, oY, iX, iY, pos, replace) {
      this.setXYAt(vX, vY, 'v', pos, replace);
      this.setXYAt(oX, oY, 'o', pos, replace);
      this.setXYAt(iX, iY, 'i', pos, replace);
    }
  }, {
    key: 'reverse',
    value: function reverse() {
      var newPath = new ShapePath();
      newPath.setPathData(this.c, this._length);
      var vertices = this.v;
      var outPoints = this.o;
      var inPoints = this.i;
      var init = 0;
      if (this.c) {
        newPath.setTripleAt(vertices[0][0], vertices[0][1], inPoints[0][0], inPoints[0][1], outPoints[0][0], outPoints[0][1], 0, false);
        init = 1;
      }
      var cnt = this._length - 1;
      var len = this._length;

      var i = void 0;
      for (i = init; i < len; i += 1) {
        newPath.setTripleAt(vertices[cnt][0], vertices[cnt][1], inPoints[cnt][0], inPoints[cnt][1], outPoints[cnt][0], outPoints[cnt][1], i, false);
        cnt -= 1;
      }
      return newPath;
    }
  }]);
  return ShapePath;
}();

function create$1() {
  return new ShapePath();
}

function release(shapePath) {
  var len = shapePath._length;
  var i = void 0;
  for (i = 0; i < len; i += 1) {
    point_pool.release(shapePath.v[i]);
    point_pool.release(shapePath.i[i]);
    point_pool.release(shapePath.o[i]);
    shapePath.v[i] = null;
    shapePath.i[i] = null;
    shapePath.o[i] = null;
  }
  shapePath._length = 0;
  shapePath.c = false;
}

var factory = pool_factory(4, create$1, release);
factory.clone = function clone(shape) {
  var cloned = factory.newElement();
  var i = void 0;
  var len = shape._length === undefined ? shape.v.length : shape._length;
  cloned.setLength(len);
  cloned.c = shape.c;
  // let pt;

  for (i = 0; i < len; i += 1) {
    cloned.setTripleAt(shape.v[i][0], shape.v[i][1], shape.o[i][0], shape.o[i][1], shape.i[i][0], shape.i[i][1], i);
  }
  return cloned;
};

var bm_pow = Math.pow;
var bm_sqrt = Math.sqrt;
var bm_floor = Math.floor;
var bm_min = Math.min;
var roundCorner = 0.5519;

function RGBtoHSV(r, g, b) {
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var d = max - min;
  var h = void 0;
  var s = max === 0 ? 0 : d / max;
  var v = max / 255;

  switch (max) {
    case min:
      h = 0;break;
    case r:
      h = g - b + d * (g < b ? 6 : 0);h /= 6 * d;break;
    case g:
      h = b - r + d * 2;h /= 6 * d;break;
    case b:
      h = r - g + d * 4;h /= 6 * d;break;
    default:
      break;
  }

  return [h, s, v];
}

function HSVtoRGB(h, s, v) {
  var r = void 0;
  var g = void 0;
  var b = void 0;
  var i = void 0;
  var f = void 0;
  var p = void 0;
  var q = void 0;
  var t = void 0;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v;g = t;b = p;break;
    case 1:
      r = q;g = v;b = p;break;
    case 2:
      r = p;g = v;b = t;break;
    case 3:
      r = p;g = q;b = v;break;
    case 4:
      r = t;g = p;b = v;break;
    case 5:
      r = v;g = p;b = q;break;
    default:
      break;
  }
  return [r, g, b];
}

function addHueToRGB(color, offset) {
  var hsv = RGBtoHSV(color[0] * 255, color[1] * 255, color[2] * 255);
  hsv[0] += offset / 360;
  if (hsv[0] > 1) {
    hsv[0] -= 1;
  } else if (hsv[0] < 0) {
    hsv[0] += 1;
  }
  return HSVtoRGB(hsv[0], hsv[1], hsv[2]);
}

function addSaturationToRGB(color, offset) {
  var hsv = RGBtoHSV(color[0] * 255, color[1] * 255, color[2] * 255);
  hsv[1] += offset;
  if (hsv[1] > 1) {
    hsv[1] = 1;
  } else if (hsv[1] <= 0) {
    hsv[1] = 0;
  }
  return HSVtoRGB(hsv[0], hsv[1], hsv[2]);
}

function addBrightnessToRGB(color, offset) {
  var hsv = RGBtoHSV(color[0] * 255, color[1] * 255, color[2] * 255);
  hsv[2] += offset;
  if (hsv[2] > 1) {
    hsv[2] = 1;
  } else if (hsv[2] < 0) {
    hsv[2] = 0;
  }
  return HSVtoRGB(hsv[0], hsv[1], hsv[2]);
}

function BMEnterFrameEvent(n, c, t, d) {
  this.type = n;
  this.currentTime = c;
  this.totalTime = t;
  this.direction = d < 0 ? -1 : 1;
}

function BMCompleteEvent(n, d) {
  this.type = n;
  this.direction = d < 0 ? -1 : 1;
}

function BMCompleteLoopEvent(n, c, t, d) {
  this.type = n;
  this.currentLoop = t;
  this.totalLoops = c;
  this.direction = d < 0 ? -1 : 1;
}

function BMSegmentStartEvent(n, f, t) {
  this.type = n;
  this.firstFrame = f;
  this.totalFrames = t;
}

function BMDestroyEvent(n, t) {
  this.type = n;
  this.target = t;
}

// Reserved word lists for various dialects of the language

var reservedWords = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
};

// And the keywords

var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";

var keywords = {
  5: ecma5AndLessKeywords,
  6: ecma5AndLessKeywords + " const class extends export import super"
};

var keywordRelationalOperator = /^in(stanceof)?$/;

// ## Character categories

// Big ugly regular expressions that match characters in the
// whitespace, identifier, and identifier-start categories. These
// are only applied when a character is found to actually have a
// code point above 128.
// Generated by `bin/generate-identifier-regex.js`.

var nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
var nonASCIIidentifierChars = "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D4-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFB-\u1DFF\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA900-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F";

var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;

// These are a run-length and offset encoded representation of the
// >0xffff code points that are a valid part of identifiers. The
// offset starts at 0x10000, and each pair of numbers represents an
// offset to the next range, and then a size of the range. They were
// generated by bin/generate-identifier-regex.js

// eslint-disable-next-line comma-spacing
var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 17, 26, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 157, 310, 10, 21, 11, 7, 153, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 26, 45, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 785, 52, 76, 44, 33, 24, 27, 35, 42, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 54, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 86, 25, 391, 63, 32, 0, 449, 56, 264, 8, 2, 36, 18, 0, 50, 29, 881, 921, 103, 110, 18, 195, 2749, 1070, 4050, 582, 8634, 568, 8, 30, 114, 29, 19, 47, 17, 3, 32, 20, 6, 18, 881, 68, 12, 0, 67, 12, 65, 0, 32, 6124, 20, 754, 9486, 1, 3071, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 4149, 196, 60, 67, 1213, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42710, 42, 4148, 12, 221, 3, 5761, 10591, 541];

// eslint-disable-next-line comma-spacing
var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 1306, 2, 54, 14, 32, 9, 16, 3, 46, 10, 54, 9, 7, 2, 37, 13, 2, 9, 52, 0, 13, 2, 49, 13, 10, 2, 4, 9, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 57, 0, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 87, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 423, 9, 838, 7, 2, 7, 17, 9, 57, 21, 2, 13, 19882, 9, 135, 4, 60, 6, 26, 9, 1016, 45, 17, 3, 19723, 1, 5319, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 2214, 6, 110, 6, 6, 9, 792487, 239];

// This has a complexity linear to the value of the code. The
// assumption is that looking up astral identifier characters is
// rare.
function isInAstralSet(code, set$$1) {
  var pos = 0x10000;
  for (var i = 0; i < set$$1.length; i += 2) {
    pos += set$$1[i];
    if (pos > code) {
      return false;
    }
    pos += set$$1[i + 1];
    if (pos >= code) {
      return true;
    }
  }
}

// Test whether a given character code starts an identifier.

function isIdentifierStart(code, astral) {
  if (code < 65) {
    return code === 36;
  }
  if (code < 91) {
    return true;
  }
  if (code < 97) {
    return code === 95;
  }
  if (code < 123) {
    return true;
  }
  if (code <= 0xffff) {
    return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code, astralIdentifierStartCodes);
}

// Test whether a given character is part of an identifier.

function isIdentifierChar(code, astral) {
  if (code < 48) {
    return code === 36;
  }
  if (code < 58) {
    return true;
  }
  if (code < 65) {
    return false;
  }
  if (code < 91) {
    return true;
  }
  if (code < 97) {
    return code === 95;
  }
  if (code < 123) {
    return true;
  }
  if (code <= 0xffff) {
    return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
}

// ## Token types

// The assignment of fine-grained, information-carrying type objects
// allows the tokenizer to store the information it has about a
// token in a way that is very cheap for the parser to look up.

// All token type variables start with an underscore, to make them
// easy to recognize.

// The `beforeExpr` property is used to disambiguate between regular
// expressions and divisions. It is set on all token types that can
// be followed by an expression (thus, a slash after them would be a
// regular expression).
//
// The `startsExpr` property is used to check if the token ends a
// `yield` expression. It is set on all token types that either can
// directly start an expression (like a quotation mark) or can
// continue an expression (like the body of a string).
//
// `isLoop` marks a keyword as starting a loop, which is important
// to know when parsing a label, in order to allow or disallow
// continue jumps to that label.

var TokenType = function TokenType(label, conf) {
  if (conf === void 0) conf = {};

  this.label = label;
  this.keyword = conf.keyword;
  this.beforeExpr = !!conf.beforeExpr;
  this.startsExpr = !!conf.startsExpr;
  this.isLoop = !!conf.isLoop;
  this.isAssign = !!conf.isAssign;
  this.prefix = !!conf.prefix;
  this.postfix = !!conf.postfix;
  this.binop = conf.binop || null;
  this.updateContext = null;
};

function binop(name, prec) {
  return new TokenType(name, { beforeExpr: true, binop: prec });
}
var beforeExpr = { beforeExpr: true };
var startsExpr = { startsExpr: true };

// Map keyword names to token types.

var keywords$1 = {};

// Succinct definitions of keyword token types
function kw(name, options) {
  if (options === void 0) options = {};

  options.keyword = name;
  return keywords$1[name] = new TokenType(name, options);
}

var types = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  eof: new TokenType("eof"),

  // Punctuation token types.
  bracketL: new TokenType("[", { beforeExpr: true, startsExpr: true }),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", { beforeExpr: true, startsExpr: true }),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", { beforeExpr: true, startsExpr: true }),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  colon: new TokenType(":", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  invalidTemplate: new TokenType("invalidTemplate"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", { beforeExpr: true, startsExpr: true }),

  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.

  eq: new TokenType("=", { beforeExpr: true, isAssign: true }),
  assign: new TokenType("_=", { beforeExpr: true, isAssign: true }),
  incDec: new TokenType("++/--", { prefix: true, postfix: true, startsExpr: true }),
  prefix: new TokenType("!/~", { beforeExpr: true, prefix: true, startsExpr: true }),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=/===/!==", 6),
  relational: binop("</>/<=/>=", 7),
  bitShift: binop("<</>>/>>>", 8),
  plusMin: new TokenType("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  starstar: new TokenType("**", { beforeExpr: true }),

  // Keyword token types.
  _break: kw("break"),
  _case: kw("case", beforeExpr),
  _catch: kw("catch"),
  _continue: kw("continue"),
  _debugger: kw("debugger"),
  _default: kw("default", beforeExpr),
  _do: kw("do", { isLoop: true, beforeExpr: true }),
  _else: kw("else", beforeExpr),
  _finally: kw("finally"),
  _for: kw("for", { isLoop: true }),
  _function: kw("function", startsExpr),
  _if: kw("if"),
  _return: kw("return", beforeExpr),
  _switch: kw("switch"),
  _throw: kw("throw", beforeExpr),
  _try: kw("try"),
  _var: kw("var"),
  _const: kw("const"),
  _while: kw("while", { isLoop: true }),
  _with: kw("with"),
  _new: kw("new", { beforeExpr: true, startsExpr: true }),
  _this: kw("this", startsExpr),
  _super: kw("super", startsExpr),
  _class: kw("class", startsExpr),
  _extends: kw("extends", beforeExpr),
  _export: kw("export"),
  _import: kw("import"),
  _null: kw("null", startsExpr),
  _true: kw("true", startsExpr),
  _false: kw("false", startsExpr),
  _in: kw("in", { beforeExpr: true, binop: 7 }),
  _instanceof: kw("instanceof", { beforeExpr: true, binop: 7 }),
  _typeof: kw("typeof", { beforeExpr: true, prefix: true, startsExpr: true }),
  _void: kw("void", { beforeExpr: true, prefix: true, startsExpr: true }),
  _delete: kw("delete", { beforeExpr: true, prefix: true, startsExpr: true })
};

// Matches a whole line break (where CRLF is considered a single
// line break). Used to count lines.

var lineBreak = /\r\n?|\n|\u2028|\u2029/;
var lineBreakG = new RegExp(lineBreak.source, "g");

function isNewLine(code) {
  return code === 10 || code === 13 || code === 0x2028 || code === 0x2029;
}

var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;

var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;

var ref = Object.prototype;
var hasOwnProperty = ref.hasOwnProperty;
var toString = ref.toString;

// Checks if an object has a property.

function has(obj, propName) {
  return hasOwnProperty.call(obj, propName);
}

var isArray = Array.isArray || function (obj) {
  return toString.call(obj) === "[object Array]";
};

// These are used when `options.locations` is on, for the
// `startLoc` and `endLoc` properties.

var Position = function Position(line, col) {
  this.line = line;
  this.column = col;
};

Position.prototype.offset = function offset(n) {
  return new Position(this.line, this.column + n);
};

var SourceLocation = function SourceLocation(p, start, end) {
  this.start = start;
  this.end = end;
  if (p.sourceFile !== null) {
    this.source = p.sourceFile;
  }
};

// The `getLineInfo` function is mostly useful when the
// `locations` option is off (for performance reasons) and you
// want to find the line/column position for a given character
// offset. `input` should be the code string that the offset refers
// into.

function getLineInfo(input, offset) {
  for (var line = 1, cur = 0;;) {
    lineBreakG.lastIndex = cur;
    var match = lineBreakG.exec(input);
    if (match && match.index < offset) {
      ++line;
      cur = match.index + match[0].length;
    } else {
      return new Position(line, offset - cur);
    }
  }
}

// A second optional argument can be given to further configure
// the parser process. These options are recognized:

var defaultOptions = {
  // `ecmaVersion` indicates the ECMAScript version to parse. Must
  // be either 3, 5, 6 (2015), 7 (2016), or 8 (2017). This influences support
  // for strict mode, the set of reserved words, and support for
  // new syntax features. The default is 7.
  ecmaVersion: 7,
  // `sourceType` indicates the mode the code should be parsed in.
  // Can be either `"script"` or `"module"`. This influences global
  // strict mode and parsing of `import` and `export` declarations.
  sourceType: "script",
  // `onInsertedSemicolon` can be a callback that will be called
  // when a semicolon is automatically inserted. It will be passed
  // th position of the comma as an offset, and if `locations` is
  // enabled, it is given the location as a `{line, column}` object
  // as second argument.
  onInsertedSemicolon: null,
  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
  // trailing commas.
  onTrailingComma: null,
  // By default, reserved words are only enforced if ecmaVersion >= 5.
  // Set `allowReserved` to a boolean value to explicitly turn this on
  // an off. When this option has the value "never", reserved words
  // and keywords can also not be used as property names.
  allowReserved: null,
  // When enabled, a return at the top level is not considered an
  // error.
  allowReturnOutsideFunction: false,
  // When enabled, import/export statements are not constrained to
  // appearing at the top of the program.
  allowImportExportEverywhere: false,
  // When enabled, hashbang directive in the beginning of file
  // is allowed and treated as a line comment.
  allowHashBang: false,
  // When `locations` is on, `loc` properties holding objects with
  // `start` and `end` properties in `{line, column}` form (with
  // line being 1-based and column 0-based) will be attached to the
  // nodes.
  locations: false,
  // A function can be passed as `onToken` option, which will
  // cause Acorn to call that function with object in the same
  // format as tokens returned from `tokenizer().getToken()`. Note
  // that you are not allowed to call the parser from the
  // callback—that will corrupt its internal state.
  onToken: null,
  // A function can be passed as `onComment` option, which will
  // cause Acorn to call that function with `(block, text, start,
  // end)` parameters whenever a comment is skipped. `block` is a
  // boolean indicating whether this is a block (`/* */`) comment,
  // `text` is the content of the comment, and `start` and `end` are
  // character offsets that denote the start and end of the comment.
  // When the `locations` option is on, two more parameters are
  // passed, the full `{line, column}` locations of the start and
  // end of the comments. Note that you are not allowed to call the
  // parser from the callback—that will corrupt its internal state.
  onComment: null,
  // Nodes have their start and end characters offsets recorded in
  // `start` and `end` properties (directly on the node, rather than
  // the `loc` object, which holds line/column data. To also add a
  // [semi-standardized][range] `range` property holding a `[start,
  // end]` array with the same numbers, set the `ranges` option to
  // `true`.
  //
  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
  ranges: false,
  // It is possible to parse multiple files into a single AST by
  // passing the tree produced by parsing the first file as
  // `program` option in subsequent parses. This will add the
  // toplevel forms of the parsed file to the `Program` (top) node
  // of an existing parse tree.
  program: null,
  // When `locations` is on, you can pass this to record the source
  // file in every node's `loc` object.
  sourceFile: null,
  // This value, if given, is stored in every node, whether
  // `locations` is on or off.
  directSourceFile: null,
  // When enabled, parenthesized expressions are represented by
  // (non-standard) ParenthesizedExpression nodes
  preserveParens: false,
  plugins: {}
};

// Interpret and default an options object

function getOptions(opts) {
  var options = {};

  for (var opt in defaultOptions) {
    options[opt] = opts && has(opts, opt) ? opts[opt] : defaultOptions[opt];
  }

  if (options.ecmaVersion >= 2015) {
    options.ecmaVersion -= 2009;
  }

  if (options.allowReserved == null) {
    options.allowReserved = options.ecmaVersion < 5;
  }

  if (isArray(options.onToken)) {
    var tokens = options.onToken;
    options.onToken = function (token) {
      return tokens.push(token);
    };
  }
  if (isArray(options.onComment)) {
    options.onComment = pushComment(options, options.onComment);
  }

  return options;
}

function pushComment(options, array) {
  return function (block, text, start, end, startLoc, endLoc) {
    var comment = {
      type: block ? "Block" : "Line",
      value: text,
      start: start,
      end: end
    };
    if (options.locations) {
      comment.loc = new SourceLocation(this, startLoc, endLoc);
    }
    if (options.ranges) {
      comment.range = [start, end];
    }
    array.push(comment);
  };
}

// Registered plugins
var plugins = {};

function keywordRegexp(words) {
  return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$");
}

var Parser = function Parser(options, input, startPos) {
  this.options = options = getOptions(options);
  this.sourceFile = options.sourceFile;
  this.keywords = keywordRegexp(keywords[options.ecmaVersion >= 6 ? 6 : 5]);
  var reserved = "";
  if (!options.allowReserved) {
    for (var v = options.ecmaVersion;; v--) {
      if (reserved = reservedWords[v]) {
        break;
      }
    }
    if (options.sourceType == "module") {
      reserved += " await";
    }
  }
  this.reservedWords = keywordRegexp(reserved);
  var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
  this.reservedWordsStrict = keywordRegexp(reservedStrict);
  this.reservedWordsStrictBind = keywordRegexp(reservedStrict + " " + reservedWords.strictBind);
  this.input = String(input);

  // Used to signal to callers of `readWord1` whether the word
  // contained any escape sequences. This is needed because words with
  // escape sequences must not be interpreted as keywords.
  this.containsEsc = false;

  // Load plugins
  this.loadPlugins(options.plugins);

  // Set up token state

  // The current position of the tokenizer in the input.
  if (startPos) {
    this.pos = startPos;
    this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
    this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
  } else {
    this.pos = this.lineStart = 0;
    this.curLine = 1;
  }

  // Properties of the current token:
  // Its type
  this.type = types.eof;
  // For tokens that include more information than their type, the value
  this.value = null;
  // Its start and end offset
  this.start = this.end = this.pos;
  // And, if locations are used, the {line, column} object
  // corresponding to those offsets
  this.startLoc = this.endLoc = this.curPosition();

  // Position information for the previous token
  this.lastTokEndLoc = this.lastTokStartLoc = null;
  this.lastTokStart = this.lastTokEnd = this.pos;

  // The context stack is used to superficially track syntactic
  // context to predict whether a regular expression is allowed in a
  // given position.
  this.context = this.initialContext();
  this.exprAllowed = true;

  // Figure out if it's a module code.
  this.inModule = options.sourceType === "module";
  this.strict = this.inModule || this.strictDirective(this.pos);

  // Used to signify the start of a potential arrow function
  this.potentialArrowAt = -1;

  // Flags to track whether we are in a function, a generator, an async function.
  this.inFunction = this.inGenerator = this.inAsync = false;
  // Positions to delayed-check that yield/await does not exist in default parameters.
  this.yieldPos = this.awaitPos = 0;
  // Labels in scope.
  this.labels = [];

  // If enabled, skip leading hashbang line.
  if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!") {
    this.skipLineComment(2);
  }

  // Scope tracking for duplicate variable names (see scope.js)
  this.scopeStack = [];
  this.enterFunctionScope();
};

// DEPRECATED Kept for backwards compatibility until 3.0 in case a plugin uses them
Parser.prototype.isKeyword = function isKeyword(word) {
  return this.keywords.test(word);
};
Parser.prototype.isReservedWord = function isReservedWord(word) {
  return this.reservedWords.test(word);
};

Parser.prototype.extend = function extend(name, f) {
  this[name] = f(this[name]);
};

Parser.prototype.loadPlugins = function loadPlugins(pluginConfigs) {
  var this$1 = this;

  for (var name in pluginConfigs) {
    var plugin = plugins[name];
    if (!plugin) {
      throw new Error("Plugin '" + name + "' not found");
    }
    plugin(this$1, pluginConfigs[name]);
  }
};

Parser.prototype.parse = function parse() {
  var node = this.options.program || this.startNode();
  this.nextToken();
  return this.parseTopLevel(node);
};

var pp = Parser.prototype;

// ## Parser utilities

var literal = /^(?:'((?:\\.|[^'])*?)'|"((?:\\.|[^"])*?)"|;)/;
pp.strictDirective = function (start) {
  var this$1 = this;

  for (;;) {
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this$1.input)[0].length;
    var match = literal.exec(this$1.input.slice(start));
    if (!match) {
      return false;
    }
    if ((match[1] || match[2]) == "use strict") {
      return true;
    }
    start += match[0].length;
  }
};

// Predicate that tests whether the next token is of the given
// type, and if yes, consumes it as a side effect.

pp.eat = function (type) {
  if (this.type === type) {
    this.next();
    return true;
  } else {
    return false;
  }
};

// Tests whether parsed token is a contextual keyword.

pp.isContextual = function (name) {
  return this.type === types.name && this.value === name && !this.containsEsc;
};

// Consumes contextual keyword if possible.

pp.eatContextual = function (name) {
  if (!this.isContextual(name)) {
    return false;
  }
  this.next();
  return true;
};

// Asserts that following token is given contextual keyword.

pp.expectContextual = function (name) {
  if (!this.eatContextual(name)) {
    this.unexpected();
  }
};

// Test whether a semicolon can be inserted at the current position.

pp.canInsertSemicolon = function () {
  return this.type === types.eof || this.type === types.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};

pp.insertSemicolon = function () {
  if (this.canInsertSemicolon()) {
    if (this.options.onInsertedSemicolon) {
      this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
    }
    return true;
  }
};

// Consume a semicolon, or, failing that, see if we are allowed to
// pretend that there is a semicolon at this position.

pp.semicolon = function () {
  if (!this.eat(types.semi) && !this.insertSemicolon()) {
    this.unexpected();
  }
};

pp.afterTrailingComma = function (tokType, notNext) {
  if (this.type == tokType) {
    if (this.options.onTrailingComma) {
      this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
    }
    if (!notNext) {
      this.next();
    }
    return true;
  }
};

// Expect a token of a given type. If found, consume it, otherwise,
// raise an unexpected token error.

pp.expect = function (type) {
  this.eat(type) || this.unexpected();
};

// Raise an unexpected token error.

pp.unexpected = function (pos) {
  this.raise(pos != null ? pos : this.start, "Unexpected token");
};

function DestructuringErrors() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
}

pp.checkPatternErrors = function (refDestructuringErrors, isAssign) {
  if (!refDestructuringErrors) {
    return;
  }
  if (refDestructuringErrors.trailingComma > -1) {
    this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
  }
  var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
  if (parens > -1) {
    this.raiseRecoverable(parens, "Parenthesized pattern");
  }
};

pp.checkExpressionErrors = function (refDestructuringErrors, andThrow) {
  if (!refDestructuringErrors) {
    return false;
  }
  var shorthandAssign = refDestructuringErrors.shorthandAssign;
  var doubleProto = refDestructuringErrors.doubleProto;
  if (!andThrow) {
    return shorthandAssign >= 0 || doubleProto >= 0;
  }
  if (shorthandAssign >= 0) {
    this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns");
  }
  if (doubleProto >= 0) {
    this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
  }
};

pp.checkYieldAwaitInDefaultParams = function () {
  if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos)) {
    this.raise(this.yieldPos, "Yield expression cannot be a default value");
  }
  if (this.awaitPos) {
    this.raise(this.awaitPos, "Await expression cannot be a default value");
  }
};

pp.isSimpleAssignTarget = function (expr) {
  if (expr.type === "ParenthesizedExpression") {
    return this.isSimpleAssignTarget(expr.expression);
  }
  return expr.type === "Identifier" || expr.type === "MemberExpression";
};

var pp$1 = Parser.prototype;

// ### Statement parsing

// Parse a program. Initializes the parser, reads any number of
// statements, and wraps them in a Program node.  Optionally takes a
// `program` argument.  If present, the statements will be appended
// to its body instead of creating a new node.

pp$1.parseTopLevel = function (node) {
  var this$1 = this;

  var exports = {};
  if (!node.body) {
    node.body = [];
  }
  while (this.type !== types.eof) {
    var stmt = this$1.parseStatement(true, true, exports);
    node.body.push(stmt);
  }
  this.adaptDirectivePrologue(node.body);
  this.next();
  if (this.options.ecmaVersion >= 6) {
    node.sourceType = this.options.sourceType;
  }
  return this.finishNode(node, "Program");
};

var loopLabel = { kind: "loop" };
var switchLabel = { kind: "switch" };

pp$1.isLet = function () {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length,
      nextCh = this.input.charCodeAt(next);
  if (nextCh === 91 || nextCh == 123) {
    return true;
  } // '{' and '['
  if (isIdentifierStart(nextCh, true)) {
    var pos = next + 1;
    while (isIdentifierChar(this.input.charCodeAt(pos), true)) {
      ++pos;
    }
    var ident = this.input.slice(next, pos);
    if (!keywordRelationalOperator.test(ident)) {
      return true;
    }
  }
  return false;
};

// check 'async [no LineTerminator here] function'
// - 'async /*foo*/ function' is OK.
// - 'async /*\n*/ function' is invalid.
pp$1.isAsyncFunction = function () {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async")) {
    return false;
  }

  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length;
  return !lineBreak.test(this.input.slice(this.pos, next)) && this.input.slice(next, next + 8) === "function" && (next + 8 == this.input.length || !isIdentifierChar(this.input.charAt(next + 8)));
};

// Parse a single statement.
//
// If expecting a statement and finding a slash operator, parse a
// regular expression literal. This is to handle cases like
// `if (foo) /blah/.exec(foo)`, where looking at the previous token
// does not help.

pp$1.parseStatement = function (declaration, topLevel, exports) {
  var starttype = this.type,
      node = this.startNode(),
      kind;

  if (this.isLet()) {
    starttype = types._var;
    kind = "let";
  }

  // Most types of statements are recognized by the keyword they
  // start with. Many are trivial to parse, some require a bit of
  // complexity.

  switch (starttype) {
    case types._break:case types._continue:
      return this.parseBreakContinueStatement(node, starttype.keyword);
    case types._debugger:
      return this.parseDebuggerStatement(node);
    case types._do:
      return this.parseDoStatement(node);
    case types._for:
      return this.parseForStatement(node);
    case types._function:
      if (!declaration && this.options.ecmaVersion >= 6) {
        this.unexpected();
      }
      return this.parseFunctionStatement(node, false);
    case types._class:
      if (!declaration) {
        this.unexpected();
      }
      return this.parseClass(node, true);
    case types._if:
      return this.parseIfStatement(node);
    case types._return:
      return this.parseReturnStatement(node);
    case types._switch:
      return this.parseSwitchStatement(node);
    case types._throw:
      return this.parseThrowStatement(node);
    case types._try:
      return this.parseTryStatement(node);
    case types._const:case types._var:
      kind = kind || this.value;
      if (!declaration && kind != "var") {
        this.unexpected();
      }
      return this.parseVarStatement(node, kind);
    case types._while:
      return this.parseWhileStatement(node);
    case types._with:
      return this.parseWithStatement(node);
    case types.braceL:
      return this.parseBlock();
    case types.semi:
      return this.parseEmptyStatement(node);
    case types._export:
    case types._import:
      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel) {
          this.raise(this.start, "'import' and 'export' may only appear at the top level");
        }
        if (!this.inModule) {
          this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
        }
      }
      return starttype === types._import ? this.parseImport(node) : this.parseExport(node, exports);

    // If the statement does not start with a statement keyword or a
    // brace, it's an ExpressionStatement or LabeledStatement. We
    // simply start parsing an expression, and afterwards, if the
    // next token is a colon and the expression was a simple
    // Identifier node, we switch to interpreting it as a label.
    default:
      if (this.isAsyncFunction()) {
        if (!declaration) {
          this.unexpected();
        }
        this.next();
        return this.parseFunctionStatement(node, true);
      }

      var maybeName = this.value,
          expr = this.parseExpression();
      if (starttype === types.name && expr.type === "Identifier" && this.eat(types.colon)) {
        return this.parseLabeledStatement(node, maybeName, expr);
      } else {
        return this.parseExpressionStatement(node, expr);
      }
  }
};

pp$1.parseBreakContinueStatement = function (node, keyword) {
  var this$1 = this;

  var isBreak = keyword == "break";
  this.next();
  if (this.eat(types.semi) || this.insertSemicolon()) {
    node.label = null;
  } else if (this.type !== types.name) {
    this.unexpected();
  } else {
    node.label = this.parseIdent();
    this.semicolon();
  }

  // Verify that there is an actual destination to break or
  // continue to.
  var i = 0;
  for (; i < this.labels.length; ++i) {
    var lab = this$1.labels[i];
    if (node.label == null || lab.name === node.label.name) {
      if (lab.kind != null && (isBreak || lab.kind === "loop")) {
        break;
      }
      if (node.label && isBreak) {
        break;
      }
    }
  }
  if (i === this.labels.length) {
    this.raise(node.start, "Unsyntactic " + keyword);
  }
  return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
};

pp$1.parseDebuggerStatement = function (node) {
  this.next();
  this.semicolon();
  return this.finishNode(node, "DebuggerStatement");
};

pp$1.parseDoStatement = function (node) {
  this.next();
  this.labels.push(loopLabel);
  node.body = this.parseStatement(false);
  this.labels.pop();
  this.expect(types._while);
  node.test = this.parseParenExpression();
  if (this.options.ecmaVersion >= 6) {
    this.eat(types.semi);
  } else {
    this.semicolon();
  }
  return this.finishNode(node, "DoWhileStatement");
};

// Disambiguating between a `for` and a `for`/`in` or `for`/`of`
// loop is non-trivial. Basically, we have to parse the init `var`
// statement or expression, disallowing the `in` operator (see
// the second parameter to `parseExpression`), and then check
// whether the next token is `in` or `of`. When there is no init
// part (semicolon immediately after the opening parenthesis), it
// is a regular `for` loop.

pp$1.parseForStatement = function (node) {
  this.next();
  var awaitAt = this.options.ecmaVersion >= 9 && this.inAsync && this.eatContextual("await") ? this.lastTokStart : -1;
  this.labels.push(loopLabel);
  this.enterLexicalScope();
  this.expect(types.parenL);
  if (this.type === types.semi) {
    if (awaitAt > -1) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node, null);
  }
  var isLet = this.isLet();
  if (this.type === types._var || this.type === types._const || isLet) {
    var init$1 = this.startNode(),
        kind = isLet ? "let" : this.value;
    this.next();
    this.parseVar(init$1, true, kind);
    this.finishNode(init$1, "VariableDeclaration");
    if ((this.type === types._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && init$1.declarations.length === 1 && !(kind !== "var" && init$1.declarations[0].init)) {
      if (this.options.ecmaVersion >= 9) {
        if (this.type === types._in) {
          if (awaitAt > -1) {
            this.unexpected(awaitAt);
          }
        } else {
          node.await = awaitAt > -1;
        }
      }
      return this.parseForIn(node, init$1);
    }
    if (awaitAt > -1) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node, init$1);
  }
  var refDestructuringErrors = new DestructuringErrors();
  var init = this.parseExpression(true, refDestructuringErrors);
  if (this.type === types._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) {
    if (this.options.ecmaVersion >= 9) {
      if (this.type === types._in) {
        if (awaitAt > -1) {
          this.unexpected(awaitAt);
        }
      } else {
        node.await = awaitAt > -1;
      }
    }
    this.toAssignable(init, false, refDestructuringErrors);
    this.checkLVal(init);
    return this.parseForIn(node, init);
  } else {
    this.checkExpressionErrors(refDestructuringErrors, true);
  }
  if (awaitAt > -1) {
    this.unexpected(awaitAt);
  }
  return this.parseFor(node, init);
};

pp$1.parseFunctionStatement = function (node, isAsync) {
  this.next();
  return this.parseFunction(node, true, false, isAsync);
};

pp$1.parseIfStatement = function (node) {
  this.next();
  node.test = this.parseParenExpression();
  // allow function declarations in branches, but only in non-strict mode
  node.consequent = this.parseStatement(!this.strict && this.type == types._function);
  node.alternate = this.eat(types._else) ? this.parseStatement(!this.strict && this.type == types._function) : null;
  return this.finishNode(node, "IfStatement");
};

pp$1.parseReturnStatement = function (node) {
  if (!this.inFunction && !this.options.allowReturnOutsideFunction) {
    this.raise(this.start, "'return' outside of function");
  }
  this.next();

  // In `return` (and `break`/`continue`), the keywords with
  // optional arguments, we eagerly look for a semicolon or the
  // possibility to insert one.

  if (this.eat(types.semi) || this.insertSemicolon()) {
    node.argument = null;
  } else {
    node.argument = this.parseExpression();this.semicolon();
  }
  return this.finishNode(node, "ReturnStatement");
};

pp$1.parseSwitchStatement = function (node) {
  var this$1 = this;

  this.next();
  node.discriminant = this.parseParenExpression();
  node.cases = [];
  this.expect(types.braceL);
  this.labels.push(switchLabel);
  this.enterLexicalScope();

  // Statements under must be grouped (by label) in SwitchCase
  // nodes. `cur` is used to keep the node that we are currently
  // adding statements to.

  var cur;
  for (var sawDefault = false; this.type != types.braceR;) {
    if (this$1.type === types._case || this$1.type === types._default) {
      var isCase = this$1.type === types._case;
      if (cur) {
        this$1.finishNode(cur, "SwitchCase");
      }
      node.cases.push(cur = this$1.startNode());
      cur.consequent = [];
      this$1.next();
      if (isCase) {
        cur.test = this$1.parseExpression();
      } else {
        if (sawDefault) {
          this$1.raiseRecoverable(this$1.lastTokStart, "Multiple default clauses");
        }
        sawDefault = true;
        cur.test = null;
      }
      this$1.expect(types.colon);
    } else {
      if (!cur) {
        this$1.unexpected();
      }
      cur.consequent.push(this$1.parseStatement(true));
    }
  }
  this.exitLexicalScope();
  if (cur) {
    this.finishNode(cur, "SwitchCase");
  }
  this.next(); // Closing brace
  this.labels.pop();
  return this.finishNode(node, "SwitchStatement");
};

pp$1.parseThrowStatement = function (node) {
  this.next();
  if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) {
    this.raise(this.lastTokEnd, "Illegal newline after throw");
  }
  node.argument = this.parseExpression();
  this.semicolon();
  return this.finishNode(node, "ThrowStatement");
};

// Reused empty array added for node fields that are always empty.

var empty = [];

pp$1.parseTryStatement = function (node) {
  this.next();
  node.block = this.parseBlock();
  node.handler = null;
  if (this.type === types._catch) {
    var clause = this.startNode();
    this.next();
    this.expect(types.parenL);
    clause.param = this.parseBindingAtom();
    this.enterLexicalScope();
    this.checkLVal(clause.param, "let");
    this.expect(types.parenR);
    clause.body = this.parseBlock(false);
    this.exitLexicalScope();
    node.handler = this.finishNode(clause, "CatchClause");
  }
  node.finalizer = this.eat(types._finally) ? this.parseBlock() : null;
  if (!node.handler && !node.finalizer) {
    this.raise(node.start, "Missing catch or finally clause");
  }
  return this.finishNode(node, "TryStatement");
};

pp$1.parseVarStatement = function (node, kind) {
  this.next();
  this.parseVar(node, false, kind);
  this.semicolon();
  return this.finishNode(node, "VariableDeclaration");
};

pp$1.parseWhileStatement = function (node) {
  this.next();
  node.test = this.parseParenExpression();
  this.labels.push(loopLabel);
  node.body = this.parseStatement(false);
  this.labels.pop();
  return this.finishNode(node, "WhileStatement");
};

pp$1.parseWithStatement = function (node) {
  if (this.strict) {
    this.raise(this.start, "'with' in strict mode");
  }
  this.next();
  node.object = this.parseParenExpression();
  node.body = this.parseStatement(false);
  return this.finishNode(node, "WithStatement");
};

pp$1.parseEmptyStatement = function (node) {
  this.next();
  return this.finishNode(node, "EmptyStatement");
};

pp$1.parseLabeledStatement = function (node, maybeName, expr) {
  var this$1 = this;

  for (var i$1 = 0, list = this$1.labels; i$1 < list.length; i$1 += 1) {
    var label = list[i$1];

    if (label.name === maybeName) {
      this$1.raise(expr.start, "Label '" + maybeName + "' is already declared");
    }
  }
  var kind = this.type.isLoop ? "loop" : this.type === types._switch ? "switch" : null;
  for (var i = this.labels.length - 1; i >= 0; i--) {
    var label$1 = this$1.labels[i];
    if (label$1.statementStart == node.start) {
      // Update information about previous labels on this node
      label$1.statementStart = this$1.start;
      label$1.kind = kind;
    } else {
      break;
    }
  }
  this.labels.push({ name: maybeName, kind: kind, statementStart: this.start });
  node.body = this.parseStatement(true);
  if (node.body.type == "ClassDeclaration" || node.body.type == "VariableDeclaration" && node.body.kind != "var" || node.body.type == "FunctionDeclaration" && (this.strict || node.body.generator)) {
    this.raiseRecoverable(node.body.start, "Invalid labeled declaration");
  }
  this.labels.pop();
  node.label = expr;
  return this.finishNode(node, "LabeledStatement");
};

pp$1.parseExpressionStatement = function (node, expr) {
  node.expression = expr;
  this.semicolon();
  return this.finishNode(node, "ExpressionStatement");
};

// Parse a semicolon-enclosed block of statements, handling `"use
// strict"` declarations when `allowStrict` is true (used for
// function bodies).

pp$1.parseBlock = function (createNewLexicalScope) {
  var this$1 = this;
  if (createNewLexicalScope === void 0) createNewLexicalScope = true;

  var node = this.startNode();
  node.body = [];
  this.expect(types.braceL);
  if (createNewLexicalScope) {
    this.enterLexicalScope();
  }
  while (!this.eat(types.braceR)) {
    var stmt = this$1.parseStatement(true);
    node.body.push(stmt);
  }
  if (createNewLexicalScope) {
    this.exitLexicalScope();
  }
  return this.finishNode(node, "BlockStatement");
};

// Parse a regular `for` loop. The disambiguation code in
// `parseStatement` will already have parsed the init statement or
// expression.

pp$1.parseFor = function (node, init) {
  node.init = init;
  this.expect(types.semi);
  node.test = this.type === types.semi ? null : this.parseExpression();
  this.expect(types.semi);
  node.update = this.type === types.parenR ? null : this.parseExpression();
  this.expect(types.parenR);
  this.exitLexicalScope();
  node.body = this.parseStatement(false);
  this.labels.pop();
  return this.finishNode(node, "ForStatement");
};

// Parse a `for`/`in` and `for`/`of` loop, which are almost
// same from parser's perspective.

pp$1.parseForIn = function (node, init) {
  var type = this.type === types._in ? "ForInStatement" : "ForOfStatement";
  this.next();
  if (type == "ForInStatement") {
    if (init.type === "AssignmentPattern" || init.type === "VariableDeclaration" && init.declarations[0].init != null && (this.strict || init.declarations[0].id.type !== "Identifier")) {
      this.raise(init.start, "Invalid assignment in for-in loop head");
    }
  }
  node.left = init;
  node.right = type == "ForInStatement" ? this.parseExpression() : this.parseMaybeAssign();
  this.expect(types.parenR);
  this.exitLexicalScope();
  node.body = this.parseStatement(false);
  this.labels.pop();
  return this.finishNode(node, type);
};

// Parse a list of variable declarations.

pp$1.parseVar = function (node, isFor, kind) {
  var this$1 = this;

  node.declarations = [];
  node.kind = kind;
  for (;;) {
    var decl = this$1.startNode();
    this$1.parseVarId(decl, kind);
    if (this$1.eat(types.eq)) {
      decl.init = this$1.parseMaybeAssign(isFor);
    } else if (kind === "const" && !(this$1.type === types._in || this$1.options.ecmaVersion >= 6 && this$1.isContextual("of"))) {
      this$1.unexpected();
    } else if (decl.id.type != "Identifier" && !(isFor && (this$1.type === types._in || this$1.isContextual("of")))) {
      this$1.raise(this$1.lastTokEnd, "Complex binding patterns require an initialization value");
    } else {
      decl.init = null;
    }
    node.declarations.push(this$1.finishNode(decl, "VariableDeclarator"));
    if (!this$1.eat(types.comma)) {
      break;
    }
  }
  return node;
};

pp$1.parseVarId = function (decl, kind) {
  decl.id = this.parseBindingAtom(kind);
  this.checkLVal(decl.id, kind, false);
};

// Parse a function declaration or literal (depending on the
// `isStatement` parameter).

pp$1.parseFunction = function (node, isStatement, allowExpressionBody, isAsync) {
  this.initFunction(node);
  if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
    node.generator = this.eat(types.star);
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }

  if (isStatement) {
    node.id = isStatement === "nullableID" && this.type != types.name ? null : this.parseIdent();
    if (node.id) {
      this.checkLVal(node.id, "var");
    }
  }

  var oldInGen = this.inGenerator,
      oldInAsync = this.inAsync,
      oldYieldPos = this.yieldPos,
      oldAwaitPos = this.awaitPos,
      oldInFunc = this.inFunction;
  this.inGenerator = node.generator;
  this.inAsync = node.async;
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.inFunction = true;
  this.enterFunctionScope();

  if (!isStatement) {
    node.id = this.type == types.name ? this.parseIdent() : null;
  }

  this.parseFunctionParams(node);
  this.parseFunctionBody(node, allowExpressionBody);

  this.inGenerator = oldInGen;
  this.inAsync = oldInAsync;
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.inFunction = oldInFunc;
  return this.finishNode(node, isStatement ? "FunctionDeclaration" : "FunctionExpression");
};

pp$1.parseFunctionParams = function (node) {
  this.expect(types.parenL);
  node.params = this.parseBindingList(types.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
};

// Parse a class declaration or literal (depending on the
// `isStatement` parameter).

pp$1.parseClass = function (node, isStatement) {
  var this$1 = this;

  this.next();

  this.parseClassId(node, isStatement);
  this.parseClassSuper(node);
  var classBody = this.startNode();
  var hadConstructor = false;
  classBody.body = [];
  this.expect(types.braceL);
  while (!this.eat(types.braceR)) {
    var member = this$1.parseClassMember(classBody);
    if (member && member.type === "MethodDefinition" && member.kind === "constructor") {
      if (hadConstructor) {
        this$1.raise(member.start, "Duplicate constructor in the same class");
      }
      hadConstructor = true;
    }
  }
  node.body = this.finishNode(classBody, "ClassBody");
  return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
};

pp$1.parseClassMember = function (classBody) {
  var this$1 = this;

  if (this.eat(types.semi)) {
    return null;
  }

  var method = this.startNode();
  var tryContextual = function tryContextual(k, noLineBreak) {
    if (noLineBreak === void 0) noLineBreak = false;

    var start = this$1.start,
        startLoc = this$1.startLoc;
    if (!this$1.eatContextual(k)) {
      return false;
    }
    if (this$1.type !== types.parenL && (!noLineBreak || !this$1.canInsertSemicolon())) {
      return true;
    }
    if (method.key) {
      this$1.unexpected();
    }
    method.computed = false;
    method.key = this$1.startNodeAt(start, startLoc);
    method.key.name = k;
    this$1.finishNode(method.key, "Identifier");
    return false;
  };

  method.kind = "method";
  method.static = tryContextual("static");
  var isGenerator = this.eat(types.star);
  var isAsync = false;
  if (!isGenerator) {
    if (this.options.ecmaVersion >= 8 && tryContextual("async", true)) {
      isAsync = true;
      isGenerator = this.options.ecmaVersion >= 9 && this.eat(types.star);
    } else if (tryContextual("get")) {
      method.kind = "get";
    } else if (tryContextual("set")) {
      method.kind = "set";
    }
  }
  if (!method.key) {
    this.parsePropertyName(method);
  }
  var key = method.key;
  if (!method.computed && !method.static && (key.type === "Identifier" && key.name === "constructor" || key.type === "Literal" && key.value === "constructor")) {
    if (method.kind !== "method") {
      this.raise(key.start, "Constructor can't have get/set modifier");
    }
    if (isGenerator) {
      this.raise(key.start, "Constructor can't be a generator");
    }
    if (isAsync) {
      this.raise(key.start, "Constructor can't be an async method");
    }
    method.kind = "constructor";
  } else if (method.static && key.type === "Identifier" && key.name === "prototype") {
    this.raise(key.start, "Classes may not have a static property named prototype");
  }
  this.parseClassMethod(classBody, method, isGenerator, isAsync);
  if (method.kind === "get" && method.value.params.length !== 0) {
    this.raiseRecoverable(method.value.start, "getter should have no params");
  }
  if (method.kind === "set" && method.value.params.length !== 1) {
    this.raiseRecoverable(method.value.start, "setter should have exactly one param");
  }
  if (method.kind === "set" && method.value.params[0].type === "RestElement") {
    this.raiseRecoverable(method.value.params[0].start, "Setter cannot use rest params");
  }
  return method;
};

pp$1.parseClassMethod = function (classBody, method, isGenerator, isAsync) {
  method.value = this.parseMethod(isGenerator, isAsync);
  classBody.body.push(this.finishNode(method, "MethodDefinition"));
};

pp$1.parseClassId = function (node, isStatement) {
  node.id = this.type === types.name ? this.parseIdent() : isStatement === true ? this.unexpected() : null;
};

pp$1.parseClassSuper = function (node) {
  node.superClass = this.eat(types._extends) ? this.parseExprSubscripts() : null;
};

// Parses module export declaration.

pp$1.parseExport = function (node, exports) {
  var this$1 = this;

  this.next();
  // export * from '...'
  if (this.eat(types.star)) {
    this.expectContextual("from");
    if (this.type !== types.string) {
      this.unexpected();
    }
    node.source = this.parseExprAtom();
    this.semicolon();
    return this.finishNode(node, "ExportAllDeclaration");
  }
  if (this.eat(types._default)) {
    // export default ...
    this.checkExport(exports, "default", this.lastTokStart);
    var isAsync;
    if (this.type === types._function || (isAsync = this.isAsyncFunction())) {
      var fNode = this.startNode();
      this.next();
      if (isAsync) {
        this.next();
      }
      node.declaration = this.parseFunction(fNode, "nullableID", false, isAsync);
    } else if (this.type === types._class) {
      var cNode = this.startNode();
      node.declaration = this.parseClass(cNode, "nullableID");
    } else {
      node.declaration = this.parseMaybeAssign();
      this.semicolon();
    }
    return this.finishNode(node, "ExportDefaultDeclaration");
  }
  // export var|const|let|function|class ...
  if (this.shouldParseExportStatement()) {
    node.declaration = this.parseStatement(true);
    if (node.declaration.type === "VariableDeclaration") {
      this.checkVariableExport(exports, node.declaration.declarations);
    } else {
      this.checkExport(exports, node.declaration.id.name, node.declaration.id.start);
    }
    node.specifiers = [];
    node.source = null;
  } else {
    // export { x, y as z } [from '...']
    node.declaration = null;
    node.specifiers = this.parseExportSpecifiers(exports);
    if (this.eatContextual("from")) {
      if (this.type !== types.string) {
        this.unexpected();
      }
      node.source = this.parseExprAtom();
    } else {
      // check for keywords used as local names
      for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
        var spec = list[i];

        this$1.checkUnreserved(spec.local);
      }

      node.source = null;
    }
    this.semicolon();
  }
  return this.finishNode(node, "ExportNamedDeclaration");
};

pp$1.checkExport = function (exports, name, pos) {
  if (!exports) {
    return;
  }
  if (has(exports, name)) {
    this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
  }
  exports[name] = true;
};

pp$1.checkPatternExport = function (exports, pat) {
  var this$1 = this;

  var type = pat.type;
  if (type == "Identifier") {
    this.checkExport(exports, pat.name, pat.start);
  } else if (type == "ObjectPattern") {
    for (var i = 0, list = pat.properties; i < list.length; i += 1) {
      var prop = list[i];

      this$1.checkPatternExport(exports, prop);
    }
  } else if (type == "ArrayPattern") {
    for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
      var elt = list$1[i$1];

      if (elt) {
        this$1.checkPatternExport(exports, elt);
      }
    }
  } else if (type == "Property") {
    this.checkPatternExport(exports, pat.value);
  } else if (type == "AssignmentPattern") {
    this.checkPatternExport(exports, pat.left);
  } else if (type == "RestElement") {
    this.checkPatternExport(exports, pat.argument);
  } else if (type == "ParenthesizedExpression") {
    this.checkPatternExport(exports, pat.expression);
  }
};

pp$1.checkVariableExport = function (exports, decls) {
  var this$1 = this;

  if (!exports) {
    return;
  }
  for (var i = 0, list = decls; i < list.length; i += 1) {
    var decl = list[i];

    this$1.checkPatternExport(exports, decl.id);
  }
};

pp$1.shouldParseExportStatement = function () {
  return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
};

// Parses a comma-separated list of module exports.

pp$1.parseExportSpecifiers = function (exports) {
  var this$1 = this;

  var nodes = [],
      first = true;
  // export { x, y as z } [from '...']
  this.expect(types.braceL);
  while (!this.eat(types.braceR)) {
    if (!first) {
      this$1.expect(types.comma);
      if (this$1.afterTrailingComma(types.braceR)) {
        break;
      }
    } else {
      first = false;
    }

    var node = this$1.startNode();
    node.local = this$1.parseIdent(true);
    node.exported = this$1.eatContextual("as") ? this$1.parseIdent(true) : node.local;
    this$1.checkExport(exports, node.exported.name, node.exported.start);
    nodes.push(this$1.finishNode(node, "ExportSpecifier"));
  }
  return nodes;
};

// Parses import declaration.

pp$1.parseImport = function (node) {
  this.next();
  // import '...'
  if (this.type === types.string) {
    node.specifiers = empty;
    node.source = this.parseExprAtom();
  } else {
    node.specifiers = this.parseImportSpecifiers();
    this.expectContextual("from");
    node.source = this.type === types.string ? this.parseExprAtom() : this.unexpected();
  }
  this.semicolon();
  return this.finishNode(node, "ImportDeclaration");
};

// Parses a comma-separated list of module imports.

pp$1.parseImportSpecifiers = function () {
  var this$1 = this;

  var nodes = [],
      first = true;
  if (this.type === types.name) {
    // import defaultObj, { x, y as z } from '...'
    var node = this.startNode();
    node.local = this.parseIdent();
    this.checkLVal(node.local, "let");
    nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
    if (!this.eat(types.comma)) {
      return nodes;
    }
  }
  if (this.type === types.star) {
    var node$1 = this.startNode();
    this.next();
    this.expectContextual("as");
    node$1.local = this.parseIdent();
    this.checkLVal(node$1.local, "let");
    nodes.push(this.finishNode(node$1, "ImportNamespaceSpecifier"));
    return nodes;
  }
  this.expect(types.braceL);
  while (!this.eat(types.braceR)) {
    if (!first) {
      this$1.expect(types.comma);
      if (this$1.afterTrailingComma(types.braceR)) {
        break;
      }
    } else {
      first = false;
    }

    var node$2 = this$1.startNode();
    node$2.imported = this$1.parseIdent(true);
    if (this$1.eatContextual("as")) {
      node$2.local = this$1.parseIdent();
    } else {
      this$1.checkUnreserved(node$2.imported);
      node$2.local = node$2.imported;
    }
    this$1.checkLVal(node$2.local, "let");
    nodes.push(this$1.finishNode(node$2, "ImportSpecifier"));
  }
  return nodes;
};

// Set `ExpressionStatement#directive` property for directive prologues.
pp$1.adaptDirectivePrologue = function (statements) {
  for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i) {
    statements[i].directive = statements[i].expression.raw.slice(1, -1);
  }
};
pp$1.isDirectiveCandidate = function (statement) {
  return statement.type === "ExpressionStatement" && statement.expression.type === "Literal" && typeof statement.expression.value === "string" && (
  // Reject parenthesized strings.
  this.input[statement.start] === "\"" || this.input[statement.start] === "'");
};

var pp$2 = Parser.prototype;

// Convert existing expression atom to assignable pattern
// if possible.

pp$2.toAssignable = function (node, isBinding, refDestructuringErrors) {
  var this$1 = this;

  if (this.options.ecmaVersion >= 6 && node) {
    switch (node.type) {
      case "Identifier":
        if (this.inAsync && node.name === "await") {
          this.raise(node.start, "Can not use 'await' as identifier inside an async function");
        }
        break;

      case "ObjectPattern":
      case "ArrayPattern":
      case "RestElement":
        break;

      case "ObjectExpression":
        node.type = "ObjectPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        for (var i = 0, list = node.properties; i < list.length; i += 1) {
          var prop = list[i];

          this$1.toAssignable(prop, isBinding);
          // Early error:
          //   AssignmentRestProperty[Yield, Await] :
          //     `...` DestructuringAssignmentTarget[Yield, Await]
          //
          //   It is a Syntax Error if |DestructuringAssignmentTarget| is an |ArrayLiteral| or an |ObjectLiteral|.
          if (prop.type === "RestElement" && (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")) {
            this$1.raise(prop.argument.start, "Unexpected token");
          }
        }
        break;

      case "Property":
        // AssignmentProperty has type == "Property"
        if (node.kind !== "init") {
          this.raise(node.key.start, "Object pattern can't contain getter or setter");
        }
        this.toAssignable(node.value, isBinding);
        break;

      case "ArrayExpression":
        node.type = "ArrayPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        this.toAssignableList(node.elements, isBinding);
        break;

      case "SpreadElement":
        node.type = "RestElement";
        this.toAssignable(node.argument, isBinding);
        if (node.argument.type === "AssignmentPattern") {
          this.raise(node.argument.start, "Rest elements cannot have a default value");
        }
        break;

      case "AssignmentExpression":
        if (node.operator !== "=") {
          this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
        }
        node.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isBinding);
      // falls through to AssignmentPattern

      case "AssignmentPattern":
        break;

      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isBinding);
        break;

      case "MemberExpression":
        if (!isBinding) {
          break;
        }

      default:
        this.raise(node.start, "Assigning to rvalue");
    }
  } else if (refDestructuringErrors) {
    this.checkPatternErrors(refDestructuringErrors, true);
  }
  return node;
};

// Convert list of expression atoms to binding list.

pp$2.toAssignableList = function (exprList, isBinding) {
  var this$1 = this;

  var end = exprList.length;
  for (var i = 0; i < end; i++) {
    var elt = exprList[i];
    if (elt) {
      this$1.toAssignable(elt, isBinding);
    }
  }
  if (end) {
    var last = exprList[end - 1];
    if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier") {
      this.unexpected(last.argument.start);
    }
  }
  return exprList;
};

// Parses spread element.

pp$2.parseSpread = function (refDestructuringErrors) {
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
  return this.finishNode(node, "SpreadElement");
};

pp$2.parseRestBinding = function () {
  var node = this.startNode();
  this.next();

  // RestElement inside of a function parameter must be an identifier
  if (this.options.ecmaVersion === 6 && this.type !== types.name) {
    this.unexpected();
  }

  node.argument = this.parseBindingAtom();

  return this.finishNode(node, "RestElement");
};

// Parses lvalue (assignable) atom.

pp$2.parseBindingAtom = function () {
  if (this.options.ecmaVersion >= 6) {
    switch (this.type) {
      case types.bracketL:
        var node = this.startNode();
        this.next();
        node.elements = this.parseBindingList(types.bracketR, true, true);
        return this.finishNode(node, "ArrayPattern");

      case types.braceL:
        return this.parseObj(true);
    }
  }
  return this.parseIdent();
};

pp$2.parseBindingList = function (close, allowEmpty, allowTrailingComma) {
  var this$1 = this;

  var elts = [],
      first = true;
  while (!this.eat(close)) {
    if (first) {
      first = false;
    } else {
      this$1.expect(types.comma);
    }
    if (allowEmpty && this$1.type === types.comma) {
      elts.push(null);
    } else if (allowTrailingComma && this$1.afterTrailingComma(close)) {
      break;
    } else if (this$1.type === types.ellipsis) {
      var rest = this$1.parseRestBinding();
      this$1.parseBindingListItem(rest);
      elts.push(rest);
      if (this$1.type === types.comma) {
        this$1.raise(this$1.start, "Comma is not permitted after the rest element");
      }
      this$1.expect(close);
      break;
    } else {
      var elem = this$1.parseMaybeDefault(this$1.start, this$1.startLoc);
      this$1.parseBindingListItem(elem);
      elts.push(elem);
    }
  }
  return elts;
};

pp$2.parseBindingListItem = function (param) {
  return param;
};

// Parses assignment pattern around given atom if possible.

pp$2.parseMaybeDefault = function (startPos, startLoc, left) {
  left = left || this.parseBindingAtom();
  if (this.options.ecmaVersion < 6 || !this.eat(types.eq)) {
    return left;
  }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.right = this.parseMaybeAssign();
  return this.finishNode(node, "AssignmentPattern");
};

// Verify that a node is an lval — something that can be assigned
// to.
// bindingType can be either:
// 'var' indicating that the lval creates a 'var' binding
// 'let' indicating that the lval creates a lexical ('let' or 'const') binding
// 'none' indicating that the binding should be checked for illegal identifiers, but not for duplicate references

pp$2.checkLVal = function (expr, bindingType, checkClashes) {
  var this$1 = this;

  switch (expr.type) {
    case "Identifier":
      if (this.strict && this.reservedWordsStrictBind.test(expr.name)) {
        this.raiseRecoverable(expr.start, (bindingType ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
      }
      if (checkClashes) {
        if (has(checkClashes, expr.name)) {
          this.raiseRecoverable(expr.start, "Argument name clash");
        }
        checkClashes[expr.name] = true;
      }
      if (bindingType && bindingType !== "none") {
        if (bindingType === "var" && !this.canDeclareVarName(expr.name) || bindingType !== "var" && !this.canDeclareLexicalName(expr.name)) {
          this.raiseRecoverable(expr.start, "Identifier '" + expr.name + "' has already been declared");
        }
        if (bindingType === "var") {
          this.declareVarName(expr.name);
        } else {
          this.declareLexicalName(expr.name);
        }
      }
      break;

    case "MemberExpression":
      if (bindingType) {
        this.raiseRecoverable(expr.start, "Binding member expression");
      }
      break;

    case "ObjectPattern":
      for (var i = 0, list = expr.properties; i < list.length; i += 1) {
        var prop = list[i];

        this$1.checkLVal(prop, bindingType, checkClashes);
      }
      break;

    case "Property":
      // AssignmentProperty has type == "Property"
      this.checkLVal(expr.value, bindingType, checkClashes);
      break;

    case "ArrayPattern":
      for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
        var elem = list$1[i$1];

        if (elem) {
          this$1.checkLVal(elem, bindingType, checkClashes);
        }
      }
      break;

    case "AssignmentPattern":
      this.checkLVal(expr.left, bindingType, checkClashes);
      break;

    case "RestElement":
      this.checkLVal(expr.argument, bindingType, checkClashes);
      break;

    case "ParenthesizedExpression":
      this.checkLVal(expr.expression, bindingType, checkClashes);
      break;

    default:
      this.raise(expr.start, (bindingType ? "Binding" : "Assigning to") + " rvalue");
  }
};

// A recursive descent parser operates by defining functions for all
// syntactic elements, and recursively calling those, each function
// advancing the input stream and returning an AST node. Precedence
// of constructs (for example, the fact that `!x[1]` means `!(x[1])`
// instead of `(!x)[1]` is handled by the fact that the parser
// function that parses unary prefix operators is called first, and
// in turn calls the function that parses `[]` subscripts — that
// way, it'll receive the node for `x[1]` already parsed, and wraps
// *that* in the unary operator node.
//
// Acorn uses an [operator precedence parser][opp] to handle binary
// operator precedence, because it is much more compact than using
// the technique outlined above, which uses different, nesting
// functions to specify precedence, for all of the ten binary
// precedence levels that JavaScript defines.
//
// [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser

var pp$3 = Parser.prototype;

// Check if property name clashes with already added.
// Object/class getters and setters are not allowed to clash —
// either with each other or with an init property — and in
// strict mode, init properties are also not allowed to be repeated.

pp$3.checkPropClash = function (prop, propHash, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") {
    return;
  }
  if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) {
    return;
  }
  var key = prop.key;
  var name;
  switch (key.type) {
    case "Identifier":
      name = key.name;break;
    case "Literal":
      name = String(key.value);break;
    default:
      return;
  }
  var kind = prop.kind;
  if (this.options.ecmaVersion >= 6) {
    if (name === "__proto__" && kind === "init") {
      if (propHash.proto) {
        if (refDestructuringErrors && refDestructuringErrors.doubleProto < 0) {
          refDestructuringErrors.doubleProto = key.start;
        }
        // Backwards-compat kludge. Can be removed in version 6.0
        else {
            this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
          }
      }
      propHash.proto = true;
    }
    return;
  }
  name = "$" + name;
  var other = propHash[name];
  if (other) {
    var redefinition;
    if (kind === "init") {
      redefinition = this.strict && other.init || other.get || other.set;
    } else {
      redefinition = other.init || other[kind];
    }
    if (redefinition) {
      this.raiseRecoverable(key.start, "Redefinition of property");
    }
  } else {
    other = propHash[name] = {
      init: false,
      get: false,
      set: false
    };
  }
  other[kind] = true;
};

// ### Expression parsing

// These nest, from the most general expression type at the top to
// 'atomic', nondivisible expression types at the bottom. Most of
// the functions will simply let the function(s) below them parse,
// and, *if* the syntactic construct they handle is present, wrap
// the AST node that the inner parser gave them in another node.

// Parse a full expression. The optional arguments are used to
// forbid the `in` operator (in for loops initalization expressions)
// and provide reference for storing '=' operator inside shorthand
// property assignment in contexts where both object expression
// and object pattern might appear (so it's possible to raise
// delayed syntax error at correct position).

pp$3.parseExpression = function (noIn, refDestructuringErrors) {
  var this$1 = this;

  var startPos = this.start,
      startLoc = this.startLoc;
  var expr = this.parseMaybeAssign(noIn, refDestructuringErrors);
  if (this.type === types.comma) {
    var node = this.startNodeAt(startPos, startLoc);
    node.expressions = [expr];
    while (this.eat(types.comma)) {
      node.expressions.push(this$1.parseMaybeAssign(noIn, refDestructuringErrors));
    }
    return this.finishNode(node, "SequenceExpression");
  }
  return expr;
};

// Parse an assignment expression. This includes applications of
// operators like `+=`.

pp$3.parseMaybeAssign = function (noIn, refDestructuringErrors, afterLeftParse) {
  if (this.inGenerator && this.isContextual("yield")) {
    return this.parseYield();
  }

  var ownDestructuringErrors = false,
      oldParenAssign = -1,
      oldTrailingComma = -1;
  if (refDestructuringErrors) {
    oldParenAssign = refDestructuringErrors.parenthesizedAssign;
    oldTrailingComma = refDestructuringErrors.trailingComma;
    refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
  } else {
    refDestructuringErrors = new DestructuringErrors();
    ownDestructuringErrors = true;
  }

  var startPos = this.start,
      startLoc = this.startLoc;
  if (this.type == types.parenL || this.type == types.name) {
    this.potentialArrowAt = this.start;
  }
  var left = this.parseMaybeConditional(noIn, refDestructuringErrors);
  if (afterLeftParse) {
    left = afterLeftParse.call(this, left, startPos, startLoc);
  }
  if (this.type.isAssign) {
    var node = this.startNodeAt(startPos, startLoc);
    node.operator = this.value;
    node.left = this.type === types.eq ? this.toAssignable(left, false, refDestructuringErrors) : left;
    if (!ownDestructuringErrors) {
      DestructuringErrors.call(refDestructuringErrors);
    }
    refDestructuringErrors.shorthandAssign = -1; // reset because shorthand default was used correctly
    this.checkLVal(left);
    this.next();
    node.right = this.parseMaybeAssign(noIn);
    return this.finishNode(node, "AssignmentExpression");
  } else {
    if (ownDestructuringErrors) {
      this.checkExpressionErrors(refDestructuringErrors, true);
    }
  }
  if (oldParenAssign > -1) {
    refDestructuringErrors.parenthesizedAssign = oldParenAssign;
  }
  if (oldTrailingComma > -1) {
    refDestructuringErrors.trailingComma = oldTrailingComma;
  }
  return left;
};

// Parse a ternary conditional (`?:`) operator.

pp$3.parseMaybeConditional = function (noIn, refDestructuringErrors) {
  var startPos = this.start,
      startLoc = this.startLoc;
  var expr = this.parseExprOps(noIn, refDestructuringErrors);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  if (this.eat(types.question)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.test = expr;
    node.consequent = this.parseMaybeAssign();
    this.expect(types.colon);
    node.alternate = this.parseMaybeAssign(noIn);
    return this.finishNode(node, "ConditionalExpression");
  }
  return expr;
};

// Start the precedence parser.

pp$3.parseExprOps = function (noIn, refDestructuringErrors) {
  var startPos = this.start,
      startLoc = this.startLoc;
  var expr = this.parseMaybeUnary(refDestructuringErrors, false);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  return expr.start == startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, noIn);
};

// Parse binary operators with the operator precedence parsing
// algorithm. `left` is the left-hand side of the operator.
// `minPrec` provides context that allows the function to stop and
// defer further parser to one of its callers when it encounters an
// operator that has a lower precedence than the set it is parsing.

pp$3.parseExprOp = function (left, leftStartPos, leftStartLoc, minPrec, noIn) {
  var prec = this.type.binop;
  if (prec != null && (!noIn || this.type !== types._in)) {
    if (prec > minPrec) {
      var logical = this.type === types.logicalOR || this.type === types.logicalAND;
      var op = this.value;
      this.next();
      var startPos = this.start,
          startLoc = this.startLoc;
      var right = this.parseExprOp(this.parseMaybeUnary(null, false), startPos, startLoc, prec, noIn);
      var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical);
      return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, noIn);
    }
  }
  return left;
};

pp$3.buildBinary = function (startPos, startLoc, left, right, op, logical) {
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.operator = op;
  node.right = right;
  return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression");
};

// Parse unary operators, both prefix and postfix.

pp$3.parseMaybeUnary = function (refDestructuringErrors, sawUnary) {
  var this$1 = this;

  var startPos = this.start,
      startLoc = this.startLoc,
      expr;
  if (this.inAsync && this.isContextual("await")) {
    expr = this.parseAwait();
    sawUnary = true;
  } else if (this.type.prefix) {
    var node = this.startNode(),
        update = this.type === types.incDec;
    node.operator = this.value;
    node.prefix = true;
    this.next();
    node.argument = this.parseMaybeUnary(null, true);
    this.checkExpressionErrors(refDestructuringErrors, true);
    if (update) {
      this.checkLVal(node.argument);
    } else if (this.strict && node.operator === "delete" && node.argument.type === "Identifier") {
      this.raiseRecoverable(node.start, "Deleting local variable in strict mode");
    } else {
      sawUnary = true;
    }
    expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
  } else {
    expr = this.parseExprSubscripts(refDestructuringErrors);
    if (this.checkExpressionErrors(refDestructuringErrors)) {
      return expr;
    }
    while (this.type.postfix && !this.canInsertSemicolon()) {
      var node$1 = this$1.startNodeAt(startPos, startLoc);
      node$1.operator = this$1.value;
      node$1.prefix = false;
      node$1.argument = expr;
      this$1.checkLVal(expr);
      this$1.next();
      expr = this$1.finishNode(node$1, "UpdateExpression");
    }
  }

  if (!sawUnary && this.eat(types.starstar)) {
    return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false), "**", false);
  } else {
    return expr;
  }
};

// Parse call, dot, and `[]`-subscript expressions.

pp$3.parseExprSubscripts = function (refDestructuringErrors) {
  var startPos = this.start,
      startLoc = this.startLoc;
  var expr = this.parseExprAtom(refDestructuringErrors);
  var skipArrowSubscripts = expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")";
  if (this.checkExpressionErrors(refDestructuringErrors) || skipArrowSubscripts) {
    return expr;
  }
  var result = this.parseSubscripts(expr, startPos, startLoc);
  if (refDestructuringErrors && result.type === "MemberExpression") {
    if (refDestructuringErrors.parenthesizedAssign >= result.start) {
      refDestructuringErrors.parenthesizedAssign = -1;
    }
    if (refDestructuringErrors.parenthesizedBind >= result.start) {
      refDestructuringErrors.parenthesizedBind = -1;
    }
  }
  return result;
};

pp$3.parseSubscripts = function (base, startPos, startLoc, noCalls) {
  var this$1 = this;

  var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" && this.lastTokEnd == base.end && !this.canInsertSemicolon() && this.input.slice(base.start, base.end) === "async";
  for (var computed = void 0;;) {
    if ((computed = this$1.eat(types.bracketL)) || this$1.eat(types.dot)) {
      var node = this$1.startNodeAt(startPos, startLoc);
      node.object = base;
      node.property = computed ? this$1.parseExpression() : this$1.parseIdent(true);
      node.computed = !!computed;
      if (computed) {
        this$1.expect(types.bracketR);
      }
      base = this$1.finishNode(node, "MemberExpression");
    } else if (!noCalls && this$1.eat(types.parenL)) {
      var refDestructuringErrors = new DestructuringErrors(),
          oldYieldPos = this$1.yieldPos,
          oldAwaitPos = this$1.awaitPos;
      this$1.yieldPos = 0;
      this$1.awaitPos = 0;
      var exprList = this$1.parseExprList(types.parenR, this$1.options.ecmaVersion >= 8, false, refDestructuringErrors);
      if (maybeAsyncArrow && !this$1.canInsertSemicolon() && this$1.eat(types.arrow)) {
        this$1.checkPatternErrors(refDestructuringErrors, false);
        this$1.checkYieldAwaitInDefaultParams();
        this$1.yieldPos = oldYieldPos;
        this$1.awaitPos = oldAwaitPos;
        return this$1.parseArrowExpression(this$1.startNodeAt(startPos, startLoc), exprList, true);
      }
      this$1.checkExpressionErrors(refDestructuringErrors, true);
      this$1.yieldPos = oldYieldPos || this$1.yieldPos;
      this$1.awaitPos = oldAwaitPos || this$1.awaitPos;
      var node$1 = this$1.startNodeAt(startPos, startLoc);
      node$1.callee = base;
      node$1.arguments = exprList;
      base = this$1.finishNode(node$1, "CallExpression");
    } else if (this$1.type === types.backQuote) {
      var node$2 = this$1.startNodeAt(startPos, startLoc);
      node$2.tag = base;
      node$2.quasi = this$1.parseTemplate({ isTagged: true });
      base = this$1.finishNode(node$2, "TaggedTemplateExpression");
    } else {
      return base;
    }
  }
};

// Parse an atomic expression — either a single token that is an
// expression, an expression started by a keyword like `function` or
// `new`, or an expression wrapped in punctuation like `()`, `[]`,
// or `{}`.

pp$3.parseExprAtom = function (refDestructuringErrors) {
  var node,
      canBeArrow = this.potentialArrowAt == this.start;
  switch (this.type) {
    case types._super:
      if (!this.inFunction) {
        this.raise(this.start, "'super' outside of function or class");
      }
      node = this.startNode();
      this.next();
      // The `super` keyword can appear at below:
      // SuperProperty:
      //     super [ Expression ]
      //     super . IdentifierName
      // SuperCall:
      //     super Arguments
      if (this.type !== types.dot && this.type !== types.bracketL && this.type !== types.parenL) {
        this.unexpected();
      }
      return this.finishNode(node, "Super");

    case types._this:
      node = this.startNode();
      this.next();
      return this.finishNode(node, "ThisExpression");

    case types.name:
      var startPos = this.start,
          startLoc = this.startLoc,
          containsEsc = this.containsEsc;
      var id = this.parseIdent(this.type !== types.name);
      if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types._function)) {
        return this.parseFunction(this.startNodeAt(startPos, startLoc), false, false, true);
      }
      if (canBeArrow && !this.canInsertSemicolon()) {
        if (this.eat(types.arrow)) {
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false);
        }
        if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types.name && !containsEsc) {
          id = this.parseIdent();
          if (this.canInsertSemicolon() || !this.eat(types.arrow)) {
            this.unexpected();
          }
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true);
        }
      }
      return id;

    case types.regexp:
      var value = this.value;
      node = this.parseLiteral(value.value);
      node.regex = { pattern: value.pattern, flags: value.flags };
      return node;

    case types.num:case types.string:
      return this.parseLiteral(this.value);

    case types._null:case types._true:case types._false:
      node = this.startNode();
      node.value = this.type === types._null ? null : this.type === types._true;
      node.raw = this.type.keyword;
      this.next();
      return this.finishNode(node, "Literal");

    case types.parenL:
      var start = this.start,
          expr = this.parseParenAndDistinguishExpression(canBeArrow);
      if (refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr)) {
          refDestructuringErrors.parenthesizedAssign = start;
        }
        if (refDestructuringErrors.parenthesizedBind < 0) {
          refDestructuringErrors.parenthesizedBind = start;
        }
      }
      return expr;

    case types.bracketL:
      node = this.startNode();
      this.next();
      node.elements = this.parseExprList(types.bracketR, true, true, refDestructuringErrors);
      return this.finishNode(node, "ArrayExpression");

    case types.braceL:
      return this.parseObj(false, refDestructuringErrors);

    case types._function:
      node = this.startNode();
      this.next();
      return this.parseFunction(node, false);

    case types._class:
      return this.parseClass(this.startNode(), false);

    case types._new:
      return this.parseNew();

    case types.backQuote:
      return this.parseTemplate();

    default:
      this.unexpected();
  }
};

pp$3.parseLiteral = function (value) {
  var node = this.startNode();
  node.value = value;
  node.raw = this.input.slice(this.start, this.end);
  this.next();
  return this.finishNode(node, "Literal");
};

pp$3.parseParenExpression = function () {
  this.expect(types.parenL);
  var val = this.parseExpression();
  this.expect(types.parenR);
  return val;
};

pp$3.parseParenAndDistinguishExpression = function (canBeArrow) {
  var this$1 = this;

  var startPos = this.start,
      startLoc = this.startLoc,
      val,
      allowTrailingComma = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();

    var innerStartPos = this.start,
        innerStartLoc = this.startLoc;
    var exprList = [],
        first = true,
        lastIsComma = false;
    var refDestructuringErrors = new DestructuringErrors(),
        oldYieldPos = this.yieldPos,
        oldAwaitPos = this.awaitPos,
        spreadStart;
    this.yieldPos = 0;
    this.awaitPos = 0;
    while (this.type !== types.parenR) {
      first ? first = false : this$1.expect(types.comma);
      if (allowTrailingComma && this$1.afterTrailingComma(types.parenR, true)) {
        lastIsComma = true;
        break;
      } else if (this$1.type === types.ellipsis) {
        spreadStart = this$1.start;
        exprList.push(this$1.parseParenItem(this$1.parseRestBinding()));
        if (this$1.type === types.comma) {
          this$1.raise(this$1.start, "Comma is not permitted after the rest element");
        }
        break;
      } else {
        exprList.push(this$1.parseMaybeAssign(false, refDestructuringErrors, this$1.parseParenItem));
      }
    }
    var innerEndPos = this.start,
        innerEndLoc = this.startLoc;
    this.expect(types.parenR);

    if (canBeArrow && !this.canInsertSemicolon() && this.eat(types.arrow)) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      return this.parseParenArrowList(startPos, startLoc, exprList);
    }

    if (!exprList.length || lastIsComma) {
      this.unexpected(this.lastTokStart);
    }
    if (spreadStart) {
      this.unexpected(spreadStart);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;

    if (exprList.length > 1) {
      val = this.startNodeAt(innerStartPos, innerStartLoc);
      val.expressions = exprList;
      this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
    } else {
      val = exprList[0];
    }
  } else {
    val = this.parseParenExpression();
  }

  if (this.options.preserveParens) {
    var par = this.startNodeAt(startPos, startLoc);
    par.expression = val;
    return this.finishNode(par, "ParenthesizedExpression");
  } else {
    return val;
  }
};

pp$3.parseParenItem = function (item) {
  return item;
};

pp$3.parseParenArrowList = function (startPos, startLoc, exprList) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList);
};

// New's precedence is slightly tricky. It must allow its argument to
// be a `[]` or dot subscript expression, but not a call — at least,
// not without wrapping it in parentheses. Thus, it uses the noCalls
// argument to parseSubscripts to prevent it from consuming the
// argument list.

var empty$1 = [];

pp$3.parseNew = function () {
  var node = this.startNode();
  var meta = this.parseIdent(true);
  if (this.options.ecmaVersion >= 6 && this.eat(types.dot)) {
    node.meta = meta;
    var containsEsc = this.containsEsc;
    node.property = this.parseIdent(true);
    if (node.property.name !== "target" || containsEsc) {
      this.raiseRecoverable(node.property.start, "The only valid meta property for new is new.target");
    }
    if (!this.inFunction) {
      this.raiseRecoverable(node.start, "new.target can only be used in functions");
    }
    return this.finishNode(node, "MetaProperty");
  }
  var startPos = this.start,
      startLoc = this.startLoc;
  node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true);
  if (this.eat(types.parenL)) {
    node.arguments = this.parseExprList(types.parenR, this.options.ecmaVersion >= 8, false);
  } else {
    node.arguments = empty$1;
  }
  return this.finishNode(node, "NewExpression");
};

// Parse template expression.

pp$3.parseTemplateElement = function (ref) {
  var isTagged = ref.isTagged;

  var elem = this.startNode();
  if (this.type === types.invalidTemplate) {
    if (!isTagged) {
      this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
    }
    elem.value = {
      raw: this.value,
      cooked: null
    };
  } else {
    elem.value = {
      raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
      cooked: this.value
    };
  }
  this.next();
  elem.tail = this.type === types.backQuote;
  return this.finishNode(elem, "TemplateElement");
};

pp$3.parseTemplate = function (ref) {
  var this$1 = this;
  if (ref === void 0) ref = {};
  var isTagged = ref.isTagged;if (isTagged === void 0) isTagged = false;

  var node = this.startNode();
  this.next();
  node.expressions = [];
  var curElt = this.parseTemplateElement({ isTagged: isTagged });
  node.quasis = [curElt];
  while (!curElt.tail) {
    this$1.expect(types.dollarBraceL);
    node.expressions.push(this$1.parseExpression());
    this$1.expect(types.braceR);
    node.quasis.push(curElt = this$1.parseTemplateElement({ isTagged: isTagged }));
  }
  this.next();
  return this.finishNode(node, "TemplateLiteral");
};

pp$3.isAsyncProp = function (prop) {
  return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" && (this.type === types.name || this.type === types.num || this.type === types.string || this.type === types.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};

// Parse an object literal or binding pattern.

pp$3.parseObj = function (isPattern, refDestructuringErrors) {
  var this$1 = this;

  var node = this.startNode(),
      first = true,
      propHash = {};
  node.properties = [];
  this.next();
  while (!this.eat(types.braceR)) {
    if (!first) {
      this$1.expect(types.comma);
      if (this$1.afterTrailingComma(types.braceR)) {
        break;
      }
    } else {
      first = false;
    }

    var prop = this$1.parseProperty(isPattern, refDestructuringErrors);
    if (!isPattern) {
      this$1.checkPropClash(prop, propHash, refDestructuringErrors);
    }
    node.properties.push(prop);
  }
  return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
};

pp$3.parseProperty = function (isPattern, refDestructuringErrors) {
  var prop = this.startNode(),
      isGenerator,
      isAsync,
      startPos,
      startLoc;
  if (this.options.ecmaVersion >= 9 && this.eat(types.ellipsis)) {
    if (isPattern) {
      prop.argument = this.parseIdent(false);
      if (this.type === types.comma) {
        this.raise(this.start, "Comma is not permitted after the rest element");
      }
      return this.finishNode(prop, "RestElement");
    }
    // To disallow parenthesized identifier via `this.toAssignable()`.
    if (this.type === types.parenL && refDestructuringErrors) {
      if (refDestructuringErrors.parenthesizedAssign < 0) {
        refDestructuringErrors.parenthesizedAssign = this.start;
      }
      if (refDestructuringErrors.parenthesizedBind < 0) {
        refDestructuringErrors.parenthesizedBind = this.start;
      }
    }
    // Parse argument.
    prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    // To disallow trailing comma via `this.toAssignable()`.
    if (this.type === types.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
      refDestructuringErrors.trailingComma = this.start;
    }
    // Finish
    return this.finishNode(prop, "SpreadElement");
  }
  if (this.options.ecmaVersion >= 6) {
    prop.method = false;
    prop.shorthand = false;
    if (isPattern || refDestructuringErrors) {
      startPos = this.start;
      startLoc = this.startLoc;
    }
    if (!isPattern) {
      isGenerator = this.eat(types.star);
    }
  }
  var containsEsc = this.containsEsc;
  this.parsePropertyName(prop);
  if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
    isAsync = true;
    isGenerator = this.options.ecmaVersion >= 9 && this.eat(types.star);
    this.parsePropertyName(prop, refDestructuringErrors);
  } else {
    isAsync = false;
  }
  this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
  return this.finishNode(prop, "Property");
};

pp$3.parsePropertyValue = function (prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
  if ((isGenerator || isAsync) && this.type === types.colon) {
    this.unexpected();
  }

  if (this.eat(types.colon)) {
    prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
    prop.kind = "init";
  } else if (this.options.ecmaVersion >= 6 && this.type === types.parenL) {
    if (isPattern) {
      this.unexpected();
    }
    prop.kind = "init";
    prop.method = true;
    prop.value = this.parseMethod(isGenerator, isAsync);
  } else if (!isPattern && !containsEsc && this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && this.type != types.comma && this.type != types.braceR) {
    if (isGenerator || isAsync) {
      this.unexpected();
    }
    prop.kind = prop.key.name;
    this.parsePropertyName(prop);
    prop.value = this.parseMethod(false);
    var paramCount = prop.kind === "get" ? 0 : 1;
    if (prop.value.params.length !== paramCount) {
      var start = prop.value.start;
      if (prop.kind === "get") {
        this.raiseRecoverable(start, "getter should have no params");
      } else {
        this.raiseRecoverable(start, "setter should have exactly one param");
      }
    } else {
      if (prop.kind === "set" && prop.value.params[0].type === "RestElement") {
        this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
      }
    }
  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
    this.checkUnreserved(prop.key);
    prop.kind = "init";
    if (isPattern) {
      prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
    } else if (this.type === types.eq && refDestructuringErrors) {
      if (refDestructuringErrors.shorthandAssign < 0) {
        refDestructuringErrors.shorthandAssign = this.start;
      }
      prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
    } else {
      prop.value = prop.key;
    }
    prop.shorthand = true;
  } else {
    this.unexpected();
  }
};

pp$3.parsePropertyName = function (prop) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(types.bracketL)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssign();
      this.expect(types.bracketR);
      return prop.key;
    } else {
      prop.computed = false;
    }
  }
  return prop.key = this.type === types.num || this.type === types.string ? this.parseExprAtom() : this.parseIdent(true);
};

// Initialize empty function node.

pp$3.initFunction = function (node) {
  node.id = null;
  if (this.options.ecmaVersion >= 6) {
    node.generator = false;
    node.expression = false;
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = false;
  }
};

// Parse object or class method.

pp$3.parseMethod = function (isGenerator, isAsync) {
  var node = this.startNode(),
      oldInGen = this.inGenerator,
      oldInAsync = this.inAsync,
      oldYieldPos = this.yieldPos,
      oldAwaitPos = this.awaitPos,
      oldInFunc = this.inFunction;

  this.initFunction(node);
  if (this.options.ecmaVersion >= 6) {
    node.generator = isGenerator;
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }

  this.inGenerator = node.generator;
  this.inAsync = node.async;
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.inFunction = true;
  this.enterFunctionScope();

  this.expect(types.parenL);
  node.params = this.parseBindingList(types.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
  this.parseFunctionBody(node, false);

  this.inGenerator = oldInGen;
  this.inAsync = oldInAsync;
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.inFunction = oldInFunc;
  return this.finishNode(node, "FunctionExpression");
};

// Parse arrow function expression with given parameters.

pp$3.parseArrowExpression = function (node, params, isAsync) {
  var oldInGen = this.inGenerator,
      oldInAsync = this.inAsync,
      oldYieldPos = this.yieldPos,
      oldAwaitPos = this.awaitPos,
      oldInFunc = this.inFunction;

  this.enterFunctionScope();
  this.initFunction(node);
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }

  this.inGenerator = false;
  this.inAsync = node.async;
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.inFunction = true;

  node.params = this.toAssignableList(params, true);
  this.parseFunctionBody(node, true);

  this.inGenerator = oldInGen;
  this.inAsync = oldInAsync;
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.inFunction = oldInFunc;
  return this.finishNode(node, "ArrowFunctionExpression");
};

// Parse function body and check parameters.

pp$3.parseFunctionBody = function (node, isArrowFunction) {
  var isExpression = isArrowFunction && this.type !== types.braceL;
  var oldStrict = this.strict,
      useStrict = false;

  if (isExpression) {
    node.body = this.parseMaybeAssign();
    node.expression = true;
    this.checkParams(node, false);
  } else {
    var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
    if (!oldStrict || nonSimple) {
      useStrict = this.strictDirective(this.end);
      // If this is a strict mode function, verify that argument names
      // are not repeated, and it does not try to bind the words `eval`
      // or `arguments`.
      if (useStrict && nonSimple) {
        this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list");
      }
    }
    // Start a new scope with regard to labels and the `inFunction`
    // flag (restore them to their old value afterwards).
    var oldLabels = this.labels;
    this.labels = [];
    if (useStrict) {
      this.strict = true;
    }

    // Add the params to varDeclaredNames to ensure that an error is thrown
    // if a let/const declaration in the function clashes with one of the params.
    this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && this.isSimpleParamList(node.params));
    node.body = this.parseBlock(false);
    node.expression = false;
    this.adaptDirectivePrologue(node.body.body);
    this.labels = oldLabels;
  }
  this.exitFunctionScope();

  if (this.strict && node.id) {
    // Ensure the function name isn't a forbidden identifier in strict mode, e.g. 'eval'
    this.checkLVal(node.id, "none");
  }
  this.strict = oldStrict;
};

pp$3.isSimpleParamList = function (params) {
  for (var i = 0, list = params; i < list.length; i += 1) {
    var param = list[i];

    if (param.type !== "Identifier") {
      return false;
    }
  }
  return true;
};

// Checks function params for various disallowed patterns such as using "eval"
// or "arguments" and duplicate parameters.

pp$3.checkParams = function (node, allowDuplicates) {
  var this$1 = this;

  var nameHash = {};
  for (var i = 0, list = node.params; i < list.length; i += 1) {
    var param = list[i];

    this$1.checkLVal(param, "var", allowDuplicates ? null : nameHash);
  }
};

// Parses a comma-separated list of expressions, and returns them as
// an array. `close` is the token type that ends the list, and
// `allowEmpty` can be turned on to allow subsequent commas with
// nothing in between them to be parsed as `null` (which is needed
// for array literals).

pp$3.parseExprList = function (close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
  var this$1 = this;

  var elts = [],
      first = true;
  while (!this.eat(close)) {
    if (!first) {
      this$1.expect(types.comma);
      if (allowTrailingComma && this$1.afterTrailingComma(close)) {
        break;
      }
    } else {
      first = false;
    }

    var elt = void 0;
    if (allowEmpty && this$1.type === types.comma) {
      elt = null;
    } else if (this$1.type === types.ellipsis) {
      elt = this$1.parseSpread(refDestructuringErrors);
      if (refDestructuringErrors && this$1.type === types.comma && refDestructuringErrors.trailingComma < 0) {
        refDestructuringErrors.trailingComma = this$1.start;
      }
    } else {
      elt = this$1.parseMaybeAssign(false, refDestructuringErrors);
    }
    elts.push(elt);
  }
  return elts;
};

pp$3.checkUnreserved = function (ref) {
  var start = ref.start;
  var end = ref.end;
  var name = ref.name;

  if (this.inGenerator && name === "yield") {
    this.raiseRecoverable(start, "Can not use 'yield' as identifier inside a generator");
  }
  if (this.inAsync && name === "await") {
    this.raiseRecoverable(start, "Can not use 'await' as identifier inside an async function");
  }
  if (this.isKeyword(name)) {
    this.raise(start, "Unexpected keyword '" + name + "'");
  }
  if (this.options.ecmaVersion < 6 && this.input.slice(start, end).indexOf("\\") != -1) {
    return;
  }
  var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
  if (re.test(name)) {
    if (!this.inAsync && name === "await") {
      this.raiseRecoverable(start, "Can not use keyword 'await' outside an async function");
    }
    this.raiseRecoverable(start, "The keyword '" + name + "' is reserved");
  }
};

// Parse the next token as an identifier. If `liberal` is true (used
// when parsing properties), it will also convert keywords into
// identifiers.

pp$3.parseIdent = function (liberal, isBinding) {
  var node = this.startNode();
  if (liberal && this.options.allowReserved == "never") {
    liberal = false;
  }
  if (this.type === types.name) {
    node.name = this.value;
  } else if (this.type.keyword) {
    node.name = this.type.keyword;

    // To fix https://github.com/acornjs/acorn/issues/575
    // `class` and `function` keywords push new context into this.context.
    // But there is no chance to pop the context if the keyword is consumed as an identifier such as a property name.
    // If the previous token is a dot, this does not apply because the context-managing code already ignored the keyword
    if ((node.name === "class" || node.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
      this.context.pop();
    }
  } else {
    this.unexpected();
  }
  this.next();
  this.finishNode(node, "Identifier");
  if (!liberal) {
    this.checkUnreserved(node);
  }
  return node;
};

// Parses yield expression inside generator.

pp$3.parseYield = function () {
  if (!this.yieldPos) {
    this.yieldPos = this.start;
  }

  var node = this.startNode();
  this.next();
  if (this.type == types.semi || this.canInsertSemicolon() || this.type != types.star && !this.type.startsExpr) {
    node.delegate = false;
    node.argument = null;
  } else {
    node.delegate = this.eat(types.star);
    node.argument = this.parseMaybeAssign();
  }
  return this.finishNode(node, "YieldExpression");
};

pp$3.parseAwait = function () {
  if (!this.awaitPos) {
    this.awaitPos = this.start;
  }

  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeUnary(null, true);
  return this.finishNode(node, "AwaitExpression");
};

var pp$4 = Parser.prototype;

// This function is used to raise exceptions on parse errors. It
// takes an offset integer (into the current `input`) to indicate
// the location of the error, attaches the position to the end
// of the error message, and then raises a `SyntaxError` with that
// message.

pp$4.raise = function (pos, message) {
  var loc = getLineInfo(this.input, pos);
  message += " (" + loc.line + ":" + loc.column + ")";
  var err = new SyntaxError(message);
  err.pos = pos;err.loc = loc;err.raisedAt = this.pos;
  throw err;
};

pp$4.raiseRecoverable = pp$4.raise;

pp$4.curPosition = function () {
  if (this.options.locations) {
    return new Position(this.curLine, this.pos - this.lineStart);
  }
};

var pp$5 = Parser.prototype;

// Object.assign polyfill
var assign = Object.assign || function (target) {
  var sources = [],
      len = arguments.length - 1;
  while (len-- > 0) {
    sources[len] = arguments[len + 1];
  }for (var i = 0, list = sources; i < list.length; i += 1) {
    var source = list[i];

    for (var key in source) {
      if (has(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

// The functions in this module keep track of declared variables in the current scope in order to detect duplicate variable names.

pp$5.enterFunctionScope = function () {
  // var: a hash of var-declared names in the current lexical scope
  // lexical: a hash of lexically-declared names in the current lexical scope
  // childVar: a hash of var-declared names in all child lexical scopes of the current lexical scope (within the current function scope)
  // parentLexical: a hash of lexically-declared names in all parent lexical scopes of the current lexical scope (within the current function scope)
  this.scopeStack.push({ var: {}, lexical: {}, childVar: {}, parentLexical: {} });
};

pp$5.exitFunctionScope = function () {
  this.scopeStack.pop();
};

pp$5.enterLexicalScope = function () {
  var parentScope = this.scopeStack[this.scopeStack.length - 1];
  var childScope = { var: {}, lexical: {}, childVar: {}, parentLexical: {} };

  this.scopeStack.push(childScope);
  assign(childScope.parentLexical, parentScope.lexical, parentScope.parentLexical);
};

pp$5.exitLexicalScope = function () {
  var childScope = this.scopeStack.pop();
  var parentScope = this.scopeStack[this.scopeStack.length - 1];

  assign(parentScope.childVar, childScope.var, childScope.childVar);
};

/**
 * A name can be declared with `var` if there are no variables with the same name declared with `let`/`const`
 * in the current lexical scope or any of the parent lexical scopes in this function.
 */
pp$5.canDeclareVarName = function (name) {
  var currentScope = this.scopeStack[this.scopeStack.length - 1];

  return !has(currentScope.lexical, name) && !has(currentScope.parentLexical, name);
};

/**
 * A name can be declared with `let`/`const` if there are no variables with the same name declared with `let`/`const`
 * in the current scope, and there are no variables with the same name declared with `var` in the current scope or in
 * any child lexical scopes in this function.
 */
pp$5.canDeclareLexicalName = function (name) {
  var currentScope = this.scopeStack[this.scopeStack.length - 1];

  return !has(currentScope.lexical, name) && !has(currentScope.var, name) && !has(currentScope.childVar, name);
};

pp$5.declareVarName = function (name) {
  this.scopeStack[this.scopeStack.length - 1].var[name] = true;
};

pp$5.declareLexicalName = function (name) {
  this.scopeStack[this.scopeStack.length - 1].lexical[name] = true;
};

var Node = function Node(parser, pos, loc) {
  this.type = "";
  this.start = pos;
  this.end = 0;
  if (parser.options.locations) {
    this.loc = new SourceLocation(parser, loc);
  }
  if (parser.options.directSourceFile) {
    this.sourceFile = parser.options.directSourceFile;
  }
  if (parser.options.ranges) {
    this.range = [pos, 0];
  }
};

// Start an AST node, attaching a start offset.

var pp$6 = Parser.prototype;

pp$6.startNode = function () {
  return new Node(this, this.start, this.startLoc);
};

pp$6.startNodeAt = function (pos, loc) {
  return new Node(this, pos, loc);
};

// Finish an AST node, adding `type` and `end` properties.

function finishNodeAt(node, type, pos, loc) {
  node.type = type;
  node.end = pos;
  if (this.options.locations) {
    node.loc.end = loc;
  }
  if (this.options.ranges) {
    node.range[1] = pos;
  }
  return node;
}

pp$6.finishNode = function (node, type) {
  return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
};

// Finish node at given position

pp$6.finishNodeAt = function (node, type, pos, loc) {
  return finishNodeAt.call(this, node, type, pos, loc);
};

// The algorithm used to determine whether a regexp can appear at a
// given point in the program is loosely based on sweet.js' approach.
// See https://github.com/mozilla/sweet.js/wiki/design

var TokContext = function TokContext(token, isExpr, preserveSpace, override, generator) {
  this.token = token;
  this.isExpr = !!isExpr;
  this.preserveSpace = !!preserveSpace;
  this.override = override;
  this.generator = !!generator;
};

var types$1 = {
  b_stat: new TokContext("{", false),
  b_expr: new TokContext("{", true),
  b_tmpl: new TokContext("${", false),
  p_stat: new TokContext("(", false),
  p_expr: new TokContext("(", true),
  q_tmpl: new TokContext("`", true, true, function (p) {
    return p.tryReadTemplateToken();
  }),
  f_stat: new TokContext("function", false),
  f_expr: new TokContext("function", true),
  f_expr_gen: new TokContext("function", true, false, null, true),
  f_gen: new TokContext("function", false, false, null, true)
};

var pp$7 = Parser.prototype;

pp$7.initialContext = function () {
  return [types$1.b_stat];
};

pp$7.braceIsBlock = function (prevType) {
  var parent = this.curContext();
  if (parent === types$1.f_expr || parent === types$1.f_stat) {
    return true;
  }
  if (prevType === types.colon && (parent === types$1.b_stat || parent === types$1.b_expr)) {
    return !parent.isExpr;
  }

  // The check for `tt.name && exprAllowed` detects whether we are
  // after a `yield` or `of` construct. See the `updateContext` for
  // `tt.name`.
  if (prevType === types._return || prevType == types.name && this.exprAllowed) {
    return lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
  }
  if (prevType === types._else || prevType === types.semi || prevType === types.eof || prevType === types.parenR || prevType == types.arrow) {
    return true;
  }
  if (prevType == types.braceL) {
    return parent === types$1.b_stat;
  }
  if (prevType == types._var || prevType == types.name) {
    return false;
  }
  return !this.exprAllowed;
};

pp$7.inGeneratorContext = function () {
  var this$1 = this;

  for (var i = this.context.length - 1; i >= 1; i--) {
    var context = this$1.context[i];
    if (context.token === "function") {
      return context.generator;
    }
  }
  return false;
};

pp$7.updateContext = function (prevType) {
  var update,
      type = this.type;
  if (type.keyword && prevType == types.dot) {
    this.exprAllowed = false;
  } else if (update = type.updateContext) {
    update.call(this, prevType);
  } else {
    this.exprAllowed = type.beforeExpr;
  }
};

// Token-specific context update code

types.parenR.updateContext = types.braceR.updateContext = function () {
  if (this.context.length == 1) {
    this.exprAllowed = true;
    return;
  }
  var out = this.context.pop();
  if (out === types$1.b_stat && this.curContext().token === "function") {
    out = this.context.pop();
  }
  this.exprAllowed = !out.isExpr;
};

types.braceL.updateContext = function (prevType) {
  this.context.push(this.braceIsBlock(prevType) ? types$1.b_stat : types$1.b_expr);
  this.exprAllowed = true;
};

types.dollarBraceL.updateContext = function () {
  this.context.push(types$1.b_tmpl);
  this.exprAllowed = true;
};

types.parenL.updateContext = function (prevType) {
  var statementParens = prevType === types._if || prevType === types._for || prevType === types._with || prevType === types._while;
  this.context.push(statementParens ? types$1.p_stat : types$1.p_expr);
  this.exprAllowed = true;
};

types.incDec.updateContext = function () {
  // tokExprAllowed stays unchanged
};

types._function.updateContext = types._class.updateContext = function (prevType) {
  if (prevType.beforeExpr && prevType !== types.semi && prevType !== types._else && !((prevType === types.colon || prevType === types.braceL) && this.curContext() === types$1.b_stat)) {
    this.context.push(types$1.f_expr);
  } else {
    this.context.push(types$1.f_stat);
  }
  this.exprAllowed = false;
};

types.backQuote.updateContext = function () {
  if (this.curContext() === types$1.q_tmpl) {
    this.context.pop();
  } else {
    this.context.push(types$1.q_tmpl);
  }
  this.exprAllowed = false;
};

types.star.updateContext = function (prevType) {
  if (prevType == types._function) {
    var index = this.context.length - 1;
    if (this.context[index] === types$1.f_expr) {
      this.context[index] = types$1.f_expr_gen;
    } else {
      this.context[index] = types$1.f_gen;
    }
  }
  this.exprAllowed = true;
};

types.name.updateContext = function (prevType) {
  var allowed = false;
  if (this.options.ecmaVersion >= 6) {
    if (this.value == "of" && !this.exprAllowed || this.value == "yield" && this.inGeneratorContext()) {
      allowed = true;
    }
  }
  this.exprAllowed = allowed;
};

// Object type used to represent tokens. Note that normally, tokens
// simply exist as properties on the parser object. This is only
// used for the onToken callback and the external tokenizer.

var Token = function Token(p) {
  this.type = p.type;
  this.value = p.value;
  this.start = p.start;
  this.end = p.end;
  if (p.options.locations) {
    this.loc = new SourceLocation(p, p.startLoc, p.endLoc);
  }
  if (p.options.ranges) {
    this.range = [p.start, p.end];
  }
};

// ## Tokenizer

var pp$8 = Parser.prototype;

// Are we running under Rhino?
var isRhino = (typeof Packages === "undefined" ? "undefined" : _typeof(Packages)) == "object" && Object.prototype.toString.call(Packages) == "[object JavaPackage]";

// Move to the next token

pp$8.next = function () {
  if (this.options.onToken) {
    this.options.onToken(new Token(this));
  }

  this.lastTokEnd = this.end;
  this.lastTokStart = this.start;
  this.lastTokEndLoc = this.endLoc;
  this.lastTokStartLoc = this.startLoc;
  this.nextToken();
};

pp$8.getToken = function () {
  this.next();
  return new Token(this);
};

// If we're in an ES6 environment, make parsers iterable
if (typeof Symbol !== "undefined") {
  pp$8[Symbol.iterator] = function () {
    var this$1 = this;

    return {
      next: function next() {
        var token = this$1.getToken();
        return {
          done: token.type === types.eof,
          value: token
        };
      }
    };
  };
}

// Toggle strict mode. Re-reads the next number or string to please
// pedantic tests (`"use strict"; 010;` should fail).

pp$8.curContext = function () {
  return this.context[this.context.length - 1];
};

// Read a single token, updating the parser object's token-related
// properties.

pp$8.nextToken = function () {
  var curContext = this.curContext();
  if (!curContext || !curContext.preserveSpace) {
    this.skipSpace();
  }

  this.start = this.pos;
  if (this.options.locations) {
    this.startLoc = this.curPosition();
  }
  if (this.pos >= this.input.length) {
    return this.finishToken(types.eof);
  }

  if (curContext.override) {
    return curContext.override(this);
  } else {
    this.readToken(this.fullCharCodeAtPos());
  }
};

pp$8.readToken = function (code) {
  // Identifier or keyword. '\uXXXX' sequences are allowed in
  // identifiers, so '\' also dispatches to that.
  if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 /* '\' */) {
      return this.readWord();
    }

  return this.getTokenFromCode(code);
};

pp$8.fullCharCodeAtPos = function () {
  var code = this.input.charCodeAt(this.pos);
  if (code <= 0xd7ff || code >= 0xe000) {
    return code;
  }
  var next = this.input.charCodeAt(this.pos + 1);
  return (code << 10) + next - 0x35fdc00;
};

pp$8.skipBlockComment = function () {
  var this$1 = this;

  var startLoc = this.options.onComment && this.curPosition();
  var start = this.pos,
      end = this.input.indexOf("*/", this.pos += 2);
  if (end === -1) {
    this.raise(this.pos - 2, "Unterminated comment");
  }
  this.pos = end + 2;
  if (this.options.locations) {
    lineBreakG.lastIndex = start;
    var match;
    while ((match = lineBreakG.exec(this.input)) && match.index < this.pos) {
      ++this$1.curLine;
      this$1.lineStart = match.index + match[0].length;
    }
  }
  if (this.options.onComment) {
    this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos, startLoc, this.curPosition());
  }
};

pp$8.skipLineComment = function (startSkip) {
  var this$1 = this;

  var start = this.pos;
  var startLoc = this.options.onComment && this.curPosition();
  var ch = this.input.charCodeAt(this.pos += startSkip);
  while (this.pos < this.input.length && !isNewLine(ch)) {
    ch = this$1.input.charCodeAt(++this$1.pos);
  }
  if (this.options.onComment) {
    this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos, startLoc, this.curPosition());
  }
};

// Called at the start of the parse and after every token. Skips
// whitespace and comments, and.

pp$8.skipSpace = function () {
  var this$1 = this;

  loop: while (this.pos < this.input.length) {
    var ch = this$1.input.charCodeAt(this$1.pos);
    switch (ch) {
      case 32:case 160:
        // ' '
        ++this$1.pos;
        break;
      case 13:
        if (this$1.input.charCodeAt(this$1.pos + 1) === 10) {
          ++this$1.pos;
        }
      case 10:case 8232:case 8233:
        ++this$1.pos;
        if (this$1.options.locations) {
          ++this$1.curLine;
          this$1.lineStart = this$1.pos;
        }
        break;
      case 47:
        // '/'
        switch (this$1.input.charCodeAt(this$1.pos + 1)) {
          case 42:
            // '*'
            this$1.skipBlockComment();
            break;
          case 47:
            this$1.skipLineComment(2);
            break;
          default:
            break loop;
        }
        break;
      default:
        if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
          ++this$1.pos;
        } else {
          break loop;
        }
    }
  }
};

// Called at the end of every token. Sets `end`, `val`, and
// maintains `context` and `exprAllowed`, and skips the space after
// the token, so that the next one's `start` will point at the
// right position.

pp$8.finishToken = function (type, val) {
  this.end = this.pos;
  if (this.options.locations) {
    this.endLoc = this.curPosition();
  }
  var prevType = this.type;
  this.type = type;
  this.value = val;

  this.updateContext(prevType);
};

// ### Token reading

// This is the function that is called to fetch the next token. It
// is somewhat obscure, because it works in character codes rather
// than characters, and because operator parsing has been inlined
// into it.
//
// All in the name of speed.
//
pp$8.readToken_dot = function () {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next >= 48 && next <= 57) {
    return this.readNumber(true);
  }
  var next2 = this.input.charCodeAt(this.pos + 2);
  if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
    // 46 = dot '.'
    this.pos += 3;
    return this.finishToken(types.ellipsis);
  } else {
    ++this.pos;
    return this.finishToken(types.dot);
  }
};

pp$8.readToken_slash = function () {
  // '/'
  var next = this.input.charCodeAt(this.pos + 1);
  if (this.exprAllowed) {
    ++this.pos;return this.readRegexp();
  }
  if (next === 61) {
    return this.finishOp(types.assign, 2);
  }
  return this.finishOp(types.slash, 1);
};

pp$8.readToken_mult_modulo_exp = function (code) {
  // '%*'
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  var tokentype = code === 42 ? types.star : types.modulo;

  // exponentiation operator ** and **=
  if (this.options.ecmaVersion >= 7 && code == 42 && next === 42) {
    ++size;
    tokentype = types.starstar;
    next = this.input.charCodeAt(this.pos + 2);
  }

  if (next === 61) {
    return this.finishOp(types.assign, size + 1);
  }
  return this.finishOp(tokentype, size);
};

pp$8.readToken_pipe_amp = function (code) {
  // '|&'
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    return this.finishOp(code === 124 ? types.logicalOR : types.logicalAND, 2);
  }
  if (next === 61) {
    return this.finishOp(types.assign, 2);
  }
  return this.finishOp(code === 124 ? types.bitwiseOR : types.bitwiseAND, 1);
};

pp$8.readToken_caret = function () {
  // '^'
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) {
    return this.finishOp(types.assign, 2);
  }
  return this.finishOp(types.bitwiseXOR, 1);
};

pp$8.readToken_plus_min = function (code) {
  // '+-'
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    if (next == 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) == 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
      // A `-->` line comment
      this.skipLineComment(3);
      this.skipSpace();
      return this.nextToken();
    }
    return this.finishOp(types.incDec, 2);
  }
  if (next === 61) {
    return this.finishOp(types.assign, 2);
  }
  return this.finishOp(types.plusMin, 1);
};

pp$8.readToken_lt_gt = function (code) {
  // '<>'
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  if (next === code) {
    size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
    if (this.input.charCodeAt(this.pos + size) === 61) {
      return this.finishOp(types.assign, size + 1);
    }
    return this.finishOp(types.bitShift, size);
  }
  if (next == 33 && code == 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) == 45 && this.input.charCodeAt(this.pos + 3) == 45) {
    // `<!--`, an XML-style comment that should be interpreted as a line comment
    this.skipLineComment(4);
    this.skipSpace();
    return this.nextToken();
  }
  if (next === 61) {
    size = 2;
  }
  return this.finishOp(types.relational, size);
};

pp$8.readToken_eq_excl = function (code) {
  // '=!'
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) {
    return this.finishOp(types.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
  }
  if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) {
    // '=>'
    this.pos += 2;
    return this.finishToken(types.arrow);
  }
  return this.finishOp(code === 61 ? types.eq : types.prefix, 1);
};

pp$8.getTokenFromCode = function (code) {
  switch (code) {
    // The interpretation of a dot depends on whether it is followed
    // by a digit or another two dots.
    case 46:
      // '.'
      return this.readToken_dot();

    // Punctuation tokens.
    case 40:
      ++this.pos;return this.finishToken(types.parenL);
    case 41:
      ++this.pos;return this.finishToken(types.parenR);
    case 59:
      ++this.pos;return this.finishToken(types.semi);
    case 44:
      ++this.pos;return this.finishToken(types.comma);
    case 91:
      ++this.pos;return this.finishToken(types.bracketL);
    case 93:
      ++this.pos;return this.finishToken(types.bracketR);
    case 123:
      ++this.pos;return this.finishToken(types.braceL);
    case 125:
      ++this.pos;return this.finishToken(types.braceR);
    case 58:
      ++this.pos;return this.finishToken(types.colon);
    case 63:
      ++this.pos;return this.finishToken(types.question);

    case 96:
      // '`'
      if (this.options.ecmaVersion < 6) {
        break;
      }
      ++this.pos;
      return this.finishToken(types.backQuote);

    case 48:
      // '0'
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 120 || next === 88) {
        return this.readRadixNumber(16);
      } // '0x', '0X' - hex number
      if (this.options.ecmaVersion >= 6) {
        if (next === 111 || next === 79) {
          return this.readRadixNumber(8);
        } // '0o', '0O' - octal number
        if (next === 98 || next === 66) {
          return this.readRadixNumber(2);
        } // '0b', '0B' - binary number
      }

    // Anything else beginning with a digit is an integer, octal
    // number, or float.
    case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
      // 1-9
      return this.readNumber(false);

    // Quotes produce strings.
    case 34:case 39:
      // '"', "'"
      return this.readString(code);

    // Operators are parsed inline in tiny state machines. '=' (61) is
    // often referred to. `finishOp` simply skips the amount of
    // characters it is given as second argument, and returns a token
    // of the type given by its first argument.

    case 47:
      // '/'
      return this.readToken_slash();

    case 37:case 42:
      // '%*'
      return this.readToken_mult_modulo_exp(code);

    case 124:case 38:
      // '|&'
      return this.readToken_pipe_amp(code);

    case 94:
      // '^'
      return this.readToken_caret();

    case 43:case 45:
      // '+-'
      return this.readToken_plus_min(code);

    case 60:case 62:
      // '<>'
      return this.readToken_lt_gt(code);

    case 61:case 33:
      // '=!'
      return this.readToken_eq_excl(code);

    case 126:
      // '~'
      return this.finishOp(types.prefix, 1);
  }

  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};

pp$8.finishOp = function (type, size) {
  var str = this.input.slice(this.pos, this.pos + size);
  this.pos += size;
  return this.finishToken(type, str);
};

// Parse a regular expression. Some context-awareness is necessary,
// since a '/' inside a '[]' set does not end the expression.

function tryCreateRegexp(src, flags, throwErrorAt, parser) {
  try {
    return new RegExp(src, flags);
  } catch (e) {
    if (throwErrorAt !== undefined) {
      if (e instanceof SyntaxError) {
        parser.raise(throwErrorAt, "Error parsing regular expression: " + e.message);
      }
      throw e;
    }
  }
}

var regexpUnicodeSupport = !!tryCreateRegexp("\uFFFF", "u");

pp$8.readRegexp = function () {
  var this$1 = this;

  var escaped,
      inClass,
      start = this.pos;
  for (;;) {
    if (this$1.pos >= this$1.input.length) {
      this$1.raise(start, "Unterminated regular expression");
    }
    var ch = this$1.input.charAt(this$1.pos);
    if (lineBreak.test(ch)) {
      this$1.raise(start, "Unterminated regular expression");
    }
    if (!escaped) {
      if (ch === "[") {
        inClass = true;
      } else if (ch === "]" && inClass) {
        inClass = false;
      } else if (ch === "/" && !inClass) {
        break;
      }
      escaped = ch === "\\";
    } else {
      escaped = false;
    }
    ++this$1.pos;
  }
  var content = this.input.slice(start, this.pos);
  ++this.pos;
  var flagsStart = this.pos;
  var mods = this.readWord1();
  if (this.containsEsc) {
    this.unexpected(flagsStart);
  }

  var tmp = content,
      tmpFlags = "";
  if (mods) {
    var validFlags = "gim";
    if (this.options.ecmaVersion >= 6) {
      validFlags += "uy";
    }
    if (this.options.ecmaVersion >= 9) {
      validFlags += "s";
    }
    for (var i = 0; i < mods.length; i++) {
      var mod = mods.charAt(i);
      if (validFlags.indexOf(mod) == -1) {
        this$1.raise(start, "Invalid regular expression flag");
      }
      if (mods.indexOf(mod, i + 1) > -1) {
        this$1.raise(start, "Duplicate regular expression flag");
      }
    }
    if (mods.indexOf("u") >= 0) {
      if (regexpUnicodeSupport) {
        tmpFlags = "u";
      } else {
        // Replace each astral symbol and every Unicode escape sequence that
        // possibly represents an astral symbol or a paired surrogate with a
        // single ASCII symbol to avoid throwing on regular expressions that
        // are only valid in combination with the `/u` flag.
        // Note: replacing with the ASCII symbol `x` might cause false
        // negatives in unlikely scenarios. For example, `[\u{61}-b]` is a
        // perfectly valid pattern that is equivalent to `[a-b]`, but it would
        // be replaced by `[x-b]` which throws an error.
        tmp = tmp.replace(/\\u\{([0-9a-fA-F]+)\}/g, function (_match, code, offset) {
          code = Number("0x" + code);
          if (code > 0x10FFFF) {
            this$1.raise(start + offset + 3, "Code point out of bounds");
          }
          return "x";
        });
        tmp = tmp.replace(/\\u([a-fA-F0-9]{4})|[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "x");
        tmpFlags = tmpFlags.replace("u", "");
      }
    }
  }
  // Detect invalid regular expressions.
  var value = null;
  // Rhino's regular expression parser is flaky and throws uncatchable exceptions,
  // so don't do detection if we are running under Rhino
  if (!isRhino) {
    tryCreateRegexp(tmp, tmpFlags, start, this);
    // Get a regular expression object for this pattern-flag pair, or `null` in
    // case the current environment doesn't support the flags it uses.
    value = tryCreateRegexp(content, mods);
  }
  return this.finishToken(types.regexp, { pattern: content, flags: mods, value: value });
};

// Read an integer in the given radix. Return null if zero digits
// were read, the integer value otherwise. When `len` is given, this
// will return `null` unless the integer has exactly `len` digits.

pp$8.readInt = function (radix, len) {
  var this$1 = this;

  var start = this.pos,
      total = 0;
  for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
    var code = this$1.input.charCodeAt(this$1.pos),
        val = void 0;
    if (code >= 97) {
      val = code - 97 + 10;
    } // a
    else if (code >= 65) {
        val = code - 65 + 10;
      } // A
      else if (code >= 48 && code <= 57) {
          val = code - 48;
        } // 0-9
        else {
            val = Infinity;
          }
    if (val >= radix) {
      break;
    }
    ++this$1.pos;
    total = total * radix + val;
  }
  if (this.pos === start || len != null && this.pos - start !== len) {
    return null;
  }

  return total;
};

pp$8.readRadixNumber = function (radix) {
  this.pos += 2; // 0x
  var val = this.readInt(radix);
  if (val == null) {
    this.raise(this.start + 2, "Expected number in radix " + radix);
  }
  if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  return this.finishToken(types.num, val);
};

// Read an integer, octal integer, or floating-point number.

pp$8.readNumber = function (startsWithDot) {
  var start = this.pos;
  if (!startsWithDot && this.readInt(10) === null) {
    this.raise(start, "Invalid number");
  }
  var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
  if (octal && this.strict) {
    this.raise(start, "Invalid number");
  }
  if (octal && /[89]/.test(this.input.slice(start, this.pos))) {
    octal = false;
  }
  var next = this.input.charCodeAt(this.pos);
  if (next === 46 && !octal) {
    // '.'
    ++this.pos;
    this.readInt(10);
    next = this.input.charCodeAt(this.pos);
  }
  if ((next === 69 || next === 101) && !octal) {
    // 'eE'
    next = this.input.charCodeAt(++this.pos);
    if (next === 43 || next === 45) {
      ++this.pos;
    } // '+-'
    if (this.readInt(10) === null) {
      this.raise(start, "Invalid number");
    }
  }
  if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }

  var str = this.input.slice(start, this.pos);
  var val = octal ? parseInt(str, 8) : parseFloat(str);
  return this.finishToken(types.num, val);
};

// Read a string value, interpreting backslash-escapes.

pp$8.readCodePoint = function () {
  var ch = this.input.charCodeAt(this.pos),
      code;

  if (ch === 123) {
    // '{'
    if (this.options.ecmaVersion < 6) {
      this.unexpected();
    }
    var codePos = ++this.pos;
    code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
    ++this.pos;
    if (code > 0x10FFFF) {
      this.invalidStringToken(codePos, "Code point out of bounds");
    }
  } else {
    code = this.readHexChar(4);
  }
  return code;
};

function codePointToString(code) {
  // UTF-16 Decoding
  if (code <= 0xFFFF) {
    return String.fromCharCode(code);
  }
  code -= 0x10000;
  return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00);
}

pp$8.readString = function (quote) {
  var this$1 = this;

  var out = "",
      chunkStart = ++this.pos;
  for (;;) {
    if (this$1.pos >= this$1.input.length) {
      this$1.raise(this$1.start, "Unterminated string constant");
    }
    var ch = this$1.input.charCodeAt(this$1.pos);
    if (ch === quote) {
      break;
    }
    if (ch === 92) {
      // '\'
      out += this$1.input.slice(chunkStart, this$1.pos);
      out += this$1.readEscapedChar(false);
      chunkStart = this$1.pos;
    } else {
      if (isNewLine(ch)) {
        this$1.raise(this$1.start, "Unterminated string constant");
      }
      ++this$1.pos;
    }
  }
  out += this.input.slice(chunkStart, this.pos++);
  return this.finishToken(types.string, out);
};

// Reads template string tokens.

var INVALID_TEMPLATE_ESCAPE_ERROR = {};

pp$8.tryReadTemplateToken = function () {
  this.inTemplateElement = true;
  try {
    this.readTmplToken();
  } catch (err) {
    if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
      this.readInvalidTemplateToken();
    } else {
      throw err;
    }
  }

  this.inTemplateElement = false;
};

pp$8.invalidStringToken = function (position, message) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
    throw INVALID_TEMPLATE_ESCAPE_ERROR;
  } else {
    this.raise(position, message);
  }
};

pp$8.readTmplToken = function () {
  var this$1 = this;

  var out = "",
      chunkStart = this.pos;
  for (;;) {
    if (this$1.pos >= this$1.input.length) {
      this$1.raise(this$1.start, "Unterminated template");
    }
    var ch = this$1.input.charCodeAt(this$1.pos);
    if (ch === 96 || ch === 36 && this$1.input.charCodeAt(this$1.pos + 1) === 123) {
      // '`', '${'
      if (this$1.pos === this$1.start && (this$1.type === types.template || this$1.type === types.invalidTemplate)) {
        if (ch === 36) {
          this$1.pos += 2;
          return this$1.finishToken(types.dollarBraceL);
        } else {
          ++this$1.pos;
          return this$1.finishToken(types.backQuote);
        }
      }
      out += this$1.input.slice(chunkStart, this$1.pos);
      return this$1.finishToken(types.template, out);
    }
    if (ch === 92) {
      // '\'
      out += this$1.input.slice(chunkStart, this$1.pos);
      out += this$1.readEscapedChar(true);
      chunkStart = this$1.pos;
    } else if (isNewLine(ch)) {
      out += this$1.input.slice(chunkStart, this$1.pos);
      ++this$1.pos;
      switch (ch) {
        case 13:
          if (this$1.input.charCodeAt(this$1.pos) === 10) {
            ++this$1.pos;
          }
        case 10:
          out += "\n";
          break;
        default:
          out += String.fromCharCode(ch);
          break;
      }
      if (this$1.options.locations) {
        ++this$1.curLine;
        this$1.lineStart = this$1.pos;
      }
      chunkStart = this$1.pos;
    } else {
      ++this$1.pos;
    }
  }
};

// Reads a template token to search for the end, without validating any escape sequences
pp$8.readInvalidTemplateToken = function () {
  var this$1 = this;

  for (; this.pos < this.input.length; this.pos++) {
    switch (this$1.input[this$1.pos]) {
      case "\\":
        ++this$1.pos;
        break;

      case "$":
        if (this$1.input[this$1.pos + 1] !== "{") {
          break;
        }
      // falls through

      case "`":
        return this$1.finishToken(types.invalidTemplate, this$1.input.slice(this$1.start, this$1.pos));

      // no default
    }
  }
  this.raise(this.start, "Unterminated template");
};

// Used to read escaped characters

pp$8.readEscapedChar = function (inTemplate) {
  var ch = this.input.charCodeAt(++this.pos);
  ++this.pos;
  switch (ch) {
    case 110:
      return "\n"; // 'n' -> '\n'
    case 114:
      return "\r"; // 'r' -> '\r'
    case 120:
      return String.fromCharCode(this.readHexChar(2)); // 'x'
    case 117:
      return codePointToString(this.readCodePoint()); // 'u'
    case 116:
      return "\t"; // 't' -> '\t'
    case 98:
      return "\b"; // 'b' -> '\b'
    case 118:
      return "\x0B"; // 'v' -> '\u000b'
    case 102:
      return "\f"; // 'f' -> '\f'
    case 13:
      if (this.input.charCodeAt(this.pos) === 10) {
        ++this.pos;
      } // '\r\n'
    case 10:
      // ' \n'
      if (this.options.locations) {
        this.lineStart = this.pos;++this.curLine;
      }
      return "";
    default:
      if (ch >= 48 && ch <= 55) {
        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
        var octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        this.pos += octalStr.length - 1;
        ch = this.input.charCodeAt(this.pos);
        if ((octalStr !== "0" || ch == 56 || ch == 57) && (this.strict || inTemplate)) {
          this.invalidStringToken(this.pos - 1 - octalStr.length, "Octal literal in strict mode");
        }
        return String.fromCharCode(octal);
      }
      return String.fromCharCode(ch);
  }
};

// Used to read character escape sequences ('\x', '\u', '\U').

pp$8.readHexChar = function (len) {
  var codePos = this.pos;
  var n = this.readInt(16, len);
  if (n === null) {
    this.invalidStringToken(codePos, "Bad character escape sequence");
  }
  return n;
};

// Read an identifier, and return it as a string. Sets `this.containsEsc`
// to whether the word contained a '\u' escape.
//
// Incrementally adds only escaped chars, adding other chunks as-is
// as a micro-optimization.

pp$8.readWord1 = function () {
  var this$1 = this;

  this.containsEsc = false;
  var word = "",
      first = true,
      chunkStart = this.pos;
  var astral = this.options.ecmaVersion >= 6;
  while (this.pos < this.input.length) {
    var ch = this$1.fullCharCodeAtPos();
    if (isIdentifierChar(ch, astral)) {
      this$1.pos += ch <= 0xffff ? 1 : 2;
    } else if (ch === 92) {
      // "\"
      this$1.containsEsc = true;
      word += this$1.input.slice(chunkStart, this$1.pos);
      var escStart = this$1.pos;
      if (this$1.input.charCodeAt(++this$1.pos) != 117) // "u"
        {
          this$1.invalidStringToken(this$1.pos, "Expecting Unicode escape sequence \\uXXXX");
        }
      ++this$1.pos;
      var esc = this$1.readCodePoint();
      if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral)) {
        this$1.invalidStringToken(escStart, "Invalid Unicode escape");
      }
      word += codePointToString(esc);
      chunkStart = this$1.pos;
    } else {
      break;
    }
    first = false;
  }
  return word + this.input.slice(chunkStart, this.pos);
};

// Read an identifier or keyword token. Will check for reserved
// words when necessary.

pp$8.readWord = function () {
  var word = this.readWord1();
  var type = types.name;
  if (this.keywords.test(word)) {
    if (this.containsEsc) {
      this.raiseRecoverable(this.start, "Escape sequence in keyword " + word);
    }
    type = keywords$1[word];
  }
  return this.finishToken(type, word);
};

// The main exported interface (under `self.acorn` when in the
// browser) is a `parse` function that takes a code string and
// returns an abstract syntax tree as specified by [Mozilla parser
// API][api].
//
// [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API

function parse(input, options) {
  return new Parser(options, input).parse();
}

var ScopeVar = /** @class */function () {
  function ScopeVar(kind, value) {
    this.value = value;
    this.kind = kind;
  }
  ScopeVar.prototype.$set = function (value) {
    if (this.value === 'const') {
      return false;
    } else {
      this.value = value;
      return true;
    }
  };
  ScopeVar.prototype.$get = function () {
    return this.value;
  };
  return ScopeVar;
}();
var Scope = /** @class */function () {
  function Scope(type, parent, label) {
    this.prefix = '@';
    this.type = type;
    this.parent = parent || null;
    this.content = {};
    this.invasived = false;
  }
  Scope.prototype.$find = function (raw_name) {
    var name = this.prefix + raw_name;
    if (this.content.hasOwnProperty(name)) {
      return this.content[name];
    } else if (this.parent) {
      return this.parent.$find(raw_name);
    } else {
      return null;
    }
  };
  Scope.prototype.$let = function (raw_name, value) {
    var name = this.prefix + raw_name;
    var $var = this.content[name];
    if (!$var) {
      this.content[name] = new ScopeVar('let', value);
      return true;
    } else {
      return false;
    }
  };
  Scope.prototype.$const = function (raw_name, value) {
    var name = this.prefix + raw_name;
    var $var = this.content[name];
    if (!$var) {
      this.content[name] = new ScopeVar('const', value);
      return true;
    } else {
      return false;
    }
  };
  Scope.prototype.$var = function (raw_name, value) {
    var name = this.prefix + raw_name;
    var scope = this;
    while (scope.parent !== null && scope.type !== 'function') {
      scope = scope.parent;
    }
    var $var = scope.content[name];
    if (!$var) {
      this.content[name] = new ScopeVar('var', value);
      return true;
    } else {
      return false;
    }
  };
  Scope.prototype.$declar = function (kind, raw_name, value) {
    var _this = this;
    return {
      'var': function _var() {
        return _this.$var(raw_name, value);
      },
      'let': function _let() {
        return _this.$let(raw_name, value);
      },
      'const': function _const() {
        return _this.$const(raw_name, value);
      }
    }[kind]();
  };
  return Scope;
}();

var BREAK_SINGAL = {};
var CONTINUE_SINGAL = {};
var RETURN_SINGAL = { result: undefined };
var evaluate_map = {
  Program: function Program(program, scope) {
    for (var _i = 0, _a = program.body; _i < _a.length; _i++) {
      var node = _a[_i];
      evaluate(node, scope);
    }
  },
  Identifier: function Identifier(node, scope) {
    if (node.name === 'undefined') {
      return undefined;
    } // 奇怪的问题
    var $var = scope.$find(node.name);
    if ($var) {
      return $var.$get();
    } // 返回
    else {
        throw "[Error] " + node.loc + ", '" + node.name + "' \u672A\u5B9A\u4E49";
      }
  },
  Literal: function Literal(node, scope) {
    return node.value;
  },
  BlockStatement: function BlockStatement(block, scope) {
    var new_scope = scope.invasived ? scope : new Scope('block', scope);
    for (var _i = 0, _a = block.body; _i < _a.length; _i++) {
      var node = _a[_i];
      var result = evaluate(node, new_scope);
      if (result === BREAK_SINGAL || result === CONTINUE_SINGAL || result === RETURN_SINGAL) {
        return result;
      }
    }
  },
  EmptyStatement: function EmptyStatement(node, scope) {},
  DebuggerStatement: function DebuggerStatement(node, scope) {
    debugger;
  },
  ExpressionStatement: function ExpressionStatement(node, scope) {
    evaluate(node.expression, scope);
  },
  ReturnStatement: function ReturnStatement(node, scope) {
    RETURN_SINGAL.result = node.argument ? evaluate(node.argument, scope) : undefined;
    return RETURN_SINGAL;
  },
  LabeledStatement: function LabeledStatement(node, scope) {
    node.type + " \u672A\u5B9E\u73B0";
  },
  BreakStatement: function BreakStatement(node, scope) {
    return BREAK_SINGAL;
  },
  ContinueStatement: function ContinueStatement(node, scope) {
    return CONTINUE_SINGAL;
  },
  IfStatement: function IfStatement(node, scope) {
    if (evaluate(node.test, scope)) return evaluate(node.consequent, scope);else if (node.alternate) return evaluate(node.alternate, scope);
  },
  SwitchStatement: function SwitchStatement(node, scope) {
    var discriminant = evaluate(node.discriminant, scope);
    var new_scope = new Scope('switch', scope);
    var matched = false;
    for (var _i = 0, _a = node.cases; _i < _a.length; _i++) {
      var $case = _a[_i];
      // 进行匹配相应的 case
      if (!matched && (!$case.test || discriminant === evaluate($case.test, new_scope))) {
        matched = true;
      }
      if (matched) {
        var result = evaluate($case, new_scope);
        if (result === BREAK_SINGAL) {
          break;
        } else if (result === CONTINUE_SINGAL || result === RETURN_SINGAL) {
          return result;
        }
      }
    }
  },
  SwitchCase: function SwitchCase(node, scope) {
    for (var _i = 0, _a = node.consequent; _i < _a.length; _i++) {
      var stmt = _a[_i];
      var result = evaluate(stmt, scope);
      if (result === BREAK_SINGAL || result === CONTINUE_SINGAL || result === RETURN_SINGAL) {
        return result;
      }
    }
  },
  WithStatement: function WithStatement(node, scope) {
    throw '因为 with 很多问题，已经被基本弃用了，不实现';
  },
  ThrowStatement: function ThrowStatement(node, scope) {
    throw evaluate(node.argument, scope);
  },
  TryStatement: function TryStatement(node, scope) {
    try {
      return evaluate(node.block, scope);
    } catch (err) {
      if (node.handler) {
        var param = node.handler.param;
        var new_scope = new Scope('block', scope);
        new_scope.invasived = true; // 标记为侵入式Scope，不用再多构造啦
        new_scope.$const(param.name, err);
        return evaluate(node.handler, new_scope);
      } else {
        throw err;
      }
    } finally {
      if (node.finalizer) return evaluate(node.finalizer, scope);
    }
  },
  CatchClause: function CatchClause(node, scope) {
    return evaluate(node.body, scope);
  },
  WhileStatement: function WhileStatement(node, scope) {
    while (evaluate(node.test, scope)) {
      var new_scope = new Scope('loop', scope);
      new_scope.invasived = true;
      var result = evaluate(node.body, new_scope);
      if (result === BREAK_SINGAL) {
        break;
      } else if (result === CONTINUE_SINGAL) {
        continue;
      } else if (result === RETURN_SINGAL) {
        return result;
      }
    }
  },
  DoWhileStatement: function DoWhileStatement(node, scope) {
    do {
      var new_scope = new Scope('loop', scope);
      new_scope.invasived = true;
      var result = evaluate(node.body, new_scope);
      if (result === BREAK_SINGAL) {
        break;
      } else if (result === CONTINUE_SINGAL) {
        continue;
      } else if (result === RETURN_SINGAL) {
        return result;
      }
    } while (evaluate(node.test, scope));
  },
  ForStatement: function ForStatement(node, scope) {
    for (var new_scope = new Scope('loop', scope), init_val = node.init ? evaluate(node.init, new_scope) : null; node.test ? evaluate(node.test, new_scope) : true; node.update ? evaluate(node.update, new_scope) : void 0) {
      var result = evaluate(node.body, new_scope);
      if (result === BREAK_SINGAL) {
        break;
      } else if (result === CONTINUE_SINGAL) {
        continue;
      } else if (result === RETURN_SINGAL) {
        return result;
      }
    }
  },
  ForInStatement: function ForInStatement(node, scope) {
    var kind = node.left.kind;
    var decl = node.left.declarations[0];
    var name = decl.id.name;
    for (var value in evaluate(node.right, scope)) {
      var new_scope = new Scope('loop', scope);
      new_scope.invasived = true;
      scope.$declar(kind, name, value);
      var result = evaluate(node.body, new_scope);
      if (result === BREAK_SINGAL) {
        break;
      } else if (result === CONTINUE_SINGAL) {
        continue;
      } else if (result === RETURN_SINGAL) {
        return result;
      }
    }
  },
  FunctionDeclaration: function FunctionDeclaration(node, scope) {
    var func = evaluate_map.FunctionExpression(node, scope);
    var func_name = node.id.name;
    if (!scope.$const(func_name, func)) {
      throw "[Error] " + name + " \u91CD\u590D\u5B9A\u4E49";
    }
  },
  VariableDeclaration: function VariableDeclaration(node, scope) {
    var kind = node.kind;
    for (var _i = 0, _a = node.declarations; _i < _a.length; _i++) {
      var declartor = _a[_i];
      var name_1 = declartor.id.name;
      var value = declartor.init ? evaluate(declartor.init, scope) : undefined;
      if (!scope.$declar(kind, name_1, value)) {
        throw "[Error] " + name_1 + " \u91CD\u590D\u5B9A\u4E49";
      }
    }
  },
  VariableDeclarator: function VariableDeclarator(node, scope) {
    throw '执行这里就错了';
  },
  ThisExpression: function ThisExpression(node, scope) {
    var this_val = scope.$find('this');
    return this_val ? this_val.$get() : null;
  },
  ArrayExpression: function ArrayExpression(node, scope) {
    return node.elements.map(function (item) {
      return evaluate(item, scope);
    });
  },
  ObjectExpression: function ObjectExpression(node, scope) {
    var object = {};
    for (var _i = 0, _a = node.properties; _i < _a.length; _i++) {
      var property = _a[_i];
      var kind = property.kind;
      var key = void 0;
      if (property.key.type === 'Literal') {
        key = evaluate(property.key, scope);
      } else if (property.key.type === 'Identifier') {
        key = property.key.name;
      } else {
        throw '这里绝对就错了';
      }
      var value = evaluate(property.value, scope);
      if (kind === 'init') {
        object[key] = value;
      } else if (kind === 'set') {
        Object.defineProperty(object, key, { set: value });
      } else if (kind === 'get') {
        Object.defineProperty(object, key, { get: value });
      } else {
        throw '这里绝对就错了';
      }
    }
    return object;
  },
  FunctionExpression: function FunctionExpression(node, scope) {
    return function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var new_scope = new Scope('function', scope);
      new_scope.invasived = true;
      for (var i = 0; i < node.params.length; i++) {
        var name_2 = node.params[i].name;
        new_scope.$const(name_2, args[i]);
      }
      new_scope.$const('this', this);
      new_scope.$const('arguments', arguments);
      var result = evaluate(node.body, new_scope);
      if (result === RETURN_SINGAL) {
        return result.result;
      }
    };
  },
  UnaryExpression: function UnaryExpression(node, scope) {
    return {
      '-': function _() {
        return -evaluate(node.argument, scope);
      },
      '+': function _() {
        return +evaluate(node.argument, scope);
      },
      '!': function _() {
        return !evaluate(node.argument, scope);
      },
      '~': function _() {
        return ~evaluate(node.argument, scope);
      },
      'void': function _void() {
        return void evaluate(node.argument, scope);
      },
      'typeof': function _typeof$$1() {
        if (node.argument.type === 'Identifier') {
          var $var = scope.$find(node.argument.name);
          return $var ? _typeof($var.$get()) : 'undefined';
        } else {
          return _typeof(evaluate(node.argument, scope));
        }
      },
      'delete': function _delete() {
        // delete 是真麻烦
        if (node.argument.type === 'MemberExpression') {
          var _a = node.argument,
              object = _a.object,
              property = _a.property,
              computed = _a.computed;
          if (computed) {
            return delete evaluate(object, scope)[evaluate(property, scope)];
          } else {
            return delete evaluate(object, scope)[property.name];
          }
        } else if (node.argument.type === 'Identifier') {
          var $this = scope.$find('this');
          if ($this) return $this.$get()[node.argument.name];
        }
      }
    }[node.operator]();
  },
  UpdateExpression: function UpdateExpression(node, scope) {
    var prefix = node.prefix;
    var $var;
    if (node.argument.type === 'Identifier') {
      var name_3 = node.argument.name;
      $var = scope.$find(name_3);
      if (!$var) throw name_3 + " \u672A\u5B9A\u4E49";
    } else if (node.argument.type === 'MemberExpression') {
      var argument = node.argument;
      var object_1 = evaluate(argument.object, scope);
      var property_1 = argument.computed ? evaluate(argument.property, scope) : argument.property.name;
      $var = {
        $set: function $set(value) {
          object_1[property_1] = value;
          return true;
        },
        $get: function $get() {
          return object_1[property_1];
        }
      };
    }
    return {
      '--': function _(v) {
        return $var.$set(v - 1), prefix ? --v : v--;
      },
      '++': function _(v) {
        return $var.$set(v + 1), prefix ? ++v : v++;
      }
    }[node.operator](evaluate(node.argument, scope));
  },
  BinaryExpression: function BinaryExpression(node, scope) {
    return {
      "==": function _(a, b) {
        return a == b;
      },
      "!=": function _(a, b) {
        return a != b;
      },
      "===": function _(a, b) {
        return a === b;
      },
      "!==": function _(a, b) {
        return a !== b;
      },
      "<": function _(a, b) {
        return a < b;
      },
      "<=": function _(a, b) {
        return a <= b;
      },
      ">": function _(a, b) {
        return a > b;
      },
      ">=": function _(a, b) {
        return a >= b;
      },
      "<<": function _(a, b) {
        return a << b;
      },
      ">>": function _(a, b) {
        return a >> b;
      },
      ">>>": function _(a, b) {
        return a >>> b;
      },
      "+": function _(a, b) {
        return a + b;
      },
      "-": function _(a, b) {
        return a - b;
      },
      "*": function _(a, b) {
        return a * b;
      },
      "/": function _(a, b) {
        return a / b;
      },
      "%": function _(a, b) {
        return a % b;
      },
      "|": function _(a, b) {
        return a | b;
      },
      "^": function _(a, b) {
        return a ^ b;
      },
      "&": function _(a, b) {
        return a & b;
      },
      "in": function _in(a, b) {
        return a in b;
      },
      "instanceof": function _instanceof$$1(a, b) {
        return a instanceof b;
      }
    }[node.operator](evaluate(node.left, scope), evaluate(node.right, scope));
  },
  AssignmentExpression: function AssignmentExpression(node, scope) {
    var $var;
    if (node.left.type === 'Identifier') {
      var name_4 = node.left.name;
      var $var_or_not = scope.$find(name_4);
      if (!$var_or_not) throw name_4 + " \u672A\u5B9A\u4E49";
      $var = $var_or_not;
    } else if (node.left.type === 'MemberExpression') {
      var left = node.left;
      var object_2 = evaluate(left.object, scope);
      var property_2 = left.computed ? evaluate(left.property, scope) : left.property.name;
      $var = {
        $set: function $set(value) {
          object_2[property_2] = value;
          return true;
        },
        $get: function $get() {
          return object_2[property_2];
        }
      };
    } else {
      throw "\u5982\u679C\u51FA\u73B0\u5728\u8FD9\u91CC\uFF0C\u90A3\u5C31\u8BF4\u660E\u6709\u95EE\u9898\u4E86";
    }
    return {
      "=": function _(v) {
        return $var.$set(v), v;
      },
      "+=": function _(v) {
        return $var.$set($var.$get() + v), $var.$get();
      },
      "-=": function _(v) {
        return $var.$set($var.$get() - v), $var.$get();
      },
      "*=": function _(v) {
        return $var.$set($var.$get() * v), $var.$get();
      },
      "/=": function _(v) {
        return $var.$set($var.$get() / v), $var.$get();
      },
      "%=": function _(v) {
        return $var.$set($var.$get() % v), $var.$get();
      },
      "<<=": function _(v) {
        return $var.$set($var.$get() << v), $var.$get();
      },
      ">>=": function _(v) {
        return $var.$set($var.$get() >> v), $var.$get();
      },
      ">>>=": function _(v) {
        return $var.$set($var.$get() >>> v), $var.$get();
      },
      "|=": function _(v) {
        return $var.$set($var.$get() | v), $var.$get();
      },
      "^=": function _(v) {
        return $var.$set($var.$get() ^ v), $var.$get();
      },
      "&=": function _(v) {
        return $var.$set($var.$get() & v), $var.$get();
      }
    }[node.operator](evaluate(node.right, scope));
  },
  LogicalExpression: function LogicalExpression(node, scope) {
    return {
      "||": function _() {
        return evaluate(node.left, scope) || evaluate(node.right, scope);
      },
      "&&": function _() {
        return evaluate(node.left, scope) && evaluate(node.right, scope);
      }
    }[node.operator]();
  },
  MemberExpression: function MemberExpression(node, scope) {
    var object = node.object,
        property = node.property,
        computed = node.computed;
    if (computed) {
      return evaluate(object, scope)[evaluate(property, scope)];
    } else {
      return evaluate(object, scope)[property.name];
    }
  },
  ConditionalExpression: function ConditionalExpression(node, scope) {
    return evaluate(node.test, scope) ? evaluate(node.consequent, scope) : evaluate(node.alternate, scope);
  },
  CallExpression: function CallExpression(node, scope) {
    var func = evaluate(node.callee, scope);
    var args = node.arguments.map(function (arg) {
      return evaluate(arg, scope);
    });
    // 心疼自己
    if (node.callee.type === 'MemberExpression') {
      var object = evaluate(node.callee.object, scope);
      return func.apply(object, args);
    } else {
      var this_val = scope.$find('this');
      return func.apply(this_val ? this_val.$get() : null, args);
    }
  },
  NewExpression: function NewExpression(node, scope) {
    var func = evaluate(node.callee, scope);
    var args = node.arguments.map(function (arg) {
      return evaluate(arg, scope);
    });
    return new (func.bind.apply(func, [null].concat(args)))();
  },
  SequenceExpression: function SequenceExpression(node, scope) {
    var last;
    for (var _i = 0, _a = node.expressions; _i < _a.length; _i++) {
      var expr = _a[_i];
      last = evaluate(expr, scope);
    }
    return last;
  },
  Property: function Property(node, scope, computed) {
    throw '这里如果被执行了那也是错的...';
  },
  // 下面是 es6 / es7 特性, 先不做处理
  ClassExpression: function ClassExpression(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  RestElement: function RestElement(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  MetaProperty: function MetaProperty(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  AwaitExpression: function AwaitExpression(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  Super: function Super(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  SpreadElement: function SpreadElement(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  TemplateElement: function TemplateElement(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  ClassDeclaration: function ClassDeclaration(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  TaggedTemplateExpression: function TaggedTemplateExpression(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  MethodDefinition: function MethodDefinition(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  AssignmentPattern: function AssignmentPattern(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  ObjectPattern: function ObjectPattern(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  ArrayPattern: function ArrayPattern(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  ForOfStatement: function ForOfStatement(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  TemplateLiteral: function TemplateLiteral(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  ClassBody: function ClassBody(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  ImportDeclaration: function ImportDeclaration(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  ExportNamedDeclaration: function ExportNamedDeclaration(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  ExportDefaultDeclaration: function ExportDefaultDeclaration(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  ExportAllDeclaration: function ExportAllDeclaration(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  ImportSpecifier: function ImportSpecifier(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  ImportDefaultSpecifier: function ImportDefaultSpecifier(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  ImportNamespaceSpecifier: function ImportNamespaceSpecifier(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  ExportSpecifier: function ExportSpecifier(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  YieldExpression: function YieldExpression(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  },
  ArrowFunctionExpression: function ArrowFunctionExpression(node, scope) {
    throw node.type + " \u672A\u5B9E\u73B0";
  }
};
var evaluate = function evaluate(node, scope, arg) {
  var _evalute = evaluate_map[node.type];
  return _evalute(node, scope, arg);
};

var options = {
  ecmaVersion: 5,
  sourceType: 'script',
  locations: true
};
// 导出默认对象
var default_api = {
  console: console,
  setTimeout: setTimeout,
  setInterval: setInterval,
  clearTimeout: clearTimeout,
  clearInterval: clearInterval,
  encodeURI: encodeURI,
  encodeURIComponent: encodeURIComponent,
  decodeURI: decodeURI,
  decodeURIComponent: decodeURIComponent,
  escape: escape,
  unescape: unescape,
  Infinity: Infinity,
  NaN: NaN,
  isFinite: isFinite,
  isNaN: isNaN,
  parseFloat: parseFloat,
  parseInt: parseInt,
  Object: Object,
  Boolean: Boolean,
  Error: Error,
  EvalError: EvalError,
  RangeError: RangeError,
  ReferenceError: ReferenceError,
  SyntaxError: SyntaxError,
  TypeError: TypeError,
  URIError: URIError,
  Number: Number,
  Math: Math,
  Date: Date,
  String: String,
  RegExp: RegExp,
  Array: Array,
  JSON: JSON,
  Promise: Promise
};
function run(code, append_api) {
  if (append_api === void 0) {
    append_api = {};
  }
  var scope = new Scope('block');
  scope.$const('this', this);
  for (var _i = 0, _a = Object.getOwnPropertyNames(default_api); _i < _a.length; _i++) {
    var name_1 = _a[_i];
    scope.$const(name_1, default_api[name_1]);
  }
  for (var _b = 0, _c = Object.getOwnPropertyNames(append_api); _b < _c.length; _b++) {
    var name_2 = _c[_b];
    scope.$const(name_2, append_api[name_2]);
  }
  // 定义 module
  var $exports = {};
  var $module = { 'exports': $exports };
  scope.$const('module', $module);
  scope.$const('exports', $exports);
  evaluate(parse(code, options), scope);
  // exports
  var module_var = scope.$find('module');
  return module_var ? module_var.$get().exports : null;
}

// const interpreter = require('./interpreter');

var _appendApis = Object.create(null);

var interpreter = {
  clearApi: function clearApi() {
    _appendApis = Object.create(null);
  },
  appendApis: function appendApis() {
    var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    Object.keys(v).forEach(function (key) {
      _appendApis[key] = v[key];
    });
  },
  run: function run$$1(code) {
    var appendApi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return run(code, Object.assign(_appendApis, appendApi));
  }
};

var ob$1 = {};
var degToRads = Math.PI / 180;

// function length(arr1, arr2) {
//   if (typeof arr1 === 'number' || arr1 instanceof Number) {
//     arr2 = arr2 || 0;
//     return Math.abs(arr1 - arr2);
//   }
//   if (!arr2) {
//     arr2 = helperLengthArray;
//   }
//   let i;
//   let len = Math.min(arr1.length, arr2.length);
//   let addedLength = 0;
//   for (i = 0; i < len; i += 1) {
//     addedLength += Math.pow(arr2[i] - arr1[i], 2);
//   }
//   return Math.sqrt(addedLength);
// }

// function normalize(vec) {
//   return div(vec, length(vec));
// }

// function rgbToHsl(val) {
//   let r = val[0];
//   let g = val[1];
//   let b = val[2];
//   let max = Math.max(r, g, b),
//     min = Math.min(r, g, b);
//   let h,
//     s,
//     l = (max + min) / 2;

//   if (max == min) {
//     h = s = 0; // achromatic
//   } else {
//     let d = max - min;
//     s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
//     switch (max) {
//       case r:
//         h = (g - b) / d + (g < b ? 6 : 0);
//         break;
//       case g:
//         h = (b - r) / d + 2;
//         break;
//       case b:
//         h = (r - g) / d + 4;
//         break;
//     }
//     h /= 6;
//   }

//   return [h, s, l, val[3]];
// }

// function hue2rgb(p, q, t) {
//   if (t < 0) {
//     t += 1;
//   }
//   if (t > 1) {
//     t -= 1;
//   }
//   if (t < 1 / 6) return p + (q - p) * 6 * t;
//   if (t < 1 / 2) return q;
//   if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
//   return p;
// }

// function hslToRgb(val) {
//   let h = val[0];
//   let s = val[1];
//   let l = val[2];

//   let r,
//     g,
//     b;

//   if (s === 0) {
//     r = g = b = l; // achromatic
//   } else {
//     let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
//     let p = 2 * l - q;
//     r = hue2rgb(p, q, h + 1 / 3);
//     g = hue2rgb(p, q, h);
//     b = hue2rgb(p, q, h - 1 / 3);
//   }

//   return [r, g, b, val[3]];
// }

// function linear(t, tMin, tMax, value1, value2) {
//   if (value1 === undefined || value2 === undefined) {
//     return linear(t, 0, 1, tMin, tMax);
//   }
//   if (t <= tMin) {
//     return value1;
//   } else if (t >= tMax) {
//     return value2;
//   }
//   let perc = tMax === tMin ? 0 : (t - tMin) / (tMax - tMin);
//   if (!value1.length) {
//     return value1 + (value2 - value1) * perc;
//   }
//   let i;
//   let len = value1.length;
//   let arr = createTypedArray('float32', len);
//   for (i = 0; i < len; i += 1) {
//     arr[i] = value1[i] + (value2[i] - value1[i]) * perc;
//   }
//   return arr;
// }

// function random(min, max) {
//   if (max === undefined) {
//     if (min === undefined) {
//       min = 0;
//       max = 1;
//     } else {
//       max = min;
//       min = undefined;
//     }
//   }
//   if (max.length) {
//     let i;
//     let len = max.length;
//     if (!min) {
//       min = createTypedArray('float32', len);
//     }
//     let arr = createTypedArray('float32', len);
//     let rnd = BMMath.random();
//     for (i = 0; i < len; i += 1) {
//       arr[i] = min[i] + rnd * (max[i] - min[i]);
//     }
//     return arr;
//   }
//   if (min === undefined) {
//     min = 0;
//   }
//   let rndm = BMMath.random();
//   return min + rndm * (max - min);
// }

// function createPath(points, inTangents, outTangents, closed) {
//   let i;
//   let len = points.length;
//   let path = shape_pool.newElement();
//   path.setPathData(!!closed, len);
//   let arrPlaceholder = [0, 0];
//   let inVertexPoint;
//   let outVertexPoint;
//   for (i = 0; i < len; i += 1) {
//     inVertexPoint = inTangents ? inTangents[i] : arrPlaceholder;
//     outVertexPoint = outTangents ? outTangents[i] : arrPlaceholder;
//     path.setTripleAt(points[i][0], points[i][1], outVertexPoint[0] + points[i][0], outVertexPoint[1] + points[i][1], inVertexPoint[0] + points[i][0], inVertexPoint[1] + points[i][1], i, true);
//   }
//   return path;
// }

function initiateExpression(elem, data, property) {
  var val = data.x;
  var needsVelocity = /velocity(?![\w\d])/.test(val);
  var _needsRandom = val.indexOf('random') !== -1;
  var elemType = elem.data.ty;
  var transform = void 0;
  var content = void 0;
  var effect = void 0;
  var thisProperty = property;
  elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate;
  var inPoint = elem.data.ip / elem.comp.globalData.frameRate;
  var outPoint = elem.data.op / elem.comp.globalData.frameRate;
  var width = elem.data.sw ? elem.data.sw : 0;
  var height = elem.data.sh ? elem.data.sh : 0;
  var loopIn = void 0;
  var loopOut = void 0;
  var toWorld = void 0;
  var fromWorld = void 0;
  var fromComp = void 0;
  var toComp = void 0;
  var anchorPoint = void 0;
  var thisLayer = void 0;
  var thisComp = void 0;
  var mask = void 0;
  var valueAtTime = void 0;
  var velocityAtTime = void 0;
  var __expression_functions = [];
  var scoped_bm_rt = void 0;

  /** append Api */
  interpreter.appendApis({
    thisProperty: thisProperty,
    _needsRandom: _needsRandom,
    loopInDuration: loopInDuration,
    loopOutDuration: loopOutDuration,
    outPoint: outPoint,
    inPoint: inPoint,
    width: width,
    height: height,
    lookAt: lookAt,
    easeOut: easeOut,
    sourceRectAtTime: sourceRectAtTime,
    easeIn: easeIn,
    key: key,
    timeToFrames: timeToFrames,
    nearestKey: nearestKey,
    'scoped_bm_rt': scoped_bm_rt
  });

  if (data.xf) {
    var i = void 0;
    var len = data.xf.length;

    for (i = 0; i < len; i += 1) {
      // __expression_functions[i] = eval('(function(){ return ' + data.xf[i] + '}())');
      __expression_functions[i] = interpreter.run('module.exports = ' + data.xf[i]);
    }
  }

  // let expression_function = eval('[function _expression_function(){' + val + ';scoped_bm_rt=$bm_rt}' + ']')[0];

  var numKeys = property.kf ? data.k.length : 0;

  var wiggle = function wiggle(freq, amp) {
    var i = void 0;
    var j = void 0;
    var len = this.pv.length ? this.pv.length : 1;
    var addedAmps = createTypedArray('float32', len);
    freq = 5;
    var iterations = Math.floor(time * freq);
    i = 0;
    j = 0;
    while (i < iterations) {
      // let rnd = BMMath.random();
      for (j = 0; j < len; j += 1) {
        addedAmps[j] += -amp + amp * 2 * Math.random();
        // addedAmps[j] += -amp + amp*2*rnd;
      }
      i += 1;
    }
    // let rnd2 = BMMath.random();
    var periods = time * freq;
    var perc = periods - Math.floor(periods);
    var arr = createTypedArray('float32', len);
    if (len > 1) {
      for (j = 0; j < len; j += 1) {
        arr[j] = this.pv[j] + addedAmps[j] + (-amp + amp * 2 * Math.random()) * perc;
        // arr[j] = this.pv[j] + addedAmps[j] + (-amp + amp*2*rnd)*perc;
        // arr[i] = this.pv[i] + addedAmp + amp1*perc + amp2*(1-perc);
      }
      return arr;
    }
    return this.pv + addedAmps[0] + (-amp + amp * 2 * Math.random()) * perc;
  }.bind(this);

  if (thisProperty.loopIn) {
    loopIn = thisProperty.loopIn.bind(thisProperty);
  }

  if (thisProperty.loopOut) {
    loopOut = thisProperty.loopOut.bind(thisProperty);
  }

  function loopInDuration(type, duration) {
    return loopIn(type, duration, true);
  }

  function loopOutDuration(type, duration) {
    return loopOut(type, duration, true);
  }

  if (this.getValueAtTime) {
    valueAtTime = this.getValueAtTime.bind(this);
  }

  if (this.getVelocityAtTime) {
    velocityAtTime = this.getVelocityAtTime.bind(this);
  }

  var comp = elem.comp.globalData.projectInterface.bind(elem.comp.globalData.projectInterface);

  function lookAt(elem1, elem2) {
    var fVec = [elem2[0] - elem1[0], elem2[1] - elem1[1], elem2[2] - elem1[2]];
    var pitch = Math.atan2(fVec[0], Math.sqrt(fVec[1] * fVec[1] + fVec[2] * fVec[2])) / degToRads;
    var yaw = -Math.atan2(fVec[1], fVec[2]) / degToRads;
    return [yaw, pitch, 0];
  }

  function easeOut(t, tMin, tMax, val1, val2) {
    if (val1 === undefined) {
      val1 = tMin;
      val2 = tMax;
    } else {
      t = (t - tMin) / (tMax - tMin);
    }
    return -(val2 - val1) * t * (t - 2) + val1;
  }

  function easeIn(t, tMin, tMax, val1, val2) {
    if (val1 === undefined) {
      val1 = tMin;
      val2 = tMax;
    } else {
      t = (t - tMin) / (tMax - tMin);
    }
    return (val2 - val1) * t * t + val1;
  }

  function nearestKey(time) {
    var i = void 0;
    var len = data.k.length;
    var index = void 0;
    var keyTime = void 0;
    if (!data.k.length || typeof data.k[0] === 'number') {
      index = 0;
      keyTime = 0;
    } else {
      index = -1;
      time *= elem.comp.globalData.frameRate;
      if (time < data.k[0].t) {
        index = 1;
        keyTime = data.k[0].t;
      } else {
        for (i = 0; i < len - 1; i += 1) {
          if (time === data.k[i].t) {
            index = i + 1;
            keyTime = data.k[i].t;
            break;
          } else if (time > data.k[i].t && time < data.k[i + 1].t) {
            if (time - data.k[i].t > data.k[i + 1].t - time) {
              index = i + 2;
              keyTime = data.k[i + 1].t;
            } else {
              index = i + 1;
              keyTime = data.k[i].t;
            }
            break;
          }
        }
        if (index === -1) {
          index = i + 1;
          keyTime = data.k[i].t;
        }
      }
    }
    var ob = {};
    ob.index = index;
    ob.time = keyTime / elem.comp.globalData.frameRate;
    return ob;
  }

  function key(ind) {
    var ob = void 0;
    var i = void 0;
    var len = void 0;
    if (!data.k.length || typeof data.k[0] === 'number') {
      throw new Error('The property has no keyframe at index ' + ind);
    }
    ind -= 1;
    ob = {
      time: data.k[ind].t / elem.comp.globalData.frameRate
    };
    var arr = void 0;
    if (ind === data.k.length - 1 && !data.k[ind].h) {
      arr = data.k[ind - 1].e;
    } else {
      arr = data.k[ind].s;
    }
    len = arr.length;
    for (i = 0; i < len; i += 1) {
      ob[i] = arr[i];
    }
    return ob;
  }

  function timeToFrames(t, fps) {
    if (!t && t !== 0) {
      t = time;
    }
    if (!fps) {
      fps = elem.comp.globalData.frameRate;
    }
    return t * fps;
  }

  function seedRandom(seed) {
    Math.seedrandom(randSeed + seed);
  }

  function sourceRectAtTime() {
    return elem.sourceRectAtTime();
  }

  var time = void 0;
  var velocity = void 0;
  var value = void 0;
  var textIndex = void 0;
  var textTotal = void 0;
  var selectorValue = void 0;
  var index = elem.data.ind;
  var hasParent = !!(elem.hierarchy && elem.hierarchy.length);
  var parent = void 0;
  var randSeed = Math.floor(Math.random() * 1000000);
  function executeExpression(_value) {
    value = _value;
    if (_needsRandom) {
      seedRandom(randSeed);
    }
    if (this.frameExpressionId === elem.globalData.frameId && this.propType !== 'textSelector') {
      return value;
    }
    if (this.propType === 'textSelector') {
      textIndex = this.textIndex;
      textTotal = this.textTotal;
      selectorValue = this.selectorValue;
    }
    if (!thisLayer) {
      thisLayer = elem.layerInterface;
      thisComp = elem.comp.compInterface;
      toWorld = thisLayer.toWorld.bind(thisLayer);
      fromWorld = thisLayer.fromWorld.bind(thisLayer);
      fromComp = thisLayer.fromComp.bind(thisLayer);
      toComp = thisLayer.toComp.bind(thisLayer);
      mask = thisLayer.mask ? thisLayer.mask.bind(thisLayer) : null;
    }
    if (!transform) {
      transform = elem.layerInterface('ADBE Transform Group');
      anchorPoint = transform.anchorPoint;
    }

    if (elemType === 4 && !content) {
      content = thisLayer('ADBE Root Vectors Group');
    }
    if (!effect) {
      effect = thisLayer(4);
    }
    hasParent = !!(elem.hierarchy && elem.hierarchy.length);
    if (hasParent && !parent) {
      parent = elem.hierarchy[0].layerInterface;
    }
    time = this.comp.renderedFrame / this.comp.globalData.frameRate;
    if (needsVelocity) {
      velocity = velocityAtTime(time);
    }

    try {
      interpreter.appendApis({
        'transform': transform
      });
      scoped_bm_rt = interpreter.run(val + ';module.exports = $bm_rt');
    } catch (error) {
      console.error(error);
    }

    this.frameExpressionId = elem.globalData.frameId;

    // TODO: Check if it's possible to return on ShapeInterface the .v value
    if (scoped_bm_rt.propType === 'shape') {
      scoped_bm_rt = factory.clone(scoped_bm_rt.v);
    }
    return scoped_bm_rt;
  }
  return executeExpression;
}

ob$1.initiateExpression = initiateExpression;

function getStaticValueAtTime() {
  return this.pv;
}

function loopOut(type, duration, durationFlag) {
  if (!this.k || !this.keyframes) {
    return this.pv;
  }
  type = type ? type.toLowerCase() : '';
  var currentFrame = this.comp.renderedFrame;
  var keyframes = this.keyframes;
  var lastKeyFrame = keyframes[keyframes.length - 1].t;
  if (currentFrame <= lastKeyFrame) {
    return this.pv;
  }
  var cycleDuration = void 0;
  var firstKeyFrame = void 0;
  if (!durationFlag) {
    if (!duration || duration > keyframes.length - 1) {
      duration = keyframes.length - 1;
    }
    firstKeyFrame = keyframes[keyframes.length - 1 - duration].t;
    cycleDuration = lastKeyFrame - firstKeyFrame;
  } else {
    if (!duration) {
      cycleDuration = Math.max(0, lastKeyFrame - this.elem.data.ip);
    } else {
      cycleDuration = Math.abs(lastKeyFrame - this.elem.comp.globalData.frameRate * duration);
    }
    firstKeyFrame = lastKeyFrame - cycleDuration;
  }
  var i = void 0;
  var len = void 0;
  var ret = void 0;
  if (type === 'pingpong') {
    var iterations = Math.floor((currentFrame - firstKeyFrame) / cycleDuration);
    if (iterations % 2 !== 0) {
      return this.getValueAtTime((cycleDuration - (currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0);
    }
  } else if (type === 'offset') {
    var initV = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0);
    var endV = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0);
    var current = this.getValueAtTime(((currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0);
    var repeats = Math.floor((currentFrame - firstKeyFrame) / cycleDuration);
    if (this.pv.length) {
      ret = new Array(initV.length);
      len = ret.length;
      for (i = 0; i < len; i += 1) {
        ret[i] = (endV[i] - initV[i]) * repeats + current[i];
      }
      return ret;
    }
    return (endV - initV) * repeats + current;
  } else if (type === 'continue') {
    var lastValue = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0);
    var nextLastValue = this.getValueAtTime((lastKeyFrame - 0.001) / this.comp.globalData.frameRate, 0);
    if (this.pv.length) {
      ret = new Array(lastValue.length);
      len = ret.length;
      for (i = 0; i < len; i += 1) {
        ret[i] = lastValue[i] + (lastValue[i] - nextLastValue[i]) * ((currentFrame - lastKeyFrame) / this.comp.globalData.frameRate) / 0.0005;
      }
      return ret;
    }
    return lastValue + (lastValue - nextLastValue) * ((currentFrame - lastKeyFrame) / 0.001);
  }
  return this.getValueAtTime(((currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0);
}

function loopIn(type, duration, durationFlag) {
  if (!this.k) {
    return this.pv;
  }
  type = type ? type.toLowerCase() : '';
  var currentFrame = this.comp.renderedFrame;
  var keyframes = this.keyframes;
  var firstKeyFrame = keyframes[0].t;
  if (currentFrame >= firstKeyFrame) {
    return this.pv;
  }
  var cycleDuration = void 0;
  var lastKeyFrame = void 0;
  if (!durationFlag) {
    if (!duration || duration > keyframes.length - 1) {
      duration = keyframes.length - 1;
    }
    lastKeyFrame = keyframes[duration].t;
    cycleDuration = lastKeyFrame - firstKeyFrame;
  } else {
    if (!duration) {
      cycleDuration = Math.max(0, this.elem.data.op - firstKeyFrame);
    } else {
      cycleDuration = Math.abs(this.elem.comp.globalData.frameRate * duration);
    }
    lastKeyFrame = firstKeyFrame + cycleDuration;
  }
  var i = void 0;
  var len = void 0;
  var ret = void 0;
  if (type === 'pingpong') {
    var iterations = Math.floor((firstKeyFrame - currentFrame) / cycleDuration);
    if (iterations % 2 === 0) {
      return this.getValueAtTime(((firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0);
    }
  } else if (type === 'offset') {
    var initV = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0);
    var endV = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0);
    var current = this.getValueAtTime((cycleDuration - (firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0);
    var repeats = Math.floor((firstKeyFrame - currentFrame) / cycleDuration) + 1;
    if (this.pv.length) {
      ret = new Array(initV.length);
      len = ret.length;
      for (i = 0; i < len; i += 1) {
        ret[i] = current[i] - (endV[i] - initV[i]) * repeats;
      }
      return ret;
    }
    return current - (endV - initV) * repeats;
  } else if (type === 'continue') {
    var firstValue = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0);
    var nextFirstValue = this.getValueAtTime((firstKeyFrame + 0.001) / this.comp.globalData.frameRate, 0);
    if (this.pv.length) {
      ret = new Array(firstValue.length);
      len = ret.length;
      for (i = 0; i < len; i += 1) {
        ret[i] = firstValue[i] + (firstValue[i] - nextFirstValue[i]) * (firstKeyFrame - currentFrame) / 0.001;
      }
      return ret;
    }
    return firstValue + (firstValue - nextFirstValue) * (firstKeyFrame - currentFrame) / 0.001;
  }
  return this.getValueAtTime((cycleDuration - (firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0);
}

function getValueAtTime(frameNum) {
  if (frameNum !== this._cachingAtTime.lastFrame) {
    frameNum *= this.elem.globalData.frameRate;
    frameNum -= this.offsetTime;
    this._cachingAtTime.lastIndex = this._cachingAtTime.lastFrame < frameNum ? this._cachingAtTime.lastIndex : 0;
    this._cachingAtTime.value = this.interpolateValue(frameNum, this._cachingAtTime);
    this._cachingAtTime.lastFrame = frameNum;
  }
  return this._cachingAtTime.value;
}

function getSpeedAtTime(frameNum) {
  var delta = -0.01;
  var v1 = this.getValueAtTime(frameNum);
  var v2 = this.getValueAtTime(frameNum + delta);
  var speed = 0;
  if (v1.length) {
    var i = void 0;
    for (i = 0; i < v1.length; i += 1) {
      speed += Math.pow(v2[i] - v1[i], 2);
    }
    speed = Math.sqrt(speed) * 100;
  } else {
    speed = 0;
  }
  return speed;
}

function getVelocityAtTime(frameNum) {
  if (this.vel !== undefined) {
    return this.vel;
  }
  var delta = -0.001;
  // frameNum += this.elem.data.st;
  var v1 = this.getValueAtTime(frameNum);
  var v2 = this.getValueAtTime(frameNum + delta);
  var velocity = void 0;
  if (v1.length) {
    velocity = createTypedArray('float32', v1.length);
    var i = void 0;
    for (i = 0; i < v1.length; i += 1) {
      // removing frameRate
      // if needed, don't add it here
      // velocity[i] = this.elem.globalData.frameRate*((v2[i] - v1[i])/delta);
      velocity[i] = (v2[i] - v1[i]) / delta;
    }
  } else {
    velocity = (v2 - v1) / delta;
  }
  return velocity;
}

function setGroupProperty(propertyGroup) {
  this.propertyGroup = propertyGroup;
}

function searchExpressions(elem, data, prop) {
  if (data.x) {
    prop.k = true;
    prop.x = true;
    prop.initiateExpression = ob$1.initiateExpression;
    prop.effectsSequence.push(prop.initiateExpression(elem, data, prop).bind(prop));
  }
}

function getShapeValueAtTime(frameNum) {
  // For now this caching object is created only when needed instead of creating it when the shape is initialized.
  if (!this._cachingAtTime) {
    this._cachingAtTime = {
      shapeValue: factory.clone(this.pv),
      lastIndex: 0,
      lastTime: -999999
    };
  }
  if (frameNum !== this._cachingAtTime.lastTime) {
    this._cachingAtTime.lastIndex = this._cachingAtTime.lastTime < frameNum ? this._caching.lastIndex : 0;
    this._cachingAtTime.lastTime = frameNum;
    frameNum *= this.elem.globalData.frameRate;
    this.interpolateShape(frameNum, this._cachingAtTime.shapeValue, this._cachingAtTime);
  }
  return this._cachingAtTime.shapeValue;
}

// PropertyFactory.getProp
function GetProp(target, name, descriptor) {
  var propertyGetProp = descriptor.value;
  descriptor.value = function (elem, data, type, mult, container) {
    var prop = propertyGetProp(elem, data, type, mult, container);
    // prop.getVelocityAtTime = getVelocityAtTime;
    // prop.loopOut = loopOut;
    // prop.loopIn = loopIn;
    if (prop.kf) {
      prop.getValueAtTime = getValueAtTime.bind(prop);
    } else {
      prop.getValueAtTime = getStaticValueAtTime.bind(prop);
    }
    prop.setGroupProperty = setGroupProperty;
    prop.loopOut = loopOut;
    prop.loopIn = loopIn;
    prop.getVelocityAtTime = getVelocityAtTime.bind(prop);
    prop.getSpeedAtTime = getSpeedAtTime.bind(prop);
    prop.numKeys = data.a === 1 ? data.k.length : 0;
    prop.propertyIndex = data.ix;
    var value = 0;
    if (type !== 0) {
      value = createTypedArray('float32', data.a === 1 ? data.k[0].s.length : data.k.length);
    }
    prop._cachingAtTime = {
      lastFrame: -999999,
      lastIndex: 0,
      value: value
    };
    searchExpressions(elem, data, prop);
    if (prop.k) {
      container.addDynamicProperty(prop);
    }

    return prop;
  };
  return descriptor;
}

function GetShapeProp(target, name, descriptor) {
  var propertyGetShapeProp = descriptor.value;

  descriptor.value = function (elem, data, type, arr, trims) {
    var prop = propertyGetShapeProp(elem, data, type, arr, trims);
    prop.propertyIndex = data.ix;
    prop.lock = false;
    if (type === 3) {
      searchExpressions(elem, data.pt, prop);
    } else if (type === 4) {
      searchExpressions(elem, data.ks, prop);
    }
    if (prop.k) {
      elem.addDynamicProperty(prop);
    }
    return prop;
  };

  return descriptor;
}

function getValueProxy(index, total) {
  this.textIndex = index + 1;
  this.textTotal = total;
  this.getValue();
  return this.v;
}

function TextExpressionSelectorProp(elem, data) {
  this.pv = 1;
  this.comp = elem.comp;
  this.elem = elem;
  this.mult = 0.01;
  this.propType = 'textSelector';
  this.textTotal = data.totalChars;
  this.selectorValue = 100;
  this.lastValue = [1, 1, 1];
  searchExpressions.bind(this)(elem, data, this);
  this.getMult = getValueProxy;
  this.getVelocityAtTime = getVelocityAtTime;
  if (this.kf) {
    this.getValueAtTime = getValueAtTime.bind(this);
  } else {
    this.getValueAtTime = getStaticValueAtTime.bind(this);
  }
  this.setGroupProperty = setGroupProperty;
}

//  TextSelectorProp.getTextSelectorProp
function GetTextSelectorProp(target, name, descriptor) {
  var propertyGetTextProp = descriptor.value;

  descriptor.value = function (elem, data, arr) {
    if (data.t === 1) {
      return new TextExpressionSelectorProp(elem, data, arr);
    }
    return propertyGetTextProp(elem, data, arr);
  };

  return descriptor;
}

var bezier_length_pool = pool_factory(8, function create() {
  return {
    addedLength: 0,
    percents: createTypedArray('float32', defaultCurveSegments),
    lengths: createTypedArray('float32', defaultCurveSegments)
  };
});

function create$2() {
  return {
    lengths: [],
    totalLength: 0
  };
}

function release$1(element) {
  var i;
  var len = element.lengths.length;
  for (i = 0; i < len; i += 1) {
    bezier_length_pool.release(element.lengths[i]);
  }
  element.lengths.length = 0;
}

var segments_length_pool = pool_factory(8, create$2, release$1);

function bezFunction() {
  // let easingFunctions = [];
  // let math = Math;

  function pointOnLine2D(x1, y1, x2, y2, x3, y3) {
    var det1 = x1 * y2 + y1 * x3 + x2 * y3 - x3 * y2 - y3 * x1 - x2 * y1;
    return det1 > -0.001 && det1 < 0.001;
  }

  function pointOnLine3D(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    if (z1 === 0 && z2 === 0 && z3 === 0) {
      return pointOnLine2D(x1, y1, x2, y2, x3, y3);
    }
    var dist1 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
    var dist2 = Math.sqrt(Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2) + Math.pow(z3 - z1, 2));
    var dist3 = Math.sqrt(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2) + Math.pow(z3 - z2, 2));
    var diffDist = void 0;
    if (dist1 > dist2) {
      if (dist1 > dist3) {
        diffDist = dist1 - dist2 - dist3;
      } else {
        diffDist = dist3 - dist2 - dist1;
      }
    } else if (dist3 > dist2) {
      diffDist = dist3 - dist2 - dist1;
    } else {
      diffDist = dist2 - dist1 - dist3;
    }
    return diffDist > -0.0001 && diffDist < 0.0001;
  }

  var getBezierLength = function () {
    return function (pt1, pt2, pt3, pt4) {
      var curveSegments = defaultCurveSegments;
      var k = void 0;
      var i = void 0;
      var len = void 0;
      var ptCoord = void 0;
      var perc = void 0;
      var addedLength = 0;
      var ptDistance = void 0;
      var point = [];
      var lastPoint = [];
      var lengthData = bezier_length_pool.newElement();
      len = pt3.length;
      for (k = 0; k < curveSegments; k += 1) {
        perc = k / (curveSegments - 1);
        ptDistance = 0;
        for (i = 0; i < len; i += 1) {
          ptCoord = bm_pow(1 - perc, 3) * pt1[i] + 3 * bm_pow(1 - perc, 2) * perc * pt3[i] + 3 * (1 - perc) * bm_pow(perc, 2) * pt4[i] + bm_pow(perc, 3) * pt2[i];
          point[i] = ptCoord;
          if (lastPoint[i] !== null) {
            ptDistance += bm_pow(point[i] - lastPoint[i], 2);
          }
          lastPoint[i] = point[i];
        }
        if (ptDistance) {
          ptDistance = bm_sqrt(ptDistance);
          addedLength += ptDistance;
        }
        lengthData.percents[k] = perc;
        lengthData.lengths[k] = addedLength;
      }
      lengthData.addedLength = addedLength;
      return lengthData;
    };
  }();

  function getSegmentsLength(shapeData) {
    var segmentsLength = segments_length_pool.newElement();
    var closed = shapeData.c;
    var pathV = shapeData.v;
    var pathO = shapeData.o;
    var pathI = shapeData.i;
    var i = void 0;
    var len = shapeData._length;
    var lengths = segmentsLength.lengths;
    var totalLength = 0;
    for (i = 0; i < len - 1; i += 1) {
      lengths[i] = getBezierLength(pathV[i], pathV[i + 1], pathO[i], pathI[i + 1]);
      totalLength += lengths[i].addedLength;
    }
    if (closed) {
      lengths[i] = getBezierLength(pathV[i], pathV[0], pathO[i], pathI[0]);
      totalLength += lengths[i].addedLength;
    }
    segmentsLength.totalLength = totalLength;
    return segmentsLength;
  }

  function BezierData(length) {
    this.segmentLength = 0;
    this.points = new Array(length);
  }

  function PointData(partial, point) {
    this.partialLength = partial;
    this.point = point;
  }

  var buildBezierData = function () {
    var storedData = {};

    return function (keyData) {
      var pt1 = keyData.s;
      var pt2 = keyData.e;
      var pt3 = keyData.to;
      var pt4 = keyData.ti;
      var bezierName = (pt1[0] + '_' + pt1[1] + '_' + pt2[0] + '_' + pt2[1] + '_' + pt3[0] + '_' + pt3[1] + '_' + pt4[0] + '_' + pt4[1]).replace(/\./g, 'p');
      if (storedData[bezierName]) {
        keyData.bezierData = storedData[bezierName];
        return;
      }
      var curveSegments = defaultCurveSegments;
      var k = void 0;
      var i = void 0;
      var len = void 0;
      var ptCoord = void 0;
      var perc = void 0;
      var addedLength = 0;
      var ptDistance = void 0;
      var point = void 0;
      var lastPoint = null;
      if (pt1.length === 2 && (pt1[0] !== pt2[0] || pt1[1] !== pt2[1]) && pointOnLine2D(pt1[0], pt1[1], pt2[0], pt2[1], pt1[0] + pt3[0], pt1[1] + pt3[1]) && pointOnLine2D(pt1[0], pt1[1], pt2[0], pt2[1], pt2[0] + pt4[0], pt2[1] + pt4[1])) {
        curveSegments = 2;
      }
      var bezierData = new BezierData(curveSegments);
      len = pt3.length;
      for (k = 0; k < curveSegments; k += 1) {
        point = createSizedArray(len);
        perc = k / (curveSegments - 1);
        ptDistance = 0;
        for (i = 0; i < len; i += 1) {
          ptCoord = bm_pow(1 - perc, 3) * pt1[i] + 3 * bm_pow(1 - perc, 2) * perc * (pt1[i] + pt3[i]) + 3 * (1 - perc) * bm_pow(perc, 2) * (pt2[i] + pt4[i]) + bm_pow(perc, 3) * pt2[i];
          point[i] = ptCoord;
          if (lastPoint !== null) {
            ptDistance += bm_pow(point[i] - lastPoint[i], 2);
          }
        }
        ptDistance = bm_sqrt(ptDistance);
        addedLength += ptDistance;
        bezierData.points[k] = new PointData(ptDistance, point);
        lastPoint = point;
      }
      bezierData.segmentLength = addedLength;
      keyData.bezierData = bezierData;
      storedData[bezierName] = bezierData;
    };
  }();

  function getDistancePerc(perc, bezierData) {
    var percents = bezierData.percents;
    var lengths = bezierData.lengths;
    var len = percents.length;
    var initPos = bm_floor((len - 1) * perc);
    var lengthPos = perc * bezierData.addedLength;
    var lPerc = 0;
    if (initPos === len - 1 || initPos === 0 || lengthPos === lengths[initPos]) {
      return percents[initPos];
    }
    var dir = lengths[initPos] > lengthPos ? -1 : 1;
    var flag = true;
    while (flag) {
      if (lengths[initPos] <= lengthPos && lengths[initPos + 1] > lengthPos) {
        lPerc = (lengthPos - lengths[initPos]) / (lengths[initPos + 1] - lengths[initPos]);
        flag = false;
      } else {
        initPos += dir;
      }
      if (initPos < 0 || initPos >= len - 1) {
        // FIX for TypedArrays that don't store floating point values with enough accuracy
        if (initPos === len - 1) {
          return percents[initPos];
        }
        flag = false;
      }
    }
    return percents[initPos] + (percents[initPos + 1] - percents[initPos]) * lPerc;
  }

  function getPointInSegment(pt1, pt2, pt3, pt4, percent, bezierData) {
    var t1 = getDistancePerc(percent, bezierData);
    // let u0 = 1;
    var u1 = 1 - t1;
    var ptX = Math.round((u1 * u1 * u1 * pt1[0] + (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) * pt3[0] + (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) * pt4[0] + t1 * t1 * t1 * pt2[0]) * 1000) / 1000;
    var ptY = Math.round((u1 * u1 * u1 * pt1[1] + (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) * pt3[1] + (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) * pt4[1] + t1 * t1 * t1 * pt2[1]) * 1000) / 1000;
    return [ptX, ptY];
  }

  // function getSegmentArray() { }

  var bezier_segment_points = createTypedArray('float32', 8);

  function getNewSegment(pt1, pt2, pt3, pt4, startPerc, endPerc, bezierData) {
    startPerc = startPerc < 0 ? 0 : startPerc > 1 ? 1 : startPerc;
    var t0 = getDistancePerc(startPerc, bezierData);
    endPerc = endPerc > 1 ? 1 : endPerc;
    var t1 = getDistancePerc(endPerc, bezierData);
    var i = void 0;
    var len = pt1.length;
    var u0 = 1 - t0;
    var u1 = 1 - t1;
    var u0u0u0 = u0 * u0 * u0;
    var t0u0u0_3 = t0 * u0 * u0 * 3;
    var t0t0u0_3 = t0 * t0 * u0 * 3;
    var t0t0t0 = t0 * t0 * t0;
    //
    var u0u0u1 = u0 * u0 * u1;
    var t0u0u1_3 = t0 * u0 * u1 + u0 * t0 * u1 + u0 * u0 * t1;
    var t0t0u1_3 = t0 * t0 * u1 + u0 * t0 * t1 + t0 * u0 * t1;
    var t0t0t1 = t0 * t0 * t1;
    //
    var u0u1u1 = u0 * u1 * u1;
    var t0u1u1_3 = t0 * u1 * u1 + u0 * t1 * u1 + u0 * u1 * t1;
    var t0t1u1_3 = t0 * t1 * u1 + u0 * t1 * t1 + t0 * u1 * t1;
    var t0t1t1 = t0 * t1 * t1;
    //
    var u1u1u1 = u1 * u1 * u1;
    var t1u1u1_3 = t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1;
    var t1t1u1_3 = t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1;
    var t1t1t1 = t1 * t1 * t1;
    for (i = 0; i < len; i += 1) {
      bezier_segment_points[i * 4] = Math.round((u0u0u0 * pt1[i] + t0u0u0_3 * pt3[i] + t0t0u0_3 * pt4[i] + t0t0t0 * pt2[i]) * 1000) / 1000;
      bezier_segment_points[i * 4 + 1] = Math.round((u0u0u1 * pt1[i] + t0u0u1_3 * pt3[i] + t0t0u1_3 * pt4[i] + t0t0t1 * pt2[i]) * 1000) / 1000;
      bezier_segment_points[i * 4 + 2] = Math.round((u0u1u1 * pt1[i] + t0u1u1_3 * pt3[i] + t0t1u1_3 * pt4[i] + t0t1t1 * pt2[i]) * 1000) / 1000;
      bezier_segment_points[i * 4 + 3] = Math.round((u1u1u1 * pt1[i] + t1u1u1_3 * pt3[i] + t1t1u1_3 * pt4[i] + t1t1t1 * pt2[i]) * 1000) / 1000;
    }

    return bezier_segment_points;
  }

  return {
    getSegmentsLength: getSegmentsLength,
    getNewSegment: getNewSegment,
    getPointInSegment: getPointInSegment,
    buildBezierData: buildBezierData,
    pointOnLine2D: pointOnLine2D,
    pointOnLine3D: pointOnLine3D
  };
}

var bez = bezFunction();

var _class;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var initFrame = -999999;
var math_abs = Math.abs;
var degToRads$1 = Math / 180;

function interpolateValue(frameNum, caching) {
  var offsetTime = this.offsetTime;
  var newValue = void 0;
  if (this.propType === 'multidimensional') {
    newValue = createTypedArray('float32', this.pv.length);
  }
  var iterationIndex = caching.lastIndex;
  var i = iterationIndex;
  var len = this.keyframes.length - 1;
  var flag = true;
  var keyData = void 0;
  var nextKeyData = void 0;

  while (flag) {
    keyData = this.keyframes[i];
    nextKeyData = this.keyframes[i + 1];
    if (i === len - 1 && frameNum >= nextKeyData.t - offsetTime) {
      if (keyData.h) {
        keyData = nextKeyData;
      }
      iterationIndex = 0;
      break;
    }
    if (nextKeyData.t - offsetTime > frameNum) {
      iterationIndex = i;
      break;
    }
    if (i < len - 1) {
      i += 1;
    } else {
      iterationIndex = 0;
      flag = false;
    }
  }

  var k = void 0;
  var kLen = void 0;
  var perc = void 0;
  var jLen = void 0;
  var j = void 0;
  var fnc = void 0;
  if (keyData.to) {
    if (!keyData.bezierData) {
      bez.buildBezierData(keyData);
    }
    var bezierData = keyData.bezierData;
    if (frameNum >= nextKeyData.t - offsetTime || frameNum < keyData.t - offsetTime) {
      var ind = frameNum >= nextKeyData.t - offsetTime ? bezierData.points.length - 1 : 0;
      kLen = bezierData.points[ind].point.length;
      for (k = 0; k < kLen; k += 1) {
        newValue[k] = bezierData.points[ind].point[k];
      }
      caching._lastBezierData = null;
    } else {
      if (keyData.__fnct) {
        fnc = keyData.__fnct;
      } else {
        fnc = ob.getBezierEasing(keyData.o.x, keyData.o.y, keyData.i.x, keyData.i.y, keyData.n).get;
        keyData.__fnct = fnc;
      }
      perc = fnc((frameNum - (keyData.t - offsetTime)) / (nextKeyData.t - offsetTime - (keyData.t - offsetTime)));
      var distanceInLine = bezierData.segmentLength * perc;

      var segmentPerc = void 0;
      var addedLength = caching.lastFrame < frameNum && caching._lastBezierData === bezierData ? caching._lastAddedLength : 0;
      j = caching.lastFrame < frameNum && caching._lastBezierData === bezierData ? caching._lastPoint : 0;
      flag = true;
      jLen = bezierData.points.length;
      while (flag) {
        addedLength += bezierData.points[j].partialLength;
        if (distanceInLine === 0 || perc === 0 || j === bezierData.points.length - 1) {
          kLen = bezierData.points[j].point.length;
          for (k = 0; k < kLen; k += 1) {
            newValue[k] = bezierData.points[j].point[k];
          }
          break;
        } else if (distanceInLine >= addedLength && distanceInLine < addedLength + bezierData.points[j + 1].partialLength) {
          segmentPerc = (distanceInLine - addedLength) / bezierData.points[j + 1].partialLength;
          kLen = bezierData.points[j].point.length;
          for (k = 0; k < kLen; k += 1) {
            newValue[k] = bezierData.points[j].point[k] + (bezierData.points[j + 1].point[k] - bezierData.points[j].point[k]) * segmentPerc;
          }
          break;
        }
        if (j < jLen - 1) {
          j += 1;
        } else {
          flag = false;
        }
      }
      caching._lastPoint = j;
      caching._lastAddedLength = addedLength - bezierData.points[j].partialLength;
      caching._lastBezierData = bezierData;
    }
  } else {
    var outX = void 0;
    var outY = void 0;
    var inX = void 0;
    var inY = void 0;
    var keyValue = void 0;
    len = keyData.s.length;
    if (this.sh && keyData.h !== 1) {
      if (frameNum >= nextKeyData.t - offsetTime) {
        newValue[0] = keyData.e[0];
        newValue[1] = keyData.e[1];
        newValue[2] = keyData.e[2];
      } else if (frameNum <= keyData.t - offsetTime) {
        newValue[0] = keyData.s[0];
        newValue[1] = keyData.s[1];
        newValue[2] = keyData.s[2];
      } else {
        var quatStart = createQuaternion(keyData.s);
        var quatEnd = createQuaternion(keyData.e);
        var time = (frameNum - (keyData.t - offsetTime)) / (nextKeyData.t - offsetTime - (keyData.t - offsetTime));
        quaternionToEuler(newValue, slerp(quatStart, quatEnd, time));
      }
    } else {
      for (i = 0; i < len; i += 1) {
        if (keyData.h !== 1) {
          if (frameNum >= nextKeyData.t - offsetTime) {
            perc = 1;
          } else if (frameNum < keyData.t - offsetTime) {
            perc = 0;
          } else {
            if (keyData.o.x.constructor === Array) {
              if (!keyData.__fnct) {
                keyData.__fnct = [];
              }
              if (!keyData.__fnct[i]) {
                outX = keyData.o.x[i] || keyData.o.x[0];
                outY = keyData.o.y[i] || keyData.o.y[0];
                inX = keyData.i.x[i] || keyData.i.x[0];
                inY = keyData.i.y[i] || keyData.i.y[0];
                fnc = ob.getBezierEasing(outX, outY, inX, inY).get;
                keyData.__fnct[i] = fnc;
              } else {
                fnc = keyData.__fnct[i];
              }
            } else if (!keyData.__fnct) {
              outX = keyData.o.x;
              outY = keyData.o.y;
              inX = keyData.i.x;
              inY = keyData.i.y;
              fnc = ob.getBezierEasing(outX, outY, inX, inY).get;
              keyData.__fnct = fnc;
            } else {
              fnc = keyData.__fnct;
            }
            perc = fnc((frameNum - (keyData.t - offsetTime)) / (nextKeyData.t - offsetTime - (keyData.t - offsetTime)));
          }
        }

        keyValue = keyData.h === 1 ? keyData.s[i] : keyData.s[i] + (keyData.e[i] - keyData.s[i]) * perc;

        if (len === 1) {
          newValue = keyValue;
        } else {
          newValue[i] = keyValue;
        }
      }
    }
  }
  caching.lastIndex = iterationIndex;
  return newValue;
}

// based on @Toji's https://github.com/toji/gl-matrix/
function slerp(a, b, t) {
  var out = [];
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  var bx = b[0];
  var by = b[1];
  var bz = b[2];
  var bw = b[3];
  var omega = void 0;
  var cosom = void 0;
  var sinom = void 0;
  var scale0 = void 0;
  var scale1 = void 0;

  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (1.0 - cosom > 0.000001) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    scale0 = 1.0 - t;
    scale1 = t;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
}

function quaternionToEuler(out, quat) {
  var qx = quat[0];
  var qy = quat[1];
  var qz = quat[2];
  var qw = quat[3];
  var heading = Math.atan2(2 * qy * qw - 2 * qx * qz, 1 - 2 * qy * qy - 2 * qz * qz);
  var attitude = Math.asin(2 * qx * qy + 2 * qz * qw);
  var bank = Math.atan2(2 * qx * qw - 2 * qy * qz, 1 - 2 * qx * qx - 2 * qz * qz);
  out[0] = heading / degToRads$1;
  out[1] = attitude / degToRads$1;
  out[2] = bank / degToRads$1;
}

function createQuaternion(values) {
  var heading = values[0] * degToRads$1;
  var attitude = values[1] * degToRads$1;
  var bank = values[2] * degToRads$1;
  var c1 = Math.cos(heading / 2);
  var c2 = Math.cos(attitude / 2);
  var c3 = Math.cos(bank / 2);
  var s1 = Math.sin(heading / 2);
  var s2 = Math.sin(attitude / 2);
  var s3 = Math.sin(bank / 2);
  var w = c1 * c2 * c3 - s1 * s2 * s3;
  var x = s1 * s2 * c3 + c1 * c2 * s3;
  var y = s1 * c2 * c3 + c1 * s2 * s3;
  var z = c1 * s2 * c3 - s1 * c2 * s3;

  return [x, y, z, w];
}

function getValueAtCurrentTime() {
  var frameNum = this.comp.renderedFrame - this.offsetTime;
  var initTime = this.keyframes[0].t - this.offsetTime;
  var endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
  if (!(frameNum === this._caching.lastFrame || this._caching.lastFrame !== initFrame && (this._caching.lastFrame >= endTime && frameNum >= endTime || this._caching.lastFrame < initTime && frameNum < initTime))) {
    this._caching.lastIndex = this._caching.lastFrame < frameNum ? this._caching.lastIndex : 0;
    var renderResult = this.interpolateValue(frameNum, this._caching);
    this.pv = renderResult;
  }
  this._caching.lastFrame = frameNum;
  return this.pv;
}

function setVValue(val) {
  var multipliedValue = void 0;
  if (this.propType === 'unidimensional') {
    multipliedValue = val * this.mult;
    if (math_abs(this.v - multipliedValue) > 0.00001) {
      this.v = multipliedValue;
      this._mdf = true;
    }
  } else {
    var i = 0;
    var len = this.v.length;
    while (i < len) {
      multipliedValue = val[i] * this.mult;
      if (math_abs(this.v[i] - multipliedValue) > 0.00001) {
        this.v[i] = multipliedValue;
        this._mdf = true;
      }
      i += 1;
    }
  }
}

function processEffectsSequence() {
  if (this.elem.globalData.frameId === this.frameId || !this.effectsSequence.length) {
    return;
  }
  if (this.lock) {
    this.setVValue(this.pv);
    return;
  }
  this.lock = true;
  this._mdf = this._isFirstFrame;
  // let multipliedValue;
  var i = void 0;
  var len = this.effectsSequence.length;
  var finalValue = this.kf ? this.pv : this.data.k;
  for (i = 0; i < len; i += 1) {
    finalValue = this.effectsSequence[i](finalValue);
  }
  this.setVValue(finalValue);
  this._isFirstFrame = false;
  this.lock = false;
  this.frameId = this.elem.globalData.frameId;
}

function addEffect(effectFunction) {
  this.effectsSequence.push(effectFunction);
  this.container.addDynamicProperty(this);
}

function ValueProperty(elem, data, mult, container) {
  this.propType = 'unidimensional';
  this.mult = mult || 1;
  this.data = data;
  this.v = mult ? data.k * mult : data.k;
  this.pv = data.k;
  this._mdf = false;
  this.elem = elem;
  this.container = container;
  this.comp = elem.comp;
  this.k = false;
  this.kf = false;
  this.vel = 0;
  this.effectsSequence = [];
  this._isFirstFrame = true;
  this.getValue = processEffectsSequence;
  this.setVValue = setVValue;
  this.addEffect = addEffect;
}

function MultiDimensionalProperty(elem, data, mult, container) {
  this.propType = 'multidimensional';
  this.mult = mult || 1;
  this.data = data;
  this._mdf = false;
  this.elem = elem;
  this.container = container;
  this.comp = elem.comp;
  this.k = false;
  this.kf = false;
  this.frameId = -1;
  var i = void 0;
  var len = data.k.length;
  this.v = createTypedArray('float32', len);
  this.pv = createTypedArray('float32', len);
  // let arr = createTypedArray('float32', len);
  this.vel = createTypedArray('float32', len);
  for (i = 0; i < len; i += 1) {
    this.v[i] = data.k[i] * this.mult;
    this.pv[i] = data.k[i];
  }
  this._isFirstFrame = true;
  this.effectsSequence = [];
  this.getValue = processEffectsSequence;
  this.setVValue = setVValue;
  this.addEffect = addEffect;
}

function KeyframedValueProperty(elem, data, mult, container) {
  this.propType = 'unidimensional';
  this.keyframes = data.k;
  this.offsetTime = elem.data.st;
  this.frameId = -1;
  this._caching = {
    lastFrame: initFrame,
    lastIndex: 0,
    value: 0
  };
  this.k = true;
  this.kf = true;
  this.data = data;
  this.mult = mult || 1;
  this.elem = elem;
  this.container = container;
  this.comp = elem.comp;
  this.v = initFrame;
  this.pv = initFrame;
  this._isFirstFrame = true;
  this.getValue = processEffectsSequence;
  this.setVValue = setVValue;
  this.interpolateValue = interpolateValue;
  this.effectsSequence = [getValueAtCurrentTime.bind(this)];
  this.addEffect = addEffect;
}

function KeyframedMultidimensionalProperty(elem, data, mult, container) {
  this.propType = 'multidimensional';
  var i = void 0;
  var len = data.k.length;
  var s = void 0;
  var e = void 0;
  var to = void 0;
  var ti = void 0;
  for (i = 0; i < len - 1; i += 1) {
    if (data.k[i].to && data.k[i].s && data.k[i].e) {
      s = data.k[i].s;
      e = data.k[i].e;
      to = data.k[i].to;
      ti = data.k[i].ti;
      if (s.length === 2 && !(s[0] === e[0] && s[1] === e[1]) && bez.pointOnLine2D(s[0], s[1], e[0], e[1], s[0] + to[0], s[1] + to[1]) && bez.pointOnLine2D(s[0], s[1], e[0], e[1], e[0] + ti[0], e[1] + ti[1]) || s.length === 3 && !(s[0] === e[0] && s[1] === e[1] && s[2] === e[2]) && bez.pointOnLine3D(s[0], s[1], s[2], e[0], e[1], e[2], s[0] + to[0], s[1] + to[1], s[2] + to[2]) && bez.pointOnLine3D(s[0], s[1], s[2], e[0], e[1], e[2], e[0] + ti[0], e[1] + ti[1], e[2] + ti[2])) {
        data.k[i].to = null;
        data.k[i].ti = null;
      }
      if (s[0] === e[0] && s[1] === e[1] && to[0] === 0 && to[1] === 0 && ti[0] === 0 && ti[1] === 0) {
        if (s.length === 2 || s[2] === e[2] && to[2] === 0 && ti[2] === 0) {
          data.k[i].to = null;
          data.k[i].ti = null;
        }
      }
    }
  }
  this.effectsSequence = [getValueAtCurrentTime.bind(this)];
  this.keyframes = data.k;
  this.offsetTime = elem.data.st;
  this.k = true;
  this.kf = true;
  this._isFirstFrame = true;
  this.mult = mult || 1;
  this.elem = elem;
  this.container = container;
  this.comp = elem.comp;
  this.getValue = processEffectsSequence;
  this.setVValue = setVValue;
  this.interpolateValue = interpolateValue;
  this.frameId = -1;
  var arrLen = data.k[0].s.length;
  this.v = createTypedArray('float32', arrLen);
  this.pv = createTypedArray('float32', arrLen);
  for (i = 0; i < arrLen; i += 1) {
    this.v[i] = initFrame;
    this.pv[i] = initFrame;
  }
  this._caching = {
    lastFrame: initFrame,
    lastIndex: 0,
    value: createTypedArray('float32', arrLen)
  };
  this.addEffect = addEffect;
}

var PropertyFactory = (_class = function () {
  function PropertyFactory() {
    classCallCheck(this, PropertyFactory);
  }

  createClass(PropertyFactory, [{
    key: 'getProp',
    value: function getProp(elem, data, type, mult, container) {
      var p = void 0;
      if (data.a === 0) {
        if (type === 0) {
          p = new ValueProperty(elem, data, mult, container);
        } else {
          p = new MultiDimensionalProperty(elem, data, mult, container);
        }
      } else if (data.a === 1) {
        if (type === 0) {
          p = new KeyframedValueProperty(elem, data, mult, container);
        } else {
          p = new KeyframedMultidimensionalProperty(elem, data, mult, container);
        }
      } else if (!data.k.length) {
        p = new ValueProperty(elem, data, mult, container);
      } else if (typeof data.k[0] === 'number') {
        p = new MultiDimensionalProperty(elem, data, mult, container);
      } else {
        switch (type) {
          case 0:
            p = new KeyframedValueProperty(elem, data, mult, container);
            break;
          case 1:
            p = new KeyframedMultidimensionalProperty(elem, data, mult, container);
            break;
          default:
            break;
        }
      }
      if (p.effectsSequence.length) {
        container.addDynamicProperty(p);
      }
      return p;
    }
  }]);
  return PropertyFactory;
}(), (_applyDecoratedDescriptor(_class.prototype, 'getProp', [GetProp], Object.getOwnPropertyDescriptor(_class.prototype, 'getProp'), _class.prototype)), _class);


var PropertyFactory$1 = new PropertyFactory();

function SliderEffect(data, elem, container) {
  this.p = PropertyFactory$1.getProp(elem, data.v, 0, 0, container);
}
function AngleEffect(data, elem, container) {
  this.p = PropertyFactory$1.getProp(elem, data.v, 0, 0, container);
}
function ColorEffect(data, elem, container) {
  this.p = PropertyFactory$1.getProp(elem, data.v, 1, 0, container);
}
function PointEffect(data, elem, container) {
  this.p = PropertyFactory$1.getProp(elem, data.v, 1, 0, container);
}
function CheckboxEffect(data, elem, container) {
  this.p = PropertyFactory$1.getProp(elem, data.v, 0, 0, container);
}
function NoValueEffect() {
  this.p = {};
}

function EffectsManager(data, element, dynamicProperties) {
  var effects = data.ef || [];
  this.effectElements = [];
  var i = void 0;
  var len = effects.length;
  var effectItem = void 0;
  for (i = 0; i < len; i++) {
    effectItem = new GroupEffect(effects[i], element, dynamicProperties);
    this.effectElements.push(effectItem);
  }
}

function GroupEffect(data, element, dynamicProperties) {
  this.dynamicProperties = [];
  this.init(data, element, this.dynamicProperties);
  if (this.dynamicProperties.length) {
    dynamicProperties.push(this);
  }
}

GroupEffect.prototype.getValue = function () {
  this.mdf = false;
  var i = void 0;
  var len = this.dynamicProperties.length;
  for (i = 0; i < len; i += 1) {
    this.dynamicProperties[i].getValue();
    this.mdf = this.dynamicProperties[i].mdf ? true : this.mdf;
  }
};

GroupEffect.prototype.init = function (data, element, dynamicProperties) {
  this.data = data;
  this.mdf = false;
  this.effectElements = [];
  var i = void 0;
  var len = this.data.ef.length;
  var eff = void 0;
  var effects = this.data.ef;
  for (i = 0; i < len; i += 1) {
    switch (effects[i].ty) {
      case 0:
        eff = new SliderEffect(effects[i], element, dynamicProperties);
        this.effectElements.push(eff);
        break;
      case 1:
        eff = new AngleEffect(effects[i], element, dynamicProperties);
        this.effectElements.push(eff);
        break;
      case 2:
        eff = new ColorEffect(effects[i], element, dynamicProperties);
        this.effectElements.push(eff);
        break;
      case 3:
        eff = new PointEffect(effects[i], element, dynamicProperties);
        this.effectElements.push(eff);
        break;
      case 4:
      case 7:
        eff = new CheckboxEffect(effects[i], element, dynamicProperties);
        this.effectElements.push(eff);
        break;
      case 5:
        eff = new EffectsManager(effects[i], element, dynamicProperties);
        this.effectElements.push(eff);
        break;
      case 6:
        eff = new NoValueEffect(effects[i], element, dynamicProperties);
        this.effectElements.push(eff);
        break;
      default:
        break;
    }
  }
};

function MaskInterface(mask, data) {
  this._mask = mask;
  this._data = data;
}
Object.defineProperty(MaskInterface.prototype, 'maskPath', {
  get: function get() {
    if (this._mask.prop.k) {
      this._mask.prop.getValue();
    }
    return this._mask.prop;
  }
});

function MaskManagerInterface (maskManager) {
  var _masksInterfaces = createSizedArray(maskManager.viewData.length);
  var i = void 0;
  var len = maskManager.viewData.length;
  for (i = 0; i < len; i += 1) {
    _masksInterfaces[i] = new MaskInterface(maskManager.viewData[i], maskManager.masksProperties[i]);
  }

  var maskFunction = function maskFunction(name) {
    i = 0;
    while (i < len) {
      if (maskManager.masksProperties[i].nm === name) {
        return _masksInterfaces[i];
      }
      i += 1;
    }
  };
  return maskFunction;
}

function ExpressionValue (elementProp, mult, type) {
  mult = mult || 1;
  var expressionValue = void 0;
  // let arrayValue;

  if (elementProp.k) {
    elementProp.getValue();
  }
  var i = void 0;
  var len = void 0;
  var arrValue = void 0;
  var val = void 0;
  if (type) {
    if (type === 'color') {
      len = 4;
      expressionValue = createTypedArray('float32', len);
      arrValue = createTypedArray('float32', len);
      for (i = 0; i < len; i += 1) {
        expressionValue[i] = arrValue[i] = i < 3 ? elementProp.v[i] * mult : 1;
      }
      expressionValue.value = arrValue;
    }
  } else if (elementProp.propType === 'unidimensional') {
    val = elementProp.v * mult;
    /* eslint no-new-wrappers: 0 */
    expressionValue = new Number(val);
    expressionValue.value = val;
  } else {
    len = elementProp.pv.length;
    expressionValue = createTypedArray('float32', len);
    arrValue = createTypedArray('float32', len);
    for (i = 0; i < len; i += 1) {
      expressionValue[i] = arrValue[i] = elementProp.v[i] * mult;
    }
    expressionValue.value = arrValue;
  }

  expressionValue.numKeys = elementProp.keyframes ? elementProp.keyframes.length : 0;
  expressionValue.key = function (pos) {
    if (!expressionValue.numKeys) {
      return 0;
    }
    return elementProp.keyframes[pos - 1].t;
  };
  expressionValue.valueAtTime = elementProp.getValueAtTime;
  expressionValue.speedAtTime = elementProp.getSpeedAtTime;
  expressionValue.velocityAtTime = elementProp.getVelocityAtTime;
  expressionValue.propertyGroup = elementProp.propertyGroup;
  return expressionValue;
}

var degToRads$2 = Math.PI / 180;

var TransformExpressionInterface = (function (transform) {
  /* eslint consistent-return: 0 */
  function thisFunction(name) {
    switch (name) {
      case 'scale':
      case 'Scale':
      case 'ADBE Scale':
      case 6:
        return thisFunction.scale;
      case 'rotation':
      case 'Rotation':
      case 'ADBE Rotation':
      case 'ADBE Rotate Z':
      case 10:
        return thisFunction.rotation;
      case 'ADBE Rotate X':
        return thisFunction.xRotation;
      case 'ADBE Rotate Y':
        return thisFunction.yRotation;
      case 'position':
      case 'Position':
      case 'ADBE Position':
      case 2:
        return thisFunction.position;
      case 'ADBE Position_0':
        return thisFunction.xPosition;
      case 'ADBE Position_1':
        return thisFunction.yPosition;
      case 'ADBE Position_2':
        return thisFunction.zPosition;
      case 'anchorPoint':
      case 'AnchorPoint':
      case 'Anchor Point':
      case 'ADBE AnchorPoint':
      case 1:
        return thisFunction.anchorPoint;
      case 'opacity':
      case 'Opacity':
      case 11:
        return thisFunction.opacity;
      default:
        break;
    }
  }

  Object.defineProperty(thisFunction, 'rotation', {
    get: function rotation() {
      if (transform.r) {
        return ExpressionValue(transform.r, 1 / degToRads$2);
      }
      return ExpressionValue(transform.rz, 1 / degToRads$2);
    }
  });

  Object.defineProperty(thisFunction, 'xRotation', {
    get: function get() {
      return ExpressionValue(transform.rx, 1 / degToRads$2);
    }
  });

  Object.defineProperty(thisFunction, 'yRotation', {
    get: function get() {
      return ExpressionValue(transform.ry, 1 / degToRads$2);
    }
  });
  Object.defineProperty(thisFunction, 'scale', {
    get: function get() {
      return ExpressionValue(transform.s, 100);
    }
  });

  Object.defineProperty(thisFunction, 'position', {
    get: function get() {
      if (transform.p) {
        return ExpressionValue(transform.p);
      }
      return [transform.px.v, transform.py.v, transform.pz ? transform.pz.v : 0];
    }
  });

  Object.defineProperty(thisFunction, 'xPosition', {
    get: function get() {
      return ExpressionValue(transform.px);
    }
  });

  Object.defineProperty(thisFunction, 'yPosition', {
    get: function get() {
      return ExpressionValue(transform.py);
    }
  });

  Object.defineProperty(thisFunction, 'zPosition', {
    get: function get() {
      return ExpressionValue(transform.pz);
    }
  });

  Object.defineProperty(thisFunction, 'anchorPoint', {
    get: function get() {
      return ExpressionValue(transform.a);
    }
  });

  Object.defineProperty(thisFunction, 'opacity', {
    get: function get() {
      return ExpressionValue(transform.o, 100);
    }
  });

  Object.defineProperty(thisFunction, 'skew', {
    get: function get() {
      return ExpressionValue(transform.sk);
    }
  });

  Object.defineProperty(thisFunction, 'skewAxis', {
    get: function get() {
      return ExpressionValue(transform.sa);
    }
  });

  Object.defineProperty(thisFunction, 'orientation', {
    get: function get() {
      return ExpressionValue(transform.or);
    }
  });

  return thisFunction;
});

function toWorld(arr, time) {
  var toWorldMat = new Matrix();
  toWorldMat.reset();
  var transformMat = void 0;
  if (time) {
    // Todo implement value at time on transform properties
    // transformMat = this._elem.finalTransform.mProp.getValueAtTime(time);
    transformMat = this._elem.finalTransform.mProp;
  } else {
    transformMat = this._elem.finalTransform.mProp;
  }
  transformMat.applyToMatrix(toWorldMat);
  if (this._elem.hierarchy && this._elem.hierarchy.length) {
    var i = void 0;
    var len = this._elem.hierarchy.length;
    for (i = 0; i < len; i += 1) {
      this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
    }
    return toWorldMat.applyToPointArray(arr[0], arr[1], arr[2] || 0);
  }
  return toWorldMat.applyToPointArray(arr[0], arr[1], arr[2] || 0);
}
function fromWorld(arr, time) {
  var toWorldMat = new Matrix();
  toWorldMat.reset();
  var transformMat = void 0;
  if (time) {
    // Todo implement value at time on transform properties
    // transformMat = this._elem.finalTransform.mProp.getValueAtTime(time);
    transformMat = this._elem.finalTransform.mProp;
  } else {
    transformMat = this._elem.finalTransform.mProp;
  }
  transformMat.applyToMatrix(toWorldMat);
  if (this._elem.hierarchy && this._elem.hierarchy.length) {
    var i = void 0;
    var len = this._elem.hierarchy.length;
    for (i = 0; i < len; i += 1) {
      this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
    }
    return toWorldMat.inversePoint(arr);
  }
  return toWorldMat.inversePoint(arr);
}
function fromComp(arr) {
  var toWorldMat = new Matrix();
  toWorldMat.reset();
  this._elem.finalTransform.mProp.applyToMatrix(toWorldMat);
  if (this._elem.hierarchy && this._elem.hierarchy.length) {
    var i = void 0;
    var len = this._elem.hierarchy.length;
    for (i = 0; i < len; i += 1) {
      this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
    }
    return toWorldMat.inversePoint(arr);
  }
  return toWorldMat.inversePoint(arr);
}

function sampleImage() {
  return [1, 1, 1, 1];
}

function LayerExpressionInterface (elem) {
  var transformInterface = void 0;

  function thisLayerFunction(name) {
    switch (name) {
      case 'ADBE Root Vectors Group':
      case 'Contents':
      case 2:
        return thisLayerFunction.shapeInterface;
      case 1:
      case 6:
      case 'Transform':
      case 'transform':
      case 'ADBE Transform Group':
        return transformInterface;
      case 4:
      case 'ADBE Effect Parade':
        return thisLayerFunction.effect;
      default:
        break;
    }
  }
  function _registerMaskInterface(maskManager) {
    thisLayerFunction.mask = new MaskManagerInterface(maskManager, elem);
  }
  function _registerEffectsInterface(effects) {
    thisLayerFunction.effect = effects;
  }
  thisLayerFunction.toWorld = toWorld;
  thisLayerFunction.fromWorld = fromWorld;
  thisLayerFunction.toComp = toWorld;
  thisLayerFunction.fromComp = fromComp;
  thisLayerFunction.sampleImage = sampleImage;
  thisLayerFunction.sourceRectAtTime = elem.sourceRectAtTime.bind(elem);
  thisLayerFunction._elem = elem;
  transformInterface = TransformExpressionInterface(elem.finalTransform.mProp);
  var anchorPointDescriptor = getDescriptor(transformInterface, 'anchorPoint');
  Object.defineProperties(thisLayerFunction, {
    hasParent: {
      get: function get() {
        return elem.hierarchy.length;
      }
    },
    parent: {
      get: function get() {
        return elem.hierarchy[0].layerInterface;
      }
    },
    rotation: getDescriptor(transformInterface, 'rotation'),
    scale: getDescriptor(transformInterface, 'scale'),
    position: getDescriptor(transformInterface, 'position'),
    opacity: getDescriptor(transformInterface, 'opacity'),
    anchorPoint: anchorPointDescriptor,
    anchor_point: anchorPointDescriptor,
    transform: {
      get: function get() {
        return transformInterface;
      }
    },
    active: {
      get: function get() {
        return elem.isInRange;
      }
    }
  });

  thisLayerFunction.startTime = elem.data.st;
  thisLayerFunction.index = elem.data.ind;
  thisLayerFunction.source = elem.data.refId;
  thisLayerFunction.height = elem.data.ty === 0 ? elem.data.h : 100;
  thisLayerFunction.width = elem.data.ty === 0 ? elem.data.w : 100;

  thisLayerFunction.registerMaskInterface = _registerMaskInterface;
  thisLayerFunction.registerEffectsInterface = _registerEffectsInterface;
  return thisLayerFunction;
}

function createEffectsInterface(elem, propertyGroup) {
  if (elem.effectsManager) {
    var effectElements = [];
    var effectsData = elem.data.ef;
    var i = void 0;
    var len = elem.effectsManager.effectElements.length;
    for (i = 0; i < len; i += 1) {
      effectElements.push(createGroupInterface(effectsData[i], elem.effectsManager.effectElements[i], propertyGroup, elem));
    }

    return function (name) {
      var effects = elem.data.ef || [];
      // let i = 0;
      // let len = effects.length;
      while (i < len) {
        if (name === effects[i].nm || name === effects[i].mn || name === effects[i].ix) {
          return effectElements[i];
        }
        i += 1;
      }
    };
  }
}

function createGroupInterface(data, elements, propertyGroup, elem) {
  var effectElements = [];
  var i = void 0;
  var len = data.ef.length;
  for (i = 0; i < len; i += 1) {
    if (data.ef[i].ty === 5) {
      effectElements.push(createGroupInterface(data.ef[i], elements.effectElements[i], elements.effectElements[i].propertyGroup, elem));
    } else {
      effectElements.push(createValueInterface(elements.effectElements[i], data.ef[i].ty, elem, _propertyGroup));
    }
  }

  var groupInterface = function groupInterface(name) {
    var effects = data.ef;
    // let i = 0;
    // let len = effects.length;
    while (i < len) {
      if (name === effects[i].nm || name === effects[i].mn || name === effects[i].ix) {
        if (effects[i].ty === 5) {
          return effectElements[i];
        }
        return effectElements[i]();
      }
      i += 1;
    }
    return effectElements[0]();
  };

  function _propertyGroup(val) {
    if (val === 1) {
      return groupInterface;
    }
    return propertyGroup(val - 1);
  }

  groupInterface.propertyGroup = _propertyGroup;

  if (data.mn === 'ADBE Color Control') {
    Object.defineProperty(groupInterface, 'color', {
      get: function get() {
        return effectElements[0]();
      }
    });
  }
  Object.defineProperty(groupInterface, 'numProperties', {
    get: function get() {
      return data.np;
    }
  });
  groupInterface.active = data.en !== 0;
  return groupInterface;
}

function createValueInterface(element, type, elem, propertyGroup) {
  function interfaceFunction() {
    if (type === 10) {
      return elem.comp.compInterface(element.p.v);
    }
    return ExpressionValue(element.p);
  }

  if (element.p.setGroupProperty) {
    element.p.setGroupProperty(propertyGroup);
  }

  return interfaceFunction;
}

var ob$2 = {
  createEffectsInterface: createEffectsInterface
};

/* eslint no-use-before-define: 0 */

function iterateElements(shapes, view, propertyGroup) {
  var arr = [];
  var i = void 0;
  var len = shapes ? shapes.length : 0;
  for (i = 0; i < len; i += 1) {
    if (shapes[i].ty === 'gr') {
      arr.push(groupInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'fl') {
      arr.push(fillInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'st') {
      arr.push(strokeInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'tm') {
      arr.push(trimInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'tr') ; else if (shapes[i].ty === 'el') {
      arr.push(ellipseInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'sr') {
      arr.push(starInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'sh') {
      arr.push(pathInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'rc') {
      arr.push(rectInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'rd') {
      arr.push(roundedInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'rp') {
      arr.push(repeaterInterfaceFactory(shapes[i], view[i], propertyGroup));
    }
  }
  return arr;
}

function contentsInterfaceFactory(shape, view, propertyGroup) {
  var interfaces = void 0;
  var interfaceFunction = function interfaceFunction(value) {
    var i = 0;
    var len = interfaces.length;
    while (i < len) {
      if (interfaces[i]._name === value || interfaces[i].mn === value || interfaces[i].propertyIndex === value || interfaces[i].ix === value || interfaces[i].ind === value) {
        return interfaces[i];
      }
      i += 1;
    }
    if (typeof value === 'number') {
      return interfaces[value - 1];
    }
  };
  interfaceFunction.propertyGroup = function (val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(val - 1);
  };
  interfaces = iterateElements(shape.it, view.it, interfaceFunction.propertyGroup);
  interfaceFunction.numProperties = interfaces.length;
  interfaceFunction.propertyIndex = shape.cix;
  interfaceFunction._name = shape.nm;

  return interfaceFunction;
}

function groupInterfaceFactory(shape, view, propertyGroup) {
  var interfaceFunction = function _interfaceFunction(value) {
    switch (value) {
      case 'ADBE Vectors Group':
      case 'Contents':
      case 2:
        return interfaceFunction.content;
      // Not necessary for now. Keeping them here in case a new case appears
      // case 'ADBE Vector Transform Group':
      // case 3:
      default:
        return interfaceFunction.transform;
    }
  };
  interfaceFunction.propertyGroup = function (val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(val - 1);
  };
  var content = contentsInterfaceFactory(shape, view, interfaceFunction.propertyGroup);
  var transformInterface = transformInterfaceFactory(shape.it[shape.it.length - 1], view.it[view.it.length - 1], interfaceFunction.propertyGroup);
  interfaceFunction.content = content;
  interfaceFunction.transform = transformInterface;
  Object.defineProperty(interfaceFunction, '_name', {
    get: function get() {
      return shape.nm;
    }
  });
  // interfaceFunction.content = interfaceFunction;
  interfaceFunction.numProperties = shape.np;
  interfaceFunction.propertyIndex = shape.ix;
  interfaceFunction.nm = shape.nm;
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function fillInterfaceFactory(shape, view, propertyGroup) {
  function interfaceFunction(val) {
    if (val === 'Color' || val === 'color') {
      return interfaceFunction.color;
    } else if (val === 'Opacity' || val === 'opacity') {
      return interfaceFunction.opacity;
    }
  }
  Object.defineProperties(interfaceFunction, {
    color: {
      get: function get() {
        return ExpressionValue(view.c, 1 / view.c.mult, 'color');
      }
    },
    opacity: {
      get: function get() {
        return ExpressionValue(view.o, 100);
      }
    },
    _name: {
      value: shape.nm
    },
    mn: {
      value: shape.mn
    }
  });

  view.c.setGroupProperty(propertyGroup);
  view.o.setGroupProperty(propertyGroup);
  return interfaceFunction;
}

function strokeInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      // eslint:error
      // return ob;
      return {};
    }
    return propertyGroup(val - 1);
  }
  function _dashPropertyGroup(val) {
    if (val === 1) {
      return dashOb;
    }
    return _propertyGroup(val - 1);
  }
  function addPropertyToDashOb(i) {
    Object.defineProperty(dashOb, shape.d[i].nm, {
      get: function get() {
        return ExpressionValue(view.d.dataProps[i].p);
      }
    });
  }
  var i = void 0;
  var len = shape.d ? shape.d.length : 0;
  var dashOb = {};
  for (i = 0; i < len; i += 1) {
    addPropertyToDashOb(i);
    view.d.dataProps[i].p.setGroupProperty(_dashPropertyGroup);
  }

  function interfaceFunction(val) {
    if (val === 'Color' || val === 'color') {
      return interfaceFunction.color;
    } else if (val === 'Opacity' || val === 'opacity') {
      return interfaceFunction.opacity;
    } else if (val === 'Stroke Width' || val === 'stroke width') {
      return interfaceFunction.strokeWidth;
    }
  }
  Object.defineProperties(interfaceFunction, {
    color: {
      get: function get() {
        return ExpressionValue(view.c, 1 / view.c.mult, 'color');
      }
    },
    opacity: {
      get: function get() {
        return ExpressionValue(view.o, 100);
      }
    },
    strokeWidth: {
      get: function get() {
        return ExpressionValue(view.w);
      }
    },
    dash: {
      get: function get() {
        return dashOb;
      }
    },
    _name: {
      value: shape.nm
    },
    mn: {
      value: shape.mn
    }
  });

  view.c.setGroupProperty(_propertyGroup);
  view.o.setGroupProperty(_propertyGroup);
  view.w.setGroupProperty(_propertyGroup);
  return interfaceFunction;
}

function trimInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  interfaceFunction.propertyIndex = shape.ix;

  view.s.setGroupProperty(_propertyGroup);
  view.e.setGroupProperty(_propertyGroup);
  view.o.setGroupProperty(_propertyGroup);

  function interfaceFunction(val) {
    if (val === shape.e.ix || val === 'End' || val === 'end') {
      return interfaceFunction.end;
    }
    if (val === shape.s.ix) {
      return interfaceFunction.start;
    }
    if (val === shape.o.ix) {
      return interfaceFunction.offset;
    }
  }
  interfaceFunction.propertyIndex = shape.ix;

  Object.defineProperties(interfaceFunction, {
    start: {
      get: function get() {
        return ExpressionValue(view.s, 1 / view.s.mult);
      }
    },
    end: {
      get: function get() {
        return ExpressionValue(view.e, 1 / view.e.mult);
      }
    },
    offset: {
      get: function get() {
        return ExpressionValue(view.o);
      }
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function transformInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  view.transform.mProps.o.setGroupProperty(_propertyGroup);
  view.transform.mProps.p.setGroupProperty(_propertyGroup);
  view.transform.mProps.a.setGroupProperty(_propertyGroup);
  view.transform.mProps.s.setGroupProperty(_propertyGroup);
  view.transform.mProps.r.setGroupProperty(_propertyGroup);
  if (view.transform.mProps.sk) {
    view.transform.mProps.sk.setGroupProperty(_propertyGroup);
    view.transform.mProps.sa.setGroupProperty(_propertyGroup);
  }
  view.transform.op.setGroupProperty(_propertyGroup);

  function interfaceFunction(value) {
    if (shape.a.ix === value || value === 'Anchor Point') {
      return interfaceFunction.anchorPoint;
    }
    if (shape.o.ix === value || value === 'Opacity') {
      return interfaceFunction.opacity;
    }
    if (shape.p.ix === value || value === 'Position') {
      return interfaceFunction.position;
    }
    if (shape.r.ix === value || value === 'Rotation' || value === 'ADBE Vector Rotation') {
      return interfaceFunction.rotation;
    }
    if (shape.s.ix === value || value === 'Scale') {
      return interfaceFunction.scale;
    }
    if (shape.sk && shape.sk.ix === value || value === 'Skew') {
      return interfaceFunction.skew;
    }
    if (shape.sa && shape.sa.ix === value || value === 'Skew Axis') {
      return interfaceFunction.skewAxis;
    }
  }
  Object.defineProperties(interfaceFunction, {
    opacity: {
      get: function get() {
        return ExpressionValue(view.transform.mProps.o, 1 / view.transform.mProps.o.mult);
      }
    },
    position: {
      get: function get() {
        return ExpressionValue(view.transform.mProps.p);
      }
    },
    anchorPoint: {
      get: function get() {
        return ExpressionValue(view.transform.mProps.a);
      }
    },
    scale: {
      get: function get() {
        return ExpressionValue(view.transform.mProps.s, 1 / view.transform.mProps.s.mult);
      }
    },
    rotation: {
      get: function get() {
        return ExpressionValue(view.transform.mProps.r, 1 / view.transform.mProps.r.mult);
      }
    },
    skew: {
      get: function get() {
        return ExpressionValue(view.transform.mProps.sk);
      }
    },
    skewAxis: {
      get: function get() {
        return ExpressionValue(view.transform.mProps.sa);
      }
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.ty = 'tr';
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function ellipseInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  interfaceFunction.propertyIndex = shape.ix;
  var prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh;
  prop.s.setGroupProperty(_propertyGroup);
  prop.p.setGroupProperty(_propertyGroup);
  function interfaceFunction(value) {
    if (shape.p.ix === value) {
      return interfaceFunction.position;
    }
    if (shape.s.ix === value) {
      return interfaceFunction.size;
    }
  }
  Object.defineProperties(interfaceFunction, {
    size: {
      get: function get() {
        return ExpressionValue(prop.s);
      }
    },
    position: {
      get: function get() {
        return ExpressionValue(prop.p);
      }
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function starInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  var prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh;
  interfaceFunction.propertyIndex = shape.ix;
  prop.or.setGroupProperty(_propertyGroup);
  prop.os.setGroupProperty(_propertyGroup);
  prop.pt.setGroupProperty(_propertyGroup);
  prop.p.setGroupProperty(_propertyGroup);
  prop.r.setGroupProperty(_propertyGroup);
  if (shape.ir) {
    prop.ir.setGroupProperty(_propertyGroup);
    prop.is.setGroupProperty(_propertyGroup);
  }

  function interfaceFunction(value) {
    if (shape.p.ix === value) {
      return interfaceFunction.position;
    }
    if (shape.r.ix === value) {
      return interfaceFunction.rotation;
    }
    if (shape.pt.ix === value) {
      return interfaceFunction.points;
    }
    if (shape.or.ix === value || value === 'ADBE Vector Star Outer Radius') {
      return interfaceFunction.outerRadius;
    }
    if (shape.os.ix === value) {
      return interfaceFunction.outerRoundness;
    }
    if (shape.ir && (shape.ir.ix === value || value === 'ADBE Vector Star Inner Radius')) {
      return interfaceFunction.innerRadius;
    }
    if (shape.is && shape.is.ix === value) {
      return interfaceFunction.innerRoundness;
    }
  }
  Object.defineProperties(interfaceFunction, {
    position: {
      get: function get() {
        return ExpressionValue(prop.p);
      }
    },
    rotation: {
      get: function get() {
        return ExpressionValue(prop.r, 1 / prop.r.mult);
      }
    },
    points: {
      get: function get() {
        return ExpressionValue(prop.pt);
      }
    },
    outerRadius: {
      get: function get() {
        return ExpressionValue(prop.or);
      }
    },
    outerRoundness: {
      get: function get() {
        return ExpressionValue(prop.os);
      }
    },
    innerRadius: {
      get: function get() {
        if (!prop.ir) {
          return 0;
        }
        return ExpressionValue(prop.ir);
      }
    },
    innerRoundness: {
      get: function get() {
        if (!prop.is) {
          return 0;
        }
        return ExpressionValue(prop.is, 1 / prop.is.mult);
      }
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function rectInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  var prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh;
  interfaceFunction.propertyIndex = shape.ix;
  prop.p.setGroupProperty(_propertyGroup);
  prop.s.setGroupProperty(_propertyGroup);
  prop.r.setGroupProperty(_propertyGroup);

  function interfaceFunction(value) {
    if (shape.p.ix === value) {
      return interfaceFunction.position;
    }
    if (shape.r.ix === value) {
      return interfaceFunction.roundness;
    }
    if (shape.s.ix === value || value === 'Size' || value === 'ADBE Vector Rect Size') {
      return interfaceFunction.size;
    }
  }
  Object.defineProperties(interfaceFunction, {
    position: {
      get: function get() {
        return ExpressionValue(prop.p);
      }
    },
    roundness: {
      get: function get() {
        return ExpressionValue(prop.r);
      }
    },
    size: {
      get: function get() {
        return ExpressionValue(prop.s);
      }
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function roundedInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  var prop = view;
  interfaceFunction.propertyIndex = shape.ix;
  prop.rd.setGroupProperty(_propertyGroup);

  function interfaceFunction(value) {
    if (shape.r.ix === value || value === 'Round Corners 1') {
      return interfaceFunction.radius;
    }
  }
  Object.defineProperties(interfaceFunction, {
    radius: {
      get: function get() {
        return ExpressionValue(prop.rd);
      }
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function repeaterInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  var prop = view;
  interfaceFunction.propertyIndex = shape.ix;
  prop.c.setGroupProperty(_propertyGroup);
  prop.o.setGroupProperty(_propertyGroup);

  function interfaceFunction(value) {
    if (shape.c.ix === value || value === 'Copies') {
      return interfaceFunction.copies;
    } else if (shape.o.ix === value || value === 'Offset') {
      return interfaceFunction.offset;
    }
  }
  Object.defineProperties(interfaceFunction, {
    copies: {
      get: function get() {
        return ExpressionValue(prop.c);
      }
    },
    offset: {
      get: function get() {
        return ExpressionValue(prop.o);
      }
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function pathInterfaceFactory(shape, view, propertyGroup) {
  var prop = view.sh;
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  prop.setGroupProperty(_propertyGroup);

  function interfaceFunction(val) {
    if (val === 'Shape' || val === 'shape' || val === 'Path' || val === 'path' || val === 'ADBE Vector Shape' || val === 2) {
      return interfaceFunction.path;
    }
  }
  Object.defineProperties(interfaceFunction, {
    path: {
      get: function get() {
        if (prop.k) {
          prop.getValue();
        }
        return prop;
      }
    },
    shape: {
      get: function get() {
        if (prop.k) {
          prop.getValue();
        }
        return prop;
      }
    },
    _name: {
      value: shape.nm
    },
    ix: {
      value: shape.ix
    },
    mn: {
      value: shape.mn
    }
  });
  return interfaceFunction;
}

function ShapeExpressionInterface (shapes, view, propertyGroup) {
  var interfaces = void 0;
  function _interfaceFunction(value) {
    if (typeof value === 'number') {
      return interfaces[value - 1];
    }
    var i = 0;
    var len = interfaces.length;
    while (i < len) {
      if (interfaces[i]._name === value) {
        return interfaces[i];
      }
      i += 1;
    }
  }
  _interfaceFunction.propertyGroup = propertyGroup;
  interfaces = iterateElements(shapes, view, _interfaceFunction);
  return _interfaceFunction;
}

function CompExpressionInterface (comp) {
  function _thisLayerFunction(name) {
    var i = 0;
    var len = comp.layers.length;
    while (i < len) {
      if (comp.layers[i].nm === name || comp.layers[i].ind === name) {
        return comp.elements[i].layerInterface;
      }
      i += 1;
    }
    return {
      active: false
    };
  }
  Object.defineProperty(_thisLayerFunction, '_name', {
    value: comp.data.nm
  });
  _thisLayerFunction.layer = _thisLayerFunction;
  _thisLayerFunction.pixelAspect = 1;
  _thisLayerFunction.height = comp.globalData.compSize.h;
  _thisLayerFunction.width = comp.globalData.compSize.w;
  _thisLayerFunction.pixelAspect = 1;
  _thisLayerFunction.frameDuration = 1 / comp.globalData.frameRate;
  return _thisLayerFunction;
}

var BaseElement = function () {
  function BaseElement() {
    classCallCheck(this, BaseElement);
  }

  createClass(BaseElement, [{
    key: 'checkMasks',
    value: function checkMasks() {
      if (!this.data.hasMask) {
        return false;
      }
      var i = 0;
      var len = this.data.masksProperties.length;
      while (i < len) {
        if (this.data.masksProperties[i].mode !== 'n' && this.data.masksProperties[i].cl !== false) {
          return true;
        }
        i += 1;
      }
      return false;
    }
  }, {
    key: 'initExpressions',
    value: function initExpressions() {
      this.layerInterface = LayerExpressionInterface(this);
      if (this.data.hasMask && this.maskManager) {
        this.layerInterface.registerMaskInterface(this.maskManager);
      }
      var effectsInterface = ob$2.createEffectsInterface(this, this.layerInterface);
      this.layerInterface.registerEffectsInterface(effectsInterface);

      if (this.data.ty === 0 || this.data.xt) {
        this.compInterface = CompExpressionInterface(this);
      } else if (this.data.ty === 4) {
        this.layerInterface.shapeInterface = ShapeExpressionInterface(this.shapesData, this.itemsData, this.layerInterface);
        this.layerInterface.content = this.layerInterface.shapeInterface;
      } else if (this.data.ty === 5) {
        this.layerInterface.textInterface = TransformExpressionInterface(this);
        this.layerInterface.text = this.layerInterface.textInterface;
      }
    }
  }, {
    key: 'getBlendMode',
    value: function getBlendMode() {
      return this.blendModeEnums[this.data.bm] || '';
    }
  }, {
    key: 'setBlendMode',
    value: function setBlendMode() {
      var blendModeValue = this.getBlendMode();
      var elem = this.baseElement || this.layerElement;

      elem.style['mix-blend-mode'] = blendModeValue;
    }
  }, {
    key: 'initBaseData',
    value: function initBaseData(data, globalData, comp) {
      this.globalData = globalData;
      this.comp = comp;
      this.data = data;
      this.layerId = 'ly_' + randomString(10);

      // Stretch factor for old animations missing this property.
      if (!this.data.sr) {
        this.data.sr = 1;
      }
      // effects manager
      this.effectsManager = new EffectsManager(this.data, this, this.dynamicProperties);
    }
  }, {
    key: 'getType',
    value: function getType() {
      return this.type;
    }
  }, {
    key: 'blendModeEnums',
    get: function get$$1() {
      return {
        1: 'multiply',
        2: 'screen',
        3: 'overlay',
        4: 'darken',
        5: 'lighten',
        6: 'color-dodge',
        7: 'color-burn',
        8: 'hard-light',
        9: 'soft-light',
        10: 'difference',
        11: 'exclusion',
        12: 'hue',
        13: 'saturation',
        14: 'color',
        15: 'luminosity'
      };
    }
  }]);
  return BaseElement;
}();

var DynamicPropertyContainer = function () {
  function DynamicPropertyContainer() {
    classCallCheck(this, DynamicPropertyContainer);
  }

  createClass(DynamicPropertyContainer, [{
    key: "addDynamicProperty",
    value: function addDynamicProperty(prop) {
      if (this.dynamicProperties.indexOf(prop) === -1) {
        this.dynamicProperties.push(prop);
        this.container.addDynamicProperty(this);
        this._isAnimated = true;
      }
    }
  }, {
    key: "iterateDynamicProperties",
    value: function iterateDynamicProperties() {
      this._mdf = false;
      var i = void 0;
      var len = this.dynamicProperties.length;
      for (i = 0; i < len; i += 1) {
        this.dynamicProperties[i].getValue();
        if (this.dynamicProperties[i]._mdf) {
          this._mdf = true;
        }
      }
    }
  }, {
    key: "initDynamicPropertyContainer",
    value: function initDynamicPropertyContainer(container) {
      this.container = container;
      this.dynamicProperties = [];
      this._mdf = false;
      this._isAnimated = false;
    }
  }]);
  return DynamicPropertyContainer;
}();

var degToRads$3 = Math.PI / 180;

var TransformProperty = function (_DynamicPropertyConta) {
  inherits(TransformProperty, _DynamicPropertyConta);

  function TransformProperty(elem, data, container) {
    classCallCheck(this, TransformProperty);

    var _this = possibleConstructorReturn(this, (TransformProperty.__proto__ || Object.getPrototypeOf(TransformProperty)).call(this));

    _this.elem = elem;
    _this.frameId = -1;
    _this.propType = 'transform';
    _this.data = data;
    _this.v = new Matrix();
    // Precalculated matrix with non animated properties
    _this.pre = new Matrix();
    _this.appliedTransformations = 0;
    _this.initDynamicPropertyContainer(container || elem);
    if (data.p.s) {
      _this.px = PropertyFactory$1.getProp(elem, data.p.x, 0, 0, _this);
      _this.py = PropertyFactory$1.getProp(elem, data.p.y, 0, 0, _this);
      if (data.p.z) {
        _this.pz = PropertyFactory$1.getProp(elem, data.p.z, 0, 0, _this);
      }
    } else {
      _this.p = PropertyFactory$1.getProp(elem, data.p, 1, 0, _this);
    }
    if (data.r) {
      _this.r = PropertyFactory$1.getProp(elem, data.r, 0, degToRads$3, _this);
    } else if (data.rx) {
      _this.rx = PropertyFactory$1.getProp(elem, data.rx, 0, degToRads$3, _this);
      _this.ry = PropertyFactory$1.getProp(elem, data.ry, 0, degToRads$3, _this);
      _this.rz = PropertyFactory$1.getProp(elem, data.rz, 0, degToRads$3, _this);
      if (data.or.k[0].ti) {
        var i = void 0;
        var len = data.or.k.length;
        for (i = 0; i < len; i += 1) {
          data.or.k[i].to = data.or.k[i].ti = null;
        }
      }
      _this.or = PropertyFactory$1.getProp(elem, data.or, 1, degToRads$3, _this);
      // sh Indicates it needs to be capped between -180 and 180
      _this.or.sh = true;
    }
    if (data.sk) {
      _this.sk = PropertyFactory$1.getProp(elem, data.sk, 0, degToRads$3, _this);
      _this.sa = PropertyFactory$1.getProp(elem, data.sa, 0, degToRads$3, _this);
    }
    if (data.a) {
      _this.a = PropertyFactory$1.getProp(elem, data.a, 1, 0, _this);
    }
    if (data.s) {
      _this.s = PropertyFactory$1.getProp(elem, data.s, 1, 0.01, _this);
    }
    // Opacity is not part of the transform properties, that's why it won't use this.dynamicProperties. That way transforms won't get updated if opacity changes.
    if (data.o) {
      _this.o = PropertyFactory$1.getProp(elem, data.o, 0, 0.01, elem);
    } else {
      _this.o = {
        _mdf: false,
        v: 1
      };
    }
    _this._isDirty = true;
    if (!_this.dynamicProperties.length) {
      _this.getValue(true);
    }
    return _this;
  }

  createClass(TransformProperty, [{
    key: 'applyToMatrix',
    value: function applyToMatrix(mat) {
      var _mdf = this._mdf;
      this.iterateDynamicProperties();
      this._mdf = this._mdf || _mdf;
      if (this.a) {
        mat.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]);
      }
      if (this.s) {
        mat.scale(this.s.v[0], this.s.v[1], this.s.v[2]);
      }
      if (this.sk) {
        mat.skewFromAxis(-this.sk.v, this.sa.v);
      }
      if (this.r) {
        mat.rotate(-this.r.v);
      } else {
        mat.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]);
      }
      if (this.data.p.s) {
        if (this.data.p.z) {
          mat.translate(this.px.v, this.py.v, -this.pz.v);
        } else {
          mat.translate(this.px.v, this.py.v, 0);
        }
      } else {
        mat.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
      }
    }
  }, {
    key: 'getValue',
    value: function getValue(forceRender) {
      if (this.elem.globalData.frameId === this.frameId) {
        return;
      }
      if (this._isDirty) {
        this.precalculateMatrix();
        this._isDirty = false;
      }

      this.iterateDynamicProperties();

      if (this._mdf || forceRender) {
        this.v.cloneFromProps(this.pre.props);
        if (this.appliedTransformations < 1) {
          this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]);
        }
        if (this.appliedTransformations < 2) {
          this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]);
        }
        if (this.sk && this.appliedTransformations < 3) {
          this.v.skewFromAxis(-this.sk.v, this.sa.v);
        }
        if (this.r && this.appliedTransformations < 4) {
          this.v.rotate(-this.r.v);
        } else if (!this.r && this.appliedTransformations < 4) {
          this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]);
        }
        if (this.autoOriented && this.p.keyframes && this.p.getValueAtTime) {
          var v1 = void 0;
          var v2 = void 0;
          if (this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t) {
            v1 = this.p.getValueAtTime((this.p.keyframes[0].t + 0.01) / this.elem.globalData.frameRate, 0);
            v2 = this.p.getValueAtTime(this.p.keyframes[0].t / this.elem.globalData.frameRate, 0);
          } else if (this.p._caching.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t) {
            v1 = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / this.elem.globalData.frameRate, 0);
            v2 = this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - 0.01) / this.elem.globalData.frameRate, 0);
          } else {
            v1 = this.p.pv;
            v2 = this.p.getValueAtTime((this.p._caching.lastFrame + this.p.offsetTime - 0.01) / this.elem.globalData.frameRate, this.p.offsetTime);
          }
          this.v.rotate(-Math.atan2(v1[1] - v2[1], v1[0] - v2[0]));
        }
        if (this.data.p.s) {
          if (this.data.p.z) {
            this.v.translate(this.px.v, this.py.v, -this.pz.v);
          } else {
            this.v.translate(this.px.v, this.py.v, 0);
          }
        } else {
          this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
        }
      }
      this.frameId = this.elem.globalData.frameId;
    }
  }, {
    key: 'precalculateMatrix',
    value: function precalculateMatrix() {
      if (!this.a.k) {
        this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]);
        this.appliedTransformations = 1;
      } else {
        return;
      }
      if (!this.s.effectsSequence.length) {
        this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]);
        this.appliedTransformations = 2;
      } else {
        return;
      }
      if (this.sk) {
        if (!this.sk.effectsSequence.length && !this.sa.effectsSequence.length) {
          this.pre.skewFromAxis(-this.sk.v, this.sa.v);
          this.appliedTransformations = 3;
        } else {
          return;
        }
      }
      if (this.r) {
        if (!this.r.effectsSequence.length) {
          this.pre.rotate(-this.r.v);
          this.appliedTransformations = 4;
        }
      } else if (!this.rz.effectsSequence.length && !this.ry.effectsSequence.length && !this.rx.effectsSequence.length && !this.or.effectsSequence.length) {
        this.pre.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]);
        this.appliedTransformations = 4;
      }
    }
  }, {
    key: 'autoOrient',
    value: function autoOrient() {}
  }, {
    key: 'addDynamicProperty',
    value: function addDynamicProperty(prop) {
      get(TransformProperty.prototype.__proto__ || Object.getPrototypeOf(TransformProperty.prototype), 'addDynamicProperty', this).call(this, prop);
      this.elem.addDynamicProperty(prop);
      this._isDirty = true;
    }
  }]);
  return TransformProperty;
}(DynamicPropertyContainer);

var TransformPropertyFactory = {
  getTransformProperty: function getTransformProperty(elem, data, container) {
    return new TransformProperty(elem, data, container);
  }
};

var TransformElement = function () {
  function TransformElement() {
    classCallCheck(this, TransformElement);
    this.mHelper = new Matrix();
  }

  createClass(TransformElement, [{
    key: 'initTransform',
    value: function initTransform() {
      this.finalTransform = {
        mProp: this.data.ks ? TransformPropertyFactory.getTransformProperty(this, this.data.ks, this) : {
          o: 0
        },
        _matMdf: false,
        _opMdf: false,
        mat: new Matrix()
      };
      if (this.data.ao) {
        this.finalTransform.mProp.autoOriented = true;
      }

      // TODO: check TYPE 11: Guided elements
      if (this.data.ty !== 11) ;
    }
  }, {
    key: 'renderTransform',
    value: function renderTransform() {
      this.finalTransform._opMdf = this.finalTransform.mProp.o._mdf || this._isFirstFrame;
      this.finalTransform._matMdf = this.finalTransform.mProp._mdf || this._isFirstFrame;

      if (this.hierarchy) {
        var mat = void 0;
        var finalMat = this.finalTransform.mat;
        var i = 0;
        var len = this.hierarchy.length;
        // Checking if any of the transformation matrices in the hierarchy chain has changed.
        if (!this.finalTransform._matMdf) {
          while (i < len) {
            if (this.hierarchy[i].finalTransform.mProp._mdf) {
              this.finalTransform._matMdf = true;
              break;
            }
            i += 1;
          }
        }

        if (this.finalTransform._matMdf) {
          mat = this.finalTransform.mProp.v.props;
          finalMat.cloneFromProps(mat);
          for (i = 0; i < len; i += 1) {
            mat = this.hierarchy[i].finalTransform.mProp.v.props;
            finalMat.transform(mat[0], mat[1], mat[2], mat[3], mat[4], mat[5], mat[6], mat[7], mat[8], mat[9], mat[10], mat[11], mat[12], mat[13], mat[14], mat[15]);
          }
        }
      }
    }
  }, {
    key: 'globalToLocal',
    value: function globalToLocal(pt) {
      var transforms = [];
      transforms.push(this.finalTransform);
      var flag = true;
      var comp = this.comp;
      while (flag) {
        if (comp.finalTransform) {
          if (comp.data.hasMask) {
            transforms.splice(0, 0, comp.finalTransform);
          }
          comp = comp.comp;
        } else {
          flag = false;
        }
      }
      var i = void 0;
      var len = transforms.length;
      var ptNew = void 0;
      for (i = 0; i < len; i += 1) {
        ptNew = transforms[i].mat.applyToPointArray(0, 0, 0);
        // ptNew = transforms[i].mat.applyToPointArray(pt[0],pt[1],pt[2]);
        pt = [pt[0] - ptNew[0], pt[1] - ptNew[1], 0];
      }
      return pt;
    }
  }]);
  return TransformElement;
}();

var HierarchyElement = function () {
  function HierarchyElement() {
    classCallCheck(this, HierarchyElement);
  }

  createClass(HierarchyElement, [{
    key: "initHierarchy",

    /**
       * @function
       * Initializes hierarchy properties
       *
       */
    value: function initHierarchy() {
      // element's parent list
      this.hierarchy = [];
      // if element is parent of another layer _isParent will be true
      this._isParent = false;
      this.checkParenting();
    }
    /**
       * @function
       * Sets layer's hierarchy.
       * @param {array} hierarch
       * layer's parent list
       *
       */

  }, {
    key: "setHierarchy",
    value: function setHierarchy(hierarchy) {
      this.hierarchy = hierarchy;
    }
    /**
       * @function
       * Sets layer as parent.
       *
       */

  }, {
    key: "setAsParent",
    value: function setAsParent() {
      this._isParent = true;
    }
    /**
       * @function
       * Searches layer's parenting chain
       *
       */

  }, {
    key: "checkParenting",
    value: function checkParenting() {
      if (this.data.parent !== undefined) {
        this.comp.buildElementParenting(this, this.data.parent, []);
      }
    }
  }]);
  return HierarchyElement;
}();

var FrameElement = function () {
  function FrameElement() {
    classCallCheck(this, FrameElement);
  }

  createClass(FrameElement, [{
    key: 'initFrame',

    /**
       * @function
       * Initializes frame related properties.
       *
       */
    value: function initFrame() {
      // set to true when inpoint is rendered
      this._isFirstFrame = false;
      // list of animated properties
      this.dynamicProperties = [];
      // If layer has been modified in current tick this will be true
      this._mdf = false;
    }
    /**
     * @function
     * Calculates all dynamic values
     *
     * @param {number} num
     * current frame number in Layer's time
     * @param {boolean} isVisible
     * if layers is currently in range
     *
     */

  }, {
    key: 'prepareProperties',
    value: function prepareProperties(num, isVisible) {
      var i = void 0;
      var len = this.dynamicProperties.length;
      for (i = 0; i < len; i += 1) {
        if (isVisible || this._isParent && this.dynamicProperties[i].propType === 'transform') {
          this.dynamicProperties[i].getValue();
          if (this.dynamicProperties[i]._mdf) {
            this.globalData._mdf = true;
            this._mdf = true;
          }
        }
      }
    }
  }, {
    key: 'addDynamicProperty',
    value: function addDynamicProperty(prop) {
      if (this.dynamicProperties.indexOf(prop) === -1) {
        this.dynamicProperties.push(prop);
      }
    }
  }]);
  return FrameElement;
}();

var RenderableElement = function () {
  function RenderableElement() {
    classCallCheck(this, RenderableElement);
  }

  createClass(RenderableElement, [{
    key: "initRenderable",
    value: function initRenderable() {
      // layer's visibility related to inpoint and outpoint. Rename isVisible to isInRange
      this.isInRange = false;
      // layer's display state
      this.hidden = false;
      // If layer's transparency equals 0, it can be hidden
      this.isTransparent = false;
      // list of animated components
      this.renderableComponents = [];
    }
  }, {
    key: "addRenderableComponent",
    value: function addRenderableComponent(component) {
      if (this.renderableComponents.indexOf(component) === -1) {
        this.renderableComponents.push(component);
      }
    }
  }, {
    key: "removeRenderableComponent",
    value: function removeRenderableComponent(component) {
      if (this.renderableComponents.indexOf(component) !== -1) {
        this.renderableComponents.splice(this.renderableComponents.indexOf(component), 1);
      }
    }
  }, {
    key: "prepareRenderableFrame",
    value: function prepareRenderableFrame(num) {
      this.checkLayerLimits(num);
    }
  }, {
    key: "checkTransparency",
    value: function checkTransparency() {
      if (this.finalTransform.mProp.o.v <= 0) {
        if (!this.isTransparent && this.globalData.renderConfig.hideOnTransparent) {
          this.isTransparent = true;
          this.hide();
        }
      } else if (this.isTransparent) {
        this.isTransparent = false;
        this.show();
      }
    }
    /**
     * @function
     * Initializes frame related properties.
     *
     * @param {number} num
     * current frame number in Layer's time
     *
     */

  }, {
    key: "checkLayerLimits",
    value: function checkLayerLimits(num) {
      if (this.data.ip - this.data.st <= num && this.data.op - this.data.st > num) {
        if (this.isInRange !== true) {
          this.globalData._mdf = true;
          this._mdf = true;
          this.isInRange = true;
          this.show();
        }
      } else if (this.isInRange !== false) {
        this.globalData._mdf = true;
        this.isInRange = false;
        this.hide();
      }
    }
  }, {
    key: "renderRenderable",
    value: function renderRenderable() {
      var i = void 0;
      var len = this.renderableComponents.length;
      for (i = 0; i < len; i += 1) {
        this.renderableComponents[i].renderFrame(this._isFirstFrame);
      }
      /* this.maskManager.renderFrame(this.finalTransform.mat);
      this.renderableEffectsManager.renderFrame(this._isFirstFrame); */
    }
  }, {
    key: "sourceRectAtTime",
    value: function sourceRectAtTime() {
      return {
        top: 0,
        left: 0,
        width: 100,
        height: 100
      };
    }
  }, {
    key: "getLayerSize",
    value: function getLayerSize() {
      if (this.data.ty === 5) {
        return {
          w: this.data.textData.width,
          h: this.data.textData.height
        };
      }
      return {
        w: this.data.width,
        h: this.data.height
      };
    }
  }]);
  return RenderableElement;
}();

var RenderableDOMElement = function (_RenderableElement) {
  inherits(RenderableDOMElement, _RenderableElement);

  function RenderableDOMElement() {
    classCallCheck(this, RenderableDOMElement);
    return possibleConstructorReturn(this, (RenderableDOMElement.__proto__ || Object.getPrototypeOf(RenderableDOMElement)).apply(this, arguments));
  }

  createClass(RenderableDOMElement, [{
    key: 'initElement',
    value: function initElement(data, globalData, comp) {
      this.initFrame();
      this.initBaseData(data, globalData, comp);
      this.initTransform(data, globalData, comp);
      this.initHierarchy();
      this.initRenderable();
      this.initRendererElement();
      this.createContainerElements();
      this.addMasks();
      this.createContent();
      this.hide();
    }
  }, {
    key: 'hide',
    value: function hide() {}
  }, {
    key: 'show',
    value: function show() {}
  }, {
    key: 'renderFrame',
    value: function renderFrame() {
      // If it is exported as hidden (data.hd === true) no need to render
      // If it is not visible no need to render
      if (this.data.hd || this.hidden) {
        return;
      }
      this.renderTransform();
      this.renderRenderable();
      this.renderElement();
      this.renderInnerContent();
      if (this._isFirstFrame) {
        this._isFirstFrame = false;
      }
    }
  }, {
    key: 'renderInnerContent',
    value: function renderInnerContent() {}
  }, {
    key: 'prepareFrame',
    value: function prepareFrame(num) {
      this._mdf = false;
      this.prepareRenderableFrame(num);
      this.prepareProperties(num, this.isInRange);
      this.checkTransparency();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.innerElem = null;
      this.destroyBaseElement();
    }
  }]);
  return RenderableDOMElement;
}(RenderableElement);

var ICompElement = function (_Mixin) {
  inherits(ICompElement, _Mixin);

  function ICompElement() {
    classCallCheck(this, ICompElement);
    return possibleConstructorReturn(this, (ICompElement.__proto__ || Object.getPrototypeOf(ICompElement)).apply(this, arguments));
  }

  createClass(ICompElement, [{
    key: 'initElement',
    value: function initElement(data, globalData, comp) {
      this.initFrame();
      this.initBaseData(data, globalData, comp);
      this.initTransform(data, globalData, comp);
      this.initRenderable();
      this.initHierarchy();
      this.initRendererElement();
      this.createContainerElements();
      this.addMasks();
      if (this.data.xt || !globalData.progressiveLoad) {
        this.buildAllItems();
      }
      this.hide();
    }
  }, {
    key: 'prepareFrame',
    value: function prepareFrame(num) {
      this._mdf = false;
      this.prepareRenderableFrame(num);
      this.prepareProperties(num, this.isInRange);
      if (!this.isInRange && !this.data.xt) {
        return;
      }

      if (!this.tm._placeholder) {
        var timeRemapped = this.tm.v;
        if (timeRemapped === this.data.op) {
          timeRemapped = this.data.op - 1;
        }
        this.renderedFrame = timeRemapped;
      } else {
        this.renderedFrame = num / this.data.sr;
      }
      var i = void 0;
      var len = this.elements.length;
      if (!this.completeLayers) {
        this.checkLayers(this.renderedFrame);
      }
      // This iteration needs to be backwards because of how expressions connect between each other
      for (i = len - 1; i >= 0; i -= 1) {
        if (this.completeLayers || this.elements[i]) {
          this.elements[i].prepareFrame(this.renderedFrame - this.layers[i].st);
          if (this.elements[i]._mdf) {
            this._mdf = true;
          }
        }
      }
    }
  }, {
    key: 'renderInnerContent',
    value: function renderInnerContent() {
      var i = void 0;
      var len = this.layers.length;
      for (i = 0; i < len; i += 1) {
        if (this.completeLayers || this.elements[i]) {
          this.elements[i].renderFrame();
        }
      }
    }
  }, {
    key: 'setElements',
    value: function setElements(elems) {
      this.elements = elems;
    }
  }, {
    key: 'getElements',
    value: function getElements() {
      return this.elements;
    }
  }, {
    key: 'destroyElements',
    value: function destroyElements() {
      var i = void 0;
      var len = this.layers.length;
      for (i = 0; i < len; i += 1) {
        if (this.elements[i]) {
          this.elements[i].destroy();
        }
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.destroyElements();
      this.destroyBaseElement();
    }
  }]);
  return ICompElement;
}(Mixin(BaseElement, TransformElement, HierarchyElement, FrameElement, RenderableDOMElement));

var CVEffects = function () {
  function CVEffects() {
    classCallCheck(this, CVEffects);
  }

  createClass(CVEffects, [{
    key: "renderFrame",
    value: function renderFrame() {}
  }]);
  return CVEffects;
}();

var initFrame$1 = -9999;

function interpolateShape(frameNum, previousValue, caching) {
  var iterationIndex = caching.lastIndex;
  var keyPropS = void 0;
  var keyPropE = void 0;
  var isHold = void 0;
  var j = void 0;
  var k = void 0;
  var jLen = void 0;
  var kLen = void 0;
  var perc = void 0;
  var vertexValue = void 0;
  var kf = this.keyframes;
  if (frameNum < kf[0].t - this.offsetTime) {
    keyPropS = kf[0].s[0];
    isHold = true;
    iterationIndex = 0;
  } else if (frameNum >= kf[kf.length - 1].t - this.offsetTime) {
    if (kf[kf.length - 2].h === 1) {
      keyPropS = kf[kf.length - 1].s[0];
    } else {
      keyPropS = kf[kf.length - 2].e[0];
    }
    isHold = true;
  } else {
    var i = iterationIndex;
    var len = kf.length - 1;
    var flag = true;
    var keyData = void 0;
    var nextKeyData = void 0;
    while (flag) {
      keyData = kf[i];
      nextKeyData = kf[i + 1];
      if (nextKeyData.t - this.offsetTime > frameNum) {
        break;
      }
      if (i < len - 1) {
        i += 1;
      } else {
        flag = false;
      }
    }
    isHold = keyData.h === 1;
    iterationIndex = i;
    if (!isHold) {
      if (frameNum >= nextKeyData.t - this.offsetTime) {
        perc = 1;
      } else if (frameNum < keyData.t - this.offsetTime) {
        perc = 0;
      } else {
        var fnc = void 0;
        if (keyData.__fnct) {
          fnc = keyData.__fnct;
        } else {
          fnc = ob.getBezierEasing(keyData.o.x, keyData.o.y, keyData.i.x, keyData.i.y).get;
          keyData.__fnct = fnc;
        }
        perc = fnc((frameNum - (keyData.t - this.offsetTime)) / (nextKeyData.t - this.offsetTime - (keyData.t - this.offsetTime)));
      }
      keyPropE = keyData.e[0];
    }
    keyPropS = keyData.s[0];
  }
  jLen = previousValue._length;
  kLen = keyPropS.i[0].length;
  caching.lastIndex = iterationIndex;

  for (j = 0; j < jLen; j += 1) {
    for (k = 0; k < kLen; k += 1) {
      vertexValue = isHold ? keyPropS.i[j][k] : keyPropS.i[j][k] + (keyPropE.i[j][k] - keyPropS.i[j][k]) * perc;
      previousValue.i[j][k] = vertexValue;
      vertexValue = isHold ? keyPropS.o[j][k] : keyPropS.o[j][k] + (keyPropE.o[j][k] - keyPropS.o[j][k]) * perc;
      previousValue.o[j][k] = vertexValue;
      vertexValue = isHold ? keyPropS.v[j][k] : keyPropS.v[j][k] + (keyPropE.v[j][k] - keyPropS.v[j][k]) * perc;
      previousValue.v[j][k] = vertexValue;
    }
  }
}

function interpolateShapeCurrentTime() {
  var frameNum = this.comp.renderedFrame - this.offsetTime;
  var initTime = this.keyframes[0].t - this.offsetTime;
  var endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
  var lastFrame = this._caching.lastFrame;
  if (!(lastFrame !== initFrame$1 && (lastFrame < initTime && frameNum < initTime || lastFrame > endTime && frameNum > endTime))) {
    // //
    this._caching.lastIndex = lastFrame < frameNum ? this._caching.lastIndex : 0;
    this.interpolateShape(frameNum, this.pv, this._caching);
    // //
  }
  this._caching.lastFrame = frameNum;
  return this.pv;
}

function resetShape() {
  this.paths = this.localShapeCollection;
}

function shapesEqual(shape1, shape2) {
  if (shape1._length !== shape2._length || shape1.c !== shape2.c) {
    return false;
  }
  var i = void 0;
  var len = shape1._length;
  for (i = 0; i < len; i += 1) {
    if (shape1.v[i][0] !== shape2.v[i][0] || shape1.v[i][1] !== shape2.v[i][1] || shape1.o[i][0] !== shape2.o[i][0] || shape1.o[i][1] !== shape2.o[i][1] || shape1.i[i][0] !== shape2.i[i][0] || shape1.i[i][1] !== shape2.i[i][1]) {
      return false;
    }
  }
  return true;
}

function processEffectsSequence$1() {
  if (this.lock || this.elem.globalData.frameId === this.frameId) {
    return;
  }
  this.lock = true;
  this.frameId = this.elem.globalData.frameId;
  this._mdf = false;
  /* eslint no-nested-ternary: 0 */
  var finalValue = this.kf ? this.pv : this.data.ks ? this.data.ks.k : this.data.pt.k;
  var i = void 0;
  var len = this.effectsSequence.length;
  for (i = 0; i < len; i += 1) {
    finalValue = this.effectsSequence[i](finalValue);
  }
  if (!shapesEqual(this.v, finalValue)) {
    this.v = factory.clone(finalValue);
    this.localShapeCollection.releaseShapes();
    this.localShapeCollection.addShape(this.v);
    this._mdf = true;
    this.paths = this.localShapeCollection;
  }
  this.lock = false;
}

function addEffect$1(effectFunction) {
  this.effectsSequence.push(effectFunction);
  this.container.addDynamicProperty(this);
}

var ShapeCollection = function () {
  function ShapeCollection() {
    classCallCheck(this, ShapeCollection);

    this._length = 0;
    this._maxLength = 4;
    this.shapes = createSizedArray(this._maxLength);
  }

  createClass(ShapeCollection, [{
    key: 'addShape',
    value: function addShape(shapeData) {
      if (this._length === this._maxLength) {
        this.shapes = this.shapes.concat(createSizedArray(this._maxLength));
        this._maxLength *= 2;
      }
      this.shapes[this._length] = shapeData;
      this._length += 1;
    }
  }, {
    key: 'releaseShapes',
    value: function releaseShapes() {
      var i = void 0;
      for (i = 0; i < this._length; i += 1) {
        factory.release(this.shapes[i]);
      }
      this._length = 0;
    }
  }]);
  return ShapeCollection;
}();

var _length = 0;
var _maxLength = 4;
var pool = createSizedArray(_maxLength);

function newShapeCollection() {
  var shapeCollection = void 0;
  if (_length) {
    _length -= 1;
    shapeCollection = pool[_length];
  } else {
    shapeCollection = new ShapeCollection();
  }
  return shapeCollection;
}

function release$2(shapeCollection) {
  var i = void 0;
  var len = shapeCollection._length;
  for (i = 0; i < len; i += 1) {
    factory.release(shapeCollection.shapes[i]);
  }
  shapeCollection._length = 0;

  if (_length === _maxLength) {
    pool = pooling.double(pool);
    _maxLength *= 2;
  }
  pool[_length] = shapeCollection;
  _length += 1;
}

var ob$3 = {
  newShapeCollection: newShapeCollection,
  release: release$2
};

var ShapeExpressions = function () {
  function ShapeExpressions() {
    classCallCheck(this, ShapeExpressions);
    this.setGroupProperty = setGroupProperty;
    this.getValueAtTime = getStaticValueAtTime;
  }

  createClass(ShapeExpressions, [{
    key: 'vertices',
    value: function vertices(prop, time) {
      var shapePath = this.v;
      if (time !== undefined) {
        shapePath = this.getValueAtTime(time, 0);
      }
      var i = void 0;
      var len = shapePath._length;
      var vertices = shapePath[prop];
      var points = shapePath.v;
      var arr = createSizedArray(len);
      for (i = 0; i < len; i += 1) {
        if (prop === 'i' || prop === 'o') {
          arr[i] = [vertices[i][0] - points[i][0], vertices[i][1] - points[i][1]];
        } else {
          arr[i] = [vertices[i][0], vertices[i][1]];
        }
      }
      return arr;
    }
  }, {
    key: 'points',
    value: function points(time) {
      return this.vertices('v', time);
    }
  }, {
    key: 'inTangents',
    value: function inTangents(time) {
      return this.vertices('i', time);
    }
  }, {
    key: 'outTangents',
    value: function outTangents(time) {
      return this.vertices('o', time);
    }
  }, {
    key: 'isClosed',
    value: function isClosed() {
      return this.v.c;
    }
  }, {
    key: 'pointOnPath',
    value: function pointOnPath(perc, time) {
      var shapePath = this.v;
      if (time !== undefined) {
        shapePath = this.getValueAtTime(time, 0);
      }
      if (!this._segmentsLength) {
        this._segmentsLength = bez.getSegmentsLength(shapePath);
      }

      var segmentsLength = this._segmentsLength;
      var lengths = segmentsLength.lengths;
      var lengthPos = segmentsLength.totalLength * perc;
      var i = 0;
      var len = lengths.length;
      // let j = 0;
      // let jLen;
      var accumulatedLength = 0;
      var pt = void 0;
      while (i < len) {
        if (accumulatedLength + lengths[i].addedLength > lengthPos) {
          var initIndex = i;
          var endIndex = shapePath.c && i === len - 1 ? 0 : i + 1;
          var segmentPerc = (lengthPos - accumulatedLength) / lengths[i].addedLength;
          pt = bez.getPointInSegment(shapePath.v[initIndex], shapePath.v[endIndex], shapePath.o[initIndex], shapePath.i[endIndex], segmentPerc, lengths[i]);
          break;
        } else {
          accumulatedLength += lengths[i].addedLength;
        }
        i += 1;
      }
      if (!pt) {
        pt = shapePath.c ? [shapePath.v[0][0], shapePath.v[0][1]] : [shapePath.v[shapePath._length - 1][0], shapePath.v[shapePath._length - 1][1]];
      }
      return pt;
    }
  }, {
    key: 'vectorOnPath',
    value: function vectorOnPath(perc, time, vectorType) {
      // perc doesn't use triple equality because it can be a Number object as well as a primitive.
      perc = perc === 1 ? this.v.c ? 0 : 0.999 : perc;
      var pt1 = this.pointOnPath(perc, time);
      var pt2 = this.pointOnPath(perc + 0.001, time);
      var xLength = pt2[0] - pt1[0];
      var yLength = pt2[1] - pt1[1];
      var magnitude = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2));
      var unitVector = vectorType === 'tangent' ? [xLength / magnitude, yLength / magnitude] : [-yLength / magnitude, xLength / magnitude];
      return unitVector;
    }
  }, {
    key: 'tangentOnPath',
    value: function tangentOnPath(perc, time) {
      return this.vectorOnPath(perc, time, 'tangent');
    }
  }, {
    key: 'normalOnPath',
    value: function normalOnPath(perc, time) {
      return this.vectorOnPath(perc, time, 'normal');
    }
  }]);
  return ShapeExpressions;
}();

var KeyframedShapeProperty = function (_ShapeExpressions) {
  inherits(KeyframedShapeProperty, _ShapeExpressions);

  function KeyframedShapeProperty(elem, data, type) {
    classCallCheck(this, KeyframedShapeProperty);

    var _this = possibleConstructorReturn(this, (KeyframedShapeProperty.__proto__ || Object.getPrototypeOf(KeyframedShapeProperty)).call(this));

    _this.getValue = processEffectsSequence$1;
    _this.interpolateShape = interpolateShape;
    _this.addEffect = addEffect$1;
    _this.getShapeValueAtTime = getShapeValueAtTime;
    _this.initiateExpression = ob$1.initiateExpression;

    _this.propType = 'shape';
    _this.comp = elem.comp;
    _this.elem = elem;
    _this.container = elem;
    _this.offsetTime = elem.data.st;
    _this.keyframes = type === 3 ? data.pt.k : data.ks.k;
    _this.k = true;
    _this.kf = true;
    // let i;
    var len = _this.keyframes[0].s[0].i.length;
    // let jLen = this.keyframes[0].s[0].i[0].length;
    _this.v = factory.newElement();
    _this.v.setPathData(_this.keyframes[0].s[0].c, len);
    _this.pv = factory.clone(_this.v);
    _this.localShapeCollection = ob$3.newShapeCollection();
    _this.paths = _this.localShapeCollection;
    _this.paths.addShape(_this.v);
    _this.lastFrame = initFrame$1;
    _this.reset = resetShape;
    _this._caching = {
      lastFrame: initFrame$1,
      lastIndex: 0
    };
    _this.effectsSequence = [interpolateShapeCurrentTime.bind(_this)];
    return _this;
  }

  return KeyframedShapeProperty;
}(ShapeExpressions);

var ShapeProperty = function (_ShapeExpressions) {
  inherits(ShapeProperty, _ShapeExpressions);

  function ShapeProperty(elem, data, type) {
    classCallCheck(this, ShapeProperty);

    var _this = possibleConstructorReturn(this, (ShapeProperty.__proto__ || Object.getPrototypeOf(ShapeProperty)).call(this));

    _this.addEffect = addEffect$1;
    _this.interpolateShape = interpolateShape;
    _this.getValue = processEffectsSequence$1;

    _this.propType = 'shape';
    _this.comp = elem.comp;
    _this.container = elem;
    _this.elem = elem;
    _this.data = data;
    _this.k = false;
    _this.kf = false;
    _this._mdf = false;
    var pathData = type === 3 ? data.pt.k : data.ks.k;
    _this.v = factory.clone(pathData);
    _this.pv = factory.clone(_this.v);
    _this.localShapeCollection = ob$3.newShapeCollection();
    _this.paths = _this.localShapeCollection;
    _this.paths.addShape(_this.v);
    _this.reset = resetShape;
    _this.effectsSequence = [];
    return _this;
  }

  return ShapeProperty;
}(ShapeExpressions);

var RectShapeProperty = function (_DynamicPropertyConta) {
  inherits(RectShapeProperty, _DynamicPropertyConta);

  function RectShapeProperty(elem, data) {
    classCallCheck(this, RectShapeProperty);

    var _this = possibleConstructorReturn(this, (RectShapeProperty.__proto__ || Object.getPrototypeOf(RectShapeProperty)).call(this));

    _this.reset = resetShape;

    _this.v = factory.newElement();
    _this.v.c = true;
    _this.localShapeCollection = ob$3.newShapeCollection();
    _this.localShapeCollection.addShape(_this.v);
    _this.paths = _this.localShapeCollection;
    _this.elem = elem;
    _this.comp = elem.comp;
    _this.frameId = -1;
    _this.d = data.d;
    _this.initDynamicPropertyContainer(elem);
    _this.p = PropertyFactory$1.getProp(elem, data.p, 1, 0, _this);
    _this.s = PropertyFactory$1.getProp(elem, data.s, 1, 0, _this);
    _this.r = PropertyFactory$1.getProp(elem, data.r, 0, 0, _this);
    if (_this.dynamicProperties.length) {
      _this.k = true;
    } else {
      _this.k = false;
      _this.convertRectToPath();
    }
    return _this;
  }

  createClass(RectShapeProperty, [{
    key: 'convertRectToPath',
    value: function convertRectToPath() {
      var p0 = this.p.v[0];
      var p1 = this.p.v[1];
      var v0 = this.s.v[0] / 2;
      var v1 = this.s.v[1] / 2;
      var round = bm_min(v0, v1, this.r.v);
      var cPoint = round * (1 - roundCorner);
      this.v._length = 0;

      if (this.d === 2 || this.d === 1) {
        this.v.setTripleAt(p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + cPoint, 0, true);
        this.v.setTripleAt(p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - cPoint, p0 + v0, p1 + v1 - round, 1, true);
        if (round !== 0) {
          this.v.setTripleAt(p0 + v0 - round, p1 + v1, p0 + v0 - round, p1 + v1, p0 + v0 - cPoint, p1 + v1, 2, true);
          this.v.setTripleAt(p0 - v0 + round, p1 + v1, p0 - v0 + cPoint, p1 + v1, p0 - v0 + round, p1 + v1, 3, true);
          this.v.setTripleAt(p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - cPoint, 4, true);
          this.v.setTripleAt(p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + cPoint, p0 - v0, p1 - v1 + round, 5, true);
          this.v.setTripleAt(p0 - v0 + round, p1 - v1, p0 - v0 + round, p1 - v1, p0 - v0 + cPoint, p1 - v1, 6, true);
          this.v.setTripleAt(p0 + v0 - round, p1 - v1, p0 + v0 - cPoint, p1 - v1, p0 + v0 - round, p1 - v1, 7, true);
        } else {
          this.v.setTripleAt(p0 - v0, p1 + v1, p0 - v0 + cPoint, p1 + v1, p0 - v0, p1 + v1, 2);
          this.v.setTripleAt(p0 - v0, p1 - v1, p0 - v0, p1 - v1 + cPoint, p0 - v0, p1 - v1, 3);
        }
      } else {
        this.v.setTripleAt(p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + cPoint, p0 + v0, p1 - v1 + round, 0, true);
        if (round !== 0) {
          this.v.setTripleAt(p0 + v0 - round, p1 - v1, p0 + v0 - round, p1 - v1, p0 + v0 - cPoint, p1 - v1, 1, true);
          this.v.setTripleAt(p0 - v0 + round, p1 - v1, p0 - v0 + cPoint, p1 - v1, p0 - v0 + round, p1 - v1, 2, true);
          this.v.setTripleAt(p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + cPoint, 3, true);
          this.v.setTripleAt(p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - cPoint, p0 - v0, p1 + v1 - round, 4, true);
          this.v.setTripleAt(p0 - v0 + round, p1 + v1, p0 - v0 + round, p1 + v1, p0 - v0 + cPoint, p1 + v1, 5, true);
          this.v.setTripleAt(p0 + v0 - round, p1 + v1, p0 + v0 - cPoint, p1 + v1, p0 + v0 - round, p1 + v1, 6, true);
          this.v.setTripleAt(p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - cPoint, 7, true);
        } else {
          this.v.setTripleAt(p0 - v0, p1 - v1, p0 - v0 + cPoint, p1 - v1, p0 - v0, p1 - v1, 1, true);
          this.v.setTripleAt(p0 - v0, p1 + v1, p0 - v0, p1 + v1 - cPoint, p0 - v0, p1 + v1, 2, true);
          this.v.setTripleAt(p0 + v0, p1 + v1, p0 + v0 - cPoint, p1 + v1, p0 + v0, p1 + v1, 3, true);
        }
      }
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      if (this.elem.globalData.frameId === this.frameId) {
        return;
      }
      this.frameId = this.elem.globalData.frameId;
      this.iterateDynamicProperties();
      if (this._mdf) {
        this.convertRectToPath();
      }
    }
  }]);
  return RectShapeProperty;
}(DynamicPropertyContainer);

var cPoint = 0.5519;

var EllShapeProperty = function (_DynamicPropertyConta) {
  inherits(EllShapeProperty, _DynamicPropertyConta);

  function EllShapeProperty(elem, data) {
    classCallCheck(this, EllShapeProperty);

    var _this = possibleConstructorReturn(this, (EllShapeProperty.__proto__ || Object.getPrototypeOf(EllShapeProperty)).call(this));

    _this.reset = resetShape;


    _this.v = factory.newElement();
    _this.v.setPathData(true, 4);
    _this.localShapeCollection = ob$3.newShapeCollection();
    _this.paths = _this.localShapeCollection;
    _this.localShapeCollection.addShape(_this.v);
    _this.d = data.d;
    _this.elem = elem;
    _this.comp = elem.comp;
    _this.frameId = -1;
    _this.initDynamicPropertyContainer(elem);
    _this.p = PropertyFactory$1.getProp(elem, data.p, 1, 0, _this);
    _this.s = PropertyFactory$1.getProp(elem, data.s, 1, 0, _this);
    if (_this.dynamicProperties.length) {
      _this.k = true;
    } else {
      _this.k = false;
      _this.convertEllToPath();
    }
    return _this;
  }

  createClass(EllShapeProperty, [{
    key: 'getValue',
    value: function getValue() {
      if (this.elem.globalData.frameId === this.frameId) {
        return;
      }
      this.frameId = this.elem.globalData.frameId;
      this.iterateDynamicProperties();

      if (this._mdf) {
        this.convertEllToPath();
      }
    }
  }, {
    key: 'convertEllToPath',
    value: function convertEllToPath() {
      var p0 = this.p.v[0];
      var p1 = this.p.v[1];
      var s0 = this.s.v[0] / 2;
      var s1 = this.s.v[1] / 2;
      var _cw = this.d !== 3;
      var _v = this.v;
      _v.v[0][0] = p0;
      _v.v[0][1] = p1 - s1;
      _v.v[1][0] = _cw ? p0 + s0 : p0 - s0;
      _v.v[1][1] = p1;
      _v.v[2][0] = p0;
      _v.v[2][1] = p1 + s1;
      _v.v[3][0] = _cw ? p0 - s0 : p0 + s0;
      _v.v[3][1] = p1;
      _v.i[0][0] = _cw ? p0 - s0 * cPoint : p0 + s0 * cPoint;
      _v.i[0][1] = p1 - s1;
      _v.i[1][0] = _cw ? p0 + s0 : p0 - s0;
      _v.i[1][1] = p1 - s1 * cPoint;
      _v.i[2][0] = _cw ? p0 + s0 * cPoint : p0 - s0 * cPoint;
      _v.i[2][1] = p1 + s1;
      _v.i[3][0] = _cw ? p0 - s0 : p0 + s0;
      _v.i[3][1] = p1 + s1 * cPoint;
      _v.o[0][0] = _cw ? p0 + s0 * cPoint : p0 - s0 * cPoint;
      _v.o[0][1] = p1 - s1;
      _v.o[1][0] = _cw ? p0 + s0 : p0 - s0;
      _v.o[1][1] = p1 + s1 * cPoint;
      _v.o[2][0] = _cw ? p0 - s0 * cPoint : p0 + s0 * cPoint;
      _v.o[2][1] = p1 + s1;
      _v.o[3][0] = _cw ? p0 - s0 : p0 + s0;
      _v.o[3][1] = p1 - s1 * cPoint;
    }
  }]);
  return EllShapeProperty;
}(DynamicPropertyContainer);

var degToRads$4 = Math.PI / 180;

var StarShapeProperty = function (_DynamicPropertyConta) {
  inherits(StarShapeProperty, _DynamicPropertyConta);

  function StarShapeProperty(elem, data) {
    classCallCheck(this, StarShapeProperty);

    var _this = possibleConstructorReturn(this, (StarShapeProperty.__proto__ || Object.getPrototypeOf(StarShapeProperty)).call(this));

    _this.reset = resetShape;

    _this.v = factory.newElement();
    _this.v.setPathData(true, 0);
    _this.elem = elem;
    _this.comp = elem.comp;
    _this.data = data;
    _this.frameId = -1;
    _this.d = data.d;
    _this.initDynamicPropertyContainer(elem);
    if (data.sy === 1) {
      _this.ir = PropertyFactory$1.getProp(elem, data.ir, 0, 0, _this);
      _this.is = PropertyFactory$1.getProp(elem, data.is, 0, 0.01, _this);
      _this.convertToPath = _this.convertStarToPath;
    } else {
      _this.convertToPath = _this.convertPolygonToPath;
    }
    _this.pt = PropertyFactory$1.getProp(elem, data.pt, 0, 0, _this);
    _this.p = PropertyFactory$1.getProp(elem, data.p, 1, 0, _this);
    _this.r = PropertyFactory$1.getProp(elem, data.r, 0, degToRads$4, _this);
    _this.or = PropertyFactory$1.getProp(elem, data.or, 0, 0, _this);
    _this.os = PropertyFactory$1.getProp(elem, data.os, 0, 0.01, _this);
    _this.localShapeCollection = ob$3.newShapeCollection();
    _this.localShapeCollection.addShape(_this.v);
    _this.paths = _this.localShapeCollection;
    if (_this.dynamicProperties.length) {
      _this.k = true;
    } else {
      _this.k = false;
      _this.convertToPath();
    }
    return _this;
  }

  createClass(StarShapeProperty, [{
    key: 'getValue',
    value: function getValue() {
      if (this.elem.globalData.frameId === this.frameId) {
        return;
      }
      this.frameId = this.elem.globalData.frameId;
      this.iterateDynamicProperties();
      if (this._mdf) {
        this.convertToPath();
      }
    }
  }, {
    key: 'convertStarToPath',
    value: function convertStarToPath() {
      var numPts = Math.floor(this.pt.v) * 2;
      var angle = Math.PI * 2 / numPts;
      /* this.v.v.length = numPts;
      this.v.i.length = numPts;
      this.v.o.length = numPts; */
      var longFlag = true;
      var longRad = this.or.v;
      var shortRad = this.ir.v;
      var longRound = this.os.v;
      var shortRound = this.is.v;
      var longPerimSegment = 2 * Math.PI * longRad / (numPts * 2);
      var shortPerimSegment = 2 * Math.PI * shortRad / (numPts * 2);
      var i = void 0;
      var rad = void 0;
      var roundness = void 0;
      var perimSegment = void 0;
      var currentAng = -Math.PI / 2;
      currentAng += this.r.v;
      var dir = this.data.d === 3 ? -1 : 1;
      this.v._length = 0;
      for (i = 0; i < numPts; i += 1) {
        rad = longFlag ? longRad : shortRad;
        roundness = longFlag ? longRound : shortRound;
        perimSegment = longFlag ? longPerimSegment : shortPerimSegment;
        var x = rad * Math.cos(currentAng);
        var y = rad * Math.sin(currentAng);
        var ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y);
        var oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y);
        x += +this.p.v[0];
        y += +this.p.v[1];
        this.v.setTripleAt(x, y, x - ox * perimSegment * roundness * dir, y - oy * perimSegment * roundness * dir, x + ox * perimSegment * roundness * dir, y + oy * perimSegment * roundness * dir, i, true);

        /* this.v.v[i] = [x,y];
        this.v.i[i] = [x+ox*perimSegment*roundness*dir,y+oy*perimSegment*roundness*dir];
        this.v.o[i] = [x-ox*perimSegment*roundness*dir,y-oy*perimSegment*roundness*dir];
        this.v._length = numPts; */
        longFlag = !longFlag;
        currentAng += angle * dir;
      }
    }
  }, {
    key: 'convertPolygonToPath',
    value: function convertPolygonToPath() {
      var numPts = Math.floor(this.pt.v);
      var angle = Math.PI * 2 / numPts;
      var rad = this.or.v;
      var roundness = this.os.v;
      var perimSegment = 2 * Math.PI * rad / (numPts * 4);
      var i = void 0;
      var currentAng = -Math.PI / 2;
      var dir = this.data.d === 3 ? -1 : 1;
      currentAng += this.r.v;
      this.v._length = 0;
      for (i = 0; i < numPts; i += 1) {
        var x = rad * Math.cos(currentAng);
        var y = rad * Math.sin(currentAng);
        var ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y);
        var oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y);
        x += +this.p.v[0];
        y += +this.p.v[1];
        this.v.setTripleAt(x, y, x - ox * perimSegment * roundness * dir, y - oy * perimSegment * roundness * dir, x + ox * perimSegment * roundness * dir, y + oy * perimSegment * roundness * dir, i, true);
        currentAng += angle * dir;
      }
      this.paths.length = 0;
      this.paths[0] = this.v;
    }
  }]);
  return StarShapeProperty;
}(DynamicPropertyContainer);

var _class$1;

function _applyDecoratedDescriptor$1(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var ShapePropertyFactory = (_class$1 = function () {
  function ShapePropertyFactory() {
    classCallCheck(this, ShapePropertyFactory);
  }

  createClass(ShapePropertyFactory, [{
    key: 'getShapeProp',
    value: function getShapeProp(elem, data, type) {
      var prop = void 0;
      if (type === 3 || type === 4) {
        var dataProp = type === 3 ? data.pt : data.ks;
        var keys = dataProp.k;
        if (dataProp.a === 1 || keys.length) {
          prop = new KeyframedShapeProperty(elem, data, type);
        } else {
          prop = new ShapeProperty(elem, data, type);
        }
      } else if (type === 5) {
        prop = new RectShapeProperty(elem, data);
      } else if (type === 6) {
        prop = new EllShapeProperty(elem, data);
      } else if (type === 7) {
        prop = new StarShapeProperty(elem, data);
      }
      if (prop.k) {
        elem.addDynamicProperty(prop);
      }
      return prop;
    }
  }, {
    key: 'getConstructorFunction',
    value: function getConstructorFunction() {
      return ShapeProperty;
    }
  }, {
    key: 'getKeyframedConstructorFunction',
    value: function getKeyframedConstructorFunction() {
      return KeyframedShapeProperty;
    }
  }]);
  return ShapePropertyFactory;
}(), (_applyDecoratedDescriptor$1(_class$1.prototype, 'getShapeProp', [GetShapeProp], Object.getOwnPropertyDescriptor(_class$1.prototype, 'getShapeProp'), _class$1.prototype)), _class$1);


var ShapePropertyFactory$1 = new ShapePropertyFactory();

var CVMaskElement = function () {
  function CVMaskElement(data, element) {
    classCallCheck(this, CVMaskElement);

    _initialiseProps.call(this);

    this.data = data;
    this.element = element;
    this.masksProperties = this.data.masksProperties || [];
    this.viewData = createSizedArray(this.masksProperties.length);
    var i = void 0;
    var len = this.masksProperties.length;
    var hasMasks = false;
    for (i = 0; i < len; i++) {
      if (this.masksProperties[i].mode !== 'n') {
        hasMasks = true;
      }
      this.viewData[i] = ShapePropertyFactory$1.getShapeProp(this.element, this.masksProperties[i], 3);
    }
    this.hasMasks = hasMasks;
    if (hasMasks) {
      this.element.addRenderableComponent(this);
    }
  }

  createClass(CVMaskElement, [{
    key: 'getMaskProperty',
    value: function getMaskProperty(pos) {
      return this.viewData[pos].prop;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.element = null;
    }
  }]);
  return CVMaskElement;
}();

var _initialiseProps = function _initialiseProps() {
  this.renderFrame = function () {
    if (!this.hasMasks) {
      return;
    }
    var transform = this.element.finalTransform.mat;
    var ctx = this.element.canvasContext;
    var i = void 0;
    var len = this.masksProperties.length;
    var pt = void 0;
    var pts = void 0;
    var data = void 0;
    ctx.beginPath();
    for (i = 0; i < len; i++) {
      if (this.masksProperties[i].mode !== 'n') {
        if (this.masksProperties[i].inv) {
          ctx.moveTo(0, 0);
          ctx.lineTo(this.element.globalData.compSize.w, 0);
          ctx.lineTo(this.element.globalData.compSize.w, this.element.globalData.compSize.h);
          ctx.lineTo(0, this.element.globalData.compSize.h);
          ctx.lineTo(0, 0);
        }
        data = this.viewData[i].v;
        pt = transform.applyToPointArray(data.v[0][0], data.v[0][1], 0);
        ctx.moveTo(pt[0], pt[1]);
        var j = void 0;
        var jLen = data._length;
        for (j = 1; j < jLen; j++) {
          pts = transform.applyToTriplePoints(data.o[j - 1], data.i[j], data.v[j]);
          ctx.bezierCurveTo(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]);
        }
        pts = transform.applyToTriplePoints(data.o[j - 1], data.i[0], data.v[0]);
        ctx.bezierCurveTo(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]);
      }
    }
    this.element.globalData.renderer.save(true);
    ctx.clip();
    // ctx.draw(true);
  };
};

var CVBaseElement = function () {
  function CVBaseElement() {
    classCallCheck(this, CVBaseElement);
    this.mHelper = new Matrix();
  }

  createClass(CVBaseElement, [{
    key: 'createElements',
    value: function createElements() {}
  }, {
    key: 'initRendererElement',
    value: function initRendererElement() {}
  }, {
    key: 'createContainerElements',
    value: function createContainerElements() {
      this.canvasContext = this.globalData.canvasContext;
      this.renderableEffectsManager = new CVEffects(this);
    }
  }, {
    key: 'createContent',
    value: function createContent() {}
  }, {
    key: 'setBlendMode',
    value: function setBlendMode() {
      var globalData = this.globalData;
      if (globalData.blendMode !== this.data.bm) {
        globalData.blendMode = this.data.bm;
        var blendModeValue = this.getBlendMode();
        globalData.canvasContext.globalCompositeOperation = blendModeValue;
      }
    }
  }, {
    key: 'addMasks',
    value: function addMasks() {
      this.maskManager = new CVMaskElement(this.data, this);
    }
  }, {
    key: 'hideElement',
    value: function hideElement() {
      if (!this.hidden && (!this.isInRange || this.isTransparent)) {
        this.hidden = true;
      }
    }
  }, {
    key: 'showElement',
    value: function showElement() {
      if (this.isInRange && !this.isTransparent) {
        this.hidden = false;
        this._isFirstFrame = true;
        this.maskManager._isFirstFrame = true;
      }
    }
  }, {
    key: 'renderFrame',
    value: function renderFrame() {
      if (this.hidden || this.data.hd) {
        return;
      }
      this.renderTransform();
      this.renderRenderable();
      this.setBlendMode();
      this.globalData.renderer.save();
      this.globalData.renderer.ctxTransform(this.finalTransform.mat.props);
      this.globalData.renderer.ctxOpacity(this.finalTransform.mProp.o.v);
      this.renderInnerContent();
      this.globalData.renderer.restore();
      if (this.maskManager.hasMasks) {
        this.globalData.renderer.restore(true);
      }
      if (this._isFirstFrame) {
        this._isFirstFrame = false;
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.canvasContext = null;
      this.data = null;
      this.globalData = null;
      this.maskManager.destroy();
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.hideElement();
    }
  }, {
    key: 'show',
    value: function show() {
      this.showElement();
    }
  }]);
  return CVBaseElement;
}();

var CVCompElementClass = void 0;

var CVCompElementFactory = (function (CanvasRenderer) {
  if (CVCompElementClass) return CVCompElementClass;
  CVCompElementClass = function (_Mixin) {
    inherits(CVCompElement, _Mixin);

    function CVCompElement(data, globalData, comp) {
      classCallCheck(this, CVCompElement);

      var _this = possibleConstructorReturn(this, (CVCompElement.__proto__ || Object.getPrototypeOf(CVCompElement)).call(this));

      _this.completeLayers = false;
      _this.layers = data.layers || [];
      _this.pendingElements = [];
      _this.elements = Array.apply(null, {
        length: _this.layers.length
      });
      _this.initElement(data, globalData, comp);
      _this.tm = data.tm ? PropertyFactory$1.getProp(_this, data.tm, 0, globalData.frameRate, _this) : {
        _placeholder: true
      };
      return _this;
    }

    createClass(CVCompElement, [{
      key: 'renderInnerContent',
      value: function renderInnerContent() {
        var i = void 0;
        var len = this.layers.length;
        for (i = len - 1; i >= 0; i -= 1) {
          if (this.completeLayers || this.elements[i]) {
            this.elements[i].renderFrame();
          }
        }
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        var i = void 0;
        var len = this.layers.length;
        for (i = len - 1; i >= 0; i -= 1) {
          if (this.elements[i]) {
            this.elements[i].destroy();
          }
        }
        this.layers = null;
        this.elements = null;
      }
    }]);
    return CVCompElement;
  }(Mixin(CanvasRenderer, ICompElement, CVBaseElement));
  return CVCompElementClass;
});

var CVShapeData = function () {
  function CVShapeData(element, data) {
    classCallCheck(this, CVShapeData);

    this.nodes = [];
    this.trNodes = [];
    this.tr = [0, 0, 0, 0, 0, 0];
    var ty = 4;
    if (data.ty === 'rc') {
      ty = 5;
    } else if (data.ty === 'el') {
      ty = 6;
    } else if (data.ty === 'sr') {
      ty = 7;
    }
    this.sh = ShapePropertyFactory$1.getShapeProp(element, data, ty, element);
    this.st = false;
    this.fl = false;
  }

  createClass(CVShapeData, [{
    key: 'setAsAnimated',
    value: function setAsAnimated() {
      this._isAnimated = true;
    }
  }]);
  return CVShapeData;
}();

var ProcessedElement = function ProcessedElement(element, position) {
  classCallCheck(this, ProcessedElement);

  this.elem = element;
  this.pos = position;
};

var IShapeElement = function () {
  function IShapeElement() {
    classCallCheck(this, IShapeElement);
  }

  createClass(IShapeElement, [{
    key: 'addShapeToModifiers',
    value: function addShapeToModifiers(data) {
      var i = void 0;
      var len = this.shapeModifiers.length;
      for (i = 0; i < len; i += 1) {
        this.shapeModifiers[i].addShape(data);
      }
    }
  }, {
    key: 'isShapeInAnimatedModifiers',
    value: function isShapeInAnimatedModifiers(data) {
      var i = 0;
      var len = this.shapeModifiers.length;
      while (i < len) {
        if (this.shapeModifiers[i].isAnimatedWithShape(data)) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'renderModifiers',
    value: function renderModifiers() {
      if (!this.shapeModifiers.length) {
        return;
      }
      var i = void 0;
      var len = this.shapes.length;
      for (i = 0; i < len; i += 1) {
        this.shapes[i].sh.reset();
      }

      len = this.shapeModifiers.length;
      for (i = len - 1; i >= 0; i -= 1) {
        this.shapeModifiers[i].processShapes(this._isFirstFrame);
      }
    }
  }, {
    key: 'searchProcessedElement',
    value: function searchProcessedElement(elem) {
      var elements = this.processedElements;
      var i = 0;
      var len = elements.length;
      while (i < len) {
        if (elements[i].elem === elem) {
          return elements[i].pos;
        }
        i += 1;
      }
      return 0;
    }
  }, {
    key: 'addProcessedElement',
    value: function addProcessedElement(elem, pos) {
      var elements = this.processedElements;
      var i = elements.length;
      while (i) {
        i -= 1;
        if (elements[i].elem === elem) {
          elements[i].pos = pos;
          return;
        }
      }
      elements.push(new ProcessedElement(elem, pos));
    }
  }, {
    key: 'prepareFrame',
    value: function prepareFrame(num) {
      this.prepareRenderableFrame(num);
      this.prepareProperties(num, this.isInRange);
    }
  }, {
    key: 'lcEnum',
    get: function get$$1() {
      return {
        1: 'butt',
        2: 'round',
        3: 'square'
      };
    }
  }, {
    key: 'ljEnum',
    get: function get$$1() {
      return {
        1: 'miter',
        2: 'round',
        3: 'butt'
      };
    }
  }]);
  return IShapeElement;
}();

var DashProperty = function (_DynamicPropertyConta) {
  inherits(DashProperty, _DynamicPropertyConta);

  function DashProperty(elem, data, renderer, container) {
    classCallCheck(this, DashProperty);

    var _this = possibleConstructorReturn(this, (DashProperty.__proto__ || Object.getPrototypeOf(DashProperty)).call(this));

    _this.elem = elem;
    _this.frameId = -1;
    _this.dataProps = createSizedArray(data.length);
    _this.renderer = renderer;
    _this.k = false;
    _this.dashStr = '';
    _this.dashArray = createTypedArray('float32', data.length ? data.length - 1 : 0);
    _this.dashoffset = createTypedArray('float32', 1);
    _this.initDynamicPropertyContainer(container);
    var i = void 0;
    var len = data.length || 0;
    var prop = void 0;
    for (i = 0; i < len; i += 1) {
      prop = PropertyFactory$1.getProp(elem, data[i].v, 0, 0, _this);
      _this.k = prop.k || _this.k;
      _this.dataProps[i] = {
        n: data[i].n,
        p: prop
      };
    }
    if (!_this.k) {
      _this.getValue(true);
    }
    _this._isAnimated = _this.k;
    return _this;
  }

  createClass(DashProperty, [{
    key: 'getValue',
    value: function getValue(forceRender) {
      if (this.elem.globalData.frameId === this.frameId && !forceRender) {
        return;
      }
      this.frameId = this.elem.globalData.frameId;
      this.iterateDynamicProperties();
      this._mdf = this._mdf || forceRender;
      if (this._mdf) {
        var _i = 0;
        var _len = this.dataProps.length;
        if (this.renderer === 'svg') {
          this.dashStr = '';
        }
        for (_i = 0; _i < _len; _i += 1) {
          if (this.dataProps[_i].n !== 'o') {
            if (this.renderer === 'svg') {
              this.dashStr += ' ' + this.dataProps[_i].p.v;
            } else {
              this.dashArray[_i] = this.dataProps[_i].p.v;
            }
          } else {
            this.dashoffset[0] = this.dataProps[_i].p.v;
          }
        }
      }
    }
  }]);
  return DashProperty;
}(DynamicPropertyContainer);

var ShapeModifier = function (_DynamicPropertyConta) {
  inherits(ShapeModifier, _DynamicPropertyConta);

  function ShapeModifier() {
    classCallCheck(this, ShapeModifier);
    return possibleConstructorReturn(this, (ShapeModifier.__proto__ || Object.getPrototypeOf(ShapeModifier)).apply(this, arguments));
  }

  createClass(ShapeModifier, [{
    key: 'initModifierProperties',
    value: function initModifierProperties() {}
  }, {
    key: 'addShapeToModifier',
    value: function addShapeToModifier() {}
  }, {
    key: 'addShape',
    value: function addShape(data) {
      if (!this.closed) {
        var shapeData = {
          shape: data.sh,
          data: data,
          localShapeCollection: ob$3.newShapeCollection()
        };
        this.shapes.push(shapeData);
        this.addShapeToModifier(shapeData);
        if (this._isAnimated) {
          data.setAsAnimated();
        }
      }
    }
  }, {
    key: 'init',
    value: function init(elem, data) {
      this.shapes = [];
      this.elem = elem;
      this.initDynamicPropertyContainer(elem);
      this.initModifierProperties(elem, data);
      this.frameId = -999999;
      this.closed = false;
      this.k = false;
      if (this.dynamicProperties.length) {
        this.k = true;
      } else {
        this.getValue(true);
      }
    }
  }, {
    key: 'processKeys',
    value: function processKeys() {
      if (this.elem.globalData.frameId === this.frameId) {
        return;
      }
      this.frameId = this.elem.globalData.frameId;
      this.iterateDynamicProperties();
    }
  }]);
  return ShapeModifier;
}(DynamicPropertyContainer);

var modifiers = {};

var ShapeModifiers = {
  registerModifier: function registerModifier(nm, factory) {
    if (!modifiers[nm]) {
      modifiers[nm] = factory;
    }
  },
  getModifier: function getModifier(nm, elem, data) {
    return new modifiers[nm](elem, data);
  }
};

var RoundCornersModifier = function (_ShapeModifier) {
  inherits(RoundCornersModifier, _ShapeModifier);

  function RoundCornersModifier() {
    classCallCheck(this, RoundCornersModifier);
    return possibleConstructorReturn(this, (RoundCornersModifier.__proto__ || Object.getPrototypeOf(RoundCornersModifier)).apply(this, arguments));
  }

  createClass(RoundCornersModifier, [{
    key: 'initModifierProperties',
    value: function initModifierProperties(elem, data) {
      this.getValue = this.processKeys;
      this.rd = PropertyFactory$1.getProp(elem, data.r, 0, null, this);
      this._isAnimated = !!this.rd.effectsSequence.length;
    }
  }, {
    key: 'processPath',
    value: function processPath(path, round) {
      var cloned_path = factory.newElement();
      cloned_path.c = path.c;
      var i = void 0;
      var len = path._length;
      var currentV = void 0;
      var currentI = void 0;
      var currentO = void 0;
      var closerV = void 0;
      // let newV;
      // let newO;
      // let newI;
      var distance = void 0;
      var newPosPerc = void 0;
      var index = 0;
      var vX = void 0;
      var vY = void 0;
      var oX = void 0;
      var oY = void 0;
      var iX = void 0;
      var iY = void 0;

      for (i = 0; i < len; i += 1) {
        currentV = path.v[i];
        currentO = path.o[i];
        currentI = path.i[i];
        if (currentV[0] === currentO[0] && currentV[1] === currentO[1] && currentV[0] === currentI[0] && currentV[1] === currentI[1]) {
          if ((i === 0 || i === len - 1) && !path.c) {
            cloned_path.setTripleAt(currentV[0], currentV[1], currentO[0], currentO[1], currentI[0], currentI[1], index);
            index += 1;
          } else {
            if (i === 0) {
              closerV = path.v[len - 1];
            } else {
              closerV = path.v[i - 1];
            }
            distance = Math.sqrt(Math.pow(currentV[0] - closerV[0], 2) + Math.pow(currentV[1] - closerV[1], 2));
            newPosPerc = distance ? Math.min(distance / 2, round) / distance : 0;
            vX = iX = currentV[0] + (closerV[0] - currentV[0]) * newPosPerc;
            vY = iY = currentV[1] - (currentV[1] - closerV[1]) * newPosPerc;
            oX = vX - (vX - currentV[0]) * roundCorner;
            oY = vY - (vY - currentV[1]) * roundCorner;
            cloned_path.setTripleAt(vX, vY, oX, oY, iX, iY, index);
            index += 1;

            if (i === len - 1) {
              closerV = path.v[0];
            } else {
              closerV = path.v[i + 1];
            }
            distance = Math.sqrt(Math.pow(currentV[0] - closerV[0], 2) + Math.pow(currentV[1] - closerV[1], 2));
            newPosPerc = distance ? Math.min(distance / 2, round) / distance : 0;
            vX = oX = currentV[0] + (closerV[0] - currentV[0]) * newPosPerc;
            vY = oY = currentV[1] + (closerV[1] - currentV[1]) * newPosPerc;
            iX = vX - (vX - currentV[0]) * roundCorner;
            iY = vY - (vY - currentV[1]) * roundCorner;
            cloned_path.setTripleAt(vX, vY, oX, oY, iX, iY, index);
            index += 1;
          }
        } else {
          cloned_path.setTripleAt(path.v[i][0], path.v[i][1], path.o[i][0], path.o[i][1], path.i[i][0], path.i[i][1], index);
          index += 1;
        }
      }
      return cloned_path;
    }
  }, {
    key: 'processShapes',
    value: function processShapes(_isFirstFrame) {
      var shapePaths = void 0;
      var i = void 0;
      var len = this.shapes.length;
      var j = void 0;
      var jLen = void 0;
      var rd = this.rd.v;

      if (rd !== 0) {
        var shapeData = void 0;
        // let newPaths;
        var localShapeCollection = void 0;
        var shapes = this.shapes,
            _mdf = this._mdf;

        for (i = 0; i < len; i += 1) {
          shapeData = shapes[i];
          // newPaths = shapeData.shape.paths;
          localShapeCollection = shapeData.localShapeCollection;
          if (!(!shapeData.shape._mdf && !_mdf && !_isFirstFrame)) {
            localShapeCollection.releaseShapes();
            shapeData.shape._mdf = true;
            shapePaths = shapeData.shape.paths.shapes;
            jLen = shapeData.shape.paths._length;
            for (j = 0; j < jLen; j += 1) {
              localShapeCollection.addShape(this.processPath(shapePaths[j], rd));
            }
          }
          shapeData.shape.paths = shapeData.localShapeCollection;
        }
      }
      if (!this.dynamicProperties.length) {
        this._mdf = false;
      }
    }
  }]);
  return RoundCornersModifier;
}(ShapeModifier);

var MouseModifier = function (_ShapeModifier) {
  inherits(MouseModifier, _ShapeModifier);

  function MouseModifier() {
    classCallCheck(this, MouseModifier);
    return possibleConstructorReturn(this, (MouseModifier.__proto__ || Object.getPrototypeOf(MouseModifier)).apply(this, arguments));
  }

  createClass(MouseModifier, [{
    key: 'processKeys',
    value: function processKeys(forceRender) {
      if (this.elem.globalData.frameId === this.frameId && !forceRender) {
        return;
      }
      this._mdf = true;
    }
  }, {
    key: 'addShapeToModifier',
    value: function addShapeToModifier() {
      this.positions.push([]);
    }
  }, {
    key: 'processPath',
    value: function processPath(path, mouseCoords, positions) {
      var i = void 0;
      var len = path.v.length;
      var vValues = [];
      var oValues = [];
      var iValues = [];
      // let dist;
      var theta = void 0;
      var x = void 0;
      var y = void 0;
      // // OPTION A
      for (i = 0; i < len; i += 1) {
        if (!positions.v[i]) {
          positions.v[i] = [path.v[i][0], path.v[i][1]];
          positions.o[i] = [path.o[i][0], path.o[i][1]];
          positions.i[i] = [path.i[i][0], path.i[i][1]];
          positions.distV[i] = 0;
          positions.distO[i] = 0;
          positions.distI[i] = 0;
        }
        theta = Math.atan2(path.v[i][1] - mouseCoords[1], path.v[i][0] - mouseCoords[0]);

        x = mouseCoords[0] - positions.v[i][0];
        y = mouseCoords[1] - positions.v[i][1];
        var distance = Math.sqrt(x * x + y * y);
        positions.distV[i] += (distance - positions.distV[i]) * this.data.dc;

        positions.v[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist - positions.distV[i]) / 2 + path.v[i][0];
        positions.v[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist - positions.distV[i]) / 2 + path.v[i][1];

        theta = Math.atan2(path.o[i][1] - mouseCoords[1], path.o[i][0] - mouseCoords[0]);

        x = mouseCoords[0] - positions.o[i][0];
        y = mouseCoords[1] - positions.o[i][1];
        distance = Math.sqrt(x * x + y * y);
        positions.distO[i] += (distance - positions.distO[i]) * this.data.dc;

        positions.o[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist - positions.distO[i]) / 2 + path.o[i][0];
        positions.o[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist - positions.distO[i]) / 2 + path.o[i][1];

        theta = Math.atan2(path.i[i][1] - mouseCoords[1], path.i[i][0] - mouseCoords[0]);

        x = mouseCoords[0] - positions.i[i][0];
        y = mouseCoords[1] - positions.i[i][1];
        distance = Math.sqrt(x * x + y * y);
        positions.distI[i] += (distance - positions.distI[i]) * this.data.dc;

        positions.i[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist - positions.distI[i]) / 2 + path.i[i][0];
        positions.i[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist - positions.distI[i]) / 2 + path.i[i][1];

        // ///OPTION 1
        vValues.push(positions.v[i]);
        oValues.push(positions.o[i]);
        iValues.push(positions.i[i]);
      }

      return {
        v: vValues,
        o: oValues,
        i: iValues,
        c: path.c
      };
    }
  }, {
    key: 'processShapes',
    value: function processShapes() {
      var mouseX = this.elem.globalData.mouseX;
      var mouseY = this.elem.globalData.mouseY;
      var shapePaths = void 0;
      var i = void 0;
      var len = this.shapes.length;
      var j = void 0;
      var jLen = void 0;

      if (mouseX) {
        var localMouseCoords = this.elem.globalToLocal([mouseX, mouseY, 0]);

        var shapeData = void 0;
        var newPaths = [];
        var shapes = this.shapes,
            _mdf = this._mdf,
            positions = this.positions;

        for (i = 0; i < len; i += 1) {
          shapeData = shapes[i];
          if (!shapeData.shape._mdf && !_mdf) {
            shapeData.shape.paths = shapeData.last;
          } else {
            shapeData.shape._mdf = true;
            shapePaths = shapeData.shape.paths;
            jLen = shapePaths.length;
            for (j = 0; j < jLen; j += 1) {
              if (!positions[i][j]) {
                this.positions[i][j] = {
                  v: [],
                  o: [],
                  i: [],
                  distV: [],
                  distO: [],
                  distI: []
                };
              }
              newPaths.push(this.processPath(shapePaths[j], localMouseCoords, this.positions[i][j]));
            }
            shapeData.shape.paths = newPaths;
            shapeData.last = newPaths;
          }
        }
      }
    }
  }, {
    key: 'initModifierProperties',
    value: function initModifierProperties(elem, data) {
      this.getValue = this.processKeys;
      this.data = data;
      this.positions = [];
    }
  }]);
  return MouseModifier;
}(ShapeModifier);

var RepeaterModifier = function (_ShapeModifier) {
  inherits(RepeaterModifier, _ShapeModifier);

  function RepeaterModifier() {
    classCallCheck(this, RepeaterModifier);
    return possibleConstructorReturn(this, (RepeaterModifier.__proto__ || Object.getPrototypeOf(RepeaterModifier)).apply(this, arguments));
  }

  createClass(RepeaterModifier, [{
    key: 'initModifierProperties',
    value: function initModifierProperties(elem, data) {
      this.getValue = this.processKeys;
      this.c = PropertyFactory$1.getProp(elem, data.c, 0, null, this);
      this.o = PropertyFactory$1.getProp(elem, data.o, 0, null, this);
      this.tr = TransformPropertyFactory.getTransformProperty(elem, data.tr, this);
      this.data = data;
      if (!this.dynamicProperties.length) {
        this.getValue(true);
      }
      this._isAnimated = !!this.dynamicProperties.length;
      this.pMatrix = new Matrix();
      this.rMatrix = new Matrix();
      this.sMatrix = new Matrix();
      this.tMatrix = new Matrix();
      this.matrix = new Matrix();
    }
  }, {
    key: 'applyTransforms',
    value: function applyTransforms(pMatrix, rMatrix, sMatrix, transform, perc, inv) {
      var dir = inv ? -1 : 1;
      var scaleX = transform.s.v[0] + (1 - transform.s.v[0]) * (1 - perc);
      var scaleY = transform.s.v[1] + (1 - transform.s.v[1]) * (1 - perc);
      pMatrix.translate(transform.p.v[0] * dir * perc, transform.p.v[1] * dir * perc, transform.p.v[2]);
      rMatrix.translate(-transform.a.v[0], -transform.a.v[1], transform.a.v[2]);
      rMatrix.rotate(-transform.r.v * dir * perc);
      rMatrix.translate(transform.a.v[0], transform.a.v[1], transform.a.v[2]);
      sMatrix.translate(-transform.a.v[0], -transform.a.v[1], transform.a.v[2]);
      sMatrix.scale(inv ? 1 / scaleX : scaleX, inv ? 1 / scaleY : scaleY);
      sMatrix.translate(transform.a.v[0], transform.a.v[1], transform.a.v[2]);
    }
  }, {
    key: 'init',
    value: function init(elem, arr, pos, elemsData) {
      this.elem = elem;
      this.arr = arr;
      this.pos = pos;
      this.elemsData = elemsData;
      this._currentCopies = 0;
      this._elements = [];
      this._groups = [];
      this.frameId = -1;
      this.initDynamicPropertyContainer(elem);
      this.initModifierProperties(elem, arr[pos]);
      // let cont = 0;
      while (pos > 0) {
        pos -= 1;
        // this._elements.unshift(arr.splice(pos,1)[0]);
        this._elements.unshift(arr[pos]);
        // cont += 1;
      }
      if (this.dynamicProperties.length) {
        this.k = true;
      } else {
        this.getValue(true);
      }
    }
  }, {
    key: 'resetElements',
    value: function resetElements(elements) {
      var i = void 0;
      var len = elements.length;
      for (i = 0; i < len; i += 1) {
        elements[i]._processed = false;
        if (elements[i].ty === 'gr') {
          this.resetElements(elements[i].it);
        }
      }
    }
  }, {
    key: 'cloneElements',
    value: function cloneElements(elements) {
      // let i;
      // let len = elements.length;
      var newElements = JSON.parse(JSON.stringify(elements));
      this.resetElements(newElements);
      return newElements;
    }
  }, {
    key: 'changeGroupRender',
    value: function changeGroupRender(elements, renderFlag) {
      var i = void 0;
      var len = elements.length;
      for (i = 0; i < len; i += 1) {
        elements[i]._render = renderFlag;
        if (elements[i].ty === 'gr') {
          this.changeGroupRender(elements[i].it, renderFlag);
        }
      }
    }
  }, {
    key: 'processShapes',
    value: function processShapes(_isFirstFrame) {
      var items = void 0;
      var itemsTransform = void 0;
      var i = void 0;
      var dir = void 0;
      var cont = void 0;
      if (this._mdf || _isFirstFrame) {
        var copies = Math.ceil(this.c.v);
        if (this._groups.length < copies) {
          while (this._groups.length < copies) {
            var group = {
              it: this.cloneElements(this._elements),
              ty: 'gr'
            };
            group.it.push({
              a: { a: 0, ix: 1, k: [0, 0] }, nm: 'Transform', o: { a: 0, ix: 7, k: 100 }, p: { a: 0, ix: 2, k: [0, 0] }, r: { a: 1, ix: 6, k: [{ s: 0, e: 0, t: 0 }, { s: 0, e: 0, t: 1 }] }, s: { a: 0, ix: 3, k: [100, 100] }, sa: { a: 0, ix: 5, k: 0 }, sk: { a: 0, ix: 4, k: 0 }, ty: 'tr'
            });

            this.arr.splice(0, 0, group);
            this._groups.splice(0, 0, group);
            this._currentCopies += 1;
          }
          this.elem.reloadShapes();
        }
        cont = 0;
        var renderFlag = void 0;
        for (i = 0; i <= this._groups.length - 1; i += 1) {
          renderFlag = cont < copies;
          this._groups[i]._render = renderFlag;
          this.changeGroupRender(this._groups[i].it, renderFlag);
          cont += 1;
        }

        this._currentCopies = copies;
        // //

        var offset = this.o.v;
        var offsetModulo = offset % 1;
        var roundOffset = offset > 0 ? Math.floor(offset) : Math.ceil(offset);
        // let k;
        // let tMat = this.tr.v.props;
        var pProps = this.pMatrix.props;
        var rProps = this.rMatrix.props;
        var sProps = this.sMatrix.props;
        this.pMatrix.reset();
        this.rMatrix.reset();
        this.sMatrix.reset();
        this.tMatrix.reset();
        this.matrix.reset();
        var iteration = 0;

        if (offset > 0) {
          while (iteration < roundOffset) {
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, false);
            iteration += 1;
          }
          if (offsetModulo) {
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, offsetModulo, false);
            iteration += offsetModulo;
          }
        } else if (offset < 0) {
          while (iteration > roundOffset) {
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, true);
            iteration -= 1;
          }
          if (offsetModulo) {
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, -offsetModulo, true);
            iteration -= offsetModulo;
          }
        }
        i = this.data.m === 1 ? 0 : this._currentCopies - 1;
        dir = this.data.m === 1 ? 1 : -1;
        cont = this._currentCopies;
        var j = void 0;
        var jLen = void 0;
        while (cont) {
          items = this.elemsData[i].it;
          itemsTransform = items[items.length - 1].transform.mProps.v.props;
          jLen = itemsTransform.length;
          items[items.length - 1].transform.mProps._mdf = true;
          items[items.length - 1].transform.op._mdf = true;
          if (iteration !== 0) {
            if (i !== 0 && dir === 1 || i !== this._currentCopies - 1 && dir === -1) {
              this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, false);
            }
            this.matrix.transform(rProps[0], rProps[1], rProps[2], rProps[3], rProps[4], rProps[5], rProps[6], rProps[7], rProps[8], rProps[9], rProps[10], rProps[11], rProps[12], rProps[13], rProps[14], rProps[15]);
            this.matrix.transform(sProps[0], sProps[1], sProps[2], sProps[3], sProps[4], sProps[5], sProps[6], sProps[7], sProps[8], sProps[9], sProps[10], sProps[11], sProps[12], sProps[13], sProps[14], sProps[15]);
            this.matrix.transform(pProps[0], pProps[1], pProps[2], pProps[3], pProps[4], pProps[5], pProps[6], pProps[7], pProps[8], pProps[9], pProps[10], pProps[11], pProps[12], pProps[13], pProps[14], pProps[15]);

            for (j = 0; j < jLen; j += 1) {
              itemsTransform[j] = this.matrix.props[j];
            }
            this.matrix.reset();
          } else {
            this.matrix.reset();
            for (j = 0; j < jLen; j += 1) {
              itemsTransform[j] = this.matrix.props[j];
            }
          }
          iteration += 1;
          cont -= 1;
          i += dir;
        }
      } else {
        cont = this._currentCopies;
        i = 0;
        dir = 1;
        while (cont) {
          items = this.elemsData[i].it;
          itemsTransform = items[items.length - 1].transform.mProps.v.props;
          items[items.length - 1].transform.mProps._mdf = false;
          items[items.length - 1].transform.op._mdf = false;
          cont -= 1;
          i += dir;
        }
      }
    }
  }, {
    key: 'addShape',
    value: function addShape() {}
  }]);
  return RepeaterModifier;
}(ShapeModifier);

var TrimModifier = function (_ShapeModifier) {
  inherits(TrimModifier, _ShapeModifier);

  function TrimModifier() {
    classCallCheck(this, TrimModifier);
    return possibleConstructorReturn(this, (TrimModifier.__proto__ || Object.getPrototypeOf(TrimModifier)).apply(this, arguments));
  }

  createClass(TrimModifier, [{
    key: 'initModifierProperties',
    value: function initModifierProperties(elem, data) {
      this.s = PropertyFactory$1.getProp(elem, data.s, 0, 0.01, this);
      this.e = PropertyFactory$1.getProp(elem, data.e, 0, 0.01, this);
      this.o = PropertyFactory$1.getProp(elem, data.o, 0, 0, this);
      this.sValue = 0;
      this.eValue = 0;
      this.getValue = this.processKeys;
      this.m = data.m;
      this._isAnimated = !!this.s.effectsSequence.length || !!this.e.effectsSequence.length || !!this.o.effectsSequence.length;
    }
  }, {
    key: 'addShapeToModifier',
    value: function addShapeToModifier(shapeData) {
      shapeData.pathsData = [];
    }
  }, {
    key: 'calculateShapeEdges',
    value: function calculateShapeEdges(s, e, shapeLength, addedLength, totalModifierLength) {
      var segments = [];
      if (e <= 1) {
        segments.push({
          s: s,
          e: e
        });
      } else if (s >= 1) {
        segments.push({
          s: s - 1,
          e: e - 1
        });
      } else {
        segments.push({
          s: s,
          e: 1
        });
        segments.push({
          s: 0,
          e: e - 1
        });
      }
      var shapeSegments = [];
      var i = void 0;
      var len = segments.length;
      var segmentOb = void 0;
      for (i = 0; i < len; i += 1) {
        segmentOb = segments[i];
        if (segmentOb.e * totalModifierLength < addedLength || segmentOb.s * totalModifierLength > addedLength + shapeLength) {
          continue;
        } else {
          var shapeS = void 0;
          var shapeE = void 0;
          if (segmentOb.s * totalModifierLength <= addedLength) {
            shapeS = 0;
          } else {
            shapeS = (segmentOb.s * totalModifierLength - addedLength) / shapeLength;
          }
          if (segmentOb.e * totalModifierLength >= addedLength + shapeLength) {
            shapeE = 1;
          } else {
            shapeE = (segmentOb.e * totalModifierLength - addedLength) / shapeLength;
          }
          shapeSegments.push([shapeS, shapeE]);
        }
      }
      if (!shapeSegments.length) {
        shapeSegments.push([0, 0]);
      }
      return shapeSegments;
    }
  }, {
    key: 'releasePathsData',
    value: function releasePathsData(pathsData) {
      var i = void 0;
      var len = pathsData.length;
      for (i = 0; i < len; i += 1) {
        segments_length_pool.release(pathsData[i]);
      }
      pathsData.length = 0;
      return pathsData;
    }
  }, {
    key: 'processShapes',
    value: function processShapes(_isFirstFrame) {
      var s = void 0;
      var e = void 0;
      if (this._mdf || _isFirstFrame) {
        var o = this.o.v % 360 / 360;
        if (o < 0) {
          o += 1;
        }
        s = this.s.v + o;
        e = this.e.v + o;
        // if (s === e) {
        // }
        if (s > e) {
          var _s = s;
          s = e;
          e = _s;
        }
        s = Math.round(s * 1000) / 1000;
        e = Math.round(e * 1000) / 1000;
        this.sValue = s;
        this.eValue = e;
      } else {
        s = this.sValue;
        e = this.eValue;
      }
      var shapePaths = void 0;
      var i = void 0;
      var len = this.shapes.length;
      var j = void 0;
      var jLen = void 0;
      var pathsData = void 0;
      var pathData = void 0;
      var totalShapeLength = void 0;
      var totalModifierLength = 0;

      if (e === s) {
        for (i = 0; i < len; i += 1) {
          this.shapes[i].localShapeCollection.releaseShapes();
          this.shapes[i].shape._mdf = true;
          this.shapes[i].shape.paths = this.shapes[i].localShapeCollection;
        }
      } else if (!(e === 1 && s === 0 || e === 0 && s === 1)) {
        var segments = [];
        var shapeData = void 0;
        var localShapeCollection = void 0;
        for (i = 0; i < len; i += 1) {
          shapeData = this.shapes[i];
          // if shape hasn't changed and trim properties haven't changed, cached previous path can be used
          if (!shapeData.shape._mdf && !this._mdf && !_isFirstFrame && this.m !== 2) {
            shapeData.shape.paths = shapeData.localShapeCollection;
          } else {
            shapePaths = shapeData.shape.paths;
            jLen = shapePaths._length;
            totalShapeLength = 0;
            if (!shapeData.shape._mdf && shapeData.pathsData.length) {
              totalShapeLength = shapeData.totalShapeLength;
            } else {
              pathsData = this.releasePathsData(shapeData.pathsData);
              for (j = 0; j < jLen; j += 1) {
                pathData = bez.getSegmentsLength(shapePaths.shapes[j]);
                pathsData.push(pathData);
                totalShapeLength += pathData.totalLength;
              }
              shapeData.totalShapeLength = totalShapeLength;
              shapeData.pathsData = pathsData;
            }

            totalModifierLength += totalShapeLength;
            shapeData.shape._mdf = true;
          }
        }
        var shapeS = s;
        var shapeE = e;
        var addedLength = 0;
        var edges = void 0;
        for (i = len - 1; i >= 0; i -= 1) {
          shapeData = this.shapes[i];
          if (shapeData.shape._mdf) {
            localShapeCollection = shapeData.localShapeCollection;
            localShapeCollection.releaseShapes();
            // if m === 2 means paths are trimmed individually so edges need to be found for this specific shape relative to whoel group
            if (this.m === 2 && len > 1) {
              edges = this.calculateShapeEdges(s, e, shapeData.totalShapeLength, addedLength, totalModifierLength);
              addedLength += shapeData.totalShapeLength;
            } else {
              edges = [[shapeS, shapeE]];
            }
            jLen = edges.length;
            for (j = 0; j < jLen; j += 1) {
              shapeS = edges[j][0];
              shapeE = edges[j][1];
              segments.length = 0;
              if (shapeE <= 1) {
                segments.push({
                  s: shapeData.totalShapeLength * shapeS,
                  e: shapeData.totalShapeLength * shapeE
                });
              } else if (shapeS >= 1) {
                segments.push({
                  s: shapeData.totalShapeLength * (shapeS - 1),
                  e: shapeData.totalShapeLength * (shapeE - 1)
                });
              } else {
                segments.push({
                  s: shapeData.totalShapeLength * shapeS,
                  e: shapeData.totalShapeLength
                });
                segments.push({
                  s: 0,
                  e: shapeData.totalShapeLength * (shapeE - 1)
                });
              }
              var newShapesData = this.addShapes(shapeData, segments[0]);
              if (segments[0].s !== segments[0].e) {
                if (segments.length > 1) {
                  if (shapeData.shape.v.c) {
                    var lastShape = newShapesData.pop();
                    this.addPaths(newShapesData, localShapeCollection);
                    newShapesData = this.addShapes(shapeData, segments[1], lastShape);
                  } else {
                    this.addPaths(newShapesData, localShapeCollection);
                    newShapesData = this.addShapes(shapeData, segments[1]);
                  }
                }
                this.addPaths(newShapesData, localShapeCollection);
              }
            }
            shapeData.shape.paths = localShapeCollection;
          }
        }
      } else if (this._mdf) {
        for (i = 0; i < len; i += 1) {
          this.shapes[i].shape._mdf = true;
        }
      }
    }
  }, {
    key: 'addPaths',
    value: function addPaths(newPaths, localShapeCollection) {
      var i = void 0;
      var len = newPaths.length;
      for (i = 0; i < len; i += 1) {
        localShapeCollection.addShape(newPaths[i]);
      }
    }
  }, {
    key: 'addSegment',
    value: function addSegment(pt1, pt2, pt3, pt4, shapePath, pos, newShape) {
      shapePath.setXYAt(pt2[0], pt2[1], 'o', pos);
      shapePath.setXYAt(pt3[0], pt3[1], 'i', pos + 1);
      if (newShape) {
        shapePath.setXYAt(pt1[0], pt1[1], 'v', pos);
      }
      shapePath.setXYAt(pt4[0], pt4[1], 'v', pos + 1);
    }
  }, {
    key: 'addSegmentFromArray',
    value: function addSegmentFromArray(points, shapePath, pos, newShape) {
      shapePath.setXYAt(points[1], points[5], 'o', pos);
      shapePath.setXYAt(points[2], points[6], 'i', pos + 1);
      if (newShape) {
        shapePath.setXYAt(points[0], points[4], 'v', pos);
      }
      shapePath.setXYAt(points[3], points[7], 'v', pos + 1);
    }
  }, {
    key: 'addShapes',
    value: function addShapes(shapeData, shapeSegment, shapePath) {
      var pathsData = shapeData.pathsData;
      var shapePaths = shapeData.shape.paths.shapes;
      var i = void 0;
      var len = shapeData.shape.paths._length;
      var j = void 0;
      var jLen = void 0;
      var addedLength = 0;
      var currentLengthData = void 0;
      var segmentCount = void 0;
      var lengths = void 0;
      var segment = void 0;
      var shapes = [];
      var initPos = void 0;
      var newShape = true;
      if (!shapePath) {
        shapePath = factory.newElement();
        segmentCount = 0;
        initPos = 0;
      } else {
        segmentCount = shapePath._length;
        initPos = shapePath._length;
      }
      shapes.push(shapePath);
      for (i = 0; i < len; i += 1) {
        lengths = pathsData[i].lengths;
        shapePath.c = shapePaths[i].c;
        jLen = shapePaths[i].c ? lengths.length : lengths.length + 1;
        for (j = 1; j < jLen; j += 1) {
          currentLengthData = lengths[j - 1];
          if (addedLength + currentLengthData.addedLength < shapeSegment.s) {
            addedLength += currentLengthData.addedLength;
            shapePath.c = false;
          } else if (addedLength > shapeSegment.e) {
            shapePath.c = false;
            break;
          } else {
            if (shapeSegment.s <= addedLength && shapeSegment.e >= addedLength + currentLengthData.addedLength) {
              this.addSegment(shapePaths[i].v[j - 1], shapePaths[i].o[j - 1], shapePaths[i].i[j], shapePaths[i].v[j], shapePath, segmentCount, newShape);
              newShape = false;
            } else {
              segment = bez.getNewSegment(shapePaths[i].v[j - 1], shapePaths[i].v[j], shapePaths[i].o[j - 1], shapePaths[i].i[j], (shapeSegment.s - addedLength) / currentLengthData.addedLength, (shapeSegment.e - addedLength) / currentLengthData.addedLength, lengths[j - 1]);
              this.addSegmentFromArray(segment, shapePath, segmentCount, newShape);
              // this.addSegment(segment.pt1, segment.pt3, segment.pt4, segment.pt2, shapePath, segmentCount, newShape);
              newShape = false;
              shapePath.c = false;
            }
            addedLength += currentLengthData.addedLength;
            segmentCount += 1;
          }
        }
        if (shapePaths[i].c) {
          currentLengthData = lengths[j - 1];
          if (addedLength <= shapeSegment.e) {
            var segmentLength = lengths[j - 1].addedLength;
            if (shapeSegment.s <= addedLength && shapeSegment.e >= addedLength + segmentLength) {
              this.addSegment(shapePaths[i].v[j - 1], shapePaths[i].o[j - 1], shapePaths[i].i[0], shapePaths[i].v[0], shapePath, segmentCount, newShape);
              newShape = false;
            } else {
              segment = bez.getNewSegment(shapePaths[i].v[j - 1], shapePaths[i].v[0], shapePaths[i].o[j - 1], shapePaths[i].i[0], (shapeSegment.s - addedLength) / segmentLength, (shapeSegment.e - addedLength) / segmentLength, lengths[j - 1]);
              this.addSegmentFromArray(segment, shapePath, segmentCount, newShape);
              // this.addSegment(segment.pt1, segment.pt3, segment.pt4, segment.pt2, shapePath, segmentCount, newShape);
              newShape = false;
              shapePath.c = false;
            }
          } else {
            shapePath.c = false;
          }
          addedLength += currentLengthData.addedLength;
          segmentCount += 1;
        }
        if (shapePath._length) {
          shapePath.setXYAt(shapePath.v[initPos][0], shapePath.v[initPos][1], 'i', initPos);
          shapePath.setXYAt(shapePath.v[shapePath._length - 1][0], shapePath.v[shapePath._length - 1][1], 'o', shapePath._length - 1);
        }
        if (addedLength > shapeSegment.e) {
          break;
        }
        if (i < len - 1) {
          shapePath = factory.newElement();
          newShape = true;
          shapes.push(shapePath);
          segmentCount = 0;
        }
      }
      return shapes;
    }
  }]);
  return TrimModifier;
}(ShapeModifier);

ShapeModifiers.registerModifier('rd', RoundCornersModifier);
ShapeModifiers.registerModifier('ms', MouseModifier);
ShapeModifiers.registerModifier('rp', RepeaterModifier);
ShapeModifiers.registerModifier('tm', TrimModifier);

var CVShapeElement = function (_Mixin) {
  inherits(CVShapeElement, _Mixin);

  function CVShapeElement(data, globalData, comp) {
    classCallCheck(this, CVShapeElement);

    var _this = possibleConstructorReturn(this, (CVShapeElement.__proto__ || Object.getPrototypeOf(CVShapeElement)).call(this));

    _this.transformHelper = {
      opacity: 1,
      mat: new Matrix(),
      _matMdf: false,
      _opMdf: false
    };
    _this.dashResetter = [];

    _this.shapes = [];
    _this.shapesData = data.shapes;
    _this.stylesList = [];
    _this.itemsData = [];
    _this.prevViewData = [];
    _this.shapeModifiers = [];
    _this.processedElements = [];
    _this.initElement(data, globalData, comp);
    return _this;
  }

  createClass(CVShapeElement, [{
    key: 'initElement',
    value: function initElement(data, globalData, comp) {
      this.initFrame();
      this.initBaseData(data, globalData, comp);
      this.initTransform(data, globalData, comp);
      this.initHierarchy();
      this.initRenderable();
      this.initRendererElement();
      this.createContainerElements();
      this.addMasks();
      this.createContent();
      this.hide();
    }
  }, {
    key: 'createContent',
    value: function createContent() {
      this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, true);
    }
  }, {
    key: 'createStyleElement',
    value: function createStyleElement(data) {
      var styleElem = {
        data: data,
        type: data.ty,
        elements: []
      };
      var elementData = {};
      if (data.ty === 'fl' || data.ty === 'st') {
        elementData.c = PropertyFactory$1.getProp(this, data.c, 1, 255, this);
        if (!elementData.c.k) {
          styleElem.co = 'rgb(' + bm_floor(elementData.c.v[0]) + ',' + bm_floor(elementData.c.v[1]) + ',' + bm_floor(elementData.c.v[2]) + ')';
        }
      }
      elementData.o = PropertyFactory$1.getProp(this, data.o, 0, 0.01, this);
      if (data.ty === 'st') {
        styleElem.lc = this.lcEnum[data.lc] || 'round';
        styleElem.lj = this.ljEnum[data.lj] || 'round';
        if (data.lj === 1) {
          styleElem.ml = data.ml;
        }
        elementData.w = PropertyFactory$1.getProp(this, data.w, 0, null, this);
        if (!elementData.w.k) {
          styleElem.wi = elementData.w.v;
        }
        if (data.d) {
          var d = new DashProperty(this, data.d, 'canvas');
          elementData.d = d;
          if (!elementData.d.k) {
            styleElem.da = elementData.d.dashArray;
            styleElem.do = elementData.d.dashoffset[0];
          }
        }
      } else {
        styleElem.r = data.r === 2 ? 'evenodd' : 'nonzero';
      }
      this.stylesList.push(styleElem);
      elementData.style = styleElem;
      return elementData;
    }
  }, {
    key: 'createGroupElement',
    value: function createGroupElement() {
      var elementData = {
        it: [],
        prevViewData: []
      };
      return elementData;
    }
  }, {
    key: 'createTransformElement',
    value: function createTransformElement(data) {
      var elementData = {
        transform: {
          mat: new Matrix(),
          opacity: 1,
          _matMdf: false,
          _opMdf: false,
          op: PropertyFactory$1.getProp(this, data.o, 0, 0.01, this),
          mProps: TransformPropertyFactory.getTransformProperty(this, data, this)
        },
        elements: []
      };
      return elementData;
    }
  }, {
    key: 'createShapeElement',
    value: function createShapeElement(data) {
      var elementData = new CVShapeData(this, data);

      this.shapes.push(elementData);
      this.addShapeToModifiers(elementData);
      var j = void 0;
      var jLen = this.stylesList.length;
      var hasStrokes = false;
      var hasFills = false;
      for (j = 0; j < jLen; j += 1) {
        if (!this.stylesList[j].closed) {
          this.stylesList[j].elements.push(elementData);
          if (this.stylesList[j].type === 'st') {
            hasStrokes = true;
          } else {
            hasFills = true;
          }
        }
      }
      elementData.st = hasStrokes;
      elementData.fl = hasFills;
      return elementData;
    }
  }, {
    key: 'reloadShapes',
    value: function reloadShapes() {
      this._isFirstFrame = true;
      var i = void 0;
      var len = this.itemsData.length;
      for (i = 0; i < len; i += 1) {
        this.prevViewData[i] = this.itemsData[i];
      }
      this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, true);
      len = this.dynamicProperties.length;
      for (i = 0; i < len; i += 1) {
        this.dynamicProperties[i].getValue();
      }
      this.renderModifiers();
    }
  }, {
    key: 'searchShapes',
    value: function searchShapes(arr, itemsData, prevViewData, render) {
      var i = void 0;
      var len = arr.length - 1;
      var j = void 0;
      var jLen = void 0;
      var ownArrays = [];
      var ownModifiers = [];
      var processedPos = void 0;
      var modifier = void 0;
      for (i = len; i >= 0; i -= 1) {
        processedPos = this.searchProcessedElement(arr[i]);
        if (!processedPos) {
          arr[i]._render = render;
        } else {
          itemsData[i] = prevViewData[processedPos - 1];
        }
        if (arr[i].ty === 'fl' || arr[i].ty === 'st') {
          if (!processedPos) {
            itemsData[i] = this.createStyleElement(arr[i]);
          } else {
            itemsData[i].style.closed = false;
          }

          ownArrays.push(itemsData[i].style);
        } else if (arr[i].ty === 'gr') {
          if (!processedPos) {
            itemsData[i] = this.createGroupElement(arr[i]);
          } else {
            jLen = itemsData[i].it.length;
            for (j = 0; j < jLen; j += 1) {
              itemsData[i].prevViewData[j] = itemsData[i].it[j];
            }
          }
          this.searchShapes(arr[i].it, itemsData[i].it, itemsData[i].prevViewData, render);
        } else if (arr[i].ty === 'tr') {
          if (!processedPos) {
            itemsData[i] = this.createTransformElement(arr[i]);
          }
        } else if (arr[i].ty === 'sh' || arr[i].ty === 'rc' || arr[i].ty === 'el' || arr[i].ty === 'sr') {
          if (!processedPos) {
            itemsData[i] = this.createShapeElement(arr[i]);
          }
        } else if (arr[i].ty === 'tm' || arr[i].ty === 'rd') {
          if (!processedPos) {
            modifier = ShapeModifiers.getModifier(arr[i].ty);
            modifier.init(this, arr[i]);
            itemsData[i] = modifier;
            this.shapeModifiers.push(modifier);
          } else {
            modifier = itemsData[i];
            modifier.closed = false;
          }
          ownModifiers.push(modifier);
        } else if (arr[i].ty === 'rp') {
          if (!processedPos) {
            modifier = ShapeModifiers.getModifier(arr[i].ty);
            itemsData[i] = modifier;
            modifier.init(this, arr, i, itemsData);
            this.shapeModifiers.push(modifier);
            render = false;
          } else {
            modifier = itemsData[i];
            modifier.closed = true;
          }
          ownModifiers.push(modifier);
        }
        this.addProcessedElement(arr[i], i + 1);
      }
      len = ownArrays.length;
      for (i = 0; i < len; i += 1) {
        ownArrays[i].closed = true;
      }
      len = ownModifiers.length;
      for (i = 0; i < len; i += 1) {
        ownModifiers[i].closed = true;
      }
    }
  }, {
    key: 'renderInnerContent',
    value: function renderInnerContent() {
      this.transformHelper.mat.reset();
      this.transformHelper.opacity = 1;
      this.transformHelper._matMdf = false;
      this.transformHelper._opMdf = false;
      this.renderModifiers();
      this.renderShape(this.transformHelper, this.shapesData, this.itemsData, true);
    }
  }, {
    key: 'renderShapeTransform',
    value: function renderShapeTransform(parentTransform, groupTransform) {
      var props = void 0;
      var groupMatrix = void 0;
      if (parentTransform._opMdf || groupTransform.op._mdf || this._isFirstFrame) {
        groupTransform.opacity = parentTransform.opacity;
        groupTransform.opacity *= groupTransform.op.v;
        groupTransform._opMdf = true;
      }
      if (parentTransform._matMdf || groupTransform.mProps._mdf || this._isFirstFrame) {
        groupMatrix = groupTransform.mat;
        groupMatrix.cloneFromProps(groupTransform.mProps.v.props);
        groupTransform._matMdf = true;
        props = parentTransform.mat.props;
        groupMatrix.transform(props[0], props[1], props[2], props[3], props[4], props[5], props[6], props[7], props[8], props[9], props[10], props[11], props[12], props[13], props[14], props[15]);
      }
    }
  }, {
    key: 'drawLayer',
    value: function drawLayer() {
      var i = void 0;
      var len = this.stylesList.length;
      var j = void 0;
      var jLen = void 0;
      var k = void 0;
      var kLen = void 0;
      var elems = void 0;
      var nodes = void 0;
      var renderer = this.globalData.renderer;
      var ctx = this.globalData.canvasContext;
      var type = void 0;
      var currentStyle = void 0;

      // const isFirstFrame = this._isFirstFrame;

      for (i = 0; i < len; i += 1) {
        currentStyle = this.stylesList[i];
        type = currentStyle.type;
        if (type === 'st' && currentStyle.wi === 0 || !currentStyle.data._render || currentStyle.coOp === 0) {
          continue;
        }
        renderer.save();
        elems = currentStyle.elements;
        if (type === 'st') {
          ctx.setStrokeStyle(currentStyle.co);
          ctx.setLineWidth(currentStyle.wi);
          ctx.setLineCap(currentStyle.lc);
          ctx.setLineJoin(currentStyle.lj);
          ctx.setMiterLimit(currentStyle.ml || 0);
        } else {
          ctx.setFillStyle(currentStyle.co);
        }
        renderer.ctxOpacity(currentStyle.coOp);
        if (this.globalData.currentGlobalAlpha !== 0) {
          if (type !== 'st') {
            ctx.beginPath();
          }
          jLen = elems.length;
          for (j = 0; j < jLen; j += 1) {
            if (type === 'st') {
              ctx.beginPath();
              if (currentStyle.da) {
                ctx.setLineDash(currentStyle.da);
                ctx.lineDashOffset = currentStyle.do;
                this.globalData.isDashed = true;
              } else if (this.globalData.isDashed) {
                ctx.setLineDash(this.dashResetter);
                this.globalData.isDashed = false;
              }
            }
            nodes = elems[j].trNodes;
            kLen = nodes.length;

            for (k = 0; k < kLen; k += 1) {
              if (nodes[k].t === 'm') {
                ctx.moveTo(nodes[k].p[0], nodes[k].p[1]);
              } else if (nodes[k].t === 'c') {
                ctx.bezierCurveTo(nodes[k].pts[0], nodes[k].pts[1], nodes[k].pts[2], nodes[k].pts[3], nodes[k].pts[4], nodes[k].pts[5]);
              } else {
                ctx.closePath();
              }
            }
            if (type === 'st') {
              ctx.stroke();
              // ctx.draw(true);
            }
          }
          if (type !== 'st') {
            ctx.fill(currentStyle.r);
            // ctx.draw(true);
          }
        }

        renderer.restore();
      }
    }
  }, {
    key: 'renderShape',
    value: function renderShape(parentTransform, items, data, isMain) {
      var i = void 0;
      var len = items.length - 1;
      var groupTransform = void 0;
      groupTransform = parentTransform;
      for (i = len; i >= 0; i -= 1) {
        if (items[i].ty === 'tr') {
          groupTransform = data[i].transform;
          this.renderShapeTransform(parentTransform, groupTransform);
        } else if (items[i].ty === 'sh' || items[i].ty === 'el' || items[i].ty === 'rc' || items[i].ty === 'sr') {
          this.renderPath(items[i], data[i], groupTransform);
        } else if (items[i].ty === 'fl') {
          this.renderFill(items[i], data[i], groupTransform);
        } else if (items[i].ty === 'st') {
          this.renderStroke(items[i], data[i], groupTransform);
        } else if (items[i].ty === 'gr') {
          this.renderShape(groupTransform, items[i].it, data[i].it);
        } else if (items[i].ty === 'tm') ;
      }
      if (isMain) {
        this.drawLayer();
      }
    }
  }, {
    key: 'renderPath',
    value: function renderPath(pathData, itemData, groupTransform) {
      var len = void 0;
      var i = void 0;
      var j = void 0;
      var jLen = void 0;
      var redraw = groupTransform._matMdf || itemData.sh._mdf || this._isFirstFrame;
      if (redraw) {
        var paths = itemData.sh.paths;
        var groupTransformMat = groupTransform.mat;
        jLen = pathData._render === false ? 0 : paths._length;
        var pathStringTransformed = itemData.trNodes;
        pathStringTransformed.length = 0;
        for (j = 0; j < jLen; j += 1) {
          var pathNodes = paths.shapes[j];
          if (pathNodes && pathNodes.v) {
            len = pathNodes._length;
            for (i = 1; i < len; i += 1) {
              if (i === 1) {
                pathStringTransformed.push({
                  t: 'm',
                  p: groupTransformMat.applyToPointArray(pathNodes.v[0][0], pathNodes.v[0][1], 0)
                });
              }
              pathStringTransformed.push({
                t: 'c',
                pts: groupTransformMat.applyToTriplePoints(pathNodes.o[i - 1], pathNodes.i[i], pathNodes.v[i])
              });
            }
            if (len === 1) {
              pathStringTransformed.push({
                t: 'm',
                p: groupTransformMat.applyToPointArray(pathNodes.v[0][0], pathNodes.v[0][1], 0)
              });
            }
            if (pathNodes.c && len) {
              pathStringTransformed.push({
                t: 'c',
                pts: groupTransformMat.applyToTriplePoints(pathNodes.o[i - 1], pathNodes.i[0], pathNodes.v[0])
              });
              pathStringTransformed.push({
                t: 'z'
              });
            }
            itemData.lStr = pathStringTransformed;
          }
        }

        if (itemData.st) {
          for (i = 0; i < 16; i += 1) {
            itemData.tr[i] = groupTransform.mat.props[i];
          }
        }
        itemData.trNodes = pathStringTransformed;
      }
    }
  }, {
    key: 'renderFill',
    value: function renderFill(styleData, itemData, groupTransform) {
      var styleElem = itemData.style;

      if (itemData.c._mdf || this._isFirstFrame) {
        styleElem.co = 'rgb(' + bm_floor(itemData.c.v[0]) + ',' + bm_floor(itemData.c.v[1]) + ',' + bm_floor(itemData.c.v[2]) + ')';
      }
      if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
        styleElem.coOp = itemData.o.v * groupTransform.opacity;
      }
    }
  }, {
    key: 'renderStroke',
    value: function renderStroke(styleData, itemData, groupTransform) {
      var styleElem = itemData.style;
      var d = itemData.d;
      if (d && (d._mdf || this._isFirstFrame)) {
        styleElem.da = d.dashArray;
        styleElem.do = d.dashoffset[0];
      }
      if (itemData.c._mdf || this._isFirstFrame) {
        styleElem.co = 'rgb(' + bm_floor(itemData.c.v[0]) + ',' + bm_floor(itemData.c.v[1]) + ',' + bm_floor(itemData.c.v[2]) + ')';
      }
      if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
        styleElem.coOp = itemData.o.v * groupTransform.opacity;
      }
      if (itemData.w._mdf || this._isFirstFrame) {
        styleElem.wi = itemData.w.v;
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.shapesData = null;
      this.globalData = null;
      this.canvasContext = null;
      this.stylesList.length = 0;
      this.itemsData.length = 0;
    }
  }]);
  return CVShapeElement;
}(Mixin(BaseElement, TransformElement, CVBaseElement, IShapeElement, HierarchyElement, FrameElement, RenderableElement));

var LetterProps = function () {
  function LetterProps(o, sw, sc, fc, m, p) {
    classCallCheck(this, LetterProps);

    this.o = o;
    this.sw = sw;
    this.sc = sc;
    this.fc = fc;
    this.m = m;
    this.p = p;
    this._mdf = {
      o: true,
      sw: !!sw,
      sc: !!sc,
      fc: !!fc,
      m: true,
      p: true
    };
  }

  createClass(LetterProps, [{
    key: "update",
    value: function update(o, sw, sc, fc, m, p) {
      this._mdf.o = false;
      this._mdf.sw = false;
      this._mdf.sc = false;
      this._mdf.fc = false;
      this._mdf.m = false;
      this._mdf.p = false;
      var updated = false;

      if (this.o !== o) {
        this.o = o;
        this._mdf.o = true;
        updated = true;
      }
      if (this.sw !== sw) {
        this.sw = sw;
        this._mdf.sw = true;
        updated = true;
      }
      if (this.sc !== sc) {
        this.sc = sc;
        this._mdf.sc = true;
        updated = true;
      }
      if (this.fc !== fc) {
        this.fc = fc;
        this._mdf.fc = true;
        updated = true;
      }
      if (this.m !== m) {
        this.m = m;
        this._mdf.m = true;
        updated = true;
      }
      if (p.length && (this.p[0] !== p[0] || this.p[1] !== p[1] || this.p[4] !== p[4] || this.p[5] !== p[5] || this.p[12] !== p[12] || this.p[13] !== p[13])) {
        this.p = p;
        this._mdf.p = true;
        updated = true;
      }
      return updated;
    }
  }]);
  return LetterProps;
}();

var TextProperty = function () {
  function TextProperty(elem, data) {
    classCallCheck(this, TextProperty);

    _initialiseProps$1.call(this);

    this._frameId = -999999;
    this.pv = '';
    this.v = '';
    this.kf = false;
    this._isFirstFrame = true;
    this._mdf = false;
    this.data = data;
    this.elem = elem;
    this.comp = this.elem.comp;
    this.keysIndex = -1;
    this.canResize = false;
    this.minimumFontSize = 1;
    this.effectsSequence = [];
    this.currentData = {
      ascent: 0,
      boxWidth: this.defaultBoxWidth,
      f: '',
      fStyle: '',
      fWeight: '',
      fc: '',
      j: '',
      justifyOffset: '',
      l: [],
      lh: 0,
      lineWidths: [],
      ls: '',
      of: '',
      s: '',
      sc: '',
      sw: 0,
      t: 0,
      tr: 0,
      sz: 0,
      ps: null,
      fillColorAnim: false,
      strokeColorAnim: false,
      strokeWidthAnim: false,
      yOffset: 0,
      finalSize: 0,
      finalText: [],
      finalLineHeight: 0,
      __test: true

    };
    this.copyFromDocumentData(this.data.d.k[0].s);

    if (!this.searchProperty()) {
      this.completeTextData(this.currentData);
      this.keysIndex = 0;
    }
  }

  createClass(TextProperty, [{
    key: 'copyFromDocumentData',
    value: function copyFromDocumentData(data) {
      var _this = this;

      Object.keys(data).forEach(function (s) {
        _this.currentData[s] = data[s];
      });
    }
  }, {
    key: 'searchProperty',
    value: function searchProperty() {
      return this.searchKeyframes();
    }
  }, {
    key: 'searchKeyframes',
    value: function searchKeyframes() {
      this.kf = this.data.d.k.length > 1;
      if (this.kf) {
        this.addEffect(this.getKeyframeValue.bind(this));
      }
      return this.kf;
    }
  }, {
    key: 'addEffect',
    value: function addEffect(effectFunction) {
      this.effectsSequence.push(effectFunction);
      this.elem.addDynamicProperty(this);
    }
  }, {
    key: 'getValue',
    value: function getValue(_finalValue) {
      if ((this.elem.globalData.frameId === this.frameId || !this.effectsSequence.length) && !_finalValue) {
        return;
      }
      var currentTextValue = this.currentData.t;

      if (this.lock) {
        this.setCurrentData(this.currentData, currentTextValue);
        return;
      }
      this.lock = true;
      this._mdf = false;
      // let multipliedValue;
      var i = void 0;
      var len = this.effectsSequence.length;
      var finalValue = _finalValue || this.currentData;
      for (i = 0; i < len; i += 1) {
        finalValue = this.effectsSequence[i](finalValue);
      }
      this.setCurrentData(finalValue, currentTextValue);
      this.pv = this.v = this.currentData;
      this.lock = false;
      this.frameId = this.elem.globalData.frameId;
    }
  }, {
    key: 'getKeyframeValue',
    value: function getKeyframeValue(currentValue) {
      var textKeys = this.data.d.k;
      var textDocumentData = void 0;
      var frameNum = this.elem.comp.renderedFrame;
      var i = 0;
      var len = textKeys.length;
      while (i <= len - 1) {
        textDocumentData = textKeys[i].s;
        if (i === len - 1 || textKeys[i + 1].t > frameNum) {
          break;
        }
        i += 1;
      }
      if (this.keysIndex !== i) {
        currentValue = textDocumentData;
        this.keysIndex = i;
      }
      return currentValue;
    }
  }, {
    key: 'buildFinalText',
    value: function buildFinalText(text) {
      var combinedCharacters = Font.getCombinedCharacterCodes();
      var charactersArray = [];
      var i = 0;
      var len = text.length;
      while (i < len) {
        if (combinedCharacters.indexOf(text.charCodeAt(i)) !== -1) {
          charactersArray[charactersArray.length - 1] += text.charAt(i);
        } else {
          charactersArray.push(text.charAt(i));
        }
        i += 1;
      }
      return charactersArray;
    }
  }, {
    key: 'completeTextData',
    value: function completeTextData(documentData) {
      documentData.__complete = true;
      var fontManager = this.elem.globalData.fontManager;
      var data = this.data;
      var letters = [];
      var i = void 0;
      var len = void 0;
      var newLineFlag = void 0;
      var index = 0;
      var val = void 0;
      var anchorGrouping = data.m.g;
      var currentSize = 0;
      var currentPos = 0;
      var currentLine = 0;
      var lineWidths = [];
      var lineWidth = 0;
      var maxLineWidth = 0;
      var j = void 0;
      var jLen = void 0;
      var fontData = fontManager.getFontByName(documentData.f);
      var charData = void 0;
      var cLength = 0;
      var styles = fontData.fStyle ? fontData.fStyle.split(' ') : [];

      var fWeight = 'normal';
      var fStyle = 'normal';
      len = styles.length;
      var styleName = void 0;
      for (i = 0; i < len; i += 1) {
        styleName = styles[i].toLowerCase();
        switch (styleName) {
          case 'italic':
            fStyle = 'italic';
            break;
          case 'bold':
            fWeight = '700';
            break;
          case 'black':
            fWeight = '900';
            break;
          case 'medium':
            fWeight = '500';
            break;
          case 'regular':
          case 'normal':
            fWeight = '400';
            break;
          case 'light':
          case 'thin':
            fWeight = '200';
            break;
          default:
            break;
        }
      }
      documentData.fWeight = fontData.fWeight || fWeight;
      documentData.fStyle = fStyle;
      len = documentData.t.length;
      documentData.finalSize = documentData.s;
      documentData.finalText = this.buildFinalText(documentData.t);
      documentData.finalLineHeight = documentData.lh;
      var trackingOffset = documentData.tr / 1000 * documentData.finalSize;
      if (documentData.sz) {
        var flag = true;
        var boxWidth = documentData.sz[0];
        var boxHeight = documentData.sz[1];
        var currentHeight = void 0;
        var finalText = void 0;
        while (flag) {
          finalText = this.buildFinalText(documentData.t);
          currentHeight = 0;
          lineWidth = 0;
          len = finalText.length;
          trackingOffset = documentData.tr / 1000 * documentData.finalSize;
          var lastSpaceIndex = -1;
          for (i = 0; i < len; i += 1) {
            newLineFlag = false;
            if (finalText[i] === ' ') {
              lastSpaceIndex = i;
            } else if (finalText[i].charCodeAt(0) === 13) {
              lineWidth = 0;
              newLineFlag = true;
              currentHeight += documentData.finalLineHeight || documentData.finalSize * 1.2;
            }
            if (fontManager.chars) {
              charData = fontManager.getCharData(finalText[i], fontData.fStyle, fontData.fFamily);
              cLength = newLineFlag ? 0 : charData.w * documentData.finalSize / 100;
            } else {
              // tCanvasHelper.font = documentData.s + 'px '+ fontData.fFamily;
              cLength = fontManager.measureText(finalText[i], documentData.f, documentData.finalSize);
            }
            if (lineWidth + cLength > boxWidth && finalText[i] !== ' ') {
              if (lastSpaceIndex === -1) {
                len += 1;
              } else {
                i = lastSpaceIndex;
              }
              currentHeight += documentData.finalLineHeight || documentData.finalSize * 1.2;
              finalText.splice(i, lastSpaceIndex === i ? 1 : 0, '\r');
              // finalText = finalText.substr(0,i) + "\r" + finalText.substr(i === lastSpaceIndex ? i + 1 : i);
              lastSpaceIndex = -1;
              lineWidth = 0;
            } else {
              lineWidth += cLength;
              lineWidth += trackingOffset;
            }
          }
          currentHeight += fontData.ascent * documentData.finalSize / 100;
          if (this.canResize && documentData.finalSize > this.minimumFontSize && boxHeight < currentHeight) {
            documentData.finalSize -= 1;
            documentData.finalLineHeight = documentData.finalSize * documentData.lh / documentData.s;
          } else {
            documentData.finalText = finalText;
            len = documentData.finalText.length;
            flag = false;
          }
        }
      }
      lineWidth = -trackingOffset;
      cLength = 0;
      var uncollapsedSpaces = 0;
      var currentChar = void 0;
      for (i = 0; i < len; i += 1) {
        newLineFlag = false;
        currentChar = documentData.finalText[i];
        if (currentChar === ' ') {
          val = '\xA0';
        } else if (currentChar.charCodeAt(0) === 13) {
          uncollapsedSpaces = 0;
          lineWidths.push(lineWidth);
          maxLineWidth = lineWidth > maxLineWidth ? lineWidth : maxLineWidth;
          lineWidth = -2 * trackingOffset;
          val = '';
          newLineFlag = true;
          currentLine += 1;
        } else {
          val = documentData.finalText[i];
        }
        if (fontManager.chars) {
          charData = fontManager.getCharData(currentChar, fontData.fStyle, fontManager.getFontByName(documentData.f).fFamily);
          cLength = newLineFlag ? 0 : charData.w * documentData.finalSize / 100;
        } else {
          // let charWidth = fontManager.measureText(val, documentData.f, documentData.finalSize);
          // tCanvasHelper.font = documentData.finalSize + 'px '+ fontManager.getFontByName(documentData.f).fFamily;
          cLength = fontManager.measureText(val, documentData.f, documentData.finalSize);
        }

        //
        if (currentChar === ' ') {
          uncollapsedSpaces += cLength + trackingOffset;
        } else {
          lineWidth += cLength + trackingOffset + uncollapsedSpaces;
          uncollapsedSpaces = 0;
        }
        letters.push({
          l: cLength, an: cLength, add: currentSize, n: newLineFlag, anIndexes: [], val: val, line: currentLine, animatorJustifyOffset: 0
        });
        if (anchorGrouping === 2) {
          currentSize += cLength;
          if (val === '' || val === '\xA0' || i === len - 1) {
            if (val === '' || val === '\xA0') {
              currentSize -= cLength;
            }
            while (currentPos <= i) {
              letters[currentPos].an = currentSize;
              letters[currentPos].ind = index;
              letters[currentPos].extra = cLength;
              currentPos += 1;
            }
            index += 1;
            currentSize = 0;
          }
        } else if (anchorGrouping === 3) {
          currentSize += cLength;
          if (val === '' || i === len - 1) {
            if (val === '') {
              currentSize -= cLength;
            }
            while (currentPos <= i) {
              letters[currentPos].an = currentSize;
              letters[currentPos].ind = index;
              letters[currentPos].extra = cLength;
              currentPos += 1;
            }
            currentSize = 0;
            index += 1;
          }
        } else {
          letters[index].ind = index;
          letters[index].extra = 0;
          index += 1;
        }
      }
      documentData.l = letters;
      maxLineWidth = lineWidth > maxLineWidth ? lineWidth : maxLineWidth;
      lineWidths.push(lineWidth);
      if (documentData.sz) {
        documentData.boxWidth = documentData.sz[0];
        documentData.justifyOffset = 0;
      } else {
        documentData.boxWidth = maxLineWidth;
        switch (documentData.j) {
          case 1:
            documentData.justifyOffset = -documentData.boxWidth;
            break;
          case 2:
            documentData.justifyOffset = -documentData.boxWidth / 2;
            break;
          default:
            documentData.justifyOffset = 0;
        }
      }
      documentData.lineWidths = lineWidths;

      var animators = data.a;
      var animatorData = void 0;
      var letterData = void 0;
      jLen = animators.length;
      var based = void 0;
      var ind = void 0;
      var indexes = [];
      for (j = 0; j < jLen; j += 1) {
        animatorData = animators[j];
        if (animatorData.a.sc) {
          documentData.strokeColorAnim = true;
        }
        if (animatorData.a.sw) {
          documentData.strokeWidthAnim = true;
        }
        if (animatorData.a.fc || animatorData.a.fh || animatorData.a.fs || animatorData.a.fb) {
          documentData.fillColorAnim = true;
        }
        ind = 0;
        based = animatorData.s.b;
        for (i = 0; i < len; i += 1) {
          letterData = letters[i];
          letterData.anIndexes[j] = ind;
          if (based === 1 && letterData.val !== '' || based === 2 && letterData.val !== '' && letterData.val !== '\xA0' || based === 3 && (letterData.n || letterData.val === '\xA0' || i === len - 1) || based === 4 && (letterData.n || i === len - 1)) {
            if (animatorData.s.rn === 1) {
              indexes.push(ind);
            }
            ind += 1;
          }
        }
        data.a[j].s.totalChars = ind;
        var currentInd = -1;
        var newInd = void 0;
        if (animatorData.s.rn === 1) {
          for (i = 0; i < len; i += 1) {
            letterData = letters[i];
            if (currentInd !== letterData.anIndexes[j]) {
              currentInd = letterData.anIndexes[j];
              newInd = indexes.splice(Math.floor(Math.random() * indexes.length), 1)[0];
            }
            letterData.anIndexes[j] = newInd;
          }
        }
      }
      documentData.yOffset = documentData.finalLineHeight || documentData.finalSize * 1.2;
      documentData.ls = documentData.ls || 0;
      documentData.ascent = fontData.ascent * documentData.finalSize / 100;
    }
  }, {
    key: 'updateDocumentData',
    value: function updateDocumentData(newData, index) {
      index = index === undefined ? this.keysIndex === -1 ? 0 : this.keysIndex : index;
      var dData = this.data.d.k[index].s;
      Object.keys(newData).forEach(function (s) {
        dData[s] = newData[s];
      });
      this.recalculate(index);
    }
  }, {
    key: 'recalculate',
    value: function recalculate(index) {
      var dData = this.data.d.k[index].s;
      dData.__complete = false;
      this.keysIndex = this.kf ? -1 : 0;
      this._isFirstFrame = true;
      this.getValue(dData);
    }
  }, {
    key: 'canResizeFont',
    value: function canResizeFont(_canResize) {
      this.canResize = _canResize;
      this.recalculate(this.keysIndex);
    }
  }, {
    key: 'setMinimumFontSize',
    value: function setMinimumFontSize(_fontValue) {
      this.minimumFontSize = Math.floor(_fontValue) || 1;
      this.recalculate(this.keysIndex);
    }
  }]);
  return TextProperty;
}();

var _initialiseProps$1 = function _initialiseProps() {
  this.defaultBoxWidth = [0, 0];

  this.setCurrentData = function (data, currentTextValue) {
    if (this.currentData !== data) {
      if (!data.__complete) {
        this.completeTextData(data);
      }
      this.copyFromDocumentData(data);
      this.currentData.boxWidth = this.currentData.boxWidth || this.defaultBoxWidth;
      this.currentData.fillColorAnim = data.fillColorAnim || this.currentData.fillColorAnim;
      this.currentData.strokeColorAnim = data.strokeColorAnim || this.currentData.strokeColorAnim;
      this.currentData.strokeWidthAnim = data.strokeWidthAnim || this.currentData.strokeWidthAnim;
      this._mdf = true;
    } else if (currentTextValue !== this.currentData.t) {
      this._mdf = true;
      this.completeTextData(data);
    }
  };
};

var _class$2;

function _applyDecoratedDescriptor$2(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var max = Math.max;
var min = Math.min;
var floor = Math.floor;

var TextSelectorProp = function (_DynamicPropertyConta) {
  inherits(TextSelectorProp, _DynamicPropertyConta);

  function TextSelectorProp(elem, data) {
    classCallCheck(this, TextSelectorProp);

    var _this = possibleConstructorReturn(this, (TextSelectorProp.__proto__ || Object.getPrototypeOf(TextSelectorProp)).call(this));

    _this._currentTextLength = -1;
    _this.k = false;
    _this.data = data;
    _this.elem = elem;
    _this.comp = elem.comp;
    _this.finalS = 0;
    _this.finalE = 0;
    _this.initDynamicPropertyContainer(elem);
    _this.s = PropertyFactory$1.getProp(elem, data.s || {
      k: 0
    }, 0, 0, _this);
    if ('e' in data) {
      _this.e = PropertyFactory$1.getProp(elem, data.e, 0, 0, _this);
    } else {
      _this.e = {
        v: 100
      };
    }
    _this.o = PropertyFactory$1.getProp(elem, data.o || {
      k: 0
    }, 0, 0, _this);
    _this.xe = PropertyFactory$1.getProp(elem, data.xe || {
      k: 0
    }, 0, 0, _this);
    _this.ne = PropertyFactory$1.getProp(elem, data.ne || {
      k: 0
    }, 0, 0, _this);
    _this.a = PropertyFactory$1.getProp(elem, data.a, 0, 0.01, _this);
    if (!_this.dynamicProperties.length) {
      _this.getValue();
    }
    return _this;
  }

  createClass(TextSelectorProp, [{
    key: 'getMult',
    value: function getMult(ind) {
      if (this._currentTextLength !== this.elem.textProperty.currentData.l.length) {
        this.getValue();
      }
      // let easer = bez.getEasingCurve(this.ne.v/100,0,1-this.xe.v/100,1);
      var easer = ob.getBezierEasing(this.ne.v / 100, 0, 1 - this.xe.v / 100, 1).get;
      var mult = 0;
      var s = this.finalS;
      var e = this.finalE;
      var type = this.data.sh;
      if (type === 2) {
        if (e === s) {
          mult = ind >= e ? 1 : 0;
        } else {
          mult = max(0, min(0.5 / (e - s) + (ind - s) / (e - s), 1));
        }
        mult = easer(mult);
      } else if (type === 3) {
        if (e === s) {
          mult = ind >= e ? 0 : 1;
        } else {
          mult = 1 - max(0, min(0.5 / (e - s) + (ind - s) / (e - s), 1));
        }

        mult = easer(mult);
      } else if (type === 4) {
        if (e === s) {
          mult = 0;
        } else {
          mult = max(0, min(0.5 / (e - s) + (ind - s) / (e - s), 1));
          if (mult < 0.5) {
            mult *= 2;
          } else {
            mult = 1 - 2 * (mult - 0.5);
          }
        }
        mult = easer(mult);
      } else if (type === 5) {
        if (e === s) {
          mult = 0;
        } else {
          var tot = e - s;
          /* ind += 0.5;
          mult = -4/(tot*tot)*(ind*ind)+(4/tot)*ind; */
          ind = min(max(0, ind + 0.5 - s), e - s);
          var x = -tot / 2 + ind;
          var a = tot / 2;
          mult = Math.sqrt(1 - x * x / (a * a));
        }
        mult = easer(mult);
      } else if (type === 6) {
        if (e === s) {
          mult = 0;
        } else {
          ind = min(max(0, ind + 0.5 - s), e - s);
          mult = (1 + Math.cos(Math.PI + Math.PI * 2 * ind / (e - s))) / 2;
          /*
           ind = Math.min(Math.max(s,ind),e-1);
           mult = (1+(Math.cos((Math.PI+Math.PI*2*(ind-s)/(e-1-s)))))/2;
           mult = Math.max(mult,(1/(e-1-s))/(e-1-s)); */
        }
        mult = easer(mult);
      } else {
        if (ind >= floor(s)) {
          if (ind - s < 0) {
            mult = 1 - (s - ind);
          } else {
            mult = max(0, min(e - ind, 1));
          }
        }
        mult = easer(mult);
      }
      return mult * this.a.v;
    }
  }, {
    key: 'getValue',
    value: function getValue(newCharsFlag) {
      this.iterateDynamicProperties();
      this._mdf = newCharsFlag || this._mdf;
      this._currentTextLength = this.elem.textProperty.currentData.l.length || 0;
      if (newCharsFlag && this.data.r === 2) {
        this.e.v = this._currentTextLength;
      }
      var divisor = this.data.r === 2 ? 1 : 100 / this._currentTextLength;
      var o = this.o.v / divisor;
      var s = this.s.v / divisor + o;
      var e = this.e.v / divisor + o;
      if (s > e) {
        var _s = s;
        s = e;
        e = _s;
      }
      this.finalS = s;
      this.finalE = e;
    }
  }]);
  return TextSelectorProp;
}(DynamicPropertyContainer);

var TextSelectorProperty = (_class$2 = function () {
  function TextSelectorProperty() {
    classCallCheck(this, TextSelectorProperty);
  }

  createClass(TextSelectorProperty, [{
    key: 'getTextSelectorProp',
    value: function getTextSelectorProp(elem, data, arr) {
      return new TextSelectorProp(elem, data, arr);
    }
  }]);
  return TextSelectorProperty;
}(), (_applyDecoratedDescriptor$2(_class$2.prototype, 'getTextSelectorProp', [GetTextSelectorProp], Object.getOwnPropertyDescriptor(_class$2.prototype, 'getTextSelectorProp'), _class$2.prototype)), _class$2);


var TextSelectorProp$1 = new TextSelectorProperty();

var degToRads$5 = Math.PI / 180;

var TextAnimatorDataProperty = function TextAnimatorDataProperty(elem, animatorProps, container) {
  classCallCheck(this, TextAnimatorDataProperty);

  var defaultData = { propType: false };
  var getProp = PropertyFactory$1.getProp;
  var textAnimator_animatables = animatorProps.a;
  this.a = {
    r: textAnimator_animatables.r ? getProp(elem, textAnimator_animatables.r, 0, degToRads$5, container) : defaultData,
    rx: textAnimator_animatables.rx ? getProp(elem, textAnimator_animatables.rx, 0, degToRads$5, container) : defaultData,
    ry: textAnimator_animatables.ry ? getProp(elem, textAnimator_animatables.ry, 0, degToRads$5, container) : defaultData,
    sk: textAnimator_animatables.sk ? getProp(elem, textAnimator_animatables.sk, 0, degToRads$5, container) : defaultData,
    sa: textAnimator_animatables.sa ? getProp(elem, textAnimator_animatables.sa, 0, degToRads$5, container) : defaultData,
    s: textAnimator_animatables.s ? getProp(elem, textAnimator_animatables.s, 1, 0.01, container) : defaultData,
    a: textAnimator_animatables.a ? getProp(elem, textAnimator_animatables.a, 1, 0, container) : defaultData,
    o: textAnimator_animatables.o ? getProp(elem, textAnimator_animatables.o, 0, 0.01, container) : defaultData,
    p: textAnimator_animatables.p ? getProp(elem, textAnimator_animatables.p, 1, 0, container) : defaultData,
    sw: textAnimator_animatables.sw ? getProp(elem, textAnimator_animatables.sw, 0, 0, container) : defaultData,
    sc: textAnimator_animatables.sc ? getProp(elem, textAnimator_animatables.sc, 1, 0, container) : defaultData,
    fc: textAnimator_animatables.fc ? getProp(elem, textAnimator_animatables.fc, 1, 0, container) : defaultData,
    fh: textAnimator_animatables.fh ? getProp(elem, textAnimator_animatables.fh, 0, 0, container) : defaultData,
    fs: textAnimator_animatables.fs ? getProp(elem, textAnimator_animatables.fs, 0, 0.01, container) : defaultData,
    fb: textAnimator_animatables.fb ? getProp(elem, textAnimator_animatables.fb, 0, 0.01, container) : defaultData,
    t: textAnimator_animatables.t ? getProp(elem, textAnimator_animatables.t, 0, 0, container) : defaultData
  };

  this.s = TextSelectorProp$1.getTextSelectorProp(elem, animatorProps.s, container);
  this.s.t = animatorProps.s.t;
};

var TextAnimatorProperty = function () {
  function TextAnimatorProperty(textData, renderType, elem) {
    classCallCheck(this, TextAnimatorProperty);

    this._mdf = false;
    this._isFirstFrame = true;
    this._hasMaskedPath = false;
    this._frameId = -1;
    this.dynamicProperties = [];
    this._textData = textData;
    this._renderType = renderType;
    this._elem = elem;
    this.container = elem;
    this._animatorsData = createSizedArray(this._textData.a.length);
    this._pathData = {};
    this._moreOptions = {
      alignment: {}
    };
    this.renderedLetters = [];
    this.lettersChangedFlag = false;
  }

  createClass(TextAnimatorProperty, [{
    key: 'addDynamicProperty',
    value: function addDynamicProperty() {
      console.log('see:', 'https://github.com/airbnb/lottie-web/blob/adb67aaed3058a331d93fe0b87df5129f9fcab57/player/js/utils/text/TextAnimatorProperty.js#L21:53');
    }
  }, {
    key: 'searchProperties',
    value: function searchProperties() {
      var i = void 0;
      var len = this._textData.a.length;
      var animatorProps = void 0;
      var getProp = PropertyFactory$1.getProp;
      for (i = 0; i < len; i += 1) {
        animatorProps = this._textData.a[i];
        this._animatorsData[i] = new TextAnimatorDataProperty(this._elem, animatorProps, this);
      }
      if (this._textData.p && 'm' in this._textData.p) {
        this._pathData = {
          f: getProp(this._elem, this._textData.p.f, 0, 0, this),
          l: getProp(this._elem, this._textData.p.l, 0, 0, this),
          r: this._textData.p.r,
          m: this._elem.maskManager.getMaskProperty(this._textData.p.m)
        };
        this._hasMaskedPath = true;
      } else {
        this._hasMaskedPath = false;
      }
      this._moreOptions.alignment = getProp(this._elem, this._textData.m.a, 1, 0, this);
    }
  }, {
    key: 'getMeasures',
    value: function getMeasures(documentData, lettersChangedFlag) {
      this.lettersChangedFlag = lettersChangedFlag;
      if (!this._mdf && !this._isFirstFrame && !lettersChangedFlag && (!this._hasMaskedPath || !this._pathData.m._mdf)) {
        return;
      }
      this._isFirstFrame = false;
      var alignment = this._moreOptions.alignment.v;
      var animators = this._animatorsData;
      var textData = this._textData;
      var matrixHelper = this.mHelper;
      var renderType = this._renderType;
      var renderedLettersCount = this.renderedLetters.length;
      // let data = this.data;
      var xPos = void 0;
      var yPos = void 0;
      var i = void 0;
      var len = void 0;
      var letters = documentData.l;
      var pathInfo = void 0;
      var currentLength = void 0;
      var currentPoint = void 0;
      var segmentLength = void 0;
      var flag = void 0;
      var pointInd = void 0;
      var segmentInd = void 0;
      var prevPoint = void 0;
      var points = void 0;
      var segments = void 0;
      var partialLength = void 0;
      var totalLength = void 0;
      var perc = void 0;
      var tanAngle = void 0;
      var mask = void 0;
      if (this._hasMaskedPath) {
        mask = this._pathData.m;
        if (!this._pathData.n || this._pathData._mdf) {
          var paths = mask.v;
          if (this._pathData.r) {
            paths = paths.reverse();
          }
          // TODO: release bezier data cached from previous pathInfo: this._pathData.pi
          pathInfo = {
            tLength: 0,
            segments: []
          };
          len = paths._length - 1;
          var pathData = void 0;
          totalLength = 0;
          for (i = 0; i < len; i += 1) {
            pathData = {
              s: paths.v[i],
              e: paths.v[i + 1],
              to: [paths.o[i][0] - paths.v[i][0], paths.o[i][1] - paths.v[i][1]],
              ti: [paths.i[i + 1][0] - paths.v[i + 1][0], paths.i[i + 1][1] - paths.v[i + 1][1]]
            };
            bez.buildBezierData(pathData);
            pathInfo.tLength += pathData.bezierData.segmentLength;
            pathInfo.segments.push(pathData);
            totalLength += pathData.bezierData.segmentLength;
          }
          i = len;
          if (mask.v.c) {
            pathData = {
              s: paths.v[i],
              e: paths.v[0],
              to: [paths.o[i][0] - paths.v[i][0], paths.o[i][1] - paths.v[i][1]],
              ti: [paths.i[0][0] - paths.v[0][0], paths.i[0][1] - paths.v[0][1]]
            };
            bez.buildBezierData(pathData);
            pathInfo.tLength += pathData.bezierData.segmentLength;
            pathInfo.segments.push(pathData);
            totalLength += pathData.bezierData.segmentLength;
          }
          this._pathData.pi = pathInfo;
        }
        pathInfo = this._pathData.pi;

        currentLength = this._pathData.f.v;
        segmentInd = 0;
        pointInd = 1;
        segmentLength = 0;
        flag = true;
        segments = pathInfo.segments;
        if (currentLength < 0 && mask.v.c) {
          if (pathInfo.tLength < Math.abs(currentLength)) {
            currentLength = -Math.abs(currentLength) % pathInfo.tLength;
          }
          segmentInd = segments.length - 1;
          points = segments[segmentInd].bezierData.points;
          pointInd = points.length - 1;
          while (currentLength < 0) {
            currentLength += points[pointInd].partialLength;
            pointInd -= 1;
            if (pointInd < 0) {
              segmentInd -= 1;
              points = segments[segmentInd].bezierData.points;
              pointInd = points.length - 1;
            }
          }
        }
        points = segments[segmentInd].bezierData.points;
        prevPoint = points[pointInd - 1];
        currentPoint = points[pointInd];
        partialLength = currentPoint.partialLength;
      }

      len = letters.length;
      xPos = 0;
      yPos = 0;
      var yOff = documentData.finalSize * 1.2 * 0.714;
      var firstLine = true;
      var animatorProps = void 0;
      var animatorSelector = void 0;
      var j = void 0;
      var jLen = void 0;
      var letterValue = void 0;

      jLen = animators.length;
      // let lastLetter;

      var mult = void 0;
      var ind = -1;
      var offf = void 0;
      var xPathPos = void 0;
      var yPathPos = void 0;
      var initPathPos = currentLength;
      var initSegmentInd = segmentInd;
      var initPointInd = pointInd;
      var currentLine = -1;
      var elemOpacity = void 0;
      var sc = void 0;
      var sw = void 0;
      var fc = void 0;
      var k = void 0;
      // let lineLength = 0;
      var letterSw = void 0;
      var letterSc = void 0;
      var letterFc = void 0;
      var letterM = '';
      var letterP = this.defaultPropsArray;
      var letterO = void 0;

      //
      if (documentData.j === 2 || documentData.j === 1) {
        var animatorJustifyOffset = 0;
        var animatorFirstCharOffset = 0;
        var justifyOffsetMult = documentData.j === 2 ? -0.5 : -1;
        var lastIndex = 0;
        var isNewLine = true;

        for (i = 0; i < len; i += 1) {
          if (letters[i].n) {
            if (animatorJustifyOffset) {
              animatorJustifyOffset += animatorFirstCharOffset;
            }
            while (lastIndex < i) {
              letters[lastIndex].animatorJustifyOffset = animatorJustifyOffset;
              lastIndex += 1;
            }
            animatorJustifyOffset = 0;
            isNewLine = true;
          } else {
            for (j = 0; j < jLen; j += 1) {
              animatorProps = animators[j].a;
              if (animatorProps.t.propType) {
                if (isNewLine && documentData.j === 2) {
                  animatorFirstCharOffset += animatorProps.t.v * justifyOffsetMult;
                }
                animatorSelector = animators[j].s;
                mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
                if (mult.length) {
                  animatorJustifyOffset += animatorProps.t.v * mult[0] * justifyOffsetMult;
                } else {
                  animatorJustifyOffset += animatorProps.t.v * mult * justifyOffsetMult;
                }
              }
            }
            isNewLine = false;
          }
        }
        if (animatorJustifyOffset) {
          animatorJustifyOffset += animatorFirstCharOffset;
        }
        while (lastIndex < i) {
          letters[lastIndex].animatorJustifyOffset = animatorJustifyOffset;
          lastIndex += 1;
        }
      }
      //

      for (i = 0; i < len; i += 1) {
        matrixHelper.reset();
        elemOpacity = 1;
        if (letters[i].n) {
          xPos = 0;
          yPos += documentData.yOffset;
          yPos += firstLine ? 1 : 0;
          currentLength = initPathPos;
          firstLine = false;
          // lineLength = 0;
          if (this._hasMaskedPath) {
            segmentInd = initSegmentInd;
            pointInd = initPointInd;
            points = segments[segmentInd].bezierData.points;
            prevPoint = points[pointInd - 1];
            currentPoint = points[pointInd];
            partialLength = currentPoint.partialLength;
            segmentLength = 0;
          }
          letterO = letterSw = letterFc = letterM = '';
          letterP = this.defaultPropsArray;
        } else {
          if (this._hasMaskedPath) {
            if (currentLine !== letters[i].line) {
              switch (documentData.j) {
                case 1:
                  currentLength += totalLength - documentData.lineWidths[letters[i].line];
                  break;
                case 2:
                  currentLength += (totalLength - documentData.lineWidths[letters[i].line]) / 2;
                  break;
                default:
                  break;
              }
              currentLine = letters[i].line;
            }
            if (ind !== letters[i].ind) {
              if (letters[ind]) {
                currentLength += letters[ind].extra;
              }
              currentLength += letters[i].an / 2;
              ind = letters[i].ind;
            }
            currentLength += alignment[0] * letters[i].an / 200;
            var animatorOffset = 0;
            for (j = 0; j < jLen; j += 1) {
              animatorProps = animators[j].a;
              if (animatorProps.p.propType) {
                animatorSelector = animators[j].s;
                mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
                if (mult.length) {
                  animatorOffset += animatorProps.p.v[0] * mult[0];
                } else {
                  animatorOffset += animatorProps.p.v[0] * mult;
                }
              }
              if (animatorProps.a.propType) {
                animatorSelector = animators[j].s;
                mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
                if (mult.length) {
                  animatorOffset += animatorProps.a.v[0] * mult[0];
                } else {
                  animatorOffset += animatorProps.a.v[0] * mult;
                }
              }
            }
            flag = true;
            while (flag) {
              if (segmentLength + partialLength >= currentLength + animatorOffset || !points) {
                perc = (currentLength + animatorOffset - segmentLength) / currentPoint.partialLength;
                xPathPos = prevPoint.point[0] + (currentPoint.point[0] - prevPoint.point[0]) * perc;
                yPathPos = prevPoint.point[1] + (currentPoint.point[1] - prevPoint.point[1]) * perc;
                matrixHelper.translate(-alignment[0] * letters[i].an / 200, -(alignment[1] * yOff / 100));
                flag = false;
              } else if (points) {
                segmentLength += currentPoint.partialLength;
                pointInd += 1;
                if (pointInd >= points.length) {
                  pointInd = 0;
                  segmentInd += 1;
                  if (!segments[segmentInd]) {
                    if (mask.v.c) {
                      pointInd = 0;
                      segmentInd = 0;
                      points = segments[segmentInd].bezierData.points;
                    } else {
                      segmentLength -= currentPoint.partialLength;
                      points = null;
                    }
                  } else {
                    points = segments[segmentInd].bezierData.points;
                  }
                }
                if (points) {
                  prevPoint = currentPoint;
                  currentPoint = points[pointInd];
                  partialLength = currentPoint.partialLength;
                }
              }
            }
            offf = letters[i].an / 2 - letters[i].add;
            matrixHelper.translate(-offf, 0, 0);
          } else {
            offf = letters[i].an / 2 - letters[i].add;
            matrixHelper.translate(-offf, 0, 0);

            // Grouping alignment
            matrixHelper.translate(-alignment[0] * letters[i].an / 200, -alignment[1] * yOff / 100, 0);
          }

          // lineLength += letters[i].l / 2;
          for (j = 0; j < jLen; j += 1) {
            animatorProps = animators[j].a;
            if (animatorProps.t.propType) {
              animatorSelector = animators[j].s;
              mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
              // This condition is to prevent applying tracking to first character in each line. Might be better to use a boolean "isNewLine"
              if (xPos !== 0 || documentData.j !== 0) {
                if (this._hasMaskedPath) {
                  if (mult.length) {
                    currentLength += animatorProps.t.v * mult[0];
                  } else {
                    currentLength += animatorProps.t.v * mult;
                  }
                } else if (mult.length) {
                  xPos += animatorProps.t.v * mult[0];
                } else {
                  xPos += animatorProps.t.v * mult;
                }
              }
            }
          }
          // lineLength += letters[i].l / 2;
          if (documentData.strokeWidthAnim) {
            sw = documentData.sw || 0;
          }
          if (documentData.strokeColorAnim) {
            if (documentData.sc) {
              sc = [documentData.sc[0], documentData.sc[1], documentData.sc[2]];
            } else {
              sc = [0, 0, 0];
            }
          }
          if (documentData.fillColorAnim && documentData.fc) {
            fc = [documentData.fc[0], documentData.fc[1], documentData.fc[2]];
          }
          for (j = 0; j < jLen; j += 1) {
            animatorProps = animators[j].a;
            if (animatorProps.a.propType) {
              animatorSelector = animators[j].s;
              mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);

              if (mult.length) {
                matrixHelper.translate(-animatorProps.a.v[0] * mult[0], -animatorProps.a.v[1] * mult[1], animatorProps.a.v[2] * mult[2]);
              } else {
                matrixHelper.translate(-animatorProps.a.v[0] * mult, -animatorProps.a.v[1] * mult, animatorProps.a.v[2] * mult);
              }
            }
          }
          for (j = 0; j < jLen; j += 1) {
            animatorProps = animators[j].a;
            if (animatorProps.s.propType) {
              animatorSelector = animators[j].s;
              mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
              if (mult.length) {
                matrixHelper.scale(1 + (animatorProps.s.v[0] - 1) * mult[0], 1 + (animatorProps.s.v[1] - 1) * mult[1], 1);
              } else {
                matrixHelper.scale(1 + (animatorProps.s.v[0] - 1) * mult, 1 + (animatorProps.s.v[1] - 1) * mult, 1);
              }
            }
          }
          for (j = 0; j < jLen; j += 1) {
            animatorProps = animators[j].a;
            animatorSelector = animators[j].s;
            mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
            if (animatorProps.sk.propType) {
              if (mult.length) {
                matrixHelper.skewFromAxis(-animatorProps.sk.v * mult[0], animatorProps.sa.v * mult[1]);
              } else {
                matrixHelper.skewFromAxis(-animatorProps.sk.v * mult, animatorProps.sa.v * mult);
              }
            }
            if (animatorProps.r.propType) {
              if (mult.length) {
                matrixHelper.rotateZ(-animatorProps.r.v * mult[2]);
              } else {
                matrixHelper.rotateZ(-animatorProps.r.v * mult);
              }
            }
            if (animatorProps.ry.propType) {
              if (mult.length) {
                matrixHelper.rotateY(animatorProps.ry.v * mult[1]);
              } else {
                matrixHelper.rotateY(animatorProps.ry.v * mult);
              }
            }
            if (animatorProps.rx.propType) {
              if (mult.length) {
                matrixHelper.rotateX(animatorProps.rx.v * mult[0]);
              } else {
                matrixHelper.rotateX(animatorProps.rx.v * mult);
              }
            }
            if (animatorProps.o.propType) {
              if (mult.length) {
                elemOpacity += (animatorProps.o.v * mult[0] - elemOpacity) * mult[0];
              } else {
                elemOpacity += (animatorProps.o.v * mult - elemOpacity) * mult;
              }
            }
            if (documentData.strokeWidthAnim && animatorProps.sw.propType) {
              if (mult.length) {
                sw += animatorProps.sw.v * mult[0];
              } else {
                sw += animatorProps.sw.v * mult;
              }
            }
            if (documentData.strokeColorAnim && animatorProps.sc.propType) {
              for (k = 0; k < 3; k += 1) {
                if (mult.length) {
                  sc[k] += (animatorProps.sc.v[k] - sc[k]) * mult[0];
                } else {
                  sc[k] += (animatorProps.sc.v[k] - sc[k]) * mult;
                }
              }
            }
            if (documentData.fillColorAnim && documentData.fc) {
              if (animatorProps.fc.propType) {
                for (k = 0; k < 3; k += 1) {
                  if (mult.length) {
                    fc[k] += (animatorProps.fc.v[k] - fc[k]) * mult[0];
                  } else {
                    fc[k] += (animatorProps.fc.v[k] - fc[k]) * mult;
                  }
                }
              }
              if (animatorProps.fh.propType) {
                if (mult.length) {
                  fc = addHueToRGB(fc, animatorProps.fh.v * mult[0]);
                } else {
                  fc = addHueToRGB(fc, animatorProps.fh.v * mult);
                }
              }
              if (animatorProps.fs.propType) {
                if (mult.length) {
                  fc = addSaturationToRGB(fc, animatorProps.fs.v * mult[0]);
                } else {
                  fc = addSaturationToRGB(fc, animatorProps.fs.v * mult);
                }
              }
              if (animatorProps.fb.propType) {
                if (mult.length) {
                  fc = addBrightnessToRGB(fc, animatorProps.fb.v * mult[0]);
                } else {
                  fc = addBrightnessToRGB(fc, animatorProps.fb.v * mult);
                }
              }
            }
          }

          for (j = 0; j < jLen; j += 1) {
            animatorProps = animators[j].a;

            if (animatorProps.p.propType) {
              animatorSelector = animators[j].s;
              mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
              if (this._hasMaskedPath) {
                if (mult.length) {
                  matrixHelper.translate(0, animatorProps.p.v[1] * mult[0], -animatorProps.p.v[2] * mult[1]);
                } else {
                  matrixHelper.translate(0, animatorProps.p.v[1] * mult, -animatorProps.p.v[2] * mult);
                }
              } else if (mult.length) {
                matrixHelper.translate(animatorProps.p.v[0] * mult[0], animatorProps.p.v[1] * mult[1], -animatorProps.p.v[2] * mult[2]);
              } else {
                matrixHelper.translate(animatorProps.p.v[0] * mult, animatorProps.p.v[1] * mult, -animatorProps.p.v[2] * mult);
              }
            }
          }
          if (documentData.strokeWidthAnim) {
            letterSw = sw < 0 ? 0 : sw;
          }
          if (documentData.strokeColorAnim) {
            letterSc = 'rgb(' + Math.round(sc[0] * 255) + ',' + Math.round(sc[1] * 255) + ',' + Math.round(sc[2] * 255) + ')';
          }
          if (documentData.fillColorAnim && documentData.fc) {
            letterFc = 'rgb(' + Math.round(fc[0] * 255) + ',' + Math.round(fc[1] * 255) + ',' + Math.round(fc[2] * 255) + ')';
          }

          if (this._hasMaskedPath) {
            matrixHelper.translate(0, -documentData.ls);

            matrixHelper.translate(0, alignment[1] * yOff / 100 + yPos, 0);
            if (textData.p.p) {
              tanAngle = (currentPoint.point[1] - prevPoint.point[1]) / (currentPoint.point[0] - prevPoint.point[0]);
              var rot = Math.atan(tanAngle) * 180 / Math.PI;
              if (currentPoint.point[0] < prevPoint.point[0]) {
                rot += 180;
              }
              matrixHelper.rotate(-rot * Math.PI / 180);
            }
            matrixHelper.translate(xPathPos, yPathPos, 0);
            currentLength -= alignment[0] * letters[i].an / 200;
            if (letters[i + 1] && ind !== letters[i + 1].ind) {
              currentLength += letters[i].an / 2;
              currentLength += documentData.tr / 1000 * documentData.finalSize;
            }
          } else {
            matrixHelper.translate(xPos, yPos, 0);

            if (documentData.ps) {
              // matrixHelper.translate(documentData.ps[0],documentData.ps[1],0);
              matrixHelper.translate(documentData.ps[0], documentData.ps[1] + documentData.ascent, 0);
            }
            switch (documentData.j) {
              case 1:
                matrixHelper.translate(letters[i].animatorJustifyOffset + documentData.justifyOffset + (documentData.boxWidth - documentData.lineWidths[letters[i].line]), 0, 0);
                break;
              case 2:
                matrixHelper.translate(letters[i].animatorJustifyOffset + documentData.justifyOffset + (documentData.boxWidth - documentData.lineWidths[letters[i].line]) / 2, 0, 0);
                break;
              default:
                break;
            }
            matrixHelper.translate(0, -documentData.ls);
            matrixHelper.translate(offf, 0, 0);
            matrixHelper.translate(alignment[0] * letters[i].an / 200, alignment[1] * yOff / 100, 0);
            xPos += letters[i].l + documentData.tr / 1000 * documentData.finalSize;
          }
          if (renderType === 'html') {
            letterM = matrixHelper.toCSS();
          } else if (renderType === 'svg') {
            letterM = matrixHelper.to2dCSS();
          } else {
            letterP = [matrixHelper.props[0], matrixHelper.props[1], matrixHelper.props[2], matrixHelper.props[3], matrixHelper.props[4], matrixHelper.props[5], matrixHelper.props[6], matrixHelper.props[7], matrixHelper.props[8], matrixHelper.props[9], matrixHelper.props[10], matrixHelper.props[11], matrixHelper.props[12], matrixHelper.props[13], matrixHelper.props[14], matrixHelper.props[15]];
          }
          letterO = elemOpacity;
        }

        if (renderedLettersCount <= i) {
          letterValue = new LetterProps(letterO, letterSw, letterSc, letterFc, letterM, letterP);
          this.renderedLetters.push(letterValue);
          renderedLettersCount += 1;
          this.lettersChangedFlag = true;
        } else {
          letterValue = this.renderedLetters[i];
          this.lettersChangedFlag = letterValue.update(letterO, letterSw, letterSc, letterFc, letterM, letterP) || this.lettersChangedFlag;
        }
      }
    }
  }]);
  return TextAnimatorProperty;
}();

function buildShapeString (pathNodes, length, closed, mat) {
  if (length === 0) {
    return '';
  }
  var _o = pathNodes.o;
  var _i = pathNodes.i;
  var _v = pathNodes.v;
  var i = void 0;
  var shapeString = ' M' + mat.applyToPointStringified(_v[0][0], _v[0][1]);
  for (i = 1; i < length; i += 1) {
    shapeString += ' C' + mat.applyToPointStringified(_o[i - 1][0], _o[i - 1][1]) + ' ' + mat.applyToPointStringified(_i[i][0], _i[i][1]) + ' ' + mat.applyToPointStringified(_v[i][0], _v[i][1]);
  }
  if (closed && length) {
    shapeString += ' C' + mat.applyToPointStringified(_o[i - 1][0], _o[i - 1][1]) + ' ' + mat.applyToPointStringified(_i[0][0], _i[0][1]) + ' ' + mat.applyToPointStringified(_v[0][0], _v[0][1]);
    shapeString += 'z';
  }
  return shapeString;
}

var ITextElement = function () {
  function ITextElement() {
    classCallCheck(this, ITextElement);
    this.emptyProp = new LetterProps();
  }

  createClass(ITextElement, [{
    key: 'initElement',
    value: function initElement(data, globalData, comp) {
      this.lettersChangedFlag = true;
      this.initFrame();
      this.initBaseData(data, globalData, comp);
      this.textProperty = new TextProperty(this, data.t, this.dynamicProperties);
      this.textAnimator = new TextAnimatorProperty(data.t, this.renderType, this);
      this.initTransform(data, globalData, comp);
      this.initHierarchy();
      this.initRenderable();
      this.initRendererElement();
      this.createContainerElements();
      this.addMasks();
      this.createContent();
      this.hide();
      this.textAnimator.searchProperties(this.dynamicProperties);
    }
  }, {
    key: 'prepareFrame',
    value: function prepareFrame(num) {
      this._mdf = false;
      this.prepareRenderableFrame(num);
      this.prepareProperties(num, this.isInRange);
      if (this.textProperty._mdf || this.textProperty._isFirstFrame) {
        this.buildNewText();
        this.textProperty._isFirstFrame = false;
        this.textProperty._mdf = false;
      }
    }
  }, {
    key: 'createPathShape',
    value: function createPathShape(matrixHelper, shapes) {
      var j = void 0;
      var jLen = shapes.length;
      // let k;
      // let kLen;
      var pathNodes = void 0;
      var shapeStr = '';
      for (j = 0; j < jLen; j += 1) {
        pathNodes = shapes[j].ks.k;
        shapeStr += buildShapeString(pathNodes, pathNodes.i.length, true, matrixHelper);
      }
      return shapeStr;
    }
  }, {
    key: 'updateDocumentData',
    value: function updateDocumentData(newData, index) {
      this.textProperty.updateDocumentData(newData, index);
    }
  }, {
    key: 'canResizeFont',
    value: function canResizeFont(_canResize) {
      this.textProperty.canResizeFont(_canResize);
    }
  }, {
    key: 'setMinimumFontSize',
    value: function setMinimumFontSize(_fontSize) {
      this.textProperty.setMinimumFontSize(_fontSize);
    }
  }, {
    key: 'applyTextPropertiesToMatrix',
    value: function applyTextPropertiesToMatrix(documentData, matrixHelper, lineNumber, xPos, yPos) {
      if (documentData.ps) {
        matrixHelper.translate(documentData.ps[0], documentData.ps[1] + documentData.ascent, 0);
      }
      matrixHelper.translate(0, -documentData.ls, 0);
      switch (documentData.j) {
        case 1:
          matrixHelper.translate(documentData.justifyOffset + (documentData.boxWidth - documentData.lineWidths[lineNumber]), 0, 0);
          break;
        case 2:
          matrixHelper.translate(documentData.justifyOffset + (documentData.boxWidth - documentData.lineWidths[lineNumber]) / 2, 0, 0);
          break;
        default:
          break;
      }
      matrixHelper.translate(xPos, yPos, 0);
    }
  }, {
    key: 'buildColor',
    value: function buildColor(colorData) {
      return 'rgb(' + Math.round(colorData[0] * 255) + ',' + Math.round(colorData[1] * 255) + ',' + Math.round(colorData[2] * 255) + ')';
    }
  }, {
    key: 'destroy',
    value: function destroy() {}
  }]);
  return ITextElement;
}();

var CVTextElement = function (_Mixin) {
  inherits(CVTextElement, _Mixin);

  function CVTextElement(data, globalData, comp) {
    classCallCheck(this, CVTextElement);

    var _this = possibleConstructorReturn(this, (CVTextElement.__proto__ || Object.getPrototypeOf(CVTextElement)).call(this));

    _this.tHelper = createTag('canvas');

    _this.textSpans = [];
    _this.yOffset = 0;
    _this.fillColorAnim = false;
    _this.strokeColorAnim = false;
    _this.strokeWidthAnim = false;
    _this.stroke = false;
    _this.fill = false;
    _this.justifyOffset = 0;
    _this.currentRender = null;
    _this.renderType = 'canvas';
    _this.values = {
      fill: 'rgba(0,0,0,0)',
      stroke: 'rgba(0,0,0,0)',
      sWidth: 0,
      fValue: ''
    };
    _this.initElement(data, globalData, comp);
    return _this;
  }

  createClass(CVTextElement, [{
    key: 'buildNewText',
    value: function buildNewText() {
      var documentData = this.textProperty.currentData;
      this.renderedLetters = createSizedArray(documentData.l ? documentData.l.length : 0);

      var hasFill = false;
      if (documentData.fc) {
        hasFill = true;
        this.values.fill = this.buildColor(documentData.fc);
      } else {
        this.values.fill = 'rgba(0,0,0,0)';
      }
      this.fill = hasFill;
      var hasStroke = false;
      if (documentData.sc) {
        hasStroke = true;
        this.values.stroke = this.buildColor(documentData.sc);
        this.values.sWidth = documentData.sw;
      }
      var fontData = this.globalData.fontManager.getFontByName(documentData.f);
      var i = void 0;
      var len = void 0;
      var letters = documentData.l;
      var matrixHelper = this.mHelper;
      this.stroke = hasStroke;
      this.values.fValue = documentData.finalSize + 'px ' + this.globalData.fontManager.getFontByName(documentData.f).fFamily;
      len = documentData.finalText.length;
      // this.tHelper.font = this.values.fValue;
      var charData = void 0;
      var shapeData = void 0;
      var k = void 0;
      var kLen = void 0;
      var shapes = void 0;
      var j = void 0;
      var jLen = void 0;
      var pathNodes = void 0;
      var commands = void 0;
      var pathArr = void 0;
      var singleShape = this.data.singleShape;
      var trackingOffset = documentData.tr / 1000 * documentData.finalSize;
      var xPos = 0;
      var yPos = 0;
      var firstLine = true;
      var cnt = 0;
      for (i = 0; i < len; i += 1) {
        charData = this.globalData.fontManager.getCharData(documentData.finalText[i], fontData.fStyle, this.globalData.fontManager.getFontByName(documentData.f).fFamily);
        shapeData = charData && charData.data || {};
        matrixHelper.reset();
        if (singleShape && letters[i].n) {
          xPos = -trackingOffset;
          yPos += documentData.yOffset;
          yPos += firstLine ? 1 : 0;
          firstLine = false;
        }

        shapes = shapeData.shapes ? shapeData.shapes[0].it : [];
        jLen = shapes.length;
        matrixHelper.scale(documentData.finalSize / 100, documentData.finalSize / 100);
        if (singleShape) {
          this.applyTextPropertiesToMatrix(documentData, matrixHelper, letters[i].line, xPos, yPos);
        }
        commands = createSizedArray(jLen);
        for (j = 0; j < jLen; j += 1) {
          kLen = shapes[j].ks.k.i.length;
          pathNodes = shapes[j].ks.k;
          pathArr = [];
          for (k = 1; k < kLen; k += 1) {
            if (k === 1) {
              pathArr.push(matrixHelper.applyToX(pathNodes.v[0][0], pathNodes.v[0][1], 0), matrixHelper.applyToY(pathNodes.v[0][0], pathNodes.v[0][1], 0));
            }
            pathArr.push(matrixHelper.applyToX(pathNodes.o[k - 1][0], pathNodes.o[k - 1][1], 0), matrixHelper.applyToY(pathNodes.o[k - 1][0], pathNodes.o[k - 1][1], 0), matrixHelper.applyToX(pathNodes.i[k][0], pathNodes.i[k][1], 0), matrixHelper.applyToY(pathNodes.i[k][0], pathNodes.i[k][1], 0), matrixHelper.applyToX(pathNodes.v[k][0], pathNodes.v[k][1], 0), matrixHelper.applyToY(pathNodes.v[k][0], pathNodes.v[k][1], 0));
          }
          pathArr.push(matrixHelper.applyToX(pathNodes.o[k - 1][0], pathNodes.o[k - 1][1], 0), matrixHelper.applyToY(pathNodes.o[k - 1][0], pathNodes.o[k - 1][1], 0), matrixHelper.applyToX(pathNodes.i[0][0], pathNodes.i[0][1], 0), matrixHelper.applyToY(pathNodes.i[0][0], pathNodes.i[0][1], 0), matrixHelper.applyToX(pathNodes.v[0][0], pathNodes.v[0][1], 0), matrixHelper.applyToY(pathNodes.v[0][0], pathNodes.v[0][1], 0));
          commands[j] = pathArr;
        }
        if (singleShape) {
          xPos += letters[i].l;
          xPos += trackingOffset;
        }
        if (this.textSpans[cnt]) {
          this.textSpans[cnt].elem = commands;
        } else {
          this.textSpans[cnt] = {
            elem: commands
          };
        }
        cnt += 1;
      }
    }
  }, {
    key: 'renderInnerContent',
    value: function renderInnerContent() {
      var ctx = this.canvasContext;
      // let finalMat = this.finalTransform.mat.props;
      ctx.font = this.values.fValue;
      ctx.setLineCap('butt');
      ctx.setLineJoin('miter');
      ctx.setMiterLimit(4);

      if (!this.data.singleShape) {
        this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag);
      }

      var i = void 0;
      var len = void 0;
      var j = void 0;
      var jLen = void 0;
      var k = void 0;
      var kLen = void 0;
      var renderedLetters = this.textAnimator.renderedLetters;

      var letters = this.textProperty.currentData.l;

      len = letters.length;
      var renderedLetter = void 0;
      var lastFill = null;
      var lastStroke = null;
      var lastStrokeW = null;
      var commands = void 0;
      var pathArr = void 0;
      for (i = 0; i < len; i += 1) {
        if (letters[i].n) {
          continue;
        }
        renderedLetter = renderedLetters[i];
        if (renderedLetter) {
          this.globalData.renderer.save();
          this.globalData.renderer.ctxTransform(renderedLetter.p);
          this.globalData.renderer.ctxOpacity(renderedLetter.o);
        }
        if (this.fill) {
          if (renderedLetter && renderedLetter.fc) {
            if (lastFill !== renderedLetter.fc) {
              lastFill = renderedLetter.fc;
              ctx.setFillStyle(renderedLetter.fc);
            }
          } else if (lastFill !== this.values.fill) {
            lastFill = this.values.fill;
            ctx.setFillStyle(this.values.fill);
          }
          commands = this.textSpans[i].elem;
          jLen = commands.length;
          this.globalData.canvasContext.beginPath();
          for (j = 0; j < jLen; j += 1) {
            pathArr = commands[j];
            kLen = pathArr.length;
            this.globalData.canvasContext.moveTo(pathArr[0], pathArr[1]);
            for (k = 2; k < kLen; k += 6) {
              this.globalData.canvasContext.bezierCurveTo(pathArr[k], pathArr[k + 1], pathArr[k + 2], pathArr[k + 3], pathArr[k + 4], pathArr[k + 5]);
            }
          }
          this.globalData.canvasContext.closePath();
          this.globalData.canvasContext.fill();
          // /ctx.fillText(this.textSpans[i].val,0,0);
        }
        if (this.stroke) {
          if (renderedLetter && renderedLetter.sw) {
            if (lastStrokeW !== renderedLetter.sw) {
              lastStrokeW = renderedLetter.sw;
              ctx.setLineWidth(renderedLetter.sw);
            }
          } else if (lastStrokeW !== this.values.sWidth) {
            lastStrokeW = this.values.sWidth;
            ctx.setLineWidth(this.values.sWidth);
          }
          if (renderedLetter && renderedLetter.sc) {
            if (lastStroke !== renderedLetter.sc) {
              lastStroke = renderedLetter.sc;
              ctx.setStrokeStyle(renderedLetter.sc);
            }
          } else if (lastStroke !== this.values.stroke) {
            lastStroke = this.values.stroke;
            ctx.setStrokeStyle(this.values.stroke);
          }
          commands = this.textSpans[i].elem;
          jLen = commands.length;
          this.globalData.canvasContext.beginPath();
          for (j = 0; j < jLen; j += 1) {
            pathArr = commands[j];
            kLen = pathArr.length;
            this.globalData.canvasContext.moveTo(pathArr[0], pathArr[1]);
            for (k = 2; k < kLen; k += 6) {
              this.globalData.canvasContext.bezierCurveTo(pathArr[k], pathArr[k + 1], pathArr[k + 2], pathArr[k + 3], pathArr[k + 4], pathArr[k + 5]);
            }
          }
          this.globalData.canvasContext.closePath();
          this.globalData.canvasContext.stroke();
          // /ctx.strokeText(letters[i].val,0,0);
        }
        if (renderedLetter) {
          this.globalData.renderer.restore();
        }
        // ctx.draw(true);
      }
      /* if(this.data.hasMask){
       this.globalData.renderer.restore(true);
       } */
    }
  }]);
  return CVTextElement;
}(Mixin(BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement, ITextElement));

var SVGBaseElement = function SVGBaseElement() {
  classCallCheck(this, SVGBaseElement);
};

var IImageElement = function (_Mixin) {
  inherits(IImageElement, _Mixin);

  function IImageElement(data, globalData, comp) {
    classCallCheck(this, IImageElement);

    var _this = possibleConstructorReturn(this, (IImageElement.__proto__ || Object.getPrototypeOf(IImageElement)).call(this));

    _this.assetData = globalData.getAssetData(data.refId);
    _this.initElement(data, globalData, comp);
    return _this;
  }

  createClass(IImageElement, [{
    key: 'createContent',
    value: function createContent() {
      console.warn('createContent');
    }
  }]);
  return IImageElement;
}(Mixin(BaseElement, TransformElement, SVGBaseElement, HierarchyElement, FrameElement, RenderableDOMElement));

var CVImageElement = function (_Mixin) {
  inherits(CVImageElement, _Mixin);

  function CVImageElement(data, globalData, comp) {
    classCallCheck(this, CVImageElement);

    var _this = possibleConstructorReturn(this, (CVImageElement.__proto__ || Object.getPrototypeOf(CVImageElement)).call(this));

    _this.prepareFrame = IImageElement.prototype.prepareFrame;

    _this.failed = false;
    _this.img = {};
    _this.assetData = globalData.getAssetData(data.refId);
    _this.initElement(data, globalData, comp);
    _this.globalData.addPendingElement();
    return _this;
  }

  createClass(CVImageElement, [{
    key: 'initElement',
    value: function initElement(data, globalData, comp) {
      this.initFrame();
      this.initBaseData(data, globalData, comp);
      this.initTransform(data, globalData, comp);
      this.initHierarchy();
      this.initRenderable();
      this.initRendererElement();
      this.createContainerElements();
      this.addMasks();
      this.createContent();
      this.hide();
    }
  }, {
    key: 'imageLoaded',
    value: function imageLoaded() {
      this.globalData.elementLoaded();
      // 压缩图片比例
      if (this.assetData.w !== this.img.width || this.assetData.h !== this.img.height) {
        var canvas = createTag('canvas');
        canvas.width = this.assetData.w;
        canvas.height = this.assetData.h;
        var ctx = canvas.getContext('2d');

        var imgW = this.img.width;
        var imgH = this.img.height;
        var imgRel = imgW / imgH;
        var canvasRel = this.assetData.w / this.assetData.h;
        var widthCrop = void 0;
        var heightCrop = void 0;
        if (imgRel > canvasRel) {
          heightCrop = imgH;
          widthCrop = heightCrop * canvasRel;
        } else {
          widthCrop = imgW;
          heightCrop = widthCrop / canvasRel;
        }
        ctx.drawImage(this.img, (imgW - widthCrop) / 2, (imgH - heightCrop) / 2, widthCrop, heightCrop, 0, 0, this.assetData.w, this.assetData.h);
        this.img = canvas;
      }
    }
  }, {
    key: 'imageFailed',
    value: function imageFailed() {
      this.failed = true;
      this.globalData.elementLoaded();
    }
  }, {
    key: 'createContent',
    value: function createContent() {
      var _this2 = this;

      var assetPath = this.globalData.getAssetsPath(this.assetData);
      wx.downloadFile({
        url: assetPath,
        success: function success(res) {
          wx.getImageInfo({
            src: res.tempFilePath,
            success: function success(_ref) {
              var width = _ref.width,
                  height = _ref.height;

              _this2.img.src = res.tempFilePath;
              _this2.img.width = width;
              _this2.img.height = height;
              _this2.imageLoaded();
            }
          });
        },
        fail: function fail() {
          _this2.imageFailed();
        }
      });
    }
  }, {
    key: 'renderInnerContent',
    value: function renderInnerContent() {
      if (this.failed) {
        return;
      }
      this.canvasContext.drawImage(this.img.src, 0, 0);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.img = null;
    }
  }]);
  return CVImageElement;
}(Mixin(BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement));

var CVSolidElement = function (_Mixin) {
  inherits(CVSolidElement, _Mixin);

  function CVSolidElement(data, globalData, comp) {
    classCallCheck(this, CVSolidElement);

    var _this = possibleConstructorReturn(this, (CVSolidElement.__proto__ || Object.getPrototypeOf(CVSolidElement)).call(this));

    _this.prepareFrame = RenderableDOMElement.prototype.prepareFrame;

    _this.initElement(data, globalData, comp);
    return _this;
  }

  createClass(CVSolidElement, [{
    key: 'initElement',
    value: function initElement(data, globalData, comp) {
      this.initFrame();
      this.initBaseData(data, globalData, comp);
      this.initTransform(data, globalData, comp);
      this.initHierarchy();
      this.initRenderable();
      this.initRendererElement();
      this.createContainerElements();
      this.addMasks();
      this.createContent();
      this.hide();
    }
  }, {
    key: 'renderInnerContent',
    value: function renderInnerContent() {
      var ctx = this.canvasContext;
      ctx.setFillStyle(this.data.sc);
      ctx.fillRect(0, 0, this.data.sw, this.data.sh);
    }
  }]);
  return CVSolidElement;
}(Mixin(BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement));

var NullElement = function (_Mixin) {
  inherits(NullElement, _Mixin);

  function NullElement(data, globalData, comp) {
    classCallCheck(this, NullElement);

    var _this = possibleConstructorReturn(this, (NullElement.__proto__ || Object.getPrototypeOf(NullElement)).call(this));

    _this.initFrame();
    _this.initBaseData(data, globalData, comp);
    _this.initFrame();
    _this.initTransform(data, globalData, comp);
    _this.initHierarchy();
    return _this;
  }

  createClass(NullElement, [{
    key: 'prepareFrame',
    value: function prepareFrame(num) {
      this.prepareProperties(num, true);
    }
  }, {
    key: 'renderFrame',
    value: function renderFrame() {}
  }, {
    key: 'getBaseElement',
    value: function getBaseElement() {
      return null;
    }
  }, {
    key: 'destroy',
    value: function destroy() {}
  }, {
    key: 'sourceRectAtTime',
    value: function sourceRectAtTime() {}
  }, {
    key: 'hide',
    value: function hide() {}
  }]);
  return NullElement;
}(Mixin(BaseElement, TransformElement, HierarchyElement, FrameElement));

var CVCompElement = void 0;

var CanvasRenderer = function (_BaseRenderer) {
  inherits(CanvasRenderer, _BaseRenderer);

  function CanvasRenderer(animationItem, config) {
    classCallCheck(this, CanvasRenderer);

    var _this = possibleConstructorReturn(this, (CanvasRenderer.__proto__ || Object.getPrototypeOf(CanvasRenderer)).call(this));

    _this.animationItem = animationItem;
    _this.renderConfig = {
      clearCanvas: config && config.clearCanvas !== undefined ? config.clearCanvas : true,
      context: config && config.context || null,
      progressiveLoad: config && config.progressiveLoad || false,
      preserveAspectRatio: config && config.preserveAspectRatio || 'xMidYMid meet',
      className: config && config.className || ''
    };
    _this.renderConfig.dpr = config && config.dpr || 1;
    _this.renderedFrame = -1;
    _this.globalData = {
      frameNum: -1,
      _mdf: false,
      renderConfig: _this.renderConfig,
      currentGlobalAlpha: -1
    };
    _this.contextData = new CVContextData();
    _this.elements = [];
    _this.pendingElements = [];
    _this.transformMat = new Matrix();
    _this.completeLayers = false;
    return _this;
  }

  createClass(CanvasRenderer, [{
    key: 'createShape',
    value: function createShape(data) {
      return new CVShapeElement(data, this.globalData, this);
    }
  }, {
    key: 'createText',
    value: function createText(data) {
      return new CVTextElement(data, this.globalData, this);
    }
  }, {
    key: 'createImage',
    value: function createImage(data) {
      return new CVImageElement(data, this.globalData, this);
    }
  }, {
    key: 'createComp',
    value: function createComp(data) {
      return new CVCompElement(data, this.globalData, this);
    }
  }, {
    key: 'createSolid',
    value: function createSolid(data) {
      return new CVSolidElement(data, this.globalData, this);
    }
  }, {
    key: 'createNull',
    value: function createNull(data) {
      return new NullElement(data, this.globalData, this);
    }
  }, {
    key: 'ctxTransform',
    value: function ctxTransform(props) {
      if (props[0] === 1 && props[1] === 0 && props[4] === 0 && props[5] === 1 && props[12] === 0 && props[13] === 0) {
        return;
      }
      if (!this.renderConfig.clearCanvas) {
        // this.canvasContext.setTransform(props[0], props[1], props[4], props[5], props[12], props[13]);

        this.canvasContext.transform(props[0], props[1], props[4], props[5], props[12], props[13]);
        return;
      }
      this.transformMat.cloneFromProps(props);
      var cProps = this.contextData.cTr.props;
      this.transformMat.transform(cProps[0], cProps[1], cProps[2], cProps[3], cProps[4], cProps[5], cProps[6], cProps[7], cProps[8], cProps[9], cProps[10], cProps[11], cProps[12], cProps[13], cProps[14], cProps[15]);
      this.contextData.cTr.cloneFromProps(this.transformMat.props);
      var trProps = this.contextData.cTr.props;
      this.canvasContext.setTransform(trProps[0], trProps[1], trProps[4], trProps[5], trProps[12], trProps[13]);
    }
  }, {
    key: 'ctxOpacity',
    value: function ctxOpacity(op) {
      /* if(op === 1){
          return;
      } */
      if (!this.renderConfig.clearCanvas) {
        var globalAlpha = this.canvasContext.globalAlpha * (op < 0 ? 0 : op);
        this.canvasContext.globalAlpha = globalAlpha;
        this.canvasContext.setGlobalAlpha(globalAlpha);
        this.globalData.currentGlobalAlpha = this.contextData.cO;
        return;
      }
      this.contextData.cO *= op < 0 ? 0 : op;
      if (this.globalData.currentGlobalAlpha !== this.contextData.cO) {
        this.canvasContext.globalAlpha = this.contextData.cO;
        this.canvasContext.setGlobalAlpha(this.contextData.cO);
        this.globalData.currentGlobalAlpha = this.contextData.cO;
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      if (!this.renderConfig.clearCanvas) {
        this.canvasContext.restore();
        return;
      }
      this.contextData.reset();
    }
  }, {
    key: 'save',
    value: function save(actionFlag) {
      if (!this.renderConfig.clearCanvas) {
        this.canvasContext.save();
        return;
      }
      if (actionFlag) {
        this.canvasContext.save();
      }
      var props = this.contextData.cTr.props;
      if (this.contextData._length <= this.contextData.cArrPos) {
        this.contextData.duplicate();
      }
      var i = void 0;
      var arr = this.contextData.saved[this.contextData.cArrPos];
      for (i = 0; i < 16; i += 1) {
        arr[i] = props[i];
      }
      this.contextData.savedOp[this.contextData.cArrPos] = this.contextData.cO;
      this.contextData.cArrPos += 1;
    }
  }, {
    key: 'restore',
    value: function restore(actionFlag) {
      if (!this.renderConfig.clearCanvas) {
        this.canvasContext.restore();
        return;
      }
      if (actionFlag) {
        this.canvasContext.restore();
        this.globalData.blendMode = 'source-over';
      }
      this.contextData.cArrPos -= 1;
      var popped = this.contextData.saved[this.contextData.cArrPos];
      var i = void 0;
      var arr = this.contextData.cTr.props;
      for (i = 0; i < 16; i += 1) {
        arr[i] = popped[i];
      }
      this.canvasContext.setTransform(popped[0], popped[1], popped[4], popped[5], popped[12], popped[13]);
      popped = this.contextData.savedOp[this.contextData.cArrPos];
      this.contextData.cO = popped;
      if (this.globalData.currentGlobalAlpha !== popped) {
        this.canvasContext.globalAlpha = popped;
        this.canvasContext.setGlobalAlpha(popped);
        this.globalData.currentGlobalAlpha = popped;
      }
    }
  }, {
    key: 'configAnimation',
    value: function configAnimation(animData) {
      this.canvasContext = this.renderConfig.context;
      this.data = animData;
      this.layers = animData.layers;
      this.transformCanvas = {
        w: animData.w,
        h: animData.h,
        sx: 0,
        sy: 0,
        tx: 0,
        ty: 0
      };
      this.setupGlobalData(animData /* , document.body */);
      this.globalData.canvasContext = this.canvasContext;
      this.globalData.renderer = this;
      this.globalData.isDashed = false;
      this.globalData.progressiveLoad = this.renderConfig.progressiveLoad;
      this.globalData.transformCanvas = this.transformCanvas;
      this.elements = createSizedArray(animData.layers.length);

      this.updateContainerSize();
    }
  }, {
    key: 'updateContainerSize',
    value: function updateContainerSize() {
      this.reset();
      var elementWidth = void 0;
      var elementHeight = void 0;

      elementWidth = this.canvasContext.canvas.width * this.renderConfig.dpr;
      elementHeight = this.canvasContext.canvas.height * this.renderConfig.dpr;

      var elementRel = void 0;
      var animationRel = void 0;
      if (this.renderConfig.preserveAspectRatio.indexOf('meet') !== -1 || this.renderConfig.preserveAspectRatio.indexOf('slice') !== -1) {
        var par = this.renderConfig.preserveAspectRatio.split(' ');
        var fillType = par[1] || 'meet';
        var pos = par[0] || 'xMidYMid';
        var xPos = pos.substr(0, 4);
        var yPos = pos.substr(4);
        elementRel = elementWidth / elementHeight;
        animationRel = this.transformCanvas.w / this.transformCanvas.h;
        if (animationRel > elementRel && fillType === 'meet' || animationRel < elementRel && fillType === 'slice') {
          this.transformCanvas.sx = elementWidth / (this.transformCanvas.w / this.renderConfig.dpr);
          this.transformCanvas.sy = elementWidth / (this.transformCanvas.w / this.renderConfig.dpr);
        } else {
          this.transformCanvas.sx = elementHeight / (this.transformCanvas.h / this.renderConfig.dpr);
          this.transformCanvas.sy = elementHeight / (this.transformCanvas.h / this.renderConfig.dpr);
        }

        if (xPos === 'xMid' && (animationRel < elementRel && fillType === 'meet' || animationRel > elementRel && fillType === 'slice')) {
          this.transformCanvas.tx = (elementWidth - this.transformCanvas.w * (elementHeight / this.transformCanvas.h)) / 2 * this.renderConfig.dpr;
        } else if (xPos === 'xMax' && (animationRel < elementRel && fillType === 'meet' || animationRel > elementRel && fillType === 'slice')) {
          this.transformCanvas.tx = (elementWidth - this.transformCanvas.w * (elementHeight / this.transformCanvas.h)) * this.renderConfig.dpr;
        } else {
          this.transformCanvas.tx = 0;
        }
        if (yPos === 'YMid' && (animationRel > elementRel && fillType === 'meet' || animationRel < elementRel && fillType === 'slice')) {
          this.transformCanvas.ty = (elementHeight - this.transformCanvas.h * (elementWidth / this.transformCanvas.w)) / 2 * this.renderConfig.dpr;
        } else if (yPos === 'YMax' && (animationRel > elementRel && fillType === 'meet' || animationRel < elementRel && fillType === 'slice')) {
          this.transformCanvas.ty = (elementHeight - this.transformCanvas.h * (elementWidth / this.transformCanvas.w)) * this.renderConfig.dpr;
        } else {
          this.transformCanvas.ty = 0;
        }
      } else if (this.renderConfig.preserveAspectRatio === 'none') {
        this.transformCanvas.sx = elementWidth / (this.transformCanvas.w / this.renderConfig.dpr);
        this.transformCanvas.sy = elementHeight / (this.transformCanvas.h / this.renderConfig.dpr);
        this.transformCanvas.tx = 0;
        this.transformCanvas.ty = 0;
      } else {
        this.transformCanvas.sx = this.renderConfig.dpr;
        this.transformCanvas.sy = this.renderConfig.dpr;
        this.transformCanvas.tx = 0;
        this.transformCanvas.ty = 0;
      }
      this.transformCanvas.props = [this.transformCanvas.sx, 0, 0, 0, 0, this.transformCanvas.sy, 0, 0, 0, 0, 1, 0, this.transformCanvas.tx, this.transformCanvas.ty, 0, 1];
      /* let i, len = this.elements.length;
      for(i=0;i<len;i+=1){
          if(this.elements[i] && this.elements[i].data.ty === 0){
              this.elements[i].resize(this.globalData.transformCanvas);
          }
      } */
      this.ctxTransform(this.transformCanvas.props);
      this.canvasContext.beginPath();
      this.canvasContext.rect(0, 0, this.transformCanvas.w, this.transformCanvas.h);
      this.canvasContext.closePath();
      this.canvasContext.clip();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var i = void 0;
      var len = this.layers ? this.layers.length : 0;
      for (i = len - 1; i >= 0; i -= 1) {
        if (this.elements[i]) {
          this.elements[i].destroy();
        }
      }
      this.elements.length = 0;
      this.globalData.canvasContext = null;
      this.animationItem.container = null;
      this.destroyed = true;
    }
  }, {
    key: 'renderFrame',
    value: function renderFrame(num) {
      if (this.renderedFrame === num && this.renderConfig.clearCanvas === true || this.destroyed || num === -1) {
        return;
      }
      this.renderedFrame = num;
      this.globalData.frameNum = num - this.animationItem._isFirstFrame;
      this.globalData.frameId += 1;
      this.globalData._mdf = !this.renderConfig.clearCanvas;
      this.globalData.projectInterface.currentFrame = num;

      var i = void 0;
      var len = this.layers.length;
      if (!this.completeLayers) {
        this.checkLayers(num);
      }
      for (i = 0; i < len; i++) {
        if (this.completeLayers || this.elements[i]) {
          this.elements[i].prepareFrame(num - this.layers[i].st);
        }
      }
      if (this.globalData._mdf) {
        if (this.renderConfig.clearCanvas === true) {
          this.canvasContext.clearRect(0, 0, this.transformCanvas.w, this.transformCanvas.h);
        } else {
          this.save();
        }
        for (i = len - 1; i >= 0; i -= 1) {
          if (this.completeLayers || this.elements[i]) {
            this.elements[i].renderFrame();
          }
        }
        this.canvasContext.draw();
        if (this.renderConfig.clearCanvas !== true) {
          this.restore();
        }
      }
    }
  }, {
    key: 'buildItem',
    value: function buildItem(pos) {
      var elements = this.elements;
      if (elements[pos] || this.layers[pos].ty === 99) {
        return;
      }
      var element = this.createItem(this.layers[pos], this, this.globalData);
      elements[pos] = element;
      element.initExpressions();
    }
  }, {
    key: 'checkPendingElements',
    value: function checkPendingElements() {
      while (this.pendingElements.length) {
        var element = this.pendingElements.pop();
        element.checkParenting();
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      // this.animationItem.container.style.display = 'none';
    }
  }, {
    key: 'show',
    value: function show() {
      // this.animationItem.container.style.display = 'block';
    }
  }]);
  return CanvasRenderer;
}(BaseRenderer);

CVCompElement = CVCompElementFactory(CanvasRenderer);

var ImagePreloader = function () {
  function ImagePreloader() {
    classCallCheck(this, ImagePreloader);

    this.assetsPath = '';
    this.path = '';
    this.totalAssets = 0;
    this.totalImages = 0;
    this.loadedAssets = 0;
    this.imagesLoadedCb = null;
  }

  createClass(ImagePreloader, [{
    key: 'imageLoaded',
    value: function imageLoaded() {
      this.loadedAssets += 1;
      if (this.loadedAssets === this.totalImages) {
        if (this.imagesLoadedCb) {
          this.imagesLoadedCb(null);
        }
      }
    }
  }, {
    key: 'getAssetsPath',
    value: function getAssetsPath(assetData) {
      var path = '';
      if (assetData.e) {
        path = assetData.p;
      } else if (this.assetsPath) {
        var imagePath = assetData.p;
        if (imagePath.indexOf('images/') !== -1) {
          imagePath = imagePath.split('/')[1];
        }
        path = this.assetsPath + imagePath;
      } else {
        path = this.path;
        path += assetData.u ? assetData.u : '';
        path += assetData.p;
      }
      return path;
    }
  }, {
    key: 'loadImage',
    value: function loadImage(path, cb) {
      var imageLoaded = this.imageLoaded.bind(this);
      wx.downloadFile({
        url: path,
        success: function success(res) {
          // 本地路径
          cb(res.tempFilePath);
          imageLoaded();
        },
        fail: function fail() {
          imageLoaded();
        }
      });
    }
  }, {
    key: 'loadAssets',
    value: function loadAssets(assets, cb) {
      this.imagesLoadedCb = cb;
      this.totalAssets = assets.length;
      var i = void 0;
      for (i = 0; i < this.totalAssets; i += 1) {
        if (!assets[i].layers) {
          this.loadImage(this.getAssetsPath(assets[i]), loadImageCB);
          this.totalImages += 1;
        }
      }
      function loadImageCB(tempFilePath) {
        assets[i] = tempFilePath;
      }
    }
  }, {
    key: 'setPath',
    value: function setPath(path) {
      this.path = path || '';
    }
  }, {
    key: 'setAssetsPath',
    value: function setAssetsPath(path) {
      this.assetsPath = path || '';
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.imagesLoadedCb = null;
    }
  }]);
  return ImagePreloader;
}();

var expressionsPlugin$1 = {
  initExpressions: function initExpressions(animation) {
    animation.renderer.compInterface = CompExpressionInterface(animation.renderer);
    animation.renderer.globalData.projectInterface.registerComposition(animation.renderer);
  }
};

function dataFunctionManager() {
  // let tCanvasHelper = createTag('canvas').getContext('2d');

  function completeLayers(layers, comps, fontManager) {
    var layerData = void 0;
    // let animArray;
    // let lastFrame;
    var i = void 0;
    var len = layers.length;
    var j = void 0;
    var jLen = void 0;
    var k = void 0;
    var kLen = void 0;
    for (i = 0; i < len; i += 1) {
      layerData = layers[i];
      if (!('ks' in layerData) || layerData.completed) {
        continue;
      }
      layerData.completed = true;
      if (layerData.tt) {
        layers[i - 1].td = layerData.tt;
      }
      // animArray = [];
      // lastFrame = -1;
      if (layerData.hasMask) {
        var maskProps = layerData.masksProperties;
        jLen = maskProps.length;
        for (j = 0; j < jLen; j += 1) {
          if (maskProps[j].pt.k.i) {
            convertPathsToAbsoluteValues(maskProps[j].pt.k);
          } else {
            kLen = maskProps[j].pt.k.length;
            for (k = 0; k < kLen; k += 1) {
              if (maskProps[j].pt.k[k].s) {
                convertPathsToAbsoluteValues(maskProps[j].pt.k[k].s[0]);
              }
              if (maskProps[j].pt.k[k].e) {
                convertPathsToAbsoluteValues(maskProps[j].pt.k[k].e[0]);
              }
            }
          }
        }
      }
      if (layerData.ty === 0) {
        layerData.layers = findCompLayers(layerData.refId, comps);
        completeLayers(layerData.layers, comps, fontManager);
      } else if (layerData.ty === 4) {
        completeShapes(layerData.shapes);
      } else if (layerData.ty === 5) {
        completeText(layerData, fontManager);
      }
    }
  }

  function findCompLayers(id, comps) {
    var i = 0;
    var len = comps.length;
    while (i < len) {
      if (comps[i].id === id) {
        if (!comps[i].layers.__used) {
          comps[i].layers.__used = true;
          return comps[i].layers;
        }
        return JSON.parse(JSON.stringify(comps[i].layers));
      }
      i += 1;
    }
  }

  function completeShapes(arr) {
    var i = void 0;
    var len = arr.length;
    var j = void 0;
    var jLen = void 0;
    // let hasPaths = false;
    for (i = len - 1; i >= 0; i -= 1) {
      if (arr[i].ty === 'sh') {
        if (arr[i].ks.k.i) {
          convertPathsToAbsoluteValues(arr[i].ks.k);
        } else {
          jLen = arr[i].ks.k.length;
          for (j = 0; j < jLen; j += 1) {
            if (arr[i].ks.k[j].s) {
              convertPathsToAbsoluteValues(arr[i].ks.k[j].s[0]);
            }
            if (arr[i].ks.k[j].e) {
              convertPathsToAbsoluteValues(arr[i].ks.k[j].e[0]);
            }
          }
        }
        // hasPaths = true;
      } else if (arr[i].ty === 'gr') {
        completeShapes(arr[i].it);
      }
    }
    /* if(hasPaths){
        //mx: distance
        //ss: sensitivity
        //dc: decay
        arr.splice(arr.length-1,0,{
            "ty": "ms",
            "mx":20,
            "ss":10,
             "dc":0.001,
            "maxDist":200
        });
    } */
  }

  function convertPathsToAbsoluteValues(path) {
    var i = void 0;
    var len = path.i.length;
    for (i = 0; i < len; i += 1) {
      path.i[i][0] += path.v[i][0];
      path.i[i][1] += path.v[i][1];
      path.o[i][0] += path.v[i][0];
      path.o[i][1] += path.v[i][1];
    }
  }

  function checkVersion(minimum, animVersionString) {
    var animVersion = animVersionString ? animVersionString.split('.') : [100, 100, 100];
    if (minimum[0] > animVersion[0]) {
      return true;
    } else if (animVersion[0] > minimum[0]) {
      return false;
    }
    if (minimum[1] > animVersion[1]) {
      return true;
    } else if (animVersion[1] > minimum[1]) {
      return false;
    }
    if (minimum[2] > animVersion[2]) {
      return true;
    } else if (animVersion[2] > minimum[2]) {
      return false;
    }
  }

  var checkText = function () {
    var minimumVersion = [4, 4, 14];

    function updateTextLayer(textLayer) {
      var documentData = textLayer.t.d;
      textLayer.t.d = {
        k: [{
          s: documentData,
          t: 0
        }]
      };
    }

    function iterateLayers(layers) {
      var i = void 0;
      var len = layers.length;
      for (i = 0; i < len; i += 1) {
        if (layers[i].ty === 5) {
          updateTextLayer(layers[i]);
        }
      }
    }

    return function (animationData) {
      if (checkVersion(minimumVersion, animationData.v)) {
        iterateLayers(animationData.layers);
        if (animationData.assets) {
          var i = void 0;
          var len = animationData.assets.length;
          for (i = 0; i < len; i += 1) {
            if (animationData.assets[i].layers) {
              iterateLayers(animationData.assets[i].layers);
            }
          }
        }
      }
    };
  }();

  var checkChars = function () {
    var minimumVersion = [4, 7, 99];
    return function (animationData) {
      if (animationData.chars && !checkVersion(minimumVersion, animationData.v)) {
        var i = void 0;
        var len = animationData.chars.length;
        var j = void 0;
        var jLen = void 0;
        // let k;
        // let kLen;
        var pathData = void 0;
        var paths = void 0;
        for (i = 0; i < len; i += 1) {
          if (animationData.chars[i].data && animationData.chars[i].data.shapes) {
            paths = animationData.chars[i].data.shapes[0].it;
            jLen = paths.length;

            for (j = 0; j < jLen; j += 1) {
              pathData = paths[j].ks.k;
              if (!pathData.__converted) {
                convertPathsToAbsoluteValues(paths[j].ks.k);
                pathData.__converted = true;
              }
            }
          }
        }
      }
    };
  }();

  var checkColors = function () {
    var minimumVersion = [4, 1, 9];

    function iterateShapes(shapes) {
      var i = void 0;
      var len = shapes.length;
      var j = void 0;
      var jLen = void 0;
      for (i = 0; i < len; i += 1) {
        if (shapes[i].ty === 'gr') {
          iterateShapes(shapes[i].it);
        } else if (shapes[i].ty === 'fl' || shapes[i].ty === 'st') {
          if (shapes[i].c.k && shapes[i].c.k[0].i) {
            jLen = shapes[i].c.k.length;
            for (j = 0; j < jLen; j += 1) {
              if (shapes[i].c.k[j].s) {
                shapes[i].c.k[j].s[0] /= 255;
                shapes[i].c.k[j].s[1] /= 255;
                shapes[i].c.k[j].s[2] /= 255;
                shapes[i].c.k[j].s[3] /= 255;
              }
              if (shapes[i].c.k[j].e) {
                shapes[i].c.k[j].e[0] /= 255;
                shapes[i].c.k[j].e[1] /= 255;
                shapes[i].c.k[j].e[2] /= 255;
                shapes[i].c.k[j].e[3] /= 255;
              }
            }
          } else {
            shapes[i].c.k[0] /= 255;
            shapes[i].c.k[1] /= 255;
            shapes[i].c.k[2] /= 255;
            shapes[i].c.k[3] /= 255;
          }
        }
      }
    }

    function iterateLayers(layers) {
      var i = void 0;
      var len = layers.length;
      for (i = 0; i < len; i += 1) {
        if (layers[i].ty === 4) {
          iterateShapes(layers[i].shapes);
        }
      }
    }

    return function (animationData) {
      if (checkVersion(minimumVersion, animationData.v)) {
        iterateLayers(animationData.layers);
        if (animationData.assets) {
          var i = void 0;
          var len = animationData.assets.length;
          for (i = 0; i < len; i += 1) {
            if (animationData.assets[i].layers) {
              iterateLayers(animationData.assets[i].layers);
            }
          }
        }
      }
    };
  }();

  var checkShapes = function () {
    var minimumVersion = [4, 4, 18];

    function completeShapesLocal(arr) {
      var i = void 0;
      var len = arr.length;
      var j = void 0;
      var jLen = void 0;
      // let hasPaths = false;
      for (i = len - 1; i >= 0; i -= 1) {
        if (arr[i].ty === 'sh') {
          if (arr[i].ks.k.i) {
            arr[i].ks.k.c = arr[i].closed;
          } else {
            jLen = arr[i].ks.k.length;
            for (j = 0; j < jLen; j += 1) {
              if (arr[i].ks.k[j].s) {
                arr[i].ks.k[j].s[0].c = arr[i].closed;
              }
              if (arr[i].ks.k[j].e) {
                arr[i].ks.k[j].e[0].c = arr[i].closed;
              }
            }
          }
          // hasPaths = true;
        } else if (arr[i].ty === 'gr') {
          completeShapes(arr[i].it);
        }
      }
    }

    function iterateLayers(layers) {
      var layerData = void 0;
      var i = void 0;
      var len = layers.length;
      var j = void 0;
      var jLen = void 0;
      var k = void 0;
      var kLen = void 0;
      for (i = 0; i < len; i += 1) {
        layerData = layers[i];
        if (layerData.hasMask) {
          var maskProps = layerData.masksProperties;
          jLen = maskProps.length;
          for (j = 0; j < jLen; j += 1) {
            if (maskProps[j].pt.k.i) {
              maskProps[j].pt.k.c = maskProps[j].cl;
            } else {
              kLen = maskProps[j].pt.k.length;
              for (k = 0; k < kLen; k += 1) {
                if (maskProps[j].pt.k[k].s) {
                  maskProps[j].pt.k[k].s[0].c = maskProps[j].cl;
                }
                if (maskProps[j].pt.k[k].e) {
                  maskProps[j].pt.k[k].e[0].c = maskProps[j].cl;
                }
              }
            }
          }
        }
        if (layerData.ty === 4) {
          completeShapesLocal(layerData.shapes);
        }
      }
    }

    return function (animationData) {
      if (checkVersion(minimumVersion, animationData.v)) {
        iterateLayers(animationData.layers);
        if (animationData.assets) {
          var i = void 0;
          var len = animationData.assets.length;
          for (i = 0; i < len; i += 1) {
            if (animationData.assets[i].layers) {
              iterateLayers(animationData.assets[i].layers);
            }
          }
        }
      }
    };
  }();

  function completeData(animationData, fontManager) {
    if (animationData.__complete) {
      return;
    }
    checkColors(animationData);
    checkText(animationData);
    checkChars(animationData);
    checkShapes(animationData);
    completeLayers(animationData.layers, animationData.assets, fontManager);
    animationData.__complete = true;
    // blitAnimation(animationData, animationData.assets, fontManager);
  }

  function completeText(data /* , fontManager */) {
    if (data.t.a.length === 0 && !('m' in data.t.p)) {
      data.singleShape = true;
    }
  }

  var moduleOb = {};
  moduleOb.completeData = completeData;

  return moduleOb;
}

var dataManager = dataFunctionManager();

var assetLoader = {
  // load json
  load: function assetLoader(path, callback, error_callback) {
    var self = this;
    if (path.includes('.zip')) {
      // eslint-disable-next-line no-use-before-define
      return loadZipFiles(path).then(function (_ref) {
        var data = _ref.data,
            tempDir = _ref.tempDir;

        self.path = tempDir;
        callback(data);
      });
    }
    wx.request({
      url: path,
      success: function success(res) {
        callback(res.data);
      },
      fail: function fail(err) {
        if (typeof error_callback !== 'function') return;
        error_callback(err);
      }
    });
  }
};

var fs = wx.getFileSystemManager();

function downloadZip(url) {
  return new Promise(function (resolve) {
    wx.downloadFile({
      url: url,
      success: function success(res) {
        console.log('downloadZip', res);
        resolve(res.tempFilePath);
      }
    });
  });
}

function unzipFile(tempFilePath) {
  var targetPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : wx.env.USER_DATA_PATH + '/tmp-unzip';

  return new Promise(function (resolve) {
    try {
      fs.rmdirSync(targetPath, true);
    } catch (error) {
      // ignore
    }
    fs.unzip({
      targetPath: targetPath,
      zipFilePath: tempFilePath,
      success: function success(res) {
        console.log('unzipFile', res);
        resolve({
          targetPath: targetPath
        });
      },
      fail: function fail(err) {
        console.error('unzipFile', err);
      }
    });
  });
}

function getDirStat(dir) {
  return fs.statSync(dir);
}

function getFileTree(dir) {
  var tree = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var files = fs.readdirSync(dir);
  files.forEach(function (file) {
    var filePath = dir + '/' + file;
    var Stats = getDirStat(filePath);
    var isDir = Stats.isDirectory();

    if (isDir) {
      tree[file] = getFileTree(filePath);
    } else {
      tree[file] = filePath;
    }
  });
  return tree;
}

function loadZipFiles(url) {
  var tempDir = '';
  return downloadZip(url).then(function (tempFilePath) {
    return unzipFile(tempFilePath);
  }).then(function (_ref2) {
    var targetPath = _ref2.targetPath;

    tempDir = targetPath + '/';
    var tree = getFileTree(targetPath);
    var keys = Object.keys(tree);
    var dataJsonPath = keys.find(function (key) {
      return key.endsWith('.json');
    });
    if (!dataJsonPath) return;
    return {
      tempDir: tempDir,
      data: JSON.parse(fs.readFileSync(tree[dataJsonPath], 'utf-8') || '{}')
    };
  });
}

var AnimationItem = function (_BaseEvent) {
  inherits(AnimationItem, _BaseEvent);

  function AnimationItem() {
    classCallCheck(this, AnimationItem);

    var _this = possibleConstructorReturn(this, (AnimationItem.__proto__ || Object.getPrototypeOf(AnimationItem)).call(this));

    _this._cbs = [];
    _this.name = '';
    _this.path = '';
    _this.isLoaded = false;
    _this.currentFrame = 0;
    _this.currentRawFrame = 0;
    _this.totalFrames = 0;
    _this.frameRate = 0;
    _this.frameMult = 0;
    _this.playSpeed = 1;
    _this.playDirection = 1;
    _this.pendingElements = 0;
    _this.playCount = 0;
    _this.animationData = {};
    _this.assets = [];
    _this.isPaused = true;
    _this.autoplay = false;
    _this.loop = true;
    _this.renderer = null;
    _this.animationID = randomString(10);
    _this.assetsPath = '';
    _this.timeCompleted = 0;
    _this.segmentPos = 0;
    _this.subframeEnabled = subframeEnabled;
    _this.segments = [];
    _this._idle = true;
    _this.projectInterface = ProjectInterface();
    return _this;
  }

  createClass(AnimationItem, [{
    key: 'setParams',
    value: function setParams(params) {
      if (params.context) {
        this.context = params.context;
      }

      if (params.wrapper || params.container) {
        this.wrapper = params.wrapper || params.container;
      }

      this.renderer = new CanvasRenderer(this, params.rendererSettings);
      this.renderer.setProjectInterface(this.projectInterface);
      this.animType = 'canvas';

      if (params.loop === '' || params.loop === null) {
        this.loop = false;
      } else if (params.loop === false) {
        this.loop = false;
      } else if (params.loop === true) {
        this.loop = true;
      } else {
        this.loop = parseInt(params.loop, 10);
      }
      this.autoplay = 'autoplay' in params ? params.autoplay : true;
      this.name = params.name ? params.name : '';
      this.autoloadSegments = params.autoloadSegments ? params.autoloadSegments : true;
      this.assetsPath = params.assetsPath;
      if (params.animationData) {
        this.configAnimation(params.animationData);
      } else if (params.path) {
        var path = params.path;
        this.path = path;
        this.fileName = path.substr(params.path.lastIndexOf('/') + 1);

        assetLoader.load.call(this, path, this.configAnimation.bind(this));
      }
    }
  }, {
    key: 'includeLayers',
    value: function includeLayers(data) {
      if (data.op > this.animationData.op) {
        this.animationData.op = data.op;
        this.totalFrames = Math.floor(data.op - this.animationData.ip);
      }
      var layers = this.animationData.layers;
      var i = void 0;
      var len = layers.length;
      var newLayers = data.layers;
      var j = void 0;
      var jLen = newLayers.length;
      for (j = 0; j < jLen; j += 1) {
        i = 0;
        while (i < len) {
          if (layers[i].id === newLayers[j].id) {
            layers[i] = newLayers[j];
            break;
          }
          i += 1;
        }
      }
      if (data.chars || data.fonts) {
        this.renderer.globalData.fontManager.addChars(data.chars);
        this.renderer.globalData.fontManager.addFonts(data.fonts, this.renderer.globalData.defs);
      }
      if (data.assets) {
        len = data.assets.length;
        for (i = 0; i < len; i += 1) {
          this.animationData.assets.push(data.assets[i]);
        }
      }
      this.animationData.__complete = false;
      dataManager.completeData(this.animationData, this.renderer.globalData.fontManager);
      this.renderer.includeLayers(data.layers);
      if (expressionsPlugin$1) {
        expressionsPlugin$1.initExpressions(this);
      }
      this.loadNextSegment();
    }
  }, {
    key: 'loadNextSegment',
    value: function loadNextSegment() {
      var segments = this.animationData.segments;
      if (!segments || segments.length === 0 || !this.autoloadSegments) {
        this.trigger('data_ready');
        this.timeCompleted = this.totalFrames;
        return;
      }
      var segment = segments.shift();
      this.timeCompleted = segment.time * this.frameRate;
      var segmentPath = this.path + this.fileName + '_' + this.segmentPos + '.json';
      this.segmentPos += 1;
      assetLoader.load(segmentPath, this.includeLayers.bind(this));
    }
  }, {
    key: 'loadSegments',
    value: function loadSegments() {
      var segments = this.animationData.segments;
      if (!segments) {
        this.timeCompleted = this.totalFrames;
      }
      this.loadNextSegment();
    }
  }, {
    key: 'preloadImages',
    value: function preloadImages() {
      this.imagePreloader = new ImagePreloader();
      this.imagePreloader.setAssetsPath(this.assetsPath);
      this.imagePreloader.setPath(this.path);
      this.imagePreloader.loadAssets(this.animationData.assets, function (err) {
        if (!err) {
          this.trigger('loaded_images');
        }
      }.bind(this));
    }
  }, {
    key: 'configAnimation',
    value: function configAnimation(animData) {
      if (!this.renderer) {
        return;
      }
      this.animationData = animData;
      this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip);
      this.renderer.configAnimation(animData);
      if (!animData.assets) {
        animData.assets = [];
      }
      this.renderer.searchExtraCompositions(animData.assets);

      this.assets = this.animationData.assets;
      this.frameRate = this.animationData.fr;
      this.firstFrame = Math.round(this.animationData.ip);
      this.frameMult = this.animationData.fr / 1000;
      this.trigger('config_ready');
      this.preloadImages();
      this.loadSegments();
      this.updaFrameModifier();
      this.waitForFontsLoaded();
    }
  }, {
    key: 'completeData',
    value: function completeData() {
      dataManager.completeData(this.animationData, this.renderer.globalData.fontManager);
      this.checkLoaded();
    }
  }, {
    key: 'waitForFontsLoaded',
    value: function waitForFontsLoaded() {
      if (!this.renderer) {
        return;
      }
      {
          this.completeData();
        }
    }
  }, {
    key: 'addPendingElement',
    value: function addPendingElement() {
      this.pendingElements += 1;
    }
  }, {
    key: 'elementLoaded',
    value: function elementLoaded() {
      this.pendingElements -= 1;
      this.checkLoaded();
    }
  }, {
    key: 'checkLoaded',
    value: function checkLoaded() {
      if (this.pendingElements === 0) {
        if (expressionsPlugin$1) {
          expressionsPlugin$1.initExpressions(this);
        }
        this.renderer.initItems();
        setTimeout(function () {
          this.trigger('DOMLoaded');
        }.bind(this), 0);
        this.isLoaded = true;
        this.gotoFrame();
        if (this.autoplay) {
          this.play();
        }
      }
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.renderer.updateContainerSize();
    }
  }, {
    key: 'setSubframe',
    value: function setSubframe(flag) {
      this.subframeEnabled = !!flag;
    }
  }, {
    key: 'gotoFrame',
    value: function gotoFrame() {
      this.currentFrame = this.subframeEnabled ? this.currentRawFrame : ~~this.currentRawFrame;

      if (this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted) {
        this.currentFrame = this.timeCompleted;
      }
      this.trigger('enterFrame');
      this.renderFrame();
    }
  }, {
    key: 'renderFrame',
    value: function renderFrame() {
      if (this.isLoaded === false) {
        return;
      }
      this.renderer.renderFrame(this.currentFrame + this.firstFrame);
    }
  }, {
    key: 'play',
    value: function play(name) {
      if (name && this.name !== name) {
        return;
      }
      if (this.isPaused === true) {
        this.isPaused = false;
        if (this._idle) {
          this._idle = false;
          this.trigger('_active');
        }
      }
    }
  }, {
    key: 'pause',
    value: function pause(name) {
      if (name && this.name !== name) {
        return;
      }
      if (this.isPaused === false) {
        this.isPaused = true;
        this._idle = true;
        this.trigger('_idle');
      }
    }
  }, {
    key: 'togglePause',
    value: function togglePause(name) {
      if (name && this.name !== name) {
        return;
      }
      if (this.isPaused === true) {
        this.play();
      } else {
        this.pause();
      }
    }
  }, {
    key: 'stop',
    value: function stop(name) {
      if (name && this.name !== name) {
        return;
      }
      this.pause();
      this.playCount = 0;
      this.setCurrentRawFrameValue(0);
    }
  }, {
    key: 'goToAndStop',
    value: function goToAndStop(value, isFrame, name) {
      if (name && this.name !== name) {
        return;
      }
      if (isFrame) {
        this.setCurrentRawFrameValue(value);
      } else {
        this.setCurrentRawFrameValue(value * this.frameModifier);
      }
      this.pause();
    }
  }, {
    key: 'goToAndPlay',
    value: function goToAndPlay(value, isFrame, name) {
      this.goToAndStop(value, isFrame, name);
      this.play();
    }
  }, {
    key: 'advanceTime',
    value: function advanceTime(value) {
      if (this.isPaused === true || this.isLoaded === false) {
        return;
      }
      var nextValue = this.currentRawFrame + value * this.frameModifier;
      var _isComplete = false;
      // Checking if nextValue > totalFrames - 1 for addressing non looping and looping animations.
      // If animation won't loop, it should stop at totalFrames - 1. If it will loop it should complete the last frame and then loop.
      if (nextValue >= this.totalFrames - 1 && this.frameModifier > 0) {
        if (!this.loop || this.playCount === this.loop) {
          if (!this.checkSegments(nextValue % this.totalFrames)) {
            _isComplete = true;
            nextValue = this.totalFrames - 1;
          }
        } else if (nextValue >= this.totalFrames) {
          this.playCount += 1;
          if (!this.checkSegments(nextValue % this.totalFrames)) {
            this.setCurrentRawFrameValue(nextValue % this.totalFrames);
            this.trigger('loopComplete');
          }
        } else {
          this.setCurrentRawFrameValue(nextValue);
        }
      } else if (nextValue < 0) {
        if (!this.checkSegments(nextValue % this.totalFrames)) {
          if (this.loop && !(this.playCount-- <= 0 && this.loop !== true)) {
            this.setCurrentRawFrameValue(this.totalFrames + nextValue % this.totalFrames);
            this.trigger('loopComplete');
          } else {
            _isComplete = true;
            nextValue = 0;
          }
        }
      } else {
        this.setCurrentRawFrameValue(nextValue);
      }
      if (_isComplete) {
        this.setCurrentRawFrameValue(nextValue);
        this.pause();
        this.trigger('complete');
      }
    }
  }, {
    key: 'adjustSegment',
    value: function adjustSegment(arr, offset) {
      this.playCount = 0;
      if (arr[1] < arr[0]) {
        if (this.frameModifier > 0) {
          if (this.playSpeed < 0) {
            this.setSpeed(-this.playSpeed);
          } else {
            this.setDirection(-1);
          }
        }
        this.timeCompleted = this.totalFrames = arr[0] - arr[1];
        this.firstFrame = arr[1];
        this.setCurrentRawFrameValue(this.totalFrames - 0.001 - offset);
      } else if (arr[1] > arr[0]) {
        if (this.frameModifier < 0) {
          if (this.playSpeed < 0) {
            this.setSpeed(-this.playSpeed);
          } else {
            this.setDirection(1);
          }
        }
        this.timeCompleted = this.totalFrames = arr[1] - arr[0];
        this.firstFrame = arr[0];
        this.setCurrentRawFrameValue(0.001 + offset);
      }
      this.trigger('segmentStart');
    }
  }, {
    key: 'setSegment',
    value: function setSegment(init, end) {
      var pendingFrame = -1;
      if (this.isPaused) {
        if (this.currentRawFrame + this.firstFrame < init) {
          pendingFrame = init;
        } else if (this.currentRawFrame + this.firstFrame > end) {
          pendingFrame = end - init;
        }
      }

      this.firstFrame = init;
      this.timeCompleted = this.totalFrames = end - init;
      if (pendingFrame !== -1) {
        this.goToAndStop(pendingFrame, true);
      }
    }
  }, {
    key: 'playSegments',
    value: function playSegments(arr, forceFlag) {
      if (_typeof(arr[0]) === 'object') {
        var i = void 0;
        var len = arr.length;
        for (i = 0; i < len; i += 1) {
          this.segments.push(arr[i]);
        }
      } else {
        this.segments.push(arr);
      }
      if (forceFlag) {
        this.checkSegments(0);
      }
      if (this.isPaused) {
        this.play();
      }
    }
  }, {
    key: 'resetSegments',
    value: function resetSegments(forceFlag) {
      this.segments.length = 0;
      this.segments.push([this.animationData.ip, this.animationData.op]);
      // this.segments.push([this.animationData.ip*this.frameRate,Math.floor(this.animationData.op - this.animationData.ip+this.animationData.ip*this.frameRate)]);
      if (forceFlag) {
        this.checkSegments(0);
      }
    }
  }, {
    key: 'checkSegments',
    value: function checkSegments(offset) {
      if (this.segments.length) {
        this.adjustSegment(this.segments.shift(), offset);
        return true;
      }
      return false;
    }
  }, {
    key: 'destroy',
    value: function destroy(name) {
      if (name && this.name !== name || !this.renderer) {
        return;
      }
      this.renderer.destroy();
      this.trigger('destroy');
      this._cbs = null;
      this.onEnterFrame = this.onLoopComplete = this.onComplete = this.onSegmentStart = this.onDestroy = null;
      this.renderer = null;
    }
  }, {
    key: 'setCurrentRawFrameValue',
    value: function setCurrentRawFrameValue(value) {
      this.currentRawFrame = value;
      this.gotoFrame();
    }
  }, {
    key: 'setSpeed',
    value: function setSpeed(val) {
      this.playSpeed = val;
      this.updaFrameModifier();
    }
  }, {
    key: 'setDirection',
    value: function setDirection(val) {
      this.playDirection = val < 0 ? -1 : 1;
      this.updaFrameModifier();
    }
  }, {
    key: 'updaFrameModifier',
    value: function updaFrameModifier() {
      this.frameModifier = this.frameMult * this.playSpeed * this.playDirection;
    }
  }, {
    key: 'getPath',
    value: function getPath() {
      return this.path;
    }
  }, {
    key: 'getAssetsPath',
    value: function getAssetsPath(assetData) {
      var path = '';
      if (assetData.e) {
        path = assetData.p;
      } else if (this.assetsPath) {
        var imagePath = assetData.p;
        if (imagePath.indexOf('images/') !== -1) {
          imagePath = imagePath.split('/')[1];
        }
        path = this.assetsPath + imagePath;
      } else {
        path = this.path;
        path += assetData.u ? assetData.u : '';
        path += assetData.p;
      }
      return path;
    }
  }, {
    key: 'getAssetData',
    value: function getAssetData(id) {
      var i = 0;
      var len = this.assets.length;
      while (i < len) {
        if (id === this.assets[i].id) {
          return this.assets[i];
        }
        i += 1;
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.renderer.hide();
    }
  }, {
    key: 'show',
    value: function show() {
      this.renderer.show();
    }
  }, {
    key: 'getDuration',
    value: function getDuration(isFrame) {
      return isFrame ? this.totalFrames : this.totalFrames / this.frameRate;
    }
  }, {
    key: 'trigger',
    value: function trigger(name) {
      if (this._cbs && this._cbs[name]) {
        switch (name) {
          case 'enterFrame':
            this.triggerEvent(name, new BMEnterFrameEvent(name, this.currentFrame, this.totalFrames, this.frameMult));
            break;
          case 'loopComplete':
            this.triggerEvent(name, new BMCompleteLoopEvent(name, this.loop, this.playCount, this.frameMult));
            break;
          case 'complete':
            this.triggerEvent(name, new BMCompleteEvent(name, this.frameMult));
            break;
          case 'segmentStart':
            this.triggerEvent(name, new BMSegmentStartEvent(name, this.firstFrame, this.totalFrames));
            break;
          case 'destroy':
            this.triggerEvent(name, new BMDestroyEvent(name, this));
            break;
          default:
            this.triggerEvent(name);
        }
      }
      if (name === 'enterFrame' && this.onEnterFrame) {
        this.onEnterFrame.call(this, new BMEnterFrameEvent(name, this.currentFrame, this.totalFrames, this.frameMult));
      }
      if (name === 'loopComplete' && this.onLoopComplete) {
        this.onLoopComplete.call(this, new BMCompleteLoopEvent(name, this.loop, this.playCount, this.frameMult));
      }
      if (name === 'complete' && this.onComplete) {
        this.onComplete.call(this, new BMCompleteEvent(name, this.frameMult));
      }
      if (name === 'segmentStart' && this.onSegmentStart) {
        this.onSegmentStart.call(this, new BMSegmentStartEvent(name, this.firstFrame, this.totalFrames));
      }
      if (name === 'destroy' && this.onDestroy) {
        this.onDestroy.call(this, new BMDestroyEvent(name, this));
      }
    }
  }]);
  return AnimationItem;
}(BaseEvent);

var AnimationManager = function () {
  function AnimationManager() {
    classCallCheck(this, AnimationManager);

    this.moduleOb = {};
    this.registeredAnimations = [];
    this.initTime = 0;
    this.len = 0;
    this.playingAnimationsNum = 0;
    this._stopped = true;
    this._isFrozen = false;
  }

  createClass(AnimationManager, [{
    key: 'removeElement',
    value: function removeElement(ev) {
      var i = 0;
      var animItem = ev.target;
      var registeredAnimations = this.registeredAnimations;
      while (i < this.len) {
        if (registeredAnimations[i].animation === animItem) {
          registeredAnimations.splice(i, 1);
          i -= 1;
          this.len -= 1;
          if (!animItem.isPaused) {
            this.subtractPlayingCount();
          }
        }
        i += 1;
      }
    }
  }, {
    key: 'getRegisteredAnimations',
    value: function getRegisteredAnimations() {
      var registeredAnimations = this.registeredAnimations;
      var i = void 0;
      var len = registeredAnimations.length;
      var animations = [];
      for (i = 0; i < len; i += 1) {
        animations.push(registeredAnimations[i].animation);
      }
      return animations;
    }
  }, {
    key: 'addPlayingCount',
    value: function addPlayingCount() {
      this.playingAnimationsNum += 1;
      this.activate();
    }
  }, {
    key: 'subtractPlayingCount',
    value: function subtractPlayingCount() {
      this.playingAnimationsNum -= 1;
    }
  }, {
    key: 'setupAnimation',
    value: function setupAnimation(animItem, element) {
      animItem.addEventListener('destroy', this.removeElement.bind(this));
      animItem.addEventListener('_active', this.addPlayingCount.bind(this));
      animItem.addEventListener('_idle', this.subtractPlayingCount.bind(this));
      this.registeredAnimations.push({
        elem: element,
        animation: animItem
      });
      this.len += 1;
    }
  }, {
    key: 'loadAnimation',
    value: function loadAnimation(params) {
      var animItem = new AnimationItem();
      this.setupAnimation(animItem, null);
      animItem.setParams(params);
      return animItem;
    }
  }, {
    key: 'setSpeed',
    value: function setSpeed(val, animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.setSpeed(val, animation);
      }
    }
  }, {
    key: 'setDirection',
    value: function setDirection(val, animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.setDirection(val, animation);
      }
    }
  }, {
    key: 'play',
    value: function play(animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.play(animation);
      }
    }
  }, {
    key: 'resume',
    value: function resume(nowTime) {
      var elapsedTime = ~~(nowTime - this.initTime);
      var registeredAnimations = this.registeredAnimations;
      var i = void 0;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.advanceTime(elapsedTime);
      }
      this.initTime = nowTime;
      if (this.playingAnimationsNum && !this._isFrozen) {
        raf(this.resume.bind(this));
      } else {
        this._stopped = true;
      }
    }
  }, {
    key: 'first',
    value: function first(nowTime) {
      this.initTime = nowTime;
      raf(this.resume.bind(this));
    }
  }, {
    key: 'pause',
    value: function pause(animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.pause(animation);
      }
    }
  }, {
    key: 'goToAndStop',
    value: function goToAndStop(value, isFrame, animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.goToAndStop(value, isFrame, animation);
      }
    }
  }, {
    key: 'stop',
    value: function stop(animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.stop(animation);
      }
    }
  }, {
    key: 'togglePause',
    value: function togglePause(animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.togglePause(animation);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy(animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = this.len - 1; i >= 0; i -= 1) {
        registeredAnimations[i].animation.destroy(animation);
      }
    }
  }, {
    key: 'resize',
    value: function resize() {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.resize();
      }
    }
  }, {
    key: 'activate',
    value: function activate() {
      if (!this._isFrozen && this.playingAnimationsNum) {
        if (this._stopped) {
          raf(this.first.bind(this));
          this._stopped = false;
        }
      }
    }
  }, {
    key: 'freeze',
    value: function freeze() {
      this._isFrozen = true;
    }
  }, {
    key: 'unfreeze',
    value: function unfreeze() {
      this._isFrozen = false;
      this.activate();
    }
  }]);
  return AnimationManager;
}();

var AnimationManager$1 = new AnimationManager();

var enableProxyLog = true;

function enableDebug(b) {
  enableProxyLog = !!b;
}

var methods = ['save', 'setFillStyle', 'moveTo', 'bezierCurveTo', 'closePath', 'fill', 'draw', 'beginPath', 'stroke', 'setTransform'];

function proxyCtx(ctx) {
  methods.forEach(function (method) {
    var oldMethod = ctx[method];
    if (typeof oldMethod === 'function') {
      Object.defineProperty(ctx, method, {
        value: function value() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          if (enableProxyLog) {
            console.log.call(null, ['ctx.' + method + '('].concat(args.join(',')).concat(')').join(''));
          }
          return oldMethod.apply(ctx, args);
        }
      });
    }
  });

  if (typeof Proxy !== 'undefined') {
    /* eslint no-new: 0 */
    new Proxy(ctx, {
      set: function set(target, propKey, value) {
        console.log('ctx.' + propKey + ' = ' + value);
        ctx[propKey] = value;
      }
    });
  }
}

function debugElapsedTimeFactory() {
  var nameLog = {};
  return {
    start: function start(groupName) {
      nameLog[groupName] = +new Date();
    },
    end: function end(groupName) {
      var value = nameLog[groupName];
      if (typeof value === 'undefined') {
        throw new Error('debugElapsedTimeFactory start(' + groupName + ') is not invoke before end()');
      }
      console.log('debug:' + groupName, +new Date() - value + 'ms');
      delete nameLog[groupName];
    }
  };
}

// 打印耗时
var debug = debugElapsedTimeFactory();

exports.default = AnimationManager$1;
exports.enableDebug = enableDebug;
exports.proxyCtx = proxyCtx;
exports.debug = debug;
