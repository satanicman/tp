 {*
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
*  @version  Release: $Revision$
*  @license    http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*}
{if (!$content_only && (($nbComments == 0 && $too_early == false && ($is_logged || $allow_guests)) || ($nbComments != 0)))}
<div id="product_comments_block_extra" class="no-print" itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
	{if $nbComments != 0}
		<div id ="comstarsfrom" class="comments_note clearfix">
			{*<span>{l s='Rating' mod='productcomments'}&nbsp;</span>*}
			<div class="star_content col-sm-3 clearfix">
				{section name="i" start=0 loop=5 step=1}
					{if $averageTotal le $smarty.section.i.index}
						<div class="star"></div>
					{else}
						<div class="star star_on"></div>
					{/if}
				{/section}
				<meta itemprop="worstRating" content = "0" />
				<meta itemprop="ratingValue" content = "{if isset($ratings.avg)}{$ratings.avg|round:1|escape:'html':'UTF-8'}{else}{$averageTotal|round:1|escape:'html':'UTF-8'}{/if}" />
				<meta itemprop="bestRating" content = "5" />
			</div>
			<div class="col-sm-3"><p>Отзывов {$nbComments}</p></div>
		</div> <!-- .comments_note -->
	{/if}

	<ul class="comments_advices">
		{if ($too_early == false AND ($is_logged OR $allow_guests))}
			<li>
				<a class="open-comment-form-1">
					{l s='Оставить отзыв' mod='productcomments'}
				</a>
			</li>
		{/if}
		{if $nbComments != 0}
			<li>
				<a href="#idTab5" class="reviews" id="view-all-rev">
					{l s='Смотреть все отзывы' mod='productcomments'} 
				</a>
			</li>
		{/if}
	</ul>
</div>
{/if}

<!-- Fancybox -->
<div>
	<div id="new_comment_form" style="display: none;">
		<form id="id_new_comment_form" action="#">
			{*<h2 class="page-subheading">*}
			{*	{l s='Write a review' mod='productcomments'}*}
			{*</h2>*}
			<div class="row">
				{*{if isset($product) && $product}*}
				{*	<div class="product clearfix  col-xs-12 col-sm-6">*}
				{*		<img src="{$productcomment_cover_image}" height="{$mediumSize.height}" width="{$mediumSize.width}" alt="{$product->name|escape:'html':'UTF-8'}" />*}
				{*		<div class="product_desc">*}
				{*			<p class="product_name">*}
				{*				<strong>{$product->name}</strong>*}
				{*			</p>*}
				{*			{$product->description_short}*}
				{*		</div>*}
				{*	</div>*}
				{*{/if}*}
				<div class="new_comment_form_content col-xs-12 col-sm-12">
					<div id="new_comment_form_error" class="error" style="display: none; padding: 15px 25px">
						<ul></ul>
					</div>

					<div class="col-sm-6" >
						{if $allow_guests == true && !$is_logged}
							{*<label>*}
							{*	{l s='Ваше имя:' mod='productcomments'} <sup class="required">*</sup>*}
							{*</label>*}
							<input id="commentCustomerName" placeholder="Ваше Имя*" name="customer_name" type="text" value=""/>
						{/if}
					</div>
					<div class="col-sm-6" style="height:50px;">
						{if $criterions|@count > 0}
							<ul id="criterions_list">
							{foreach from=$criterions item='criterion'}
								<li>
									<label>Оценка</label>
									<div class="star_content">
										<input class="star not_uniform" type="radio" name="criterion[{$criterion.id_product_comment_criterion|round}]" value="1" />
										<input class="star not_uniform" type="radio" name="criterion[{$criterion.id_product_comment_criterion|round}]" value="2" />
										<input class="star not_uniform" type="radio" name="criterion[{$criterion.id_product_comment_criterion|round}]" value="3" />
										<input class="star not_uniform" type="radio" name="criterion[{$criterion.id_product_comment_criterion|round}]" value="4" checked="checked" />
										<input class="star not_uniform" type="radio" name="criterion[{$criterion.id_product_comment_criterion|round}]" value="5" />
									</div>
									<div class="clearfix"></div>
								</li>
							{/foreach}
							</ul>
						{/if}
					</div>
					<div class="col-sm-6 {if $is_logged}logged-cl{/if}" >
						{*<label for="comment_title">*}
						{*	{l s='"Электронный адрес":' mod='productcomments'} <sup class="required">*</sup>*}
						{*</label>*}
						<input id="comment_title" placeholder="Электронный адрес*" name="title" type="email" value="{if $logged}{$cookie->email}{/if}"/>

					</div>
					<div class="col-sm-6" {if !$logged}style="height:50px;"{/if}>
						<span id="valid"></span>
					</div>
					<div class="col-sm-12" style="display: inline-block;">
						<textarea id="plus" placeholder="Достоинства" name="plus"></textarea>
					</div>
					<div class="col-sm-12" style="display: inline-block;">
						<textarea id="minus" placeholder="Недостатки" name="minus"></textarea>
					</div>
					<div class="col-sm-12" style="display: inline-block;">
						{*<label for="content">*}
						{*	{l s='Комментарий:' mod='productcomments'} <sup class="required">*</sup>*}
						{*</label>*}
						<textarea id="content" placeholder="Ваше мнение о продукте *" name="content"></textarea>
					</div>
					<div id="new_comment_form_footer">
						<input id="id_product_comment_send" name="id_product" type="hidden" value='{$id_product_comment_form}' />
						<p class="required" style="padding-left: 20px;"><sup>*</sup> {l s='обязательные поля' mod='productcomments'}</p>
						<p class="fr">
							<button id="submitNewMessage" name="submitMessage" type="submit" class="btn button button-small" {if !$is_logged}disabled{/if}>
								<span>{l s='Отправить' mod='productcomments'}</span>
							</button>&nbsp;
							{*{l s='or' mod='productcomments'}&nbsp;*}
							{*<a class="closefb" href="#">*}
							{*	{l s='Cancel' mod='productcomments'}*}
							{*</a>*}
						</p>
						<div class="clearfix"></div>
					</div> <!-- #new_comment_form_footer -->
				</div>
			</div>
		</form><!-- /end new_comment_form_content -->
	</div>
</div>
<!-- End fancybox -->

<!--  /Module ProductComments -->
