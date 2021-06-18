require 'simplecov'
require 'sidekiq/testing'
SimpleCov.start

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

class ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods
  include AuthHelper
  include ActionMailer::TestHelper
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  Sidekiq::Testing.inline!
  # Add more helper methods to be used by all tests here...
end
