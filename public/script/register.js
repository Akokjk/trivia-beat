function register(email, phone, password) {
  $.ajax({
    url: "/register",
    type: "PUT",
    timeout: 10000,
    headers: {
      email: document.getElementById("exampleInputEmail2").value,
      password: CryptoJS.MD5(document.getElementById("input_password").value).toString(),
      phone: document.getElementById("example-tel-input").value,
      username: document.getElementById("user-input").value
    }
  })
    .done(function (res) {
      console.log(res);
      if (res) {
        console.log("worked");
        document.getElementById("box").style.backgroundColor = "green";
        window.localStorage.setItem("login", JSON.stringify(res));
        //location.href = "/";
      } else {
        alert("Account already existing with that info.");
      }
    })
    .fail(function (res) {
      console.log(res);
      document.getElementById("box").style.backgroundColor = "red";
    });
}

function checkemail(mail) {
  var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (mail.match(mailformat)) {
    //alert("Valid email address!");
    //document.form1.text1.focus();
    document.getElementById("exampleInputEmail2").style.backgroundColor = "green";
    return true;
  } else {
    document.getElementById("exampleInputEmail2").style.backgroundColor = "red";
    //alert("You have entered an invalid email address!");
    //document.form1.text1.focus();
    return false;
  }
}

function checkpassword(password) {
  if (password.length < 8 || password.length >= 20) {
    document.getElementById("input_password").style.backgroundColor = "red";
  } else {
    document.getElementById("input_password").style.backgroundColor = "green";
  }
}

function checkphone(phone) {
  var phoneno = /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g;
  if (phone.match(phoneno)) {
    document.getElementById("example-tel-input").style.backgroundColor = "green";
    return true;
  } else {
    document.getElementById("example-tel-input").style.backgroundColor = "red";
    return false;
  }
}
