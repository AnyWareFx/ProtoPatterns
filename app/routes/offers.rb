require 'rubygems'
require 'sinatra'

# Get offer list
get '/offers' do
  'Offer List'
end

# Create a new Offer
get '/offers/new' do
  'New Offer'
end

# Add a new Offer
post '/offers/' do
  'Add Offer'
end

# Get an existing Offer
get '/offers/:id' do
  'Get Offer'
end

# Update an existing Offer
put '/offers/:id' do
  'Update Offer'
end

# Remove an existing Offer
delete '/offers/:id' do
  'Delete Offer'
end
