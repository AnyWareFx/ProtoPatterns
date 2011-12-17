require 'rubygems'
require 'data_mapper'

class ShoppingCartItem
  include DataMapper::Resource

  belongs_to :offer

  property :id,         Serial
  property :created_at, DateTime

  property :units,      Integer
  property :item_total, Float
end