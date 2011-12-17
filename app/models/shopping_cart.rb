require 'rubygems'
require 'data_mapper'

class ShoppingCart
  include DataMapper::Resource

  belongs_to :customer
  has n,     :items,     'ShoppingCartItem'

  property :id,          Serial
  property :created_at,  DateTime

  property :order_total, Float
end