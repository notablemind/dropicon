
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
    return {open: this.props.setOpen}
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
  componentDidUpdate: function () {
    if (this.state.open) {
      document.addEventListener('mousedown', this.close)
    } else {
      document.removeEventListener('mousedown', this.close)
    }
  },
  componentDidMount: function () {
    if (this.state.open) {
      document.addEventListener('mousedown', this.close)
    } else {
      document.removeEventListener('mousedown', this.close)
    }
  },
  change: function (value) {
    this.props.onChange(value)
    this.close()
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
      d.div({className:'dropicon ' + this.props.className + (this.state.open ? ' open' : ''),  onMouseDown:this.suppressMouseDown}, 
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
      )
    )
  },
})
