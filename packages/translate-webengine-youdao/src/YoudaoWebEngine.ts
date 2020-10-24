import Translate, {
  TranslateEngine,
  LookUpOptions,
  LookUpResult,
} from '@wordway/translate-api';

import { toLookUpResult } from './converts';

class YoudaoWebEngine extends TranslateEngine {
  get name(): string {
    return 'youdao-web';
  }

  get scopes(): string[] {
    return ['word', 'phrase', 'sentence'];
  }

  lookUp(
    q: string,
    options?: LookUpOptions | undefined
  ): Promise<LookUpResult> {
    return new Promise((resolve, reject) => {
      const successCallback = async (response: any) => {
        const originData = await response.text();

        let lookUpResult: LookUpResult = toLookUpResult(
          this,
          q,
          options,
          originData
        );

        const resp = await Translate.overrides.fetch(
          `https://picdict.youdao.com/search?le=en&q=${encodeURIComponent(q)}`
        );

        lookUpResult.images =
          JSON.parse(await resp.text())?.data?.pic?.map((e: any) => e.url) ||
          [];

        resolve(lookUpResult);
      };
      const failureCallback = (error: any) => reject(error);

      Translate.overrides
        .fetch(`https://dict.youdao.com/w/${encodeURIComponent(q)}`)
        .then(successCallback)
        .catch(failureCallback);
    });
  }
}

export default YoudaoWebEngine;
