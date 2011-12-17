require 'rubygems'
require 'sinatra'
require "dm-core"
require "dm-serializer"
require "json"


before do
  content_type 'application/xml'
end

# Get offer list
get '/offers' do
  DataMapper::Inflector::dasherize Offer.all.to_xml
end

# Create a new Offer
get '/offers/new' do
  DataMapper::Inflector::dasherize Offer.new.to_xml
end

# Add a new Offer
post '/offers' do
  data = JSON.parse request.body.read
  offer = Offer.new
  offer.attributes = data
  if offer.save
    headers 'location' => '/offers/' + offer.id.to_s
    status 201
  else
    status 412
  end
end

# Get an existing Offer
get '/offers/:id' do
  DataMapper::Inflector::dasherize Offer.get(params[:id]).to_xml
end

# Update an existing Offer
put '/offers/:id' do
  data = JSON.parse request.body.read
  offer = Offer.get(params[:id])
  offer.attributes = data
  if offer.save
    status 201
    DataMapper::Inflector::dasherize offer.to_xml
  else
    status 412
  end
end

# Remove an existing Offer
delete '/offers/:id' do
  offer = Offer.get(params[:id])
  offer.destroy
end

# Get Products for an existing Offer
get '/offers/:id/products' do
  offer = Offer.get(params[:id])
  DataMapper::Inflector::dasherize offer.products.to_xml
end
