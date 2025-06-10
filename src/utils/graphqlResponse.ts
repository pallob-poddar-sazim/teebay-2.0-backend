import { GraphQLError } from 'graphql';

const handleSuccess = (message: string, data?: object) => {
  return {
    success: true,
    message,
    data,
  };
};

const handleError = (error?: unknown) => {
  if (error instanceof GraphQLError) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: false,
    message: 'Internal Server Error',
  };
};

export { handleSuccess, handleError };
