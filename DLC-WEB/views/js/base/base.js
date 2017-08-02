var NAMESPACE = 'DLC'
if(typeof Object.create !== "function"){
	Object.create = function(o){
		function F(){};
		F.prototype = o;
		return new F();
	}
}
if (!Object.keys) {
  Object.keys = (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

      var result = [];

      for (var prop in obj) {
        if (hasOwnProperty.call(obj, prop)) result.push(prop);
      }

      if (hasDontEnumBug) {
        for (var i=0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
        }
      }
      return result;
    }
  })()
};

// 去除 Object.definePropertie(s) 所以不支持 '_property' ----  commend by Jerry

(function (global){
	(function(){
		var base = global[NAMESPACE] = Object.create(Object.prototype);
		function initMembers(obj, options) {
            var keys = Object.keys(options);
            var len = keys.length;
            var properties = len ? {} : null;
            while (len) {
                len--;
                var key = keys[len], isprivate = !key.indexOf("_"), member = options[key];
                // if ((member && typeof member === 'object') && (member.value !== undefined || typeof member.get === 'function' || typeof member.set === 'function')) {
                //     if (typeof member.enumerable != "boolean") {
                //         member.enumerable = isprivate;
                //     }
                //     properties[key] = member;
                // } else if (!isprivate) {
                //     properties[key] = { value: member, enumerable: isprivate, configurable: true, writable: true };
                // } else {
                //     obj[key] = member;
                // }
                obj[key] = member;
            }
            // if (properties) {
            //     Object.defineProperties(obj, properties);
            // }
            // debugger;
        };
		function def(options, statics){
			var constructor = getConstructor(options.constructor);
			if(options){
				initMembers(constructor.prototype, options)
			}
			if (statics) {
                initMembers(constructor, statics);
            }
			return constructor;
		}
		var baseInit = function (options) {
			options = options || {};
			for (var p in options) {
				this[p] = options[p];
			}
		};
		var getConstructor = function () {
			return function () {
				// var _baseInit = this._baseInit || baseInit;
				// _baseInit.apply(this, arguments);
				if (this.create) {
					this.create.apply(this, arguments);
				}
			};
		};
		var initInherice = function (base, options) {
            if (base && options) {
                var keys = Object.keys(options);
                var len = keys.length;
                while (len) {
                    len--;
                    var key = keys[len], isprivate = !key.indexOf("_"), member = options[key];
                    if (member && !isprivate && typeof member === "function") {
                        member._inherited = base[key];
                    }
                }
            }
        };
        var inherited = function (args, newArgs) {
            if (args.callee._inherited) {
                return args.callee._inherited.apply(this, newArgs || args);
            }
        };
		base.derive=function(base, options, statics){
			if(base){
				var constructor = getConstructor();
                var basePrototype = base.prototype;
                var baseInstance = Object.create(basePrototype);
                constructor.prototype = baseInstance;
                // debugger;
                // Object.defineProperty(baseInstance, "base", { value: basePrototype });
                baseInstance['base'] = basePrototype;
                // Object.defineProperty(baseInstance, "inherited", { value: inherited, writable: false, enumerable: false });
                baseInstance['inherited'] = inherited;
                initInherice(baseInstance.base, options);
                // Object.defineProperty(baseInstance, "constructor", { value: constructor });
                baseInstance['constructor'] = constructor;
                if (options) {
                    initMembers(baseInstance, options);
                }
                if (statics) {
                    initMembers(constructor, statics);
                }
                return constructor;
			}else{
				return def(options, statics)
			}
		}
	})()
})(window)
