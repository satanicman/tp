{$message}
<fieldset>
    <div class="panel">
        <form method="post" enctype="multipart/form-data">
            <div class="row">
                <div class="col-lg-12">
                    <div class="panel" id="fieldset_0">
                        <div class="panel-heading">Экспорт заказов CSV</div>
                        <div class="form-wrapper clearfix form-horizontal">
                            <div class="form-group col-lg-6">
                                <div class="row">
                                    <div class="col-lg-3">
                                        <div class="row"><p class="radio"><label for="allTime" class="">
                                                    <input type="radio" name="dataFormat" class="" id="allTime"
                                                            value="allTime"{if !$time} checked="checked"{/if}> За все время</label></p></div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-3">
                                        <div class="row"><p class="radio"><label for="from_till" class=""><input
                                                            type="radio" name="dataFormat" class="" id="from_till"
                                                            value="from_till"{if isset($time) && $time} checked="checked"{/if}> Период</label></p></div>
                                    </div>
                                    <div class="col-lg-4">
                                        <div class="input-group col-lg-12">
                                            <input id="date_from" type="text" data-hex="true" class="datepicker"
                                                   name="date_from"{if isset($time) && isset($from) && $time && $from} value="{$from}"{/if} placeholder="С">
                                                                        <label for="date_from" class="input-group-addon">
                                                                            <i class="icon-calendar-empty"></i>
                                                                        </label>
                                        </div>
                                    </div>
                                    <div class="col-lg-4">
                                        <div class="input-group col-lg-12">
                                            <input id="date_to" type="text" data-hex="true" class="datepicker"
                                                   name="date_to"{if isset($time) && isset($to) && $time && $to} value="{$to}"{/if} placeholder="По">
                                                                        <label for="date_to" class="input-group-addon">
                                                                            <i class="icon-calendar-empty"></i>
                                                                        </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                            <div class="form-group col-lg-6">
                                <div class="row">
                                    <div class="col-lg-3">
                                        <div class="row"><p class="radio"><label for="anyStatus" class="">
                                                    <input type="radio" name="status" class="" id="anyStatus"
                                                           value="anyStatus"{if isset($status) && !$status} checked="checked"{/if}> Любой статус</label></p></div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-3">
                                        <div class="row"><p class="radio"><label for="status_choose" class=""><input
                                                            type="radio" name="status" class="" id="status_choose"
                                                            value="status_choose"{if isset($status) && $status} checked="checked"{/if}> Статус</label></p></div>
                                    </div>
                                    <div class="col-lg-9">
                                        <select class="form-control fixed-width-xxl " name="status_value" id="status_value">
                                            {foreach from=$statuses item=status_value}
                                                <option value="{$status_value.id_order_state}"{if isset($status) && $status && $status == $status_value.id_order_state} selected="selected"{/if}>{$status_value.name}</option>
                                            {/foreach}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                            <div class="form-group col-lg-6">
                                <div class="row">
                                    <div class="col-lg-3">
                                        <div class="row"><p class="radio"><label for="anyPayment" class="">
                                                    <input type="radio" name="payment" class="" id="anyPayment"
                                                           value="anyPayment"{if !$payment} checked="checked"{/if}> Любой способ оплаты</label></p></div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-3">
                                        <div class="row"><p class="radio"><label for="payment_choose" class=""><input
                                                            type="radio" name="payment" class="" id="payment_choose"
                                                            value="payment_choose"{if $payment} checked="checked"{/if}> Способ оплаты</label></p></div>
                                    </div>
                                    <div class="col-lg-9">
                                        <select class="form-control fixed-width-xxl " name="payment_value" id="status_value">
                                            {foreach from=$payments item=p}
                                                <option value="{$p.payment}" {if $payment && $payment == $p.payment} selected="selected"{/if}>{$p.payment}</option>
                                            {/foreach}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                            <div class="form-group col-lg-6">
                                <div class="row">
                                    {function fields level=0}
                                        <ul class="{if !$level}cattree {/if}tree">
                                            {foreach $data as $entry}
                                                {if is_array($entry)}
                                                    <li class="tree-folder">
                                                        <span class="tree-folder-name">
                                                            <label class="tree-toggler">{$entry@key}</label>
                                                        </span>
                                                        {fields data=$entry level=$level+1}
                                                    </li>
                                                {else}
                                                    <li class="tree-item">
                                                        <span class="tree-item-name">
                                                            <input type="checkbox" id="fields_{$entry@key}" name="fields[]"
                                                                   value="{$entry@key}"
                                                                    {if $entry@key|array_key_exists:$checkedFields}checked="checked"{/if}>
                                                            <i class="tree-dot"></i>
                                                            <label for="fields_{$entry@key}" class="tree-toggler">{$entry}</label>
                                                        </span>
                                                    </li>
                                                {/if}
                                            {/foreach}
                                        </ul>
                                    {/function}
                                    {fields data=$fields}
                                </div>
                            </div>
                        </div><!-- /.form-wrapper -->
                        <div class="panel-footer clearfix">
                            <button type="submit" value="1" id="submit_{$module_name}" name="submit_{$module_name}"
                                    class="btn btn-default pull-right"> <i class="process-icon-save"></i>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <script>
                $(function() {
                    $(".datepicker").datepicker({
                        prevText: '',
                        nextText: '',
                        dateFormat: 'yy-mm-dd'
                    });

                    $('.tree-item-name input[type=checkbox]:checked').parent().toggleClass('tree-selected');

                    $(document).on('change', '.datepicker, select.form-control', function(){
                        var radio = $(this).closest('.row').find('input[type=radio]');
                        if (!radio.prop('checked'))
                            radio.prop('checked', true);
                    });

                    $(document).on('change', '.tree-item-name input[type=checkbox]', function () {
                        $(this).parent().toggleClass('tree-selected');
                    });

                    $(document).on('click', '.tree-folder-name', function(){
                        $(this).parent().find('input[type=checkbox]').prop('checked', function( i, val ) { return !val; }).parent().toggleClass('tree-selected');
                    });
                });
            </script>
        </form>
    </div>
</fieldset>