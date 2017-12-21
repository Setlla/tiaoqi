$(".login").click(function() {
	entry();
})

$('.password').keydown(function(e) {
	if(e.keyCode == 13) {
		entry();
	}
});

function entry() {
	var phone = $(".users").val();
	var password = $(".password").val();
	var pn = JSON.stringify({
		"phone": phone,
		"password": hex_md5(password)
	})
	$.ajax({
		type: "post",
		url: "http://39.108.219.59:8080/login",
		contentType: "application/json",
		data: pn,
		success: function(data) {
			if(data.islogin) {
				localStorage.setItem("token", data.token);
				location.href = "allproduct.html"
			} else {
				alert("账号或密码输入错误")
			}
		}
	});
}