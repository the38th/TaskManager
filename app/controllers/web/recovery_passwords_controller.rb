class Web::RecoveryPasswordsController < Web::ApplicationController
  def create
    user = User.find_by_email(recovery_password_params[:email])
    user.send_password_reset if user
    redirect_to(new_session_path)
  end

  def edit
    @user = User.find_by_password_reset_token!(params[:id])
  end

  def update
    @user = User.find_by_password_reset_token!(params[:id])
    if @user.password_reset_sent_at < 24.hour.ago
      redirect_to(new_recovery_password_path)
    elsif @user.update(user_params)
      redirect_to(new_session_path)
    else
      render(:edit)
    end
  end

  private

  def user_params
    params.require(:admin).permit(:password)
  end

  def recovery_password_params
    params.require(:recovery_passwords).permit(:email)
  end
end
