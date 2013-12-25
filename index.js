
var d = React.DOM
  , keys = require('keys')

var Text = React.createClass({displayName: 'Text',
  render: function () {
    return d.div( {className:"text-item", onClick:this.props.onSelect}, this.props.value)
  }
})

var DropIcon = module.exports = React.createClass({
  getDefaultProps: function () {
    return {
      value: 'one',
      onChange: function () {},
      options: ['one', 'two', 'three'],
      view: Text,
      headView: false,
      setOpen: false,

      className: '',
      showSelected: false,
    }
  },
  getInitialState: function () {
    return {
      open: this.props.setOpen,
      focused: false,
      active: false
    }
  },
  componentWillReceiveProps: function (props) {
    if (props.setOpen && !this.state.open) {
      this.setState({open: true, focused: false})
    }
  },
  open: function () {
    var focused = 0
    if (this.props.showSelected) focused = this.props.options.indexOf(this.props.value)
    else if (this.props.options[0] === this.props.value) focused = 1
    this.setState({
      focused: focused,
      open: true
    })
  },
  toggle: function () {
    if (!this.state.open) return this.open()
    this.setState({open: false})
  },
  close: function (e) {
    if (e && e.suppressed) return
    this.setState({open: false})
  },
  onOpen: function () {
    document.addEventListener('mousedown', this.close)
    var n = this.getDOMNode()
    if (n !== document.activeElement) n.focus()
  },
  componentDidUpdate: function () {
    if (this.state.open) {
      this.onOpen()
    } else {
      document.removeEventListener('mousedown', this.close)
    }
  },
  componentDidMount: function () {
    this.getDOMNode().setAttribute('tabindex', 0)
    if (this.state.open) {
      this.onOpen()
    } else {
      document.removeEventListener('mousedown', this.close)
    }
  },
  change: function (value) {
    this.props.onChange(value)
    this.close()
  },
  focus: function () {
    this.setState({open: true})
  },
  keySelect: function () {
    if (this.state.focused !== false) {
      this.props.onChange(this.props.options[this.state.focused])
    }
    this.setState({
      open: false,
    })
  },
  keys: {
    'space': function () {
      if (this.state.open) {
        this.keySelect()
      } else {
        this.open()
      }
    },
    'return': function () {
      if (this.state.open) {
        this.keySelect()
      } else {
        this.open()
      }
    },
    'escape': function () {
      this.setState({open: false})
    },
    'tab': function () {
      this.setState({open: false})
      if (this.props.onNext) this.props.onNext()
    },
    'shift tab': function () {
      this.setState({open: false})
      if (this.props.onPrev) this.props.onPrev()
    },
    'up': function () {
      var focused = this.state.focused - 1
      if (focused < 0) focused = 0
      if (this.props.options[focused] === this.props.value && !this.props.showSelected) {
        if (focused > 0) {
          focused -= 1
        } else {
          focused += 1
        }
      }
      this.setState({focused: focused})
    },
    'down': function () {
      var focused = this.state.focused + 1
      if (focused >= this.props.options.length) {
        focused -= 1
      }
      if (this.props.options[focused] === this.props.value && !this.props.showSelected) {
        if (focused === this.props.options.length - 1) {
          focused -= 1
        } else {
          focused += 1
        }
      }
      this.setState({focused: focused})
    },
  },
  onOtherKey: function (e) {
    // up, down, typing in the name
    console.log(e)
    e.preventDefault()
  },
  suppressMouseDown: function (e) {
    if (!this.state.open) return
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopPropagation()
    e.nativeEvent.suppressed = true
    return false
  },
  render: function () {
    var keydown = keys(this.keys, this.onOtherKey).bind(this)
    return (
      d.div({
        tabindex:0,
        onKeyDown: keydown,
        className:'dropicon ' + this.props.className + (this.state.open ? ' open' : ''),
        onMouseDown:this.suppressMouseDown
      }, [
        d.div({className:"head"}, 
          (this.props.headView || this.props.view)({value: this.props.value, head: true, onSelect: this.toggle})
        ),
        d.ul({className:"list"}, 
          this.props.options.map(function (value, i) {
            if (value === this.props.value && !this.props.showSelected) return false
            var cname = 'item ' + (value === this.props.value ?  'selected' : '')
            if (i === this.state.focused) cname += ' focused'
            return (
              d.li({className:cname}, 
                this.props.view({value: value, onSelect: this.change.bind(null, value)})
              )
            )
          }.bind(this))
        )
      ])
    )
  },
})
