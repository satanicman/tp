/*
* 2007-2016 PrestaShop
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author PrestaShop SA <contact@prestashop.com>
*  @copyright  2007-2016 PrestaShop SA
*  @license    http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*/

$(document).ready(function(){
	animation();
	$('#home-page-tabs li:first, #index .tab-content ul:first').addClass('active');
	$('.slick.manufacturer').slick({
		infinite: true,
		slidesToShow: 7,
		slidesToScroll: 1,
		prevArrow: '<button type="button" class="slick-prev"><i class="icon manufacturer-prev-icon"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="icon manufacturer-next-icon"></i></button>'
	});
	$('.slick.news').slick({
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		prevArrow: '<button type="button" class="slick-prev"><i class="icon news-prev-icon"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="icon news-next-icon"></i></button>'
	});
	$(window).scroll(function() {
		animation();
	});
});

function animation() {
	var block = $('.animation_block'),
		wTop = $(window).scrollTop() - 50,
		outerHeight = $(window).outerHeight();
	block.children('.noactive, .active').each(function() {
		var that = $(this),
			top = that.offset().top
			eHeight = that.outerHeight();
		if((wTop >= top || (wTop + outerHeight) >= top))
			that.removeClass('noactive').addClass('active');
		else
			that.removeClass('active').addClass('noactive');
	});
}