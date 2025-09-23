import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { nodeDescription } from './config/node-description';
import { NodeExecutor } from './executors/NodeExecutor';

/**
 * Implementação do nó Random para n8n
 * 
 * Este nó gera números verdadeiramente aleatórios usando a API do Random.org.
 * Utiliza padrões de design para facilitar manutenção e extensibilidade.
 */
export class Random implements INodeType {
	description: INodeTypeDescription = nodeDescription;

	/**
	 * Executa as operações do nó
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await NodeExecutor.execute(this);
	}
}