/** @jsx React.DOM */

var Text = React.createClass({
  render: function () {
    return <span onClick={this.props.onSelect}>{this.props.value}</span>
  }
})

var DropIcon = module.exports = React.createClass({
  getDefaultProps: function () {
    return {
      value: 'one',
      onChange: function () {},
      options: ['one', 'two', 'three']

      className: '',
      showSelected: false,
    }
  },
  render: function () {
    return (
      <div className={'dropicon ' + this.props.className}>
        <div className="head">
          {this.props.view({value: this.props.value})}
        </div>
        <ul className="list">
          {
            this.props.options.map(function (value) {
              if (value === this.props.value && !this.props.showSelected) return false
              return (
                <li className={'item ' + (value === this.props.value ?  'selected' : '')}>
                  {
                    this.props.view({value: value, onSelect: this.props.onChange.bind(this, value)})
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

