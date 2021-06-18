class UserMailer < ApplicationMailer
  layout 'task_mailer'

  def task_created
    user = params[:user]
    @task = params[:task]

    mail(from: 'noreply@taskmanager.com', to: user.email, subject: 'New Task Created')
  end

  def task_updated
    @task = params[:task]

    mail(from: 'noreply@taskmanager.com', to: @task.author.email, subject: 'Task Updated')
  end

  def task_deleted
    user = params[:user]
    @task_id = params[:task_id]
    
    mail(from: 'noreply@taskmanager.com', to: user.email, subject: 'Task Deleted')
  end

  def forgot_password
    @user = params
    mail(from: 'noreply@taskmanager.com', to: @user.email, subject: 'Reset password instructions')
  end
end
