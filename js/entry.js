$(".login").click(function(){
	entry();
})


function entry() {
	var phone=$(".users").val();
	var password=$(".password").val();
	var pn=JSON.stringify({
		"phone":phone,
		"password":hex_md5(password)
	})
	$.ajax({
		type:"post",
		url:"http://39.108.219.59:8080/login",
		contentType:"application/json",
		data:pn,
		success:function(data){
			if(data.islogin){
				localStorage.setItem("token",data.token);
				location.href = "allproduct.html"
			}else{
				alert("账号或密码输入错误")
			}
		}
	});
	
	
	
	
	
	
	
	
	
	
	
	var xhr = new XMLHttpRequest;
	var pn=JSON.stringify({"phone":phone.value,"password":hex_md5(password.value)})
	xhr.open("POST", http+"login");
	xhr.setRequestHeader("content-type","application/json")
	xhr.send(pn);
	xhr.onreadystatechange = function() {
		if(xhr.status == 200 && xhr.readyState == 4) {
			var resp=JSON.parse(xhr.response)
			if(resp.islogin){
				localStorage.setItem("token",resp.token);//服务端下发的token植入到本地缓存，token代表当前登录者信息   sessionStorage
				location.href = "dangpu.html"
			}else{
				alert("账号或密码输入错误")
			}
		
		}
	}
}