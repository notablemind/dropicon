
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("dropicon/index.js", Function("exports, require, module",
"/** @jsx React.DOM */\n\
\n\
var Text = React.createClass({displayName: 'Text',\n\
  render: function () {\n\
    return React.DOM.div( {className:\"text-item\", onClick:this.props.onSelect}, this.props.value)\n\
  }\n\
})\n\
\n\
var DropIcon = module.exports = React.createClass({\n\
  getDefaultProps: function () {\n\
    return {\n\
      value: 'one',\n\
      onChange: function () {},\n\
      options: ['one', 'two', 'three'],\n\
      view: Text,\n\
      setOpen: false,\n\
\n\
      className: '',\n\
      showSelected: false,\n\
    }\n\
  },\n\
  getInitialState: function () {\n\
    return {open: this.props.setOpen}\n\
  },\n\
  componentWillReceiveProps: function (props) {\n\
    if (props.setOpen && !this.state.open) {\n\
      this.setState({open: true})\n\
    }\n\
  },\n\
  open: function () {\n\
    this.setState({open: true})\n\
  },\n\
  toggle: function () {\n\
    this.setState({open: !this.state.open})\n\
  },\n\
  close: function (e) {\n\
    if (e && e.suppressed) return\n\
    this.setState({open: false})\n\
  },\n\
  componentDidUpdate: function () {\n\
    if (this.state.open) {\n\
      document.addEventListener('mousedown', this.close)\n\
    } else {\n\
      document.removeEventListener('mousedown', this.close)\n\
    }\n\
  },\n\
  componentDidMount: function () {\n\
    if (this.state.open) {\n\
      document.addEventListener('mousedown', this.close)\n\
    } else {\n\
      document.removeEventListener('mousedown', this.close)\n\
    }\n\
  },\n\
  change: function (value) {\n\
    this.props.onChange(value)\n\
    this.close()\n\
  },\n\
  suppressMouseDown: function (e) {\n\
    e.preventDefault()\n\
    e.stopPropagation()\n\
    e.nativeEvent.stopPropagation()\n\
    e.nativeEvent.suppressed = true\n\
    return false\n\
  },\n\
  render: function () {\n\
    return (\n\
      React.DOM.div( {className:'dropicon ' + this.props.className + (this.state.open ? ' open' : ''),  onMouseDown:this.suppressMouseDown}, \n\
        React.DOM.div( {className:\"head\"}, \n\
          this.props.view({value: this.props.value, onSelect: this.toggle})\n\
        ),\n\
        React.DOM.ul( {className:\"list\"}, \n\
          \n\
            this.props.options.map(function (value) {\n\
              if (value === this.props.value && !this.props.showSelected) return false\n\
              return (\n\
                React.DOM.li( {className:'item ' + (value === this.props.value ?  'selected' : '')}, \n\
                  \n\
                    this.props.view({value: value, onSelect: this.change.bind(null, value)})\n\
                  \n\
                )\n\
              )\n\
            }.bind(this))\n\
          \n\
        )\n\
      )\n\
    )\n\
  },\n\
})\n\
//@ sourceURL=dropicon/index.js"
));
require.alias("dropicon/index.js", "dropicon/index.js");