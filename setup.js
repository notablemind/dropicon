
var Dropicon = require('dropicon')

var X = React.createClass({
  getInitialState: function () {
    return {
      value: this.props.initialValue
    }
  },
  getDefaultProps: function () {
    return {
      initialValue: 'one',
      options: ['one', 'two', 'three']
    }
  },
  onChange: function (value) {
    this.setState({value: value})
  },
  render: function () {
    return Dropicon({
      value: this.state.value,
      options: this.props.options,
      onChange: this.onChange
    })
  },
})

React.renderComponent(X({
}), document.getElementById('simple'))


