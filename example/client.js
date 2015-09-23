console.log('LOAD CLIENT');

function getBase() {
  return document.getElementById('base').value;
}

var test = {
  call: function (url) {
    grab(getBase() + url).then(function (response) {
      console.log('Call', url, '=>', response.status, response.body);
    }, function (error) {
      console.warn('Call', url, '=>', response.status, response.body);
    });
  }
};
