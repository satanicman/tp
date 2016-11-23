<?php

if (!defined('_PS_VERSION_'))

    exit;

class exportorder extends Module

{
    protected $sep_line;
    protected $sep_fields;
    protected $fields = array(
        'o__reference___oReference' => 'Код',
        'o__payment___oPayment' => 'Способ оплаты',
        'o__total_paid___oTotalPaid' => 'Итого к оплате',
        'cur__iso_code___curIsoCode' => 'Валюта',
        'o__date_upd___oDateUpd' => 'Дата',
        'car__name___carName' => 'Доставка',
        'osl__name___oslName' => 'Статус заказа',
        'carl__delay___carlDelay' => 'Срок доставки',
        'zone__name___zoneName' => 'Страна',
        'c__id_customer___cIdCustomer' => 'Идентификатор пользователя',
        'c__firstname___cFirstname' => 'Имя',
        'c__lastname___cLastname' => 'Фамилия',
        'c__email___cEmail' => 'email',
        'c__birthday___cBirthday' => 'День рождения',
        'p__id_product___pIdProduct' => 'Идентификатор товара',
        'p__id_oneC___pIdOneC' => 'Идентификатор 1С',
        'pl__name___plName' => 'Название',
        'pl__description___plDescription' => 'Описание',
        'pl__link_rewrite___plLinkRewrite' => 'Ссылка',
        'p__price___pPrice' => 'Цена',
        'od__product_quantity___odProductQuantity' => 'Кол-во',
        'p__reference___pReference' => 'Артикул',
        'catl__id_category___catlIdCategory' => 'Идентификатор категории',
        'catl__name___catlName' => 'Название',
        'catl__description___catlDescription' => 'Описание',
        'catl__link_rewrite___catlLink_rewrite' => 'Ссылка'
    );

    public function __construct()
    {
        $this->name = 'exportorder';
        $this->tab = 'other';
        $this->version = '0.4';
        $this->author = 'http://vk.com/id24260100';
        $this->need_instance = 0;
        $this->ps_versions_compliancy = array('min' => '1.6', 'max' => _PS_VERSION_);
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('Export orders');
        $this->description = $this->l('Export orders to csv');

        $this->confirmUninstall = $this->l('Are you sure you want to uninstall?');

        if (!Configuration::get('MUMODULE_NAME'))
            $this->warning = $this->l('No name provided');
    }

    public function install()
    {
        if (Shop::isFeatureActive())
            Shop::setContext(Shop::CONTEXT_ALL);

        if (!parent::install())
            return false;

        Configuration::updateValue('PS_EXPORT_ORDERS_SEP_LINE', '|');
        Configuration::updateValue('PS_EXPORT_ORDERS_SEP_FIELDS', '~');
        Configuration::updateValue('PS_EXPORT_ORDERS_TIME', 0);
        Configuration::updateValue('PS_EXPORT_ORDERS_TIME_FROM', 0);
        Configuration::updateValue('PS_EXPORT_ORDERS_TIME_TO', 0);
        Configuration::updateValue('PS_EXPORT_ORDERS_STATUS', 0);
        Configuration::updateValue('PS_EXPORT_ORDERS_PAYMENT', 0);
        Configuration::updateValue('PS_EXPORT_ORDERS_FIELDS', 'o__total_paid___oTotalPaid' . Configuration::get('PS_EXPORT_ORDERS_SEP_FIELDS') . 'Итого к оплате' . Configuration::get('PS_EXPORT_ORDERS_SEP_LINE') . 'o__date_upd___oDateUpd' . Configuration::get('PS_EXPORT_ORDERS_SEP_FIELDS') . 'Дата' . Configuration::get('PS_EXPORT_ORDERS_SEP_LINE') . 'c__id_customer___cIdCustomer' . Configuration::get('PS_EXPORT_ORDERS_SEP_FIELDS') . 'Идентификатор пользователя' . Configuration::get('PS_EXPORT_ORDERS_SEP_LINE') . 'c__firstname___cFirstname' . Configuration::get('PS_EXPORT_ORDERS_SEP_FIELDS') . 'Имя' . Configuration::get('PS_EXPORT_ORDERS_SEP_LINE') . 'c__lastname___cLastname' . Configuration::get('PS_EXPORT_ORDERS_SEP_FIELDS') . 'Фамилия' . Configuration::get('PS_EXPORT_ORDERS_SEP_LINE') . 'c__email___cEmail' . Configuration::get('PS_EXPORT_ORDERS_SEP_FIELDS') . 'email' . Configuration::get('PS_EXPORT_ORDERS_SEP_LINE') . 'p__id_oneC___pIdOneC' . Configuration::get('PS_EXPORT_ORDERS_SEP_FIELDS') . 'Идентификатор 1С' . Configuration::get('PS_EXPORT_ORDERS_SEP_LINE') . 'p__price___pPrice' . Configuration::get('PS_EXPORT_ORDERS_SEP_FIELDS') . 'Цена' . Configuration::get('PS_EXPORT_ORDERS_SEP_LINE') . 'od__product_quantity___odProductQuantity' . Configuration::get('PS_EXPORT_ORDERS_SEP_FIELDS') . 'Кол-во');

        return true;
    }

