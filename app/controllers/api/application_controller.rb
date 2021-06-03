class Api::ApplicationController < ApplicationController
  include AuthHelper
  respond_to :json
  helper_method :current_user
end
