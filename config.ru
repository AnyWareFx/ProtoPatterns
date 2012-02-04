require 'rubygems'
require 'sinatra/base'
require 'data_mapper'
require 'dm-types'
require 'dm-constraints'
require 'dm-serializer'
require 'json'


require './app'
require './app/models/models'


#################################################
#
# Setup DataMapper, and initialize the database
#
DataMapper::Logger.new $stdout, :debug
DataMapper.setup :default, ENV['DATABASE_URL']
DataMapper.finalize

load    'irb/init_db.rb'


#################################################
#
# If we're in our development environment
# startup WEBrick
#
if ENV['RACK_ENV'] == 'development'

  require 'webrick'

  options = {
      :Port => 3000,
      :Logger => WEBrick::Log::new($stderr, WEBrick::Log::DEBUG),
      :DocumentRoot => "public"
  }
  Rack::Handler::WEBrick.run ProtoDemo::App, options

else

  run ProtoDemo::App

end
