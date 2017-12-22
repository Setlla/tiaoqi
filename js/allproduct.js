var recor = [],
	all = $(".allproduct"),
	add = $(".addproduct"),
	productName = "";

////退出
//$(".col_2>a").click(function(){
//	location.href="index.html"
//})

//页面的切换
function allproduct() {
	$(".content").css("display", "none")
	$(".retrieval").css("display", "block")
	$(".products").css("display", "block");
	all.css("color", "#e34e42");
	add.css("color", "#FFFFFF")
}

var addproduct = function() {
	$(".content").css("display", "block");
	$(".retrieval").css("display", "none")
	$(".products").css("display", "none");
	add.css("color", "#e34e42");
	all.css("color", "#FFFFFF")
}

//侧栏点击打开与闭合效果
$(".motion").click(function() {
	if($(this).next("ul").hasClass("hide")) {
		$(this).next("ul").removeClass("hide");
		$(this).children(".arr").css("transform", "translate(0,-50%) rotate(315deg)")
	} else {
		$(this).next("ul").addClass("hide");
		$(this).children(".arr").css("transform", "translate(0,-50%) rotate(225deg)")
	}
})

//全部商品的加载与渲染
loding();

function loding() {
	productName = $(".productname").val();
	$.ajax({
		type: "post",
		url: "http://39.108.219.59:8080/productList",
		contentType: "application/json",
		data: JSON.stringify({
			productName: productName
		}),
		success: function(data) {
			content(data.result);
			recor = data.result;
		}
	});
}

//产品搜索
function search() {
	loding();
}

$('.productname').keydown(function(e) {
	if(e.keyCode == 13) {
		loding();
	}
});

function content(result) {
	var loop = "<tr class='first'>" +
		"<td><input type='checkbox'></td>" +
		"<td>ID</td>" +
		"<td>图片</td>" +
		"<td>商品名称</td>" +
		"<td>原始价格</td>" +
		"<td>折扣价格</td>" +
		"<td>是否下架</td>" +
		"<td>上传时间</td>" +
		"<td>查看</td>" +
		"</tr>"
	for(var i = 0; i < result.length; i++) {
		var flag = result[i].isDelete;
		loop = loop + "<tr>" +
			"<td><input type='checkbox'></td>" +
			"<td>" + result[i].id + "</td>" +
			"<td><img src=" + result[i].Image + " /></td>" +
			"<td class='name'>" + result[i].Name + "</td>" +
			"<td>" + result[i].OldPrice + "</td>" +
			"<td>" + result[i].CurPrice + "</td>" +
			"<td>" + formateDelete(flag) + "</td>" +
			"<td>" + new Date(result[i].createdAt).toLocaleDateString() + "</td>" +
			"<td>" +
			"<a onclick='editor(this)'>编辑</a> |" +
			"<a onclick='delet("+ flag +"," + result[i].id + ")'>"+ formateValue(flag) +"</a>" +
			"</td>" +
			"</tr>"
	}
	$("tbody").html(loop);
}

function formateDelete(val) {
	return val ? "已下架" : "未下架";
}

function formateValue(val) {
	return val ? "上架" : "下架";
}

//本地预览图片函数
function getObjectURL(file) {
	var url = null;
	if(window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if(window.URL != undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if(window.webkitURL != undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}

//调用预览图片
$(".print").change(function() {
	var img = $('.print')[0].files[0];
	var imgurl = getObjectURL(img);
	$(".image").attr("src", imgurl);
})

//formData表单数据的获取
function obtain() {
	var formData = new FormData(); //提交表单
	var isHot=function(){
		if($(".isHot select").val()=="是"){
			return 1;
		}else{
			return 0;
		}
	};
	var isRecommend=function(){
		if($(".isRecommend select").val()=="是"){
			return 1;
		}else{
			return 0;
		}
	};
	var typeId =$(".category").val();
	var title = $(".title input").val();
	var oldprice = $(".oldprice input").val();
	var newprice = $(".newprice input").val();
	var elaborate = $(".elaborate textarea").val();
	var Carriage = $(".Carriage input").val();
	var Destination = $(".Destination input").val();

	if($('.print')[0].files[0]) {
		formData.append("Image", $('.print')[0].files[0]);
	}
	formData.append("isHot", isHot);
	formData.append("isRecommend", isRecommend);
	formData.append("typeId", typeId);
	formData.append("id", localStorage.getItem("id"));
	formData.append("Name", title);
	formData.append("OldPrice", oldprice);
	formData.append("CurPrice", newprice);
	formData.append("Des", elaborate);
	formData.append("Carriage", Carriage);
	formData.append("Destination", Destination);

	return formData;
}

//添加商品的提交
$(".submit a").click(function() {
	uploadImage();
})

function uploadImage() {
	var formData = obtain();
	$.ajax({
		type: "POST",
		url: "http://39.108.219.59:8080/addProduct",
		contentType: false,
		processData: false,
		data: formData,
		success: function(suces) {
			if(!suces.isSuccess) {
				alert("上传失败")
				return false;
			} else {
				location.reload();
			}
		},
	});
}

//删除产品
function delet(flag, id) {
	var url = "";
	if (flag) {
		url = "http://39.108.219.59:8080/onProduct";
	}else {
		url = "http://39.108.219.59:8080/offProduct";
	}
	
	$.ajax({
		type: "post",
		url: url,
		contentType: "application/json",
		data: JSON.stringify({
			"id": id
		}),
		success: function(data) {
			if(data.isSuccess) {
				location.reload();
			}
		}
	});
}

//进入编辑页面
function editor(that) {
	addproduct();
	$(".submit").css("display", "none")
	$(".rejigger").css("display", "block")
	var num = $(that).parents('tr').index() - 1;
	var data = recor[num];
	$(".title input").val(data.Name)
	$(".oldprice input").val(data.OldPrice)
	$(".newprice input").val(data.CurPrice);
	$(".elaborate textarea").val(data.Des);
	$(".Carriage input").val(data.Carriage);
	$(".Destination input").val(data.Destination);
	$(".image").attr("src", data.Image);
	localStorage.setItem("id", data.id);
}

//编辑商品的提交
$(document).on("click", ".rejigger a", function() {
	alter();
})

function alter() {
	var formData = obtain();
	$.ajax({
		type: "POST",
		url: "http://39.108.219.59:8080/updateProduct",
		contentType: false,
		processData: false,
		data: formData,
		success: function(suces) {
			if(!suces.isSuccess) {
				alert("上传失败")
				return false;
			} else {
				location.reload();
			}
		},
	});
}