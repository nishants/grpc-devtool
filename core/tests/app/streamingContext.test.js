const appTestHelper = require('./appTestHelper');
const fixtures = require('../fixtures');

describe('app.js', () => {
  let app;

  beforeAll(async () => {
    app = await appTestHelper.launchApp({
      port: 50056,
      protosPath: fixtures.pricesProject.protosPath,
      configPath: fixtures.pricesProject.configPath,
    });
  });

  afterAll(async () => {
    await app.closeApp();
  });

  describe('Streaming context', () => {
    const timeout = 60000;

    test('should stop messages by streaming context', async () => {
      const requestId = "#request:9231";
      const expectedPriceMessage = {quote: "quote"};
      const expectedStopMessage = {quote: `${requestId} won't be streamed anymore`};

      // Create a streaming message
      const clientStream = await app.client.openPriceStream();
      await clientStream.sendMessage({uic: 501, assetType: 'Stock', requestId});

      // // wait for 1 sec and close streaming
      await new Promise(resolve => setTimeout(resolve, 1000));
      await clientStream.sendMessage({uic: 599, assetType: 'Stock', requestId});

      // Wait for another 1 sec to observer if any more messages were streamed
      await new Promise(resolve => setTimeout(resolve, 1000));
      clientStream.stop();
      const streamedMessages = await clientStream.getNext();

      // No messages must stream once the subscription is turned off
      // No message must follow stop message

      const lastMessage = streamedMessages.pop();
      const secondLastMessage = streamedMessages.pop();

      expect(secondLastMessage).toEqual(expectedPriceMessage);
      expect(lastMessage).toEqual(expectedStopMessage);
    });

  });
});
