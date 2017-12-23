var recor = [],
	all = $(".allproduct"),
	add = $(".addproduct"),
	productName = "",
	isHot = $(".isHot select"),
	isRecommend = $(".isRecommend select"),
	typeId =$(".category select"),
	title = $(".title input"),
	oldprice = $(".oldprice input"),
	newprice = $(".newprice input"),
	elaborate = $(".elaborate textarea"),
	Carriage = $(".Carriage input"),
	Destination = $(".Destination input"),
	img = $(".image");
	
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
function addpro(){
	addproduct();
	isHot.val("");
	isRecommend.val("");
	typeId.val("");
	title.val("");
	oldprice.val("");
	newprice.val("");
	elaborate.val("");
	Carriage.val("");
	Destination.val("");
	img.attr("src", "img/picture.png");
}

var addproduct = function() {
	$(".content").css("display", "block");
	$(".retrieval").css("display", "none")
	$(".products").css("display", "none");
	add.css("color", "#e34e42");
	all.css("color", "#FFFFFF");
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
			productName: productName,
			typeId: $('.productType select').val(),
			isRecommend: $('.groom select').val(),
			isHot: $('.heat select').val(),
			isDelete: $('.frame select').val()
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
		"<td>图片</td>" +
		"<td>商品名称</td>" +
		"<td>原始价格</td>" +
		"<td>折扣价格</td>" +
		"<td>上传时间</td>" +
		"<td>设置上架</td>" +
		"<td>设置热卖</td>" +
		"<td>设置推荐</td>" +
		"<td>查看</td>" +
		"</tr>"
	for(var i = 0; i < result.length; i++) {
		var hot = result[i].isHot;
		var recommend = result[i].isRecommend;
		var del = result[i].isDelete;
		loop = loop + "<tr>" +
			"<td><input type='checkbox'></td>" +
			"<td><img src=" + result[i].Image + " /></td>" +
			"<td class='name'>" + result[i].Name + "</td>" +
			"<td>" + result[i].OldPrice + "</td>" +
			"<td>" + result[i].CurPrice + "</td>" +
			"<td>" + new Date(result[i].createdAt).toLocaleDateString() + "</td>" +
			"<td>" + "<a onclick='changeState(0," + result[i].id + "," + result[i].isDelete + ")'>"+ formateStr(0, del) +"</a> "  + "</td>" +
			"<td>" + "<a onclick='changeState(1," + result[i].id + "," + result[i].isHot + ")'>"+ formateStr(1, hot) +"</a>" + "</td>" +
			"<td>" + "<a onclick='changeState(2," + result[i].id + "," + result[i].isRecommend + ")'>"+ formateStr(2, recommend) +"</a>" + "</td>" +
			"<td>" +
			"<a onclick='editor(this)'>编辑</a>" +
			"</td>" +
			"</tr>"
	}
	$("tbody").html(loop);
}


function changeState(index, id, value) {
	var arr = ['d','h','r'];
	var str1 = ['上架成功','取消热卖成功','取消推荐成功'];
	var str2 = ['下架成功','设置热卖成功','设置推荐成功'];
	
	var _data = {
		type: arr[index],
		id: id,
		value: value?0:1
	}
	
	$.ajax({
		type:"post",
		url:"http://39.108.219.59:8080/changeState",
		data: JSON.stringify(_data),
		contentType: "application/json",
		success: function(result) {
			value?swal(str1[index]):swal(str2[index]);
		}
	});
	
}

$(document).on('click','.swal-button',function() {
	location.reload();
})


function formateStr(flag, value) {
	var str1 = ['上架', '取消', '取消'];
	var str2 = ['下架', '热卖', '推荐']
	return value ? str1[flag] : str2[flag];
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

	if($('.print')[0].files[0]) {
		formData.append("Image", $('.print')[0].files[0]);
	}
	formData.append("isHot", isHot.val());
	formData.append("isRecommend", isRecommend.val());
	formData.append("typeId", typeId.val());
	formData.append("id", localStorage.getItem("id"));
	formData.append("Name", title.val());
	formData.append("OldPrice", oldprice.val());
	formData.append("CurPrice", newprice.val());
	formData.append("Des", elaborate.val());
	formData.append("Carriage", Carriage.val());
	formData.append("Destination", Destination.val());

	return formData;
}

//添加商品的提交
$(".submit a").click(function() {
	uploadImage();
	editor(0)
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


//进入编辑页面
function editor(that) {
	addproduct();
	$(".submit").css("display", "none")
	$(".rejigger").css("display", "block")
	var num = $(that).parents('tr').index() - 1;
	var data = recor[num];
	isHot.val(data.isHot);
	isRecommend.val(data.isRecommend);
	typeId.val(data.typeId);
	title.val(data.Name);
	oldprice.val(data.OldPrice);
	newprice.val(data.CurPrice);
	elaborate.val(data.Des);
	Carriage.val(data.Carriage);
	Destination.val(data.Destination);
	img.attr("src", data.Image);
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