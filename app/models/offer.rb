require 'rubygems'
require 'data_mapper'

class Offer
  include DataMapper::Resource

  has n, :product_offers
  has n, :products, :through => :product_offers
  has n, :shopping_cart_items

  property :id,           Serial
  property :created_at,   DateTime

  property :name,         String
  property :description,  Text
  property :unit_price,   Numeric
end