require 'rubygems'
require 'data_mapper'
require 'dm-types'


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