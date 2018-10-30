# frozen_string_literal: true

class RemoveUnusedFieldsFromResources < ActiveRecord::Migration[4.2]
  def change
    remove_column :resources, :curriculum_directory, default: [], null: false, array: true
    remove_column :resources, :subject
  end
end
