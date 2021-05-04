class Task < ApplicationRecord
  state_machine initial: :new_task do
    event :archive do
      transition new_task: :archived, released: :archived
    end

    event :start_developing do
      transition new_task: :in_development
    end

    event :start_testing do
      transition in_development: :in_qa
    end

    event :return_to_developing do
      transition in_qa: :in_development, in_code_review: :in_development
    end

    event :start_reviewing do
      transition in_qa: :in_code_review
    end

    event :pre_releasing do
      transition in_code_review: :ready_for_release
    end

    event :releasing do
      transition ready_for_release: :released
    end
  end

  belongs_to :author, class_name: 'User'
  belongs_to :assignee, class_name: 'User', optional: true

  validates :name, presence: true
  validates :description, presence: true
  validates :author, presence: true
  validates :description, length: { maximum: 500 }
end
