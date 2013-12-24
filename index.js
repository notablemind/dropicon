
var d = React.DOM

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
      active: false
    }
  },
  componentWillReceiveProps: function (props) {
    if (props.setOpen && !this.state.open) {
      this.setState({open: true})
    }
  },
  open: function () {
    this.setState({open: true})
  },
  toggle: function () {
    this.setState({open: !this.state.open})
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
  keys: {
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
    },
    'down': function () {
    },
  },
  onKeyDown: function (e) {
    // up, down, typing in the name
    console.log(e)
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
    return (
      d.div({
        tabindex:0,
        onKeyDown: this.onKeyDown,
        className:'dropicon ' + this.props.className + (this.state.open ? ' open' : ''),
        onMouseDown:this.suppressMouseDown
      }, [
        d.div({className:"head"}, 
          (this.props.headView || this.props.view)({value: this.props.value, head: true, onSelect: this.toggle})
        ),
        d.ul({className:"list"}, 
          this.props.options.map(function (value) {
            if (value === this.props.value && !this.props.showSelected) return false
            return (
              d.li({className:'item ' + (value === this.props.value ?  'selected' : '')}, 
                this.props.view({value: value, onSelect: this.change.bind(null, value)})
              )
            )
          }.bind(this))
        )
      ])
    )
  },
})
