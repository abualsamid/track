
export const handler = async (event, context) => {
  console.log(event)
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v2.0! ${{ time: 1, copy: 'Your function executed successfully!'}}`,
      event
    }),
  };
};
