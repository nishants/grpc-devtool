Given that I have no idea where to begin from.

So, I will just try to add features, and later see how to connect the dots.



Todo

- [x] Add app-tests

- [x] In cucumber

  - [x] read annotations

- [ ] use spectron

  - [ ] run on ci

- [ ] use puppeteer in electron

- [ ] run cucumber+puppeteer tests for app on ci

- [ ] Create first feature

  ```gherkin
  Feature: First time user loads an existing project. Starts, records and watches a service.
  
  Scenario: Start an existing project from ui
  	Given I open app for the first time
    Then I should see option to load existing project
    When I open a project from filesystem
    Then I see project configuration
    When I choose start server
    Then It should serve the configured endpoints
    
  Scenario: Record for an existing project from ui
  	Given I open app for the first time
    Then I should see option to load existing project
    When I choose start in recorder mode
    Given The remote service is running
    Then It should record messages to remote server 
   
     
  Scenario: Watch grpc interactions in devtool
  	Given I open app for the first time
    Then I should see option to load existing project
    When I choose start in watcher mode
    Given The remote service is running
    Then It should show details of each grpc request
  
  Scenario: Watch grpc interactions for streams in devtool
  	Given I open app for the first time
    Then I should see option to load existing project
    When I choose start in watcher mode
    Given The remote service is running
    Then I should see details of an streaming endpoint as groups
    And I see each streaming endpoint call as a different group
  ```

  