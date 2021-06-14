class UserMailer < ApplicationMailer
    def task_created
      user = params[:user]
  
      mail(from: 'noreply@taskmanager.com', to: user.email)
    end
  end