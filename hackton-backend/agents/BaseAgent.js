import logger from '../utils/logger.js';

/**
 * Base Agent Class
 * Standard interface for all agents
 */
export default class BaseAgent {
    constructor(name) {
        this.name = name;
    }

    async execute(input, context) {
        throw new Error('Method "execute" must be implemented');
    }

    log(message) {
        logger.info(message, this.name);
    }
}
