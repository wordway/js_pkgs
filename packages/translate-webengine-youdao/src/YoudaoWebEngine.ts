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

  async lookUp(
    q: string,
    options?: LookUpOptions | undefined
  ): Promise<LookUpResult> {
    const fetch = Translate.overrides.fetch;

    let lookUpResult: LookUpResult;
    try {
      const r1 = await fetch(
        `https://dict.youdao.com/w/${encodeURIComponent(q)}`
      );
      lookUpResult = toLookUpResult(this, q, options, await r1.text());

      try {
        const r2 = await fetch(
          `https://picdict.youdao.com/search?le=en&q=${encodeURIComponent(q)}`
        );
        const r2json = await r2.json();
        lookUpResult.images = r2json?.data?.pic?.map((e: any) => e.url);
      } catch (_) {
        // skip
      }
    } catch (error) {
      throw error;
    }

    return lookUpResult;
  }
}

export default YoudaoWebEngine;
