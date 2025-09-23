import { NodeOperationError } from 'n8n-workflow';

export enum ErrorType {
	VALIDATION_ERROR = 'VALIDATION_ERROR',
	API_ERROR = 'API_ERROR',
	NETWORK_ERROR = 'NETWORK_ERROR',
	PARSING_ERROR = 'PARSING_ERROR',
	UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface IErrorDetails {
	type: ErrorType;
	message: string;
	originalError?: any;
	context?: Record<string, any>;
}

export class RandomNodeError extends Error {
	public readonly type: ErrorType;
	public readonly originalError?: any;
	public readonly context?: Record<string, any>;

	constructor(details: IErrorDetails) {
		super(details.message);
		this.name = 'RandomNodeError';
		this.type = details.type;
		this.originalError = details.originalError;
		this.context = details.context;
	}
}

export class ErrorHandler {
	static createValidationError(message: string, context?: Record<string, any>): RandomNodeError {
		return new RandomNodeError({
			type: ErrorType.VALIDATION_ERROR,
			message,
			context,
		});
	}

	static createApiError(message: string, originalError?: any, context?: Record<string, any>): RandomNodeError {
		return new RandomNodeError({
			type: ErrorType.API_ERROR,
			message,
			originalError,
			context,
		});
	}

	static createNetworkError(message: string, originalError?: any, context?: Record<string, any>): RandomNodeError {
		return new RandomNodeError({
			type: ErrorType.NETWORK_ERROR,
			message,
			originalError,
			context,
		});
	}

	static createParsingError(message: string, originalError?: any, context?: Record<string, any>): RandomNodeError {
		return new RandomNodeError({
			type: ErrorType.PARSING_ERROR,
			message,
			originalError,
			context,
		});
	}

	static handleError(error: any, node: any, itemIndex?: number): NodeOperationError {
		if (error instanceof RandomNodeError) {
			return new NodeOperationError(
				node,
				`${error.type}: ${error.message}`,
				{ itemIndex }
			);
		}

		if (error instanceof NodeOperationError) {
			return error;
		}

		// Generic error handling
		return new NodeOperationError(
			node,
			error instanceof Error ? error.message : 'Unknown error occurred',
			{ itemIndex }
		);
	}

	static isRetryableError(error: RandomNodeError): boolean {
		return error.type === ErrorType.NETWORK_ERROR || error.type === ErrorType.API_ERROR;
	}
}