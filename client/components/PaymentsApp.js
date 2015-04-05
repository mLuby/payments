var PaymentsApp = React.createClass({
  style: {
    color: 'white',
    backgroundColor: 'grey'
  },
  render: function() {
    var el = '<div>Hello World</div>';
    return el;

      // '<div className="payments" style={this.style}>'+
      //   '<div>'+
      //     '<Button name="Freeze" />'+
      //     '<Button name="Refund" />'+
      //     '<Button name="Disburse" />'+
      //   '</div>'+
      //   '<Button name="Disburse All" />'+
      // '</div>');
  }
});

var Button = React.createClass({
  style: {},
  render: function() {
    return '<button style={this.style}>{this.props.name}</button>';
  }
});

var el = React.createElement(PaymentsApp)
console.log('el',el, 'PaymentsApp', PaymentsApp());
React.render(el, document.getElementById('PaymentsApp'));
