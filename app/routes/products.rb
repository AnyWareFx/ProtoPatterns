require 'rubygems'
require 'sinatra'
require "dm-core"
require "dm-serializer"


before do
  content_type 'application/xml'
end

# Get product list
get '/products' do
  Product.all.to_xml
end

# Create a new Product
get '/products/new' do
  Product.new.to_xml
end

# Add a new Product
post '/products' do
  product = Product.new
  product.name = params[:name]
  product.description = params[:description]
  if product.save
    location '/products/' + product.id
    status 201
  else
    status 412
  end
end

# Get an existing Product
get '/products/:id' do
  Product.get(params[:id]).to_xml
end

# Update an existing Product
put '/products/:id' do
  product = Product.get(params[:id])
  product.name = params[:name]
  product.description = params[:description]
  if product.save
    status 201
  else
    status 412
  end
end

# Remove an existing Product
delete '/products/:id' do
  product = Product.get(params[:id])
  product.destroy
end
