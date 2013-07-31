// Generated by CoffeeScript 1.3.3

/*
"Skeuocard" -- A Skeuomorphic Credit-Card Input Enhancement
@description Skeuocard is a skeuomorphic credit card input plugin, supporting 
             progressive enhancement. It renders a credit-card input which 
             behaves similarly to a physical credit card.
@author Ken Keiter <ken@kenkeiter.com>
@updated 2013-07-25
@website http://kenkeiter.com/
@exports [window.Skeuocard]
*/


(function() {
  var Skeuocard,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Skeuocard = (function() {

    function Skeuocard(el, opts) {
      var optDefaults;
      if (opts == null) {
        opts = {};
      }
      this.el = {
        container: $(el)
      };
      this._underlyingFormEls = {};
      this._inputViews = {};
      this.product = null;
      this.issuer = null;
      this.acceptedCardProducts = {};
      this.visibleFace = 'front';
      optDefaults = {
        debug: false,
        acceptedCardProducts: [],
        cardNumberPlaceholderChar: 'X',
        genericPlaceholder: "XXXX XXXX XXXX XXXX",
        typeInputSelector: '[name="cc_type"]',
        numberInputSelector: '[name="cc_number"]',
        expInputSelector: '[name="cc_exp"]',
        nameInputSelector: '[name="cc_name"]',
        cvcInputSelector: '[name="cc_cvc"]',
        currentDate: new Date(),
        initialValues: {},
        validationState: {},
        strings: {
          hiddenFaceFillPrompt: "Click here to<br /> fill in the other side.",
          hiddenFaceErrorWarning: "There's an error on the other side.",
          hiddenFaceSwitchPrompt: "Forgot something?"
        }
      };
      opts.flipTabFrontEl || (opts.flipTabFrontEl = $("<div class=\"flip-tab front\">" + ("<p>" + opts.frontFlipTabBody + "</p></div>")));
      opts.flipTabBackEl || (opts.flipTabBackEl = $("<div class=\"flip-tab back\">" + ("<p>" + opts.backFlipTabBody + "</p></div>")));
      this.options = $.extend(optDefaults, opts);
      this._conformDOM();
      this._setAcceptedCardProducts();
      this._createInputs();
      this._bindEvents();
      this.render();
    }

    Skeuocard.prototype._conformDOM = function() {
      var fieldName, fieldValue, _ref,
        _this = this;
      this.el.container.addClass("js");
      this.el.container.find("> :not(input,select,textarea)").remove();
      this.el.container.find("> input,select,textarea").hide();
      this._underlyingFormEls = {
        type: this.el.container.find(this.options.typeInputSelector),
        number: this.el.container.find(this.options.numberInputSelector),
        exp: this.el.container.find(this.options.expInputSelector),
        name: this.el.container.find(this.options.nameInputSelector),
        cvc: this.el.container.find(this.options.cvcInputSelector)
      };
      this._underlyingFormEls.number.bind("change", function(e) {
        _this._inputViews.number.setValue(_this._getUnderlyingValue('number'));
        return _this.render();
      });
      this._underlyingFormEls.exp.bind("change", function(e) {
        _this._inputViews.exp.setValue(_this._getUnderlyingValue('exp'));
        return _this.render();
      });
      this._underlyingFormEls.name.bind("change", function(e) {
        _this._inputViews.exp.setValue(_this._getUnderlyingValue('name'));
        return _this.render();
      });
      this._underlyingFormEls.cvc.bind("change", function(e) {
        _this._inputViews.exp.setValue(_this._getUnderlyingValue('cvc'));
        return _this.render();
      });
      _ref = this.options.initialValues;
      for (fieldName in _ref) {
        fieldValue = _ref[fieldName];
        this._underlyingFormEls[fieldName].val(fieldValue);
      }
      this._validationState = {
        number: this._underlyingFormEls.number.hasClass('invalid'),
        exp: this._underlyingFormEls.exp.hasClass('invalid'),
        name: this._underlyingFormEls.name.hasClass('invalid'),
        cvc: this._underlyingFormEls.cvc.hasClass('invalid')
      };
      this.el.surfaceFront = $("<div>").attr({
        "class": "face front"
      });
      this.el.surfaceBack = $("<div>").attr({
        "class": "face back"
      });
      this.el.cardBody = $("<div>").attr({
        "class": "card-body"
      });
      this.el.container.addClass("skeuocard");
      this.el.surfaceFront.appendTo(this.el.cardBody);
      this.el.surfaceBack.appendTo(this.el.cardBody);
      this.el.cardBody.appendTo(this.el.container);
      this.el.flipTabFront = $("<div class=\"flip-tab front\"><p>" + this.options.strings.hiddenFaceFillPrompt + "</p></div>");
      this.el.surfaceFront.prepend(this.el.flipTabFront);
      this.el.flipTabBack = $("<div class=\"flip-tab back\"><p>" + this.options.strings.hiddenFaceFillPrompt + "</p></div>");
      this.el.surfaceBack.prepend(this.el.flipTabBack);
      this.el.flipTabFront.click(function() {
        return _this.flip();
      });
      this.el.flipTabBack.click(function() {
        return _this.flip();
      });
      return this.el.container;
    };

    Skeuocard.prototype._setAcceptedCardProducts = function() {
      var matcher, product, _ref,
        _this = this;
      if (this.options.acceptedCardProducts.length === 0) {
        this._underlyingFormEls.type.find('option').each(function(i, _el) {
          var cardProductShortname, el;
          el = $(_el);
          cardProductShortname = el.attr('data-card-product-shortname') || el.attr('value');
          return _this.options.acceptedCardProducts.push(cardProductShortname);
        });
      }
      for (matcher in CCProducts) {
        product = CCProducts[matcher];
        if (_ref = product.companyShortname, __indexOf.call(this.options.acceptedCardProducts, _ref) >= 0) {
          this.acceptedCardProducts[matcher] = product;
        }
      }
      return this.acceptedCardProducts;
    };

    Skeuocard.prototype._createInputs = function() {
      var _this = this;
      this._inputViews.number = new this.SegmentedCardNumberInputView();
      this._inputViews.exp = new this.ExpirationInputView();
      this._inputViews.name = new this.TextInputView({
        "class": "cc-name",
        placeholder: "YOUR NAME"
      });
      this._inputViews.cvc = new this.TextInputView({
        "class": "cc-cvc",
        placeholder: "XXX"
      });
      this._inputViews.number.el.addClass('cc-number');
      this._inputViews.number.el.appendTo(this.el.surfaceFront);
      this._inputViews.name.el.appendTo(this.el.surfaceFront);
      this._inputViews.exp.el.addClass('cc-exp');
      this._inputViews.exp.el.appendTo(this.el.surfaceFront);
      this._inputViews.cvc.el.appendTo(this.el.surfaceBack);
      this._inputViews.number.bind("keyup", function(e, input) {
        _this._setUnderlyingValue('number', input.value);
        return _this.render();
      });
      this._inputViews.exp.bind("keyup", function(e, input) {
        _this._setUnderlyingValue('exp', input.value);
        return _this.render();
      });
      this._inputViews.name.bind("keyup", function(e) {
        _this._setUnderlyingValue('name', $(e.target).val());
        return _this.render();
      });
      this._inputViews.cvc.bind("keyup", function(e) {
        _this._setUnderlyingValue('cvc', $(e.target).val());
        return _this.render();
      });
      this._inputViews.number.setValue(this._getUnderlyingValue('number'));
      this._inputViews.exp.setValue(this._getUnderlyingValue('exp'));
      this._inputViews.name.el.val(this._getUnderlyingValue('name'));
      return this._inputViews.cvc.el.val(this._getUnderlyingValue('cvc'));
    };

    Skeuocard.prototype._bindEvents = function() {
      var _this = this;
      this.el.container.bind("productchanged", function(e) {
        return _this.updateLayout();
      });
      return this.el.container.bind("issuerchanged", function(e) {
        return _this.updateLayout();
      });
    };

    Skeuocard.prototype._log = function() {
      var msg;
      msg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if ((typeof console !== "undefined" && console !== null ? console.log : void 0) && !!this.options.debug) {
        if (this.options.debug != null) {
          return console.log.apply(console, ["[skeuocard]"].concat(__slice.call(msg)));
        }
      }
    };

    Skeuocard.prototype.render = function() {
      var container, el, fieldName, inputEl, matchedIssuerIdentifier, matchedProduct, matchedProductIdentifier, number, sel, surfaceName, _ref,
        _this = this;
      number = this._getUnderlyingValue('number');
      matchedProduct = this.getProductForNumber(number);
      matchedProductIdentifier = (matchedProduct != null ? matchedProduct.companyShortname : void 0) || '';
      matchedIssuerIdentifier = (matchedProduct != null ? matchedProduct.issuerShortname : void 0) || '';
      if (this.product !== matchedProductIdentifier || this.issuer !== matchedIssuerIdentifier) {
        this.trigger('productWillChange.skeuocard', [this, this.product, matchedProductIdentifier]);
        if (matchedProduct !== void 0) {
          this._log("Changing product:", matchedProduct);
          this.el.container.removeClass(function(index, css) {
            return (css.match(/\b(product|issuer)-\S+/g) || []).join(' ');
          });
          this.el.container.addClass("product-" + matchedProduct.companyShortname);
          if (matchedProduct.issuerShortname != null) {
            this.el.container.addClass("issuer-" + matchedProduct.issuerShortname);
          }
          this._setUnderlyingCardType(matchedProduct.companyShortname);
          this._inputViews.number.reconfigure({
            groupings: matchedProduct.cardNumberGrouping,
            placeholderChar: this.options.cardNumberPlaceholderChar
          });
          this._inputViews.exp.show();
          this._inputViews.name.show();
          this._inputViews.exp.reconfigure({
            pattern: matchedProduct.expirationFormat
          });
          _ref = matchedProduct.layout;
          for (fieldName in _ref) {
            surfaceName = _ref[fieldName];
            sel = surfaceName === 'front' ? 'surfaceFront' : 'surfaceBack';
            container = this.el[sel];
            inputEl = this._inputViews[fieldName].el;
            if (!(container.has(inputEl).length > 0)) {
              console.log("Moving", inputEl, "=>", container);
              el = this._inputViews[fieldName].el.detach();
              $(el).appendTo(this.el[sel]);
            }
          }
        } else {
          this._inputViews.exp.clear();
          this._inputViews.cvc.clear();
          this._inputViews.exp.hide();
          this._inputViews.name.hide();
          this._inputViews.number.reconfigure({
            groupings: [this.options.genericPlaceholder.length],
            placeholder: this.options.genericPlaceholder
          });
          this.el.container.removeClass(function(index, css) {
            return (css.match(/\bproduct-\S+/g) || []).join(' ');
          });
          this.el.container.removeClass(function(index, css) {
            return (css.match(/\bissuer-\S+/g) || []).join(' ');
          });
        }
        this.trigger('productDidChange.skeuocard', [this, this.product, matchedProductIdentifier]);
        this.product = matchedProductIdentifier;
        this.issuer = matchedIssuerIdentifier;
      }
      this._updateValidationState();
      if (this.visibleFaceIsValid()) {
        this.el.flipTabFront.show();
        return this.el.flipTabFront.addClass('valid-anim');
      } else {
        this.el.flipTabFront.hide();
        return this.el.flipTabFront.removeClass('valid-anim');
      }
    };

    Skeuocard.prototype._updateValidationState = function() {
      var cardValid, cvcValid, expValid, nameValid, _triggerStateChangeEvent;
      _triggerStateChangeEvent = false;
      cardValid = this.isValidLuhn(this._inputViews.number.value) && (this._inputViews.number.maxLength() === this._inputViews.number.value.length);
      expValid = this._inputViews.exp.date && ((this._inputViews.exp.date.getFullYear() === this.options.currentDate.getFullYear() && this._inputViews.exp.date.getMonth() >= this.options.currentDate.getMonth()) || this._inputViews.exp.date.getFullYear() > this.options.currentDate.getFullYear());
      nameValid = this._inputViews.name.el.val().length > 0;
      cvcValid = this._inputViews.cvc.el.val().length > 0;
      if (cardValid !== this._validationState.number) {
        _triggerStateChangeEvent = true;
        if (cardValid) {
          this._inputViews.number.el.removeClass('invalid');
        } else {
          this._inputViews.number.el.addClass('invalid');
        }
      }
      if (expValid !== this._validationState.exp) {
        _triggerStateChangeEvent = true;
        if (expValid) {
          this._inputViews.exp.el.removeClass('invalid');
        } else {
          this._inputViews.exp.el.addClass('invalid');
        }
      }
      if (nameValid !== this._validationState.name) {
        _triggerStateChangeEvent = true;
        if (nameValid) {
          this._inputViews.name.el.removeClass('invalid');
        } else {
          this._inputViews.name.el.addClass('invalid');
        }
      }
      if (cvcValid !== this._validationState.cvc) {
        _triggerStateChangeEvent = true;
        if (cvcValid) {
          this._inputViews.cvc.el.removeClass('invalid');
        } else {
          this._inputViews.cvc.el.addClass('invalid');
        }
      }
      this._validationState.number = cardValid;
      this._validationState.exp = expValid;
      this._validationState.name = nameValid;
      this._validationState.cvc = cvcValid;
      if (_triggerStateChangeEvent) {
        if (!this.isValid()) {
          this.el.container.addClass('invalid');
        } else {
          this.el.container.removeClass('invalid');
        }
        return this.trigger('validationStateDidChange.skeuocard', [this, this._validationState]);
      }
    };

    Skeuocard.prototype.visibleFaceIsValid = function() {
      var sel;
      sel = this.visibleFace === 'front' ? 'surfaceFront' : 'surfaceBack';
      return this.el[sel].find('.invalid').length === 0;
    };

    Skeuocard.prototype.isValid = function() {
      return this._validationState.number && this._validationState.exp && this._validationState.name && this._validationState.cvc;
    };

    Skeuocard.prototype._getUnderlyingValue = function(field) {
      return this._underlyingFormEls[field].val();
    };

    Skeuocard.prototype._setUnderlyingValue = function(field, newValue) {
      this.trigger('change.skeuocard', [this]);
      return this._underlyingFormEls[field].val(newValue);
    };

    Skeuocard.prototype.flip = function() {
      if (this.visibleFace === 'front') {
        this.trigger('faceWillBecomeVisible.skeuocard', [this, 'back']);
        this.el.cardBody.addClass('flip');
        this.visibleFace = 'back';
        return this.trigger('faceDidBecomeVisible.skeuocard', [this, 'back']);
      } else {
        this.trigger('faceWillBecomeVisible.skeuocard', [this, 'front']);
        this.el.cardBody.removeClass('flip');
        this.visibleFace = 'front';
        return this.trigger('faceDidBecomeVisible.skeuocard', [this, 'front']);
      }
    };

    Skeuocard.prototype.getProductForNumber = function(num) {
      var d, issuer, m, matcher, parts, _ref;
      _ref = this.acceptedCardProducts;
      for (m in _ref) {
        d = _ref[m];
        parts = m.split('/');
        matcher = new RegExp(parts[1], parts[2]);
        if (matcher.test(num)) {
          issuer = this.getIssuerForNumber(num) || {};
          return $.extend({}, d, issuer);
        }
      }
      return void 0;
    };

    Skeuocard.prototype.getIssuerForNumber = function(num) {
      var d, m, matcher, parts;
      for (m in CCIssuers) {
        d = CCIssuers[m];
        parts = m.split('/');
        matcher = new RegExp(parts[1], parts[2]);
        if (matcher.test(num)) {
          return d;
        }
      }
      return void 0;
    };

    Skeuocard.prototype.isValidLuhn = function(identifier) {
      var alt, i, num, sum, _i, _ref;
      sum = 0;
      alt = false;
      for (i = _i = _ref = identifier.length - 1; _i >= 0; i = _i += -1) {
        num = parseInt(identifier.charAt(i), 10);
        if (isNaN(num)) {
          return false;
        }
        if (alt) {
          num *= 2;
          if (num > 9) {
            num = (num % 10) + 1;
          }
        }
        alt = !alt;
        sum += num;
      }
      return sum % 10 === 0;
    };

    Skeuocard.prototype._setUnderlyingCardType = function(shortname) {
      var _this = this;
      return this._underlyingFormEls.type.find('option').each(function(i, _el) {
        var el;
        el = $(_el);
        if (shortname === (el.attr('data-card-product-shortname') || el.attr('value'))) {
          return el.val(el.attr('value'));
        }
      });
    };

    Skeuocard.prototype.trigger = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el.container).trigger.apply(_ref, args);
    };

    Skeuocard.prototype.bind = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el.container).trigger.apply(_ref, args);
    };

    return Skeuocard;

  })();

  Skeuocard.prototype.TextInputView = (function() {

    function TextInputView() {}

    TextInputView.prototype.bind = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el).bind.apply(_ref, args);
    };

    TextInputView.prototype.trigger = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el).trigger.apply(_ref, args);
    };

    TextInputView.prototype._getFieldCaretPosition = function(el) {
      var input, sel, selLength;
      input = el.get(0);
      if (input.selectionEnd != null) {
        return input.selectionEnd;
      } else if (document.selection) {
        input.focus();
        sel = document.selection.createRange();
        selLength = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        return selLength;
      }
    };

    TextInputView.prototype._setFieldCaretPosition = function(el, pos) {
      var input, range;
      input = el.get(0);
      if (input.createTextRange != null) {
        range = input.createTextRange();
        range.move("character", pos);
        return range.select();
      } else if (input.selectionStart != null) {
        input.focus();
        return input.setSelectionRange(pos, pos);
      }
    };

    TextInputView.prototype.show = function() {
      return this.el.show();
    };

    TextInputView.prototype.hide = function() {
      return this.el.hide();
    };

    TextInputView.prototype._zeroPadNumber = function(num, places) {
      var zero;
      zero = places - num.toString().length + 1;
      return Array(zero).join("0") + num;
    };

    return TextInputView;

  })();

  Skeuocard.prototype.SegmentedCardNumberInputView = (function(_super) {

    __extends(SegmentedCardNumberInputView, _super);

    function SegmentedCardNumberInputView(opts) {
      var _this = this;
      if (opts == null) {
        opts = {};
      }
      opts.value || (opts.value = "");
      opts.groupings || (opts.groupings = [19]);
      opts.placeholderChar || (opts.placeholderChar = "X");
      this.options = opts;
      this.value = this.options.value;
      this.el = $("<fieldset>");
      this.el.delegate("input", "keydown", function(e) {
        return _this._onGroupKeyDown(e);
      });
      this.el.delegate("input", "keyup", function(e) {
        return _this._onGroupKeyUp(e);
      });
      this.groupEls = $();
    }

    SegmentedCardNumberInputView.prototype._onGroupKeyDown = function(e) {
      var arrowKeys, groupCaretPos, groupEl, groupMaxLength, _ref;
      e.stopPropagation();
      groupEl = $(e.currentTarget);
      arrowKeys = [37, 38, 39, 40];
      groupEl = $(e.currentTarget);
      groupMaxLength = parseInt(groupEl.attr('maxlength'));
      groupCaretPos = this._getFieldCaretPosition(groupEl);
      if (e.which === 8 && groupCaretPos === 0 && !$.isEmptyObject(groupEl.prev())) {
        groupEl.prev().focus();
      }
      if (_ref = e.which, __indexOf.call(arrowKeys, _ref) >= 0) {
        switch (e.which) {
          case 37:
            if (groupCaretPos === 0 && !$.isEmptyObject(groupEl.prev())) {
              return groupEl.prev().focus();
            }
            break;
          case 39:
            if (groupCaretPos === groupMaxLength && !$.isEmptyObject(groupEl.next())) {
              return groupEl.next().focus();
            }
            break;
          case 38:
            if (!$.isEmptyObject(groupEl.prev())) {
              return groupEl.prev().focus();
            }
            break;
          case 40:
            if (!$.isEmptyObject(groupEl.next())) {
              return groupEl.next().focus();
            }
        }
      }
    };

    SegmentedCardNumberInputView.prototype._onGroupKeyUp = function(e) {
      var groupCaretPos, groupEl, groupMaxLength, groupValLength, newValue, pattern, specialKeys, _ref, _ref1;
      e.stopPropagation();
      specialKeys = [8, 9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 93, 144, 145, 224];
      groupEl = $(e.currentTarget);
      groupMaxLength = parseInt(groupEl.attr('maxlength'));
      groupCaretPos = this._getFieldCaretPosition(groupEl);
      if (_ref = e.which, __indexOf.call(specialKeys, _ref) < 0) {
        groupValLength = groupEl.val().length;
        pattern = new RegExp('[^0-9]+', 'g');
        groupEl.val(groupEl.val().replace(pattern, ''));
        if (groupEl.val().length < groupValLength) {
          this._setFieldCaretPosition(groupEl, groupCaretPos - 1);
        } else {
          this._setFieldCaretPosition(groupEl, groupCaretPos);
        }
      }
      if ((_ref1 = e.which, __indexOf.call(specialKeys, _ref1) < 0) && groupEl.val().length === groupMaxLength && !$.isEmptyObject(groupEl.next()) && this._getFieldCaretPosition(groupEl) === groupMaxLength) {
        groupEl.next().focus();
      }
      newValue = "";
      this.groupEls.each(function() {
        return newValue += $(this).val();
      });
      this.value = newValue;
      this.trigger("keyup", [this]);
      return false;
    };

    SegmentedCardNumberInputView.prototype.setGroupings = function(groupings) {
      var caretPos, groupEl, groupLength, _i, _len, _startLength;
      caretPos = this._caretPosition();
      this.el.empty();
      _startLength = 0;
      for (_i = 0, _len = groupings.length; _i < _len; _i++) {
        groupLength = groupings[_i];
        groupEl = $("<input>").attr({
          type: 'text',
          size: groupLength,
          maxlength: groupLength,
          "class": "group" + groupLength
        });
        if (this.value.length > _startLength) {
          groupEl.val(this.value.substr(_startLength, groupLength));
          _startLength += groupLength;
        }
        this.el.append(groupEl);
      }
      this.options.groupings = groupings;
      this.groupEls = this.el.find("input");
      this._caretTo(caretPos);
      if (this.options.placeholderChar !== void 0) {
        this.setPlaceholderChar(this.options.placeholderChar);
      }
      if (this.options.placeholder !== void 0) {
        return this.setPlaceholder(this.options.placeholder);
      }
    };

    SegmentedCardNumberInputView.prototype.setPlaceholderChar = function(ch) {
      this.groupEls.each(function() {
        var el;
        el = $(this);
        return el.attr('placeholder', new Array(parseInt(el.attr('maxlength')) + 1).join(ch));
      });
      this.options.placeholder = void 0;
      return this.options.placeholderChar = ch;
    };

    SegmentedCardNumberInputView.prototype.setPlaceholder = function(str) {
      this.groupEls.each(function() {
        return $(this).attr('placeholder', str);
      });
      this.options.placeholderChar = void 0;
      return this.options.placeholder = str;
    };

    SegmentedCardNumberInputView.prototype.setValue = function(newValue) {
      var lastPos;
      lastPos = 0;
      this.groupEls.each(function() {
        var el, len;
        el = $(this);
        len = parseInt(el.attr('maxlength'));
        el.val(newValue.substr(lastPos, len));
        return lastPos += len;
      });
      return this.value = newValue;
    };

    SegmentedCardNumberInputView.prototype.getValue = function() {
      return this.value;
    };

    SegmentedCardNumberInputView.prototype.reconfigure = function(changes) {
      if (changes == null) {
        changes = {};
      }
      if (changes.groupings != null) {
        this.setGroupings(changes.groupings);
      }
      if (changes.placeholderChar != null) {
        this.setPlaceholderChar(changes.placeholderChar);
      }
      if (changes.placeholder != null) {
        this.setPlaceholder(changes.placeholder);
      }
      if (changes.value != null) {
        return this.setValue(changes.value);
      }
    };

    SegmentedCardNumberInputView.prototype._caretTo = function(index) {
      var inputEl, inputElIndex, pos,
        _this = this;
      pos = 0;
      inputEl = void 0;
      inputElIndex = 0;
      this.groupEls.each(function(i, e) {
        var el, elLength;
        el = $(e);
        elLength = parseInt(el.attr('maxlength'));
        if (index <= elLength + pos && index >= pos) {
          inputEl = el;
          inputElIndex = index - pos;
        }
        return pos += elLength;
      });
      return this._setFieldCaretPosition(inputEl, inputElIndex);
    };

    SegmentedCardNumberInputView.prototype._caretPosition = function() {
      var finalPos, iPos,
        _this = this;
      iPos = 0;
      finalPos = 0;
      this.groupEls.each(function(i, e) {
        var el;
        el = $(e);
        if (el.is(':focus')) {
          finalPos = iPos + _this._getFieldCaretPosition(el);
        }
        return iPos += parseInt(el.attr('maxlength'));
      });
      return finalPos;
    };

    SegmentedCardNumberInputView.prototype.maxLength = function() {
      return this.options.groupings.reduce(function(a, b) {
        return a + b;
      });
    };

    return SegmentedCardNumberInputView;

  })(Skeuocard.prototype.TextInputView);

  Skeuocard.prototype.ExpirationInputView = (function(_super) {

    __extends(ExpirationInputView, _super);

    function ExpirationInputView(opts) {
      var _this = this;
      if (opts == null) {
        opts = {};
      }
      opts.dateFormatter || (opts.dateFormatter = function(date) {
        return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
      });
      opts.dateParser || (opts.dateParser = function(value) {
        var dateParts;
        dateParts = value.split('-');
        return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
      });
      opts.pattern || (opts.pattern = "MM/YY");
      this.options = opts;
      this.date = void 0;
      this.value = void 0;
      this.el = $("<fieldset>");
      this.el.delegate("input", "keydown", function(e) {
        return _this._onKeyDown(e);
      });
      this.el.delegate("input", "keyup", function(e) {
        return _this._onKeyUp(e);
      });
    }

    ExpirationInputView.prototype._getFieldCaretPosition = function(el) {
      var input, sel, selLength;
      input = el.get(0);
      if (input.selectionEnd != null) {
        return input.selectionEnd;
      } else if (document.selection) {
        input.focus();
        sel = document.selection.createRange();
        selLength = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        return selLength;
      }
    };

    ExpirationInputView.prototype._setFieldCaretPosition = function(el, pos) {
      var input, range;
      input = el.get(0);
      if (input.createTextRange != null) {
        range = input.createTextRange();
        range.move("character", pos);
        return range.select();
      } else if (input.selectionStart != null) {
        input.focus();
        return input.setSelectionRange(pos, pos);
      }
    };

    ExpirationInputView.prototype.setPattern = function(pattern) {
      var char, groupings, i, patternParts, _currentLength, _i, _len;
      groupings = [];
      patternParts = pattern.split('');
      _currentLength = 0;
      for (i = _i = 0, _len = patternParts.length; _i < _len; i = ++_i) {
        char = patternParts[i];
        _currentLength++;
        if (patternParts[i + 1] !== char) {
          groupings.push([_currentLength, char]);
          _currentLength = 0;
        }
      }
      this.options.groupings = groupings;
      return this._setGroupings(this.options.groupings);
    };

    ExpirationInputView.prototype._setGroupings = function(groupings) {
      var fieldChars, group, groupChar, groupLength, input, sep, _i, _len, _startLength;
      fieldChars = ['D', 'M', 'Y'];
      this.el.empty();
      _startLength = 0;
      for (_i = 0, _len = groupings.length; _i < _len; _i++) {
        group = groupings[_i];
        groupLength = group[0];
        groupChar = group[1];
        if (__indexOf.call(fieldChars, groupChar) >= 0) {
          input = $('<input>').attr({
            type: 'text',
            placeholder: new Array(groupLength + 1).join(groupChar),
            maxlength: groupLength,
            "class": 'cc-exp-field-' + groupChar.toLowerCase() + ' group' + groupLength
          });
          input.data('fieldtype', groupChar);
          this.el.append(input);
        } else {
          sep = $('<span>').attr({
            "class": 'separator'
          });
          sep.html(new Array(groupLength + 1).join(groupChar));
          this.el.append(sep);
        }
      }
      this.groupEls = this.el.find('input');
      if (this.date != null) {
        return this._updateFieldValues();
      }
    };

    ExpirationInputView.prototype._updateFieldValues = function() {
      var currentDate,
        _this = this;
      currentDate = this.date;
      if (!this.groupEls) {
        return this.setPattern(this.options.pattern);
      }
      return this.groupEls.each(function(i, _el) {
        var el, groupLength, year;
        el = $(_el);
        groupLength = parseInt(el.attr('maxlength'));
        switch (el.data('fieldtype')) {
          case 'M':
            return el.val(_this._zeroPadNumber(currentDate.getMonth() + 1, groupLength));
          case 'D':
            return el.val(_this._zeroPadNumber(currentDate.getDate(), groupLength));
          case 'Y':
            year = groupLength >= 4 ? currentDate.getFullYear() : currentDate.getFullYear().toString().substr(2, 4);
            return el.val(year);
        }
      });
    };

    ExpirationInputView.prototype.clear = function() {
      this.value = "";
      this.date = null;
      return this.groupEls.each(function() {
        return $(this).val('');
      });
    };

    ExpirationInputView.prototype.setDate = function(newDate) {
      this.date = newDate;
      this.value = this.options.dateFormatter(newDate);
      return this._updateFieldValues();
    };

    ExpirationInputView.prototype.setValue = function(newValue) {
      this.value = newValue;
      this.date = this.options.dateParser(newValue);
      return this._updateFieldValues();
    };

    ExpirationInputView.prototype.getDate = function() {
      return this.date;
    };

    ExpirationInputView.prototype.getValue = function() {
      return this.value;
    };

    ExpirationInputView.prototype.reconfigure = function(opts) {
      if (opts.pattern != null) {
        this.setPattern(opts.pattern);
      }
      if (opts.value != null) {
        return this.setValue(opts.value);
      }
    };

    ExpirationInputView.prototype._onKeyDown = function(e) {
      var groupCaretPos, groupEl, groupMaxLength, nextInputEl, prevInputEl, _ref;
      e.stopPropagation();
      groupEl = $(e.currentTarget);
      groupEl = $(e.currentTarget);
      groupMaxLength = parseInt(groupEl.attr('maxlength'));
      groupCaretPos = this._getFieldCaretPosition(groupEl);
      prevInputEl = groupEl.prevAll('input').first();
      nextInputEl = groupEl.nextAll('input').first();
      if (e.which === 8 && groupCaretPos === 0 && !$.isEmptyObject(prevInputEl)) {
        prevInputEl.focus();
      }
      if ((_ref = e.which) === 37 || _ref === 38 || _ref === 39 || _ref === 40) {
        switch (e.which) {
          case 37:
            if (groupCaretPos === 0 && !$.isEmptyObject(prevInputEl)) {
              return prevInputEl.focus();
            }
            break;
          case 39:
            if (groupCaretPos === groupMaxLength && !$.isEmptyObject(nextInputEl)) {
              return nextInputEl.focus();
            }
            break;
          case 38:
            if (!$.isEmptyObject(groupEl.prev('input'))) {
              return prevInputEl.focus();
            }
            break;
          case 40:
            if (!$.isEmptyObject(groupEl.next('input'))) {
              return nextInputEl.focus();
            }
        }
      }
    };

    ExpirationInputView.prototype._onKeyUp = function(e) {
      var arrowKeys, dateObj, day, groupCaretPos, groupEl, groupMaxLength, groupValLength, month, nextInputEl, pattern, specialKeys, year, _ref, _ref1;
      e.stopPropagation();
      specialKeys = [8, 9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 93, 144, 145, 224];
      arrowKeys = [37, 38, 39, 40];
      groupEl = $(e.currentTarget);
      groupMaxLength = parseInt(groupEl.attr('maxlength'));
      groupCaretPos = this._getFieldCaretPosition(groupEl);
      if (_ref = e.which, __indexOf.call(specialKeys, _ref) < 0) {
        groupValLength = groupEl.val().length;
        pattern = new RegExp('[^0-9]+', 'g');
        groupEl.val(groupEl.val().replace(pattern, ''));
        if (groupEl.val().length < groupValLength) {
          this._setFieldCaretPosition(groupEl, groupCaretPos - 1);
        } else {
          this._setFieldCaretPosition(groupEl, groupCaretPos);
        }
      }
      nextInputEl = groupEl.nextAll('input').first();
      if ((_ref1 = e.which, __indexOf.call(specialKeys, _ref1) < 0) && groupEl.val().length === groupMaxLength && !$.isEmptyObject(nextInputEl) && this._getFieldCaretPosition(groupEl) === groupMaxLength) {
        nextInputEl.focus();
      }
      day = parseInt(this.el.find('.cc-exp-field-d').val()) || 1;
      month = parseInt(this.el.find('.cc-exp-field-m').val());
      year = parseInt(this.el.find('.cc-exp-field-y').val());
      if (month === 0 || year === 0) {
        this.value = "";
        this.date = null;
      } else {
        if (year < 2000) {
          year += 2000;
        }
        dateObj = new Date(year, month - 1, day);
        this.value = this.options.dateFormatter(dateObj);
        this.date = dateObj;
      }
      this.trigger("keyup", [this]);
      return false;
    };

    ExpirationInputView.prototype._inputGroupEls = function() {
      return this.el.find("input");
    };

    return ExpirationInputView;

  })(Skeuocard.prototype.TextInputView);

  Skeuocard.prototype.TextInputView = (function(_super) {

    __extends(TextInputView, _super);

    function TextInputView(opts) {
      this.el = $("<input>").attr($.extend({
        type: 'text'
      }, opts));
    }

    TextInputView.prototype.clear = function() {
      return this.el.val("");
    };

    return TextInputView;

  })(Skeuocard.prototype.TextInputView);

  window.Skeuocard = Skeuocard;

}).call(this);
