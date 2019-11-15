
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tfconv from '@tensorflow/tfjs-converter';
import * as tf from '@tensorflow/tfjs-core';

const BASE_PATH =
    'https://storage.googleapis.com/tfjs-models/savedmodel/universal_sentence_encoder/';

export async function load(threshold: number, toxicityLabels: string[]) {
    const model = new ToxicityClassifier(threshold, toxicityLabels);
    await model.load();
    return model;
  }
  
  export class ToxicityClassifier {
    private tokenizer: use.Tokenizer;
    private model: tfconv.GraphModel;
    private labels: string[];
    private threshold: number;
    private toxicityLabels: string[];
  
    constructor(threshold = 0.85, toxicityLabels: string[] = []) {
      this.threshold = threshold;
      this.toxicityLabels = toxicityLabels;
    }
  
    async loadModel() {
      return tfconv.loadGraphModel(`${BASE_PATH}model.json`);
      //return use.load();
    }
  
    async loadTokenizer() {
      return use.loadTokenizer();
    }
  
    async load() {
      const [model, tokenizer] =
          await Promise.all([this.loadModel(), this.loadTokenizer()]);
  
      this.model = model;
      this.tokenizer = tokenizer;
  
      console.log(model)

      this.labels =
          model.outputs.map((d: {name: string}) => d.name.split('/')[0]);
  
      if (this.toxicityLabels.length === 0) {
        this.toxicityLabels = this.labels;
      } else {
        tf.util.assert(
            this.toxicityLabels.every(d => this.labels.indexOf(d) > -1),
            () => `toxicityLabels argument must contain only items from the ` +
                `model heads ${this.labels.join(', ')}, ` +
                `got ${this.toxicityLabels.join(', ')}`);
      }
    }
  
    /**
     * Returns an array of objects, one for each label, that contains
     * the raw probabilities for each input along with the final prediction
     * boolean given the threshold. If a prediction falls below the threshold,
     * `null` is returned.
     *
     * @param inputs A string or an array of strings to classify.
     */
    async classify(inputs: string[]|string): Promise<Array<{
      label: string,
      results: Array<{probabilities: Float32Array, match: boolean}>
    }>> {
      if (typeof inputs === 'string') {
        inputs = [inputs];
      }
  
      const encodings = inputs.map(d => this.tokenizer.encode(d));
      // TODO: revive once the model is robust to padding
      // const encodings = inputs.map(d => padInput(this.tokenizer.encode(d)));
  
      const indicesArr =
          encodings.map((arr, i) => arr.map((d, index) => [i, index]));
  
      let flattenedIndicesArr: Array<[number, number]> = [];
      for (let i = 0; i < indicesArr.length; i++) {
        flattenedIndicesArr =
            flattenedIndicesArr.concat(indicesArr[i] as Array<[number, number]>);
      }
  
      const indices = tf.tensor2d(
          flattenedIndicesArr, [flattenedIndicesArr.length, 2], 'int32');
      const values = tf.tensor1d(tf.util.flatten(encodings) as number[], 'int32');
  
      const labels = await this.model.executeAsync(
          {Placeholder_1: indices, Placeholder: values});
  
      indices.dispose();
      values.dispose();
  
      return (labels as tf.Tensor2D[])
          .map((d: tf.Tensor2D, i: number) => ({data: d, headIndex: i}))
          .filter(
              (d: {headIndex: number}) =>
                  this.toxicityLabels.indexOf(this.labels[d.headIndex]) > -1)
          .map((d: {headIndex: number, data: tf.Tensor2D}) => {
            const prediction = d.data.dataSync() as Float32Array;
            const results = [];
            for (let input = 0; input < inputs.length; input++) {
              const probabilities = prediction.slice(input * 2, input * 2 + 2);
              let match = null;
  
              if (Math.max(probabilities[0], probabilities[1]) > this.threshold) {
                match = probabilities[0] < probabilities[1];
              }
  
              results.push({probabilities, match});
            }
  
            return {label: this.labels[d.headIndex], results};
          });
    }
}
