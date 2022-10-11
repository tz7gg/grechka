window.addEventListener('load', () => {
    init()
})

function init() {

    let slider
    let offset = 0
    let count
    let activeSlide
    const store = localStorage
    const sliderWrap = document.querySelector('.swiper-wrapper')
    const des = document.querySelector('.slider__wrapper__description')
    let likeCount = document.querySelector('#likeCount')
    const likeBtn = document.querySelector('#likeBtn')

    APICars(offset)

    function APICars(qurryOffset) {
        fetch(`https://private-anon-0d3a31f55c-grchhtml.apiary-mock.com/slides?offset=${qurryOffset}&limit=3`)
            .then((res) => res.json())
            .then(
                (result) => {
                    if (offset === 0) {
                        count = result.countAll
                        initSlider(result.data)
                        offset += 3
                    } else {
                        addSlides(result.data)
                    }
                },
                (error) => {
                    const data = {
                        desc: '////////////////////',
                        id: null,
                        imgUrl: 'assets/images/error.png',
                        title: 'error'
                    }
                    initSlider(data, true)
                }
            );
    }

    function APILike(slide) {
        fetch(`https://private-anon-ad13a8cebd-grchhtml.apiary-mock.com/slides/${slide.dataset.id}/like`, {
                method: 'POST'
            })
            .then((res) => res.json())
            .then(
                (result) => {
                    likeBtn.classList.add('active')
                    slide.dataset.like = +slide.dataset.like + 1
                    likeCount.innerText = slide.dataset.like
                    slide.dataset.isLike = '1'
                    popUp(result.title, result.desc)
                    store.setItem(slide.dataset.title, slide.dataset.id)

                },
                (error) => {
                    popUp('ERROR', 'Unknown error')
                }
            );
    }

    function initSlider(data, error = false) {
        if (!error) {
            let content = ''
            data.forEach(element => {
                let isLiked = store.getItem(element.title)
                content += `
			<div class="swiper-slide" data-desc='${element.desc}' data-like=${isLiked ? element.likeCnt + 1 : element.likeCnt} data-id=${element.id} data-is-like=${isLiked ? 1 : 0} data-title='${element.title}'>
				<div class="slider__wrapper__item" style="background-image: url(${element.imgUrl})">
					<div class="slider__wrapper__item__title">${element.title}</div>
					<div class="slider__wrapper__item__tooltip">${element.title}</div>
					<div class="slider__wrapper__item__devider">
						<svg width="1792" height="2" viewBox="0 0 1792 2" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 1L1792 1.00016" stroke="url(#paint0_linear_7_16)" stroke-width="2"/>
							<defs>
							<linearGradient id="paint0_linear_7_16" x1="0" y1="1" x2="1779" y2="1" gradientUnits="userSpaceOnUse">
							<stop stop-color="#F36A1D" stop-opacity="0"/>
							<stop offset="0.48582" stop-color="#F36A1D"/>
							<stop offset="1" stop-color="#F36A1D" stop-opacity="0"/>
							</linearGradient>
							</defs>
						</svg>
					</div>					
				</div>
			</div>
			`
            });
            sliderWrap.innerHTML = content
            slider = new Swiper('.swiper-container', {
                allowTouchMove: false,
                speed: 1400,
                navigation: {
                    nextEl: '.slider__wrapper__right',
                    prevEl: '.slider__wrapper__left'
                },
                effect: 'creative',
                creativeEffect: {
                    prev: {
                        shadow: true,
                        translate: ['-50%', 0, -1],
                    },
                    next: {
                        translate: ['100%', 0, 0]
                    }
                },
                on: {
                    init: function() {
                        activeSlide = document.querySelector('.swiper-slide-active')
                        des.innerText = activeSlide.dataset.desc
                        des.classList.add('active')
                        likeCount.innerText = activeSlide.dataset.like
                        if (activeSlide.dataset.isLike == '0') {
                            likeBtn.classList.remove('disable', 'active')
                        } else {
                            likeBtn.classList.add('disable', 'active')
                        }
                    },
                    slideChangeTransitionStart: function() {
                        activeSlide = document.querySelector('.swiper-slide-active')
                        des.innerText = activeSlide.dataset.desc
                        des.classList.remove('active')
                        setTimeout(() => {
                            des.classList.add('active')
                        }, 700);
                        likeCount.innerText = activeSlide.dataset.like
                        if (activeSlide.dataset.isLike == '0') {
                            likeBtn.classList.remove('disable', 'active')
                        } else {
                            likeBtn.classList.add('disable', 'active')
                        }
                    }
                }
            })
            const rigthBtn = document.querySelector('.slider__wrapper__right')
            rigthBtn.onclick = () => {
                if (slider.realIndex + 1 == offset && offset <= count) {
                    APICars(offset)
                    offset += 3
                }
            }
            likeBtn.onclick = () => {
                if (!likeBtn.classList.contains('disable')) {
                    likeBtn.classList.add('disable')
                    APILike(activeSlide)
                }
            }
        } else {
            sliderWrap.innerHTML = `
			<div class="swiper-slide" data-desc='${data.desc}' data-like=${data.likeCnt} data-id=${data.id} data-is-like=0 data-title='${data.title}'>
				<div class="slider__wrapper__item" style="background-image: url(${data.imgUrl})">
					<div class="slider__wrapper__item__title" style="opacity: 1;">${data.title}</div>
					<div class="slider__wrapper__item__tooltip">${data.title}</div>
					<div class="slider__wrapper__item__devider">
						<svg width="1792" height="2" viewBox="0 0 1792 2" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 1L1792 1.00016" stroke="url(#paint0_linear_7_16)" stroke-width="2"/>
							<defs>
							<linearGradient id="paint0_linear_7_16" x1="0" y1="1" x2="1779" y2="1" gradientUnits="userSpaceOnUse">
							<stop stop-color="#F36A1D" stop-opacity="0"/>
							<stop offset="0.48582" stop-color="#F36A1D"/>
							<stop offset="1" stop-color="#F36A1D" stop-opacity="0"/>
							</linearGradient>
							</defs>
						</svg>
					</div>					
				</div>
			</div>
			`
            des.classList.add('active')
            des.innerText = data.desc
        }
    }

    function addSlides(data) {
        data.forEach(element => {
            let isLiked = store.getItem(element.title)
            slider.appendSlide(`
            <div class="swiper-slide" data-desc='${element.desc}' data-like=${isLiked ? element.likeCnt + 1 : element.likeCnt} data-id=${element.id} data-is-like=${isLiked ? 1 : 0} data-title='${element.title}'>
				<div class="slider__wrapper__item" style="background-image: url(${element.imgUrl})">
					<div class="slider__wrapper__item__title">${element.title}</div>
					<div class="slider__wrapper__item__tooltip">${element.title}</div>
					<div class="slider__wrapper__item__devider">
						<svg width="1792" height="2" viewBox="0 0 1792 2" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 1L1792 1.00016" stroke="url(#paint0_linear_7_16)" stroke-width="2"/>
							<defs>
							<linearGradient id="paint0_linear_7_16" x1="0" y1="1" x2="1779" y2="1" gradientUnits="userSpaceOnUse">
							<stop stop-color="#F36A1D" stop-opacity="0"/>
							<stop offset="0.48582" stop-color="#F36A1D"/>
							<stop offset="1" stop-color="#F36A1D" stop-opacity="0"/>
							</linearGradient>
							</defs>
						</svg>
					</div>					
				</div>
			</div>
            `)
        })
        slider.update()
    }
}