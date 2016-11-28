<div id="latest_news_wrap">
    <div class="sdsblog-box-content clearfix slick news row">
        {if isset($view_data) AND !empty($view_data)}
            {assign var='i' value=1}
            {foreach from=$view_data item=post}

                    {assign var="options" value=null}
                    {$options.id_post = $post.id}
                    {$options.slug = $post.link_rewrite}
                    <div id="sds_blog_post" class="sds_blog_post col-xs-12 col-sm-4 col-md-4">
                        <div class="news_module_image_holder">
                             <a href="{smartblog::GetSmartBlogLink('smartblog_post',$options)}">
                                 <img alt="{$post.title}" class="feat_img_small" src="{$modules_dir}smartblog/images/{$post.post_img}-home-default.jpg">
                             </a>
                            <span class="icons-links-wrap">
                                <span class="icons-links-content clearfix">
                                    <a href="{smartblog::GetSmartBlogLink('smartblog_post',$options)}" class="icons-links-link link"><i class="icon news-link-icon"></i></a>
                                    {*<a href="#" class="icons-links-link search"><i class="icon news-search-icon"></i></a></span>*}
                            </span>
                        </div>
                        <div class="news_module_content">
                            <span class="latest-news-date">{$post.date_added}</span>
                            <h4 class="sds_post_title"><a href="{smartblog::GetSmartBlogLink('smartblog_post',$options)}">{$post.title}</a></h4>
                            <p class="latest-news-desc">
                                {$post.short_description|escape:'htmlall':'UTF-8'}
                            </p>
                            <a href="{smartblog::GetSmartBlogLink('smartblog_post',$options)}"  class="r_more">{l s='Подробнее>>' mod='smartbloghomelatestnews'}</a>
                        </div>
                    </div>

                {$i=$i+1}
            {/foreach}
        {/if}
     </div>
</div>