'use strict';

/**
 * Foundation plugin
 * Based on foundation Maggelan plugin
 * for changing hash while scrolling
 * Each method contatin DIFFERENCE with original Maggelan in description
 */

function _instanceof(left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

!function ($) {
  /**
   * MaggelanHash module.
   * @module foundation.magellanhash
   */
  var MaggelanHash =
    /*#__PURE__*/
    function () {
      /**
       * Creates a new instance of MaggelanHash.
       * DIFFERENCE: same as original Maggelan
       * @class
       * @fires MaggelanHash#init
       * @param {Object} element - jQuery object to add the trigger to.
       * @param {Object} options - Overrides to the default plugin settings.
       */
      function MaggelanHash(element, options) {
        _classCallCheck(this, MaggelanHash);

        this.$element = element;
        this.options = $.extend({}, MaggelanHash.defaults, this.$element.data(), options);

        this._init();

        Foundation.registerPlugin(this, 'MaggelanHash');
      }

      /**
       * Initializes the MaggelanHash plugin and calls functions to get equalizer functioning on load.
       * DIFFERENCE: no need in $links array with a to change style on scrolling
       * @private
       */


      _createClass(MaggelanHash, [{
        key: "_init",
        value: function _init() {
          var id = this.$element[0].id || Foundation.GetYoDigits(6, 'magellanhash');

          var _this = this;

          this.$targets = $('[data-magellanhash-target]');
          this.$element.attr({
            'data-resize': id,
            'data-scroll': id,
            'id': id
          });
          this.$active = $();
          this.scrollPos = parseInt(window.pageYOffset, 10);
          this.isScrolling = false;
          this.calcPoints();

          this._events();
        }
        /**
         * Calculates an array of pixel values that are the demarcation lines between locations on the page.
         * Can be invoked if new elements are added or the size of a location changes.
         * DIFFERENCE: same as original Maggelan
         * @function
         */

      }, {
        key: "calcPoints",
        value: function calcPoints() {
          var _this = this,
            body = document.body,
            html = document.documentElement;

          this.points = [];
          this.winHeight = Math.round(Math.max(window.innerHeight, html.clientHeight));
          this.docHeight = Math.round(Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight));
          this.$targets.each(function () {
            var $tar = $(this),
              pt = Math.round($tar.offset().top - _this.options.threshold);
            $tar.targetPoint = pt;

            _this.points.push(pt);
          });
        }
        /**
         * Initializes events for MaggelanHash.
         * DIFFERENCE: no scroll to loc on window load, this should be handeled by plugin user
         * @private
         */

      }, {
        key: "_events",
        value: function _events() {
          var _this = this,
            $body = $('html, body'),
            opts = {
              duration: _this.options.animationDuration,
              easing: _this.options.animationEasing
            };

          this.$element.on({
            'resizeme.zf.trigger': this.reflow.bind(this),
            'scrollme.zf.trigger': this._updateActive.bind(this)
          });
        }
        /**
         * Function to scroll to a given location on the page.
         * DIFFERENCE: callback on finish + recalculating on each step
         * @param {String} loc - a properly formatted jQuery id selector. Example: '#foo'
         * @function
         */

      }, {
        key: "scrollToLoc",
        value: function scrollToLoc(loc) {
          var _this2 = this;

          var $loc = $(loc);
          var optOffset = this.options.threshold / 2 + this.options.barOffset;
          var scrollPos = Math.round($loc.offset().top - optOffset);
          $('html, body').stop(true).animate({
            scrollTop: scrollPos
          }, {
            duration: this.options.animationDuration,
            easing: this.options.animationEasing,
            step: function step(now, fx) {
              fx.end = Math.round($loc.offset().top - optOffset);
            }
          }).promise().always(function () {
            _this2.options.onScrollFinished(loc);
          });
        }
        /*
         * DIFFERENCE: Kind of mutex functions to lock chaging hash on scrolling
         */

      }, {
        key: "mutexScrollLock",
        value: function mutexScrollLock() {
          this.isScrolling = true;
        }
      }, {
        key: "mutexScrollUnlock",
        value: function mutexScrollUnlock() {
          this.isScrolling = false;
        }
      }, {
        key: "mutexScrollLocked",
        value: function mutexScrollLocked() {
          return this.isScrolling;
        }
        /**
         * Calls necessary functions to update MaggelanHash upon DOM change
         * DIFFERENCE: recalculating
         * @function
         */

      }, {
        key: "reflow",
        value: function reflow() {
          if (this.mutexScrollLocked()) return;
          this.$targets = $('[data-magellanhash-target]');
          this.calcPoints();

          this._updateActive();
        }
        /**
         * Updates the visibility of an active location link, and updates the url hash for the page, if deepLinking enabled.
         * DIFFERENCE: deepLinking calls callback to handle history changes
         * @private
         * @function
         * @fires MaggelanHash#update
         */

      }, {
        key: "_updateActive",
        value: function _updateActive()
          /*evt, elem, scrollPos*/ {
          if (this.mutexScrollLocked()) return;
          var winPos =
              /*scrollPos ||*/
              parseInt(window.pageYOffset, 10),
            curIdx;

          if (winPos + this.winHeight === this.docHeight) {
            curIdx = this.points.length - 1;
          } else if (winPos < this.points[0]) {
            curIdx = -1;
          } else {
            var isDown = this.scrollPos < winPos,
              _this = this,
              curVisible = this.points.filter(function (p, i) {
                return isDown ? p <= winPos : p - _this.options.threshold <= winPos; //&& winPos >= _this.points[i -1] - _this.options.threshold;
              });

            curIdx = curVisible.length ? curVisible.length - 1 : 0;
          }

          this.$active.removeClass(this.options.activeClass);
          this.scrollPos = winPos;

          if (curIdx >= 0) {
            this.$active = this.$targets.eq(curIdx).addClass(this.options.activeClass);

            if (this.options.deepLinking) {
              this.options.updateUrl(this.$active);
            }
          } else {
            this.$active = $();
            this.options.updateUrl(null);
          }
          /**
           * Fires when magellanhash is finished updating to the new active element.
           * DIFFERENCE: no need in this
           * @event MaggelanHash#update
           */
          //this.$element.trigger('update.zf.magellanhash', [this.$active]);

        }
        /**
         * Destroys an instance of MaggelanHash and resets the url of the window.
         * DIFFERENCE: removed url update
         * @function
         */

      }, {
        key: "destroy",
        value: function destroy() {
          this.$element.off('.zf.trigger .zf.magellanhash').find(".".concat(this.options.activeClass)).removeClass(this.options.activeClass);
          Foundation.unregisterPlugin(this);
        }
      }]);

      return MaggelanHash;
    }();
  /**
   * Default settings for plugin
   * DIFFERENCE: updateUrl and onScrollFinished callbacks
   */


  MaggelanHash.defaults = {
    /**
     * Amount of time, in ms, the animated scrolling should take between locations.
     * @option
     * @example 500
     */
    animationDuration: 500,

    /**
     * Animation style to use when scrolling between locations.
     * @option
     * @example 'ease-in-out'
     */
    animationEasing: 'linear',

    /**
     * Number of pixels to use as a marker for location changes.
     * @option
     * @example 50
     */
    threshold: 50,

    /**
     * Class applied to the active locations link on the magellanhash container.
     * @option
     * @example 'active'
     */
    activeClass: 'active',

    /**
     * Allows the script to manipulate the url of the current page, and if supported, alter the history.
     * @option
     * @example true
     */
    deepLinking: false,

    /**
     * Callback to function where url will be updated
     * @option
     * @example
     */
    updateUrl: null,

    /**
     * Callback to function on scroll finished
     * @option
     * @example
     */
    onScrollFinished: null,

    /**
     * Number of pixels to offset the scroll of the page on item click if using a sticky nav bar.
     * @option
     * @example 25
     */
    barOffset: 0
  }; // Window exports

  Foundation.plugin(MaggelanHash, 'MaggelanHash');
}(jQuery);
