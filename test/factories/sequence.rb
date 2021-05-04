FactoryBot.define do
  sequence(:string, aliases: [:first_name, :last_name, :password, :avatar, :name, :state]) do |n|
    "string#{n}"
  end

  sequence(:email) { |n| "person#{n}@example.com" }

  sequence(:type) { ['Developer', 'Manager', 'Admin'].sample }

  sequence(:description) { |n| "description#{n}" }

  sequence(:expired_at) { Date.tomorrow }
end
