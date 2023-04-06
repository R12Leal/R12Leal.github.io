---
layout:         page
title:          "Proyectos"
description:    "¡Proyectos en los que he participado!"
header-img:     "img/page/posts.jpg"
image:          "img/page/proyectos.jpg"
ico:            folder-open
permalink: /proyectos
comments: false
sitemap:
  lastmod: 2023-04-06
---
<table class="table">
  <tbody>
    <tr class="tr_title">
      <td colspan="2"><strong>Aplicaciones - Webs</strong></td>
    </tr>
    <tr>
      <td class="td_caption"><img src="/img/page/img_posts/todo_hosting.png" alt="SEO para Nichos" style="border: 0px solid #333; display: inline;" /></td>
    </tr>
    <tr>
      <td class="td_caption"><a itemprop="url" href="https://expertospcgaming.com/" target="_blank"><span itemprop="name headline"><img src="/img/page/img_posts/expertospcgaming.png" alt="Expertos PC Gaming" style="border: 0px solid #333; display: inline; background-color:#ed4250; border-radius:5px;"/></span></a></td>
    </tr>
  </tbody>
</table>
<hr />
<article itemscope itemtype="http://schema.org/Article">
<table class="table">
  <tbody>
    <tr class="tr_title_bl">
      <td colspan="2"><strong>Artículos - Posts | Todohosting.top</strong></td>
    </tr>
    <tr>
      <td class="td_caption"><a itemprop="url" href="https://todohosting.top/mejor-hosting-espana/" target="_blank"><span itemprop="name headline">El mejor hosting de España del 2019</span></a></td>
    </tr>
    <tr>
      <td class="td_caption"><a itemprop="url" href="https://todohosting.top/mejor-hosting-wordpress/" target="_blank"><span itemprop="name headline">¿Cuál es el mejor hosting WordPress del 2019?</span></a></td>
    </tr>
    <tr>
      <td class="td_caption"><a itemprop="url" href="https://todohosting.top/mejor-hosting-barato/" target="_blank"><span itemprop="name headline">¿Cuál es el mejor hosting barato del 2019?</span></a></td>
    </tr>
    <tr>
      <td class="td_caption"><a itemprop="url" href="https://todohosting.top/webempresa/" target="_blank"><span itemprop="name headline">Review: Webempresa</span></a></td>
    </tr>
    <tr>
      <td class="td_caption"><a itemprop="url" href="https://todohosting.top/siteground/" target="_blank"><span itemprop="name headline">Review: Siteground</span></a></td>
    </tr>
    <tr>
      <td class="td_caption"><a itemprop="url" href="https://todohosting.top/raiola-networks/" target="_blank"><span itemprop="name headline">Review: Raiola Networks</span></a></td>
    </tr>
  </tbody>
</table>
</article>
<hr />
<article itemscope itemtype="http://schema.org/Article">
<table class="table">
  <tbody>
    <tr class="tr_title">
      <td colspan="2"><strong>Artículos / Posts de la web</strong></td>
    </tr>
    {% for post in site.posts %}
    <tr>
      <td class="td_caption"><a itemprop="url" href="{{ post.url }}" target="_blank"><span itemprop="name headline">{{ post.title | markdownify | strip_html | strip_newlines }}</span></a></td>
    </tr>
    {% endfor %}
  </tbody>
</table>
</article>
<hr />