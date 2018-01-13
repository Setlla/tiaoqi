import Datepicker from 'vuejs-datepicker';


Vue.component('product', {
	props: ['goods', 'productNum'],
	template: `<div><div class="product" v-for="(good,index) in goods">
					<p class="image">
						<img :src="good.Image"/>
					</p>
					<div>
						<h5>{{good.Name}}</h5>
					</div>
					<a>{{"$"+good.CurPrice}}</a>
					<a>{{productNum[index]}}</a>
					<a></a>
				</div></div>`
})

var order = new Vue({
	el: '.body',
	data: {
		results: [],
		order: '',
		start: '',
		end: '',
		username: ''
	},
	components:{
		Datepicker
	},
	methods: {
		allproduct: function() {
			location.href = 'allproduct.html'
		},
		xuanran: function() {
			var that = this;
			axios({
				method: 'POST',
				url: 'http://39.108.219.59:8080/getAllOrder',
				data: {
					id: this.order,
					startTime: this.start,
					endTime: this.end,
					userName: this.username
				},
			}).then(function(response) {
				console.log(response);
				that.results.splice(0);
				that.results.push(response.data.result);
			})
		},
		search:function(){
			this.xuanran()
		}
	},
	computed: {
		formatResults: function() {
			var data = this.results[0];
			var formatResults = [];
			if(data) {
				for(var i = 0; i < data.length; i++) {
					if(data[i].products.length) {
						formatResults.push(data[i]);
					}
				}
			}
			return formatResults;
		}
	},
	mounted: function() {
		this.xuanran()
	}
})

