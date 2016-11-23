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
* Do not edit or add to this file if you wish to upgrade PrestaShop to newersend_friend_form_content
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author PrestaShop SA <contact@prestashop.com>
*  @copyright  2007-2016 PrestaShop SA
*  @license    http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*}
<div id="idTab5">
	<div id="product_comments_block_tab">

		{if $comments}
			{foreach from=$comments item=comment}
				{if $comment.content}
				<div class="comment row" itemprop="review" itemscope itemtype="https://schema.org/Review">
					
					<div class="comment_author col-sm-12">
						<div class="comment_author_infos">
							<div class="col-sm-6 comment-name"><strong itemprop="author">{$comment.customer_name|escape:'html':'UTF-8'}</strong>
							<meta itemprop="datePublished" content="{$comment.date_add|escape:'html':'UTF-8'|substr:0:10}" /></div>
							<div class="col-sm-6 comment-date"><em>{dateFormat date=$comment.date_add|escape:'html':'UTF-8' full=0}</em></div>
						</div>
						<div class="comments-stars">
							<span>{l s='Оценка товара' mod='productcomments'}&nbsp;</span>
							<div class="star_content clearfix"  itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
								{section name="i" start=0 loop=5 step=1}
									{if $comment.grade le $smarty.section.i.index}
										<div class="star"></div>
									{else}
										<div class="star star_on"></div>
									{/if}
								{/section}
	            				<meta itemprop="worstRating" content = "0" />
								<meta itemprop="ratingValue" content = "{$comment.grade|escape:'html':'UTF-8'}" />
	            				<meta itemprop="bestRating" content = "5" />
							</div>
						</div>
					</div> <!-- .comment_author -->

					<div class="comment_details col-sm-12">
						{*<p itemprop="name" class="title_block">*}
						{*	<strong>{$comment.title}</strong>*}
						{*</p>*}
						<p itemprop="reviewBody">{$comment.content}</p>
						<ul>
							{*{if $comment.total_advice > 0}*}
							{*	<li>*}
							{*		{l s='%1$d out of %2$d people found this review useful.' sprintf=[$comment.total_useful,$comment.total_advice] mod='productcomments'}*}
							{*	</li>*}
							{*{/if}*}
							{*{if $is_logged}*}
							{*	{if !$comment.customer_advice}*}
							{*	<li>*}
							{*		{l s='Was this comment useful to you?' mod='productcomments'}*}
							{*		<button class="usefulness_btn btn btn-default button button-small" data-is-usefull="1" data-id-product-comment="{$comment.id_product_comment}">*}
							{*			<span>{l s='Yes' mod='productcomments'}</span>*}
							{*		</button>*}
							{*		<button class="usefulness_btn btn btn-default button button-small" data-is-usefull="0" data-id-product-comment="{$comment.id_product_comment}">*}
							{*			<span>{l s='No' mod='productcomments'}</span>*}
							{*		</button>*}
							{*	</li>*}
							{*	{/if}*}
							{*	{if !$comment.customer_report}*}
							{*	<li>*}
							{*		<span class="report_btn" data-id-product-comment="{$comment.id_product_comment}">*}
							{*			{l s='Report abuse' mod='productcomments'}*}
							{*		</span>*}
							{*	</li>*}
							{*	{/if}*}
							{*{/if}*}
						</ul>
					</div><!-- .comment_details -->

				</div> <!-- .comment -->
				{/if}
			{/foreach}
			{*{if (!$too_early AND ($is_logged OR $allow_guests))}*}
			{*<p class="align_center">*}
			{*	<a id="new_comment_tab_btn" class="btn btn-default button button-small open-comment-form" href="#new_comment_form">*}
			{*		<span>{l s='Write your review!' mod='productcomments'}</span>*}
			{*	</a>*}
			{*</p>*}
			{*{/if}*}
		{else}
			{*{if (!$too_early AND ($is_logged OR $allow_guests))}*}
			{*<p class="align_center">*}
			{*	<a id="new_comment_tab_btn" class="btn btn-default button button-small open-comment-form" href="#new_comment_form">*}
			{*		<span>{l s='Be the first to write your review!' mod='productcomments'}</span>*}
			{*	</a>*}
			{*</p>*}
			{*{else}*}
			<p class="align_center">{l s='Пока нет ни одного отзыва.' mod='productcomments'}</p>
			{*{/if}*}
		{/if}
	</div> <!-- #product_comments_block_tab -->
</div>


{strip}
{addJsDef productcomments_controller_url=$productcomments_controller_url|@addcslashes:'\''}
{addJsDef moderation_active=$moderation_active|boolval}
{addJsDef productcomments_url_rewrite=$productcomments_url_rewriting_activated|boolval}
{addJsDef secure_key=$secure_key}

{addJsDefL name=confirm_report_message}{l s='Are you sure that you want to report this comment?' mod='productcomments' js=1}{/addJsDefL}
{addJsDefL name=productcomment_added}{l s='Ваш отзыв был добавлен!' mod='productcomments' js=1}{/addJsDefL}
{addJsDefL name=productcomment_added_moderation}{l s='Ваш отзыв был добавлен и будет доступен после проверки модератором.' mod='productcomments' js=1}{/addJsDefL}
{addJsDefL name=productcomment_title}{l s='Новый комментарий' mod='productcomments' js=1}{/addJsDefL}
{addJsDefL name=productcomment_ok}{l s='OK' mod='productcomments' js=1}{/addJsDefL}
{/strip}
