{$message}
<fieldset>
    <div class="panel">
        <div class="panel-heading">Импорт товаров из XML</div>
        <form method="post" enctype="multipart/form-data">
            <div class="row">
                <div class="col-lg-12">
                    <div class="form-group">
                        <label class="control-label col-lg-6 file_upload_label">
                            <span class="label-tooltip" data-toggle="tooltip" title="Формат XML. Размер файла 3.00 MБ макс.">XML файл</span>
                        </label>
                        <div class="col-lg-6">
                            <div class="form-group">
                                <div class="col-lg-12">
                                    <input id="file" type="file" name="xmlFile" multiple="multiple" style="width:0px;height:0px;" accept="text/xml">
                                    <button class="btn btn-default" data-style="expand-right" data-size="s" type="button" id="file-add-button"> <i class="icon-folder-open"></i>
                                        Добавить файлы...
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="panel-footer">
                <button type="submit" value="1" id="submit_{$module_name}" name="submit_{$module_name}" class=""> <i class="process-icon-save"></i>
                    Сохранить
                </button>
            </div>
        </form>
    </div>
    <script>
    $(function() {
        $('#file-add-button').on('click', function() {
            $('#file').trigger('click');
        });
    });
    </script>
</fieldset>