const EndpointTypes = require('../../src/proto/EndpointTypes');

describe('EndpointTypes.test.js', () => {

  const unary = {isStreamingRequest : () => false, isStreamingResponse : () => false};
  const responseStreaming = {isStreamingRequest : () => false, isStreamingResponse : () => true};
  const requestStreaming = {isStreamingRequest : () => true, isStreamingResponse : () => false};
  const bothWayStreaming = {isStreamingRequest : () => true, isStreamingResponse : () => true};

  test('EndpointTypes.getType should return type', () => {
    expect(EndpointTypes.getType(unary)).toBe(EndpointTypes.Unary);
    expect(EndpointTypes.getType(responseStreaming)).toBe(EndpointTypes.ServerStreaming);
    expect(EndpointTypes.getType(requestStreaming)).toBe(EndpointTypes.ClientStreaming);
    expect(EndpointTypes.getType(bothWayStreaming)).toBe(EndpointTypes.BothWayStreaming);
  });
});
