new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});
// cart
const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const viewAll = document.querySelectorAll('.view-all');
const navigationLink = document.querySelectorAll('.navigation-link:not(.view-all)');
const longGoodsList = document.querySelector('.long-goods-list');
const showAccessories = document.querySelectorAll('.show-accessories');
const showClothing = document.querySelectorAll('.show-clothing');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');

const getGoods = async () => {					//получаем массив со всеми товарами
	const result = await fetch('db/db.json');	//получаем фич, который будет искать массив
	if (!result.ok) {								//если с результатом что-то не в порядке
		throw 'Ошибочка вышла:' + result.status		//выдаёт ошибку
	}
	return await result.json();						//а если всё в порядке - возвращает нам результат
}													//await - тормозит функцию, выдаёт не процесс, а результат
const cart = {
	cartGoods: [],
	renderCart(){
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({ id, name, price, count }) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
				<td>${name}</td>
 				<td>${price}</td>
 				<td><button class="cart-btn-minus">-</button></td>
 				<td>${count}</td>
 				<td><button class="cart-btn-plus">+</button></td>
 				<td>${price * count}$</td>
 				<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood);
		});

		const totalPrice = this.cartGoods.reduce((sum, item) => {
			return sum + item.price * item.count;
		}, 0);

		cardTableTotal.textContent = totalPrice + '$';
	},
	deleteGood(id) {
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
	},
	minusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deleteGood(id)
				} else {
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
	},
	plusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				item.count++;
				break;
			}
		}
		this.renderCart();
	},
	addCartGoods(id){
		const goodItem = this.cartGoods.find(item => item.id === id);
		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then( ({ id, name, price }) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
				});
		}
	},
};
document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart');
	if (addToCart) {
		cart.addCartGoods(addToCart.dataset.id)
	}
})
cartTableGoods.addEventListener('click', event => {
	const target = event.target;
	if (target.classList.contains('cart-btn-delete')) {
		const id = target.closest('.cart-item').dataset.id;
		cart.deleteGood(id);
	}
	if (target.classList.contains('cart-btn-minus')) {
		const id = target.closest('.cart-item').dataset.id;
		cart.minusGood(id);
	}
	if (target.classList.contains('cart-btn-plus')) {
		const id = target.closest('.cart-item').dataset.id;
		cart.plusGood(id);
	}
});
const openModal = () => {
	cart.renderCart();
	modalCart.classList.add('show');
};
const closeModal = () => {
	modalCart.classList.remove('show');
};
buttonCart.addEventListener('click', openModal);
modalCart.addEventListener('click', event => {
	const target = event.target;

	if (target.classList.contains('overlay') || target.classList.contains('modal-close')) {
		closeModal();
	}
})
//scroll smooth
{
	const scrollLinks = document.querySelectorAll('a.scroll-link');
// цикл
// 	for (let i = 0; i < scrollLinks.length; i++) {
// 		scrollLinks[i].addEventListener('click', function (event) {
// 			event.preventDefault(); 									//отмена стандартного браузерного поведения
// 			const id = scrollLinks[i].getAttribute('href'); 			//i - item - достали аттрибут
// 			document.querySelector(id).scrollIntoView({ 				//а здесь мы добавляем объект
// 				behavior: 'smooth',										// и здесь прописываем его описание
// 				block: 'start',
// 			})
// 		});
// 	}
	//другой вариант цикла - for of
	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', event => {
			event.preventDefault(); 													//отмена стандартного браузерного поведения
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({ 							//а здесь мы добавляем объект
				behavior: 'smooth',														// и здесь прописываем его описание
				block: 'start',
			})
		});
	}
}
// goods
//получение данных
getGoods().then(function (data) {					//then - даёт следующую команду, которая будет выполнена сразу после предыдущей
	console.log(data)								//вывели данные в консоль
});
//создание и выведение карточек
//создание самой карточки
const createCard = function ({ label, name, img, price, description, id }) {		//функция создания (чего - карточки)
	const card = document.createElement('div'); 		//создаём(create) карточку с классом div
	card.className = 'col-lg-3 col-sm-6'						//добавляем стили
	//или же можно было сделать так:
	// card.classList.add('col-lg-3', 'col-sm-6', ...);
	card.innerHTML = /*innerHTML - для вставления HTML вёрстки в код, `` - шаблонные строки*/ `				
		<div class="goods-card">
			${label ? 
				`<span class="label">${label}</span>` : 
					''}
			<img src="db/${img}" alt="${name}" class="goods-image">
			<h3 class="goods-title">${name}</h3>
			<p class="goods-description">${description}</p>										
			<button class="button goods-card-btn add-to-cart" data-id="${id}">
				<span class="button-price">$${price}</span>
			</button>
		</div>
	`;
	return card;
};
//выведение карточки на веб-страницу
const renderCards = function(data) {
	longGoodsList.textContent = ''; 								//очищение, удаление всего уже имеющегося контента на странице, быстро и безболезненно
	const cards = data.map(createCard);								//перебирает все элементы, выбирает фунцкию создания

	// cards.forEach(function(card) {					//forEach перебирает массив элементов
	// 	longGoodsList.append(card)						//append - добавить, вставить; отправляет (объект) на страницу вёрстки
	// })

	longGoodsList.append(...cards)						//добавляет карточки
	document.body.classList.add('show-goods')
};
const showAll = function(event) {
	event.preventDefault();
	getGoods().then(renderCards);
}
viewAll.forEach(elem => {
	elem.addEventListener('click', event => {
		event.preventDefault();
		getGoods().then(renderCards);
	});
});
//фильтрование объектов
const filterCards = function(field, value) {
	getGoods()
		.then(data => data.filter(good => good[field] === value))
		.then(renderCards);
};
navigationLink.forEach(link => {
	link.addEventListener('click', event => {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	})
});
showAccessories.forEach(item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		filterCards('category', 'Accessories');
	});
});
showClothing.forEach(item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		filterCards('category', 'Clothing');
	});
});









// const arr = [{									//создали массив с объектами из файла json
// 	"id": "003",
// 	"img": "img/61SVZdHi1SL.jpg",
// 	"name": "TOMS Women's Alpargata Loafer",
// 	"label": "Bestseller",
// 	"description": "Red",
// 	"price": "219",
// 	"category": "Shoes",
// 	"gender": "Womens"
// }, {"id": "003",
// 	"img": "img/61SVZdHi1SL.jpg",
// 	"name": "TOMS Women's Alpargata Loafer",
// 	"label": "Bestseller",
// 	"description": "Red",
// 	"price": "219",
// 	"category": "Shoes",
// 	"gender": "Womens"
// },
// 	{"id": "003",
// 	"img": "img/61SVZdHi1SL.jpg",
// 	"name": "TOMS Women's Alpargata Loafer",
// 	"label": "Bestseller",
// 	"description": "Red",
// 	"price": "219",
// 	"category": "Shoes",
// 	"gender": "Womens"
// 	}
// ]
//
// renderCards(arr)							//вызываем объекты из массива