    public function uninstall()
    {
        if (!parent::uninstall())
            return false;

        return true;

    }

    public function getContent()
    {
        $this->sep_fields = Configuration::get('PS_EXPORT_ORDERS_SEP_FIELDS');
        $this->sep_line = Configuration::get('PS_EXPORT_ORDERS_SEP_LINE');
        $message = '';

        if (Tools::isSubmit('submit_' . $this->name))
            $message = $this->_saveContent();

        $this->_displayContent($message);

        return $this->display(__FILE__, 'views/admin/exportAdmin.tpl');
    }

    private function _saveContent()
    {
        $fields = Tools::getValue('fields');
        $dataFormat = Tools::getValue('dataFormat');
        $status = Tools::getValue('status');
        $payment = Tools::getValue('payment');

        if (!$fields) {
            $massage = $this->displayError($this->l("Не выбрано ни одно поле"));
            return $massage;
        }

        $orders_fields = '';
        for ($i = 0; $i < count($fields); $i++) {
            $orders_fields .= $fields[$i] . $this->sep_fields . $this->fields[$fields[$i]];
            if ($i != count($fields) - 1) {
                $orders_fields .= $this->sep_line;
            }
        }

        Configuration::updateValue('PS_EXPORT_ORDERS_FIELDS', $orders_fields);

        if ($dataFormat == 'from_till') {
            $date_from = Tools::getValue('date_from');
            $date_to = Tools::getValue('date_to');

            if (!$date_from && !$date_to) {
                $massage = $this->displayError($this->l("Не выбранна ни одна дата"));
                return $massage;
            }

            Configuration::updateValue('PS_EXPORT_ORDERS_TIME', 1);
            Configuration::updateValue('PS_EXPORT_ORDERS_TIME_FROM', $date_from);
            Configuration::updateValue('PS_EXPORT_ORDERS_TIME_TO', $date_to);
        } else {
            Configuration::updateValue('PS_EXPORT_ORDERS_TIME', 0);
            Configuration::updateValue('PS_EXPORT_ORDERS_TIME_FROM', '');
            Configuration::updateValue('PS_EXPORT_ORDERS_TIME_TO', '');
        }


        if ($status == 'status_choose') {
            $status_value = Tools::getValue('status_value');

            if (!$status_value) {
                $massage = $this->displayError($this->l("Не выбранна статус"));
                return $massage;
            }

            Configuration::updateValue('PS_EXPORT_ORDERS_STATUS', $status_value);
        } else {
            Configuration::updateValue('PS_EXPORT_ORDERS_STATUS', 0);
        }

        if ($payment == 'payment_choose') {

            $payment_value = Tools::getValue('payment_value');

            if (!$payment_value) {
                $massage = $this->displayError($this->l("Не выбранна способ оплаты"));
                return $massage;
            }

            Configuration::updateValue('PS_EXPORT_ORDERS_PAYMENT', trim($payment_value));
        } else {
            Configuration::updateValue('PS_EXPORT_ORDERS_PAYMENT', '');
        }

        $message = $this->displayConfirmation($this->l("Настройки сохранены"));

        return $message;
    }


    private function _displayContent($message)
    {
        $orderStatus = OrderState::getOrderStates((int)$this->context->language->id);
        $orderPayments = Db::getInstance()->executeS("SELECT payment FROM " . _DB_PREFIX_ . "orders GROUP BY payment;");
        $checkedFields = array();
        foreach (explode($this->sep_line, Configuration::get('PS_EXPORT_ORDERS_FIELDS')) as $line) {
            $values = explode($this->sep_fields, $line);
            $checkedFields[$values[0]] = $values[1];
        }

        $result = array(
            'message' => $message,
            'time' => Configuration::get('PS_EXPORT_ORDERS_TIME'),
            'status' => Configuration::get('PS_EXPORT_ORDERS_STATUS'),
            'statuses' => $orderStatus,
            'payment' => Configuration::get('PS_EXPORT_ORDERS_PAYMENT'),
            'payments' => $orderPayments,
            'fields' => $this->fields,
            'checkedFields' => $checkedFields
        );

        if ($result['time']) {
            $result['from'] = Configuration::get('PS_EXPORT_ORDERS_TIME_FROM');
            $result['to'] = Configuration::get('PS_EXPORT_ORDERS_TIME_TO');
        }

        $this->context->smarty->assign($result);
    }
}