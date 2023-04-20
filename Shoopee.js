var totalOrders = 0;
var totalSpent = 0;
var totalShippingSpent = 0;
var totalItems = 0;
var pulling = true;
var offset = 0;
var detailOrders = [];

function getStatistics() {
	var orders = [];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			data = JSON.parse(this.responseText)['data'];
			orders = data['details_list'];
			detailOrders.push(orders)
			totalOrders += orders.length;
			pulling = orders.length >= 5;
			orders.forEach(order => {
				let tpa = order['info_card']["final_total"] / 100000;
				totalSpent += tpa;
				totalItems += order['info_card']["product_count"];
			});
			offset += 5;
			console.log('Đã lấy được: ' + totalOrders + ' đơn hàng');
			if(pulling) {
				console.log('Đang kéo thêm...');
				getStatistics();
			}
			else {
				console.log("%cTổng đơn hàng đã giao: "+"%c"+moneyFormat(totalOrders), "font-size: 30px;","font-size: 30px; color:red");
                console.log("%cTổng sản phẩm đã đặt: " + "%c" + moneyFormat(totalItems), "font-size: 30px;","font-size: 30px; color:red");
				console.log("%cTổng chi tiêu: "+"%c"+moneyFormat(totalSpent)+"đ", "font-size: 30px;","font-size: 30px; color:red");
				console.log(detailOrders.flat());
			}
		}
	};
	xhttp.open("GET", `https://shopee.vn/api/v4/order/get_order_list?limit=5&list_type=3&offset=${offset}`, true);
	xhttp.send();
}

function moneyFormat(number, fixed=0) {
	if(isNaN(number)) return 0;
	number = number.toFixed(fixed);
	let delimeter = ',';
	number += '';
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(number)) {
		number = number.replace(rgx, '$1' + delimeter + '$2');
	}
	return number;
}
