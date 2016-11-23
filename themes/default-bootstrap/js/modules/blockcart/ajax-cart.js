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

//================================================================================

/*
							$('.cart_quantity_up').off('click').on('click', function(e){
								e.preventDefault();
								upQuantity($(this).attr('id').replace('cart_quantity_up_', ''));
								$('#' + $(this).attr('id').replace('_up_', '_down_')).removeClass('disabled');
							});
							$('.cart_quantity_down').off('click').on('click', function(e){
								e.preventDefault();
								downQuantity($(this).attr('id').replace('cart_quantity_down_', ''));
							});*/

//================================================================================

	ajaxCart.overrideButtonsInThePage();

	$(document).on('click', '.block_cart_collapse', function(e){
		e.preventDefault();
		ajaxCart.collapse();
	});
	$(document).on('click', '.block_cart_expand', function(e){
		e.preventDefault();
		ajaxCart.expand();
	});

	var current_timestamp = parseInt(new Date().getTime() / 1000);

	if (typeof $('.ajax_cart_quantity').html() == 'undefined' || (typeof generated_date != 'undefined' && generated_date != null && (parseInt(generated_date) + 30) < current_timestamp))
		ajaxCart.refresh();

	/* roll over cart */
	var cart_block = new HoverWatcher('#header .cart_block');
	var shopping_cart = new HoverWatcher('#header .shopping_cart');
	var is_touch_enabled = false;

	if ('ontouchstart' in document.documentElement)
		is_touch_enabled = true;

	$(document).on('click', '#header .shopping_cart > a:first', function(e){
		e.preventDefault();
		e.stopPropagation();

		// Simulate hover when browser says device is touch based
		if (is_touch_enabled)
		{
			if ($(this).next('.cart_block:visible').length && !cart_block.isHoveringOver())
				$("#header .cart_block").stop(true, true).slideUp(450);
			else if (ajaxCart.nb_total_products > 0 || parseInt($('.ajax_cart_quantity').html()) > 0)
				$("#header .cart_block").stop(true, true).slideDown(450);
			return;
		}
		else
			window.location.href = $(this).attr('href');
	});

	$("#header .shopping_cart a:first").hover(
		function(){
			if (ajaxCart.nb_total_products > 0 || parseInt($('.ajax_cart_quantity').html()) > 0)
				$("#header .cart_block").stop(true, true).slideDown(450);
		},
		function(){
			setTimeout(function(){
				if (!shopping_cart.isHoveringOver() && !cart_block.isHoveringOver())
					$("#header .cart_block").stop(true, true).slideUp(450);
			}, 200);
		}
	);

	$("#header .cart_block").hover(
		function(){
		},
		function(){
			setTimeout(function(){
				if (!shopping_cart.isHoveringOver())
					$("#header .cart_block").stop(true, true).slideUp(450);
			}, 200);
		}
	);

	$(document).on('click', '.delete_voucher', function(e){
		e.preventDefault();
		$.ajax({
			type: 'POST',
			headers: { "cache-control": "no-cache" },
			async: true,
			cache: false,
			url:$(this).attr('href') + '?rand=' + new Date().getTime()
		});
		$(this).parent().parent().remove();
		ajaxCart.refresh();
		if ($('body').attr('id') == 'order' || $('body').attr('id') == 'order-opc')
		{
			if (typeof(updateAddressSelection) != 'undefined')
				updateAddressSelection();
			else
				location.reload();
		}
	});

	$(document).on('click', '#cart_navigation input', function(e){
		$(this).prop('disabled', 'disabled').addClass('disabled');
		$(this).closest("form").get(0).submit();
	});

	$(document).on('click', '#layer_cart .cross, #layer_cart .continue, .layer_cart_overlay', function(e){
		e.preventDefault();
		$('.layer_cart_overlay').hide();
		$('#layer_cart').fadeOut('fast');
	});

	$('#columns #layer_cart, #columns .layer_cart_overlay').detach().prependTo('#columns');
});

//================================================================================================================================================







