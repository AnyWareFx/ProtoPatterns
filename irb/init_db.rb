DataMapper.auto_migrate!

# Seed data for testing
# Create Products
[
    {
        :name => "ActionPlanFx",
        :unit_cost => 10.00,
        :benefits => [{
            :name => "Task Dependencies",
            :description => "By specifying task dependencies..."
        }, {
            :name => "Multiple Views",
            :description => "Along with familiar Calendar and Gannt Chart views, ActionPlanFx also provides and intuitive Task Dependency Graph"
        }],
        :features => [{
            :name => "Calendar View",
            :description => "View by year, month, week or day..."
        }, {
            :name => "Gantt Chart",
            :description => "The Gantt Chart view provides a familiar perspective..."
        }, {
            :name => "Task Dependency Graph",
            :description => "The innovative Task Dependency Graph..."
        }]
    }, {
        :name => "DrawFx",
        :unit_cost => 5.00,
        :benefits => [{
            :name => "Simple",
            :description => ""
        }, {
            :name => "Extensible",
            :description => ""
        }, {
            :name => "Flexible Licenses",
            :description => "Don't need to share? Install the Desktop Edition..."
        }],
        :features => [{
            :name => "Vector and Raster Rendering",
            :description => ""
        }]
    }, {
        :name => "BusinessToolsFx",
        :unit_cost => 25.00,
        :benefits => [{
            :name => "Cost Savings",
            :description => ""
        }, {
            :name => "Flexible Plans",
            :description => ""
        }],
        :features => [{
            :name => "Resource Manager",
            :description => ""
        }, {
            :name => "Information Manager",
            :description => ""
        }, {
            :name => "Product Manager",
            :description => ""
        }, {
            :name => "Service Manager",
            :description => ""
        }, {
            :name => "Marketing Manager",
            :description => ""
        }, {
            :name => "Sales Manager",
            :description => ""
        }, {
            :name => "Account Manager",
            :description => ""
        }, {
            :name => "Purchasing Manager",
            :description => ""
        }, {
            :name => "Receiving Manager",
            :description => ""
        }, {
            :name => "Inventory Manager",
            :description => ""
        }, {
            :name => "Production Manager",
            :description => ""
        }, {
            :name => "Shipping Manager",
            :description => ""
        }, {
            :name => "Support Manager",
            :description => ""
        }]
    }

].each do |product_spec|

  product = ProtoDemo::Product.create :name => product_spec[:name],
                                      :unit_cost => product_spec[:unit_cost]

  product_spec[:benefits].each do |benefit_spec|
      product.benefits.create :name => benefit_spec[:name],
                              :description => benefit_spec[:description]
  end

  product_spec[:features].each do |feature_spec|
      product.features.create :name => feature_spec[:name],
                              :description => feature_spec[:description]
  end

end


# Create Offers
[
    {
        :name => "DrawFx Free Trial",
        :unit_price => 1.00,
        :products => [{
            :name => "DrawFx"
        }]
    }, {
        :name => "DrawFx Desktop Starter",
        :unit_price => 20.00,
        :products => [{
            :name => "DrawFx"
        }]
    }, {
        :name => "DrawFx Hosted Starter",
        :unit_price => 5.00,
        :products => [{
            :name => "DrawFx"
        }]
    }, {
        :name => "ActionPlanFx Free Trial",
        :unit_price => 1.00,
        :products => [{
            :name => "ActionPlanFx"
        }]
    }, {
        :name => "ActionPlanFx Desktop Starter",
        :unit_price => 100.00,
        :products => [{
            :name => "ActionPlanFx"
        }]
    }, {
        :name => "ActionPlanFx Hosted Starter",
        :unit_price => 10.00,
        :products => [{
            :name => "ActionPlanFx"
        }]
    }, {
        :name => "BusinessToolsFx Free Trial",
        :unit_price => 1.00,
        :products => [{
            :name => "BusinessToolsFx"
        }]
    }, {
        :name => "BusinessToolsFx Desktop Starter",
        :unit_price => 150.00,
        :products => [{
            :name => "BusinessToolsFx"
        }]
    }, {
        :name => "BusinessToolsFx Hosted Starter",
        :unit_price => 50.00,
        :products => [{
            :name => "BusinessToolsFx"
        }]
    }, {
        :name => "WebWareFx Hosted Bundle",
        :unit_price => 150.00,
        :products => [{
            :name => "DrawFx"
        }, {
            :name => "ActionPlanFx"
        }, {
            :name => "BusinessToolsFx"
        }]
    }

].each do |offer_spec|

  offer = ProtoDemo::Offer.create :name => offer_spec[:name],
                                  :unit_price => offer_spec[:unit_price]

  offer_spec[:products].each do |product_spec|
      product = ProtoDemo::Product.first :name => product_spec[:name]
      product.product_offers.create :offer => offer
  end

end


# Create Customers & Shopping Carts
[
    {
        :first_name => "Dave",
        :last_name => "Jackson",
        :address_1 => "330 W 9th St.",
        :address_2 => "PD-06",
        :city => "Kansas City",
        :state => "MO",
        :zip => "64105",
        :cart => {
            :order_total => 22.00,
            :items => [{
                :name => "ActionPlanFx Desktop Starter",
                :units => 2,
                :item_total => 200.00
            }, {
                :name => "DrawFx Free Trial",
                :units => 1,
                :item_total => 1.00
            }]
        }
    }, {
        :first_name => "Lucas",
        :last_name => "Thomas",
        :address_1 => "330 W 9th St.",
        :address_2 => "PD-06",
        :city => "Kansas City",
        :state => "MO",
        :zip => "64105",
        :cart => {
            :order_total => 15.00,
            :items => [{
                :name => "WebWareFx Hosted Bundle",
                :units => 1,
                :item_total => 150.00
            }]
        }
    }

].each do |customer_spec|

  customer = ProtoDemo::Customer.create  :first_name => customer_spec[:first_name],
                                         :last_name => customer_spec[:last_name],
                                         :address_1 => customer_spec[:address_1],
                                         :address_2 => customer_spec[:address_2],
                                         :city => customer_spec[:city],
                                         :state => customer_spec[:state],
                                         :zip => customer_spec[:zip]

  cart_spec = customer_spec[:cart]
  cart = ProtoDemo::ShoppingCart.create :customer => customer,
                                        :order_total => cart_spec[:order_total]

  cart_spec[:items].each do |item_spec|
      offer = ProtoDemo::Offer.first :name => item_spec[:name]
      cart.items.create :offer => offer,
                        :units => item_spec[:units],
                        :item_total => item_spec[:item_total]
  end

end
