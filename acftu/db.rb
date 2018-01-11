#!/usr/bin/env ruby
# -*- coding: utf-8 -*-

require 'sequel'

DB = Sequel.sqlite('db.sqlite')

DB.create_table :category do
  primary_key :id
  Integer :type
  String :name, :fixed=>true, :size=>10
  Integer :count
end

DB.create_table :article do
  primary_key :id
  String :url, :fixed=>true
  String :title, :fixed=>true, :size=>100
  String :content, :text=>true
  Date :post_date
  String :from, :fixed=>true, :size=>10
end

DB[:category, :article]


data = {222=>"工会要闻", 721=>"全总", 67=>"省级工会", 505=>"产业工会", 722=>"地方", 181=>"地方工会", 90=>"基层工会"}

category = DB[:category]

data.each do |k, v|
  category.insert(:id=>k, :type=>1, :name=>v)
end
