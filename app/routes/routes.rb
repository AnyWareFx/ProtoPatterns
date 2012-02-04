module ProtoDemo

  class Routes < Sinatra::Base

    before do
      content_type 'application/xml'
    end

  end
end
