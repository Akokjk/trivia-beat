function verify() {
  if (window.localStorage.login !== undefined) {
    //decrypt and verify login and experation
    $.ajax({
      url: "/verify",
      type: "PUT",
      timeout: 10000,
      headers: {
        data: window.localStorage.login
      }
    })
      .done(function (res) {})
      .fail(function (res) {
        alert("Unable to find account information.");
        window.localStorage.removeItem("login");
        location.href = "/login";
        console.log(res);
      });
  } else {
    window.localStorage.removeItem("login");
    location.href = "/login";
  }
}
