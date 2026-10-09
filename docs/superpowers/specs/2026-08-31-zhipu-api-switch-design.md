# Switch Chat Provider to Zhipu

## Scope

Change the existing LangChain chat model configuration from DeepSeek to Zhipu
without changing the prompt chain or output format.

## Configuration

- Read the API key from `ZHIPU_API_KEY` in `.env`.
- Use Zhipu's OpenAI-compatible endpoint:
  `https://open.bigmodel.cn/api/paas/v4/`.
- Use the `glm-4-flash` model.

## Verification

Run `node index.js` and confirm that the request reaches Zhipu and returns
generated interview questions. Authentication or provider errors should be
reported by the existing error handler.
