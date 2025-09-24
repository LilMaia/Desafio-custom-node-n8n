import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { nodeDescription } from './config/node-description';
import { SimpleExecutor } from './executors/SimpleExecutor';

/**
 * Nó Random para n8n
 * 
 * Gera números verdadeiramente aleatórios usando a API do Random.org.
 */
export class Random implements INodeType {
	description: INodeTypeDescription = nodeDescription;

	/**
	 * Executa a operação do nó
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await SimpleExecutor.execute(this);
	}
}