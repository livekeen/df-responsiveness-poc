// bug fixing: .css({'background-color': 'blue', 'opacity': '.5'})
// Actions

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


// Toolbar Tabbing Functionality

FormatToolbar = function (domNode) {
  this.domNode = domNode;
  this.firstItem = null;
  this.lastItem = null;

  this.toolbarItems = [];
  
  this.start = null;
  this.end = null;
  this.ourClipboard = '';
  this.selected = null;


};



/**
 * @desc
 *  Focus on the specified item
 *
 * @param element
 *  The item to focus on
 */
FormatToolbar.prototype.setFocusItem = function (item) {
  for (var i = 0; i < this.toolbarItems.length; i++) {
    this.toolbarItems[i].domNode.setAttribute('tabindex', '-1');
  }

  item.domNode.setAttribute('tabindex', '0');
  item.domNode.focus();
};

FormatToolbar.prototype.setFocusToNext = function (currentItem) {
  var index, newItem;

  if (currentItem === this.lastItem) {
    newItem = this.firstItem;
  }
  else {
    index = this.toolbarItems.indexOf(currentItem);
    newItem = this.toolbarItems[index + 1];
  }
  this.setFocusItem(newItem);
};

FormatToolbar.prototype.setFocusToPrevious = function (currentItem) {
  var index, newItem;

  if (currentItem === this.firstItem) {
    newItem = this.lastItem;
  }
  else {
    index = this.toolbarItems.indexOf(currentItem);
    newItem = this.toolbarItems[index - 1];
  }
  this.setFocusItem(newItem);
};

FormatToolbar.prototype.setFocusToFirst = function (currentItem) {
  this.setFocusItem(this.firstItem);
};

FormatToolbar.prototype.setFocusToLast = function (currentItem) {
  this.setFocusItem(this.lastItem);
};

FormatToolbar.prototype.hidePopupLabels = function () {
  var tps = this.domNode.querySelectorAll('button .popup-label');
  tps.forEach(function (tp) {tp.classList.remove('show');});
};


FormatToolbarItem = function (domNode, toolbar) {
  this.domNode = domNode;
  this.toolbar = toolbar;
  this.buttonAction = '';
  this.value = '';
  this.popupLabelNode = null;
  this.hasHover = false;
  this.popupLabelDelay = 800;


  this.keyCode = Object.freeze({
    'TAB': 9,
    'ENTER': 13,
    'ESC': 27,
    'SPACE': 32,
    'PAGEUP': 33,
    'PAGEDOWN': 34,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });
};

FormatToolbarItem.prototype.init = function () {

  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
  this.domNode.addEventListener('mouseover', this.handleMouseOver.bind(this));
  this.domNode.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

};							

FormatToolbarItem.prototype.isPressed = function () {
  return this.domNode.getAttribute('aria-pressed')  === 'true';
};

FormatToolbarItem.prototype.setPressed = function () {
  this.domNode.setAttribute('aria-pressed', 'true');
};

FormatToolbarItem.prototype.resetPressed = function () {
  this.domNode.setAttribute('aria-pressed', 'false');
};


FormatToolbarItem.prototype.setChecked = function () {
  this.domNode.setAttribute('aria-checked', 'true');
  this.domNode.checked = true;

};

FormatToolbarItem.prototype.resetChecked = function () {
  this.domNode.setAttribute('aria-checked', 'false');
  this.domNode.checked = false;
};

FormatToolbarItem.prototype.disable = function () {
  this.domNode.setAttribute('aria-disabled', 'true');
};

FormatToolbarItem.prototype.enable = function () {
  this.domNode.removeAttribute('aria-disabled');
};



FormatToolbarItem.prototype.handleBlur = function (event) {
  this.toolbar.domNode.classList.remove('focus');

};

FormatToolbarItem.prototype.handleFocus = function (event) {
  this.toolbar.domNode.classList.add('focus');

};

FormatToolbarItem.prototype.handleMouseLeave = function (event) {
  this.hasHover = false;
};

FormatToolbarItem.prototype.handleMouseOver = function (event) {
  this.hasHover = true;
};

FormatToolbarItem.prototype.handleKeyDown = function (event) {
  var flag = false;

	
  switch (event.keyCode) {

    case this.keyCode.ENTER:
    case this.keyCode.SPACE:
      if ((this.buttonAction !== '')) {
        this.toolbar.activateItem(this);
        
      }
      break;

    case this.keyCode.RIGHT:
      this.toolbar.setFocusToNext(this);
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.toolbar.setFocusToPrevious(this);
      flag = true;
      break;

    case this.keyCode.HOME:
      this.toolbar.setFocusToFirst(this);
      flag = true;
      break;

    case this.keyCode.END:
      this.toolbar.setFocusToLast(this);
      flag = true;
      break;

    case this.keyCode.UP:
      // to be implemented with drop down menu
      break;
    case this.keyCode.DOWN:
      // to be implemented with drop down menu
      break;
    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
	

};

FormatToolbarItem.prototype.handleClick = function (e) {
  this.toolbar.setFocusItem(this);
  this.toolbar.activateItem(this);
};

FormatToolbar.prototype.init = function () {
  var i, items, toolbarItem, menuButton;

  items = this.domNode.querySelectorAll('.toolbar__button');

	for (i = 0; i < items.length; i++) {

    toolbarItem = new FormatToolbarItem(items[i], this);
    toolbarItem.init();
		
    if (i === 0) {
      this.firstItem = toolbarItem;
    }
    this.lastItem = toolbarItem;
    this.toolbarItems.push(toolbarItem);

  }	
};


// Initialize toolbars

/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
* ARIA Toolbar Examples
* @function onload
* @desc Initialize the toolbar example once the page has loaded
*/

window.addEventListener('load', function () {
  var toolbars = document.querySelectorAll('[role="toolbar"].toolbar');

  for (var i = 0; i < toolbars.length; i++) {
    var toolbar = new FormatToolbar(toolbars[i]);

    toolbar.init();
  }
});