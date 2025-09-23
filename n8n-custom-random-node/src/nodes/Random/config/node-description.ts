import { INodeTypeDescription } from 'n8n-workflow';
import { NODE_METADATA } from './constants';
import { nodeProperties } from './node-properties';

/**
 * Descrição completa do tipo de nó Random
 */
export const nodeDescription: INodeTypeDescription = {
	displayName: NODE_METADATA.DISPLAY_NAME,
	name: NODE_METADATA.NAME,
	icon: NODE_METADATA.ICON,
	group: ['transform'],
	version: NODE_METADATA.VERSION,
	subtitle: '={{$parameter["operation"]}}',
	description: NODE_METADATA.DESCRIPTION,
	defaults: {
		name: NODE_METADATA.DISPLAY_NAME,
	},
	inputs: ['main'],
	outputs: ['main'],
	properties: nodeProperties,
};