<?php

class importXml
{
    public $add = 0;
    public $update = 0;
    public $add_c = 0;
    public $update_c = 0;
    protected $context;
    protected $sale_id = 122;

    function __construct($context)
    {
        $this->context = $context;
    }

    public function _saveContent()
    {
        $filePath = dirname(_PS_FILE_DIR_) . "/file/import.xml";


        ini_set('max_execution_time','0');
        set_time_limit(0);
        error_reporting(1);

        if (file_exists($filePath)) {
            $xml = simplexml_load_file($filePath);

            if($xml->{'Классификатор'} && $xml->{'Классификатор'}->{'Группы'}) {
                foreach ($xml->{'Классификатор'}->{'Группы'} as $categories) {
                    foreach ($categories as $category) {
                        $this->setCategory($category, 45);
                    }
                }
            }

            if($xml->{'Каталог'}->{'Товары'}) {
                foreach ($xml->{'Каталог'}->{'Товары'} as $import_products) {
                    foreach ($import_products as $import_product) {
                        unset($product);

                        $product['1c'] = (string)trim($import_product->attributes()->{'Код1с'});
                        $product['name'] = (string)trim($import_product->attributes()->{'Наименование'});
                        $product['quantity'] = (int)$import_product->attributes()->{'КоличествоНаСкладе'};
                        $product['description'] = (string)trim($import_product->attributes()->{'Описание'});
                        $product['articul'] = (string)trim($import_product->attributes()->{'Артикул'});
                        $product['sale'] = (string)trim($import_product->attributes()->{'Распродажа'});
                        $product['categories'] = explode(',', trim($import_product->attributes()->{'ИдГруппы'}));
                        $product['price'] = (float)str_replace(',', '.', trim($import_product->attributes()->{'Цена'}));
                        $product['special_price'] = (float)str_replace(',', '.', trim($import_product->attributes()->{'Скидка'}));
                        $product['stock'] = (int)$import_product->attributes()->{'Акция'};;
                        $product['top_sales'] = (int)$import_product->attributes()->{'Хит'};;
                        $product['free_shipping'] = (int)$import_product->attributes()->{'БесплатнаяДоставка'};;


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
                                $this->_add($product);
                            } else {
                                $this->_update($product, $id);
                            }
                        }
                    }
                }
            }
        }

        die();
    }

    public function _add($product)
    {
        if($product['name']) {
            $product_make = $this->_makeProduct($product);
            $p = $product_make['product'];
            $categories_id = $product_make['categories_id'];

            if($p->add()) {
                $this->add++;
                if(isset($product['features']) & $product['features'])
                    $this->_setFeatures($product['features'], $p->id);

                if(isset($product['special_price']))
                    $this->_SpecialPrice($p->id, $product['special_price']);

                if(isset($product['quantity']) && $product['quantity'])
                    StockAvailable::setQuantity($p->id, 0, $product['quantity']);

                if(isset($categories_id) && $categories_id)
                    $p->addToCategories($categories_id);

                if(isset($product['images']) && $product['images']) {
                    foreach ($product['images'] as $img) {
                        $this->generateImages($img, $p);
                    }
                }
            }

            return true;
        }

        return false;

    }

    public function _update($product, $id)
    {
        if($product['name']) {
            $product_make = $this->_makeProduct($product, $id);
            $p = $product_make['product'];
            $categories_id = $product_make['categories_id'];
            if($p->update()) {
                $this->update++;

                if(isset($product['special_price']))
                    $this->_SpecialPrice((int)$p->id, $product['special_price'], true);

                if(isset($product['features']) && $product['features']) {
                    $p->deleteFeatures();
                    $this->_setFeatures($product['features'], $p->id);
                }
                if(isset($categories_id) && $categories_id)
                    $p->updateCategories($categories_id);

                if(isset($product['images']) && $product['images']) {
                    $p->deleteImages();
                    foreach ($product['images'] as $img) {
                        $this->generateImages($img, $p);
                    }
                }

                if($product['quantity'])
                    StockAvailable::setQuantity($p->id, 0, $product['quantity']);
            }

            return true;
        }

        return false;
    }

    private function _setFeatures($features, $product_id)
    {
        if ($product_id) {
            foreach ($features as $feature_name => $feature_value) {
                if ($feature_name && !$id_feature = Db::getInstance()->executeS('SELECT id_feature FROM `' . _DB_PREFIX_ . 'feature_lang` WHERE `name` = "' . $feature_name . '"')) {
                    $feature_name = strip_tags($feature_name);
                    if (strlen($feature_name) > 120) {
                        $feature_name = substr($feature_name, 0, 120);
                    }
                    $f = new Feature();
                    $f->name = array_fill_keys(Language::getIDs(), (string)$feature_name);
                    $f->add();
                    $id_feature = $f->id;
                }

                if (is_array($id_feature)) {
                    $id_feature = $id_feature[0]['id_feature'];
                }

                if ($feature_value && $id_feature && !$id_feature_value = Db::getInstance()->executeS('SELECT id_feature_value FROM `' . _DB_PREFIX_ . 'feature_value_lang` WHERE `value` = "' . $feature_value . '"')) {
                    $feature_value = strip_tags($feature_value);
                    if (strlen($feature_value) > 250) {
                        $feature_value = substr($feature_value, 0, 250);
                    }
                    $fv = new FeatureValue();
                    $fv->id_feature = $id_feature;
                    $fv->value = array_fill_keys(Language::getIDs(), (string)$feature_value);
                    $fv->add();
                    $id_feature_value = $fv->id;
                }

                if (is_array($id_feature_value)) {
                    $id_feature_value = $id_feature_value[0]['id_feature_value'];
                }

                Product::addFeatureProductImport($product_id, $id_feature, $id_feature_value);
            }
        }
    }

    public function generateImages($link, $product)
    {
        if (!empty($link) && $product->id) {
            $photo_isset = str_replace("\\", "/", _PS_ROOT_DIR_ . '/img/' . trim($link));
            if (file_exists($photo_isset)) {
                $image = new Image();
                $image->id_product = $product->id;
                if(!Image::getCover($product->id))
                    $image->cover = 1;
                $image->position = 0;
                $image->legend = array_fill_keys(Language::getIDs(), (string)$product->name);
                $image->save();
                $name = $image->getPathForCreation();
                copy($photo_isset, $name . '.' . $image->image_format);
                $types = ImageType::getImagesTypes('products');
                foreach ($types as $type)
                    ImageManager::resize($photo_isset, $name . '-' . $type['name'] . '.' . $image->image_format, $type['width'], $type['height'], $image->image_format);
            }
        }
        return true;
    }

    public function setCategory($category, $parent_id) {
        if($parent_id) {
            if($category->{'Ид'} && $category->{'Наименование'}) {
                $id = (string)$category->{'Ид'};
                $name = (string)$category->{'Наименование'};
                $sql = "SELECT max(c.id_parent) FROM " . _DB_PREFIX_ . "category c WHERE c.id_oneC = '" . $id . "'";
                $isset = Db::getInstance()->getValue($sql);
                if($isset && $isset != $parent_id) {
                    die('Ошибка! Категория с таки идентификатором 1с уже существует!!!');
                }
                $sql = "SELECT max(c.id_category) FROM " . _DB_PREFIX_ . "category c WHERE c.id_oneC = '" . $id . "' AND c.id_parent = '" . $parent_id . "'";
                $id_cat = Db::getInstance()->getValue($sql);
                if($id_cat) {
                    $c = new Category($id_cat, $this->context->language->id);
                    $c->id_oneC = $id;
                    $c->name = $name;
                    $c->link_rewrite = Tools::link_rewrite($name);
                    $c->id_parent = $parent_id;
                    if($c->update()) {
                        $this->update_c++;
                    }
                } else {
                    $c = new Category(null, $this->context->language->id);
                    $c->id_oneC = $id;
                    $c->name = $name;
                    $c->link_rewrite = Tools::link_rewrite($name);
                    $c->id_parent = $parent_id;
                    if($c->add()) {
                        $this->add_c++;
                    }

                }
                if ($category->{'Группы'}) {
                    foreach ($category->{'Группы'}->{'Группа'} as $g) {
                        $this->setCategory($g, $c->id);
                    }
                }

                return true;
            }
            return false;
        }

        return false;
    }

    protected function _SpecialPrice($id, $special_price) {
        $specificPrice = new SpecificPrice();
        $specificPrice->id_product = (int)$id;
        $specificPrice->id_product_attribute = 0;
        $specificPrice->id_shop = 0;
        $specificPrice->id_currency = 0;
        $specificPrice->id_country = 0;
        $specificPrice->id_group = 0;
        $specificPrice->id_customer = 0;
        $specificPrice->from_quantity = 1;
        $specificPrice->from = '0000-00-00 00:00:00';
        $specificPrice->to = '0000-00-00 00:00:00';
        $specificPrice->price = -1;
        $specificPrice->reduction = (float)($special_price/100);
        $specificPrice->reduction_type = 'percentage';
        if($special_price) {
            $specificPrice->deleteByProductId((int)$id);
            $specificPrice->add();
            return true;
        } else {
            $specificPrice->deleteByProductId((int)$id);
        }
    }

    protected function _makeProduct($product, $id = null) {
        $p = new Product($id, false, $this->context->language->id);
        $p->id_oneC = (string)$product['1c'];
        $p->name = (string)$product['name'];
        $p->active = 1;
        $p->link_rewrite = (string)Tools::link_rewrite($product['name']);
        $p->description = (string)$product['description'];
        $p->price = (float)$product['price'];

        $p->stock = $product['stock'];
        $p->top_sales = $product['top_sales'];
        $p->free_shipping = $product['free_shipping'];

        $categories_id[] = Configuration::get('PS_HOME_CATEGORY');
        if($product['sale'])
            $categories_id[] = $this->sale_id;

        if ($product['articul'])
            $p->reference = (string)$product['articul'];

        if(isset($product['categories']) && $product['categories']) {
            foreach ($product['categories'] as $category) {
                if($id_category = Db::getInstance()->getValue('SELECT max(id_category) FROM `' . _DB_PREFIX_ . 'category` WHERE `id_oneC` = "' . $category . '"')) {
                    $p->id_category_default = $categories_id[] = $id_category;
                }
            }
        }

        return array('product' => $p, 'categories_id' => $categories_id);
    }
}