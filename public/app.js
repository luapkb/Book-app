'use strict'

//Popups for each book
$('.select-book-button').on('click', function(){
  $(this).siblings('section').toggle()
});
