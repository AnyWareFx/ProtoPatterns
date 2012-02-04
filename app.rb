require 'rubygems'
require 'sinatra/base'

%w(routes customers offers products).each do |route|
  require "#{File.dirname(__FILE__)}/app/routes/#{route}"
end


module ProtoDemo

  class App < Sinatra::Base
    use ProtoDemo::Customers
    use ProtoDemo::Offers
    use ProtoDemo::Products

    get '/' do
      redirect 'index.html'
    end
  end
  
end