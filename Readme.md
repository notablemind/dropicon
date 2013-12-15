
# The Dropicon React Component
This is a component that lets you pass in a component for displaying each item - it takes care of everything else.

Note that, like the built-in `<input>` element, Dropicon _doesn't own the state for its current value_. You need to manage that externally, passing in the current value via the `value` prop, and passing in an `onChange` handler prop as well.

## Example Use:
[View live demos here](http://notablemind.github.io/dropicon/)

This uses the [dropicon-simple](http://github.com/notablemind/dropicon-simple) theme.
```js
var Dropicon = require('dropicon')

var Demo = React.createClass({
  getInitialState: function () {
    return {
      value: this.props.initialValue
    }
  },
  onChange: function (value) {
    this.setState({value: value})
  },
  render: function () {
    return React.DOM.div({}, [
      'Current Value: ' + JSON.stringify(this.state.value),
      React.DOM.br(),
      this.transferPropsTo(Dropicon({
        value: this.state.value,
        onChange: this.onChange
      }))
    ])
  },
})

React.renderComponent(Demo({
  initialValue: 'one',
  className: 'simple-theme', // using the dropicon-simple theme
  options: ['one', 'two', 'three']
}), document.getElementById('simple'))
```

You'd need to `$ component install notablemind/dropicon notablemind/dropicon-simple`

## Properties accepted

### view
Defaults to the following `TextView`:

```js
var Text = React.createClass({
  render: function () {
    return <div className='text-item' onClick={this.props.onSelect}>{this.props.value}</div>
  }
})
```

### headView
Defaults to false. You can optionally pass in another component here if you want the "selected item" at the top to be displayed differently. Otherwise it will be displayed with the `view` component.

### options
A list of options. The view that you define will recieve one of these options as its `value` prop.

For example, for the default view, this would be a list of strings.

### value
The selected value. This _must_ be a member of the options group (by `===`).

### onChange
Called with the new value. If you don't keep track of this in some kind of state and pass the new value back to the Dropicon component via the `value` prop, the component **will essentially be disabled**.

### setOpen
If this is true, then the dropdown will be open initially (or at the time this prop is set, if later).

### showSelected
Boolean, defaults to false. Set to true if you want the currently selected value to be included in the dropdown list.

### className
Passed through to the parent `.dropicon` div.

## License

  Apache v2
