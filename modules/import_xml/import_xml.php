<?php

if (!defined('_PS_VERSION_'))

    exit;

class import_xml extends Module

{
    protected $counter = 0;
    protected $add = 0;
    protected $update = 0;
    protected $add_c = 0;
    protected $update_c = 0;
    protected $sale_id = 122;

    public function __construct()
    {
        $this->name = 'import_xml';
        $this->tab = 'other';
        $this->version = '0.5';
        $this->author = 'http://vk.com/id24260100';
        $this->need_instance = 0;
        $this->ps_versions_compliancy = array('min' => '1.6', 'max' => _PS_VERSION_);
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('XML import');
        $this->description = $this->l('Import products from xml');

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
        $message = '';

        if (Tools::isSubmit('submit_' . $this->name))
            $message = $this->_saveContent();

        $this->_displayContent($message);

        return $this->display(__FILE__, 'views/admin/importAdmin.tpl');
    }

    private function _saveContent()
    {
        $message = '';
        $xmlFile = Tools::fileAttachment('xmlFile');

        set_time_limit(10000000000);
        error_reporting(1);

        // Проверяем загружен ли файл
        if (is_uploaded_file($xmlFile["tmp_name"])) {
            move_uploaded_file($xmlFile["tmp_name"], dirname(__FILE__) . "/file/import_xml.xml");
            $xml = simplexml_load_file(dirname(__FILE__) . "/file/import_xml.xml");

            $context = Context::getContext();
            $x = new importXml($context);

            if($xml->{'Классификатор'} && $xml->{'Классификатор'}->{'Группы'}) {
                foreach ($xml->{'Классификатор'}->{'Группы'} as $categories) {
                    foreach ($categories as $category) {
                        $x->setCategory($category, 45);
                    }
                }
            }

            if($xml->{'Каталог'}->{'Товары'}) {
                foreach ($xml->{'Каталог'}->{'Товары'} as $import_products) {
                    foreach ($import_products as $import_product) {
                        unset($product);
                        $this->counter++;

                        $product['1c'] = (string)trim($import_product->attributes()->{'Код1с'});
                        $product['name'] = (string)trim($import_product->attributes()->{'Наименование'});
                        $product['quantity'] = (int)$import_product->attributes()->{'КоличествоНаСкладе'};
                        $product['description'] = (string)trim($import_product->attributes()->{'Описание'});
                        $product['articul'] = (string)trim($import_product->attributes()->{'Артикул'});
                        $product['sale'] = (string)trim($import_product->attributes()->{'Распродажа'});
                        $product['categories'] = explode(',', trim($import_product->attributes()->{'ИдГруппы'}));
                        $product['price'] = (float)str_replace(',', '.', trim($import_product->attributes()->{'Цена'}));
                        $product['special_price'] = (float)str_replace(',', '.', trim($import_product->attributes()->{'Скидка'}));

                        if (!empty($import_product->{'features'}->{'feature'})) {
                            foreach ($import_product->{'features'}->{'feature'} as $features_value) {
                                $product['features'][(string)$features_value->attributes()] = (string)$features_value;
                            }
                        }

                        if (!empty($import_product->{'images'}->{'img'})) {
                            foreach ($import_product->{'images'}->{'img'} as $img) {
                                $product['images'][] = (string)$img;
                            }
                        }

                        if (!empty($product['1c']) && !empty($product['name'])) {
                            $id = Db::getInstance()->getValue("SELECT id_product FROM " . _DB_PREFIX_ . "product WHERE id_oneC = '" . $product['1c'] . "';");
                            if (empty($id)) {
                                $x->_add($product);
                            } else {
                                $x->_update($product, $id);
                            }
                        }
                    }
                }
            }
        } else {
            return $this->displayError($this->l("Ошибка загрузки файла"));
        }

        $massage = "Добавлено категорий: $x->add_c. Обновлено категорий: $x->update_c. Добавлено товаров: $x->add. Обновлено товаров: $x->update.";

        return $this->displayConfirmation($this->l("Файл импортирован! $massage"));
    }

    private function _displayContent($message)
    {
        $this->context->smarty->assign(array(
            'message' => $message
        ));
    }
}