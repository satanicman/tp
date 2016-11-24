<?php
/**
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
 */

class Homecategories extends Module
{
    public function __construct()
    {
        $this->name = 'homecategories';
        $this->tab = 'front_office_features';
        $this->version = '1.4.2';
        $this->author = 'John Stocks & Michael Dekker';
        $this->need_instance = 0;

        parent::__construct(); // The parent construct is required for translations

        $this->page = basename(__FILE__, '.php');
        $this->displayName = $this->l('Homepage Categories for v1.6');
        $this->description = $this->l('Displays categories on your homepage');
    }

    public function install()
    {
        return parent::install() &&
        $this->registerHook('displayHome') &&
        $this->registerHook('displayHeader');
    }

    public function uninstall()
    {
        return $this->unregisterHook('displayHome') &&
        $this->unregisterHook('displayHeader') &&
        parent::uninstall();
    }

    public function hookDisplayHeader()
    {
        $this->context->controller->addCSS(_PS_THEME_DIR_.'/css/category.css', 'all');
    }

    public function hookDisplayHome($params)
    {
        $root_cat = Category::getRootCategory($this->context->cookie->id_lang);
        $this->context->smarty->assign(
            array(
                'categories' => $root_cat->getSubCategories($this->context->cookie->id_lang)
            )
        );

        return $this->display(__FILE__, '/views/templates/hooks/homecategories.tpl');
    }

    public function hookLeftColumn($params)
    {
        return $this->hookDiplayHome($params);
    }

    public function hookRightColumn($params)
    {
        return $this->hookDisplayHome($params);
    }

    public function hookDisplayTopColumn($params)
    {
        return $this->hookDisplayHome($params);
    }

    public function hookDisplayHomeTab($params)
    {
        return $this->hookDisplayHome($params);
    }
}
