%w(customer offer product product_offer).each do |model|
  require "#{File.dirname(__FILE__)}/#{model}"
end


