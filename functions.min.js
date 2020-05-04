// bug fixing: .css({'background-color': 'blue', 'opacity': '.5'})

$(document).ready(function()
  {
    $('.content .content__item:first-child .content__actions').addClass("isActive"); // Adds action bar to all first nodes

    $('.content__item').hover(
      function(){ 
        // $(this).addClass("isActive"); // Add an active class to the hovered area
        $(this).children(".content__actions").addClass("isActive"); // Add an active class to the action bar
      },
      function() {
        // $(this).removeClass("isActive"); // Remove an active class to the hovered area
        $(this).children(".content__actions").removeClass("isActive"); // Remove an active class to the action bar
        $('.content .content__item:first-child .content__actions').addClass("isActive"); // Quickfix to prevent all original action bars from hiding on hover
      }
   )
 });