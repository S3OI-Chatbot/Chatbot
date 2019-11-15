import { Component } from '@angular/core';

import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs-core';
import {interpolateReds} from 'd3-scale-chromatic';
import { ToxicityClassifier } from './toxicity-classifier';

const sentences = [
  'I like my phone.', 'Your cellphone looks great.', 'How old are you?',
  'What is your age?', 'An apple a day, keeps the doctors away.',
  'Eating strawberries is healthy.', 'My computer is amazing'
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

	tc: ToxicityClassifier = new ToxicityClassifier();
	async test() {
		console.log("loading classifier")
		await this.tc.load();
		console.log("done loading classifier")
		console.log("predicting fuck you")
		var prediction = await this.tc.classify("fuck you")
		console.log("done predicting")
		console.log(prediction)
	}

	constructor(){
		this.init();
		this.test();
	}

	init = async function() {
		const model = await use.load();
		//document.getElementById('#loading').style.display = 'none';
		this.renderSentences();
	  
		const embeddings = await model.embed(sentences) as tf.Tensor2D;
	  
		const matrixSize = 250;
		const cellSize = matrixSize / sentences.length;
		const canvas = document.querySelector('canvas');
		canvas.width = matrixSize;
		canvas.height = matrixSize;
	  
		const ctx = canvas.getContext('2d');
	  
		const xLabelsContainer = document.querySelector('.x-axis');
		const yLabelsContainer = document.querySelector('.y-axis');
	  
		for (let i = 0; i < sentences.length; i++) {
		  const labelXDom = document.createElement('div');
		  const labelYDom = document.createElement('div');
	  
		  labelXDom.textContent = "" + i + 1;
		  labelYDom.textContent = "" + i + 1;
		  labelXDom.style.left = (i * cellSize + cellSize / 2) + 'px';
		  labelYDom.style.top = (i * cellSize + cellSize / 2) + 'px';
	  
		  //xLabelsContainer.appendChild(labelXDom);
		  //yLabelsContainer.appendChild(labelYDom);
	  
		  for (let j = i; j < sentences.length; j++) {
			const sentenceI = embeddings.slice([i, 0], [1]);
			const sentenceJ = embeddings.slice([j, 0], [1]);
			const sentenceITranspose = false;
			const sentenceJTransepose = true;
			const score =
				sentenceI.matMul(sentenceJ, sentenceITranspose, sentenceJTransepose)
					.dataSync();
	  
			ctx.fillStyle = interpolateReds(score);
			ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
			ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
		  }
		}

		embeddings.asScalar().print();

	}
	
	renderSentences = () => {
		sentences.forEach((sentence, i) => {
			const sentenceDom = document.createElement('div');
			sentenceDom.textContent = `${i + 1}) ${sentence}`;
			document.querySelector('#sentences-container').appendChild(sentenceDom);
		});
	  };


	//   async classify(inputs: string[]|string): Promise<Array<{
	// 	label: string,
	// 	results: Array<{probabilities: Float32Array, match: boolean}>
	//   }>> {
	// 	if (typeof inputs === 'string') {
	// 	  inputs = [inputs];
	// 	}
	
	// 	const encodings = inputs.map(d => this.tokenizer.encode(d));
	// 	// TODO: revive once the model is robust to padding
	// 	// const encodings = inputs.map(d => padInput(this.tokenizer.encode(d)));
	
	// 	const indicesArr =
	// 		encodings.map((arr, i) => arr.map((d, index) => [i, index]));
	
	// 	let flattenedIndicesArr: Array<[number, number]> = [];
	// 	for (let i = 0; i < indicesArr.length; i++) {
	// 	  flattenedIndicesArr =
	// 		  flattenedIndicesArr.concat(indicesArr[i] as Array<[number, number]>);
	// 	}
	
	// 	const indices = tf.tensor2d(
	// 		flattenedIndicesArr, [flattenedIndicesArr.length, 2], 'int32');
	// 	const values = tf.tensor1d(tf.util.flatten(encodings) as number[], 'int32');
	
	// 	const labels = await this.model.executeAsync(
	// 		{Placeholder_1: indices, Placeholder: values});
	
	// 	indices.dispose();
	// 	values.dispose();
	
	// 	return (labels as tf.Tensor2D[])
	// 		.map((d: tf.Tensor2D, i: number) => ({data: d, headIndex: i}))
	// 		.filter(
	// 			(d: {headIndex: number}) =>
	// 				this.toxicityLabels.indexOf(this.labels[d.headIndex]) > -1)
	// 		.map((d: {headIndex: number, data: tf.Tensor2D}) => {
	// 		  const prediction = d.data.dataSync() as Float32Array;
	// 		  const results = [];
	// 		  for (let input = 0; input < inputs.length; input++) {
	// 			const probabilities = prediction.slice(input * 2, input * 2 + 2);
	// 			let match = null;
	
	// 			if (Math.max(probabilities[0], probabilities[1]) > this.threshold) {
	// 			  match = probabilities[0] < probabilities[1];
	// 			}
	
	// 			results.push({probabilities, match});
	// 		  }
	
	// 		  return {label: this.labels[d.headIndex], results};
	// 		});
	//   }
	
}
