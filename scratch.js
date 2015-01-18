var myFormData = {
    key1: 300,
    key2: 'hello world'
};

var fd = new FormData();
for (var key in myFormData) {
    console.log(key, myFormData[key]);
    fd.append(key, myFormData[key]);
}

var xhr = new XMLHttpRequest;
xhr.open('POST', 'http://127.0.0.1:1337/', true);
xhr.send(fd);



localStorage.setItem("username", "marijn");
console.log(localStorage.getItem("username"));
// → marijn
localStorage.removeItem("username");
