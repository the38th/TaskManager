class ApplicationController < ActionController::Base
  include AuthHelper
  respond_to :json
  helper_method :current_user
end
