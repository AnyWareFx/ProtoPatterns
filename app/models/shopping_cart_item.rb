require 'rubygems'
require 'data_mapper'

class ShoppingCartItem
  include DataMapper::Resource

  has 1,   :offer

  property :id,         Serial
  property :created_at, DateTime

  property :units,      Numeric
  property :item_total, Numeric
end