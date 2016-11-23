<?php

class ExportOrdersControllerCore extends FrontController
{
    public $php_self = 'export-orders';
    protected $sep_line;
    protected $sep_fields;

    /**
     * Sets default medias for this controller
     */
    public function setMedia()
    {
        parent::setMedia();
    }

    public function init() {
        parent::init();
    }


    public function initContent() {
        parent::initContent();

//        $cookie = new Cookie('psAdmin');
//        if ($cookie->id_employee){
            $this->exportOrders();
            $this->setTemplate(_PS_THEME_DIR_.'export-orders.tpl');
//        }
//        else {
//            Tools::redirect('/');
//        }
    }

    private function exportOrders() {
        $where = '';
        $select = array();
        $fields = array();
        $this->sep_fields = Configuration::get('PS_EXPORT_ORDERS_SEP_FIELDS');
        $this->sep_line = Configuration::get('PS_EXPORT_ORDERS_SEP_LINE');

        foreach (explode($this->sep_line, Configuration::get('PS_EXPORT_ORDERS_FIELDS')) as $line) {
            $values = explode($this->sep_fields, $line);
            $fields[$values[0]] = $values[1];
        }
        $group_by = "";
        $first_line = array('id_order');

        if(!$fields) {
            return true;
        }

        foreach($fields as $key => $field){
            array_push ($first_line, $field);
            $select[] = implode(".", explode("__", implode(" AS ", explode("___", $key))));
        }

        $fields = implode(',', $select);

        if(!preg_match("/(^|,)(p|pl|catl|od)./", $fields)){
            $group_by = " GROUP BY o.id_order";
        }


        if(Configuration::get('PS_EXPORT_ORDERS_TIME')) {
            if (Configuration::get('PS_EXPORT_ORDERS_TIME_FROM')) {
                $where .= " AND o.date_add >= '" . Configuration::get('PS_EXPORT_ORDERS_TIME_FROM') . "'";
            }
            if (Configuration::get('PS_EXPORT_ORDERS_TIME_TO')) {
                $where .= " AND o.date_add <= '" . Configuration::get('PS_EXPORT_ORDERS_TIME_TO') . "'";
            }
        }

        if(Configuration::get('PS_EXPORT_ORDERS_STATUS')) {
            $where .= " AND osl.id_order_state = '" . Configuration::get('PS_EXPORT_ORDERS_STATUS') . "'";
        }

        if(Configuration::get('PS_EXPORT_ORDERS_PAYMENT')) {
            $where .= " AND o.payment = '" . Configuration::get('PS_EXPORT_ORDERS_PAYMENT') . "'";
        }

        $sql = "SELECT o.id_order as oIdOrder,".$fields." FROM ps_orders o
            LEFT JOIN ps_customer c ON c.id_customer = o.id_customer
            LEFT JOIN ps_currency cur ON cur.id_currency = o.id_currency
            LEFT JOIN ps_order_detail od ON od.id_order = o.id_order
            LEFT JOIN ps_product p ON p.id_product = od.product_id
            LEFT JOIN ps_product_lang pl ON pl.id_product = p.id_product
            LEFT JOIN ps_category_lang catl ON catl.id_category = p.id_category_default
            LEFT JOIN ps_delivery del ON del.id_delivery = o.id_address_delivery
            LEFT JOIN ps_carrier car ON car.id_carrier = del.id_carrier
            LEFT JOIN ps_carrier_lang carl ON carl.id_carrier = car.id_carrier
            LEFT JOIN ps_zone zone ON zone.id_zone = del.id_zone
            LEFT JOIN ps_order_state_lang osl ON osl.id_order_state = o.current_state
            WHERE 1".$where.$group_by.' ORDER BY o.id_order DESC';

        $result = Db::getInstance()->executeS($sql);

        if(!empty($result) && $result){
            $csv_file = _PS_FILE_DIR_."/orders.csv";
            array_unshift($result, $first_line);
            unlink($csv_file);
            $fp = fopen($csv_file, "w");

            fwrite($fp,b"\xEF\xBB\xBF" );

            foreach ($result as $order) {
                foreach ($order as $k => $v) {
                    if(!$v)
                        $order[$k] = 'Не определено';
                }
                fputcsv($fp, $order, ";");
            }

            header ("Content-Type: application/octet-stream");
            header ("Accept-Ranges: bytes");
            header ("Content-Length: ".filesize($csv_file));
            header ("Content-Disposition: attachment; filename=order.csv");
            readfile($csv_file);
        }
    }
}
?>