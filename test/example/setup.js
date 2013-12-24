
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
  className: 'simple-theme',
  options: ['one', 'two', 'three']
}), document.getElementById('d1'))

React.renderComponent(Demo({
  initialValue: 'one',
  className: 'simple-theme',
  options: ['one', 'two', 'three']
}), document.getElementById('d2'))

React.renderComponent(Demo({
  initialValue: 'one',
  className: 'simple-theme',
  options: ['one', 'two', 'three']
}), document.getElementById('simple'))

/* colorful */

var Colorful = React.createClass({
  render: function () {
    return React.DOM.div({
      className: 'color-item',
      onClick: this.props.onSelect
    }, [
      React.DOM.span({
        className: 'color',
        style: {
          backgroundColor: this.props.value.color
        }
      }),
      this.props.value.title
    ])
  }
})

var options = [
  {color: 'red', title: 'Warning'},
  {color: 'green', title: 'Awesome'},
  {color: 'magenta', title: 'Problems'}
]
React.renderComponent(Demo({
  initialValue: options[0],
  className: 'simple-theme',
  showSelected: true,
  view: Colorful,
  options: options,
}), document.getElementById('colorful'))

var CollapsePre = React.createClass({
  getInitialState: function () {
    return {showing: this.props.showInitial}
  },
  componentDidMount: function () {
    Prism.highlightElement(this.refs.code.getDOMNode())
  },
  toggle: function () {
    this.setState({showing: !this.state.showing})
  },
  render: function () {
    return React.DOM.div({className: 'collapse-pre'}, [
      React.DOM.div({
        className: 'pre-title',
        onClick: this.toggle
      }, [
        this.state.showing ? 'Hide ' : 'Show ',
        this.props.title
      ]),
      React.DOM.pre({
        style: {
          display: this.state.showing ? 'block' : 'none'
        }
      }, React.DOM.code({
        ref: 'code',
        className: this.props.langClass,
        dangerouslySetInnerHTML: {
          __html: this.props.source
        }
      }))
    ])
  },
})

;[].slice.call(document.querySelectorAll('pre.collapse')).forEach(function (pre) {
  var div = document.createElement('div')
  pre.parentNode.replaceChild(div, pre)
  React.renderComponent(CollapsePre({
    source: pre.firstChild.innerHTML,
    langClass: pre.firstChild.className,
    showInitial: pre.className.indexOf('showing') !== -1,
    title: pre.title
  }), div)
})

