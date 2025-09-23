export interface IRandomResponseData {
	result: number;
	min: number;
	max: number;
	timestamp: string;
	poweredBy?: string;
	type?: string;
	metadata?: Record<string, any>;
	executionTime?: number;
	source?: string;
}

export class RandomResponseBuilder {
	private responseData: Partial<IRandomResponseData> = {};

	constructor() {
		this.reset();
	}

	reset(): RandomResponseBuilder {
		this.responseData = {
			timestamp: new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC'),
		};
		return this;
	}

	setResult(result: number): RandomResponseBuilder {
		this.responseData.result = result;
		return this;
	}

	setRange(min: number, max: number): RandomResponseBuilder {
		this.responseData.min = min;
		this.responseData.max = max;
		return this;
	}

	setPoweredBy(poweredBy: string): RandomResponseBuilder {
		this.responseData.poweredBy = poweredBy;
		return this;
	}

	setType(type: string): RandomResponseBuilder {
		this.responseData.type = type;
		return this;
	}

	setMetadata(metadata: Record<string, any>): RandomResponseBuilder {
		this.responseData.metadata = metadata;
		return this;
	}

	setExecutionTime(executionTime: number): RandomResponseBuilder {
		this.responseData.executionTime = executionTime;
		return this;
	}

	setSource(source: string): RandomResponseBuilder {
		this.responseData.source = source;
		return this;
	}

	addMetadataField(key: string, value: any): RandomResponseBuilder {
		if (!this.responseData.metadata) {
			this.responseData.metadata = {};
		}
		this.responseData.metadata[key] = value;
		return this;
	}

	build(): IRandomResponseData {
		if (this.responseData.result === undefined) {
			throw new Error('Result is required');
		}
		if (this.responseData.min === undefined || this.responseData.max === undefined) {
			throw new Error('Min and max values are required');
		}
		
		return { ...this.responseData } as IRandomResponseData;
	}

	static create(): RandomResponseBuilder {
		return new RandomResponseBuilder();
	}
}