#!/usr/bin/env ruby
# -*- coding: utf-8 -*-

require 'uri'
require 'net/http'
require 'logger'
require 'nokogiri'
require 'sequel'


DB = Sequel.sqlite('db.sqlite')
@categories = DB[:category]
@articles = DB[:article]
@cids = {222=>"ghyw", 721=>"qz", 67=>"sjgh", 505=>"cygh", 722=>"df", 181=>"dfgh", 90=>"jcgh"}


@logger = Logger.new("crawl.log")

def req_page(url, page=1)
  form_data = {pgno: page}
  response = Net::HTTP.post_form(url, form_data)
  response.body.encode("UTF-8", "GBK", :invalid => :replace, :undef => :replace, :replace => "?")
end

def parse_article(doc, cid)
  article_urls = doc.css('td[style="color:#0e2694;"] a')
  article_urls.each do |a|
    title = a.text
    link = a['href']
    aid = link.split('=').last
    begin
      @articles.insert(:id=>aid, :url=>link, :title=>title)
      DB[@cids[cid].to_sym].insert(:category_id=>cid, :article_id=>aid)
    rescue Sequel::UniqueConstraintViolation
      @logger.error("^^^ duplicate article is #{aid}")
    end
    # @logger.info("### category #{cid} | article #{aid}")
  end
  # sleep 1
end

def crawl_category(cid, init_category=1, init_page=1)
  uri = URI("http://old.acftu.org/template/10001/column.jsp?cid=#{cid}")

  doc = Nokogiri::HTML(req_page(uri))
  page_line = doc.css('form[name="jumpform"] .pagenote_left').text.scan(/\d+/)
  total, max_page = page_line[0], page_line[1]
  @categories.where(:id=> cid).update(:count=>total)

  init = cid == init_category.to_i ? init_page.to_i : 1

  (init..max_page.to_i).each do |page|
    @logger.info("*** category #{cid} | total #{max_page} | page #{page}")
    doc = Nokogiri::HTML(req_page(uri, page))
    parse_article(doc, cid)
    # break                       # debug
  end
end


def crawler(init)
  @cids.each do |cid, cname|
    @logger.info("!--- category #{cid}")
    DB.create_table cname do
      foreign_key :category_id, :category
      foreign_key :article_id, :article
      unique [:article_id]
    end
    DB[cname]

    crawl_category(cid, init[0], init[1])
  end
end

crawler(ARGV)
@logger.info('Fin!')
