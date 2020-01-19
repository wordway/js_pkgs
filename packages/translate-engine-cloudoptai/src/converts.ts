import {
  TranslateEngine,
  LookUpOptions,
  LookUpResult,
} from '@wordway/translate-api';

const toLookUpResult = (
  engine: TranslateEngine,
  q: string,
  options: LookUpOptions | undefined,
  originData: any
): LookUpResult => {
  let word;
  let definitions;
  let ukIpa, ukPronunciationUrl;
  let usIpa, usPronunciationUrl;
  let tenses;
  let sourceText, sourceAudioUrl;
  let targetText, targetAudioUrl;

  const { result } = originData;

  if (!!result?.word) {
    word = result.word;
  }

  if (!!result?.translation) {
    definitions = result.translation.map((v: any) => {
      const dotIndex = v.indexOf('. ');
      const type = dotIndex >= 0 ? v.substr(0, dotIndex + 1) : undefined;
      const value = dotIndex >= 0 ? v.substr(dotIndex + 2) : v;
      const values = value.split('；');

      return { type, values };
    });

    ukIpa = result?.phonetic[0];
    ukPronunciationUrl = result?.audio[0].replace('http://', 'https://');
    usIpa = result?.phonetic[1];
    usPronunciationUrl = result?.audio[1].replace('http://', 'https://');

    if (!!result?.exchange) {
      tenses = result.exchange
        .filter((v: any) => v.state !== '1')
        .map((v: any) => {
          const map: any = {
            "p": "过去式",
            "d": "过去分词",
            "i": "现在分词",
            "3": "第三人称单数",
            "r": "比较级",
            "t": "最高级",
            "s": "复数",
            "0": "原型",
          };

          const {
            state, word: value,
          } = v;

          const name = map[state];
          const values = [value];

          return { name, values };
        });
    }
  }

  let lookUpResult: LookUpResult = {
    engine: engine.name,
    word,
    definitions,
    ukIpa,
    ukPronunciationUrl,
    usIpa,
    usPronunciationUrl,
    tenses,
    sourceText,
    sourceAudioUrl,
    targetText,
    targetAudioUrl,
    originData,
  };

  if (!word && !sourceText) {
    throw Error(`没有找到与 ${q} 相关的结果。`);
  }

  if ((options?.exclude || []).indexOf('originData') >= 0) {
    delete lookUpResult.originData;
  }
  return lookUpResult;
};

export { toLookUpResult };
