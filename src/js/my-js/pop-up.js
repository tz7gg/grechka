 function popUp(title, text) {
     const popUp = document.querySelector('.pop-up')
     const popUpTitle = document.querySelector('.pop-up__wrap__content__title')
     const popUptext = document.querySelector('.pop-up__wrap__content__text')

     popUpTitle.innerText = title
     popUptext.innerText = text
     popUp.classList.add('active')

     document.body.style.overflow = 'hidden';

     popUp.onclick = (e) => {
         if (e.target.classList.contains('pop-up__wrap') || e.target.classList.contains('pop-up__wrap__content__icon')) {
             popUp.classList.remove('active')
             document.body.style.overflow = 'auto';
         }
     }
 }