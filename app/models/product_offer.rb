module ProtoDemo

  class ProductOffer
    include DataMapper::Resource

    belongs_to :product
    belongs_to :offer

    property :id,         Serial
    property :created_at, DateTime

    property :unit_price, Numeric
    property :units,      Numeric
  end

end

