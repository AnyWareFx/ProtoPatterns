require 'rubygems'
require 'sinatra'
require "dm-core"
require "dm-serializer"
require "json"


before do
  content_type 'application/xml'
end

# Get product list
get '/products' do
  DataMapper::Inflector::dasherize Product.all.to_xml
end

# Create a new Product
get '/products/new' do
  DataMapper::Inflector::dasherize Product.new.to_xml
end

# Add a new Product
post '/products' do
  data = JSON.parse request.body.read
  product = Product.new
  product.attributes = data
  if product.save
    headers 'location' => '/products/' + product.id.to_s
    status 201
  else
    status 412
  end
end

# Get an existing Product
get '/products/:id' do
  DataMapper::Inflector::dasherize Product.get(params[:id]).to_xml
end

# Update an existing Product
put '/products/:id' do
  data = JSON.parse request.body.read
  product = Product.get(params[:id])
  product.attributes = data
  if product.save
    status 201
    DataMapper::Inflector::dasherize product.to_xml
  else
    status 412
  end
end

# Remove an existing Product
delete '/products/:id' do
  product = Product.get(params[:id])
  product.destroy
end

# Get Offers for an existing Product
get '/products/:id/offers' do
  product = Product.get(params[:id])
  DataMapper::Inflector::dasherize product.offers.to_xml
end

# Get Benefits for an existing Product
get '/products/:id/benefits' do
  product = Product.get(params[:id])
  DataMapper::Inflector::dasherize product.benefits.to_xml
end

# Get Features for an existing Product
get '/products/:id/features' do
  product = Product.get(params[:id])
  DataMapper::Inflector::dasherize product.features.to_xml
end