/*
								function upQuantity(id, qty)
								{
									if (typeof(qty) == 'undefined' || !qty)
										qty = 1;
									var customizationId = 0;
									var productId = 0;
									var productAttributeId = 0;
									var id_address_delivery = 0;
									var ids = 0;
									ids = id.split('_');
									productId = parseInt(ids[0]);
									if (typeof(ids[1]) !== 'undefined')
										productAttributeId = parseInt(ids[1]);
									if (typeof(ids[2]) !== 'undefined' && ids[2] !== 'nocustom')
										customizationId = parseInt(ids[2]);
									if (typeof(ids[3]) !== 'undefined')
										id_address_delivery = parseInt(ids[3]);

									$.ajax({
										type: 'POST',
										headers: { "cache-control": "no-cache" },
										url: baseUri + '?rand=' + new Date().getTime(),
										async: true,
										cache: false,
										dataType: 'json',
										data: 'controller=cart'
											+ '&ajax=true'
											+ '&add=true'
											+ '&getproductprice=true'
											+ '&summary=true'
											+ '&id_product=' + productId
											+ '&ipa=' + productAttributeId
											+ '&id_address_delivery=' + id_address_delivery
											+ ((customizationId !== 0) ? '&id_customization=' + customizationId : '')
											+ '&qty=' + qty
											+ '&token=' + static_token
											+ '&allow_refresh=1',
										success: function(jsonData)
										{
											if (jsonData.hasError)
											{
												var errors = '';
												for(var error in jsonData.errors)
													//IE6 bug fix
													if(error !== 'indexOf')
														errors += $('<div />').html(jsonData.errors[error]).text() + "\n";
												if (!!$.prototype.fancybox)
												    $.fancybox.open([
											        {
											            type: 'inline',
											            autoScale: true,
											            minHeight: 30,
											            content: '<p class="fancybox-error">' + errors + '</p>'
											        }],
													{
												        padding: 0
												    });
												else
												    alert(errors);
												$('input[name=quantity_'+ id +']').val($('input[name=quantity_'+ id +'_hidden]').val());
											}
											else
											{
												if (jsonData.refresh)
													window.location.href = window.location.href;
												updateCartSummary(jsonData.summary);
												if (window.ajaxCart != undefined)
													ajaxCart.updateCart(jsonData);
												if (customizationId !== 0)
													updateCustomizedDatas(jsonData.customizedDatas);
												updateHookShoppingCart(jsonData.HOOK_SHOPPING_CART);
												updateHookShoppingCartExtra(jsonData.HOOK_SHOPPING_CART_EXTRA);
												if (typeof(getCarrierListAndUpdate) !== 'undefined')
													getCarrierListAndUpdate();
												if (typeof(updatePaymentMethodsDisplay) !== 'undefined')
													updatePaymentMethodsDisplay();
											}
										},
										error: function(XMLHttpRequest, textStatus, errorThrown) {
											if (textStatus !== 'abort')
											{
												error = "TECHNICAL ERROR: unable to save update quantity \n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus;
												if (!!$.prototype.fancybox)
												    $.fancybox.open([
											        {
											            type: 'inline',
											            autoScale: true,
											            minHeight: 30,
											            content: '<p class="fancybox-error">' + error + '</p>'
											        }],
													{
												        padding: 0
												    });
												else
												    alert(error);
											}
										}
									});
								}

								function downQuantity(id, qty)
								{
									var val = $('#layer_cart_product_quantity').text();
									var newVal = val;
									if(typeof(qty) == 'undefined' || !qty)
									{
										qty = 1;
										newVal = val - 1;
									}
									else if (qty < 0)
										qty = -qty;

									var customizationId = 0;
									var productId = 0;
									var productAttributeId = 0;
									var id_address_delivery = 0;
									var ids = 0;

									ids = id.split('_');
									productId = parseInt(ids[0]);
									if (typeof(ids[1]) !== 'undefined')
										productAttributeId = parseInt(ids[1]);
									if (typeof(ids[2]) !== 'undefined' && ids[2] !== 'nocustom')
										customizationId = parseInt(ids[2]);
									if (typeof(ids[3]) !== 'undefined')
										id_address_delivery = parseInt(ids[3]);

									if (newVal > 0 || $('#product_' + id + '_gift').length)
									{
										$.ajax({
											type: 'POST',
											headers: { "cache-control": "no-cache" },
											url: baseUri + '?rand=' + new Date().getTime(),
											async: true,
											cache: false,
											dataType: 'json',
											data: 'controller=cart'
												+ '&ajax=true'
												+ '&add=true'
												+ '&getproductprice=true'
												+ '&summary=true'
												+ '&id_product='+productId
												+ '&ipa='+productAttributeId
												+ '&id_address_delivery='+id_address_delivery
												+ '&op=down'
												+ ((customizationId !== 0) ? '&id_customization='+customizationId : '')
												+ '&qty='+qty
												+ '&token='+static_token
												+ '&allow_refresh=1',
											success: function(jsonData)
											{
												if (jsonData.hasError)
												{
													var errors = '';
													for(var error in jsonData.errors)
														//IE6 bug fix
														if(error !== 'indexOf')
															errors += $('<div />').html(jsonData.errors[error]).text() + "\n";
								                    if (!!$.prototype.fancybox)
								                        $.fancybox.open([
								                            {
								                                type: 'inline',
								                                autoScale: true,
								                                minHeight: 30,
								                                content: '<p class="fancybox-error">' + errors + '</p>'
								                            }],
								                            {
								                                padding: 0
								                            });
								                    else
								                        alert(errors);
													$('input[name=quantity_' + id + ']').val($('input[name=quantity_' + id + '_hidden]').val());
												}
												else
												{
													if (jsonData.refresh)
														window.location.href = window.location.href;
													updateCartSummary(jsonData.summary);

													if (window.ajaxCart !== undefined)
														ajaxCart.updateCart(jsonData);
													if (customizationId !== 0)
														updateCustomizedDatas(jsonData.customizedDatas);
													updateHookShoppingCart(jsonData.HOOK_SHOPPING_CART);
													updateHookShoppingCartExtra(jsonData.HOOK_SHOPPING_CART_EXTRA);

													if (newVal == 0)
														$('#product_' + id).hide();

													if (typeof(getCarrierListAndUpdate) !== 'undefined')
														getCarrierListAndUpdate();
													if (typeof(updatePaymentMethodsDisplay) !== 'undefined')
														updatePaymentMethodsDisplay();
												}
											},
											error: function(XMLHttpRequest, textStatus, errorThrown) {
												if (textStatus !== 'abort')
													alert("TECHNICAL ERROR: unable to save update quantity \n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus);
											}
										});

									}
									else
									{
										deleteProductFromSummary(id);
									}
								}
								function updateCartSummary(json)
								{
									var i;
									var nbrProducts = 0;
									var product_list = new Array();

									if (typeof json == 'undefined')
										return;

									$('div.alert-danger').fadeOut();

									for (i=0;i<json.products.length;i++)
										product_list[json.products[i].id_product + '_' + json.products[i].id_product_attribute + '_' + json.products[i].id_address_delivery] = json.products[i];

									if (!$('.multishipping-cart:visible').length)
									{
										for (i=0;i<json.gift_products.length;i++)
											if (typeof(product_list[json.gift_products[i].id_product + '_' + json.gift_products[i].id_product_attribute + '_' + json.gift_products[i].id_address_delivery]) !== 'undefined')
												product_list[json.gift_products[i].id_product + '_' + json.gift_products[i].id_product_attribute + '_' + json.gift_products[i].id_address_delivery].quantity -= json.gift_products[i].cart_quantity;
									}
									else
										for (i=0;i<json.gift_products.length;i++)
											if (typeof(product_list[json.gift_products[i].id_product + '_' + json.gift_products[i].id_product_attribute + '_' + json.gift_products[i].id_address_delivery]) == 'undefined')
												product_list[json.gift_products[i].id_product + '_' + json.gift_products[i].id_product_attribute + '_' + json.gift_products[i].id_address_delivery] = json.gift_products[i];

									for (i in product_list)
									{
										// if reduction, we need to show it in the cart by showing the initial price above the current one
										var reduction = product_list[i].reduction_applies;
										var reduction_type = product_list[i].reduction_type;
										var reduction_symbol = '';
										var initial_price_text = '';
										var initial_price = '';

										if (typeof(product_list[i].price_without_quantity_discount) !== 'undefined')
											initial_price = formatCurrency(product_list[i].price_without_quantity_discount, currencyFormat, currencySign, currencyBlank);

										var current_price = '';
										var product_total = '';
										var product_customization_total = '';

										if (priceDisplayMethod !== 0)
										{
											current_price = formatCurrency(product_list[i].price, currencyFormat, currencySign, currencyBlank);
											product_total = product_list[i].total;
											product_customization_total = product_list[i].total_customization;
										}
										else
										{
											current_price = formatCurrency(product_list[i].price_wt, currencyFormat, currencySign, currencyBlank);
											product_total = product_list[i].total_wt;
											product_customization_total = product_list[i].total_customization_wt;
										}

										var current_price_class ='price';
										var price_reduction = '';
										if (reduction && typeof(initial_price) !== 'undefined')
										{
											if (reduction_type == 'amount')
												price_reduction = product_list[i].reduction_formatted;
											else
											{
												var display_price = 0;
												if (priceDisplayMethod !== 0)
													display_price = product_list[i].price;
												else
													display_price = product_list[i].price_wt;

												price_reduction = ps_round((product_list[i].price_without_quantity_discount - display_price)/product_list[i].price_without_quantity_discount * -100);
												reduction_symbol = '%';
											}

											if (initial_price !== '' && product_list[i].price_without_quantity_discount > product_list[i].price)
											{
												initial_price_text = '<li class="price-percent-reduction small">&nbsp;'+price_reduction+reduction_symbol+'&nbsp;</li><li class="old-price">' + initial_price + '</li>';
												current_price_class += ' special-price';
											}
										}

										var key_for_blockcart = product_list[i].id_product + '_' + product_list[i].id_product_attribute + '_' + product_list[i].id_address_delivery;
										var key_for_blockcart_nocustom = product_list[i].id_product + '_' + product_list[i].id_product_attribute + '_' + ((product_list[i].id_customization && product_list[i].quantity_without_customization != product_list[i].quantity)? 'nocustom' : '0') + '_' + product_list[i].id_address_delivery;

										$('#product_price_' + key_for_blockcart).html('<li class="' + current_price_class + '">' + current_price + '</li>' + initial_price_text);
										if (typeof(product_list[i].customizationQuantityTotal) !== 'undefined' && product_list[i].customizationQuantityTotal > 0)
											$('#total_product_price_' + key_for_blockcart).html(formatCurrency(product_customization_total, currencyFormat, currencySign, currencyBlank));
										else
											$('#total_product_price_' + key_for_blockcart).html(formatCurrency(product_total, currencyFormat, currencySign, currencyBlank));
										if (product_list[i].quantity_without_customization != product_list[i].quantity)
											$('#total_product_price_' + key_for_blockcart_nocustom).html(formatCurrency(product_total, currencyFormat, currencySign, currencyBlank));

										$('input[name=quantity_' + key_for_blockcart_nocustom + ']').val(product_list[i].id_customization? product_list[i].quantity_without_customization : product_list[i].cart_quantity);
										$('input[name=quantity_' + key_for_blockcart_nocustom + '_hidden]').val(product_list[i].id_customization? product_list[i].quantity_without_customization : product_list[i].cart_quantity);
										if (typeof(product_list[i].customizationQuantityTotal) !== 'undefined' && product_list[i].customizationQuantityTotal > 0)
											$('#cart_quantity_custom_' + key_for_blockcart).html(product_list[i].customizationQuantityTotal);
										nbrProducts += parseInt(product_list[i].quantity);
									}

									// Update discounts
									var discount_count = 0;
									for(var e in json.discounts)
									{
										discount_count++;
										break;
									}

									if (!discount_count)
									{
										$('.cart_discount').each(function(){$(this).remove();});
										$('.cart_total_voucher').remove();
									}
									else
									{
										if ($('.cart_discount').length == 0)
										{
											location.reload();
											return;
										}

										if (priceDisplayMethod !== 0)
											$('#total_discount').html('-' + formatCurrency(json.total_discounts_tax_exc, currencyFormat, currencySign, currencyBlank));
										else
											$('#total_discount').html('-' + formatCurrency(json.total_discounts, currencyFormat, currencySign, currencyBlank));

										$('.cart_discount').each(function(){
											var idElmt = $(this).attr('id').replace('cart_discount_','');
											var toDelete = true;

											for (var i in json.discounts)
												if (json.discounts[i].id_discount == idElmt)
												{
													if (json.discounts[i].value_real !== '!')
													{
														if (priceDisplayMethod !== 0)
															$('#cart_discount_' + idElmt + ' td.cart_discount_price span.price-discount').html(formatCurrency(json.discounts[i].value_tax_exc * -1, currencyFormat, currencySign, currencyBlank));
														else
															$('#cart_discount_' + idElmt + ' td.cart_discount_price span.price-discount').html(formatCurrency(json.discounts[i].value_real * -1, currencyFormat, currencySign, currencyBlank));
													}
													toDelete = false;
												}
											if (toDelete)
												$('#cart_discount_' + idElmt + ', #cart_total_voucher').fadeTo('fast', 0, function(){ $(this).remove(); });
										});
									}

									// Block cart
									if (typeof(orderProcess) !== 'undefined' && orderProcess == 'order-opc' && !json.is_virtual_cart)
										$('.ajax_cart_shipping_cost').parent().find('.unvisible').show();

									if (json.total_shipping > 0)
									{
										if (priceDisplayMethod !== 0)
										{
											$('.cart_block_shipping_cost').html(formatCurrency(json.total_shipping_tax_exc, currencyFormat, currencySign, currencyBlank));
											$('.cart_block_wrapping_cost').html(formatCurrency(json.total_wrapping_tax_exc, currencyFormat, currencySign, currencyBlank));
											$('.cart_block_total').html(formatCurrency(json.total_price_without_tax, currencyFormat, currencySign, currencyBlank));
										}
										else
										{
											$('.cart_block_shipping_cost').html(formatCurrency(json.total_shipping, currencyFormat, currencySign, currencyBlank));
											$('.cart_block_wrapping_cost').html(formatCurrency(json.total_wrapping, currencyFormat, currencySign, currencyBlank));
											$('.cart_block_total').html(formatCurrency(json.total_price, currencyFormat, currencySign, currencyBlank));
										}
									}
									else
									{
										if (parseFloat(json.total_shipping) > 0)
											$('.ajax_cart_shipping_cost').text(jsonData.shippingCost);
										else if (json.carrier.id == null && typeof(toBeDetermined) !== 'undefined' && !json.free_ship)
											$('.ajax_cart_shipping_cost').html(toBeDetermined);
										else if (typeof(freeShippingTranslation) != 'undefined')
											$('.ajax_cart_shipping_cost').html(freeShippingTranslation);
									}

									$('.cart_block_tax_cost').html(formatCurrency(json.total_tax, currencyFormat, currencySign, currencyBlank));
									$('.ajax_cart_quantity').html(nbrProducts);

									// Cart summary
									$('#summary_products_quantity').html(nbrProducts + ' ');
									if (priceDisplayMethod !== 0)
										$('#total_product').html(formatCurrency(json.total_products, currencyFormat, currencySign, currencyBlank));
									else
										$('#total_product').html(formatCurrency(json.total_products_wt, currencyFormat, currencySign, currencyBlank));
									$('#total_price').html(formatCurrency(json.total_price, currencyFormat, currencySign, currencyBlank));
									$('#total_price_without_tax').html(formatCurrency(json.total_price_without_tax, currencyFormat, currencySign, currencyBlank));
									$('#total_tax').html(formatCurrency(json.total_tax, currencyFormat, currencySign, currencyBlank));

									$('.cart_total_delivery').show();
									if (json.total_shipping > 0)
									{
										if (priceDisplayMethod !== 0)
											$('#total_shipping').html(formatCurrency(json.total_shipping_tax_exc, currencyFormat, currencySign, currencyBlank));
										else
											$('#total_shipping').html(formatCurrency(json.total_shipping, currencyFormat, currencySign, currencyBlank));
									}
									else
									{
										if (json.carrier.id != null || json.free_ship)
										{
											$('#total_shipping').html(freeShippingTranslation);
											if (json.is_virtual_cart)
												$('.cart_total_delivery').hide();
										}
										if (!hasDeliveryAddress)
											$('.cart_total_delivery').hide();
									}

									if (json.total_wrapping > 0)
									{
										$('#total_wrapping').html(formatCurrency(json.total_wrapping, currencyFormat, currencySign, currencyBlank));
										$('#total_wrapping').parent().show();
									}
									else
									{
										$('#total_wrapping').html(formatCurrency(json.total_wrapping, currencyFormat, currencySign, currencyBlank));
										$('#total_wrapping').parent().hide();
									}
								}

								function deleteProductFromSummary(id)
								{
									var customizationId = 0;
									var productId = 0;
									var productAttributeId = 0;
									var id_address_delivery = 0;
									var ids = 0;
									ids = id.split('_');
									productId = parseInt(ids[0]);
									if (typeof(ids[1]) !== 'undefined')
										productAttributeId = parseInt(ids[1]);
									if (typeof(ids[2]) !== 'undefined' && ids[2] !== 'nocustom')
										customizationId = parseInt(ids[2]);
									if (typeof(ids[3]) !== 'undefined')
										id_address_delivery = parseInt(ids[3]);
									$.ajax({
										type: 'POST',
										headers: { "cache-control": "no-cache" },
										url: baseUri + '?rand=' + new Date().getTime(),
										async: true,
										cache: false,
										dataType: 'json',
										data: 'controller=cart'
											+ '&ajax=true&delete=true&summary=true'
											+ '&id_product='+productId
											+ '&ipa='+productAttributeId
											+ '&id_address_delivery='+id_address_delivery
											+ ((customizationId !== 0) ? '&id_customization=' + customizationId : '')
											+ '&token=' + static_token
											+ '&allow_refresh=1',
										success: function(jsonData)
										{
											if (jsonData.hasError)
											{
												var errors = '';
												for(var error in jsonData.errors)
													//IE6 bug fix
													if(error !== 'indexOf')
														errors += $('<div />').html(jsonData.errors[error]).text() + "\n";
																	if (!!$.prototype.fancybox)
																			$.fancybox.open([
																					{
																							type: 'inline',
																							autoScale: true,
																							minHeight: 30,
																							content: '<p class="fancybox-error">' + errors + '</p>'
																					}],
																					{
																							padding: 0
																					});
																	else
																			alert(errors);
											}
											else
											{
												if (jsonData.refresh)
												{
													location.reload();
													return;
												}
												if (parseInt(jsonData.summary.products.length) == 0)
												{
													if (typeof(orderProcess) == 'undefined' || orderProcess !== 'order-opc')
														document.location.href = document.location.href; // redirection
													else
													{
														$('#center_column').children().each(function() {
															if ($(this).attr('id') !== 'emptyCartWarning' && $(this).attr('class') !== 'breadcrumb' && $(this).attr('id') !== 'cart_title')
															{
																$(this).fadeOut('slow', function () {
																	$(this).remove();
																});
															}
														});
														$('#summary_products_label').remove();
														$('#emptyCartWarning').fadeIn('slow');
													}
												}
												else
												{
													$('#product_' + id).fadeOut('slow', function() {
														$(this).remove();
														cleanSelectAddressDelivery();
														if (!customizationId)
															refreshOddRow();
													});
													var exist = false;
													for (i=0;i<jsonData.summary.products.length;i++)
													{
														if (jsonData.summary.products[i].id_product == productId
															&& jsonData.summary.products[i].id_product_attribute == productAttributeId
															&& jsonData.summary.products[i].id_address_delivery == id_address_delivery
															&& (parseInt(jsonData.summary.products[i].customizationQuantityTotal) > 0))
																exist = true;
													}
													// if all customization removed => delete product line
													if (!exist && customizationId)
														$('#product_' + productId + '_' + productAttributeId + '_0_' + id_address_delivery).fadeOut('slow', function() {
															$(this).remove();
															var line = $('#product_' + productId + '_' + productAttributeId + '_nocustom_' + id_address_delivery);
															if (line.length > 0)
															{
																line.find('input[name^=quantity_], .cart_quantity_down, .cart_quantity_up, .cart_quantity_delete').each(function(){
																	if (typeof($(this).attr('name')) != 'undefined')
																		$(this).attr('name', $(this).attr('name').replace(/nocustom/, '0'));
																	if (typeof($(this).attr('id')) != 'undefined')
																		$(this).attr('id', $(this).attr('id').replace(/nocustom/, '0'));
																});
																line.find('span[id^=total_product_price_]').each(function(){
																	$(this).attr('id', $(this).attr('id').replace(/_nocustom/, ''));
																});
																line.attr('id', line.attr('id').replace(/nocustom/, '0'));
															}
															refreshOddRow();
														});
												}
												updateCartSummary(jsonData.summary);
												if (window.ajaxCart != undefined)
													ajaxCart.updateCart(jsonData);
												updateCustomizedDatas(jsonData.customizedDatas);
												updateHookShoppingCart(jsonData.HOOK_SHOPPING_CART);
												updateHookShoppingCartExtra(jsonData.HOOK_SHOPPING_CART_EXTRA);
												if (typeof(getCarrierListAndUpdate) !== 'undefined' && jsonData.summary.products.length > 0)
													getCarrierListAndUpdate();
												if (typeof(updatePaymentMethodsDisplay) !== 'undefined')
													updatePaymentMethodsDisplay();
											}
										},
										error: function(XMLHttpRequest, textStatus, errorThrown) {
											if (textStatus !== 'abort')
											{
												var error = "TECHNICAL ERROR: unable to save update quantity \n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus;
												if (!!$.prototype.fancybox)
												    $.fancybox.open([
											        {
											            type: 'inline',
											            autoScale: true,
											            minHeight: 30,
											            content: '<p class="fancybox-error">' + error + '</p>'
											        }],
													{
												        padding: 0
												    });
												else
												    alert(error);
											}
										}
									});
								}


								function updateCustomizedDatas(json)
								{
									for(var i in json)
										for(var j in json[i])
											for(var k in json[i][j])
												for(var l in json[i][j][k])
												{
													var quantity = json[i][j][k][l]['quantity'];
													$('input[name=quantity_' + i + '_' + j + '_' + l + '_' + k + '_hidden]').val(quantity);
													$('input[name=quantity_' + i + '_' + j + '_' + l + '_' + k + ']').val(quantity);
												}
								}*/











