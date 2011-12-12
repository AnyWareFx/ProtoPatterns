require 'rubygems'
require 'sinatra'
require "dm-core"
require "dm-serializer"


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
  customer = Customer.new
  customer.first_name = params[:first_name]
  customer.last_name = params[:last_name]
  if customer.save
    location '/customers/' + customer.id
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
  customer = Customer.get(params[:id])
  customer.first_name = params[:first_name]
  customer.last_name = params[:last_name]
  if customer.save
    status 201
  else
    status 412
  end
end

# Remove an existing Customer
delete '/customers/:id' do
  customer = Customer.get(params[:id])
  customer.destroy
end
