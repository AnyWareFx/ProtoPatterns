require 'rubygems'
require 'data_mapper'
require 'dm-types'

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
  property :units_on_hand,  Integer
  property :units_on_order, Integer
  property :unit_cost,      Float
end


class ProductDetail
  include DataMapper::Resource

  property :id,             Serial
  property :created_at,     DateTime
  property :type,           Discriminator

  property :name,           String
  property :description,    Text
end


class ProductBenefit < ProductDetail
  belongs_to :product
end


class ProductFeature < ProductDetail
  belongs_to :product
end