//JS Object : update the cart by ajax actions   =======================================================================================================
var ajaxCart = {
	nb_total_products: 0,
	//override every button in the page in relation to the cart
	overrideButtonsInThePage : function(){
		//for every 'add' buttons...
		$(document).off('click', '.ajax_add_to_cart_button').on('click', '.ajax_add_to_cart_button', function(e){
			e.preventDefault();
			var idProduct =  parseInt($(this).data('id-product'));
			var idProductAttribute =  parseInt($(this).data('id-product-attribute'));
			var minimalQuantity =  parseInt($(this).data('minimal_quantity'));
			if (!minimalQuantity)
				minimalQuantity = 1;
			if ($(this).prop('disabled') != 'disabled')
				ajaxCart.add(idProduct, idProductAttribute, false, this, minimalQuantity);
		});
		//for product page 'add' button...
		if ($('.cart_block').length) {
			$(document).off('click', '#add_to_cart button').on('click', '#add_to_cart button', function(e){
				e.preventDefault();
				ajaxCart.add($('#product_page_product_id').val(), $('#idCombination').val(), true, null, $('#quantity_wanted').val(), null);
			});
		}

		//for 'delete' buttons in the cart block...
		$(document).off('click', '.cart_block_list .ajax_cart_block_remove_link').on('click', '.cart_block_list .ajax_cart_block_remove_link', function(e){
			e.preventDefault();
			// Customized product management
			var customizationId = 0;
			var productId = 0;
			var productAttributeId = 0;
			var customizableProductDiv = $($(this).parent().parent()).find("div[data-id^=deleteCustomizableProduct_]");
			var idAddressDelivery = false;

			if (customizableProductDiv && $(customizableProductDiv).length)
			{
				var ids = customizableProductDiv.data('id').split('_');
				if (typeof(ids[1]) != 'undefined')
				{
					customizationId = parseInt(ids[1]);
					productId = parseInt(ids[2]);
					if (typeof(ids[3]) != 'undefined')
						productAttributeId = parseInt(ids[3]);
					if (typeof(ids[4]) != 'undefined')
						idAddressDelivery = parseInt(ids[4]);
				}
			}

			// Common product management
			if (!customizationId)
			{
				//retrieve idProduct and idCombination from the displayed product in the block cart
				var firstCut = $(this).parent().parent().data('id').replace('cart_block_product_', '');
				firstCut = firstCut.replace('deleteCustomizableProduct_', '');
				ids = firstCut.split('_');
				productId = parseInt(ids[0]);

				if (typeof(ids[1]) != 'undefined')
					productAttributeId = parseInt(ids[1]);
				if (typeof(ids[2]) != 'undefined')
					idAddressDelivery = parseInt(ids[2]);
			}

			// Removing product from the cart
			ajaxCart.remove(productId, productAttributeId, customizationId, idAddressDelivery);
		});
	},

	// try to expand the cart
	expand : function(){
		if ($('.cart_block_list').hasClass('collapsed'))
		{
			$('.cart_block_list.collapsed').slideDown({
				duration: 450,
				complete: function(){
					$(this).parent().show(); // parent is hidden in global.js::accordion()
					$(this).addClass('expanded').removeClass('collapsed');
				}
			});

			// save the expand statut in the user cookie
			$.ajax({
				type: 'POST',
				headers: { "cache-control": "no-cache" },
				url: baseDir + 'modules/blockcart/blockcart-set-collapse.php' + '?rand=' + new Date().getTime(),
				async: true,
				cache: false,
				data: 'ajax_blockcart_display=expand',
				complete: function(){
					$('.block_cart_expand').fadeOut('fast', function(){
						$('.block_cart_collapse').fadeIn('fast');
					});
				}
			});
		}
	},

	// try to collapse the cart
	collapse : function(){
		if ($('.cart_block_list').hasClass('expanded'))
		{
			$('.cart_block_list.expanded').slideUp('slow', function(){
				$(this).addClass('collapsed').removeClass('expanded');
			});

			// save the expand statut in the user cookie
			$.ajax({
				type: 'POST',
				headers: { "cache-control": "no-cache" },
				url: baseDir + 'modules/blockcart/blockcart-set-collapse.php' + '?rand=' + new Date().getTime(),
				async: true,
				cache: false,
				data: 'ajax_blockcart_display=collapse' + '&rand=' + new Date().getTime(),
				complete: function(){
					$('.block_cart_collapse').fadeOut('fast', function(){
						$('.block_cart_expand').fadeIn('fast');
					});
				}
			});
		}
	},
	// Fix display when using back and previous browsers buttons
	refresh : function(){
		$.ajax({
			type: 'POST',
			headers: { "cache-control": "no-cache" },
			url: (typeof(baseUri) !== 'undefined') ? baseUri + '?rand=' + new Date().getTime() : '',
			async: true,
			cache: false,
			dataType : "json",
			data: (typeof(static_token) !== 'undefined') ? 'controller=cart&ajax=true&token=' + static_token : '',
			success: function(jsonData)
			{
				ajaxCart.updateCart(jsonData);
			}
		});
	},

	// Update the cart information
	updateCartInformation : function (jsonData, addedFromProductPage){
		ajaxCart.updateCart(jsonData);
		//reactive the button when adding has finished
		if (addedFromProductPage)
		{
			$('#add_to_cart button').removeProp('disabled').removeClass('disabled');
			if (!jsonData.hasError || jsonData.hasError == false)
				$('#add_to_cart button').addClass('added');
			else
				$('#add_to_cart button').removeClass('added');
		}
		else
			$('.ajax_add_to_cart_button').removeProp('disabled');
	},
	// close fancybox
	updateFancyBox : function (){},
	// add a product in the cart via ajax
	add : function(idProduct, idCombination, addedFromProductPage, callerElement, quantity, whishlist){

		if (addedFromProductPage && !checkCustomizations())
		{
			if (contentOnly)
			{
				var productUrl = window.document.location.href + '';
				var data = productUrl.replace('content_only=1', '');
				window.parent.document.location.href = data;
				return;
			}
			if (!!$.prototype.fancybox)
				$.fancybox.open([
					{
						type: 'inline',
						autoScale: true,
						minHeight: 30,
						content: '<p class="fancybox-error">' + fieldRequired + '</p>'
					}
				], {
					padding: 0
				});
			else
				alert(fieldRequired);
			return;
		}

		//disabled the button when adding to not double add if user double click
		if (addedFromProductPage)
		{
			$('#add_to_cart button').prop('disabled', 'disabled').addClass('disabled');
			$('.filled').removeClass('filled');
		}
		else
			$(callerElement).prop('disabled', 'disabled');

		if ($('.cart_block_list').hasClass('collapsed'))
			this.expand();
		//send the ajax request to the server

		$.ajax({
			type: 'POST',
			headers: { "cache-control": "no-cache" },
			url: baseUri + '?rand=' + new Date().getTime(),
			async: true,
			cache: false,
			dataType : "json",
			data: 'controller=cart&add=1&ajax=true&qty=' + ((quantity && quantity != null) ? quantity : '1') + '&id_product=' + idProduct + '&token=' + static_token + ( (parseInt(idCombination) && idCombination != null) ? '&ipa=' + parseInt(idCombination): '' + '&id_customization=' + ((typeof customizationId !== 'undefined') ? customizationId : 0)),
			success: function(jsonData,textStatus,jqXHR)
			{
				// add appliance to whishlist module
				if (whishlist && !jsonData.errors)
					WishlistAddProductCart(whishlist[0], idProduct, idCombination, whishlist[1]);

				if (!jsonData.hasError)
				{
					if (contentOnly)
						window.parent.ajaxCart.updateCartInformation(jsonData, addedFromProductPage);
					else
						ajaxCart.updateCartInformation(jsonData, addedFromProductPage);

					if (jsonData.crossSelling)
						$('.crossseling').html(jsonData.crossSelling);

					if (idCombination)
						$(jsonData.products).each(function(){
							if (this.id != undefined && this.id == parseInt(idProduct) && this.idCombination == parseInt(idCombination))
								if (contentOnly)
									window.parent.ajaxCart.updateLayer(this);
								else
									ajaxCart.updateLayer(this);
						});
					else
						$(jsonData.products).each(function(){
							if (this.id != undefined && this.id == parseInt(idProduct))
								if (contentOnly)
									window.parent.ajaxCart.updateLayer(this);
								else
									ajaxCart.updateLayer(this);
						});
					if (contentOnly)
						parent.$.fancybox.close();
				}
				else
				{
					if (contentOnly)
						window.parent.ajaxCart.updateCart(jsonData);
					else
						ajaxCart.updateCart(jsonData);
					if (addedFromProductPage)
						$('#add_to_cart button').removeProp('disabled').removeClass('disabled');
					else
						$(callerElement).removeProp('disabled');
				}

				emptyCustomizations();

			},
			error: function(XMLHttpRequest, textStatus, errorThrown)
			{
				var error = "Impossible to add the product to the cart.<br/>textStatus: '" + textStatus + "'<br/>errorThrown: '" + errorThrown + "'<br/>responseText:<br/>" + XMLHttpRequest.responseText;
				if (!!$.prototype.fancybox)
					$.fancybox.open([
					{
						type: 'inline',
						autoScale: true,
						minHeight: 30,
						content: '<p class="fancybox-error">' + error + '</p>'
					}],
					{
						padding: 0
					});
				else
					alert(error);
				//reactive the button when adding has finished
				if (addedFromProductPage)
					$('#add_to_cart button').removeProp('disabled').removeClass('disabled');
				else
					$(callerElement).removeProp('disabled');
			}
		});
	},

	//remove a product from the cart via ajax
	remove : function(idProduct, idCombination, customizationId, idAddressDelivery){
		//send the ajax request to the server
		$.ajax({
			type: 'POST',
			headers: { "cache-control": "no-cache" },
			url: baseUri + '?rand=' + new Date().getTime(),
			async: true,
			cache: false,
			dataType : "json",
			data: 'controller=cart&delete=1&id_product=' + idProduct + '&ipa=' + ((idCombination != null && parseInt(idCombination)) ? idCombination : '') + ((customizationId && customizationId != null) ? '&id_customization=' + customizationId : '') + '&id_address_delivery=' + idAddressDelivery + '&token=' + static_token + '&ajax=true',
			success: function(jsonData)	{
				ajaxCart.updateCart(jsonData);
				if ($('body').attr('id') == 'order' || $('body').attr('id') == 'order-opc')
					deleteProductFromSummary(idProduct+'_'+idCombination+'_'+customizationId+'_'+idAddressDelivery);
			},
			error: function()
			{
				var error = 'ERROR: unable to delete the product';
				if (!!$.prototype.fancybox)
				{
					$.fancybox.open([
						{
							type: 'inline',
							autoScale: true,
							minHeight: 30,
							content: error
						}
					], {
						padding: 0
					});
				}
				else
					alert(error);
			}
		});
	},

	//hide the products displayed in the page but no more in the json data
	hideOldProducts : function(jsonData){
		//delete an eventually removed product of the displayed cart (only if cart is not empty!)
		if ($('.cart_block_list:first dl.products').length > 0)
		{
			var removedProductId = null;
			var removedProductData = null;
			var removedProductDomId = null;
			//look for a product to delete...
			$('.cart_block_list:first dl.products dt').each(function(){
				//retrieve idProduct and idCombination from the displayed product in the block cart
				var domIdProduct = $(this).data('id');
				var firstCut = domIdProduct.replace('cart_block_product_', '');
				var ids = firstCut.split('_');

				//try to know if the current product is still in the new list
				var stayInTheCart = false;
				for (aProduct in jsonData.products)
				{
					//we've called the variable aProduct because IE6 bug if this variable is called product
					//if product has attributes
					if (jsonData.products[aProduct]['id'] == ids[0] && (!ids[1] || jsonData.products[aProduct]['idCombination'] == ids[1]))
					{
						stayInTheCart = true;
						// update the product customization display (when the product is still in the cart)
						ajaxCart.hideOldProductCustomizations(jsonData.products[aProduct], domIdProduct);
					}
				}
				//remove product if it's no more in the cart
				if (!stayInTheCart)
				{
					removedProductId = $(this).data('id');
					if (removedProductId != null)
					{
						var firstCut =  removedProductId.replace('cart_block_product_', '');
						var ids = firstCut.split('_');

						$('dt[data-id="' + removedProductId + '"]').addClass('strike').fadeTo('slow', 0, function(){
							$(this).slideUp('slow', function(){
								$(this).remove();
								// If the cart is now empty, show the 'no product in the cart' message and close detail
								if($('.cart_block:first dl.products dt').length == 0)
								{
									$('.ajax_cart_quantity').html('0');
									$("#header .cart_block").stop(true, true).slideUp(200);
									$('.cart_block_no_products:hidden').slideDown(450);
									$('.cart_block dl.products').remove();
								}
							});
						});
						$('dd[data-id="cart_block_combination_of_' + ids[0] + (ids[1] ? '_'+ids[1] : '') + (ids[2] ? '_'+ids[2] : '') + '"]').fadeTo('fast', 0, function(){
							$(this).slideUp('fast', function(){
								$(this).remove();
							});
						});
					}
				}
			});
		}
	},

	hideOldProductCustomizations : function (product, domIdProduct){
		var customizationList = $('ul[data-id="customization_' + product['id'] + '_' + product['idCombination'] + '"]');
		if(customizationList.length > 0)
		{
			$(customizationList).find("li").each(function(){
				$(this).find("div").each(function(){
					var customizationDiv = $(this).data('id');
					var tmp = customizationDiv.replace('deleteCustomizableProduct_', '');
					var ids = tmp.split('_');
					if ((parseInt(product.idCombination) == parseInt(ids[2])) && !ajaxCart.doesCustomizationStillExist(product, ids[0]))
						$('div[data-id="' + customizationDiv + '"]').parent().addClass('strike').fadeTo('slow', 0, function(){
							$(this).slideUp('slow');
							$(this).remove();
						});
				});
			});
		}

		var removeLinks = $('.deleteCustomizableProduct[data-id="' + domIdProduct + '"]').find('.ajax_cart_block_remove_link');
		if (!product.hasCustomizedDatas && !removeLinks.length)
			$('div[data-id="' + domIdProduct + '"]' + ' span.remove_link').html('<a class="ajax_cart_block_remove_link" rel="nofollow" href="' + baseUri + '?controller=cart&amp;delete=1&amp;id_product=' + product['id'] + '&amp;ipa=' + product['idCombination'] + '&amp;token=' + static_token + '"> </a>');
		if (product.is_gift)
			$('div[data-id="' + domIdProduct + '"]' + ' span.remove_link').html('');
	},

	doesCustomizationStillExist : function (product, customizationId){
		var exists = false;

		$(product.customizedDatas).each(function(){
			if (this.customizationId == customizationId)
			{
				exists = true;
				// This return does not mean that we found nothing but simply break the loop
				return false;
			}
		});
		return (exists);
	},

	//refresh display of vouchers (needed for vouchers in % of the total)
	refreshVouchers : function (jsonData){
		if (typeof(jsonData.discounts) == 'undefined' || jsonData.discounts.length == 0)
			$('.vouchers').hide();
		else
		{
			$('.vouchers tbody').html('');

			for (i=0;i<jsonData.discounts.length;i++)
			{
				if (parseFloat(jsonData.discounts[i].price_float) > 0)
				{
					var delete_link = '';
					if (jsonData.discounts[i].code.length)
						delete_link = '<a class="delete_voucher" href="'+jsonData.discounts[i].link+'" title="'+delete_txt+'"><i class="icon-remove-sign"></i></a>';
					$('.vouchers tbody').append($(
						'<tr class="bloc_cart_voucher" data-id="bloc_cart_voucher_'+jsonData.discounts[i].id+'">'
						+'	<td class="quantity">1x</td>'
						+'	<td class="name" title="'+jsonData.discounts[i].description+'">'+jsonData.discounts[i].name+'</td>'
						+'	<td class="price">-'+jsonData.discounts[i].price+'</td>'
						+'	<td class="delete">' + delete_link + '</td>'
						+'</tr>'
					));
				}
			}
			$('.vouchers').show();
		}

	},

	// Update product quantity
	updateProductQuantity : function (product, quantity){
		$('dt[data-id=cart_block_product_' + product.id + '_' + (product.idCombination ? product.idCombination : '0')+ '_' + (product.idAddressDelivery ? product.idAddressDelivery : '0') + '] .quantity').fadeTo('fast', 0, function(){
			$(this).text(quantity);
			$(this).fadeTo('fast', 1, function(){
				$(this).fadeTo('fast', 0, function(){
					$(this).fadeTo('fast', 1, function(){
						$(this).fadeTo('fast', 0, function(){
							$(this).fadeTo('fast', 1);
						});
					});
				});
			});
		});
	},

	//display the products witch are in json data but not already displayed
	displayNewProducts : function(jsonData){
		//add every new products or update displaying of every updated products
		$(jsonData.products).each(function(){
			//fix ie6 bug (one more item 'undefined' in IE6)
			if (this.id != undefined)
			{
				//create a container for listing the products and hide the 'no product in the cart' message (only if the cart was empty)

				if ($('.cart_block:first dl.products').length == 0)
				{
					$('.cart_block_no_products').before('<dl class="products"></dl>');
					$('.cart_block_no_products').hide();
				}
				//if product is not in the displayed cart, add a new product's line
				var domIdProduct = this.id + '_' + (this.idCombination ? this.idCombination : '0') + '_' + (this.idAddressDelivery ? this.idAddressDelivery : '0');
				var domIdProductAttribute = this.id + '_' + (this.idCombination ? this.idCombination : '0');

				if ($('dt[data-id="cart_block_product_' + domIdProduct + '"]').length == 0)
				{
					var productId = parseInt(this.id);
					var productAttributeId = (this.hasAttributes ? parseInt(this.attributes) : 0);
					var content =  '<dt class="unvisible" data-id="cart_block_product_' + domIdProduct + '">';
					var name = $.trim($('<span />').html(this.name).text());
					name = (name.length > 12 ? name.substring(0, 55) + '...' : name);
					content += '<a class="cart-images" href="' + this.link + '" title="' + name + '"><img  src="' + this.image_cart + '" alt="' + this.name +'"></a>';
					content += '<div class="cart-info"><div class="product-name">' + '<span class="quantity-formated"><span class="quantity">' + this.quantity + '</span>&nbsp;x&nbsp;</span><a href="' + this.link + '" title="' + this.name + '" class="cart_block_product_name">' + name + '</a></div>';
					if (this.hasAttributes)
						  content += '<div class="product-atributes"><a href="' + this.link + '" title="' + this.name + '">' + this.attributes + '</a></div>';
					if (typeof(freeProductTranslation) != 'undefined')
						content += '<span class="price">' + (parseFloat(this.price_float) > 0 ? this.priceByLine : freeProductTranslation) + '</span></div>';

					if (typeof(this.is_gift) == 'undefined' || this.is_gift == 0)
						content += '<span class="remove_link"><a rel="nofollow" class="ajax_cart_block_remove_link" href="' + baseUri + '?controller=cart&amp;delete=1&amp;id_product=' + productId + '&amp;token=' + static_token + (this.hasAttributes ? '&amp;ipa=' + parseInt(this.idCombination) : '') + '"> </a></span>';
					else
						content += '<span class="remove_link"></span>';
					content += '</dt>';
					if (this.hasAttributes)
						content += '<dd data-id="cart_block_combination_of_' + domIdProduct + '" class="unvisible">';
					if (this.hasCustomizedDatas)
						content += ajaxCart.displayNewCustomizedDatas(this);
					if (this.hasAttributes) content += '</dd>';

					$('.cart_block dl.products').append(content);
				}
				//else update the product's line
				else
				{
					var jsonProduct = this;
					if($.trim($('dt[data-id="cart_block_product_' + domIdProduct + '"] .quantity').html()) != jsonProduct.quantity || $.trim($('dt[data-id="cart_block_product_' + domIdProduct + '"] .price').html()) != jsonProduct.priceByLine)
					{
						// Usual product
						if (!this.is_gift)
							$('dt[data-id="cart_block_product_' + domIdProduct + '"] .price').text(jsonProduct.priceByLine);
						else
							$('dt[data-id="cart_block_product_' + domIdProduct + '"] .price').html(freeProductTranslation);
						ajaxCart.updateProductQuantity(jsonProduct, jsonProduct.quantity);

						// Customized product
						if (jsonProduct.hasCustomizedDatas)
						{
							customizationFormatedDatas = ajaxCart.displayNewCustomizedDatas(jsonProduct);
							if (!$('ul[data-id="customization_' + domIdProductAttribute + '"]').length)
							{
								if (jsonProduct.hasAttributes)
									$('dd[data-id="cart_block_combination_of_' + domIdProduct + '"]').append(customizationFormatedDatas);
								else
									$('.cart_block dl.products').append(customizationFormatedDatas);
							}
							else
							{
								$('ul[data-id="customization_' + domIdProductAttribute + '"]').html('');
								$('ul[data-id="customization_' + domIdProductAttribute + '"]').append(customizationFormatedDatas);
							}
						}
					}
				}
				$('.cart_block dl.products .unvisible').slideDown(450).removeClass('unvisible');

			var removeLinks = $('dt[data-id="cart_block_product_' + domIdProduct + '"]').find('a.ajax_cart_block_remove_link');
			if (this.hasCustomizedDatas && removeLinks.length)
				$(removeLinks).each(function(){
					$(this).remove();
				});
			}
		});
	},

	displayNewCustomizedDatas : function(product){
		var content = '';
		var productId = parseInt(product.id);
		var productAttributeId = typeof(product.idCombination) == 'undefined' ? 0 : parseInt(product.idCombination);
		var hasAlreadyCustomizations = $('ul[data-id="customization_' + productId + '_' + productAttributeId + '"]').length;

		if (!hasAlreadyCustomizations)
		{
			if (!product.hasAttributes)
				content += '<dd data-id="cart_block_combination_of_' + productId + '" class="unvisible">';
			if ($('ul[data-id="customization_' + productId + '_' + productAttributeId + '"]').val() == undefined)
				content += '<ul class="cart_block_customizations" data-id="customization_' + productId + '_' + productAttributeId + '">';
		}

		$(product.customizedDatas).each(function(){
			var done = 0;
			customizationId = parseInt(this.customizationId);
			productAttributeId = typeof(product.idCombination) == 'undefined' ? 0 : parseInt(product.idCombination);
			content += '<li name="customization"><div class="deleteCustomizableProduct" data-id="deleteCustomizableProduct_' + customizationId + '_' + productId + '_' + (productAttributeId ?  productAttributeId : '0') + '"><a rel="nofollow" class="ajax_cart_block_remove_link" href="' + baseUri + '?controller=cart&amp;delete=1&amp;id_product=' + productId + '&amp;ipa=' + productAttributeId + '&amp;id_customization=' + customizationId + '&amp;token=' + static_token + '"></a></div>';

			// Give to the customized product the first textfield value as name
			$(this.datas).each(function(){
				if (this['type'] == CUSTOMIZE_TEXTFIELD)
				{
					$(this.datas).each(function(){
						if (this['index'] == 0)
						{
							content += ' ' + this.truncatedValue.replace(/<br \/>/g, ' ');
							done = 1;
							return false;
						}
					})
				}
			});

			// If the customized product did not have any textfield, it will have the customizationId as name
			if (!done)
				content += customizationIdMessage + customizationId;
			if (!hasAlreadyCustomizations) content += '</li>';
			// Field cleaning
			if (customizationId)
			{
				$('#uploadable_files li div.customizationUploadBrowse img').remove();
				$('#text_fields input').attr('value', '');
			}
		});

		if (!hasAlreadyCustomizations)
		{
			content += '</ul>';
			if (!product.hasAttributes) content += '</dd>';
		}
		return (content);
	},

	updateLayer : function(product){
		$('#layer_cart_product_title').text(product.name);
		$('#layer_cart_product_attributes').text('');
		if (product.hasAttributes && product.hasAttributes == true)
			$('#layer_cart_product_attributes').html(product.attributes);
		$('#layer_cart_product_price').text(product.price);
		$('#layer_cart_product_quantity').text(product.quantity);
		$('.layer_cart_img').html('<img class="layer_cart_img img-responsive" src="' + product.image + '" alt="' + product.name + '" title="' + product.name + '" />');

		var n = parseInt($(window).scrollTop()) + 'px';

		$('.layer_cart_overlay').css('width','100%');
		$('.layer_cart_overlay').css('height','100%');
		$('.layer_cart_overlay').show();
		$('#layer_cart').css({'top': n}).fadeIn('fast');
		crossselling_serialScroll();
	},

	//genarally update the display of the cart
	updateCart : function(jsonData){
		//user errors display
		if (jsonData.hasError)
		{
			var errors = '';
			for (error in jsonData.errors)
				//IE6 bug fix
				if (error != 'indexOf')
					errors += $('<div />').html(jsonData.errors[error]).text() + "\n";
			if (!!$.prototype.fancybox)
				$.fancybox.open([
					{
						type: 'inline',
						autoScale: true,
						minHeight: 30,
						content: '<p class="fancybox-error">' + errors + '</p>'
					}
				], {
					padding: 0
				});
			else
				alert(errors);
		}
		else
		{
			ajaxCart.updateCartEverywhere(jsonData);
			ajaxCart.hideOldProducts(jsonData);
			ajaxCart.displayNewProducts(jsonData);
			ajaxCart.refreshVouchers(jsonData);

			//update 'first' and 'last' item classes
			$('.cart_block .products dt').removeClass('first_item').removeClass('last_item').removeClass('item');
			$('.cart_block .products dt:first').addClass('first_item');
			$('.cart_block .products dt:not(:first,:last)').addClass('item');
			$('.cart_block .products dt:last').addClass('last_item');
		}
	},

	//update general cart informations everywhere in the page
	updateCartEverywhere : function(jsonData){
		$('.ajax_cart_total').text($.trim(jsonData.productTotal));

		if (typeof hasDeliveryAddress == 'undefined')
			hasDeliveryAddress = false;

		if (parseFloat(jsonData.shippingCostFloat) > 0)
			$('.ajax_cart_shipping_cost').text(jsonData.shippingCost).parent().find('.unvisible').show();
		else if ((hasDeliveryAddress || typeof(orderProcess) !== 'undefined' && orderProcess == 'order-opc') && typeof(freeShippingTranslation) != 'undefined')
			$('.ajax_cart_shipping_cost').html(freeShippingTranslation);
		else if ((typeof toBeDetermined !== 'undefined') && !hasDeliveryAddress)
			$('.ajax_cart_shipping_cost').html(toBeDetermined);

		if (!jsonData.shippingCostFloat && !jsonData.free_ship)
			$('.ajax_cart_shipping_cost').parent().find('.unvisible').hide();
		else if (hasDeliveryAddress && !jsonData.isVirtualCart)
			$('.ajax_cart_shipping_cost').parent().find('.unvisible').show();

		$('.ajax_cart_tax_cost').text(jsonData.taxCost);
		$('.cart_block_wrapping_cost').text(jsonData.wrappingCost);
		$('.ajax_block_cart_total').text(jsonData.total);
		$('.ajax_block_products_total').text(jsonData.productTotal);
		$('.ajax_total_price_wt').text(jsonData.total_price_wt);

		if (parseFloat(jsonData.freeShippingFloat) > 0)
		{
			$('.ajax_cart_free_shipping').html(jsonData.freeShipping);
			$('.freeshipping').fadeIn(0);
		}
		else if (parseFloat(jsonData.freeShippingFloat) == 0)
			$('.freeshipping').fadeOut(0);

		this.nb_total_products = jsonData.nbTotalProducts;

		if (parseInt(jsonData.nbTotalProducts) > 0)
		{
			$('.ajax_cart_no_product').hide();
			$('.ajax_cart_quantity').text(jsonData.nbTotalProducts);
			$('.ajax_cart_quantity').fadeIn('slow');
			$('.ajax_cart_total').fadeIn('slow');

			if (parseInt(jsonData.nbTotalProducts) > 1)
			{
				$('.ajax_cart_product_txt').each( function (){
					$(this).hide();
				});

				$('.ajax_cart_product_txt_s').each( function (){
					$(this).show();
					if (parseInt(jsonData.nbTotalProducts) < 5) {
						$('.cart-flag').text(' товара');
					} else {
						$('.cart-flag').text(' товаров');
					}
				});
			}
			else
			{
				$('.ajax_cart_product_txt').each( function (){
					$(this).show();
				});

				$('.ajax_cart_product_txt_s').each( function (){
					$(this).hide();
				});
			}
		}
		else
		{
			$('.ajax_cart_quantity, .ajax_cart_product_txt_s, .ajax_cart_product_txt, .ajax_cart_total').each(function(){
				$(this).hide();
			});
			$('.ajax_cart_no_product').show('slow');
		}
	}
};

function HoverWatcher(selector)
{
	this.hovering = false;
	var self = this;

	this.isHoveringOver = function(){
		return self.hovering;
	}

	$(selector).hover(function(){
		self.hovering = true;
	}, function(){
		self.hovering = false;
	})
}

function crossselling_serialScroll()
{
	if (!!$.prototype.bxSlider)
		$('#blockcart_caroucel').bxSlider({
			minSlides: 2,
			maxSlides: 4,
			slideWidth: 178,
			slideMargin: 20,
			moveSlides: 1,
			infiniteLoop: false,
			hideControlOnEnd: true,
			pager: false
		});
}
