import Translate, {
  TranslateEngine,
  LookUpOptions,
  LookUpResult,
} from '@wordway/translate-api';

import { toLookUpResult } from './converts';

class CloudoptAIEngine extends TranslateEngine {
  get name(): string {
    return 'cloudoptai';
  }

  get scopes(): string[] {
    return ['word', 'phrase'];
  }

  lookUp(
    q: string,
    options?: LookUpOptions | undefined
  ): Promise<LookUpResult> {
    return new Promise((resolve, reject) => {
      const successCallback = async (response: any) => {
        const originData = await response.json();
        resolve(toLookUpResult(this, q, options, originData));
      };
      const failureCallback = (error: any) => reject(error);

      Translate.overrides
        .fetch(`https://ai.cloudopt.net/api/v1/dict/${encodeURIComponent(q)}`)
        .then(successCallback)
        .catch(failureCallback);
    });
  }
}

export default CloudoptAIEngine;
