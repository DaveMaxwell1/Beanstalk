
function startScreen() {
	
    //create canvas and divs
    //this.canvas = document.createElement("canvas");
    //this.canvas.id = "startScreenCanvas";
    //this.canvas.setAttribute('width', 212);
	//this.canvas.setAttribute('tabIndex', '-1');
    //this.canvas.setAttribute('height', 237);
    //this.ctx = this.canvas.getContext("2d");
	//document.body.insertBefore(this.canvas, document.body.firstChild);
	
	this.pocketMoneyPanel = document.createElement("div");
    this.pocketMoneyPanel.setAttribute("id", "pocketMoneyPanel");
    this.pocketMoneyPanel.setAttribute('tabIndex', '-1');
    document.body.insertBefore(this.pocketMoneyPanel, document.body.firstChild);
	this.pocketMoneyPanel.innerHTML = '<div class="pocketMoney"> <ul id="money"> <li><a id="1" class="item" href="index.html#" draggable="true"><img src="images/ui/money/1.png"> <div> <p><strong>€1</strong></p> <p><strong>price</strong>: <span>€1.00</span></p> <p><strong>quantity</strong>: <span>10</span></p></div></a></li> <li><a id="5" class="item" href="index.html#" draggable="true"><img src="images/ui/money/5.png"> <div> <p><strong>€5</strong></p> <p><strong>price</strong>: <span>€5.00</span></p> <p><strong>quantity</strong>: <span>16</span></p></div></a></li> <li><a id="10" class="item" href="index.html#" draggable="true"><img src="images/ui/money/10.png"> <div> <p><strong>€10</strong></p> <p><strong>price</strong>: <span>€10.00</span></p> <p><strong>quantity</strong>: <span>9</span></p></div></a></li> <li><a id="20" class="item" href="index.html#" draggable="true"><img src="images/ui/money/20.png"> <div> <p><strong>€20</strong></p> <p><strong>price</strong>: <span>€20.00</span></p> <p><strong>quantity</strong>: <span>4</span></p></div></a></li> <li><a id="50" class="item" href="index.html#" draggable="true"><img src="images/ui/money/50.png"> <div> <p><strong>€50</strong></p> <p><strong>price</strong>: <span>€50.00</span></p> <p><strong>quantity</strong>: <span>20</span></p></div></a></li> </ul> <div class="coins"></div><div id="cart"><ul></ul> <p id="total"><strong>total each week:</strong> €<span>0.00</span></p><h4>drop here to add</h4></div> </div> <div class="nextPocketMoney"></div><div class="closePocketMoney"></div>  ';
    	
$('.item')
	.bind('dragstart', function (evt) {
		evt.dataTransfer.setData('text', this.id);
		$('h4').fadeIn('fast');
	});
	//.hover(
	//	function () { $('div', this).fadeIn(); }, 
	//	function () { $('div', this).fadeOut(); }
	//);
	
$('#cart')
	.bind('dragover', function (evt) {
		evt.preventDefault();
	})
	.bind('dragenter', function (evt) {
		evt.preventDefault();
	})
	.bind('drop', function (evt) {
		var id = evt.dataTransfer.getData('text'),
			item = $('#' + id),
			cartList = $("#cart ul"),
			total = $("#total span"),
			price = $('p:eq(1) span', item).text(),
			prevCartItem = null,
			notInCart = (function () {
				var lis = $('li', cartList),
					len = lis.length,
					i;

				for (i = 0; i < len; i++ ) {
					var temp = $(lis[i]);
					if (temp.data('id') === id) {
						prevCartItem = temp;
						return false;
					}
				}
				return true;
			} ()),
			quantLeftEl, quantBoughtEl, quantLeft;

		$("h4").fadeOut('fast');

		//if (notInCart) {
		//	prevCartItem = $('<li />', {
		//		text : $('p:first', item).text(),
		//		data : { id : id }
		//	}).prepend($('<span />', {
		//		'class' : 'quantity',
		//		text : '0'
		//	})).prepend($('<span />', {
		//		'class' : 'price',
		//		text : price
		//	})).appendTo(cartList);
		//}

		quantLeftEl = $('p:last span', item);
		quantLeft   = parseInt(quantLeftEl.text(), 10) - 1;
		quantBoughtEl = $('.quantity', prevCartItem);
		quantBoughtEl.text(parseInt(quantBoughtEl.text(), 10) + 1);
		quantLeftEl.text(quantLeft);

		if (quantLeft === 0) {
			item.fadeOut('fast');
		}
		
		total.text((parseFloat(total.text(), 10) + parseFloat(price.split('€')[1])).toFixed(2));
		
		//get total value and change background image
		totalValue = parseFloat(total.text(), 10);
		if (totalValue >= 1 && totalValue < 5 ) {

			$('.coins').css('background-image', 'url(images/ui/PocketMoney1.png)');
			$('.coins').fadeIn('fast');
		}
		
		if (totalValue >= 5 && totalValue < 10 ) {

			$('.coins').css('background-image', 'url(images/ui/PocketMoney2.png)');
			$('.coins').fadeIn('fast');
		}		
	
		if (totalValue >= 10 && totalValue < 15 ) {

			$('.coins').css('background-image', 'url(images/ui/PocketMoney3.png)');
			$('.coins').fadeIn('fast');
		}

		if (totalValue >= 15 && totalValue < 20 ) {

			$('.coins').css('background-image', 'url(images/ui/PocketMoney4.png)');
			$('.coins').fadeIn('fast');
		}
		
		if (totalValue >= 20 && totalValue < 30 ) {

			$('.coins').css('background-image', 'url(images/ui/PocketMoney5.png)');
			$('.coins').fadeIn('fast');
		}
		
		if (totalValue >= 30 && totalValue < 50 ) {

			$('.coins').css('background-image', 'url(images/ui/PocketMoney6.png)');
			$('.coins').fadeIn('fast');
		}					
		
		evt.stopPropagation();
		return false;
	});	
	
$('.nextPocketMoney').bind('click', function() {
alert('User clicked on go');
});	

$('.closePocketMoney').bind('click', function() {

$(".pocketMoney").fadeOut();

});	


//Pocket money count complete, launch next event

	this.weekdaySelectorPanel = document.createElement("div");
    this.weekdaySelectorPanel.setAttribute("id", "weekdaySelectorPanel");
    this.weekdaySelectorPanel.setAttribute('tabIndex', '-1');
    document.body.insertBefore(this.weekdaySelectorPanel, document.body.firstChild);
	this.weekdaySelectorPanel.innerHTML = '<div class="weekdaySelector"> <div id="weekdaySelectedBox"></div> <span id="monday"><img class="weekday" src="images/ui/weekdays/monday.png" alt="monday"></span> <span id="tuesday"><img class="weekday" src="images/ui/weekdays/tuesday.png" alt="tuesday"></span> <span id="wednesday"><img class="weekday" src="images/ui/weekdays/wednesday.png" alt="wednesday"></span><span id="thursday"><img class="weekday" src="images/ui/weekdays/thursday.png" alt="thursday"></span><span id="friday"><img class="weekday" src="images/ui/weekdays/friday.png" alt="friday"></span><span id="saturday"><img class="weekday" src="images/ui/weekdays/saturday.png" alt="saturday"></span><span id="sunday"><img class="weekday" src="images/ui/weekdays/sunday.png" alt="sunday"></span></div>  ';

b1=document.getElementById('monday');
b2=document.getElementById('tuesday');
b3=document.getElementById('wednesday');
b4=document.getElementById('thursday');
b5=document.getElementById('friday');
b6=document.getElementById('saturday');
b7=document.getElementById('sunday');
box=document.getElementById('weekdaySelectedBox');
b1.addEventListener('dragstart',dragstart, false);
b2.addEventListener('dragstart',dragstart, false);
b3.addEventListener('dragstart',dragstart, false);
b4.addEventListener('dragstart',dragstart, false);
b5.addEventListener('dragstart',dragstart, false);
b6.addEventListener('dragstart',dragstart, false);
b7.addEventListener('dragstart',dragstart, false);
box.addEventListener('dragenter',function(e){e.preventDefault()}, false);
box.addEventListener('dragover',function(e){e.preventDefault()}, false);
box.addEventListener('drop',dropped, false);

function dragstart(e){
var value=e.currentTarget.innerHTML;
e.dataTransfer.setData('text',value);
}
 
function dropped(e){
e.preventDefault();
text = e.dataTransfer.getData('text');
e.currentTarget.innerHTML =  text;

daySelected = $('div#weekdaySelectedBox .weekday').attr('alt');

//alert($('div#weekdaySelectedBox .weekday').attr('alt'));

}

		
}


		


