---
layout:         page
title:          "Proyectos"
description:    "¡Proyectos en los que he participado!"
header-img:     "img/page/posts.jpg"
ico:            folder-open
permalink: /proyectos
comments: false
sitemap:
  lastmod: 2021-02-08
---
<hr />
<a itemprop="url" href="https://expertospcgaming.com/" target="_blank"><span itemprop="name headline"><img src="/img/page/img_posts/expertospcgaming.png" alt="Expertos PC Gaming" style="border: 0px solid #333; display: inline; background-color:#ed4250; border-radius:5px;" /></a>
<hr />
<img src="/img/page/img_posts/todo_hosting.png" alt="SEO para Nichos" style="border: 0px solid #333; display: inline;" />
<hr />
<article itemscope itemtype="http://schema.org/Article">
  <ul class="row">
    <li class="col-sm-9">
      <a itemprop="url" href="https://todohosting.top/mejor-hosting-espana/" target="_blank"><span itemprop="name headline">El mejor hosting de España del 2019</span></a>
    </li>
    <li class="col-sm-9">
      <a itemprop="url" href="https://todohosting.top/mejor-hosting-wordpress/" target="_blank"><span itemprop="name headline">¿Cuál es el mejor hosting WordPress del 2019?</span></a>
    </li>
    <li class="col-sm-9">
      <a itemprop="url" href="https://todohosting.top/mejor-hosting-barato/" target="_blank"><span itemprop="name headline">¿Cuál es el mejor hosting barato del 2019?</span></a>
    </li>
    <li class="col-sm-9">
      <a itemprop="url" href="https://todohosting.top/webempresa/" target="_blank"><span itemprop="name headline">Review: Webempresa</span></a>
    </li>
    <li class="col-sm-9">
      <a itemprop="url" href="https://todohosting.top/siteground/" target="_blank"><span itemprop="name headline">Review: Siteground</span></a>
    </li>
    <li class="col-sm-9">
      <a itemprop="url" href="https://todohosting.top/raiola-networks/" target="_blank"><span itemprop="name headline">Review: Raiola Networks</span></a>
    </li>
  </ul>
</article>
<!-- Separador -->
{% for post in site.posts %}
  {% unless post.next %}
    <hr />
    <h3 id="{{ post.date | date: '%Y' }}" class="section-heading">{{ post.date | date: '%Y' }}</h3>
    <hr />
  {% else %}
    {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
    {% capture nyear %}{{ post.next.date | date: '%Y' }}{% endcapture %}
    {% if year != nyear %}
      <hr />
      <h3 id="{{ post.date | date: '%Y' }}" class="section-heading">{{ post.date | date: '%Y' }}</h3>
      <hr />
    {% endif %}
  {% endunless %}
  <article itemscope itemtype="http://schema.org/Article">
    <link itemprop="image" href="{% if post.featured_image %}{{ post.featured_image }}{% else %}{{ site.icon }}{% endif %}">
    <ul class="row">
      <li class="col-sm-9">
        <a itemprop="url" href="{{ post.url }}"><span itemprop="name headline">{{ post.title | markdownify | strip_html | strip_newlines }}</span></a>
      </li>
    </ul>
  </article>
{% endfor %}
