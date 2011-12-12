require 'rubygems'
require 'data_mapper'

class Customer
  include DataMapper::Resource

  has 1,   :shopping_cart

  property :id,         Serial
  property :created_at, DateTime

  property :first_name, String
  property :last_name,  String
  property :address_1,  String
  property :address_2,  String
  property :city,       String
  property :state,      String
  property :zip,        String, :default => '66212'
end