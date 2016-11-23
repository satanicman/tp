<div id="qform" class="quickform">
	<h2 class="title">{l s='Оформление заказа' mod='quickorder'}</h2>
	<div class="qform_container">
	<div id="errors" class="error hidden"></div>
	<div id="success" class="success hidden">{l s='Спасибо!' mod='quickorder'}<br>{l s='Заказ оформлен.' mod='quickorder'} </div>
	

	
	{$e_commerce}
	
	


	
	{if $total <= 0}<div class="error">{l s='Your cart is is empty' mod='quickorder'}</div>{/if}

	{if $total > 0}
	

	<div id="wrap" class="form_container">

		<p class="text">
			<label for="firstname">{l s='Фамилия, имя и отчество:' mod='quickorder'}<sup class="required">*</sup></label>
			<input type="text" class="required" id="firstname" name="firstname" value="{if $logged}{$cookie->customer_lastname} {$cookie->customer_firstname}{/if}">
			
		</p>
		<!--<p class="text">
			<label for="lastname">{l s='Last name:' mod='quickorder'}</label>
			<input type="text" class="" id="lastname" name="lastname" value="{if $logged}{$cookie->customer_lastname}{/if}">
			
		</p>-->
		<p class="text">
			<label for="phone_mobile">{l s='Mobile phone:' mod='quickorder'}<sup class="required">*</sup></label>
			<input type="text" class="required" name="phone_mobile" id="phone_mobile" value="" />
		</p>
		{*{$addresses.delivery->phone_mobile}*}
		<p class="text textarea">
			<label for="delivery">{l s='Доставка:' mod='quickorder'}</label>
			<select name="delivery" id="delivery">
			  <option>ТК Новая почта</option>
			  <option>Курьером</option>
			  <option>Самовывоз</option>
			</select>
		</p>
		<p class="text textarea">
			<label for="address">{l s='Город:' mod='quickorder'}</label>
			<input name="address" id="address"></input>
		</p>
		<p class="text textarea">
			<label id="del-lab" for="office">{l s='Номер отделения:' mod='quickorder'}</label>
			<input name="office" id="office" value="1"></input>
		</p>
		<p class="text textarea">
			<label for="payment">{l s='Оплата:' mod='quickorder'}</label>
			<select name="payment" id="payment">
			  <option>На карту ПриватБанка</option>
			  <option>Наличными при получении</option>
			  <option>На расчетный счет</option>
			</select>
		</p>
		<p class="text">
			<label for="email">{l s='Эл.почта:' mod='quickorder'}<sup class="required">*</sup></label>
			<input type="text" class="required" id="email" name="email" value="{if $logged}{$cookie->email}{/if}" />
		</p>
		<p class="text textarea">
			<label for="comment">{l s='Comment:' mod='quickorder'}</label>
			<textarea name="comment" id="comment" cols="26" rows="5"></textarea>
		</p>
		</div>

		<div class="submit">
	        <div class="myrequired"><sup class="required">*</sup> {l s='Обязательные поля' mod='quickorder'}</div>
			<input class="button" type="submit" title="{l s='Click here to submit your order!' mod='quickorder'}" name="submitOrder" id="submitOrder" value="{l s='Submit order' mod='quickorder'}">
		</div>

		{/if}
	</div>

</div>