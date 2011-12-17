require 'rubygems'
require 'sinatra'
require "dm-core"
require "dm-serializer"
require "json"


before do
  content_type 'application/xml'
end

# Get customer list
get '/customers' do
  DataMapper::Inflector::dasherize Customer.all.to_xml
end

# Create a new Customer
get '/customers/new' do
  DataMapper::Inflector::dasherize Customer.new.to_xml
end

# Add a new Customer
post '/customers' do
  data = JSON.parse request.body.read
  customer = Customer.new
  customer.attributes = data
  if customer.save
    headers 'location' => '/customers/' + customer.id.to_s
    status 201
  else
    status 412
  end
end

# Get an existing Customer
get '/customers/:id' do
  DataMapper::Inflector::dasherize Customer.get(params[:id]).to_xml
end

# Update an existing Customer
put '/customers/:id' do
  data = JSON.parse request.body.read
  customer = Customer.get(params[:id])
  customer.attributes = data
  if customer.save
    status 200
    DataMapper::Inflector::dasherize customer.to_xml
  else
    status 412
  end
end

# Remove an existing Customer
delete '/customers/:id' do
  customer = Customer.get(params[:id])
  customer.destroy
end

# Get the Cart (with items) from an existing Customer
get '/customers/:id/cart' do
  customer = Customer.get(params[:id])
  DataMapper::Inflector::dasherize customer.shopping_cart.to_xml(:methods => [:items])
end
