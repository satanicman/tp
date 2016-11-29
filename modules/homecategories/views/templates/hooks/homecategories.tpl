{*
* 2007-2015 PrestaShop
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
* @author    PrestaShop SA <contact@prestashop.com>
* @copyright 2007-2015 PrestaShop SA
* @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
* International Registered Trademark & Property of PrestaShop SA
*}
<div class="home_categories">
   {* <h2>{l s='Categories' mod='homecategories'}</h2>*}
    {if isset($subcategories) AND $subcategories}
        <div id="subcategories_home">
            <h3 class="sub-title">{l s="В нашем интернет-магазине вы найдете:" mod="homecategories"}</h3>
            <ul class="clearfix row">
                {foreach from=$subcategories item=subcategory}
                    <li class="col-lg-3 col-md-3">
                        <a href="{$link->getCategoryLink($subcategory.id_category, $subcategory.link_rewrite)|escape:'html':'UTF-8'}"
                           title="{$subcategory.name|escape:'html':'UTF-8'}" class="img">
                            <span class="home_categories_name">{$subcategory.name}</span>

                            <div class="img_wrap">
                                <img src="{$link->getCatImageLink($subcategory.link_rewrite, $subcategory.id_image)|escape:'html':'UTF-8'}"
                                     alt="{$subcategory.name|escape:'html':'UTF-8'}">
                            </div>
                        </a>
                    </li>
                {/foreach}
            </ul>
        </div>
    {else}
        <p>{l s='No categories' mod='homecategories'}</p>
    {/if}
    <div class="cr"></div>
</div>
<!-- /MODULE Home categories -->