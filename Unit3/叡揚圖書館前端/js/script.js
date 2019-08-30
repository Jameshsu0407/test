
var bookDataFromLocalStorage = [];

$(function(){
    loadBookData();   

    var data = [
        {text:"資料庫",value:1},
        {text:"網際網路",value:2},
        {text:"應用系統整合",value:3},
        {text:"家庭保健",value:4},
        {text:"語言",value:5}
    ]
    //kendodropdownlist
    $("#book_category").kendoDropDownList({
        dataSource:[
            {value:1,text:"資料庫"},
            {value:2,text:"網際網路"},
            {value:3,text:"應用系統整合"},
            {value:4,text:"家庭保健"},
            {value:5,text:"語言"}
        ],
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        change: onChange
    });
    $("#bought_datepicker").kendoDatePicker();
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: {type:"int"},
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "string" }
                    }
                }
            },
            pageSize: 20,
        },
        toolbar: kendo.template("<div class='book-grid-toolbar'><input id='search-book' class='book-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號",width:"10%"},
            { field: "BookName", title: "書籍名稱", width: "50%" },
            { field: "BookCategory", title: "書籍種類", width: "10%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookBoughtDate", title: "購買日期", width: "15%" },
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" }
        ]   
    });
})

function loadBookData(){
    //將 JSON 字串解析成 JavaScript 物件 - parse()
    //將物件序列化成 JSON 字串 - stringify()
    //localstorage是大房間 裡面有間小間的叫bookData_key 所有資料都存這裡
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData_key")); 
    if(bookDataFromLocalStorage == null){
        bookDataFromLocalStorage = bookData;
        localStorage.setItem("bookData_key",JSON.stringify(bookDataFromLocalStorage)); 
    }
}

$(document).ready(function(){
        
    /*新增*/
    $("#button-new").click(function(){
        //找陣列長度
        var num=bookDataFromLocalStorage.length;
        //找最大筆值的ID
        var ID=bookDataFromLocalStorage[num-1].BookId+1;
        //找所選的分類  
        var CATEGORY = $("#book_category").find(":selected").text(); //kendodropdownlist
        //存使用者輸入的值(書本名稱)
        var NAME = $("#book_name").val();
        //存使用者輸入的值(書本作者)
        var AUTHOR = $("#book_author").val();
        //存使用者輸入的值(日期) 取出bought_datepicker裡存的kendoDatePicker裡的值 再轉換日期格式
        var BOUGHTDATE = kendo.toString($("#bought_datepicker").data("kendoDatePicker").value(),"yyyy-MM-dd"); //dateinput直接黨非法
        //var PUBLISHER = $()
    
        var CreateNewBookData={
            "BookId":ID,
            "BookCategory":CATEGORY,
            "BookName":NAME,
            "BookAuthor":AUTHOR,
            "BookBoughtDate":BOUGHTDATE,
            //"BookPublisher":""
        };

        //在存資料的地方加入新增的東西
        $("#book_grid").data("kendoGrid").dataSource.add(CreateNewBookData);
        //在儲存值的地方丟回localstorage
        localStorage.setItem("bookData_key",JSON.stringify($("#book_grid").data("kendoGrid").dataSource.data()));
        //重新整理window視窗
        window.location.reload();

        /*法二
        //將新增的東西push到bookDataFromLocalStorage
        bookDataFromLocalStorage.push(CreateNewBookData);
        //bookDataFromLocalStorage丟回localstorage
        localStorage.setItem("bookData_key",JSON.stringify(bookDataFromLocalStorage));
        //重新整理window視窗
        window.location.reload();
        */
    });

    /*搜尋*/
    //執行順序要注意 若放在上面 book-grid-search還沒出來
    $(".book-grid-search").on("input",function(e) { //keyup
        //找到存資料的地方
        var store_book_grid = $("#book_grid").data("kendoGrid").dataSource;
        //找到使用者輸入值得地方
        var sarchString = $("#search-book").val(); //用kendo取
        //過濾出要找的欄位名稱(書籍名稱) 裡面包含的字 在使用者輸入的地方  
        store_book_grid.filter({ field: "BookName", operator: "contains", value: sarchString });
    });


})

/*換圖片*/
function onChange(){
    //找book_category的值
    var selectedcategory = $("#book_category").val(); 
        if(selectedcategory==1)
            $(".book_image").attr("src","image/database.jpg"); //"+文字+"
        else if(selectedcategory==2)
            $(".book_image").attr("src","image/internet.jpg");
        else if(selectedcategory==3)
            $(".book_image").attr("src","image/system.jpg");
        else if(selectedcategory==4)
            $(".book_image").attr("src","image/home.jpg");
        else
            $(".book_image").attr("src","image/language.jpg");

    /*switch(getElementById(BookCategory).data.val()){
        case 1:
            $(".book_image").attr("src","image/database.jpg");
        case 2:
            $(".book_image").attr("src","image/internet.jpg");
        case 3:
            $(".book_image").attr("src","image/image/system.jpg");  
        case 4:
            $(".book_image").attr("src","image/home.jpg");
        case 5:
            $(".book_image").attr("src","image/language.jpg"); 
    */
}

/*刪除*/ 
function deleteBook(e){
    //選到滑鼠所選的欄位
    var selectrow=$(e.target).closest("tr");
    //grid存kendogrin裡面的資料
    var grid=$("#book_grid").data("kendoGrid"); 
    //刪除grid裡所選欄位
    grid.removeRow(selectrow); 
    //從grid裡面的datasource.data裡抓資料 回傳到localstorage
    localStorage.setItem("bookData_key",JSON.stringify(grid.dataSource.data())); 
}

//視窗
//$(document).ready(function() {
    var myWindow = $("#window"),
        undo = $("#undo");

    undo.click(function() {
        myWindow.data("kendoWindow").open();
        undo.fadeOut();
    });

    function onClose() {
        undo.fadeIn();
    }
    
    myWindow.kendoWindow({ //modal遮罩
        width: "450px",
        title: "新增書籍",
        visible: false,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
        close: onClose
    })
//.data("kendoWindow").center().open();
//});
//localStorage.clear();
