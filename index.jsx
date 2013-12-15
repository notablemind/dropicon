/** @jsx React.DOM */

var Text = React.createClass({
  render: function () {
    return <div className='text-item' onClick={this.props.onSelect}>{this.props.value}</div>
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
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopPropagation()
    e.nativeEvent.suppressed = true
    return false
  },
  render: function () {
    return (
      <div className={'dropicon ' + this.props.className + (this.state.open ? ' open' : '') } onMouseDown={this.suppressMouseDown}>
        <div className="head">
          {(this.props.headView || this.props.view)({value: this.props.value, onSelect: this.toggle})}
        </div>
        <ul className="list">
          {
            this.props.options.map(function (value) {
              if (value === this.props.value && !this.props.showSelected) return false
              return (
                <li className={'item ' + (value === this.props.value ?  'selected' : '')}>
                  {
                    this.props.view({value: value, onSelect: this.change.bind(null, value)})
                  }
                </li>
              )
            }.bind(this))
          }
        </ul>
      </div>
    )
  },
})

