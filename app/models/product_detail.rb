require 'rubygems'
require 'data_mapper'
require 'dm-types'


class ProductDetail
  include DataMapper::Resource

  belongs_to :product

  property :id,             Serial
  property :created_at,     DateTime
  property :type,           Discriminator

  property :name,           String
  property :description,    Text
end


class ProductBenefit < ProductDetail
end


class ProductFeature < ProductDetail
end