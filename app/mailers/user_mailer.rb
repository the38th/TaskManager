class UserMailer < ApplicationMailer
  def task_created
    user = params[:user]
    @task = params[:task]

    mail(from: 'noreply@taskmanager.com', to: user.email, subject: 'New Task Created')
  end

  def task_updated
    @task = params[:task]

    mail(from: 'noreply@taskmanager.com', to: @task.author.email, subject: 'Task Updated')
  end
end
