const Unary = 1;
const ServerStreaming = 2;
const ClientStreaming = 3;
const BothWayStreaming= 4;

module.exports = {
    Unary,
    ClientStreaming,
    ServerStreaming,
    BothWayStreaming,

    getType : (endpoint) => {
      const request = endpoint.isStreamingRequest();
      const response = endpoint.isStreamingResponse();

      return {
        'false-false' : Unary,
        'false-true' : ServerStreaming,
        'true-false' : ClientStreaming,
        'true-true' : BothWayStreaming,
      }[`${request}-${response}`];
    }
};