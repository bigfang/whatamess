#!/usr/bin/env ruby
# -*- coding: utf-8 -*-

require 'uri'
require 'net/http'
require 'logger'
require 'nokogiri'
require 'sequel'


DB = Sequel.sqlite('db.sqlite')
@articles = DB[:article]

@logger = Logger.new("post.log")


@base_url = "http://old.acftu.org/template/10001/"

urls = @articles.where(:post_date=>nil).select_map([:id, :url])

urls.each do |id, url|
  uri = URI(@base_url + url)
  @logger.info("### #{uri}")
  page = Net::HTTP.get(uri).encode("UTF-8", "GBK", :invalid => :replace, :undef => :replace, :replace => "?")
  doc = Nokogiri::HTML(page)
  begin
    date = doc.css('.file_date').text
    content = doc.css('#ArticleBody').last.text.strip
  rescue
    @logger.error("Page Error #{id}")
  end
  @articles.where(:id=>id).update(:post_date=>date, :content=>content)
end

@logger.info("Fin!")
