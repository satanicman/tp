<?php
/**
 * Created by PhpStorm.
 * User: Боря
 * Date: 30.08.2016
 * Time: 16:07
 */
class IdentityController extends IdentityControllerCore
{
    /**
     * Start forms process
     * @see FrontController::postProcess()
     */
    public function postProcess()
    {
        $origin_newsletter = (bool)$this->customer->newsletter;

        if (Tools::isSubmit('submitIdentity')) {
            die('444');
            $addresses = $this->customer->getAddresses($this->context->language->id);
            if(count($addresses)) {
                foreach ($addresses as $address) {
                    $address_obj = new Address($address['id_address']);
                    $address_obj->phone = Tools::getValue('phone');
                    $address_obj->address1 = Tools::getValue('address');
                    $address_obj->save();
                }
            }
            $this->customer->address = Tools::getValue('address');
            $this->customer->phone = Tools::getValue('phone');

            $email = trim(Tools::getValue('email'));

            if (Tools::getValue('months') != '' && Tools::getValue('days') != '' && Tools::getValue('years') != '') {
                $this->customer->birthday = (int)Tools::getValue('years').'-'.(int)Tools::getValue('months').'-'.(int)Tools::getValue('days');
            } elseif (Tools::getValue('months') == '' && Tools::getValue('days') == '' && Tools::getValue('years') == '') {
                $this->customer->birthday = null;
            } else {
                $this->errors[] = Tools::displayError('Invalid date of birth.');
            }

            if (Tools::getIsset('old_passwd')) {
                $old_passwd = trim(Tools::getValue('old_passwd'));
            }

            if (!Validate::isEmail($email)) {
                $this->errors[] = Tools::displayError('This email address is not valid');
            } elseif ($this->customer->email != $email && Customer::customerExists($email, true)) {
                $this->errors[] = Tools::displayError('An account using this email address has already been registered.');
//            } elseif (!Tools::getIsset('old_passwd') || (Tools::encrypt($old_passwd) != $this->context->cookie->passwd)) {
//                $this->errors[] = Tools::displayError('The password you entered is incorrect.');
//            } elseif (Tools::getValue('passwd') != Tools::getValue('confirmation')) {
//                $this->errors[] = Tools::displayError('The password and confirmation do not match.');
            } else {
                $prev_id_default_group = $this->customer->id_default_group;

                // Merge all errors of this file and of the Object Model
                $this->errors = array_merge($this->errors, $this->customer->validateController());
            }

            if (!count($this->errors)) {
                $this->customer->id_default_group = (int)$prev_id_default_group;
                $this->customer->firstname = Tools::ucwords($this->customer->firstname);

                if (Configuration::get('PS_B2B_ENABLE')) {
                    $this->customer->website = Tools::getValue('website'); // force update of website, even if box is empty, this allows user to remove the website
                    $this->customer->company = Tools::getValue('company');
                }

                if (!Tools::getIsset('newsletter')) {
                    $this->customer->newsletter = 0;
                } elseif (!$origin_newsletter && Tools::getIsset('newsletter')) {
                    if ($module_newsletter = Module::getInstanceByName('blocknewsletter')) {
                        /** @var Blocknewsletter $module_newsletter */
                        if ($module_newsletter->active) {
                            $module_newsletter->confirmSubscription($this->customer->email);
                        }
                    }
                }

                if (!Tools::getIsset('optin')) {
                    $this->customer->optin = 0;
                }
                if (Tools::getValue('passwd')) {
                    $this->context->cookie->passwd = $this->customer->passwd;
                }
                if ($this->customer->update()) {
                    $this->context->cookie->customer_lastname = $this->customer->lastname;
                    $this->context->cookie->customer_firstname = $this->customer->firstname;
                    $this->context->smarty->assign('confirmation', 1);
                } else {
                    $this->errors[] = Tools::displayError('The information cannot be updated.');
                }
            }
        } else {
            $_POST = array_map('stripslashes', $this->customer->getFields());
        }

        return $this->customer;
    }

    /**
     * Assign template vars related to page content
     * @see FrontController::initContent()
     */
    public function initContent()
    {
        parent::initContent();

        if ($this->customer->birthday) {
            $birthday = explode('-', $this->customer->birthday);
        } else {
            $birthday = array('-', '-', '-');
        }
        $address = null;
        $addresses = $this->customer->getAddresses($this->context->language->id);
        if(isset($addresses[0])){
            $address = $addresses[0];
            $_POST['phone'] = $address['phone'];
            $_POST['address'] = $address['address1'];
        }
        $_POST['address'] = $this->customer->address ;
        $_POST['phone'] =  $this->customer->phone;

        /* Generate years, months and days */
        $this->context->smarty->assign(array(
            'address' => $address,
            'years' => Tools::dateYears(),
            'sl_year' => $birthday[0],
            'months' => Tools::dateMonths(),
            'sl_month' => $birthday[1],
            'days' => Tools::dateDays(),
            'sl_day' => $birthday[2],
            'errors' => $this->errors,
            'genders' => Gender::getGenders(),
        ));

        // Call a hook to display more information
        $this->context->smarty->assign(array(
            'HOOK_CUSTOMER_IDENTITY_FORM' => Hook::exec('displayCustomerIdentityForm'),
        ));

        $newsletter = Configuration::get('PS_CUSTOMER_NWSL') || (Module::isInstalled('blocknewsletter') && Module::getInstanceByName('blocknewsletter')->active);
        $this->context->smarty->assign('newsletter', $newsletter);
        $this->context->smarty->assign('optin', (bool)Configuration::get('PS_CUSTOMER_OPTIN'));

        $this->context->smarty->assign('field_required', $this->context->customer->validateFieldsRequiredDatabase());
        $addresses = $this->customer->getAddresses($this->context->language->id);


        $this->setTemplate(_PS_THEME_DIR_.'identity.tpl');
    }
    
}