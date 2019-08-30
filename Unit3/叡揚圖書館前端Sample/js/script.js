$(document).ready(function(){
	$(".demo-button").kendoButton();
	$(".demo-enable").kendoButton();
	$(".demo-disable").kendoButton();
	$(".demo-target").kendoButton();

	var dataSource=new kendo.data.DataSource({
		data:[{Id:1,Name:"項目一"},{Id:2,Name:"項目二"}],
		pageSize:20
	});

	$("#book_grid").kendoGrid({
		dataSource:dataSource,
		height:200,
		columns:[
			{field:"Id",title:"書籍編號",width:"50%"},
			{field:"Name",title:"書籍名稱",width:"50%"}
			],
		sortable:true
	});

	var people = [ { firstName: "John",
                 lastName: "Smith",
                 email: "john.smith@telerik.com" },
               { firstName: "Jane",
                 lastName: "Smith",
                 email: "jane.smith@telerik.com" },
               { firstName: "Josh",
                 lastName: "Davis",
                 email: "josh.davis@telerik.com" },
               { firstName: "Cindy",
                 lastName: "Jones",
                 email: "cindy.jones@telerik.com" } ];
	//逗號要記得加 不然會錯
	$("#people_grid").kendoGrid({
		dataSource: people,
		sortable:true
	});

	var dataSource = new kendo.data.DataSource({
		data: [
			{ name: "Pork", category: "Food", subcategory: "Meat" },
			{ name: "Pepper", category: "Food", subcategory: "Vegetables" },
			{ name: "Beef", category: "Food", subcategory: "Meat" }
		],
		group: [
			// group by "category" and then by "subcategory"
			{ field: "category" },
			{ field: "subcategory" },
		]
	});

	$("#food_grid").kendoGrid({
		dataSource: dataSource,
		sortable:true
	});

	dataSource.fetch(function(){
		var view = dataSource.view();
		console.log(view.length); // displays "1"
		var food = view[0];
		console.log(food.value); // displays "Food"
		var meat = food.items[0];
		console.log(meat.value); // displays "Meat"
		console.log(meat.items.length); // displays "2"
		console.log(meat.items[0].name); // displays "Pork"
		console.log(meat.items[1].name); // displays "Beef"
		var vegetables = food.items[1];
		console.log(vegetables.value); // displays "Vegetables"
		console.log(vegetables.items.length); // displays "1"
		console.log(vegetables.items[0].name); // displays "Pepper"
	});

	$("#chart").kendoChart({
    title: {
		text: "Employee Sales"
	},
	dataSource: new kendo.data.DataSource({
		data: [
		{
			employee: "Joe Smith",
			sales: 2000
		},
		{
			employee: "Jane Smith",
			sales: 2250
		},
		{
			employee: "Will Roberts",
			sales: 1550
		}]
	}),
		series: [{
			type: "line",//bar 長條圖, pie 圓餅圖
			field: "sales",
			name: "Sales in Units"
		}],
		categoryAxis: {
			field: "employee"
		}
	});

	$(".demo-button").click(function(){
		$(".demo-input").val("");
	});

	$(".demo-input").on("input",function(){
		$(".demo-text").text($(this).val());
	});

	$(".demo-enable").click(function(){
		$(".demo-target").data("kendoButton").enable(true);
	});

	$(".demo-disable").click(function(){
		$(".demo-target").data("kendoButton").enable(false);
	});

});



