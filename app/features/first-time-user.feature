@onboarding
Feature: First time user loads an existing project. Starts, records and watches a service.

  @play @fixture("sample-one")
  Scenario: Start an existing project from ui
    Given I open app for the first time
    Then I should see option to load existing project
    When I open a project from filesystem
    Then I see project configuration
    When I choose start server
    Then It should serve the configured endpoints

  @record
  Scenario: Record for an existing project from ui
    Given I open app for the first time
    Then I should see option to load existing project
    When I open a project from filesystem
    Then I see project configuration
    When I choose start server
    Then It should serve the configured endpoints

