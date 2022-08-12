let isContactOpen = false;
let isMapOpen = false;
////////////////////////////////////// dodaj funkciju da ispise ... ako je naslov vijesti predugacak!

// Box shadow animation for card flipping
const boxShadowController = (x) => {

	let element = undefined;

	// if the map reset button gets pressed
	if(x.currentTarget.getAttribute('id') === 'map-tile-reset')
		element = $('.location-shadow')[0]

	// the element's current target is going to be HTMLDocument
	// if it gets clicked through JQuery apparently
	if(!element)
		element = (typeof x.currentTarget !== HTMLDocument)? x.currentTarget : x.target;


	// calculate the spread and blur
	let spread = $(window).width() < 992 ? 1 : 2;
	let blur = $(window).width() < 992 ? 5 : 10;

	// starting value for the opacity
	let i = 1;

	const remove = setInterval(() => {
		if (i >= 0) {
			// decrease the box shadow opacity and its visibility based on the iterator
			element.style.boxShadow = `0 0 ${Math.ceil(blur * i)}px ${Math.ceil(
				spread * i
			)}px rgba(30, 92, 172, ${i})`;

			// step
			i -= 0.1;
		}
	}, 10);

	// first wait for 300ms to create a more realistic shadowing effect
	const add = setTimeout(() => {
		// stop removing the shadow so that we can start adding it
		clearInterval(remove);

		// remove the class to properly reset it later
		element.classList.remove('tile-box-shadow');

		// set the iterator/opacity to the correct value due to floating point errors
		i = 0;

		setInterval(() => {
			if (i <= 1) {
				// increase shadow and its visibility
				element.style.boxShadow = `0 0 ${Math.ceil(
					blur * i
				)}px ${Math.ceil(spread * i)}px rgba(30, 92, 172, ${i})`;
				i += 0.05;
			}
		}, 20);
	}, 300);

	// reset the class
	setTimeout(() => {
		element.classList.add('tile-box-shadow');
		clearInterval(add);
	}, 500);
};

// Map tile flipping functions
const showMap = () => {

	// if the map is not yet opened
	if(!isMapOpen){

		// flip the tile
		$('#location-tile').flip(true);

		// prevent the click handler being called from hideMap()
		$("#location-tile").unbind('click');

		// bring back the shadow controller you just removed
		$('.tile-box').click(boxShadowController);

		// toggle the bool
		isMapOpen = true;
	}
}

const hideMap = () => {

	// if the map is opened
	if(isMapOpen){

		// flip the tile
		$('#location-tile').flip(false);

		// toggle the bool
		isMapOpen = false;

		// abuse the event loop to first flip the card
		// and THEN re-enable the onclick handler
		setTimeout(() => {
			$("#location-tile").click(showMap);
		}, 0);
	}
}

$(document).ready(function () {

	// initialise the Flip plugin
	$('.classic-flip').flip();

	// force the flip through JS
	$('#location-tile').flip({
		trigger: 'manual'
	});

	// location tile flip animations
	$("#location-tile").click(showMap);
	$('#map-tile-reset').click(hideMap);

	// assign the box shadow animation on every click
	$('.tile-box').click(boxShadowController);

	$('#map-tile-reset').click(boxShadowController);

	// toggle contacts for the auto-scroll-to-contact animation
	$('#chat-tile').click(() => {
		isContactOpen = !isContactOpen;
	});

	// the auto-scroll-to-contact animation
	$('#contact-btn').on('click', () => {
		// get the DOM element version of the JQuery #chat-tile object
		let element =
			$(window).width() < 768
				? $('#chat-tile')[0]
				: $('#tile-section')[0];

		// set a larger timeout since it takes more time to scroll
		// on mobile devices
		let timeout = $(window).width() < 768 ? 1200 : 1000;

		// smooth scrolling settings and animation
		element.scrollIntoView({ behavior: 'smooth' });

		setTimeout(() => {}, timeout);

		// wait longer than the timeout for the check to properly go through
		setTimeout(() => {
			// if the contact is not already open
			// click the tile once the page scrolled down
			if (!isContactOpen) {
				$('#chat-tile').click();
			}
		}, timeout + 1);
	});

	$(window).resize(function () {
		showMenuBtn();
	});

	$(window).trigger('resize');

	// open menu on mobile
	function showMenuBtn() {
		if ($(window).width() < 1199.98) {
			$('.open_menu').addClass('d-block');
			$('header nav').addClass('d-none');
			$('.navigation_mobile').removeClass('opened');
		} else {
			$('.open_menu').removeClass('d-block');
			$('header nav').removeClass('d-none');
			$('.navigation_mobile').removeClass('opened');
		}
	}

	$('.open_menu').click(function (event) {
		event.preventDefault();
		$('.navigation_mobile').addClass('opened');
	});

	$(
		'.close_menu, header, section, footer, .navigation_mobile .inner a'
	).click(function (event) {
		$('.navigation_mobile').removeClass('opened');
	});

	// Enable AOS plugin (blocks animations)

	if (typeof AOS !== 'undefined') {
		AOS.init({
			easing: 'ease-out-cubic',
			offset: 50
		});
		setTimeout(function () {
			if ($('.slick-initialized').length > 0) {
				AOS.refreshHard();
			}
		}, 200);
	}

	//LeafletJS map init

	var mymap = L.map('mapid').setView([45.7982412, 15.9465204], 15);

	L.tileLayer(
		'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
		{
			attribution:
				'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: 20,
			id: 'mapbox/streets-v11',
			tileSize: 512,
			zoomOffset: -1,
			accessToken:
				'pk.eyJ1IjoicG9zYXJpY2YiLCJhIjoiY2tyYjg2ZGo4NHF0NDJ2cXBxMHczbWNyMSJ9.rdYGqPU4TJfYoOcMjQpeLQ'
		}
	).addTo(mymap);
	var marker = L.marker([45.7982412, 15.9465204]).addTo(mymap);
}); // document.ready end
