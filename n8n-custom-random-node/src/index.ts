import { Random } from './nodes/Random/Random.node';

// Exporta o nó principal
export { Random };

// Exporta a estrutura modular para uso externo se necessário
export * from './nodes/Random/config/constants';
export * from './nodes/Random/factories/OperationFactory';
export * from './nodes/Random/services/NodeServices';
export * from './nodes/Random/executors/NodeExecutor';