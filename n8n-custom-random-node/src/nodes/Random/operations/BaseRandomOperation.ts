import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

export abstract class BaseRandomOperation {
	/**
	 * Template method that defines the algorithm structure
	 */
	async executeOperation(
		context: IExecuteFunctions,
		itemIndex: number,
		min: number,
		max: number
	): Promise<INodeExecutionData> {
		try {
			// Step 1: Validate parameters
			this.validateParameters(min, max, itemIndex, context);

			// Step 2: Generate random number
			const randomNumber = await this.generateRandomNumber(context, itemIndex, min, max);

			// Step 3: Create response data
			const responseData = this.createResponseData(randomNumber, min, max);

			// Step 4: Build execution data
			return this.buildExecutionData(responseData, itemIndex);
		} catch (error) {
			return this.handleError(error, itemIndex, context);
		}
	}

	/**
	 * Validate input parameters - can be overridden by subclasses
	 */
	protected validateParameters(
		min: number,
		max: number,
		itemIndex: number,
		context: IExecuteFunctions
	): void {
		if (min > max) {
			throw new NodeOperationError(
				context.getNode(),
				`Minimum value (${min}) cannot be greater than maximum value (${max})`,
				{ itemIndex }
			);
		}
	}

	/**
	 * Abstract method - must be implemented by subclasses
	 */
	protected abstract generateRandomNumber(
		context: IExecuteFunctions,
		itemIndex: number,
		min: number,
		max: number
	): Promise<number>;

	/**
	 * Create response data - can be overridden by subclasses
	 */
	protected createResponseData(randomNumber: number, min: number, max: number): Record<string, any> {
		return {
			result: randomNumber,
			min: min,
			max: max,
			timestamp: new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC'),
		};
	}

	/**
	 * Build execution data - can be overridden by subclasses
	 */
	protected buildExecutionData(responseData: Record<string, any>, itemIndex: number): INodeExecutionData {
		return {
			json: responseData,
			pairedItem: {
				item: itemIndex,
			},
		};
	}

	/**
	 * Handle errors - can be overridden by subclasses
	 */
	protected handleError(error: any, itemIndex: number, context: IExecuteFunctions): INodeExecutionData {
		if (context.continueOnFail()) {
			return {
				json: {
					error: error instanceof Error ? error.message : 'Unknown error occurred',
				},
				pairedItem: {
					item: itemIndex,
				},
			};
		}
		throw error;
	}
}