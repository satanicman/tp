$(document).ready(function () {



    $('#quickorder').click(function () {

        $.fancybox.close();
        $('.layer_cart_overlay, #layer_cart').hide();

        $.fancybox({
            'transitionIn': 'zoomIn',
            'transitionOut': 'zoomOut',
            'titleShow': false,
            'showCloseButton': true,
            'centerOnScroll': true,
            'href': baseDir + 'modules/quickorder/ajax.php',
            'padding': 0,
            'autoScale': false,
            'scrolling': 'no',
            'type': 'ajax',

            ajax: {
                type: "GET",
            },
            'beforeLoad': function () {
                $('#fancybox-outer').addClass('quip');
            },
            'afterClose': function () {
                $('#fancybox-outer').removeClass('quip');
            },
            'afterLoad': function () {

                $('body').on('change', '#delivery', function () {

                        if($('#delivery').val()=="ТК Новая почта"){
                            $('#office').show();
                            $('#del-lab').show();
                        }
                        else{
                            $('#office').hide();
                            $('#del-lab').hide();
                        };
                });

                $('body').on('click', '#submitOrder', function () {
                    $.fancybox.showLoading();

                    var islog = $('#user_phone').val();

                    var email = $('#email').val();
                    var phone = $('#phone_mobile').val();
                    var firstname = $('#firstname').val();
                    var address = $('#address').val();
                    var comment = $('#comment').val();
                    var delivery = $('#delivery').val();
                    var payment = $('#payment').val();
                    var office = $('#office').val();
                    if( email=='' || phone=='' || firstname==''){
                        alert('Заполните обязательные поля');
                        $('#fancybox-loading').hide();
                    }else
                    {
                        $.ajax({
                            type: 'POST',
                            url: baseDir + 'modules/quickorder/ajax.php',
                            async: true,
                            cache: false,
                            dataType: "json",
                            data: 'submitQorder=true' + '&email=' + email + '&phone=' + phone + '&firstname=' + firstname + '&address=' + address + '&comment=' + comment + '&delivery=' + delivery + '&office=' + office + '&payment=' + payment + '&token=' + static_token,
                            success: function (jsonData) {
                                if (jsonData.hasError) {
                                    var errors = '<b>' + 'Ошибки: ' + '</b><ol>';
                                    for (error in jsonData.errors)
                                        if (error != 'indexOf')
                                            errors += '<li>' + jsonData.errors[error] + '</li>';
                                    errors += '</ol>';
                                    $('#errors').html(errors).slideDown('slow');
                                    $('#errors').removeClass('hidden');

                                    $.fancybox.update();
                                    $.fancybox.hideLoading();
                                }
                                else {

                                    $('.ajax_cart_quantity, .ajax_cart_product_txt_s, .ajax_cart_product_txt, .ajax_cart_total').each(function () {
                                        $(this).hide();
                                    });
                                    $('#cart_block dl.products').remove();
                                    $('.ajax_cart_no_product').show('slow');

                                    $('#success').slideDown('slow');
                                    $('#success').removeClass('hidden');
                                    $('.quickform').addClass('success');
                                    
                                    $('#qform #wrap').hide();
                                    $('#qform #errors').slideUp('slow', function () {
                                        $('#qform #errors').hide();
                                        $('#qform .submit').hide();
                                    });

                                    $.fancybox.update();
                                    $.fancybox.hideLoading();
                                    //$.fancybox.close();
                                    if(typeof orderOpcUrl != 'undefined')
                                        location.reload();

                                    if(islog == undefined) {
                                        window.location.href = "/?mylogout=";
                                    } else {
                                        setTimeout(function(){window.location.reload();}, 1000);
                                    }
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("TECHNICAL ERROR: unable create order \n\nDetails:\nError: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus);
                            }
                        });
                    };


                });
            }
        });
        return false;

    });

});