const mySwiper = new Swiper('.swiper-container', {
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
const modalClose = document.querySelector('.modal-close');

const openModal = function() {
	modalCart.classList.add('show')
};
const closeModal = function() {
	modalCart.classList.remove('show');
};

buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);


//scroll smooth

{
	const scrollLinks = document.querySelectorAll('a.scroll-link');
// цикл
	for (let i = 0; i < scrollLinks.length; i++) {
		scrollLinks[i].addEventListener('click', function (event) {
			event.preventDefault(); //отмена стандартного браузерного поведения
			const id = scrollLinks[i].getAttribute('href'); //i - item - достали аттрибут
			document.querySelector(id).scrollIntoView({ 			//а здесь мы добавляем объект
				behavior: 'smooth',										// и здесь прописываем его описание
				block: 'start',
			})
		});
	}
}








