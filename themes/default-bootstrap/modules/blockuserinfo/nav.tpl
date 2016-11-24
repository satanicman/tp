<!-- Block user information module NAV  -->
<div class="header_user_info col-lg-2 pull-right">
	{if $is_logged}
		{if isset($phone) && $phone}
			<input type="hidden" name="user_phone" id="user_phone" value="{$phone}">
		{/if}
		<a href="{$link->getPageLink('my-account', true)|escape:'html':'UTF-8'}" title="{l s='View my customer account' mod='blockuserinfo'}" class="account" rel="nofollow">
			<span>{$cookie->customer_firstname} {$cookie->customer_lastname}</span>
		</a>
		<a class="logout" href="{$link->getPageLink('index', true, NULL, "mylogout")|escape:'html':'UTF-8'}" rel="nofollow" title="{l s='Log me out' mod='blockuserinfo'}">
			{l s='Sign out' mod='blockuserinfo'}
		</a>
	{else}
		<a class="login" href="{$link->getPageLink('my-account', true)|escape:'html':'UTF-8'}" rel="nofollow" title="{l s='Log in to your customer account' mod='blockuserinfo'}">
			<i class="sign-icon icon"></i><span>{l s='Войти | Регистрация' mod='blockuserinfo'}</span>
		</a>
	{/if}
</div>
<!-- /Block usmodule NAV -->
