console.log('LOAD CLIENT');
var test = {
  call: function (url) {
    grab(url).then(function (response) {
      console.log('Call', url, '=>', response.status, response.body);
    }, function (error) {
      console.warn('Call', url, '=>', response.status, response.body);
    });
  }
};
