require 'rubygems'
require 'data_mapper'

class Product
  include DataMapper::Resource

  has n, :benefits, 'ProductBenefit'
  has n, :features, 'ProductFeature'

  has n, :product_offers
  has n, :offers, :through => :product_offers

  property :id,             Serial
  property :created_at,     DateTime

  property :name,           String
  property :description,    Text
  property :units_on_hand,  Numeric
  property :units_on_order, Numeric
  property :unit_cost,      Numeric
end